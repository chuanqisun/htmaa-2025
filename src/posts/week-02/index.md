---
title: "Week 2: Making The Cut"
date: 2025-09-11
keywords: ["cutting"]
---

## Group Assignment: Characterizing the Laser Cutter

### Introduction

Our group challenge was to study the kerf characteristics of the laser cutter. We selected the xTool P2 desktop laser cutter for its usability:

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
**Notice the "Tight", "Loose" written next to slits**

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
- The 4mm dimension was arbitrary but consistent (this "lazy" approach works for single-material projects but not for multi-component assemblies where the final dimension of the one material depends on the measurements of another)

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

| Kerf Offset | Fit Type  |
| ----------- | --------- |
| 0.04mm      | Loose fit |
| 0.05mm      | Snug fit  |

![Final result](./media/test-v3.webp)
**Testing different orientations for best fit**

**Additional observations:**

- Orientation did not affect fit quality
- Repetitive testing caused material fatigue (compressed pegs, enlarged holes). This should be considered in practical assembly scenarios

## Vinyl Cutting

TBD

## Construction Kit: Mini Printing Press

I'm planning to construct a miniature printing press using cardboard movable type with the following approach:

- **Engrave mode:** Create raised or grooved letters on cardboard surfaces
- **Cut mode:** Build a 3D structure to configure and hold the letter plates in position
- **Printing method:** Use pencil and thin paper for word transfer

## Final Project Update

TBD
