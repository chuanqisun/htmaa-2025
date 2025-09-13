---
title: "Week 2: Making The Cut"
date: 2025-09-11
keywords: ["cutting"]
---

## Group Assignment: Characterizing the Laser Cutter

### Introduction

I joined force with [Miranda](https://fab.cba.mit.edu/classes/863.25/people/MirandaLi/) and [Ray](https://fab.cba.mit.edu/classes/863.25/people/RaySong/) to study the kerf characteristics of the laser cutter. After receicing the demo and training from the lab manager, we selected the xTool P2 desktop laser cutter for its usability:

- Camera-guided UI was very easy to use
- Built-in templates for creating a test grid with varying parameters
- One-click auto-focus

![XTool UI](./media/xtool-ui.webp)
**One-click to set laser focus**

### Finding the Optimal Cutting Power

We began by determining the minimum power required to cut through our material. Using the default speed of 16mm/s, we tested power settings from 10% to 100% in 10% increments.

![Power testing](./media/power-test.webp)
**Visualize how power affects cutting**

| Power (%) | Cut Through?   |
| --------- | -------------- |
| 10        | No             |
| 20        | No             |
| 30        | Yes (minimum)  |
| 40        | Yes (selected) |
| ...       | Yes            |
| 100       | Yes            |

**Result:** We found 30% to be the minimum power for complete cutting. To account for variance, we selected 40% for all subsequent tests.

![Power testing result](./media/power-test-results.webp)
**Power testing results**

### Initial Kerf Testing: Learning from Mistakes

For our first approach, we cut a test piece with dimensions 16mm × 30mm to insert into 30mm long slits ranging from 4.1mm to 4.9mm width. The width range was determined by the measured cardboard thickness around 4.2mm, which varies and can go up to 4.6mm, depending on the position of measurement.

This revealed two critical issues:

1. **Oversized slits:** The kerf caused all slits to be much wider than their specified dimensions
2. **Impractical data:** Knowing the exact measurement of a well-fitting slit wasn't as useful as knowing the machine-specific kerf setting

![Slits are too lose](./media/test-v1.webp)
**Slits are too lose**

### Switching to the Empirical Method

We pivoted to a more practical approach: varying the kerf setting on the machine until achieving optimal fit.

**Rationale:** The kerf setting (offset) depends on both:

- The absolute kerf of the laser
- The desired joint tolerance for our design

It's more productive to obtain the kerf setting directly rather than measuring its individual components.

### Understanding xTool's Kerf Settings

The xTool software allows for both outward (positive) and inward (negative) kerf settings. Initially, we were confused by the terminology—does "outward" mean moving the laser outward, or compensating for outward kerf by moving inward?

Through testing, we confirmed:

- **Positive offset (outward):** Use for pegs/protrusions
- **Negative offset (inward):** Use for holes/slots

This is because kerf effectively shrinks pegs and enlarges holes.

![Kerf testing results](./media/test-v2.webp)
**We wrote down "Outward/Loose", "Inward/Tight" next to slits**

### Systematic Kerf Testing

We created test slits with the following parameters:

| Parameter         | Value              |
| ----------------- | ------------------ |
| Slit width        | 4mm                |
| Kerf offset range | -0.08mm to +0.08mm |
| Increment         | 0.01mm             |

**Key findings:**

- Positive kerf offset → looser fit
- Negative kerf offset → tighter fit

We acknowedge that the 4mm width was loosly based on the average thickness of the cardboard at 4.19mm. This "lazy" estimate works because we are only looking for a fit, and don't care about the final dimension.

![Discussion](./media/discussing-and-understanding-kerf.webp)
**We hypothesized, debated, observed, and learned as a group**

### Final Calibration Test

Based on initial results showing 0.03-0.04mm kerf offset as optimal, we refined our testing:

| Test Range   | 0.02mm to 0.05mm      |
| ------------ | --------------------- |
| Increment    | 0.01mm                |
| Orientations | Horizontal & Vertical |
| Applied to   | Both pegs and slits   |

**Results:**

| Kerf Offset\* | Fit Type  |
| ------------- | --------- |
| ±0.04mm       | Loose fit |
| ±0.05mm       | Snug fit  |

\*Positive offset on pegs, negative offset on holes

![Final result](./media/test-v3.webp)
**Testing different orientations for best fit**

**Additional observations:**

- Orientation did not affect fit quality
- Repetitive testing caused material fatigue (compressed pegs, enlarged holes). This should be considered in practical assembly scenarios

## Vinyl Cutting

I found Cricut Maker 3 and Roland GS-24 in the shop. Following the threads from online forum, I tried installing the approperiate software for Linux. Sadly, none of them works:

1. Several places mentioned [inkcut](https://github.com/inkcut/inkcut). The official installation guide works but it does not have the matching device profile for our machines.
2. [One forum](https://en.industryarena.com/forum/free-tux-plot-v2-2-vinyl-cutters-engravers-pen-plotters-etc--147178.html) mentioned tux plot, but the [download link](http://securetech-ns.ca/camm-linux.html) is dead.
3. I managed to download and install Cricut Windows software using [Wine](https://www.winehq.org/) and [Bottles](https://usebottles.com/). The software crashes immediately after launch.

I was about to give up at this point and started considering begging someone to borrow their Windows laptop. But to my surprise, Cricut has an iOS app which upon further probing, allows file upload. I see hope!

![File upload](./media/app-01.webp)
**File upload via iOS app**

Let's give this timeless symbol a try. It has two colors. My plan is to cut the four pieces separately and assemble them manually.

![Yin Yang](./media/Yin_and_Yang_symbol.svg)
**Yin and Yang ([source](https://en.wikipedia.org/wiki/Yin_and_yang#/media/File:Yin_and_Yang_symbol.svg))**

Uploading the SVG was smooth. But to my surprise, the app automatically planned a simpler cut:

1. First pass: cut the large and small circles on black
2. Second pass: cut the irregular shape and small circle on white

![First cut design](./media/app-03.webp)
**Cut the black first**

![Second cut design](./media/app-04.webp)
**Cut the white next**

This strategy would result in a non-flat surface but easier assembly. Let's go with it!

I found this [YouTube tutorial](https://www.youtube.com/watch?v=VDdDAkGLnn8) on using the machine mat.

First carefully remove the protective film. This helps preserve the sticky layer of the mat.

![Protective film](./media/peel-off-film.webp)

Line up the vinyl sheets. I could only find black with matte finish and white with glossy finish.

![Layout](./media/layout.webp)

First cut the black.

![First cut done](./media/cut-01.webp)
**Cutter only cuts through the surface layer**

Rotate 180 degress and cut the white.

![Second cut done](./media//cut-03.webp)
**Bending the vinyl helps reveal the gap**

It's time for the final assembly. Angled tweezers are very helpful.

![Assembly](./media/assemble-01.webp)
**Assemble the parts**

Finish up with the small black circle

![Finish up](./media/assembly-02.webp)
**Last piece in manual assembly**

Test it out. And... it looks terrible due to the very noticeable black rim outside the white half. What happened?

- It could be my poor assembly skills. Steady hands might help.
- Mixing different material might be a material, but it shouldn't be that noticeable.
- It shouldn't be a kerf issue. While I did not adjust for kerf, the black and white parts should be affected equally had kerf been a problem.

I think it's most likely a skill issue. For now, I need to wrap this up before the shop closes at mid night. So I just trimmed the black rim with the scissors.

![Trimmed](./media/trimmed.webp)
**Trimmed with scissors**

Looking better now, isn't it?

## Construction Kit: Mini Printing Press

I'm planning to construct a miniature printing press using cardboard movable type with the following approach:

- **Engrave mode:** Create raised or grooved letters on cardboard surfaces
- **Cut mode:** Build a 3D structure to configure and hold the letter plates in position
- **Printing method:** Use pencil and thin paper for word transfer

## Final Project Update

TBD
