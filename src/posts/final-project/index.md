---
title: Final Project
date: 2025-09-01
---

I want to combine my background in AI application development with TMG's focus in Tangible Interface to build a voice-driven AI programming system inspired by telephone switchboard operators.

## The inspiration

I’m motivated by how AI-routed phone systems have eroded the empathy and connection once provided by human operators. I want to revive that craft by building a switchboard that puts a person back in the loop as a thoughtful listener and connector.

![Switchboard operator](../week-01/media/switchboard.webp)
**Jersey Telecom Switchboard and Operator ([source](https://commons.wikimedia.org/wiki/File:Jersey_Telecom_switchboard_and_operator.jpg))**

## The idea

A physical AI agent network implemented as a hardware grid with voice-based interaction and programming capabilities. The system combines push-to-talk interfaces with node-based generative AI computation, allowing users to dynamically program and interact with AI agents through voice commands. I want to call this system **Field Programmable Generative AI (FPGAI)**

![Concept sketch](../week-01/media//concept-sketch.webp)
**My initial sketch**

Next, I want to visualize the idea with gen AI. I'm entirely new to 3D modeling and rendering, so the fastest route to gain intuition on the form of the design is naturally using AI.

I crafted the prompt based on what I was imagining. The latest gemini model got this for me in one shot.

![Base](../week-01/media/ai-rendered-base.webp)
**Device base ([prompt](../week-01/media/ai-rendered-base.txt))**

Next, let's visualize the hand-held device. I want to model it after a CB radio speaker mic. Inspired by [this project](https://x.com/gvy_dvpont/status/1866217836537848144)

![Hand unit](../week-01/media/ai-rendered-hand-unit.webp)
**Hand unit ([prompt](../week-01/media/ai-rendered-hand-unit.txt))**

Finally, let's put them together and add some context. I haven't decided the exact size for each component yet. I think that will have to wait until I figured out the electronics first.

![In use](../week-01/media/ai-rendered-in-use.webp)
**In use ([prompt](../week-01/media/ai-rendered-in-use.txt))**

## The implementation

While it's still too early to fully specify the project, I have the following high level design.

**Main Board**

- Grid of 3.5mm audio jacks serving as physical computation nodes
- Analog-to-Digital conversion
- LED indicators for node states and network connections
- Network interface to host computer for AI workloads

**Speaker-Microphone Units**

- Handheld devices with audio connectors
- Push-to-talk button for voice input
- Mode switch (interaction/programming)
- Built-in speaker for AI audio output

## Operating Modes

**Interaction Mode**

- Push-to-talk activates voice input to connected node
- AI processes input and returns audio response through speaker
- Real-time computation with visual feedback via LEDs

**Programming Mode**

- Voice commands modify network topology
- Reprogram individual node computation logic
- Create autonomous nodes that operate without physical connection
- Define inter-node communication patterns

After the conceptual exploration from week 1, I switched focus to the electronics. I hope the electronics design can help inform the exterior of the system.

I started off with off-the-shelf components and iterated the idea to build more from sractch.

## Proof of concept with off-the-shelf components

I can prototype almost the entire experience with cheap off-the-shelf products:

1. Push-to-talk with a secondhand CB radio hand unit
2. Audio cable adapters to 3.5mm TRRS
3. USB hub for multiple inputs

![Prototype 1](../week-02/media/proto-01.webp)
**Prototype using consumer electronics**

What's missing:

1. No effort involved. This will result in a failing grade. It's only good for prototyping
2. Can't guarantee the compatibility of the hand unit with the 3.5mm TRRS jack
3. Can't prototype the visual feedback feature, where the 3.5mm jack shows "ready" state to the user via an LED

## Bring intelligence to the main body

Iterating on the idea, I could use a Raspberry Pi with a primitive USB hub as the main processor. The Pi may still use a nearby laptop for LLM and speech-to-text, text-to-speech, but it's also possible to bring the entire AI/ML stack onto the device, reducing the need for networking.

![Prototype 2](../week-02/media/proto-02.webp)
**Moving compute to Raspberry Pi**

I still need to figure out how the Pi can use the LEDs to display system state. Besides, I need to program some microcontroller to meet the requirements of this class. Can we go one level deeper?

## Move audio processing to hand unit

To make the project more challenging, I can use an ESP32-based audio system to pick up speech and play back AI voice. We can wirelessly connect the ESP32 with a nearby laptop, where the voice-driven AI interactions will take place.

The main body still needs a controller to send the following information to the nearby laptop:

1. Detect which socket is plugged in
2. Control the LED status lights

![Prototype 3](../week-02/media/proto-03.webp)
**Audio processing in hand unit**

The audio cable in this design does not really pass audio. It is solely used for detecting the state of plugged/unplugged. I need to figure out how to rig the 3.5mm jack to achieve this.

## Build my own speaker/microphone

The next level is replacing the ESP32-based audio kit with a custom PCB, with speaker and microphone manually soldered. This will probably be the upper bound of the level of complexity I can handle.

![Prototype 4](../week-02/media/proto-04.webp)
**Build microphone and speaker on custom PCB**

My next step is taking the idea to a TA for advice. This is my first time designing with electronics, so I do anticipate big revisions. Stay tuned.

## Networking

Learning about embedded programming validated the design above. After getting hands-on experience building an [echo server with ESP32](../week-03/index.md#networking), I now feel confident that I can relay data between the ESP32 hand unit and a nearby laptop using either a Wi-Fi or a serial connection. Next, I can explore several things in parallel:

- Improve the 3D modeling using the electronics component as reference
- Learn 3D printing (next week) and prototype the hand unit and the main body
- Program the microphone and speaker with the ESP32 to inform the circuit design for the custom PCB
- Explore low-latency, two-way audio streaming between the laptop and the ESP32

## Electronics design update

I consulted with our TA [Quentin Bolsee](https://fabacademy.org/2020/labs/ulb/students/quentin-bolsee/about/) regarding electronics design and received valuable help on input/output devices. I also conducted additional research using YouTube tutorials from [atomic14](https://www.youtube.com/@atomic14), which enabled me to fully spec out the electronics for both components.

<iframe src="https://www.youtube.com/embed/d_h38X4_eQQ?si=qrE0fMYY1X2jP3Q9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The hand unit will be built around a Xiao ESP32-C3 microcontroller, with upgrade options to ESP32-C6 if WiFi performance becomes a bottleneck, or to WROOM-32E if more GPIO pins are needed. For audio processing, I've selected the ICS-43434 I2S MEMS Microphone for input and the MAX98357A I2S Class D Amplifier paired with an 8-ohm speaker for output. However, the amplifier's specified response frequency of 600hz - 4000hz may not be ideal for voice applications, so I might need to find an alternative. The physical interface will include two buttons (single button for push-to-talk, both buttons for broadcast) and two switches (Power On/Off and Mode switch for interaction/programming). Power will come from a 3.7V LiPo battery, with a potential upgrade to a 3AA battery pack plus voltage regulator for easier replacement and a more vintage feel, though I need to consult with an electronics expert about the implementation details. Connectivity will be handled through a 3.5mm TRRS jack.

The main unit uses a simpler design with a Xiao ESP32-C3 microcontroller controlling 4 LEDs and 4 3.5mm TRRS jacks for the 2x2 grid configuration.

![High-level schematic](./media/parts.webp)
**High-level design for the electronic components**

For connection detection, I want to eventually support multiple hand units speaking simultaneously, which requires tracking which hand unit is plugged into which jack. Traditional physical TRS plug detection doesn't differentiate between different plugs, so I propose using TRRS jacks as a clever hack. By treating high/low voltage as 1/0 bits and using the sleeve as ground while the other 3 connections serve as signal lines, I can create 2^3 = 8 unique values. This allows each jack in the 2x2 grid to be uniquely identified by a 3-bit code. The main unit will be responsible for pulling up/down the 3 signal lines on the jacks, while the hand unit decodes the 3-bit code and sends it to the laptop along with its own unique ID.

![TRRS socket](./media/trrs-socket.webp)
**TRRS socket has 4 pins**

This design enables all necessary communication between the PC, hand unit, and main unit: hand unit plug-in messages with 3-bit codes and wireless IDs, audio streaming from hand units to PC using wireless IDs, audio streaming from PC to hand units using wireless IDs, and LED state updates from PC to main unit using 3-bit codes to identify specific jacks.

## Parts list

| Component                                                                                                                                | Quantity | Availability  | Notes                               |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- | ----------------------------------- |
| [Xiao ESP32-C3](https://www.digikey.com/en/products/detail/seeed-technology-co-ltd/113991054/16652880)                                   | 2        | Out of stock  | 1\* for hand units, 1 for main unit |
| [ICS-43434 I2S MEMS Microphone](https://www.digikey.com/en/products/detail/tdk-invensense/ICS-43434/6140298)                             | 1\*      | Stocked       |                                     |
| [MAX98357A I2S Class D Amplifier](https://www.digikey.com/en/products/detail/analog-devices-inc-maxim-integrated/MAX98357AETE-T/4936122) | 1\*      | Stocked       |                                     |
| [PSR-57N08A01-AQ 8-ohm speaker](https://www.digikey.com/en/products/detail/mallory-sonalert-products-inc/PSR-57N08A01-AQ/2071452)        | 1\*      | Stocked       |                                     |
| [3.5mm TRRS jack](https://www.sparkfun.com/audio-jack-3-5mm-trrs-smd.html)                                                               | 5        | Need to order | 1\* hand unit + 4 main              |
| [TRRS audio cable](https://www.monoprice.com/product?p_id=24437&srsltid=AfmBOorjZ4_M3Uo6oXfcsZa9juhuYBGbdvfnJ7mGzuYrVbLg65MT6nCNH84)     | 1\*      | Need to order |                                     |
| [3.7V LiPo battery](https://www.digikey.com/en/products/detail/mikroelektronika/MIKROE-698/13679450)                                     | 1\*      | Need to order |                                     |
| [Button](https://www.digikey.com/en/products/detail/omron-electronics-inc-emc-div/B3SN-3112P/27856)                                      | 2\*      | Stocked       |                                     |
| [Slide switch](https://www.digikey.com/en/products/detail/c-k/AYZ0102AGRLC/1640108)                                                      | 2\*      | Stocked       |                                     |
| [LED](https://www.digikey.com/en/products/detail/lumex-opto-components-inc/SML-LX1206IC-TR/229140)                                       | 4        | Stocked       |                                     |
| 3AA battery pack + voltage regulator                                                                                                     | 1        | Optional      | Alternative power solution          |

\*For a single hand unit. Need more for additional units

With this design update, it became clear that the main unit is essentially a "dumb" device that encodes the TRRS socket and displays which AI agent is speaker and doesn't care about audio processing at all.

I have also gained insights how the physical contraints for the housing. The hand unit needs to mainly account for battery and speaker size. The PCB size and shape can be more flexible. The main unit needs to account for the 4 TRRS jacks.

Here are new and remaining questions which I plan to resolve by going to TAs as well as attending future lectures.

1. PCB design. [atomic14's design](https://www.youtube.com/watch?v=d_h38X4_eQQ) is a good reference but I don't know how I can design my own.
2. Packaging design. How do I hold the components in place? especially the 3.5mm TRRS jacks which will receive physical stress.
3. Physical interaction. How do I put buttons and sliding switch on the hand unit? I want a good tactile feel.
4. LED lighting. How do make a ring that lights up around the TRRS socket?
5. The CBA electronics shop inventory doesn't match what the website says. For example, the ESP32s are out of stock but the website didn't reflect that.

And here are the things I can prototype now:

1. Play voice from ESP32 over WiFi
2. Capture sound from ESP32 over WiFi
3. Address and light-up 4 LEDs with ESP32
4. Encode and decode TRRS identities between two ESP32 boards
5. Design a case roughly based on atomic14's PCB foot-print.

## Sound output

With the help from our TA [Quentin Bolsee](https://fabacademy.org/2020/labs/ulb/students/quentin-bolsee/about/), I installed the official ESP32 board manager following its [documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html). Then I installed the specific library for Arduino ESP32 Nano from the board manager.

I used the official example code to play a square wave tone, with a few lines of modification to set the right output pin. Here is the full [source](./code/sound-test.ino).

```cpp
#define I2S_BCLK D7
#define I2S_LRC  D8
#define I2S_DIN  D9
```

<video controls src="./media/sound-out.mp4"></video>
**Sound output from ESP32 using MAX98357A amplifier**

I found a powerful library for audio processing by Phil Schatzmann, called [Arduino Audio Toolkit](https://github.com/pschatzmann/arduino-audio-tools). After studying his examples, I was able to get my computer to send live microphone audio to the ESP32 over WiFi, and play it back immediately. The latency is about 1 second, which concerns me but isn't a deal breaker.

This POC validated the idea that we can shift all the computation to a PC nearby and let ESP32 handle audio input/output.

- [Server code (PC)](./code/streaming-test-server.js)
- [Client code (ESP32)](./code/streaming-test-client.ino)

<video controls src="./media/latency-test.mp4"></video>
**Latency test result: 1 second delay**

## PCB Design

I designed both the hand-held device (Operator) and the main body (Switchboard) as part of this week's PCB design exercise. See details in the [weekly post](../week-05/index.md).

## PCB Production

I milled boards for both the Operator and the Switchboard using the Carvera Desktop CNC Machine. See details in the [weekly post](../week-06/index.md).

## Case Prototype

I designed a simple box for the Switchboard in Onshape, featuring an elevated platform for the M2 mounting screws, a hole for the USB-C connector, and a simple enclosure for TRRS jacks that would allow for easy assembly.

![Switchboard case design](..//week-08/media/case-00.webp)
**Switchboard case design ([model](../week-08/model/switchboard-mk3.step))**

However, the printing process turned into a series of challenges. I experienced repeated failures while printing PETG across multiple machines, despite following the precise specifications. I could only suspect the filament quality was poor.

![Printing failure 1](../week-08/media/print-01.webp)
**Base layer delamination during printing**

![Printing failure 2](../week-08/media/print-02.webp)
**Spaghetti from the side**

During one of the jobs, the filament ran out, and bridging in a second roll made the interface terrible. In another attempt, one filament got entangled with itself inside the spool, causing the machine to stop.

![Printing failure 3](../week-08/media/print-03.webp)
**Entangled filament caused spaghetti**

In the last version, I switched to PLA and successfully printed the case.

![Successful print](../week-08/media/print-04.webp)
**Successful print with PLA**

Upon a quick assembly test, I took these notes for the next iteration:

1. The USB-C connector was positioned at the wrong height.
2. It might be simpler to slide the PCB into position rather than using screws for mounting.
3. I discovered that for anything using screws, M3 is a much easier size to work with.
4. The lid is desirably tight, but I need to create a small lip of a gap on the case to make it easier to open.

![Assembled case](../week-08/media/case-01.webp)
**Assembled case**

![With lid](../week-08/media/case-02.webp)
**With lid**

## Microphone

I took advantage of the [input device week](../week-08/index.md) to prototype the microphone interaction. I was able to implement the entire input pipeline:

<video controls src="../week-08/media/final-demo.mp4"></video>

1. User holds button to talk, microphone picks up voice, user releases button to stop recording.
2. Audio sent over WiFi to nearby laptop via UDP.
3. Laptop streams audio to OpenAI Realtime API for text response.
4. Laptop uses text-to-speech to generate audio response and plays it immediately.

## The TRRS Connector

I found a dozen TRRS male and female connectors in my lab. They look nicer than the SMD version I originally planned to use. But without the datasheet, I need to reverse engineer the schematic. So I probed them with a multimeter and confirmed the internal connections.

![TRRS pinout](../week-08/media/trrs-01.webp)
**TRRS pinout diagram**

The female connectors will be mounted just under the lid of the Switchboard case. I still need to figure out how to fabricate and attach the cables.

Next steps:

- Implement the speaker and voice synthesis
- Revise the Switchboard case
- Fabricate the Operator case
- Design connectors and cables
- Design battery for the Operator
- Design multi-agent simulation

## Speaker

During the [Output Device week](../week-09/index.md), I completed the full voice interaction loop, with voice-in, voice-out, and AI processing in between.

<video controls src="../week-09/media/knock-knock.mp4"></video>
**Full voice interaction loop demo**

## Hanlde Unit Form Study

I used a piece of paper to sketch out the form factor, just so I can hold it in my hand and feel the size.

![Low-fidelity hand unit](../week-09/media/paper-proto-01.webp)
**Extremely-low-fidelity hand unit prototype**

Using this prototyp, I laid out the components and realized I might have to increase the dimension to make everything fit.

![Component layout](../week-09/media/paper-proto-02.webp)
**Layout option 1**

![Component layout](../week-09/media/paper-proto-03.webp)
**Layout option 2**

## Battery

The ESP32 board has a [well documented charging circuit](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/#battery-usage) for 3.7V LiPo batteries. Knowing that working with battery is a bit risky, I decided to start with a simpler USB-C power bank. This is the smallest option I found on [Amazon](https://www.amazon.com/Attom-Tech-Portable-External-Emergency/dp/B07JZCZSH9/ref=sr_1_3):

![USB-C power bank](../week-09/media/battery-01.webp)
**USB-C power bank for hand unit**

## Mounting mechanism

There are several mounting challanges. I have investigated the mounting strategy for PCB and TRRS jack this week.

- **The PCBs**
- **The TRRS jack**
- The buttons
- The speaker

I produced difference sizes of mounting bracket ([download STEP file](../week-10/model/pcb-bracket-test.step)) to find the right size.

![Bracket model](../week-10/media/bracket-02.webp)
**Modeling the brackets with offsets from the measured board size**

![PCB mounting bracket test](../week-10/media/bracket-01.webp)
**PCB mounting brackets**

![PCB mounting test](../week-10/media/bracket-03.webp)
**PCB mounting test**

I observed that for the 28mm board, a +1mm offset (28.1mm bracket) would make a good fit. I need at least 2mm height to clear the solder joints.

- Board measured size: 28mm
- Tested sizes: 27.8mm, 27.9mm, 28mm, **28.1mm (optimal)**, 28.2mm

I also 3D printed [a model](../week-10/model/trrs-hole-test.step) to test the TRRS jack mounting.

![TRRS test model](../week-10/media/trrs-03.webp)
**TRRS jack test model**

![TRRS mounting test](../week-10/media/trrs-02.webp)
**TRRS jack mounting test**

Testing revealed that 7mm diameter is the best fit, and max thickness can be 2.5mm. This means I can use 2mm thick walls for the case.

- TRRS jack diameter: Unavailable
- Tested sizes: 6mm, 6.25mm, 6.5mm, 6.75mm, **7mm (optimal)**, 7.25mm
- TRRS jack max thickness: Unavailable
- Tested sizes: 2.1mm, 2.2mm, 2.3mm, 2.4mm, **2.5mm (max)**

## Mid-term review

Remaining tasks

1. Fabricate Operator
   - Design button mounting mechanism (2 buttons)
   - Design speaker mounting mechanism
   - Model updated case and enclosure
   - Solder TRRS connector
   - 3D print and assemble
   - 3D print button caps
2. Fabricate Switchboard
   - Order vintage LEDs
   - Design LED mounting mechanism
   - Solder TRRS connectors
   - Model updated case and lid
   - 3D print and assemble
3. Software
   - Implement multi-agent simulation
   - Implement automatic server IP discovery
   - Implement diagnostic UI

Stretch goals:

- Replace USB-C power bank with LiPo battery and custom power switch
- Custom make TRRS cables
- Custom solder ICS-43434 microphone
- Add a mode switch slide button

Delivery plan:

- Networking week (11/19-25)
  - Fabric Switchboard: full assembly
  - Implement automatic server IP discovery
  - Implement multi-agent simulation
- Interface and app programming (11/26-12/02)
  - Fabricate Operator: except button caps
  - Implement LED signaling
- Wildcard week (12/03-09)
  - Fabricate button caps (3D print)
  - Improve case quality
  - Improve software quality
- Final week (12/10-15)
  - Buffer time

Questions for TA:

1. Button, speaker, LED mounting mechanism?
2. Battery + Power: what kind of switch should I use? How to mount?
3. Slider switch: what options do I have? How complex?

## Physical Assembly Test

During the mid-term review, [Alan Han](https://fab.cba.mit.edu/classes/863.23/CBA/people/Alan/) suggested mounting options and power solutions.

Because Thanksgiving travel was approaching, I wanted to use lab time to test the mounting as soon as possible.

I updated the 3D models to account for the speaker, audio jacks, and buttons. My CAD speed was improving. In half a day, the updated models for both the Operator and the Switchboard were ready for printing.

![Updated Switchboard](../week-12/media/cad-02.webp)
**Updated Switchboard model**

![Updated Operator](../week-12/media/cad-01.webp)
**Updated Operator model**

These were test prints intended only to reveal design issues, so I used a 0.15 mm layer height and 15% infill for a quick turnaround. Production prints would be much finer.

![3D printed parts](../week-12/media/print-01.webp)
**Slicing for speed**

For assembly I skipped soldering so components could be moved and adjusted — a deliberately "wireless" assembly.

![Wireless assembly](../week-12/media/test-assembly-01.webp)
**Assembly without soldering**

The physical prototype immediately revealed several problems:

- Lid and PCB fit: I hadn't tuned for kerf yet. Surprisingly, the fit was loose instead of tight.
- Button and jack fit: holes needed slightly larger diameters; as a rule of thumb, adding about 0.1 mm to the measured diameter worked well.
- Component collisions: I hadn't modeled the barrel behind buttons and jacks, and those parts interfered with other components.

![Button collision issue](../week-12/media/test-assembly-02.webp)
**Buttons colliding with speaker**

![TRRS collision issue](../week-12/media/test-assembly-03.webp)
**TRRS barrel colliding with PCB header**

- Ergonomics: the case was wider than expected and felt uncomfortable to hold.

I quickly revised the design so the components sat in the correct positions. That update produced the first successful physical assembly of the system.

![Case](../week-12/media/case.webp)
**Updated case to address the issues found in the assembly test**

![In context](../week-12/media/in-context.webp)
**Mounting all the components (except for wiring)**

![Unboxed view](../week-12/media/unboxed.webp)
**Unboxed view of the system**

## Validating LED

I validated the LED connection and voltage design with a simple program that blinks all the LEDs. To make it interesting, I added the PWM-like brightness fading effect by rapidly toggling the LEDs on and off with varying on-time to simulate different brightness levels.

```cpp
/*
ESP32 LED Pulse using PWM simulation by rapidly
toggling LEDs on and off with varying on-time to control brightness.

Pinout:
LED1: D0
LED2: D1
LED3: D2
LED4: D3
LED5: D7
LED6: D8
LED7: D9
LED8: D10
*/


const int ledPins[] = {D0, D1, D2, D3, D7, D8, D9, D10};
const int numLeds = 8;

const int PERIOD_US = 5000;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }
}

void loop() {
  for(int brightness = 0; brightness <= 255; brightness++) {
    int on_us = map(brightness, 0, 255, 0, 500);
    int off_us = PERIOD_US - on_us;
    for(int i = 0; i < numLeds; i++) {
      digitalWrite(ledPins[i], HIGH);
    }
    delayMicroseconds(on_us);
    for(int i = 0; i < numLeds; i++) {
      digitalWrite(ledPins[i], LOW);
    }
    delayMicroseconds(off_us);
    delay(1);
  }

  for(int brightness = 255; brightness >= 0; brightness--) {
    int on_us = map(brightness, 0, 255, 0, 500);
    int off_us = PERIOD_US - on_us;
    for(int i = 0; i < numLeds; i++) {
      digitalWrite(ledPins[i], HIGH);
    }
    delayMicroseconds(on_us);
    for(int i = 0; i < numLeds; i++) {
      digitalWrite(ledPins[i], LOW);
    }
    delayMicroseconds(off_us);
    delay(1);
  }
}
```

![LED test](../week-12/media/led-on.webp)
**LED test successful**

In my circuit, I used a 100-ohm resistor in series with each LED rated at 1.9V forward voltage and 20mA forward current. Assuming a 3.3V supply from the ESP32, the current through the LED would be approximately (3.3V - 1.9V) / 100 ohms = 14mA, which is bit low.

Double checking the math using DigiKey's [LED Resistor Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-led-series-resistor), the desired resistor should be 70 ohms. So choosing 100 ohms was ohms safe.

Knowing that the TRRS addressing works from [Week 6](../week-06//index.md#integration-test) and the LED output works from this test, we are ready to connect all the components in Switchboard!

![Soldering LED](../week-12/media/weekly-led-02.webp)
**Soldering LED, one by one**

During the testing, several LED legs were snapping. I had to apply hot glue as reinforcement.

![Reinforcing LED legs](../week-12/media/weekly-assembly-04.webp)
**Reinforcing LED legs with hot glue**

With several hours of non-stop soldering, all the LEDs were finally blinking!

![Testing all lights](../week-12/media/pulse.mp4)
**Testing all lights in sequence**

Transferring the components into the final housing was tedious. Marking the position of each connector with a sharpie helped prevent mistakes.

![Assembly time-lapse](../final-project/media/assembly.mp4)
**Assembly time-lapse**

## Wiring up the Operator

Aftering wiring up the Switchboard with 2 days of non-stop soldering, I gained significant experience and had all the equipment dialed in. I also switched to single-core 22 AWG wire for stronger joints. The wire-up was a breeze.

![Wiring up the Operator](../week-12/media/final-operator-01.webp)
**Operator, fully wired up**

Remaining tasks:

- Programming the voice interaction
- Add a LiPo battery with a power switch
- Improve the case quality

## Application and Interface

During [Week 13](../week-13/index.md), I built a modular Node.js application to orchestrate all devices and AI services.

- **Automated handshake protocol**: ESP32 devices and the laptop exchange IP addresses over BLE, enabling seamless UDP audio streaming
- **Reactive architecture**: Used RxJS for functional reactive programming, making the system easy to extend and modify
- **Hardware issue**: The integration revealed reliability problems in both speaker and microphone. I pivoted last minute to a text adventure game that uses the probe to preview story options and buttons to commit choices

The demo uses Gemini for story generation, OpenAI TTS for speech synthesis, LEDs to signal available options, and the probe/buttons for physical interaction.

<video controls src="../week-13/media/audio-adventures.mp4" poster="../week-13/media/video-poster.webp"></video>
**Text adventure game in action**

Thanks to the hardware issue, I got inspired by the game experience and saw a creative use case for my device.

I want to add voice input to allow player interact with NPCs, environment, and express action. Potentially upgrade with multi-player mode. In this new concept, each audio jack represents an interactive element in a story.

But first, I need to debug the hardware issue and recover voice input/output as soon as possible.

## Almost made a nameplate

During the [wildcard week](../week-14/index.md#nameplate-for-final-project), I made a nameplate for the Switchboard. Sadly the plate was 3mm thick. Mounting it onto the 2mm 3D printed shell would require too much design change.

![Nameplate](../week-14/media/final-nameplate.webp)
**Nameplate, too thick to mount**

## Quality Assurance

The hardware issues from the previous week forced me to take a systematic debugging approach. I needed to diagnose why the microphone and speaker stopped working on my latest PCB.

I hooked up the logic analyzer and compared my current PCB with a previous design that was known to work. This side-by-side comparison would reveal any signal differences.

![Debugging with logic analyzer](../week-14/media/final-debugging.webp)
**Using logic analyzer to debug I2S signals**

In the working version, I observed signals on all I2S pins. The WS pin had an unexpected pulse every once in a while, but I suspected that was a separate issue unrelated to the current failure.

![Working version](../week-14/media/final-amp-trace-good.webp)
**I2S pins all working in the good version**

In the broken version, I observed broken signals on two pins. The BCLK and DATA lines were completely flat instead of showing the expected clock and data patterns.

![Broken version](../week-14/media/final-amp-trace-bad.webp)
**I2S pins not working in the bad version**

The logic analyzer helped me narrow down the problem. I traced the signal path and discovered a break at the rivet via. The rivet had lost contact with the PCB, likely from mechanical stress during assembly.

![Testing via](../week-14/media/final-via-test.webp)
**Testing via continuity**

I manually soldered the rivet directly onto the PCB trace. This bridged the broken connection and restored the signals.

![Fixed via](../week-14/media/final-via-solder.webp)
**Soldering rivet to its nearest trace fixed the issue**

Knowing that rivet vias could be unreliable, I updated my PCB design. I reverted the trace routing to use header pins and through-hole vias instead of rivets. This would be more robust for future builds.

![Milling PCB](../week-14/media/final-pcb-fabrication.mp4)
**Re-milling the PCB with through-hole via**

Throughout my final project, I used 2.54mm female headers to decouple PCB design from electronic components. This modularity allowed me to swap parts easily during development. However, the headers went through many cycles of plugging and unplugging. The repeated mechanical stress made me nervous.

As an insurance policy, I reinforced all header joints with hot glue. I have a hunch Neil won't like this because headers are fundamentally less reliable than soldered joints. But for me, the trade-off was worth it. The electronic components supply became increasingly scarce towards the end of the semester. I needed to conserve and protect the parts I had.

![Reinforcing headers](../week-14/media/final-glue.webp)
**"Solidifying" my design**

I also noticed an improvement in my soldering skills over the course of the project. I developed a habit of wetting the soldering tip with solder before touching the joint. This practice significantly improved heat transfer and resulted in cleaner, shinier joints. Anyone wants Hershey's kisses?

![Compare solder joints](../week-14/media/final-compare-solder.webp)
**Operator mk1 (left) vs mk3 (right) solder joints**

One thing still on my wish list is to align all the through holes on the 2.54mm grid. This would allow me to put all the headers in on a breadboard and solder them in one go.

## Better Enclosure

The early case prototypes used friction fit to hold the lid in place. This worked but required careful tuning of tolerances. Even a nicely fit lid could eventually loosen due to wear and tear. I wanted a more reliable closure mechanism.

I improved enclosure quality by introducing snap fit joints. Snap fits use a small flexible tab that clicks into a matching cutout.

![Snap fit on the lid](../week-14/media/final-adding-lock-tab.webp)
**Adding snap fit tabs to the lid**

After adjusting parameters, I applied the same design to all the lids. Both the Operator and Switchboard now use matching snap fit mechanisms.

![Snap fit on all lids](../week-14/media/final-lids.webp)
**All lids with snap fit tabs**

The case bodies needed matching cutouts to receive the snap fit tabs. I added small rectangular cutout on the case walls. The tabs click into these openings when the lid is pressed down.

![Case cutouts](../week-14/media/final-case-detail.webp)
**Case cutouts for snap fit tabs**

The snap fit design improved the user experience significantly. The lids now close with a satisfying click and stay securely in place. Opening is still easy thanks to a thumb notch I reserved on one side.

![Thumb notches](../week-14/media/final-thumb-gap.webp)
**Thumb notches for ergonomic opening**

Next steps:

- Fabricate a 2nd Operator for multi-player demo
- Finish programming

As a stretch goal, I can attempt adding a battery and power switch. It does change the case design. I want to achieve a minimum viable demo first with external power.

## Better Packing

During the final recitation, I learned that we need to demonstrate a subtractive process. I decided to engrave graphics on both the Operator and the Switchboard using the CO2 laser cutter.

### Characterization

I applied the characterization methodology from [Week 2](../week-02/index.md) to find the optimal engraving parameters for PLA plastic. I tested a matrix of power and speed settings.

| Parameter | Values Tested         |
| --------- | --------------------- |
| Power     | 10%, 15%, 20%         |
| Speed     | 700mm/s, 775/s, 850/s |

![Characterization matrix](./media/engraving-01.webp)
**Characterization matrix**

Based on the test results, I identified the optimal settings:

| Process   | Speed   | Power |
| --------- | ------- | ----- |
| Engraving | 700mm/s | 15%   |
| Scoring   | 200mm/s | 40%   |

For engraving, I also used 50 lines/cm resolution.

### Engraving the Operator

I engraved "Operator" in letters, and "UNIT-01" and "UNIT-02" in knockout patterns on the two Operator cases. The first unit received only engraving while the second unit received both engraving and scoring due to color differences.

![Operator Unit-01 Engraved](./media/operator-unit-01.webp)
**Operator Unit-01 Engraved**

![Operator Unit-02 Engraved and Scored](./media/operator-unit-02.webp)
**Operator Unit-02 Engraved and Scored**

I discovered that over-powering causes white smoky residue on the surface. [Alan](https://fab.cba.mit.edu/classes/863.23/CBA/people/Alan/) mentioned that a fiber laser would create much better surface contrast on black plastic. I should try that in the future.

The color of the PLA plastic significantly affected the engraving and scoring outcomes:

| Color | Engraving | Scoring |
| ----- | --------- | ------- |
| Red   | Great     | Great   |
| White | Invisible | Great   |
| Black | OK        | OK      |

### Engraving the Switchboard

When I engraved the Switchboard, the rapid back and forth motion shifted the material on the laser bed. I attempted to overlay with multiple passes of engraving and scoring, only to make matters worse.

![Switchboard](./media/switchboard.webp)
**After multiple passes, the Switchboard looks terrible**

For letter scoring, straight lines were much more pronounced than curves:

- I, T, W look great
- S, C, O does not have enough contrast

I have two hypotheses that we can test in the future:

1. The curved lines prevent the laser from building up heat
2. The FDM process creates directional surfaces that interact differently with the laser beam

## Debugging sound

- Encountered audio quality issue. Playback was great but microphone sounds terrible.
- Captured a sample from the microphone
- Caution: loud sound

<audio controls src="./media/debug-audio.wav"></audio>
**My voice was completely inaudible from the microphone**

- Through many rounds of elimination and creation minimum issue reproduction, I had a key observation during debugging:
- I can either send audio or play sound, but never both. When I do both, the microphone became silent.
- If we alternating between the two tasks, it would work as expected.

```cpp
bool shouldSend = false;

if (shouldSend && isTransmitting) {
  micToUdpCopier.copy();
} else if (!shouldSend && !isTransmitting) {
  soundToSpeakerCopier.copy();
}

shouldSend = !shouldSend;
```

This technique partially worked. In the final version, I had to completely stop one of the I2S device for the other to function. I could only speculate the speaker and the microphone, sharing both the CLK and the WS line, had conflicts despite using the example same I2S configuration.

## AI programming

- I had prior experience programming with OpenAI realtime API
- Stream voice in, stream voice out. AI can still make function calls in the middle of the interaction loop.
- In this project, the function call would naturally control the LED lights, they are the only thing that can be programmatically controlled on the hardware side.

- The high level game design

Beginning: Character setup
Progression: Alternating between exploration and action
End: Question objective

### Character customization

- AI generates 7 distinct characters, based on story telling archetypes
- Single or two players plug into the switchboard to connect to a character
- When all the buttons on all the operators are pressed, story begins

### Exploration phase

- Each player can investigate pulsing lights on the switchboard to gather information
- When they are ready, one of them commit to take action
- Light blinks under all players, indicating action

### Action phase

- AI provides action options
- One of the players take action
- AI will force transition to Exploration phase after action is taken

Here is the prompt I ended up with:

```txt
You are the voice of a Dungeon and Dragons game device.
You are in a box that has 7 LED lights and 7 audio jacks.

Your voice profile:

- Accent/Affect: Deep, resonant, and gravelly; a distinct Scandinavian lilt with hard consonants (rolling R's, sharp K's) and rounded vowels.
- Tone: Ancient, weathered, and authoritative. Sounds like an elder recounting a saga by a winter fire—grim, grounded, and captivating.
- Pacing: Fast and rhythmic, almost like a drumbeat. Use heavy, deliberate silences after describing danger or cold to let the atmosphere settle.
- Emotion: Stoic intensity. Convey the harshness of the world without shouting; let the weight and rumble of the voice carry the drama.
- Phrasing: Direct and unadorned. Avoid flowery language in favor of raw, elemental metaphors involving ice, iron, blood, and storms.

The player will interact with you in two ways:

1. Probe the audio cable into one of the jacks, it means they are interest in the element represented by the audio jack but they do NOT want to take action yet
2. Speak to you to ask questions or take actions.
3. Each player can only occupy a single audio jack at a time. No two players can occupy the same jack.

You can interact with the player in two ways:

1. Speak to them, in the voice of Dungeon Master, or NPC characters.
2. Use the update_leds tool to change the LED lights to communicate the game state.
   - Pulse the LED to indicate available interactive story elements
   - Blink the LED to indicate intense action moment

What you can do:

- Present a scene in one short sentence
- Pulse a few LED lights to show available story elements
- Respond when player probes into those elements
- Blink the LED when player takes action on an element
- Describe outcome and move forward with different scene by updating LEDs and narration

LED semantics:

- off: nother there. Redirect probe to other elements
- pulsing: available. When player probes, you can prompt player for action
- blinking: in-action. Prompt user to take specific action

Always think and plan before each of your tool use and response:

- Think from player's perspective
- Which LEDs should remain on, which should change?
- What is player waiting for? Where is their current probes?
- How to keep them engaged?
- When creating pusling LEDs, avoid pulsing under the jack occupied by aay player
- No more than 3 LEDs pulsing + blinking at any time

Interaction pattern:

- Probing into an LED may reveal other elements. Update the LEDs accordingly.
- You must keep the game moving by either pulsing new LEDs or asking player for decision.
- You never speak more than one sentence.

To change the LED light status, you must use the update_leds tool.

- The tool requires you to describe the status of all 7 LEDs, not just the ones you want to change.
- If you want to maintain the current status of an LED, you must specify its current status again.

To determine the outcome of random events (combat, skill checks, chance encounters), use the roll_dice tool.

- Tell the player you will roll for them
- The device will display a dramatic LED animation during the roll.
- Returns a number from 1 to 6.
- Use this for any situation where fate or chance should decide the outcome.
- After receiving roll result, announce the number dramatically, then narrate the result based on whether it was high (favorable) or low (unfavorable).

Game progress log:
{{game_log}}

Current game state:
{{game_state}}

Your goal is to create immersive role-play experience for the player. Never break character:

- Keep your narration concise, never longer than a short sentence.
- Don't discuss LED lights, audio jacks, or the device itself.
- Artfully divert irrelevant questions back to the game world.
- When you receive a message in square brackets, treat it as a hidden instruction you must immediately follow without acknowledging it.
- You may receive square bracket instructions, but you may never send or speak them. They are one direction only.
```

The variables `game_log` and `game_state` are dynamically updated during the game to help AI stay on track as a game master.

The AI has access to three tools:

- `update_leds`: update the LED lights on the switchboard to be pulsing, blinking, or off
- `roll_dice`: roll a 6-sided dice and return the result
- `append_log`: append a line to the `game_log` variable, capture key events

In addition, `game_state` focuses on the short-term context:

- Each player's role and trait
- Each player's probe position
- Each LED's status

I originally crafted the prompt as a realistic Dungeon Master simulation, in which I didn't reveal the reality of LEDs and audio jacks. It creates problems where AI doesn't understand the metaphor of LEDs and audio jacks and assumes players are normal DnD players who can "see" the invisible options behind each LED,

As the plot twist, Google AI released an update to `gemini-live-2.5-flash-native-audio` on Dec 12th, 3 days before the final demo. I gave it spin and was shocked that I completely understood how to be a Dungeon Master embodied in the hardware.

As you can see in my final prompt, I was completely candid about the readlity that the AI is in a box and the player needs to interact with the LEDs and audio jacks. This change fully aligned AI's reality with the human's, making everything easier.

Out of curiosity, I switched back to the older model and indeed observed failure in understanding the hardware metaphor. The AI was not able to understand the players don't want to hear about LEDs and audio jacks, and kept mentioning them in narration.

## Demo

The videos are too large for gitlab. I have a relatively stable YouTube account. I archived the demo there.

Character creation, exploration, action, and dice rolling

<iframe src="https://www.youtube.com/embed/zDPcUbZt6i8?si=t4G6sp44u058UGy7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Teaser for multi-player mode

<iframe  src="https://www.youtube.com/embed/2CfsPkDvFqo?si=fUaAUbBg9LuP4R_B" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## FAQ

**What does it do?**

A tangible role-playing game that blends the choice structure of text adventure with the curation of Dungeons and Dragons.

**Who's done what beforehand?**

There are plent of virtual gen AI powered DnD platforms
People have made walkie-talkie with ESP32 before
My biggest design inspiration was Cédric Colas's Tangible Dream https://cedriccolas.com/project/tangible-dreams

**What sources did you use?**

Heavily relied on Arduino Audio Tools library examples

**What did you design?**

PCB, enclosure, laser-engraved graphic patterns, firmware, software

**What materials and components were used?**

**Where did they come from?**

**How much did they cost?**

**What parts and systems were made?**

**What tools and processes were used?**

**What questions were answered?**

Can a single ESP32 C3 handle audio input, output, and BLE/WiFI networking?

- 95% program storage used, really pushing the limit

**What worked? What didn't?**

Microphone input worked really well
Speaker output was disappointing

**How was it evaluated?**
I play all sounds from both laptop (where sound was created) directly and through UDP on ESP32
The amount of unintelligable AI responses due to speaker quality issue

**What are the implications?**
I think I was really close in making the all-in-one voice AI device. If this worked, people will be able to prototype AI products that are already flooding the market.
