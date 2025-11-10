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

I started by modeling the parts in Onshape and importing them into FreeCAD for toolpath generation. I found an effective workflow that uses boolean operation to simulate the casting.

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
**Gather material for casting**

![v1 cast](./media/v1-02.webp)
**Estimate the amount of silicone rubber needed using water**

I noticed that part B has much higher density than part A. It makes sense to add A first so part B and sink and improve the mixing.

![v1 cast](./media/v1-03.webp)
**Before mixing, clear separation between part A and B**

![v1 cast](./media/v1-04.webp)
**After mixing, the color is uniform**

Using a small cup was a mistake. Larger cup would make mixing easier.

Pouring is a battle against bubbles and require perfect balance: too fast, you could spill or introduce bubbles. Too slow, it could drip and also cause bubbles. Too high, it could splash and make bubbles. Too low, the bubles would not be able to stretch and pop before it enters the mold.

![v1 cast](./media/v1-05.webp)
**Pouring in action**

Curing: keep the mold undisturbed for 6 hours.

![v1 cast](./media/v1-06.webp)
**Curing**

The result looks great, except... I casted the opposite of what I wanted. I knew Neal warned us in the lecture about making such mistake. How on earth did I still manage to do it? In retrospect, I was

![v1 cast](./media/v1-07.webp)
**Result**

The result also confirmed the surface finish issue. The layer lines would transfer to the silicone mold and ultimately to the final cast. I needed to smooth the surface, so I considered a few options:

1. **Resin coating**: Kat warned that resin inhibits silicone curing
2. **Wax coating**: Wax melts PLA, requiring a switch to PETG
3. **Acetone vapor smoothing**: Only works for ABS, not PLA or PETG
4. **Sanding and polishing**: Labor intensive and inconsistent results

By elimination, I decided to try wax coating with PETG for the next iteration.

**V2: PETG with Wax Coating**

I started V2 before realizing the positive/negative issue. Since the goal is to characterize surface treatment methods, I proceeded with the PETG print with the wrong geometry. At least I would be able to compare identical geometries across different surface treatments.

![v2 print](./media/v2-01.webp)
**3D printed PETG mold**

I used a heat gun to melt wax pellets and brushed it onto the PETG mold.

![Wax](./media/v2-wax.webp)
**Wax pellets**

![Brushing](./media/v2-02.webp)
**Brushing wax onto the PETG mold**

The last step is applying heat to re-melt the wax in the mold and drain the excess. Unfortunately, I warped the PETG during the drain process when the material was still hot and pliable.

![Warped mold](./media/v2-03.webp)
**Warped PETG mold**

Despite the warping, I proceeded to cast the silicone mold. The results were disappointing. The wax coating couldn't eliminate the layer lines, and worse, it destroyed the sharp edges that were critical to my design.

![Wax result comparison](./media/v2-04.webp)
**Left: PLA without surface treatment. Right: PETG with wax coating.**

**V3-V5: Pushing The Limit of PLA**

I switched back to PLA and recalled a feature from the 3D printing assignment: ironing. This could potentially smooth the top surface without requiring post-processing. These are the tweaks I explored:

- Added ironing for surface smoothing
- Reduced layer height to 0.05mm
- Switched to concentric infill

The concentric infill change had an unexpected benefit of significantly speeding up the print. My geometry is circular, so concentric infill minimizes travel moves compared to the default rectilinear pattern.

I tested various ironing parameters to find the optimal settings:

![Characterizing ironing and infill](./media/infill-iron-test.webp)

| Position     | Setting                           | Result              |
| ------------ | --------------------------------- | ------------------- |
| Top left     | Monotonic line infill             | Baseline            |
| Top right    | Concentric infill                 | Cleaner, faster     |
| Bottom left  | Ironing: 0.15mm spacing, 15% flow | Good improvement    |
| Bottom right | Ironing: 0.1mm spacing, 10% flow  | Best surface finish |

As the Texas BBQ pitmasters say: "Low and slow." Low layer height and slow ironing did the trick.

![Ironing and concentric infill](./media/v4-01.webp)
**Ironing and concentric infill in action**

Casting the silicone mold from the improved PLA mother mold revealed new challenges. I used a glass plate to press down the backside of the rubber as it cured, creating a flat surface. However, this created two demolding problems:

1. The silicone was extremely difficult to release from the glass plate.

![TODO: show glass release photo](...)

2. The rubber was also extremely difficult to release from the plastic mold.

The second issue was particularly problematic. As they say, "poor worker blaming his tools," but in this case, the tool choice genuinely mattered. I had tried nearly all the 3D printers in the shop and identified three machines that consistently produce quality prints. Due to printing congestion, I had used one of the least performant printers. The resulting surface had not only visible layer lines but also a very rough texture that grabbed onto the rubber during demolding.

The consequence was severe—I tore the wall of the rubber mold during removal.

![TODO: show torn rubber photo](...)

For future iterations, I should add more draft angle to facilitate demolding. As a temporary workaround, I 3D printed a support ring to hold the damaged mold in shape.

![TODO: show image of adhoc support ring](...)

**Final Cast and Lessons Learned**

During the final casting process, I learned several important techniques:

1. **Mixing Method:** Shaking the bottle causes too many bubbles. The "shearing" motion mentioned in the lecture—pouring and stirring in a smooth, continuous motion—produces much better results.

2. **Vacuum Chamber:** Pulling bubbles with a vacuum is counterproductive for molds with a bottom surface that will be visible in the final part. The vacuum causes surface roughness.

![TODO: show comparison photos](...)

These observations prompted design improvements for the next iteration:

- Add chamfer to edges for easier demolding
- Increase silicone base thickness for better structural integrity
- Use the highest quality PLA printer available in the lab

**Post-Processing**

The casted parts required cleanup. I used a belt sander and deburring tools to remove rough edges and excess material.

![TODO: show post-processing photo](...)

One final issue emerged during assembly: the interface between parts was too tight. The positive and negative halves wouldn't mate initially. This is because 3D printing kerf makes male features slightly wider and female features slightly narrower than modeled. I should have accounted for this in the design phase.

However, after enough repeated mating cycles, the plastic material wore down slightly and the two parts finally achieved a proper fit. Not the most elegant solution, but it worked.

![TODO: show the result](...)

## Key Learnings

**Linear Processes Carry Compounded Risk**

The mother mold → silicone mold → plastic cast workflow is inherently sequential. Any failure in the chain causes significant rework. This is fundamentally different from parallel processes where failures can be isolated. It's worth being much more cautious and validating designs at each stage before proceeding.

**Emotional Factors in Decision Making**

During one 3D print that was near completion, I realized I should have added fillets to the interface geometry. But I couldn't bring myself to stop the job—I had fallen victim to the sunk cost fallacy. Sometimes the rational decision is to waste a partially completed print to save the time you'd waste on rework later.

**Trust, But Verify**

I mistakenly flipped the positive/negative relationship, even after being fully aware of Neal's law from the lecture. This taught me that sometimes it's better to have others check your work than to trust your own brain, especially when you've been staring at the same design for hours.

**Pipelining Is Essential**

The physical "table of contents" demonstrates how important pipelining is for managing long iteration cycles. Each complete cycle from mother mold to cast takes several hours for printing, curing, and demolding. By staggering multiple iterations in parallel, I could start a new print while previous molds were curing. If I had worked in a strictly single-threaded manner, this project would have taken 40+ hours instead of being completable in a week.

## Appendix

- TODO, attach: Infill and ironing testing print
- TODO, attach: Final model for CNC mother-mold
- TODO, attach: Final model for 3D printable mother-mold
