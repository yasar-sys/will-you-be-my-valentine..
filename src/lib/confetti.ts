import confetti from "canvas-confetti";

export const fireConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ff6b81", "#ff4757", "#e84393", "#fd79a8", "#ff9ff3", "#f368e0"],
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff6b81", "#ff4757", "#e84393"],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#fd79a8", "#ff9ff3", "#f368e0"],
    });
  }, 250);

  // Heart-shaped burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ["circle"],
      colors: ["#ff6b81", "#ff4757", "#e84393", "#fd79a8"],
      scalar: 1.2,
    });
  }, 500);
};

export const playSuccessSound = () => {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  } catch {
    // Audio not supported
  }
};
