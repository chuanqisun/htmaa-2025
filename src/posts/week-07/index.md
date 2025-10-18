---
title: "Week 7: The Dangerous Machine"
date: 2025-10-18
keywords: ["cnc", "wood", "large-format"]
---

- I've been racing mountain bike since 2015, but never learned the technique of manualing.
- Manualing is when you lift the front wheel of the bike off the ground and balance on the rear wheel while riding.
- People have created "Manual Machines" to help riders learn this skill. I decided to build my own using the skills acquired this week.

## Paper Prototyping

- A quick sketch by hand to understand form and 3D relations
- Laser cutting. I'm shocked how fast I was able to assemble a prototype thanks to the practice in [Week 2](../week-02/index.md)
- The paper helped me feel the weak points of the design and iterated with improved fastening mechanism

## Make The Big One

- This week's schedule is a bit special. Due to limited machine time, I was only able to characterize the CNC on the day of my cutting session.
- Special thanks to [Dan], who helped me setting up the machine and running the job.
- I did all the CAD work in Onshape, which does not have a free CAM solution to students.
- Dan generously allowed me to use his Fusion360 to generated the toolpaths.
- During the first simiulation, I realized I misunderstodd how dogbones work
  - The center of the circle does not have to be the corner of the part
  - The goal is to cut the smallest radius that satisfies two constraints:
    - Tolerant to the mill bit diameter
    - Creates perfectly mating interfaces
- All cuts are 2D Contour.
- During the cutting the machine didn't cut through the z-axis.
- According to my measurement, Cut 2 should have cut through the material but it didn't
- I added one additional pass to fully cut through the material.
- I compared my parameter with others: I used 11.5mm as the stock height, while others used 12mm. I believe this is why the machine didn't cut through the material.

| Parameter                 | Cut 1          | Cut 2          | Cut 3          |
| ------------------------- | -------------- | -------------- | -------------- |
| **Clearance Height**      |                |                |                |
| From                      | Retract height | Retract height | Retract height |
| Offset                    | 0.4 in         | 0.4 in         | 0.4 in         |
| **Retract Height**        |                |                |                |
| From                      | Stock top      | Stock top      | Stock top      |
| Offset                    | 0.2 in         | 0.2 in         | 0.2 in         |
| **Feed Height**           |                |                |                |
| From                      | Top height     | Top height     | Top height     |
| Offset                    | 0.2 in         | 0.2 in         | 0.2 in         |
| **Top Height**            |                |                |                |
| From                      | Stock top      | Stock top      | Stock top      |
| Offset                    | 0 in           | -0.2 in        | -0.45 in       |
| **Bottom Height**         |                |                |                |
| From                      | Stock top      | Stock top      | Stock top      |
| Offset                    | -0.2 in        | -0.45 in       | -0.56 in       |
| **Multiple Depths**       |                |                |                |
| Enabled                   | No             | **Yes**        | No             |
| Maximum Roughing Stepdown | N/A            | **0.2 in**     | N/A            |

## Assemble and Enhance

- I used tabs during the cutting. Removing the tabs weren't trivial. I used a multi-tool for flatting the edges.
- First assembly revealed that I miscalculated the tire diameter. Also, the middle section feels a bit wobbly.
- Due to limited machine time, I designed reinforcements that I could manual cut with a band saw
- I learned that it's better to design towards a tight fit and iteratively relax until it fits.
- Adding the spacers definitely improved rigidity
- I tied a rope using a flexible knot, anchored by a washer

## Testing

- First, static test. Bring the bike up, then mount it. It works.
- Second, dynamic test. Bring the bike up from ground. It was more difficult but it works.
- I landed on my butt during landing, and learned the lesson the "hard way" - knowledge can be dangerous.
