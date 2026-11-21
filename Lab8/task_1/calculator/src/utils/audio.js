let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    } catch {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

function tone(freq, dur = 0.15, type = 'sine', vol = 0.06) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch {
    /* ignore */
  }
}

const SOUNDS = {
  click: () => tone(700, 0.06, 'sine', 0.05),
  add: () => {
    tone(880, 0.09, 'triangle', 0.07);
    setTimeout(() => tone(1320, 0.08, 'triangle', 0.05), 60);
  },
  delete: () => {
    tone(280, 0.1, 'sawtooth', 0.05);
    setTimeout(() => tone(180, 0.14, 'sawtooth', 0.05), 60);
  },
  edit: () => {
    tone(720, 0.07, 'sine', 0.05);
    setTimeout(() => tone(960, 0.07, 'sine', 0.04), 55);
  },
  error: () => tone(180, 0.2, 'square', 0.05),
  clear: () => {
    tone(600, 0.1, 'sawtooth', 0.06);
    setTimeout(() => tone(400, 0.12, 'sawtooth', 0.05), 80);
    setTimeout(() => tone(250, 0.15, 'sawtooth', 0.04), 170);
  },
};

export function playSound(name) {
  if (!audioCtx) return;
  const play = SOUNDS[name];
  if (play) play();
}