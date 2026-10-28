/**
 * Efeitos sonoros sintetizados com Web Audio: nenhum arquivo externo, nenhuma
 * licença de terceiros. O jogo é completo sem som; toda informação sonora também
 * aparece na tela.
 */
export type SoundName = 'select' | 'correct' | 'wrong' | 'complete' | 'levelup' | 'achievement';

interface Note {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

const SOUNDS: Record<SoundName, Note[]> = {
  select: [{ freq: 660, start: 0, duration: 0.05, type: 'triangle', gain: 0.35 }],
  correct: [
    { freq: 587, start: 0, duration: 0.09, type: 'triangle' },
    { freq: 880, start: 0.08, duration: 0.14, type: 'triangle' },
  ],
  wrong: [
    { freq: 220, start: 0, duration: 0.12, type: 'sine', gain: 0.6 },
    { freq: 185, start: 0.1, duration: 0.16, type: 'sine', gain: 0.5 },
  ],
  complete: [
    { freq: 523, start: 0, duration: 0.12, type: 'triangle' },
    { freq: 659, start: 0.1, duration: 0.12, type: 'triangle' },
    { freq: 784, start: 0.2, duration: 0.12, type: 'triangle' },
    { freq: 1047, start: 0.3, duration: 0.3, type: 'triangle' },
  ],
  levelup: [
    { freq: 392, start: 0, duration: 0.1, type: 'square', gain: 0.25 },
    { freq: 523, start: 0.09, duration: 0.1, type: 'square', gain: 0.25 },
    { freq: 659, start: 0.18, duration: 0.1, type: 'square', gain: 0.25 },
    { freq: 784, start: 0.27, duration: 0.1, type: 'square', gain: 0.25 },
    { freq: 1047, start: 0.36, duration: 0.4, type: 'triangle', gain: 0.6 },
  ],
  achievement: [
    { freq: 1319, start: 0, duration: 0.08, type: 'sine', gain: 0.5 },
    { freq: 1568, start: 0.07, duration: 0.08, type: 'sine', gain: 0.5 },
    { freq: 2093, start: 0.14, duration: 0.25, type: 'sine', gain: 0.4 },
  ],
};

class AudioService {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private volume = 0.6;

  configure(enabled: boolean, volume: number): void {
    this.enabled = enabled;
    this.volume = Math.min(1, Math.max(0, volume));
  }

  private context(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor = globalThis.AudioContext ?? (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      this.ctx = new Ctor();
    } catch {
      return null;
    }
    return this.ctx;
  }

  play(name: SoundName): void {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.context();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    const master = ctx.createGain();
    master.gain.value = this.volume * 0.18;
    master.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.01;
    for (const note of SOUNDS[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type ?? 'sine';
      osc.frequency.value = note.freq;
      const start = t0 + note.start;
      const peak = note.gain ?? 1;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
      osc.connect(gain).connect(master);
      osc.start(start);
      osc.stop(start + note.duration + 0.02);
    }
  }
}

export const audio = new AudioService();
