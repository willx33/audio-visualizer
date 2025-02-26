# Audio Visualizer

I built this audio visualizer app because I wanted a fun way to see music and sound come to life. It captures your microphone input and shows real-time visuals that dance to whatever you're hearing.

![Audio Visualizer Demo](https://via.placeholder.com/800x400.png?text=Audio+Visualizer+Demo)

## What's cool about it

- Four different visualizer styles:
  - Frequency bars (the classic equalizer look)
  - Waveform (shows the actual sound wave)
  - Circular (trippy circular patterns)
  - Particles (floating particles that react to sound)
- You can tweak settings for each visualizer
- Clean, dark interface that lets the visuals shine
- Everything happens in your browser - no data gets sent anywhere

## Get it running

You'll need:
- Node.js
- npm or yarn

Just do:

1. Clone this repo
```bash
git clone https://github.com/yourusername/audio-visualizer.git
cd audio-visualizer
```

2. Install stuff
```bash
npm install
```

3. Fire it up
```bash
npm start
```

4. Go to [http://localhost:3000](http://localhost:3000) in your browser

## How to use it

1. Click "Connect Microphone" (you'll need to give permission)
2. Pick a visualizer style from the tabs
3. Play with the settings if you want
4. Make some noise! Try speaking, playing music, or anything that makes sound

## Privacy stuff

This app doesn't record or send your audio anywhere. All processing happens right in your browser.

## Tech I used

- React 19
- TypeScript
- Web Audio API (for grabbing and analyzing sound)
- Canvas (for drawing the visuals)
- Styled Components

## License

MIT

## Thanks

Big thanks to Web Audio API for making this possible without any server-side processing.

---

Started with Create React App because who wants to set up webpack from scratch?