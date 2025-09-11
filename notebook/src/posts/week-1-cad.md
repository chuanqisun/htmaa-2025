---
title: Week 1
date: 2025-09-03
keywords: ["cad"]
---

## Project kickoff

As a 1st year graduate student joining Tangible Media Group (TMG) at the Media Lab, I want to combine my background in AI application development with TMG's focus in Tangible Interface to build a voice-driven AI programming system inspired by telephone switchboard operators.

### The inspiration

I’m motivated by how AI-routed phone systems have eroded the empathy and connection once provided by human operators. I want to revive that craft by building a switchboard that puts a person back in the loop as a thoughtful listener and connector.

![Switchboard operator](../../media/switchboard.webp)
**Jersey Telecom Switchboard and Operator ([Source])**

### The idea

A physical AI agent network implemented as a hardware grid with voice-based interaction and programming capabilities. The system combines push-to-talk interfaces with node-based generative AI computation, allowing users to dynamically program and interact with AI agents through voice commands. I want to call this system **Field Programmable Generative AI (FPGAI)**

![Concept sketch](../../media//concept-sketch.webp)
**My initial sketch**

Next, I want to visualize the idea with gen AI. I'm entirely new to 3D modeling and rendering, so the fastest route to gain intuition on the form of the design is naturally using AI.

I crafted the prompt based on what I was imagining. The latest gemini model got this for me in one shot.

<details>
<summary>Prompt</summary>
Visualize a metal box in the form factor of a mac mini. The top surface of the box has 9 headphone jacks, laid out in a 3 x 3 grid. Clean, modern design sketch again pure white background.

Model: gemini-2.5-flash-image-preview

</details>

![Base](../../media/ai-rendered-base.webp)
**Device base**

Next, let's visualize the hand-held device. I want to model it after a CB radio speaker mic. Inspired by [this project](https://x.com/gvy_dvpont/status/1866217836537848144)

<details>
<summary>Prompt</summary>
Visualize a CB radio speaker-mic handheld device with a tri-state slider switch: Off/On/Programming. The unit has a coiled cord ending in a 3.5mm TRRS jack. Clean, modern design sketch again pure white background.

Model: gemini-2.5-flash-image-preview

</details>

![Hand unit](../../media/ai-rendered-hand-unit.webp)
**Hand unit**

Finally, let's put them together and add bit context. I haven't decided the exact size for each component yet. I think that will have to wait until I figured out the electronics first.

<details>
<summary>Prompt</summary>
Visualize device 1 on the left with its 3.5mm jack plugged into device 2 on the right, and being held by a user.

1. The CB radio speaker-mic handheld device with a tri-state slider switch: Off/On/Programming. The unit has a coiled cord ending in a 3.5mm TRRS jack.
2. The metal box is in the form factor of a mac mini. The top surface of the box has 9 headphone jacks, laid out in a 3 x 3 grid.
Generate the sketch in industrial design concept art style. Focus on communicating the form and function in context. Clean white background. No text labels.
</details>

![In use](../../media/ai-rendered-in-use.webp)
**In use**

## Learning CAD

[Source]: https://commons.wikimedia.org/wiki/File:Jersey_Telecom_switchboard_and_operator.jpg
