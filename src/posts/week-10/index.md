---
title: "Week 10: Neal's Law"
date: 2025-11-10
keywords: ["molding", "casting", "3d printing"]
---

> Hofstadter's law: It always takes longer than you expect, even when you take into account Hofstadter's law.

> Neal's law: You will cast the opposite of what you expect, even after learning about Neal's law.

## Group Assignment

This week, I joined [Kat](https://fabacademy.org/2023/labs/kamakura/students/ekaterina-kormilitsyna/)'s training session to learn about molding and casting. She showed us several examples covering molding, casting techniques, and materials. I also reviewed Safety Data Sheets (SDS) for two materials by Smooth-On: Oomoo 30 silicone rubber and Smooth-Cast 300 plastic. Understanding material properties and safety protocols is essential when working with these chemicals.

See additional documentation in the [group notes](https://fab.cba.mit.edu/classes/MAS.863/CBA/group_assignments/week10/).

## Manual Particle Accelerator

Who doesn't like particle physics? Smashing particles together at near light speed could make cool pictures and win you a [Nobel prize](https://en.wikipedia.org/wiki/Higgs_boson). In this project, let's accelerate a particle by hand!

It hurts my brain to imagine the positive/negative relationships involved in casting. I found sketching an effective way to develop the concept.

![Concept sketch](./media/concept.webp)
**Concept sketch**

After sketching out the positive/negative and hard/soft material relationships, I was ready to start fabrication. The design called for two shell components that, when closed like a clam, would accelerate a metal ball when shaken by hand. Similar to how [self-winding watch](https://en.wikipedia.org/wiki/Automatic_watch) feels.

### The CAM Debacle

My initial plan was simple and naive: CNC wax mold → plastic part. I've been using Onshape for its Linux compatibility, but learning from [Week 7](../week-07/index.md) that using other people's Fusion 360 for CAM adds significant overhead, I decided to learn FreeCAD CAM this week to have a personalized workflow.

I studied two reference tutorials to understand the CAM capabilities:

- [3D pocketing](https://academy.cba.mit.edu/classes/computer_machining/3DRough.mp4)
- [Adaptive clearing](https://academy.cba.mit.edu/classes/computer_machining/AdaptiveRest.mp4)

**Attempt 1: Onshape Modeling → FreeCAD CAM**

I started by measuring stock size so I can size the parts accordingly.

![Stock measurement](./media/wax-01.webp)
**Stock measurement**

- Width: 76.45mm
- Length: 87.45mm
- Height: 38.21mm

I modelled the parts in Onshape and importing them into FreeCAD for toolpath generation. I found an effective workflow that uses boolean operation to simulate the casting.

![Simulate casting](./media/simulate-casting.webp)
**Simulated casting using the subtract boolean operation**

A quick boolean operation against stock geometry immediately revealed a design flaw: I had edges without thickness, which would be impossible to mill.

![Poor modeling](./media/simulated-casting-issue.webp)
**Boolean operation reveals design flaw**

After fixing the geometry, I managed to set up the machine job by creating tool bits based on example endmill shapes and modifying the JSON configuration, following this [YouTube tutorial](https://www.youtube.com/watch?v=ER1wUvfIswk).

```json
{
  "version": 2,
  "name": "1/8 inch Endmill",
  "shape": "endmill.fcstd",
  "parameter": {
    "CuttingEdgeHeight": "30.0000 mm",
    "Diameter": "3.1750 mm",
    "Length": "50.0000 mm",
    "ShankDiameter": "3.0000 mm"
  },
  "attribute": {}
}
```

However, a new problem emerged. The toolpath algorithm couldn't fit the bit in the narrow, ring-like pocket geometry.

![Toolpath issue](./media/tool-path-issue-01-mods.webp)
**Toolpath with excessive vertical movement**

Increasing the ring width to be significantly greater than the tool diameter would solve the problem, but I didn't want to compromise the design. Additionally, FreeCAD's multiple toolpath feature proved very buggy. After generating the first toolpath, producing paths for the remaining material simply had no effect: subsequent toolpaths would start over from the surface of the stock.

**Attempt 2: FreeCAD Modeling → FreeCAD CAM**

Thinking the import process might be causing issues, I decided to model directly in FreeCAD.

![Modeling in freecad](./media/cnc-mold-freecad.webp)
**Modeling in FreeCAD**

The transition from Onshape to FreeCAD was rough but manageable given that they share a similar mental model. I finished the mold design and tested it in CAM, but the multiple toolpath issues persisted.

![Toolpath issue with FreeCAD](./media/tool-path-issue-01-freecad.webp)
**Toolpath missing half of the geometry**

**Attempt 3: Switching to Mods**

Frustrated with FreeCAD's CAM limitations, I switched to [Mods](https://modsproject.org/) for toolpath generation, using the `G-code/mill 2.5D stl` program. Unfortunately, Mods couldn't generate sequential toolpaths that build on each other. Worse, I realized that my U-pipe geometry would require a ball endmill, and adding custom bit geometry would take too long to implement.

![Toolpath issue with Mods](./media/tool-path-issue-03-resolved-3_4-gap.webp)
**Excessive horizontal movement in Onshape model**

![Toolpath issue with Mods](./media/mods-path-issue.webp)
**Imcomplete paths in FreeCAD model**

Mods failed to generate proper toolpaths with issues similar to what I experienced in FreeCAD. At this point, I suspected fundamental problems with my modeling approach rather than toolpath algorithms.

**Summary of Failed Attempts**

| CAD Software | CAM Software | Issues Encountered                              |
| ------------ | ------------ | ----------------------------------------------- |
| Onshape      | FreeCAD      | Unnecessary vertical travels                    |
| FreeCAD      | FreeCAD      | Ibid, and missing toolpaths on half of the ring |
| Onshape      | Mods         | Unnecessary horizontal back-and-forth travels   |
| FreeCAD      | Mods         | Ibid, and missing toolpaths on half of the ring |

After spending considerable time troubleshooting, I needed to embrace pragmatism. In the spirit of supply-driven project management, I decided to move forward with something I could make real progress on: 3D printing the mother mold instead of CNC milling wax.

### Table of Contents, Literally

Before diving into the technical details, I want to show you the physical manifestation of this week's iterative process. I laid out all my artifacts on a table. Each row visualizes an iteration cycle from mother mold to a point where I encountered an error.

![Table of contents](./media/toc-01.webp)
**v1 through v7 of molding and casting using 3D printing**

### V1: Perfectly Making The Wrong Thing

**First Iteration: PLA Mother Mold**

I slightly modified the CNC model to be the mother mold, sliced it with PrusaSlicer and printed it in PLA.

![v1 mold](./media/v1-mold.webp)
**Modeling the mold**

The print came out clean despite pronounced layer lines. I wanted to cast it first to see how bad the surface finish would be. Let's try Smooth-On Oomoo 30 silicone rubber.

![v1 cast](./media/v1-01.webp)
**Gathering materials for casting**

![v1 cast](./media/v1-02.webp)
**Estimating the amount of silicone rubber needed using water**

I noticed that part B has much higher density than part A. It makes sense to add A first so part B can sink and improve the mixing.

![v1 cast](./media/v1-03.webp)
**Before mixing, clear separation between part A and B**

![v1 cast](./media/v1-04.webp)
**After mixing, the color is uniform**

Using a small cup was a mistake. A larger cup would make mixing much easier.

Pouring is a battle against bubbles and requires perfect balance: too fast, you could spill or introduce bubbles. Too slow, it could drip and also cause bubbles. Too high, it could splash and make bubbles. Too low, the bubbles wouldn't be able to stretch and pop before entering the mold.

![v1 cast](./media/v1-05.webp)
**Pouring in action**

The curing process requires keeping the mold undisturbed for 6 hours.

![v1 cast](./media/v1-06.webp)
**Curing**

The result looks great, except... I cast the opposite of what I wanted. I knew Neal warned us in the lecture about making such a mistake. How on earth did I still manage to do it?

![v1 cast](./media/v1-07.webp)
**Good but wrong result**

In retrospect, I was thinking about directly casting from the 3D printed mold. If I were able to cast hard material from the 3D printed mold, the outcome would be correct.

The result also confirmed the surface finish issue. The layer lines transferred to the silicone mold and would ultimately transfer to the final cast. I needed to smooth the surface, so I considered a few options:

1. **Resin coating**: Kat warned that resin inhibits silicone curing
2. **Wax coating**: Wax melts PLA, requiring a switch to PETG
3. **Acetone vapor smoothing**: Only works for ABS, not PLA or PETG
4. **Sanding and polishing**: Labor intensive and inconsistent results

By elimination, I decided to try wax coating with PETG for the next iteration.

**V2: PETG with Wax Coating**

I started V2 before realizing the positive/negative issue. Since the goal was to characterize surface treatment methods, I proceeded with the PETG print with the wrong geometry. At least I would be able to compare identical geometries across different surface treatments.

![v2 print](./media/v2-01.webp)
**3D printed PETG mold**

I used a heat gun to melt wax pellets and brushed them onto the PETG mold.

![Wax](./media/v2-wax.webp)
**Wax pellets**

![Brushing](./media/v2-02.webp)
**Brushing wax onto the PETG mold**

The final step involved applying heat to re-melt the wax in the mold and drain the excess. Unfortunately, I warped the PETG during the drain process when the material was still hot and pliable.

![Warped mold](./media/v2-03.webp)
**Warped PETG mold**

Despite the warping, I proceeded to cast the silicone mold. The results were disappointing. The wax coating couldn't eliminate the layer lines, and worse, it destroyed the sharp edges that were critical to my design.

![Wax result comparison](./media/v2-04.webp)
**Left: PLA without surface treatment. Right: PETG with wax coating.**

### V3-V5: Pushing The Limit of PLA

I switched back to PLA and recalled a feature from the 3D printing assignment: ironing. This could potentially smooth the top surface without requiring post-processing. I explored several tweaks to optimize the print quality:

- Added ironing at 10% flow and 0.1mm gap for surface smoothing
- Reduced layer height to 0.05mm
- Switched to concentric infill

![Prusa Ironing](./media/prusa-setup.webp)
**Setup for ironing in PrusaSlicer**

The concentric infill change had an unexpected benefit of significantly speeding up the print. My geometry is circular, so concentric infill minimizes travel moves compared to the default rectilinear pattern.

I tested various ironing parameters to find the optimal settings:

![Characterizing ironing and infill](./media/infill-iron-test.webp)
**Setting up different processes in one job**

![Print result](./media/infill-iron-02.webp)
**2 by 2 grid of results**

| Position     | Setting                           | Result              |
| ------------ | --------------------------------- | ------------------- |
| Top left     | Monotonic line infill             | Baseline            |
| Top right    | Concentric infill                 | Cleaner, faster     |
| Bottom left  | Ironing: 0.15mm spacing, 15% flow | Good improvement    |
| Bottom right | Ironing: 0.1mm spacing, 10% flow  | Best surface finish |

In summary, everything we need to know to improve 3D printing is already captured in the culinary wisdom:

> Low and slow.
>
> -- Texas BBQ pitmasters

Low layer height and slow ironing did the trick. I observed much better interior layers thaks to concentric infill:

![Ironing and concentric infill](./media/v4-01.webp)
**Ironing and concentric infill in action**

Here is the full mold using the ironing and concentric infill settings. Unfortunately, the 3D printer had some issue extruding consistently despite my tuning of temperature. It was not as good as my characterization test from another printer.

![Ironed mold](./media/v5-01.webp)
**Ironed mold, sub-optimal surface and rough wall texture**

When casting the silicone mold from the new PLA mother mold, I used a glass plate to press down the backside of the rubber as it cured, creating a flat surface to make the final casting easier to level.

![Leveling the surface](./media/v5-03.webp)
**Leveling the surface**

This made a perfectly flat rubber surface, but it also created a vacuum suction that made it very difficult to remove it from the glass. I would not recommend this technique to others.

Due to the rough wall texture, the silicone mold adhered strongly to the PLA mother mold. During demolding, I torn the wall apart from the rubber base.

![Damaged mold](./media/v5-04.webp)
**Damaged silicone mold after demolding**

![Wall visualized in model](./media/v5-wall-issue.webp)
**The right-most gutter made demolding very difficult**

I wanted to proceed with the final casting to gain more experience and reveal other potential issues.

![3D printed support](./media/v5-05.webp)
**3D printed support ring to hold the damaged mold in shape**

With the support ring, I was able to cast the final parts. The Smooth-On Smooth-Cast 300 plastic came with the instruction that you should stir or shake the bottles before mixing. That was a very bad idea. After shaking, the mixture was full of bubbles that would not go away. I had to switch to another bottle while letting those bubbles dissipate over time.

![Casting](./media/v5-06.webp)
**Casting the final parts despite the damaged mold (left)**

I attempted to remove bubbles using a vacuum chamber, but it backfired. The vacuum caused surface roughness on the bottom side of the mold that would be visible in the final part.

![Vacuum chamber](./media/v5-02.webp)
**Using vacuum chamber to remove bubbles**

This marks the first production of the final parts. Good news is that the geometry is correct this time.

![Validating](./media/v5-07.webp)
**Design validated**

To make the molds ready for assembly, I deburred the edges and sanded down rough surfaces.

![Deburring](./media/v5-11.webp)
**Deburring the casted parts**

For fun, I hand-painted some graphic details with a sharpie. It was clear that vacuum processing was not only unnecessary but also detrimental to surface quality.

![Side without bubbles](./media/v5-10.webp)
**Smooth side without vacuum processing**

![Side with bubbles](./media/v5-09.webp)
**Rough side due to vacuum processing**

The two sides didn't fit very well due to inconsistent interface. I had to belt-sand edges and deburr the grove to make them fit. I also repeatedly coupled and decoupled the two parts until they finally fit smoothly.

![In context](./media/v5-12.webp)
**How hard should I shaking to reach 99% speed of light?**

### V6-V7: Details

During these final iterations, I made the following improvements based everything observed in previous versions:

- Add chamfer to mother mold for easier demolding
- Increase silicone base thickness to prevent tearing
- Add fillets to interface for easier assembly
- Reduced coupling surface for easier assembly
- Use the highest quality PLA printer available in the lab

![Final model](./media/v7-00.webp)
**Simplified model with chamfers and fillets**

Using the highest level setting, it took 5 hours to print the mold. It was the highest quality print I've ever made in this class.

![Final mold](./media/v7-02.webp)
**Incredible surface finish**

Demolding and casting was smooth-sailing thanks to all the mistakes and lessons learned in previous iterations. The only issue is that due to the improved print quality, the fit between the two parts became a bit loose. I would have to adjust the model for the future versions.

![Final assembly](./media/v7-01.webp)
**Mother mold, silicone mold, and final cast assembly**

I deeply enjoyed this project. It could even become a final project if I add a digital frequency analyzer and laser-cut graphic masks.

### Reflections

**Sequential Workflows Demand Pipelining**

The mother mold → silicone mold → plastic cast workflow is inherently sequential, where any failure causes significant rework. However, by staggering multiple iterations in parallel, I could manage the long iteration cycles effectively and continuously integrate feedback into next iterations. If I had worked in a strictly single-threaded manner, this project would have taken more than 60 hours.

**Emotional Factors in Decision Making**

During one 3D print that was near completion, I realized I should have added fillets to the interface geometry. But I couldn't bring myself to stop the job. It felt as if I was terminating a life. I had fallen victim to the sunk cost fallacy as well as anthropomorphizing objects.

**Don't Trust Yourself**

I mistakenly flipped the positive/negative relationship, even after being fully aware of Neal's warning from the lecture. This taught me that sometimes it's better to have others check your work than to trust your own brain, especially when you've been staring at the same design for hours.

## Appendix

- [Infill and ironing slicer file](./model/infill-ironing-test.3mf)
- [Printable model and slicer file](./model/model-for-printing.zip)
- [CNC model (failed to CAM)](./model/model-for-milling.FCStd)
