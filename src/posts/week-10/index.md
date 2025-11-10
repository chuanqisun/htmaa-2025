---
title: "Week 10: Hofstadter's Law"
date: 2025-11-10
keywords: ["molding", "casting", "3d printing"]
---

> Hofstadter's law: It always takes longer than you expect, even when you take into account Hofstadter's law.

> Neal's law: You will cast the opposite of what you expect, even after Neal told you about Neal's law.

## Group Assignment

This week, I joined [Kat](https://fabacademy.org/2023/labs/kamakura/students/ekaterina-kormilitsyna/)'s training session to learn about molding and casting. She showed us several examples covering molding, casting techniques, and materials. I also reviewed Safety Data Sheets (SDS) for two materials by Smooth-On: Oomoo 30 silicone rubber and Smooth-Cast 300 plastic. Understanding material properties and safety protocols is essential when working with these chemicals. ## Project: Manual Particle Accelerator

See additional documentation in the [group notes](https://fab.cba.mit.edu/classes/MAS.863/CBA/group_assignments/week10/).

## Manual Particle Accelerator

Who doesn't like particle physics? Smashing particles together at near light speed makes cool pictures and wins you [Nobel prizes](https://en.wikipedia.org/wiki/Higgs_boson). While we can't quite achieve relativistic speeds at home, we can certainly build something that captures the spirit of particle acceleration.

After sketching out the positive/negative and hard/soft material relationships, I was ready to start fabrication. The design called for two clam shell circular components that would allow manual rotation, mimicking the concept of particles traveling through an accelerator ring.

### The CAM Debacle

My initial plan was straightforward: CNC wax mold → rubber mold → plastic part. I've been using Onshape for its Linux compatibility, but learning from [Week 7](../week-07/index.md) that using separate CAD and CAM software adds significant overhead, I decided to learn FreeCAD this week to have an integrated workflow.

I studied two reference tutorials to understand the CAM capabilities:

- [3D pocketing](https://academy.cba.mit.edu/classes/computer_machining/3DRough.mp4)
- [Adaptive clearing](https://academy.cba.mit.edu/classes/computer_machining/AdaptiveRest.mp4)

**Attempt 1: Onshape Modeling → FreeCAD CAM**

I started by modeling the parts in Onshape and importing them into FreeCAD for toolpath generation. A quick boolean operation against stock geometry immediately revealed a design flaw: I had edges without thickness, which would be impossible to mill.

![TODO: show image of boolean operation failure](...)

After fixing the geometry, I managed to set up the machine job by creating tool bits based on example endmill shapes and modifying the JSON configuration:

```json
// TODO embed json file
```

However, a new problem emerged. The toolpath algorithm couldn't detect the narrow, ring-like pocket geometry. The gutter between features was too narrow relative to the tool diameter.

![TODO: show image of FreeCAD toolpath failure](...)

Increasing the ring width to be significantly greater than the tool diameter would solve the problem, but I didn't want to compromise the design. Additionally, FreeCAD's multiple toolpath feature proved very buggy. After generating the first toolpath, producing paths for the remaining material simply didn't work.

**Attempt 2: FreeCAD Modeling → FreeCAD CAM**

Thinking the import process might be causing issues, I decided to model directly in FreeCAD. The transition from Onshape to FreeCAD was rough—FreeCAD feels more rigid and less forgiving of design changes. I finished the mold design and tested it in CAM, but the multiple toolpath issues persisted.

![TODO: show FreeCAD toolpath failure](...)

**Attempt 3: Switching to Mods**

Frustrated with FreeCAD's CAM limitations, I switched to Mods for toolpath generation. Unfortunately, Mods also couldn't generate sequential toolpaths that build on each other. Worse, I realized that my U-pipe geometry would require a ball endmill, and adding custom bit geometry would take too long to implement.

Mods failed to generate proper toolpaths with issues similar to what I experienced in FreeCAD. At this point, I suspected fundamental problems with my modeling approach rather than just software limitations.

**Summary of Failed Attempts**

| CAD Software | CAM Software | Issue Encountered                             |
| ------------ | ------------ | --------------------------------------------- |
| Onshape      | FreeCAD      | Unnecessary vertical travels                  |
| FreeCAD      | FreeCAD      | Missing toolpaths on half of the ring         |
| Onshape      | Mods         | Unnecessary horizontal back-and-forth travels |
| FreeCAD      | Mods         | Missing toolpaths on half of the ring         |

After spending considerable time troubleshooting, I needed to embrace pragmatism. In the spirit of supply-driven project management, I decided to move forward with something I could make real progress on: 3D printing the mother mold instead of CNC milling wax.

### Table of Contents, Literally

Before diving into the technical details, I want to show you the physical manifestation of this week's iterative process. I laid out all my artifacts on a table—each row represents a complete iteration cycle from mother mold to final cast.

![TODO: show a physical gantt chart of artifacts](...)

Reading from left to right: the mother mold, the silicone mold, and the plastic cast. Reading from top to bottom: the progression through multiple iterations as I refined the process. This physical Gantt chart visualizes the staggered development timeline and shows how parallel work streams helped me maintain momentum despite individual failures.

### Perfectly Making The Wrong Thing

**First Iteration: PLA Mother Mold**

I designed the mother mold in Onshape, sliced it, and printed it in PLA. The print came out clean and the geometry looked promising.

![TODO: show CAD model](...)
![TODO: printing result](...)

However, I immediately faced a surface finish problem. The layer lines would transfer to the silicone mold and ultimately to the final cast. I needed to smooth the surface, so I considered two options:

| Surface Treatment   | Challenge                                      |
| ------------------- | ---------------------------------------------- |
| Apply resin coating | Kat warned that resin inhibits silicone curing |
| Apply wax coating   | Wax melts PLA, requiring a switch to PETG      |

**Second Iteration: PETG with Wax Coating**

Following Kat's advice, I switched to PETG and applied a wax coating. The process involved melting the wax, brushing it on, using a heat gun to level the surface, and draining the excess. Unfortunately, I warped the PETG during the drain process when the material was still hot and pliable.

Despite the warping, I proceeded to cast the silicone mold. The results were disappointing—the wax coating couldn't eliminate the layer lines, and worse, it destroyed the sharp edges that were critical to my design.

![TODO: show waxing process](...)

**Material Comparison**

| Material | Print Quality                           | Surface Finish                               | Notes                                   |
| -------- | --------------------------------------- | -------------------------------------------- | --------------------------------------- |
| PLA      | Easy to print, smooth if calibrated     | Layer lines still visible                    | Best for rapid iteration                |
| PETG     | More difficult, filament quality issues | Wax treatment smooths edges but leaves lines | Prone to warping during post-processing |

**The Big Mistake**

When I demolded the cast, I had a sinking realization: I had inverted the positive/negative relationship. Even after being fully aware of Neal's law from the lecture, I still managed to make this classic mistake.

![TODO: casting process](...)

**Third Iteration: PLA with Ironing**

I switched back to PLA and recalled a feature from the 3D printing assignment: ironing. This could potentially smooth the top surface without requiring post-processing. I also made several other optimizations:

- Reduced layer height to 0.05mm
- Switched to concentric infill

The concentric infill change had an unexpected benefit—it significantly sped up the print. My geometry is circular, so concentric infill minimizes travel moves compared to the default rectilinear pattern.

I tested various ironing parameters to find the optimal settings:

![TODO: show comparison photos](...)

| Position     | Setting                           | Result              |
| ------------ | --------------------------------- | ------------------- |
| Top left     | Monotonic line infill             | Baseline            |
| Top right    | Concentric infill                 | Cleaner, faster     |
| Bottom left  | Ironing: 0.15mm spacing, 15% flow | Good improvement    |
| Bottom right | Ironing: 0.1mm spacing, 10% flow  | Best surface finish |

As the Texas BBQ pitmasters say: "Low and slow." Low layer height and slow ironing did the trick.

**Silicone Mold Challenges**

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
