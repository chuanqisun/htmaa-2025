---
title: "Week 14: Wildcard for Wildcut"
date: 2025-12-07
keywords: ["wildcard", "laser-cutting", "laser-engraving"]
---

> And then one day you find ten years have got behind you
> No one told you when to run, you missed the starting gun
>
> — Pink Floyd, "Time"

- In this wild card week, we get to choose from a wide selection of topics to dive deep with one of our TAs.
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

<audio src="./media/quote-before.mp3" controls></audio>
**Original quote from Neil**

![Original spectrogram](./media/restore-original.webp)

- Engraving didn't go well. All the gray levels were lost, and worse still, some the darkest areas were inverted to light color.

![Engraved spectrogram](./media/engraving-02.webp)
**Engraved spectrogram with unwanted artifacts**

- I took a photo of the engraved metal, processed in Figma, and decoded into the sound.

Steps:

1. Desaturate
2. Invert
3. Color burn (HEX `#666666`)
4. Reduce exposure

![Manual restoration process](./media/restore-human.webp)
**Manual restoration process**

- To make this project more interesting, I also used large-language model with vision skills to restore the spectrogram.

The AI restoration is similar to the manual process except I prompted AI to also restore the [formants](https://en.wikipedia.org/wiki/Formant) stripes that lost in the engraving.

![AI restoration](./media/restore-ai.webp)
**AI restoration process ([chat log](./code/reconstruction-trace.txt))**

Upload both reconstructions to my custom [spectrogram players](https://code.chuanqisun.com/spectrogram-recorder/) and hear the results:

<audio src="./media/quote-before.mp3" controls></audio>
**Original**

<audio src="./media/quote-after-human.mp3" controls></audio>
**Manually reconstructed from photo of engraving**

<audio src="./media/quote-after-ai.mp3" controls></audio>
**AI reconstructed from photo of engraving**

## Nameplate for Final Project

- I want to design a [nameplate](https://en.wikipedia.org/wiki/Rating_plate) for my [final project](../final-project/index.md).
- The 3mm thickness of the stainless steel was too thick this purpose but I proceeded anyway just to test how much detail we can get with typography.

![Nameplate design](./media/nameplate-design.webp)
**Nameplate design with layers separated by process**

- We were able to create very small texts using the SVG exported from Figma. The program is trying to trace the outline of the text instead of engraving the internal strokes
- We switched to XTool's built-in font and the same issue persisted.
- The [Direct Current Symbol](https://www.compart.com/en/unicode/U+2393) was too small for our process.
- Had we have more time, I would use an image with think storkes instead of vector graphics.

![Nameplate result](./media/engraving-03.webp)
**Engraved nameplate**

## Post-processing

- Jiaming showed me how to cut the metal with MetalFab laser cutter.
- It was the same process we practiced in [Machine Cutting Week](../week-02/index.md)

![Cutting metal with laser](./media/laser-cut-metal.mp4)
**The violent process of cutting metal with laser**

- After cutting, the molten metal edges need to be sanded/filed down for safety.

- Jiaming showed me how to use belt sander to remove the edges.

![Before and after sanding](./media/engraving-04.webp)
**Before and after sanding**

- I practiced the sanding to remove the corners
- The final results look great!

![Final results](./media/final-results.webp)
**Final results of all 3 designs**

- Once again, shout out to [Jiaming](https://fab.cba.mit.edu/classes/863.24/people/JiamingLiu/About%20me.html) for hands-on coaching, and [Edward](https://fab.cba.mit.edu/classes/863.25/people/EdwardChen/) for sharing his characterization results.

## Reflection

- Color engraving is very trial-and-error based. It takes 2 hours just to map out few possible color options.
- The parameters must be determined for the specific material and machine and results may still vary

## Appendix

- [All graphic design assets](./code/design.zip)
- [Spectrogram app](./code/spectrogram-app.zip)
