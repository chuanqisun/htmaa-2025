---
title: "Week 3: Embedded Programming"
date: 2025-09-21
keywords: ["arduino", "digital-electronics", "pcb"]
---

(work in progress)

## Group activity

Before attending the soldering workshop, I met up with Ceci, Eitan, and Miranda to get familiar with the Arduino platform.

We borrowed equipment from Ceci's lab. After a brief intro by Ceci, we fired up Arduino IDE and started programming. The setup was very simple.

Without any peripherals, we tried to make the most out of the jumper wires. I had fun building an "Affective computing" demo where plugging a jumper wire pin into the board causes "ouch" to appear from serial port.

After trying the Arduino official IDE, I tested out VSCoce + PlatformIO. It works with Arduino lacked the driver for \_\_\_ board.

After the group activity, I felt dissatisfied with the workflow: Arduino IDE has limited programming language support. I can't easily look up symbols and header files. Programming feels slow.

I decided to revisit my workflow after the workshop.

From the soldering workshop:

- Use diagnol anchoring
- Need more practice to speed up
- If a mistake doesn't affect functionality, don't correct it. It might get worse.

## Individual

- TODO: Reading data sheet for RP2040
- Run sample programs fron instructors in Arduino IDE.
- So I tested Arduino CLI in VSCode and MicroPython with Thonny for Xiao RP2040. Micropython itself is really good but the RP2040 seems to lack support for loading files. As soon as I start organizing more complex program into multiple files, the lack of a good uploader made it very difficult to use.
- On the other hand, VSCode with Arduino IDE proves to be the most robust solution. Show debug.sh and launch.json files.
- I decided to use this as my main setup.
- I built a basic "cube viewer", spent lots of time tuning the capacitive touch pads
- New mental model: we measure how long it takes to pull up the voltage. Human body slows it down (minor leaks into the "ground").
- I also setup an AI coding environment using copilot instructions. Unlike chat driven development, this strategy creates a human readable source of truth for sharing.
- TODO: use serial port to communicate with a laptop, two-way passing text encaded data

## Final project

- I plan to prototype on ESP32 with networking, see if we can send texts onto the device, wired or wireless
