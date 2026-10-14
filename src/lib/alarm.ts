// Timer alarm for cooking mode: a repeating beep (Web Audio, so it needs no audio file and no speech voice) plus a
// vibration on phones that support it. Browser-only. Audio can only start after a user gesture, so unlockAlarm()
// is called when the timer is started (a tap), and the alarm later plays through that unlocked context.

let context: AudioContext | null = null;
let repeat: ReturnType<typeof setInterval> | null = null;
let giveUp: ReturnType<typeof setTimeout> | null = null;

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function unlockAlarm(): void {
  try {
    const AudioCtor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioCtor) return;
    context ??= new AudioCtor();
    if (context.state === 'suspended') void context.resume();
  } catch {
    // No audio available: the banner and vibration still work
  }
}

function beep(at: number, frequency: number, seconds: number): void {
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  // Quick fade in/out so it does not click
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.4, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(at);
  oscillator.stop(at + seconds + 0.05);
}

function burst(): void {
  if (context) {
    const start = context.currentTime + 0.05;
    for (let i = 0; i < 3; i++) beep(start + i * 0.35, 880, 0.2);
  }
  try {
    navigator.vibrate?.([250, 120, 250, 120, 250]);
  } catch {
    // Vibration is optional
  }
}

export function stopAlarm(): void {
  if (repeat) clearInterval(repeat);
  if (giveUp) clearTimeout(giveUp);
  repeat = giveUp = null;
  try {
    navigator.vibrate?.(0);
  } catch {
    // ignore
  }
}

// Beeps every 3 seconds until stopAlarm() (the user dismissing the banner), and gives up on its own after a while
export function startAlarm(maxSeconds = 45): void {
  stopAlarm();
  unlockAlarm();
  burst();
  repeat = setInterval(burst, 3000);
  giveUp = setTimeout(stopAlarm, maxSeconds * 1000);
}
