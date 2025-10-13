---
title: "Week 6: Wish I were the Steves"
date: 2025-10-13
keywords: ["electronics", "pcb", "fabrication"]
---

- Legend goes Steve Jobs and Steve Wozniak hand built Apple-1 in their garage.
- This week, I'm going to learn how to hand build something simpler, a microcontroller board.

## Group assignment

- Characterd the design rules for our Carvera PCB milling machine
- Read the [tutorial by our TA Quentin](https://quentinbolsee.pages.cba.mit.edu/carvera-pcb-tutorial/)
- Produced a test PCB. Observed large amounts of burrs on the edge.
- Learned that it was due to damaged endmill. And learned how to replace the bit.
- I attended a second session with Kristof and debugged the milling machine in a halted state.
- Submitted the debugging process as a [group note](https://fab.cba.mit.edu/classes/MAS.863/CBA/group_assignments/week6/)

## Fabricating

- My final project has two components: a hand-held unit I call "the Operator", and a main body unit I call "the Switchboard". I will attempt fabrication on both.
- From previous week's simulation work, I already have a design for both boards. I will focus on the milling aspects.
- Another caveat is that the ICS-43434 Microphone comes without a breakout board. So I will fabricate that as well.

## The Operator

1. Milling the board was straightforward. For single sided board, my workflow:
1. In KiCad, export PCB as Gerber files as well as drill files.
1. Using [gerber2img](https://quentinbolsee.pages.cba.mit.edu/gerber2img/) to convert the copper layer + edge cut layer + drill to PNG files
1. Use "Black and white" and download the two versions, check "Fill edge cut" for the exterior cut (which also included drill holes), uncheck "Fill edge cut" for the traces.
1. Use Neal's [modsproject](https://modsproject.org/), Carvera mill 2D PCB program to produce the final job code for the milling machine.
1. Saw burrs in the prodcution
1. After sanding the results were very good
1. But when I start to gather components for stuffing, I realized the mistake:
   - We don't have surface mount pin connector sockets. I need to either bend the legs of the through-hole ones, or change my design
   - Lesson learned: check components and stay flexible during the design process
   - I received TA feedback that I can consdier two sided board with a ground plane on the back for simpler routing
1. So I redid my design. Learned about how to fill ground plane and produced my my 2-sided PCB.
1. Then I realized my second mistake, thankfully caught before milling:
   - When I switched from Surface Mount to Through Hole, I didn't thing about the soldering process. I assumed we would have plated through holes (PTH) so I can solder on either side. Without them, I must solder on the opposite side of the component and use vias to connect the front and back.
     - I ended up redesigning the entire board to account for solder constraints
     - Lesson learned: think about manufacturing process during design.
1. I added the vias, as well as a other nice things in the process: M2 mounting holds and rounded edges for the board
1. Milling two-sided PCB isn't easy.
   - There is [a trick](https://sibusaman.fabcloud.io/doublepcb/) to use symmetry to create a fixture that holds the board at the same origin.
   - I didn't use the trick. Instead, I milled the first side, measured the offset of the machine and calibrated the origin for the second side. The process was a bit tedious.
1. First attemped failed because I forgot to mirror the backside image and forgot to include tab offset for both sides, so things are all misaligned.
1. Second attempt succeeded with perfect alignment. Here is the calculation I used to set the origin:

```
backside first:
bottom: 5 mm
entered left: 3.9265 mm
expected right: 3.9265 mm
actual left: 5.51 mm
actual right: 4.74 mm

frontside:
bottom: 5 mm
entered left: 3.156 mm = 4.74 - (5.51 - 3.9265 )
```

1. I got holes are perfectly aligned on both sides
1. Soldering this board was much harder than expected. The through hole has limited grip on solder despie the flux I used. I had to reflow multiple times to get a good connection.

## The Switchboard

1. I used the same female connector socket for the Swichboard PCB
1. I made almost all the same mistakes as the Operator:
   - My origin al design assumed PTH. Luckily the Switchboard is one-sided, so I can move all components to the other side and adjust the circuit without thinking about vias.
   - I forgot to mirror the component pins after flipping sides
   - I used the wrong pins after flipping sides and only realized it after milling
1. I didn't realize the mirror problem until I finished solding all the resistors for the LEDs.
1. So I decided to capitalize on the mistake and test the LED.
1. I placed the LED on the circuit without solder and used multimeter to light it up. It worked!

## Bonus: Laser cutting my own ICS-43434 breakout board

1. I need an ICS-43434 breakout board like [this](https://www.digikey.com/en/products/detail/adafruit-industries-llc/6049/25589349)
1. I followed [a YouTube tutorial](https://www.youtube.com/watch?v=8peIFpolsmk) to setup the machine. However, the settings UI looked different: I didn't have speed setings (mm/s) but instead I have dot duration (microseconds)
1. Initial testing results were awful. Some parts were burned, but the surface isn't fully removed.
1. I realized the problem is with image format. PNGs are processed differently from SVGs. Switching to SVG expose all the correct settings to me.
1. I decided on this workflow:
   - Drill holes with the mill first, so I can use the holes to align the laser
   - Laser cut the trace with laser
   - Edge cut with the mill
1. The gerber2img tool doesn't export SVG, and the KiCAD SVG export seems to have an inversion issue that prevented xTool software from reading it correctly. So did the PNG to SVG conversion.
   - PNG to SVG with [Adobe PNG to Vector converter tool](https://www.adobe.com/express/feature/image/convert/png-to-svg)
   - Use [Figma](https://www.figma.com/) to clean up the SVG.
   - Scale the SVG to the actual dimension as measured in KiCAD
1. The xTool V1 Ultra camera aligned is a bit off. Even though I perfectly aligned the SVG with holes, the result came out shifted.
1. After a manual offset, the result was very good on 4th attempt.
1. The maximum number of passes is 10. I have to process it twice to remove all the copper.
1. In retrospect, a faster better workflow might be:
   - Laser cut the trace
   - Drill and cut with the mill
1. But this assumes we can align the mill as easily as the laser. In my experience, mill also has alignment issues and it's much slower to iterate. So I don't know what's better.
1. Soldering the ICS-43434 was extremely difficult.
   - The ICS-43434 has tiny pads on the bottom side, unreachable by soldering iron.
   - The tracing is so thin they could barely hold any solder.
   - I used heat gun to let surface tension do the work, but the heat is damaging the case of the microphone.
   - I attempted bottom up heating but it burned the PCB before melting the solder.
   - After many attempts, I ended with a position has no shorting between any two pads, but I have yet to test whether the microphone works.

## Key lessons

- Check component availability before designing
- Think about manufacturing process during design
- Double check orientations, especially when two sided PCBs are involved
- Home-made through hole does not solder as easily as commercial PTH. Consider surface mount if possible.
- Don't rely on intuition. I'm incline to make the same mistake over and over.
