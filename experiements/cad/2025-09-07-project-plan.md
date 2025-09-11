# Field Programmable Generative AI

## Overview

A physical AI agent network implemented as a hardware grid with voice-based interaction and programming capabilities. The system combines push-to-talk interfaces with node-based generative AI computation, allowing users to dynamically program and interact with AI agents through voice commands.

### Sketch

<img width="396" height="528" alt="Image" src="https://github.com/user-attachments/assets/9cbf9059-d236-4aed-a8df-5163860d25b9" />

### AI Rendering

All visuals generated with `gemini-2.5-flash-image-preview`. Prompt attached below each image.

<img width="256" height="256" alt="Image" src="https://github.com/user-attachments/assets/00925f8d-4ad6-4b86-bb47-707ea9c0091e" />

> Visualize a metal box in the form factor of a mac mini. The top surface of the box has 9 headphone jacks, laid out in a 3 x 3 grid. Clean, modern design sketch again pure white background

<img width="256" height="256" alt="Image" src="https://github.com/user-attachments/assets/40d8fbb1-28f9-4d25-98a8-0822a9c24b67" />

> Visualize a CB radio speaker-mic handheld device with a tri-state slider switch: Off/On/Programming. The unit has a coiled cord ending in a 3.5mm TRRS jack. Clean, modern design sketch again pure white background.

<img width="256" height="256" alt="Image" src="https://github.com/user-attachments/assets/976c6589-57cd-4983-ac74-e90f342c80d2" />

> Visualize device 1 on the left with its 3.5mm jack plugged into device 2 on the right, and being held by a user.
>
> 1. The CB radio speaker-mic handheld device with a tri-state slider switch: Off/On/Programming. The unit has a coiled cord ending in a 3.5mm TRRS jack.
> 2. The metal box is in the form factor of a mac mini. The top surface of the box has 9 headphone jacks, laid out in a 3 x 3 grid.
>
> Generate the sketch in industrial design concept art style. Focus on communicating the form and function in context. Clean white background. No text labels.

## Motivation

The project synthesizes three key inspirations:

- Push-to-talk interaction paradigm from the [Doug project](https://x.com/gvy_dvpont/status/1866217836537848144)
- Programming language design for generative AI systems
- Real-time visualization of AI applications through node-link graphs

## System Architecture

### Hardware Components

**Main Board**

- Grid of 3.5mm TRRS jacks serving as physical computation nodes
- Embedded controller for audio signal processing
- LED indicators for node states and network connections
- Network interface to companion computer

**Speaker-Microphone Units**

- Handheld devices with TRRS connectors
- Push-to-talk button for voice input
- Mode switch (interaction/programming)
- Built-in speaker for AI audio output

### Operating Modes

**Interaction Mode**

- Push-to-talk activates voice input to connected node
- AI processes input and returns audio response through speaker
- Real-time computation with visual feedback via LEDs

**Programming Mode**

- Voice commands modify network topology
- Reprogram individual node computation logic
- Create autonomous nodes that operate without physical connection
- Define inter-node communication patterns

### Multi-User Capabilities

Multiple speaker-microphone units connect simultaneously to enable:

- Human-to-AI interactions
- Human-to-human communication through AI mediation
- AI agent-to-agent communication
- Collaborative network programming

## Technical Implementation

**Hardware Layer**

- Custom PCB with TRRS jack matrix
- Microcontroller for audio codec and routing
- LED driver circuitry for visual feedback
- USB/Ethernet interface for computer connection

**Software Layer**

- Audio signal encoding/decoding on main board controller
- Network protocol for computer communication
- Generative AI inference on companion computer
- Memory and state management system
- Real-time network topology engine

**AI Components**

- Voice recognition and synthesis
- Natural language understanding for programming commands
- Reasoning and transformation engines
- Self-modifying network topology algorithms
