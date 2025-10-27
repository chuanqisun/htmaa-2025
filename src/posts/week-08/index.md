---
title: "Week 8: Ground Control to Major Tom"
date: 2025-10-27
keywords: ["input", "microphone", "micro-controller"]
---

## Group Assignment

- Joined with [Typer](https://fab.cba.mit.edu/classes/863.25/people/TylerJensenHill/) and [Jacqueline](https://fab.cba.mit.edu/classes/863.25/people/JacquelineOrr/), to probe the photo transistor.
- Key finding is that the resting resistance is quite high, and covering the sensor with hand has only a modest effect.
- Shining a flashlight on the sensor causes a significant drop in resistance, confirming its sensitivity to light.
- To get more hands on experience, I probed the microphone breakout board.
- Wiring up the probes is tricky due to small soldering joints
- I couldn't find a clock signal generator in the lab, so I programmed the Xiao to initialize the I2S device
- This is the minimum code to drive the I2S device:

```cpp
// Simple I2S microphone CSV output
// Custom pinout: D0 = BCLK, D1 = DOUT, D2 = LRC

#include "AudioTools.h"

AudioInfo info(16000, 1, 16);  // 16kHz, mono, 16-bit
I2SStream i2sStream;
CsvOutput<int16_t> csvOutput(Serial);
StreamCopy copier(csvOutput, i2sStream);

void setup() {
  Serial.begin(115200);
  AudioToolsLogger.begin(Serial, AudioToolsLogLevel::Info);

  // Configure I2S for custom pinout
  auto cfg = i2sStream.defaultConfig(RX_MODE);
  cfg.copyFrom(info);
  cfg.pin_bck = D0;   // BCLK
  cfg.pin_data = D1;  // DOUT
  cfg.pin_ws = D2;    // LRC
  cfg.i2s_format = I2S_STD_FORMAT;

  i2sStream.begin(cfg);
  csvOutput.begin(info);
}

void loop() {
  copier.copy();
}
```

- Confirmed from serial plotter that the device was outputting data
- The software supports I2S/PCM protocol, but the decoding was not very useful

## Making a Wireless Microphone

- Speech recognition is a key component of my final project. I need to leverage this topic's input device topic to deep dive into the making of a wireless microphone.

### Networking Test with Sine Wave

- I started with Phil Schatzmann's examples in the Arduino Audio Tools library.
- First, I want to stream a basic sine wave over wifi. I took Phil's sample code as is, and confirmed that the sound working over wifi.
- I found that the antenna seems necessary for a stable connection. I had success in previous tests without using antenna, but for some reason, antenna became necessary in this setup.

```cpp
/**
 * @file streams-generator-server_wav.ino
 *
 * See: https://github.com/pschatzmann/arduino-audio-tools/blob/main/examples/examples-communication/http-server/streams-generator-webserver_wav/streams-generator-webserver_wav.ino
 * This sketch generates a test sine wave. The result is provided as WAV stream which can be listened to in a Web Browser
 *
 * @author Phil Schatzmann
 * @copyright GPLv3
 *
 */

#include "AudioTools.h"
#include "AudioTools/Communication/AudioHttp.h"

// WIFI
const char *ssid = "REPLACE_WITH_SSID";
const char *password = "REPLACE_WITH_REAL_PASSWORD";

AudioWAVServer server(ssid, password);

// Sound Generation
const int sample_rate = 10000;
const int channels = 1;

SineWaveGenerator<int16_t> sineWave;            // Subclass of SoundGenerator with max amplitude of 32000
GeneratedSoundStream<int16_t> in(sineWave);     // Stream generated from sine wave


void setup() {
  Serial.begin(115200);
  AudioLogger::instance().begin(Serial,AudioLogger::Info);

  // start server
  server.begin(in, sample_rate, channels);

  // start generation of sound
  sineWave.begin(channels, sample_rate, N_B4);
  in.begin();

  Serial.print("Will sleep");
  // sleep for 5 seconds first
  delay(5000);

  Serial.print("Server URL: http://");
  Serial.print(WiFi.localIP());
}


// copy the data
void loop() {
  server.copy();
}
```

### HTTP Streaming

- In this setup, the Micro-controller works as the server, exposing a WAV stream
- Computer works as the client, receiving and playing the WAV stream

```cpp
#include "AudioTools.h"
#include "AudioTools/Communication/AudioHttp.h"

// WiFi credentials
const char *ssid = "REPLACE_WITH_SSID";
const char *password = "REPLACE_WITH_PASSWORD";

// I2S and Audio
AudioInfo info(22000, 1, 16);  // 22kHz, mono, 16-bit
I2SStream i2sStream;           // Access I2S as stream
ConverterFillLeftAndRight<int16_t> filler(LeftIsEmpty);
AudioWAVServer server(ssid, password);

void setup() {
  Serial.begin(115200);
  delay(100);
  AudioLogger::instance().begin(Serial, AudioLogger::Info);

  // Connect to WiFi
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to WiFi");
    return;
  }

  Serial.println("\nWiFi connected!");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());

  Serial.println("Starting I2S...");
  auto cfg = i2sStream.defaultConfig(RX_MODE);
  cfg.copyFrom(info);
  cfg.pin_bck = D0;   // BCLK
  cfg.pin_data = D1;  // DOUT
  cfg.pin_ws = D2;    // LRC
  cfg.i2s_format = I2S_STD_FORMAT;

  if (!i2sStream.begin(cfg)) {
    Serial.println("Failed to initialize I2S");
    return;
  }
  Serial.println("I2S initialized successfully");

  // Start WAV server
  Serial.println("Starting WAV server...");
  server.begin(i2sStream, info, &filler);
  Serial.print("Server URL: http://");
  Serial.print(WiFi.localIP());
}

void loop() {
  server.copy();
}
```

Observation:

- The latency is inconsistent, from 1 second to 5 seconds
- The sound quality is also inconsistent, sometimes good, sometimes poor
- My suspicion is that the network condition affected the streaming performance

## MP3 encoder

- I want to test MP3 encoding so as to reduce the bandwidth usage and potentially improve robustness against network issues

```cpp
#include "AudioTools.h"
#include "AudioTools/AudioCodecs/CodecMP3LAME.h"
#include "AudioTools/Communication/AudioHttp.h"

// WiFi credentials
const char *ssid = "REPLACE_WITH_SSID";
const char *password = "REPLACE_WITH_PASSWORD";

// I2S and Audio
AudioInfo info(16000, 1, 16);  // 16kHz, mono, 16-bit
I2SStream i2sStream;           // Access I2S as stream
MP3EncoderLAME mp3;
AudioEncoderServer server(&mp3, ssid, password);

void setup() {
  Serial.begin(115200);
  delay(100);
  AudioLogger::instance().begin(Serial, AudioLogger::Info);

  // Connect to WiFi
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to WiFi");
    return;
  }

  Serial.println("\nWiFi connected!");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());

  // Configure I2S with custom pinout
  Serial.println("Starting I2S...");
  auto cfg = i2sStream.defaultConfig(RX_MODE);
  cfg.copyFrom(info);
  cfg.pin_bck = D0;   // BCLK
  cfg.pin_data = D1;  // DOUT
  cfg.pin_ws = D2;    // LRC
  cfg.i2s_format = I2S_STD_FORMAT;

  if (!i2sStream.begin(cfg)) {
    Serial.println("Failed to initialize I2S");
    return;
  }
  Serial.println("I2S initialized successfully");

  // Start MP3 server
  Serial.println("Starting MP3 server...");
  server.begin(i2sStream, info);
  Serial.print("Server URL: http://");
  Serial.print(WiFi.localIP());
}

void loop() {
  server.doLoop();
}
```

Running it caused this memory allocation error:

```txt
[Error] lame.c : 2792 - calloc(1,85840) -> 0x0
available MALLOC_CAP_8BIT: 114676 / MALLOC_CAP_32BIT: 114676  / MALLOC_CAP_SPIRAM: 0
```

It turns out MP3 encoding is quite memory intensive. While it may reduce network bandwidth usage, it does not fit the memory constraints of the ESP32.

## UDP Streaming Test with Sine Wave

- If I can't address the audio codec, can I tackle the network issue itself?
- Knowing the HTTP protocol has built-in error correction and guarantees delivery, relying on two-way communication, it may introduce significant overhead.
- UDP is a connectionless protocol that does not guarantee delivery, but it has lower latency and overhead.
- I don't worry about occasional packet loss in audio streaming, as it often goes unnoticed.
- Let's go back to basics, can I stream a sine wave over UDP?

```cpp

#include "AudioTools.h"
#include "AudioTools/Communication/UDPStream.h"


// WiFi credentials
const char *ssid = "REPLACE_WITH_SSID";
const char *password = "REPLACE_WITH_PASSWORD";


AudioInfo info(22000, 1, 16);
SineWaveGenerator<int16_t> sineWave(32000);
GeneratedSoundStream<int16_t> sound(sineWave);
UDPStream udp(ssid, password);
Throttle throttle(udp);
IPAddress udpAddress(192, 168, 41, 106);
const int udpPort = 8888;
StreamCopy copier(throttle, sound);

void setup() {
  Serial.begin(115200);
  AudioToolsLogger.begin(Serial, AudioToolsLogLevel::Info);

  sineWave.begin(info, N_B4);

  // Define udp address and port
  udp.begin(udpAddress, udpPort);

  auto cfg = throttle.defaultConfig();
  cfg.copyFrom(info);
  throttle.begin(cfg);

  Serial.println("started...");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Sending to: ");
  Serial.print(udpAddress);
  Serial.print(":");
  Serial.println(udpPort);
}

void loop() {
  copier.copy();
}
```

- The challenge with UDP is that it cannot be directly played in browser like HTTP streams.
- I need to implement a simple UDP client. I worked with javascript a lot, so I will go with Node.js:

```js
const dgram = require("dgram");
const { spawn } = require("child_process");

const SAMPLE_RATE = 22000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

const UDP_PORT = 8888;

const server = dgram.createSocket("udp4");

// FFmpeg process to play audio
let ffmpegPlayer = null;

// Statistics
let packetsReceived = 0;
let bytesReceived = 0;
let lastStatsTime = Date.now();

function startAudioPlayer() {
  console.log("Starting audio player...");

  // Use ffmpeg to play raw PCM audio
  ffmpegPlayer = spawn("ffmpeg", [
    "-f",
    "s16le", // signed 16-bit little-endian
    "-ar",
    SAMPLE_RATE.toString(), // sample rate
    "-ac",
    CHANNELS.toString(), // channels
    "-i",
    "pipe:0", // input from stdin
    "-f",
    "alsa", // Use ALSA for Linux audio output
    "default", // Default audio output device
  ]);

  ffmpegPlayer.stderr.on("data", (data) => {
    // ffmpeg outputs info to stderr, only log errors
    const message = data.toString();
    if (message.includes("error") || message.includes("Error")) {
      console.error("FFmpeg error:", message);
    }
  });

  ffmpegPlayer.on("error", (err) => {
    console.error("FFmpeg process error:", err);
  });

  ffmpegPlayer.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  console.log("✓ Audio player started");
}

// Handle incoming UDP packets
server.on("message", (msg, rinfo) => {
  if (!ffmpegPlayer) {
    startAudioPlayer();
  }

  // Write audio data to ffmpeg stdin
  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.write(msg);
  }

  // Update statistics
  packetsReceived++;
  bytesReceived += msg.length;

  // Log statistics every 5 seconds
  const now = Date.now();
  if (now - lastStatsTime > 5000) {
    const elapsed = (now - lastStatsTime) / 1000;
    const packetsPerSec = (packetsReceived / elapsed).toFixed(1);
    const kbytesPerSec = (bytesReceived / elapsed / 1024).toFixed(2);

    console.log(`Stats: ${packetsPerSec} packets/s, ${kbytesPerSec} KB/s from ${rinfo.address}:${rinfo.port}`);

    packetsReceived = 0;
    bytesReceived = 0;
    lastStatsTime = now;
  }
});

server.on("error", (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

server.on("listening", () => {
  const address = server.address();
  const interfaces = require("os").networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  console.log("\n==============================================");
  console.log("ESP32 Audio UDP Receiver");
  console.log("==============================================");
  console.log(`UDP Server listening on port ${address.port}`);
  console.log(`Sample Rate: ${SAMPLE_RATE} Hz`);
  console.log(`Channels: ${CHANNELS} (mono)`);
  console.log(`Bits per sample: ${BITS_PER_SAMPLE}`);
  console.log("\nListening on:");
  console.log(`  Local:   ${address.address}:${address.port}`);
  addresses.forEach((addr) => {
    console.log(`  Network: ${addr}:${address.port}`);
  });
  console.log("\nWaiting for ESP32 to send audio...");
  console.log("==============================================\n");
});

// Start UDP server
server.bind(UDP_PORT);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\nShutting down...");

  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.end();
    ffmpegPlayer.kill("SIGTERM");
  }

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

- This program receives audio data over UDP, and pipes it directly into FFmpeg.
- I confirmed the sine wave working

## UDP Microphone Streaming

- Next I modified the UDP server to stream i2s data into UDP
- UDP does not have flow control. The throttle pattern is recommended in the [AudioTools example](https://github.com/pschatzmann/arduino-audio-tools/blob/main/examples/examples-communication/udp/communication-udp-send/communication-udp-send.ino)

```cpp
#include "AudioTools.h"
#include "AudioTools/Communication/UDPStream.h"


// WiFi credentials
const char *ssid = "";
const char *password = "";

AudioInfo info(22000, 1, 16);  // 32kHz, mono, 16-bit
I2SStream i2sStream;           // Access I2S as stream
ConverterFillLeftAndRight<int16_t> filler(LeftIsEmpty); // fill both channels
UDPStream udp(ssid, password);
Throttle throttle(udp);
IPAddress udpAddress(192, 168, 41, 106);  // Broadcast address
const int udpPort = 8888;
StreamCopy copier(throttle, i2sStream);  // copies I2S microphone input into UDP

void setup() {
  Serial.begin(115200);
  delay(100);
  AudioToolsLogger.begin(Serial, AudioToolsLogLevel::Info);

  // Connect to WiFi
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to WiFi");
    return;
  }

  Serial.println("\nWiFi connected!");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());

  Serial.println("Starting I2S...");
  auto i2sCfg = i2sStream.defaultConfig(RX_MODE);
  i2sCfg.copyFrom(info);
  i2sCfg.pin_bck = D0;   // BCLK
  i2sCfg.pin_data = D1;  // DOUT
  i2sCfg.pin_ws = D2;    // LRC
  i2sCfg.i2s_format = I2S_STD_FORMAT;

  if (!i2sStream.begin(i2sCfg)) {
    Serial.println("Failed to initialize I2S");
    return;
  }
  Serial.println("I2S initialized successfully");

  // Define udp address and port
  udp.begin(udpAddress, udpPort);

  auto throttleCfg = throttle.defaultConfig();
  throttleCfg.copyFrom(info);
  throttle.begin(throttleCfg);

  Serial.println("Started streaming...");
  Serial.print("Sending to: ");
  Serial.print(udpAddress);
  Serial.print(":");
  Serial.println(udpPort);
}

void loop() {
  copier.copy();
}

```

- The Node.js side is unchanged. It will play the audio stream as before. This allowed me to evaluate the latency and compare it with the HTTP protocol version
- I was able to achieve much more consistent latency with 1-2 seconds delay
- On special occasions, I was able to achieve near real-time performance, but it's unclear how to reproduce it. I suspect it still depends on network condition.

## UDP packets streaming into Open AI transcription

- Next, I modified the Node.js code to transcribe the audio input.
- ffmpeg playback is for debugging only. It also provides an audible reference on where the latency is: is it before or during the transcription?
- The key design is to use a multi-part form data so as to stream audio chunks as soon as they are available.
- We don't have a way to delimit the audio stream. I used an arbitrary 5 seconds interval to send chunks.
- I verified that open ai is able to respond with the transcribed text.

```js
const dgram = require("dgram");
const { spawn } = require("child_process");

const SAMPLE_RATE = 22000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const UDP_PORT = 8888;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Make you set the environment variable with your own key
const TRANSCRIPTION_INTERVAL = 5000; // ms

const server = dgram.createSocket("udp4");

let ffmpegPlayer = null;
let audioBuffer = [];
let lastTranscriptionTime = Date.now();
let isTranscribing = false;
let packetsReceived = 0;
let bytesReceived = 0;
let lastStatsTime = Date.now();

function startAudioPlayer() {
  console.log("Starting audio player...");

  ffmpegPlayer = spawn("ffmpeg", ["-f", "s16le", "-ar", SAMPLE_RATE.toString(), "-ac", CHANNELS.toString(), "-i", "pipe:0", "-f", "alsa", "default"]);

  ffmpegPlayer.stderr.on("data", (data) => {
    const message = data.toString();
    if (message.includes("error") || message.includes("Error")) {
      console.error("FFmpeg error:", message);
    }
  });

  ffmpegPlayer.on("error", (err) => {
    console.error("FFmpeg process error:", err);
  });

  ffmpegPlayer.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  console.log("✓ Audio player started");
}

async function createWavFromPCM(pcmData) {
  const dataSize = pcmData.length;
  const fileSize = 44 + dataSize;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(fileSize - 8, 4);
  header.write("WAVE", 8);

  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // audio format (1 = PCM)
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE((SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8, 28); // byte rate
  header.writeUInt16LE((CHANNELS * BITS_PER_SAMPLE) / 8, 32); // block align
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);

  // data chunk
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}

async function transcribeAudio(audioData) {
  if (!OPENAI_API_KEY) {
    console.error("⚠️  OPENAI_API_KEY not set. Skipping transcription.");
    return;
  }

  if (audioData.length === 0) {
    console.log("⚠️  No audio data to transcribe");
    return;
  }

  console.log(`🎤 Transcribing ${(audioData.length / 1024).toFixed(2)} KB of audio...`);

  try {
    // Convert PCM to WAV
    const wavData = await createWavFromPCM(audioData);

    // Build multipart/form-data with boundary (similar to web implementation)
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).slice(2);
    const CRLF = "\r\n";

    // Build the multipart form data manually
    const preamble =
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="model"${CRLF}${CRLF}` +
      `whisper-1${CRLF}` +
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="language"${CRLF}${CRLF}` +
      `en${CRLF}` +
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="audio.wav"${CRLF}` +
      `Content-Type: audio/wav${CRLF}${CRLF}`;

    const epilogue = `${CRLF}--${boundary}--${CRLF}`;

    // Create a ReadableStream from the data
    const { Readable } = require("stream");
    const bodyStream = Readable.from(
      (async function* () {
        yield Buffer.from(preamble, "utf-8");
        yield wavData;
        yield Buffer.from(epilogue, "utf-8");
      })()
    );

    // Make request using fetch
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyStream,
      duplex: "half",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`\n📝 Transcription: "${result.text}"\n`);
  } catch (error) {
    console.error("❌ Transcription error:", error.message);
  }
}

async function processTranscriptionQueue() {
  if (isTranscribing || audioBuffer.length === 0) {
    return;
  }

  const now = Date.now();
  if (now - lastTranscriptionTime < TRANSCRIPTION_INTERVAL) {
    return;
  }

  isTranscribing = true;
  lastTranscriptionTime = now;

  // Get accumulated audio data
  const audioData = Buffer.concat(audioBuffer);
  audioBuffer = [];

  // Transcribe in background
  transcribeAudio(audioData).finally(() => {
    isTranscribing = false;
  });
}

// Handle incoming UDP packets
server.on("message", (msg, rinfo) => {
  if (!ffmpegPlayer) {
    startAudioPlayer();
  }

  // Write audio data to ffmpeg stdin
  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.write(msg);
  }

  // Add to transcription buffer
  audioBuffer.push(Buffer.from(msg));

  // Update statistics
  packetsReceived++;
  bytesReceived += msg.length;

  // Check if it's time to transcribe
  processTranscriptionQueue();

  // Log statistics every 5 seconds
  const now = Date.now();
  if (now - lastStatsTime > 5000) {
    const elapsed = (now - lastStatsTime) / 1000;
    const packetsPerSec = (packetsReceived / elapsed).toFixed(1);
    const kbytesPerSec = (bytesReceived / elapsed / 1024).toFixed(2);
    const bufferSize = (audioBuffer.reduce((sum, buf) => sum + buf.length, 0) / 1024).toFixed(2);

    console.log(`📊 Stats: ${packetsPerSec} packets/s, ${kbytesPerSec} KB/s, buffer: ${bufferSize} KB`);

    packetsReceived = 0;
    bytesReceived = 0;
    lastStatsTime = now;
  }
});

server.on("error", (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

server.on("listening", () => {
  const address = server.address();
  const interfaces = require("os").networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  console.log("\n==============================================");
  console.log("ESP32 Audio UDP Receiver with Transcription");
  console.log("==============================================");
  console.log(`UDP Server listening on port ${address.port}`);
  console.log(`Sample Rate: ${SAMPLE_RATE} Hz`);
  console.log(`Channels: ${CHANNELS} (mono)`);
  console.log(`Bits per sample: ${BITS_PER_SAMPLE}`);
  console.log(`Transcription interval: ${TRANSCRIPTION_INTERVAL / 1000}s`);
  console.log(`OpenAI API Key: ${OPENAI_API_KEY ? "✓ Set" : "✗ Not set"}`);
  console.log("\nListening on:");
  console.log(`  Local:   ${address.address}:${address.port}`);
  addresses.forEach((addr) => {
    console.log(`  Network: ${addr}:${address.port}`);
  });
  console.log("\nWaiting for ESP32 to send audio...");
  console.log("==============================================\n");
});

// Start UDP server
server.bind(UDP_PORT);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\nShutting down...");

  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.end();
    ffmpegPlayer.kill("SIGTERM");
  }

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

## Streaming transcription with user controlled "end of speech" delimiter

- The 5 seconds interval auto send is a temporary solution to test transcription.
- I will use the one of the buttons on my Operator Board to signal the beginning and ending of speech.
- When button is pressed: start recording audio.
- When button is released: stop recording and send the audio for transcription.

```cpp

/**
 * @file talkie-only.ino
 * @brief Sending audio over UDP using I2S microphone
 * Following the UDP example pattern from AudioTools
 */

#include "AudioTools.h"
#include "AudioTools/Communication/UDPStream.h"


// WiFi credentials
const char *ssid = "";
const char *password = "";

// Debounce settings
const int DEBOUNCE_THRESHOLD = 5;
int buttonCounter = 0;
bool buttonState = HIGH;
bool lastButtonState = HIGH;

AudioInfo info(22000, 1, 16);  // 22kHz, mono, 16-bit
I2SStream i2sStream;           // Access I2S as stream
ConverterFillLeftAndRight<int16_t> filler(LeftIsEmpty); // fill both channels
UDPStream udp(ssid, password);
Throttle throttle(udp);
IPAddress udpAddress(192, 168, 41, 106);  // Broadcast address
const int udpPort = 8888;
StreamCopy copier(throttle, i2sStream);  // copies I2S microphone input into UDP

void setup() {
  Serial.begin(115200);
  delay(100);
  AudioToolsLogger.begin(Serial, AudioToolsLogLevel::Warning);

  // Configure D8 and D9 as input with pull-up resistors
  pinMode(D8, INPUT_PULLUP);
  pinMode(D9, INPUT_PULLUP);

  // Connect to WiFi
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nFailed to connect to WiFi");
    return;
  }

  Serial.println("\nWiFi connected!");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());

  // Configure I2S with custom pinout
  Serial.println("Starting I2S...");
  auto i2sCfg = i2sStream.defaultConfig(RX_MODE);
  i2sCfg.copyFrom(info);
  i2sCfg.pin_bck = D0;   // BCLK
  i2sCfg.pin_data = D1;  // DOUT
  i2sCfg.pin_ws = D2;    // LRC
  i2sCfg.i2s_format = I2S_STD_FORMAT;

  if (!i2sStream.begin(i2sCfg)) {
    Serial.println("Failed to initialize I2S");
    return;
  }
  Serial.println("I2S initialized successfully");

  // Define udp address and port
  udp.begin(udpAddress, udpPort);

  // Define Throttle
  auto throttleCfg = throttle.defaultConfig();
  throttleCfg.copyFrom(info);
  //throttleCfg.correction_ms = 0;
  throttle.begin(throttleCfg);

  Serial.println("Started streaming...");
  Serial.print("Sending to: ");
  Serial.print(udpAddress);
  Serial.print(":");
  Serial.println(udpPort);
}

void loop() {
  // Read combined button state (LOW if either button is pressed)
  int buttonReading = (digitalRead(D8) == LOW || digitalRead(D9) == LOW) ? LOW : HIGH;

  // Debounce combined button
  if (buttonReading == LOW) {
    buttonCounter++;
    if (buttonCounter >= DEBOUNCE_THRESHOLD) {
      buttonState = LOW;
      buttonCounter = DEBOUNCE_THRESHOLD; // Cap the counter
    }
  } else {
    buttonCounter--;
    if (buttonCounter <= -DEBOUNCE_THRESHOLD) {
      buttonState = HIGH;
      buttonCounter = -DEBOUNCE_THRESHOLD; // Cap the counter
    }
  }

  // Log state changes
  if (buttonState != lastButtonState) {
    if (buttonState == LOW) {
      Serial.println("Speaking...");
    } else {
      Serial.println("Sent");
    }
    lastButtonState = buttonState;
  }

  // Transmit audio only if button is pressed
  if (buttonState == LOW) {
    copier.copy();
  }
}
```

- On the Node.js side, we can use the sustained silence period to stop accumulating speech and sending the data to OpenAI for transcription
- start with silent state
- On receiving audio packets, transition to speaking state, stream audio to OpenAI
- On silence, transition to silent state and wrap up streaming

```js
const dgram = require("dgram");
const { spawn } = require("child_process");

// Audio configuration (must match Arduino settings)
const SAMPLE_RATE = 22000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

// UDP configuration
const UDP_PORT = 8888;

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SILENCE_TIMEOUT = 1000; // If no data for 1 second, consider it silent

// Create UDP socket
const server = dgram.createSocket("udp4");

// FFmpeg process to play audio
let ffmpegPlayer = null;

// State machine
const STATE = {
  SILENT: "silent",
  SPEAKING: "speaking",
};
let currentState = STATE.SILENT;
let audioBuffer = [];
let lastPacketTime = null;
let silenceCheckInterval = null;
let isTranscribing = false;

// Statistics
let packetsReceived = 0;
let bytesReceived = 0;
let lastStatsTime = Date.now();

function startAudioPlayer() {
  console.log("Starting audio player...");

  // Use ffmpeg to play raw PCM audio
  ffmpegPlayer = spawn("ffmpeg", [
    "-f",
    "s16le", // signed 16-bit little-endian
    "-ar",
    SAMPLE_RATE.toString(), // sample rate
    "-ac",
    CHANNELS.toString(), // channels
    "-i",
    "pipe:0", // input from stdin
    "-f",
    "alsa", // Use ALSA for Linux audio output
    "default", // Default audio output device
  ]);

  ffmpegPlayer.stderr.on("data", (data) => {
    // ffmpeg outputs info to stderr, only log errors
    const message = data.toString();
    if (message.includes("error") || message.includes("Error")) {
      console.error("FFmpeg error:", message);
    }
  });

  ffmpegPlayer.on("error", (err) => {
    console.error("FFmpeg process error:", err);
  });

  ffmpegPlayer.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  console.log("✓ Audio player started");
}

async function createWavFromPCM(pcmData) {
  // Create WAV header
  const dataSize = pcmData.length;
  const fileSize = 44 + dataSize;

  const header = Buffer.alloc(44);

  // RIFF header
  header.write("RIFF", 0);
  header.writeUInt32LE(fileSize - 8, 4);
  header.write("WAVE", 8);

  // fmt chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // audio format (1 = PCM)
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE((SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8, 28); // byte rate
  header.writeUInt16LE((CHANNELS * BITS_PER_SAMPLE) / 8, 32); // block align
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);

  // data chunk
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}

function transitionToSpeaking() {
  if (currentState !== STATE.SPEAKING) {
    console.log("🎤 Speaking...");
    currentState = STATE.SPEAKING;
    audioBuffer = [];
  }
}

async function transitionToSilent() {
  if (currentState !== STATE.SILENT) {
    console.log("📤 Sent");
    currentState = STATE.SILENT;

    // Transcribe the accumulated audio
    if (audioBuffer.length > 0 && !isTranscribing) {
      const audioData = Buffer.concat(audioBuffer);
      audioBuffer = [];
      await transcribeAudio(audioData);
    }
  }
}

function checkForSilence() {
  if (currentState === STATE.SPEAKING && lastPacketTime) {
    const timeSinceLastPacket = Date.now() - lastPacketTime;
    if (timeSinceLastPacket > SILENCE_TIMEOUT) {
      transitionToSilent();
    }
  }
}

async function transcribeAudio(audioData) {
  if (!OPENAI_API_KEY) {
    console.error("⚠️  OPENAI_API_KEY not set. Skipping transcription.");
    return;
  }

  if (audioData.length === 0) {
    console.log("⚠️  No audio data to transcribe");
    return;
  }

  isTranscribing = true;
  console.log(`🔄 Transcribing ${(audioData.length / 1024).toFixed(2)} KB of audio...`);

  try {
    // Convert PCM to WAV
    const wavData = await createWavFromPCM(audioData);

    // Build multipart/form-data with boundary (similar to web implementation)
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).slice(2);
    const CRLF = "\r\n";

    // Build the multipart form data manually
    const preamble =
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="model"${CRLF}${CRLF}` +
      `whisper-1${CRLF}` +
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="language"${CRLF}${CRLF}` +
      `en${CRLF}` +
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="audio.wav"${CRLF}` +
      `Content-Type: audio/wav${CRLF}${CRLF}`;

    const epilogue = `${CRLF}--${boundary}--${CRLF}`;

    // Create a ReadableStream from the data
    const { Readable } = require("stream");
    const bodyStream = Readable.from(
      (async function* () {
        yield Buffer.from(preamble, "utf-8");
        yield wavData;
        yield Buffer.from(epilogue, "utf-8");
      })()
    );

    // Make request using fetch
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyStream,
      duplex: "half",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`\n📝 Transcription: "${result.text}"\n`);
  } catch (error) {
    console.error("❌ Transcription error:", error.message);
  } finally {
    isTranscribing = false;
  }
}

// Handle incoming UDP packets
server.on("message", (msg, rinfo) => {
  if (!ffmpegPlayer) {
    startAudioPlayer();
  }

  // Transition to speaking state on first packet
  transitionToSpeaking();

  // Update last packet time
  lastPacketTime = Date.now();

  // Write audio data to ffmpeg stdin
  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.write(msg);
  }

  // Add to transcription buffer
  audioBuffer.push(Buffer.from(msg));

  // Update statistics
  packetsReceived++;
  bytesReceived += msg.length;

  // Log statistics every 5 seconds
  const now = Date.now();
  if (now - lastStatsTime > 5000) {
    const elapsed = (now - lastStatsTime) / 1000;
    const packetsPerSec = (packetsReceived / elapsed).toFixed(1);
    const kbytesPerSec = (bytesReceived / elapsed / 1024).toFixed(2);
    const bufferSize = (audioBuffer.reduce((sum, buf) => sum + buf.length, 0) / 1024).toFixed(2);

    console.log(`📊 Stats: ${packetsPerSec} packets/s, ${kbytesPerSec} KB/s, buffer: ${bufferSize} KB`);

    packetsReceived = 0;
    bytesReceived = 0;
    lastStatsTime = now;
  }
});

server.on("error", (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

server.on("listening", () => {
  const address = server.address();
  const interfaces = require("os").networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  console.log("\n==============================================");
  console.log("ESP32 Audio UDP Receiver with Transcription");
  console.log("==============================================");
  console.log(`UDP Server listening on port ${address.port}`);
  console.log(`Sample Rate: ${SAMPLE_RATE} Hz`);
  console.log(`Channels: ${CHANNELS} (mono)`);
  console.log(`Bits per sample: ${BITS_PER_SAMPLE}`);
  console.log(`Silence timeout: ${SILENCE_TIMEOUT}ms`);
  console.log(`OpenAI API Key: ${OPENAI_API_KEY ? "✓ Set" : "✗ Not set"}`);
  console.log("\nListening on:");
  console.log(`  Local:   ${address.address}:${address.port}`);
  addresses.forEach((addr) => {
    console.log(`  Network: ${addr}:${address.port}`);
  });
  console.log("\nWaiting for ESP32 to send audio...");
  console.log("==============================================\n");

  // Start silence checker
  silenceCheckInterval = setInterval(checkForSilence, 100);
});

// Start UDP server
server.bind(UDP_PORT);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\nShutting down...");

  if (silenceCheckInterval) {
    clearInterval(silenceCheckInterval);
  }

  if (ffmpegPlayer && !ffmpegPlayer.killed) {
    ffmpegPlayer.stdin.end();
    ffmpegPlayer.kill("SIGTERM");
  }

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

## Realtime Voice Response

- In this final version, I jumped ahead a bit and implement the response synthesis. Instead of going through transcription, we directly prompt the model with the audio stream and manually trigger response on silence. The playback is on the computer and will be streamed to the micro-controller in next week's Output device assignment

- Minor change on the micro-controller side. We need to sample at 24kHz per OpenAI's [documentation](https://platform.openai.com/docs/guides/realtime-transcription#session-fields)

```diff
- AudioInfo info(22000, 1, 16);  // 22kHz, mono, 16-bit
+ AudioInfo info(24000, 1, 16);  // 24kHz, mono, 16-bit
```

- The node.js server code requires an overhaul
- Before:

```txt
UDP packet -> FFmpeg -> STT -> TTS -> Audio playback
```

- After:

```txt
UDP packet -> OpenAI WebSocket -> TTS -> Audio playback
```

I engineered a [prompt](./code/final-prompt.txt) for AI to migrate my previous implementation to generate voice response. The prompt referenced a markdown file that contains the full content of [Realtime Models Prompting guide](https://platform.openai.com/docs/guides/realtime-models-prompting) and [Realtime conversations guide](https://platform.openai.com/docs/guides/realtime-conversations).

```js
const dgram = require("dgram");
const { spawn } = require("child_process");
const WebSocket = require("ws");

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const UDP_PORT = 8888;
const SILENCE_TIMEOUT_MS = 1000;
const STATS_INTERVAL_MS = 5000;
const SILENCE_CHECK_INTERVAL_MS = 100;

const STATE = {
  SILENT: "silent",
  SPEAKING: "speaking",
};

const server = dgram.createSocket("udp4");

let currentState = STATE.SILENT;
let audioBuffer = [];
let lastPacketTime = null;
let silenceCheckInterval = null;
let isProcessing = false;
let packetsReceived = 0;
let bytesReceived = 0;
let lastStatsTime = Date.now();
let realtimeWs = null;
let sessionReady = false;

startServer();

function startServer() {
  connectToRealtimeAPI();
  server.bind(UDP_PORT);
  server.on("listening", handleServerListening);
  server.on("message", handleIncomingAudioPacket);
  server.on("error", handleServerError);
  process.on("SIGINT", handleGracefulShutdown);
}

function handleServerListening() {
  const address = server.address();
  logServerStartup(address);
  silenceCheckInterval = setInterval(detectSilenceAndTranscribe, SILENCE_CHECK_INTERVAL_MS);
}

function handleIncomingAudioPacket(msg, rinfo) {
  beginSpeakingStateIfNeeded();
  lastPacketTime = Date.now();
  audioBuffer.push(Buffer.from(msg));

  // Stream audio to Realtime API immediately if session is ready
  if (sessionReady && realtimeWs && realtimeWs.readyState === WebSocket.OPEN) {
    streamAudioChunk(msg);
  }

  updateStatistics(msg.length);
  logStatisticsIfIntervalElapsed();
}

function handleServerError(err) {
  console.error(`Server error:\n${err.stack}`);
  server.close();
}

function handleGracefulShutdown() {
  console.log("\n\nShutting down...");
  if (silenceCheckInterval) {
    clearInterval(silenceCheckInterval);
  }
  if (realtimeWs) {
    realtimeWs.close();
  }
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
}

function connectToRealtimeAPI() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("⚠️  OPENAI_API_KEY not set. Cannot connect to Realtime API.");
    process.exit(1);
  }

  const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime";
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "OpenAI-Beta": "realtime=v1",
  };

  console.log("🔌 Connecting to OpenAI Realtime API...");
  realtimeWs = new WebSocket(url, { headers });

  realtimeWs.on("open", handleRealtimeOpen);
  realtimeWs.on("message", handleRealtimeMessage);
  realtimeWs.on("error", handleRealtimeError);
  realtimeWs.on("close", handleRealtimeClose);
}

function handleRealtimeOpen() {
  console.log("✓ Connected to Realtime API");
}

function handleRealtimeMessage(data) {
  try {
    const event = JSON.parse(data.toString());

    switch (event.type) {
      case "session.created":
        console.log("✓ Session created");
        configureSession();
        break;

      case "session.updated":
        console.log("✓ Session configured");
        sessionReady = true;
        break;

      case "input_audio_buffer.committed":
        console.log("✓ Audio buffer committed");
        break;

      case "input_audio_buffer.cleared":
        console.log("✓ Audio buffer cleared");
        break;

      case "response.created":
        console.log("🤖 Generating response...");
        break;

      case "response.output_text.delta":
        // Text being generated in chunks (optional logging)
        process.stdout.write(event.delta);
        break;

      case "response.output_text.done":
        console.log(`\n📝 Response text: "${event.text}"`);
        break;

      case "response.done":
        console.log("✓ Response complete");
        handleResponseComplete(event);
        break;

      case "error":
        console.error("❌ Realtime API error:", event.error);
        break;
    }
  } catch (error) {
    console.error("❌ Error parsing Realtime message:", error.message);
  }
}

function handleRealtimeError(error) {
  console.error("❌ Realtime WebSocket error:", error.message);
}

function handleRealtimeClose() {
  console.log("🔌 Realtime connection closed. Reconnecting...");
  sessionReady = false;
  setTimeout(connectToRealtimeAPI, 2000);
}

function configureSession() {
  const sessionConfig = {
    type: "session.update",
    session: {
      modalities: ["text"], // Only text output, no audio
      instructions: "Respond to user speech in the voice of a HAM radio operator. One short spoken phrase response only.",
      voice: "ash",
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      turn_detection: null, // Disable VAD - we handle silence detection manually
    },
  };

  realtimeWs.send(JSON.stringify(sessionConfig));
}

function beginSpeakingStateIfNeeded() {
  if (currentState !== STATE.SPEAKING) {
    console.log("🎤 Speaking...");
    currentState = STATE.SPEAKING;
    audioBuffer = [];
  }
}

function detectSilenceAndTranscribe() {
  if (currentState === STATE.SPEAKING && lastPacketTime) {
    const timeSinceLastPacket = Date.now() - lastPacketTime;
    if (timeSinceLastPacket > SILENCE_TIMEOUT_MS) {
      transitionToSilentAndProcessAudio();
    }
  }
}

async function transitionToSilentAndProcessAudio() {
  if (currentState !== STATE.SILENT) {
    console.log("📤 Sent");
    currentState = STATE.SILENT;

    if (audioBuffer.length > 0 && !isProcessing && sessionReady) {
      isProcessing = true;
      audioBuffer = [];
      await commitAudioAndRequestResponse();
    }
  }
}

function streamAudioChunk(audioChunk) {
  // Convert PCM16 buffer to base64 and send to Realtime API
  const base64Audio = audioChunk.toString("base64");
  const event = {
    type: "input_audio_buffer.append",
    audio: base64Audio,
  };
  realtimeWs.send(JSON.stringify(event));
}

async function commitAudioAndRequestResponse() {
  console.log(`🔄 Committing audio buffer and requesting response...`);

  try {
    realtimeWs.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
    realtimeWs.send(JSON.stringify({ type: "response.create", response: { modalities: ["text"] } }));
    realtimeWs.send(JSON.stringify({ type: "input_audio_buffer.clear" }));
  } catch (error) {
    console.error("❌ Error requesting response:", error.message);
    isProcessing = false;
  }
}

function handleResponseComplete(event) {
  // Extract text from response
  const response = event.response;
  let responseText = "";

  if (response && response.output) {
    for (const item of response.output) {
      if (item.type === "message" && item.content) {
        for (const content of item.content) {
          if (content.type === "text") {
            responseText = content.text;
            break;
          }
        }
      }
      if (responseText) break;
    }
  }

  if (responseText) {
    console.log(`💬 Final response: "${responseText}"`);
    speakTextAloud(responseText);
  } else {
    console.log("⚠️  No text response received");
  }

  isProcessing = false;
}

async function speakTextAloud(text) {
  console.log(`🔊 Playing TTS for: "${text}"`);

  try {
    // Use OpenAI REST API for TTS since Realtime API is text-only mode
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "ash",
        input: text,
        instructions: "Low coarse seasoned veteran from war time, military radio operator voice with no emotion. Speak fast with urgency.",
        response_format: "wav",
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await playAudioBufferThroughSpeakers(buffer);
  } catch (error) {
    console.error("❌ TTS error:", error.message);
  }
}

async function playAudioBufferThroughSpeakers(buffer) {
  const ffplay = spawn("ffplay", ["-nodisp", "-autoexit", "-loglevel", "quiet", "-i", "pipe:0"]);

  ffplay.on("error", (err) => {
    console.error("❌ ffplay error:", err.message);
  });

  ffplay.on("close", (code) => {
    if (code === 0) {
      console.log("✓ TTS playback completed");
    } else {
      console.error(`❌ ffplay exited with code ${code}`);
    }
  });

  ffplay.stdin.write(buffer);
  ffplay.stdin.end();
}

function updateStatistics(messageLength) {
  packetsReceived++;
  bytesReceived += messageLength;
}

function logStatisticsIfIntervalElapsed() {
  const now = Date.now();
  if (now - lastStatsTime > STATS_INTERVAL_MS) {
    const elapsed = (now - lastStatsTime) / 1000;
    const packetsPerSec = (packetsReceived / elapsed).toFixed(1);
    const kbytesPerSec = (bytesReceived / elapsed / 1024).toFixed(2);
    const bufferSize = (audioBuffer.reduce((sum, buf) => sum + buf.length, 0) / 1024).toFixed(2);

    console.log(`📊 Stats: ${packetsPerSec} packets/s, ${kbytesPerSec} KB/s, buffer: ${bufferSize} KB`);

    packetsReceived = 0;
    bytesReceived = 0;
    lastStatsTime = now;
  }
}

function logServerStartup(address) {
  const networkAddresses = getNetworkAddresses();

  console.log("\n==============================================");
  console.log("ESP32 Audio UDP Receiver with Realtime API");
  console.log("==============================================");
  console.log(`UDP Server listening on port ${address.port}`);
  console.log(`Sample Rate: ${SAMPLE_RATE} Hz`);
  console.log(`Channels: ${CHANNELS} (mono)`);
  console.log(`Bits per sample: ${BITS_PER_SAMPLE}`);
  console.log(`Silence timeout: ${SILENCE_TIMEOUT_MS}ms`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? "✓ Set" : "✗ Not set"}`);
  console.log(`Model: gpt-realtime (text mode, no VAD)`);
  console.log("\nListening on:");
  console.log(`  Local:   ${address.address}:${address.port}`);
  networkAddresses.forEach((addr) => {
    console.log(`  Network: ${addr}:${address.port}`);
  });
  console.log("\nWaiting for ESP32 to send audio...");
  console.log("==============================================\n");
}

function getNetworkAddresses() {
  const interfaces = require("os").networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  return addresses;
}
```

- The latency is very low
- The speech synthesis sounds quite natural
