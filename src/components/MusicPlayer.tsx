import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Generate a soft romantic melody using Web Audio API
const createRomanticMelody = (ctx: AudioContext) => {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(ctx.destination);

  // Soft pad sound
  const playNote = (freq: number, startTime: number, duration: number) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = 800;

    osc1.type = "sine";
    osc1.frequency.value = freq;
    osc2.type = "triangle";
    osc2.frequency.value = freq * 1.002; // Slight detune for warmth

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(masterGain);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.15, startTime + duration * 0.6);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc1.start(startTime);
    osc1.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
  };

  // Romantic chord progression: C - Am - F - G (in a dreamy way)
  const chords = [
    [261.63, 329.63, 392.00], // C major
    [220.00, 261.63, 329.63], // A minor
    [174.61, 220.00, 261.63], // F major
    [196.00, 246.94, 293.66], // G major
    [261.63, 329.63, 392.00], // C major
    [220.00, 261.63, 329.63], // A minor
    [174.61, 220.00, 261.63], // F major
    [246.94, 293.66, 392.00], // G major (higher)
  ];

  // Melody notes on top
  const melody = [
    523.25, 493.88, 440.00, 493.88,
    523.25, 587.33, 523.25, 493.88,
    440.00, 392.00, 440.00, 493.88,
    523.25, 493.88, 440.00, 392.00,
  ];

  const beatDuration = 1.2;
  let time = ctx.currentTime + 0.1;

  // Play chords
  chords.forEach((chord, i) => {
    chord.forEach((freq) => {
      playNote(freq, time + i * beatDuration * 2, beatDuration * 2.5);
    });
  });

  // Play melody
  melody.forEach((freq, i) => {
    const melodyOsc = ctx.createOscillator();
    const melodyGain = ctx.createGain();
    const melodyFilter = ctx.createBiquadFilter();

    melodyFilter.type = "lowpass";
    melodyFilter.frequency.value = 1200;

    melodyOsc.type = "sine";
    melodyOsc.frequency.value = freq;
    melodyOsc.connect(melodyGain);
    melodyGain.connect(melodyFilter);
    melodyFilter.connect(masterGain);

    const start = time + i * beatDuration;
    melodyGain.gain.setValueAtTime(0, start);
    melodyGain.gain.linearRampToValueAtTime(0.2, start + 0.15);
    melodyGain.gain.linearRampToValueAtTime(0, start + beatDuration * 0.9);

    melodyOsc.start(start);
    melodyOsc.stop(start + beatDuration);
  });

  return beatDuration * melody.length;
};

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startMusic = () => {
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const loopDuration = createRomanticMelody(ctx);

      intervalRef.current = setInterval(() => {
        if (ctxRef.current && ctxRef.current.state === "running") {
          createRomanticMelody(ctxRef.current);
        }
      }, loopDuration * 1000);

      setPlaying(true);
    } catch {
      // Audio not supported
    }
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    setPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return (
    <button
      onClick={playing ? stopMusic : startMusic}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass-card flex items-center justify-center transition-all duration-300 hover:scale-110 animate-glow-pulse"
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
    >
      {playing ? (
        <Volume2 className="w-4 h-4 text-primary" />
      ) : (
        <VolumeX className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

export default MusicPlayer;
