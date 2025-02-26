# Audio Visualizer

I built this audio visualizer app because I wanted a fun way to see music and sound come to life.

## Features

- Four different visualizer styles:
  - Frequency bars
  - Waveform
  - Circular 
  - Particles
- Tweak settings for each visualizer
- Dark interface
- Zero telemetry

## Installation

You'll need:
- Node.js
- npm or yarn

Commands:

1. Clone
```bash
git clone https://github.com/yourusername/audio-visualizer.git
cd audio-visualizer
```

2. Install
```bash
npm install
```

3. Start
```bash
npm start
```

4. Go to [http://localhost:3000](http://localhost:3000) in your browser

## How to use

1. Click "Connect Microphone" (you'll need to give permission)
2. Pick a visualizer style from the tabs
3. Play with the settings if you want
4. Make some noise! Try speaking, playing music, or anything that makes sound

## Privacy

This app doesn't record or send your audio anywhere. All processing happens right in your browser.

## Tech

- React 19
- TypeScript
- Web Audio API (for grabbing and analyzing sound)
- Canvas (for drawing the visuals)