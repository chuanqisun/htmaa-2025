---
title: "Week 14: Time"
date: 2025-12-07
keywords: ["wildcard", "laser-cutting", "laser-engraving"]
---

> And then one day you find ten years have got behind you
> No one told you when to run, you missed the starting gun
>
> — Pink Floyd, "Time"

- This week, I want to celebrate everything we learned about time management from this class by engraving the cover of The Dark Side of The Moon, the album that included "Time".

## Asset preparation

- [Jiaming](https://fab.cba.mit.edu/classes/863.24/people/JiamingLiu/About%20me.html) is our great TA who helped us organize lab sessions and hands-on practice
  - We will use [XTool F2 Ultra 60W MOPA Laser Cutter](https://www.xtool.com/products/xtool-f2-ultra-60w-mopa-40w-diode-dual-laser-engraver) for engraving. [xTool MetalFab Laser Welder/CNC Cutter](https://www.xtool.com/products/xtool-metalfab-laser-welder-and-cnc-cutters) for metal cutting
- I prepared 3 different designs, to sample a variety of capabilities of the laser cutter.

| Design                | Purpose                             |
| --------------------- | ----------------------------------- |
| Dark Side of The Moon | Test multi-color engraving on metal |
| Spectrogram           | Test the limit of image resolution  |
| Nameplate             | Test typography detail resolution   |

## Dark Side of The Moon

![The Dark Side of The Moon album cover](./media/dark-side-of-the-moon.webp)
**Iconic album cover of Pink Floyd's "The Dark Side of The Moon" (1973)**

- I learned that in theory MOPA laser can modulate the temperature in which metal oxidizes, producing different colors on stainless steel, alumninum, and titanium.
- Started with the original album cover, tracing it with SVG
- In preparation for the lab session, I separated the traces by process:
  - Single line for incoming light, the prism
  - Gradient fill for the triangle inside the prism
  - Solid fill for the line beams exiting the prism

![Decomposing layers](./media/decomposing-colors.webp)
**Decomposing the design by process**

- It turned out I over-prepared. Jiaming showed me how to separate the elements with the XTool software. We just need to select each part and apply different parameters
- In an earlier session, [Edward](https://fab.cba.mit.edu/classes/863.25/people/EdwardChen/) had worked with Jiaming to characterize the color output as a function of power, speed, and pulse frequency.
- All I needed was choosing from their color palette.

![Picking color other people's characterization result](./media/picking-color.webp)
**Picking color from other people's characterization result**

- After first cut, the line stroke was not coming out, so we updated the parameter and the rest of the engraving went smoothly.

![Acceptable result after 2nd](./media/engraving-01.webp)
**Acceptable result after 2nd attempt**

- My design file messed up the gradient part inside the prism. I came out as strange triangle shape, losing the original gradient effect.
- The colors were limited but at least we had a rainbow like pattern

## Spectrogram of Neil's Saying

- I want to test if we can store sound as image engraved on metal.
- I had separatly vibe-coded a program for convertion between audio and spectrogram. The program was all AI generated with 50+ rounds of the revision. Since I don't have the full history of the AI coding session, I won't claim credit for the code. For this project, I'm only using the tool to generate a spectrogram from sound and to verify the sound from the engraved spectrogram.

![Image of input spectrogram](...)

- Engraving didn't go well. All the gray levels were lost, and worse still, some the darkest areas were inverted to light color.
- I took a photo of the engraved metal, processed in Figma, and decoded into the sound.

![Image of image processing](...)

![Sound before]
![Sound after]

## Nameplate for Final Project

- I want to design a nameplat for my final project.
- The 3mm thickness of the stainless steel was too thick this purpose but I proceeded anyway just to test how much detail we can get with typography.
- We were able to create very small texts using the SVG exported from Figma. The program is trying to trace the outline of the text instead of engraving the internal strokes
- We switched to XTool's built-in font and the same issue persisted.
- Had we have more time, I would use an image with think storkes instead of vector graphics.

![Image of nameplate design](...)

![Image of result](...)

## Post-processing

- Jiaming showed me how to cut the metal with MetalFab laser cutter.
- It was the same process as [Link to week 1](...)

![Video of cutting](...)

- After cutting, the molten metal edges need to be sanded/filed down for safety.
- Jiaming showed me how to use belt sander to remove the edges.
- I practiced the sanding to remove the corners

![Image of final result]

## Reflection

- Color engraving is very empirical. The parameters must be determined for the specific material and machine and results may still vary
-

## Appendix

- [Graphic design assets](...)
