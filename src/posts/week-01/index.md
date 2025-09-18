---
title: "Week 1: Getting Started"
date: 2025-09-03
keywords: ["cad"]
---

## Learning CAD

I want to stay in Linux so my options are a more limited. I looked into FreeCAD and Onshape, and briefly tried OpenSCAD, OpenJSCAD, and PySCAD. Initial thoughts:

**FreeCAD**: similar to most open-source software, very powerful and very hard to use. The v1 release came out near the end of 2024, so tutorials for the latest version are limited.
**Onshape**: well done for a web app. Switching between sketch and parts design feels very seamless. But I'm afraid of vendor lock in and network connection issues.

I also attempted running VS Code + GitHub Copilot (gemini 2.5 pro) + FreeCAD MCP. It works as a proof of concept but the AI struggles to make the right editing decision. I do foresee text-to-CAD becoming viable in the next year or two.

Before giving up on AI assisted CAD (AAD?), I want give the code-first approach a shot. My first intuitation is that the declarative syntax of OpenSCAD will be perfect for AI code generation. But upon a closer look, there are still gaps:

- Lack of type annotation, reducing LLM's ability to validate results
- Syntax extremely verbose, further increasing error rate.
- Lack of custom editor support. Making VS Code and Cursor use difficult.

My decision is to stay with FreeCAD and Onshape. Maybe explore AI assisted model building as a side project when there is less pressure in meeting the project deadline.

This is what I've got for my projects. (Screenshots for now. I will try make a live model viewer later)

![Device base](./media/base-freecad.webp)
**Device base with FreeCAD ([download](./models/main-body.FCStd))**

![Hand unit](./media/hand-unit-freecad.webp)
**Hand unit with FreeCAD ([download](./models//speaker-mic.FCStd))**

![Full system](./media/combined-model-onshape.webp)
**Full system with Onshape ([download](./models/FPGAI-concept.step))**

Things I need to keep learning/practicing on:

- Model for 3D printing, not for rendering.
- Sketching on curved surfaces.
- Parameterize more things
- Integrate the electronics into the modeling process

Things I am reflecting on:

- The constraints system in CAD is very similar to the responsive design principle in CSS, and even more similar to the iOS app layout system.
- I can see some parallel between functional programming and CAD. If each operator is a pure function, the entire process can be modeled as a composition of functions.
- Usability matters. No matter how powerful the system is, if the entry bar is too high, novice users will build their habits around the easier products and get locked into their ecosystem.
