---
title: "Week 11: Mob-making A Machine"
date: 2025-11-18
keywords: ["machine-building", "collaboration"]
---

This week brought a unique challenge: building a machine as a team. Unlike previous assignments where I could work independently at my own pace, this group project required coordination, communication, and compromise. This document captures my contributions to the project, primarily in the software domain. For the full context and other team members' work, see the group project page.

## Labubu: The Concept

Miranda pitched an ambitious idea during our first team meeting: building an icosahedron robot that could move around based on IMU data. The concept was both simple and brilliant—each face of the icosahedron would be a Labubu character that punches out and propels the device in the desired direction. I'm admittedly too old to understand the cultural significance of Labubu, but the mechanical concept immediately clicked. The idea of using servo-actuated faces to create locomotion through sequential impacts was clever.

Towards the end of the project, we made a significant pivot: replacing the Labubu with our professor Neil's face. This change made the project much more relatable to our class context, but it also raised the stakes considerably. There's something uniquely nerve-wracking about presenting a robot that propels itself by punching out with your professor's face.

## Project Organization: People Over Process

The group naturally divided into four sub-teams: Mechanical Engineering, Electronics, Software, and Creative. I gravitated toward the Software team, which made sense given my background. However, the initial project planning session revealed an interesting tension between process and pragmatism.

During our first planning discussion, several team members proposed implementing a formal PR process with branch-based workflows—the kind of structured version control that works well in professional software development. While I appreciated the sentiment, I had concerns about whether this approach would serve our team well given our diverse skill levels and the compressed timeline.

I advocated for a different philosophy: emphasize people over technology. Instead of imposing a rigid process, I suggested that sub-team leaders should focus on two key responsibilities:
- Anticipate dependencies and conflicts with other teams, and communicate early about them
- Adapt their version control strategy based on their team members' actual skills and preferences

This philosophy resonates with one of my favorite principles from the Go programming language:

> Don't communicate by sharing memory; share memory by communicating.
> — Go Language Design Principle

In the context of our project, this meant prioritizing clear communication channels over complex technical infrastructure. I even proposed a controversial idea: organizing code by people and deliberately duplicating code to surface the full history at all times.

I proposed organizing our repository with this folder structure:

```txt
- PersonA
  - sensing
  - networking
- PersonB
  - actuation
  - webUI
...
```

Yes, this is fundamentally a "copy-paste" version control system that most professional developers would cringe at. I could hear the collective gasp from every software engineer who might read this. But hear me out.

I advocated for this unconventional approach because of the unique constraints of our project. We needed to quickly branch and fork each other's ideas. I estimated that 90% of the code in the beginning would be self-contained one-off experiments that wouldn't evolve into the final system. By exposing everyone's work in the same branch at the same time, we gained several advantages:

- **Easy remixing**: We could easily copy and adapt each other's code without navigating complex git histories
- **AI-assisted integration**: People using AI assistants could reference multiple components from different people and get help with integration
- **Natural documentation**: People's work became a living source of documentation. History wasn't buried in git logs—it was visible in the file structure
- **No merge conflicts**: Since everyone worked in their own folder, we eliminated merge conflicts entirely

Of course, this approach required discipline. The person sharing their code needed to communicate upcoming breaking changes proactively. The person consuming another's code needed to clearly state their assumptions and expectations. It was a social contract rather than a technical enforcement.

This organization worked surprisingly well in the beginning. However, toward the second half of the project, we realized we needed a point of integration. Our final folder structure evolved to:

```txt
- integration
  - controller
  - web
- PersonA
  ...
- PersonB
  ...
```

I fully understand this is not how git workflows are "supposed" to work. But for mob-like student projects with diverse skill levels and tight timelines, this organization worked its magic. We could see each other's code without the branching overhead, and that transparency proved invaluable. I would still advocate for the same strategy in future projects with similar constraints.

## Division of Labor: Applying Conway's Law

On the first night, Matti and I sat down to hash out the task division. Our goals were clear:
- Create independent modules that could be worked on in parallel
- Reduce dependencies between modules by defining clear interfaces upfront

After sketching out the system architecture on a whiteboard, we settled on this decomposition:

**Sensing (C++)**
- Understand the format of IMU data from our sensor
- Prepare data on the Xiao before sending to network

**Networking (C++ & Python)**
- WiFi connection management
- Tracking IP address of the remote control (PC)
- Sending IMU data from Xiao to remote control over UDP
- Receiving servo motor numbers from remote control to Xiao over UDP

**Planning (JavaScript)**
- Use math to convert high-level commands (move front/back/left/right) into the correct servo motor number that should actuate

**Actuation (C++)**
- Based on the received servo motor number, drive the motor to make the movement

**UI (JavaScript/HTML/CSS)**
- Build a web interface
- Visualize device orientation in real-time
- Provide buttons to move front/back/left/right
- Allow manual control of individual servo motors for testing

Looking back at the end of the project, I noticed that our final code structure closely mirrored this initial organizational breakdown. This reminded me of Conway's Law, which states that organizations design systems that mirror their communication structure. 

As a reflection, I realized we can actually use Conway's Law to our advantage. Instead of letting organizational structure passively determine system architecture, we can flip it around: first decide what kind of teams and collaborations we want, then modularize the project to enable that organizational structure. By being intentional about our desired collaboration patterns, we can design both the technical system and the social system in harmony.

## Software Architecture: PC-Centric Design

Beyond the module breakdown, Matti and I agreed on a high-level architectural principle: shift as much computation to the PC as possible. This decision was driven by practical considerations about development velocity.

Running the server on the PC instead of the Xiao offered several advantages:
- **Easier debugging**: We could use familiar development tools and see immediate console output
- **Continuous connectivity**: Keeping the laptop connected to school WiFi meant we could leverage generative AI to accelerate coding
- **Rapid iteration**: Changes to PC code could be tested immediately without reflashing the Xiao

We acknowledged one major drawback: higher latency due to routing through school WiFi. However, we judged this tradeoff acceptable given our project timeline. We could always optimize for latency later if needed.

This architectural concept rippled through every subsequent decision we made. The Xiao's logic became dead simple:
- **Send** low-level IMU data to PC: quaternion WXYZ and accelerometer XYZ
- **Receive** a servo motor number and execute a predefined PWM sequence to fully extend then retract that motor

Meanwhile, the PC shouldered the heavy computational lifting:
- Interpreting IMU data to determine device orientation
- Solving the geometric puzzle of which servo to actuate for a desired movement direction
- Handling calibration and coordinate system transformations
- Converting high-level user commands into specific motor actuation sequences

This division of labor meant the Xiao could focus on doing what microcontrollers do best—interfacing with hardware—while the PC handled the complex logic that benefited from computational power and debugging tools.

## Networking Proof of Concept: Characterizing UDP Performance

With our architecture defined, I jumped into implementing the networking layer. I started with UDP over WiFi because I had a similar system already working from the Input/Output weeks for streaming voice. Before building the full system, I wanted to thoroughly understand the performance characteristics of UDP on the Xiao ESP32.

I implemented a few diagnostic programs to characterize the network performance. First, I created a simple Node.js echo server that would bounce any UDP message back to the sender. This would let us measure round-trip latency under various conditions.

```js
const dgram = require("dgram");
const os = require("os");

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
  console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
  try {
    const data = JSON.parse(msg.toString());
    console.log(`currentTime: ${data.currentTime}, latency: ${data.latency}`);
  } catch (e) {
    console.log(`Invalid JSON: ${msg.toString()}`);
  }
  // Send back the same message
  server.send(msg, 0, msg.length, rinfo.port, rinfo.address, (err) => {
    if (err) console.error("Error sending response:", err);
  });
});

server.on("listening", () => {
  const address = server.address();
  const interfaces = os.networkInterfaces();
  let localIP = "127.0.0.1"; // fallback
  for (let iface in interfaces) {
    for (let addr of interfaces[iface]) {
      if (addr.family === "IPv4" && !addr.internal) {
        localIP = addr.address;
        break;
      }
    }
    if (localIP !== "127.0.0.1") break;
  }
  console.log(`UDP server listening on ${localIP}:${address.port}`);
});

server.bind(41234); // Bind to port 41234
```

On the ESP32 side, I sent UDP packets in bursts and measure latency during peak load.

```cpp
#include <WiFi.h>
#include <AsyncUDP.h>

const char* WIFI_SSID = "MLDEV";
const char* WIFI_PASSWORD = "";

AsyncUDP udp;
IPAddress targetIP(192, 168, 41, 229);
const unsigned int targetPort = 41234;
int packetNum = 0;
unsigned long lastLatency = 0;
int burstCount = 0;
const int BURST_SIZE = 1;

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 300000) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Failed");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  if (udp.connect(targetIP, targetPort)) {
    Serial.println("UDP connected");
    udp.onPacket([](AsyncUDPPacket packet) {
      String msg = String((char*)packet.data(), packet.length());
      int colonPos = msg.indexOf("currentTime\":");
      if (colonPos != -1) {
        colonPos += 13;
        int commaPos = msg.indexOf(",", colonPos);
        if (commaPos != -1) {
          String timeStr = msg.substring(colonPos, commaPos);
          unsigned long sentTime = strtoul(timeStr.c_str(), NULL, 10);
          lastLatency = millis() - sentTime;
        }
      }
      packet.printf("Got %u bytes of data", packet.length());
    });
  }
}

void loop() {
  if (burstCount < BURST_SIZE) {
    packetNum++;
    burstCount++;
    String json = "{\"currentTime\":" + String(millis()) + ",\"packetNum\":" + String(packetNum) + ",\"latency\":" + String(lastLatency) + "}";
    udp.print(json);
    Serial.println("Sent: " + json);
  } else {
    Serial.println("Sleeping for 1 second...");
    delay(10);
    burstCount = 0;
  }
}
```

After running extensive tests, I gathered some interesting performance data:

**Throughput**
- The Xiao could send over 1,000 packets per second to a PC
- However, it would crash (presumably due to buffer overflow) when the PC sent too much data back

**Latency Characteristics**
- Typical latency: 30-50ms
- Worst case latency: 100-200ms  
- Best case latency: 4-6ms

**Critical finding**: The Xiao needed to sleep at least 1ms between sends. Otherwise, it would be blocked from reading incoming packets, creating a deadlock situation.

### Dynamic IP Discovery

Testing the network code revealed a practical problem: each person's laptop had a different IP address, and these addresses could change when reconnecting to WiFi. Hard-coding IP addresses in the Xiao firmware would make collaboration painful.

I implemented a simple IP discovery protocol to solve this:
- Team members could announce their IP address through a web interface
- The ESP32 would poll a central server to get the latest IP address of the controlling laptop

![IP Discovery Tool](./media/ip-discovery.webp)
**IP Discovery Tool**

This tool worked well for initial testing but was eventually taken offline after we made a significant pivot from WiFi to Bluetooth. More on that later.

## Interface First: Defining the Contract

One lesson I've learned from previous projects is the value of defining interfaces before implementation. To enable the web server team to work in parallel with the microcontroller team, I encouraged everyone to agree on the networking contract first. This would allow both sides to develop simultaneously using mock data.

We settled on a simple JSON-based protocol. The payloads would contain Quaternion (w, x, y, z) and Accelerometer (ax, ay, az) readings in newline-delimited JSON format:

### esp32 -> laptop

```json
{
  "w": 0.875,
  "x": 0.0243,
  "y": 0.0393,
  "z": -0.482,
  "ax": 17.5781,
  "ay": 3.1738,
  "az": 1025.3906
}
```

Each notification is parsed by `bluetooth.js` and forwarded to the UI; `threejs-vis.js` consumes the quaternion stream to animate the model.

### laptop -> esp32

General format is JSON with "cmd" and "args" fields. For simplicity, "args" is a string. It is optional.

Move servo command

```json
{ "cmd": "move_servo", "args": "5,12" }
```

Reset device command

```json
{ "cmd": "reset" }
```

During the protocol design discussion, some team members proposed custom bit packing to reduce bandwidth consumption. While I appreciated the performance-oriented thinking, I advocated strongly for keeping the JSON protocol for simplicity. We could always optimize later if bandwidth became a bottleneck. Premature optimization is the root of all evil, as Knuth famously said.

The JSON protocol was eventually superseded by a custom op-code based binary protocol when we migrated to Bluetooth. The BLE bandwidth constraints made the optimization necessary.

In retrospect, I maintain that starting with JSON was the right call—it enabled rapid development and debugging. However, if I could do it again, I would advocate for a JSON protocol with more concise field names (like "w", "x", "y", "z" instead of longer descriptors). The elaborate bit-packing we eventually implemented had marginal performance gains but made serialization and deserialization much more error-prone. Sometimes the simple solution is the best solution.

## Server Implementation: Parallel Development in Action

With the interface contract defined, parallel development became possible. Yufeng dove into running the demo code for the Adafruit IMU board and started developing the actual sensor data processing logic. Meanwhile, I could work on the server-side code without waiting for real sensor data.

Thanks to our data format contract, I mocked the IMU data on a separate Xiao and established communication with a Node.js server over UDP. This allowed me to develop and test the entire data pipeline before the real sensors were ready.

Here's the module I created to mock the sensor data:

```cpp
// Mock IMU sensor data
float gx = 0.0, gy = 0.0, gz = 0.0;  // Gyroscope in degrees
float mx = 0.0, my = 0.0, mz = 0.0;  // Compass/Magnetometer in degrees

void updateMockSensorData() {
  // Update mock IMU data with random changes
  gx += random(-10, 11) * 0.1;  // Change by -1.0 to +1.0 degrees
  gy += random(-10, 11) * 0.1;
  gz += random(-10, 11) * 0.1;
  mx += random(-10, 11) * 0.1;
  my += random(-10, 11) * 0.1;
  mz += random(-10, 11) * 0.1;

  // Keep values in reasonable ranges
  gx = constrain(gx, -180, 180);
  gy = constrain(gy, -180, 180);
  gz = constrain(gz, -180, 180);
  mx = constrain(mx, 0, 360);
  my = constrain(my, 0, 360);
  mz = constrain(mz, 0, 360);
}

String getSensorDataJSON() {
  // Create JSON array format: [gx,gy,gz,mx,my,mz]
  return "[" + String(gx, 2) + "," + String(gy, 2) + "," + String(gz, 2) + ","
             + String(mx, 2) + "," + String(my, 2) + "," + String(mz, 2) + "]";
}
```

## Determining High-Level Logic: Making Code Readable

As multiple people started adding pieces to the Xiao codebase, I noticed the code becoming increasingly difficult to follow. Different coding styles and assumptions were creating cognitive overhead. I initiated a refactoring effort to modularize the code and make the high-level logic crystal clear.

I sketched out this pseudocode to capture the essential program flow:

```cpp
setup() {
  wifi = connect_wifi();
  laptop_ip = discover_laptop(wifi);

  on_message_received = (message) => {
    handle_reset(message);
    handle_servo_command(message);
  };

  handle_laptop_udp_message(wifi, laptop_ip, on_message_received);
}

loop() {
  sendor_data = read_imu_sensor();
  send_udp_message(wifi, laptop_ip, sendor_data);
}
```

I shared this design with the group to ensure everyone had a shared mental model. The beauty of this structure is its extensibility—in theory, future I/O devices could plug into the main program without requiring changes to other modules' code. This modularity would prove valuable as we made significant pivots later in the project.

## Sensor Integration Test: The Tea Party Disaster

Friday afternoon brought our first full integration test. The EE team had finished assembling the electronics, and we were eager to see everything work together. We uploaded our sketch and started testing—initially in the lab, where everything worked smoothly.

![Testing UI](./media/test-02.webp)
**Dumping IMU data to the web UI over UDP**

Then came the real test. The StudentCom was hosting their weekly social tea hour, and we decided to stress-test our system in a crowded, WiFi-saturated environment. This turned out to be a brutally honest performance evaluation.

![Testing in Tea Party](./media/test-01.webp)
**Testing against interference in the crowded StudCom Tea Party**

The results were sobering:
- With about 40 people in the room, the device experienced over 3 seconds of latency
- The quaternion values took 12+ seconds to stabilize
- Control inputs felt mushy and unpredictable

**The verdict**: UDP + WiFi clearly wouldn't work for our application. The crowded WiFi spectrum in the Media Lab made reliable, low-latency communication impossible.

But there was good news in this failure. We discovered the problem early enough to pivot. More importantly, our modular architecture meant the communication layer wasn't tightly coupled to the sensor logic. We could swap out the networking implementation without rewriting the entire system. This validated our earlier architectural decisions.

## The Big Migration: From WiFi to Bluetooth

After the disappointing tea party test, we knew we needed to make a major change. WiFi wasn't going to cut it. I remembered that Miranda had implemented Bluetooth two-way communication code for another part of the project. Bluetooth Low Energy (BLE) would give us a direct connection between the device and the laptop, bypassing the congested WiFi spectrum entirely.

I decided to leverage AI to help with the migration. I took Miranda's Bluetooth code as a reference and gave Claude 3.5 Sonnet this prompt:

```txt
Plan step by step, we are going to swap out the wifi + UDP + WebSocket based communication between ESP32 and Node.js with a simpler Bluetooth BLE based communication between ESP32 and the Web page, using Web Bluetooth API.

The change will include at least the following:
1. Remove UDP and Wifi on both ESP32 and Node.js
2. Add BLE on both ESP32 and the web page
3. Remove IP discovery code
4. Treat the server folder as static. use simple npx command to serve the file and not worry about maintaining a node.js server

We already have working reference implemention in #file:bluetooth. You can use that code as skeleton.

Keep the ESP32 organized by files, similar to existing structure lib-xx-name.ino; delete files that are no longer in use.

Make sure to carefully map out the migration and execute it with a checklist.
```

What happened next felt almost magical. The migration worked on the first try. No debugging sessions, no mysterious errors, no hair-pulling. Just... working code.

This experience reinforced my conviction that AI is a game changer for development work. Not because it replaces human judgment—I still had to architect the solution and verify the output—but because it dramatically accelerates the tedious work of translating architectural decisions into implementation details.

## Integrating Servo Control: The Blocking Problem

With Bluetooth working, it was time to integrate the servo control code. Saetbeyol had implemented the servo motor control logic, and on paper, everything should have worked. But when I integrated her code with the networking layer, the servos refused to respond to commands from the PC.

Initial debugging suggested I/O blocking, so we dug deeper into the main loop structure. The investigation revealed a critical issue: the communication loop was blocking execution.

```cpp
  if (isBLEConnected()) {
    String sensorData = getSensorJSON();
    sendBLEMessage(sensorData); // <-- need to disable this line in order to send any command to the ESP32, why?
  }
```

The solution was to stop blocking the main loop. Instead of continuously sending sensor data, we implemented a timer-based approach that sent data every 20ms.

The 20ms interval was empirically determined through trial and error. I wasn't entirely happy with this magic number approach—it felt like a band-aid rather than a proper architectural fix—but we were under time pressure. We decided to proceed with this solution and revisit it later if needed.

```cpp
static unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL_MS = 20;

void setupSensorTransmission() {
  lastSendTime = 0;
  Serial.println("Sensor transmission initialized");
}

void sendSensorDataIfReady() {
  if (!isBLEConnected()) {
    return;
  }

  unsigned long currentTime = millis();

  if (currentTime - lastSendTime >= SEND_INTERVAL_MS) {
    String sensorData = getSensorJSON();
    sendBLEMessage(sensorData);
    lastSendTime = currentTime;
  }
}

```

With this fix in place, we achieved our first successful full integration. Sensors were streaming data over BLE, and servos were responding to commands. It was a milestone worth celebrating.

<video src="./media/servo-01.mp4" controls></video>
**Servos dancing while sensors stream IMU data over BLE**

There's something deeply satisfying about seeing disparate components come together into a working system. This moment—watching the servos dance in response to sensor data—made all the debugging and refactoring worthwhile.

## Debugging the MUX: When Hardware Gets Temperamental

Our celebration was short-lived. When we tried driving multiple servos through the MUX PWM PCA9685 board, the system behaved erratically. Servos would move unpredictably, or sometimes not move at all. The inconsistency was maddening.

After some investigation, we identified two culprits:
- The MUX board was extremely sensitive to electromagnetic interference. Even touching it with a hand could trigger bizarre behavior
- Our code didn't fully implement the MUX communication protocol correctly

Matti, with his characteristic pragmatism, suggested we start from the Adafruit official library example code rather than debugging our custom implementation. We swallowed our pride and followed his advice. Using the reference implementation, we confirmed that the board wiring was correct and all servo motors were functional. The issue was purely in our software.

We solved the problem by using the Adafruit official library as our foundation, building our custom logic on top of proven code. Sometimes the best debugging strategy is to trust the experts who designed the hardware.

Matti also discovered how to chain multiple MUX boards by soldering the address pins to change each board's I2C address.

![PCA9685 MUX Board](./media/mux.webp)
**Pads for changing the address of PCA9685 MUX Board**

The base address is 0x40. By soldering different address pins, you can create unique addresses: A3 (0x08) gives 0x48, A5 (0x20) gives 0x60, and so on. The EE team would later need multiple MUX boards and discovered this capability independently. Had we shared our findings earlier, we could have saved them some exploration time—another reminder about the importance of communication in team projects.

## Stress Testing BLE: Finding the Limits

With the basic integration working, I wanted to push the system to its limits. Stress testing revealed a critical issue: rapidly sending BLE messages would cause the connection to drop entirely. This was a showstopper for our real-time control application.

Matti suggested using different TX characteristics for namespaced communication, which would save bandwidth by eliminating the need for command name prefixes in each message. This was a clever optimization that addressed both our bandwidth and reliability concerns.

## Systematic Testing of Web Bluetooth API

I decided to conduct systematic testing of the Web Bluetooth API to understand its limitations and constraints. My first experiment involved sending characters at high frequency:

```js
sendInterval = setInterval(async () => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    await charTx.writeValue(data);
    log(`TX: ${message}`);
  } catch (error) {
    log(`SEND ERROR: ${error.message}`);
    stopSending();
  }
}, interval);
```

Error code from the Web Bluetooth API:

```txt
SEND ERROR: GATT operation already in progress.
```

This error message clearly indicated that flow control was needed. The browser was trying to send messages faster than the BLE stack could handle them. I considered two approaches:

**Option 1: Throttling**
- Limit the rate of message sending
- Problem: Throughput is environment-dependent. We'd need to be very conservative, losing performance in good conditions

**Option 2: Buffering**
- Queue messages and ensure only one transmission happens at a time
- Advantage: Maximizes throughput in all conditions while preventing errors

I chose buffering as the more robust solution. Using the RxJS `mergeMap` operator, I implemented a queue-based scheduler that could easily toggle between single-threaded mode (concurrency = 1) and unrestricted concurrency mode (concurrency = undefined). This gave me a clean way to test both approaches:

```js
const concurrency = useScheduler ? 1 : undefined;

const send$ = interval(intervalMs).pipe(
  takeUntil(stopBrowserSend$),
  tap(() => browserQueueSize++),
  mergeMap(async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    await charTx.writeValue(data);

    browserQueueSize--;
    messageSent$.next();
    log(`[Test 1] TX: ${message}`);
  }, concurrency)
);
```

Building on this scheduler concept, I implemented a comprehensive diagnostic tool to profile BLE performance under various conditions. The tool could measure latency and throughput for different message sizes and network conditions.

<video src="./media/ble-test.mp4" controls></video>
**BLE benchmarking in action**

### Performance Characterization Results

I tested the system under three different scenarios to understand its real-world performance:

**Best Case: Side-by-side in the same room**
- Bandwidth:
  - Browser → ESP32: 14 messages/sec
  - ESP32 → Browser: 100 messages/sec
- Latency: 92ms average (min: 84ms, max: 140ms)
- Interesting finding: Removing the antenna didn't reduce performance at close range, but as I walked away, performance dropped quickly. Connection was lost at 5 meters without antenna.

**Long Distance: 30 meters through one glass wall**
- Unable to establish new connection at this distance
- However, connections established at close range could be maintained while walking to 30 meters
- Bandwidth:
  - Browser → ESP32: 8 messages/sec
  - ESP32 → Browser: 50 messages/sec
- Latency: 250ms average (min: 89ms, max: 540ms)

**Realistic Usage: Inside metal icosahedron at 10 meters**
This scenario best represented our actual use case—the device would be inside a metal structure, and the operator would be at a reasonable distance.
- Browser → ESP32: 14 messages/sec
- ESP32 → Browser: 100 messages/sec
- Latency: 230ms average (min: 157ms, max: 332ms)

The asymmetry in bandwidth was interesting. The ESP32 could send much faster than it could receive. This informed our architectural decision to keep high-frequency sensor data flowing from device to PC, while only sending occasional command messages in the reverse direction.

## Integrating the Scheduler: Production-Ready Flow Control

The diagnostic tool had proven the concept, but it used RxJS—a powerful library, but a heavy dependency for our lean production code. I wanted to avoid bloating the codebase with unnecessary libraries, so I implemented a standalone scheduler using vanilla JavaScript.

My design goals were:
- **Encapsulation**: Hide the scheduler behind the Bluetooth module so callers don't need to worry about flow control
- **FIFO ordering**: Multiple callers to the Bluetooth module should have their messages scheduled in first-in-first-out order
- **Simplicity**: Keep the implementation simple and debuggable

Here's the core implementation:

```js
  /**
   * Add a task to the queue and process it
   * @param {Function} taskFn - Async function to execute
   * @returns {Promise} - Resolves when task completes
   */
  async enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processQueue(); // After each task, check for more tasks
    });
  }

  /**
   * Process the queue sequentially
   */
  async processQueue() {
    // If already processing, return
    if (this.isProcessing) {
      return;
    }

    // If queue is empty, return
    if (this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { taskFn, resolve, reject } = this.queue.shift();

      try {
        const result = await taskFn();
        resolve(result);
      } catch (error) {
        console.error("Task failed in scheduler:", error);
        reject(error); // The caller can ignore the rejection if they want.
      }
    }

    this.isProcessing = false;
  }
```

With the scheduler in place, I could dispatch commands at high speed without causing BLE transmission errors. The queue ensured that only one BLE operation happened at a time, while still allowing the application layer to send commands as fast as it wanted. The scheduler absorbed the impedance mismatch between the application's desired send rate and the BLE stack's actual throughput.

## Reflections: Lessons in Team Dynamics and Software Pragmatism

> The bearing of a child takes nine months, no matter how many women are assigned.
> — Fred Brooks, _The Mythical Man-Month_

This quote from Brooks captures something essential about project management that I experienced firsthand this week. It's tempting to add more process and throw more people at problems when deadlines loom. But I found the most effective work happened in two-person micro-teams pair-programming on specific problems. I saw this pattern work beautifully between Matti and Miranda, and between Saetbeyol and me.

This observation reinforces the importance of problem decomposition. The more we can break a project into independent chunks that small teams can tackle in parallel, the more we can leverage our team's collective capacity without succumbing to communication overhead.

### Challenging Conventional Wisdom

This project also fundamentally challenged my conventional wisdom about "proper" software development. All the practices I usually advocate for—version control discipline, automated testing, code review, CI/CD, TypeScript, ES6 modules, linting, formatting, design patterns—were thrown out the window. And maybe that was for the better.

I'm always fascinated by the practices that emerge under extreme constraints. In this project with its compressed timeline and diverse skill levels, I became convinced that less is more. The overhead of maintaining formal development processes would have slowed us down more than the occasional bug from informal practices. 

This doesn't mean those practices lack value. In a long-term project with changing requirements and team members, they're essential. But for a one-week sprint with a fixed team and clear deadline? Sometimes the best process is no process—just smart people communicating directly and iterating quickly.

The trick is knowing when to apply which philosophy. Context matters more than dogma.

## Appendix

- [IP Discovery code](./code/ip-discovery.zip)
- [Bluetooth Benchmark tool](./code/bluetooth-benchmark.zip)
- [BLE Transmission Scheduler](./code/scheduler.js)
