---
title: "Week 5: Into the Matrix"
date: 2025-10-04
keywords: ["electronics", "pcb", "simulation"]
---

## Group assignment

- For group assignment, Alan explained poweer supply, multimeter, oscilloscope, function generator, and logic analyzer.
- I used my own project to study the logic analyzer. The device used MAX98357A as DAC and amp but the had issue producing sound.
- Debugging session with the TAs (Nikhil and Alan)
  - We ruled out power issue: observed stable power voltage.
  - Ruled out connection issue: all the lines: clock, channel, and data are normal
  - Found low voltage on speaker
  - Eventually realized the bug was software. The diagnostic tool was helping in eliminating hardware issues.

During the testing, we noticed that the plugging in/out of probes can interfere with the I2S signal. Presumably because of the motion of the probes causing inductance change, which in tern, distorted the clock or data line.

![Hooking up logic analyzer probes](./media/debug.webp)
**Hooking up logic analyzer probes**

We used saleae Logic 2 analyzer with the [companion software](https://www.saleae.com/pages/downloads?srsltid=AfmBOootFb68Y2L5odb06p_WkZ1gnm-TIDW_Hhu8xv7w9I_agw8oQwBw). The tool can visualize both digital and analog signals and allowed us to choose a protocol and decode the data. Very helpful.

![Visualize data](./media/logic-analyzer.webp)
**Visualize data**

## PCB design
