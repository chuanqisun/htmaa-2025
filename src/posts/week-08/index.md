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

### Networking Test

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

## UDP Streaming

- If I can't address the audio codec, can I tackle the network issue itself?
- Knowing the HTTP protocol has built-in error correction and guarantees delivery, relying on two-way communication, it may introduce significant overhead.
- UDP is a connectionless protocol that does not guarantee delivery, but it has lower latency and overhead.
- I don't worry about occasional packet loss in audio streaming, as it often goes unnoticed.
