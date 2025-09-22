---
title: "Week 3: Embedded Programming"
date: 2025-09-21
keywords: ["arduino", "digital-electronics", "pcb"]
---

(this post is a work in progress)

## Group activity

Before attending the soldering workshop, I met up with [Ceci](https://fab.cba.mit.edu/classes/863.25/people/CeciliaMarsicovetereFanjul/), [Eitan](https://fab.cba.mit.edu/classes/863.25/people/EitanWolf/), and [Miranda](https://fab.cba.mit.edu/classes/863.25/people/MirandaLi/) to get familiar with the Arduino platform.

We borrowed equipment from Ceci's lab. After a brief intro by Ceci, we fired up Arduino IDE and started programming. The setup was very simple.

![Arduino Mega](./media/group-activity-04.webp)
**Testing Arduino Mega**

After trying the official [Arduino IDE](https://www.arduino.cc/en/software/), I tested out VSCoce + [PlatformIO](https://platformio.org/). It supports a wide variety of platforms and boards.

![PlatformIO](./media/group-activity-05.webp)
**PlatformIO runs inside VS Code**

I'd love to stay in the VSCode environment because I can use all of my familiar editor extensions as well as GitHub Copilot for AI assisted coding. But I soon realized that not all boards are supported. For example:

![Missing driver](./media/group-activity-01.webp)
**NUCLEO H743Z12 is imcompatible with PlatformIO**

Without any peripherals, I tried to make the most out of the jumper wires. I had fun building an "Affective computing" demo where plugging a jumper wire pin into the board causes "ouch" to appear from serial port.

<video src="./media/group-activity-02.mp4" controls></video>
**Single jumper wire interaction ([source](./code/jumper-wire/jumper-wire.cpp))**

After the group activity, I felt dissatisfied with the workflow: Arduino IDE has limited programming language support. Compared to the TypeScript and Node.js ecosyste I'm familiar with, I can't easily look up symbols and `.h` header files in any of the tools above. Programming feels slow.

I attended soldering workshop next. The only experience I had was soldering the GPIO header onto a Rasperry PI nearly 10 years ago. I had much to learn.

![Soldering result](./media/solder-annotated-01.webp)
**My first soldering attemp**

The photo above encoded two of the my lessions:

- Start with corners to stablize the chip, then solder the rest of the contacts. See purpose circles.
- If there is a mistake that doesn't affect functionality, leave it. Trying it fix it could make it worse. See green circle.

My soldering was working upon first attempt. I moved on to programming the board.

## Individual project

Reading the [data sheet for RP2040](https://files.seeedstudio.com/wiki/XIAO-RP2040/res/rp2040_datasheet.pdf). It was overwhelming. I'm thanking the Arduino library has taken care most of the low level details regarding clock, memory, I/O. I had the mental model that JavanScript and Python are high level programming, and C is low level programming. Reading the datasheet gave me concrete examples of what low level programming actually involves. Definitely a humbling moment for me.

Practically speaking, I think the datasheet is not a textbook. I can read it from cover to cover. It is more useful as a reference when I have a specific question to ask or a problem to solve.

Next, I compiled and loaded the [sample programs](https://gitlab.cba.mit.edu/quentinbolsee/qpad-xiao) from [Quentin](https://quentinbolsee.pages.cba.mit.edu/home/) with Arduino IDE. The touch pad was blinking LED, the OLED was saying "Hello world". It's time to build something myself.

The idea was simply "fuse" together the [touch pad code](https://gitlab.cba.mit.edu/quentinbolsee/qpad-xiao/-/blob/main/code/Arduino/test_touch_RP2040/test_touch_RP2040.ino?ref_type=heads) and the [OLED display code](https://gitlab.cba.mit.edu/quentinbolsee/qpad-xiao/-/blob/main/code/Arduino/test_display_RP2040/test_display_RP2040.ino?ref_type=heads). I could have done this in ChatGPT but it would be too much copy pasting. Can I get VSCoce and GitHub Copilot to work?

So I tested [Arduino CLI](https://github.com/arduino/arduino-cli) in VSCode as well as [MicroPython](https://wiki.seeedstudio.com/xiao_esp32c3_with_micropython/) with [Thonny IDE](https://thonny.org/) for Xiao RP2040. Micropython itself is really good but the board I had seems to have issue with connecting to the OLED. In addition, as soon as I start organizing more complex program into multiple files, the lack of a good multi-file uploader made coding in python very inconvenient.

![Thonny IDE](./media/python-01.webp)
**Thonny IDE was good for simple python programming**

In the end, I landed on VSCode + Arduino CLI, and wrote a shell script to simplify debugging:

```sh
#!/bin/bash
arduino-cli compile -b rp2040:rp2040:seeed_xiao_rp2040 "$CURRENT_FILE_PATH"
arduino-cli upload -p /dev/ttyACM0 -b rp2040:rp2040:seeed_xiao_rp2040 "$CURRENT_FILE_PATH"
arduino-cli monitor -p /dev/ttyACM0
```

Here is the corresponding VS Code `.vscode/launch.json` settings file that lets you press <kbd>F5</kbd> to start debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "./debug.sh",
      "name": "deploy to device",
      "request": "launch",
      "type": "node-terminal",
      "cwd": "${workspaceFolder}",
      "env": {
        "CURRENT_FILE_PATH": "${fileDirname}"
      }
    }
  ]
}
```

This is by far the most productive setup. Here is my full comparison

| Workflow                     | Pros                                                                            | Cons                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Arduino IDE**              | • Official support<br>• Simple `.ino` format                                    | • Limited IDE features<br>• Unintuitive keyboard binding                                                                               |
| **VSCode + PlatformIO**      | • Community support for many platforms and boards<br>• Good VS Code integration | • Lack of extensibility when your board is not supported                                                                               |
| **MicroPython + Thonny IDE** | • Simple for Python programming                                                 | • Poor support for Xiao RP2040<br>• Poor multi-file support<br>• Requires bootloader firmware<br>• Poor performance due to interpreter |
| **VSCode + Arduino CLI**     | • Can use best of both VS Code and Arduino ecosystem                            | • Serial port monitoring is not as robust as Arduino IDE                                                                               |

I built a basic "cube viewer" using VSCode + Arduino CLI.

<video src="./media/cube-01.mp4" controls></video>
**Cube viewer**

- Source code
  - [app.ino](./code/cobe-viewer/app.ino)
  - [lib-01-touch.ino](./code/cobe-viewer/lib-01-touch.ino)
  - [lib-02-led.ino](./code/cobe-viewer/lib-02-led.ino)
  - [lib-04-screen.ino](./code/cobe-viewer/lib-04-screen.ino)

I spent lots of time tuning the capacitive touch pads to achieve the balance of sensitivity and debouncing. This is the core logic of my capacitive sense, adapted from Quentin's code

```cpp
#define THRESHOLD 10
const unsigned long RISE_COUNT = 50; // max count for touch read

void detect_touch() {
  int t;
  int p;

  for (int i = 0; i < N_TOUCH; i++) {
    p = touch_pins[i];

    pinMode(p, OUTPUT); // pull down voltage
    digitalWriteFast(p, LOW);

    delayMicroseconds(25); // wait for it to actually go down

    noInterrupts();

    pinMode(p, INPUT_PULLUP); // pull up voltage

    // measure how many ticks for voltage to actually reach high
    t = 0;
    while (!digitalReadFast(p) && t < RISE_COUNT) {
      t++;
    }
    touch_values[i] = t;

    interrupts();

    pin_touched_past[i] = pin_touched_now[i];
    pin_touched_now[i] = touch_values[i] > THRESHOLD;
  }
}
```

My biggest learning is that we measure how many for-loop cycles it would take to pull up the voltage. Human body would slow down the process because current is "leaking" through our finger. And if it takes more the `THRESHOLD` amount of ticks to reach high, we can assume touch.

I also setup an AI coding environment using copilot instructions. Unlike chat driven development, my strategy is maintain a human readable source of truth for [instructing copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions?tool=vscode). You can recreate this environment with the following instruction files:

- [.github/instructions/coding.instructions.md](./code/coding.instructions.md.txt)
- [.github/instructions/oled.instructions.md](./code/oled.instructions.md.txt)
- [.github/instructions/project.instructions.md](./code/project.instructions.md.txt)

I was planning to use serial port and the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) to render the same 3D cube in the browser. Unfortunately, the OLED screen was ripped off during transport in my bag. I will need a new board.

![Broken screen](./media/damaged-01.webp)
**Broken OLED screen, bummer**

Given the limited time left, I went ahead to find another ESP32 chip in my lab and tested its wireless capabilities. I generated a program with copilot to run the ESP32 as a wife access point.

![ESP32](./media/wifi-01.webp)
**Smallest WiFi access point + web server**

I was able to see the access point on my laptop as well as smartphone.

![Access point](./media/wifi-02.webp)
**Access point visible to my laptop**

Opening the server, I can send a message to ESP32 and see it echoed back.

![Echo](./media/wifi-03.webp)
**Echo test success**

Here is [the full program](./code/echo-server/echo-server.ino) of the echo server. It was based on the [official demo](./code/simple-web-server/simple-web-server.ino), modified with a short [AI prompt](./echo-server-prompt.txt). As web developer, I wish there is a mature framework to serve the HTML pages, JSON payloads, as well as binary streams. I will need these capabilities for my final project.
