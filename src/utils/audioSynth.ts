import { SoundStyle, AccuracyRating } from '../types';

// Web Audio API Acoustic Piano Synthesizer Engine
// Royalty-Free, 0 Latency, High Fidelity Polyphonic Piano Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private isMuted: boolean = false;

  // Dynamic Audio Layering ("طبقات الإيقاع المتصاعدة") state
  private layeringInterval: ReturnType<typeof setInterval> | null = null;
  private currentLayerIntensity: number = 0; // 0=off, 1=bassline, 2=bassline+percussion, 3=bassline+percussion+arp
  private beatStep: number = 0;

  private noteFreqMap: Record<string, number> = {
    // Octave 3
    'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
    'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
    'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
    // Octave 4
    'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
    'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
    // Octave 5
    'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
    'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
    'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
    // Octave 6
    'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
  };

  constructor() {
    // Lazy init on first user gesture
  }

  public initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getFrequency(pitch: string): number {
    if (this.noteFreqMap[pitch]) {
      return this.noteFreqMap[pitch];
    }
    // Fallback parser if pitch like C5 or F#4
    return 440;
  }

  /**
   * Plays realistic acoustic piano, synth, or wooden tone with accuracy dampening audio feedback
   */
  public playNote(
    pitch: string | number,
    durationSec: number = 0.5,
    accuracy: AccuracyRating = 'perfect',
    soundStyle: SoundStyle = 'piano'
  ): void {
    if (this.isMuted) return;
    this.initAudioContext();

    if (!this.ctx || !this.masterGain) return;

    const freq = typeof pitch === 'number' ? pitch : this.getFrequency(pitch);
    const now = this.ctx.currentTime;

    const noteGain = this.ctx.createGain();
    noteGain.connect(this.masterGain);

    // Audio Precision Dampening Adjustment
    // Perfect: Bright resonance & full gain
    // Great: Standard gain & slightly warm filter
    // Good: Muted / dampened tone (lowpass cut + faster decay) to give immediate feedback
    const accuracyGainMult = accuracy === 'perfect' ? 1.0 : accuracy === 'great' ? 0.85 : 0.65;
    const totalTime = Math.max(durationSec, accuracy === 'good' ? 0.25 : 0.4);

    if (soundStyle === 'synth') {
      // Synthwave / Neon Sound Style
      const attackTime = 0.005;
      const decayTime = 0.15;
      const sustainLevel = 0.4 * accuracyGainMult;

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.7 * accuracyGainMult, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + totalTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoff = accuracy === 'perfect' ? freq * 8 : accuracy === 'great' ? freq * 5 : freq * 2.5;
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(3.0, now);
      filter.connect(noteGain);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.005, now); // subtle detune chorusing

      osc1.connect(filter);
      osc2.connect(filter);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + totalTime + 0.05);
      osc2.stop(now + totalTime + 0.05);
    } else if (soundStyle === 'wooden') {
      // Wooden Marimba / Kalimba Sound Style
      const attackTime = 0.002;
      const decayTime = accuracy === 'good' ? 0.1 : 0.25;

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.9 * accuracyGainMult, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + decayTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const bandFreq = accuracy === 'good' ? freq * 1.2 : freq * 2;
      filter.frequency.setValueAtTime(bandFreq, now);
      filter.Q.setValueAtTime(4.0, now);
      filter.connect(noteGain);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);

      osc.start(now);
      osc.stop(now + decayTime + 0.05);
    } else {
      // Classic Acoustic Piano Sound Style
      const harmonics = [
        { mult: 1, gain: 1.0 },
        { mult: 2, gain: accuracy === 'good' ? 0.1 : 0.35 },
        { mult: 3, gain: accuracy === 'good' ? 0.02 : 0.15 },
        { mult: 4, gain: 0.05 },
      ];

      const attackTime = 0.005;
      const decayTime = 0.2;
      const sustainLevel = (accuracy === 'good' ? 0.15 : 0.3) * accuracyGainMult;

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.8 * accuracyGainMult, now + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + totalTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      // Dampened frequency cutoff on 'good' / late press
      const filterCutoff = accuracy === 'perfect' ? freq * 5 : accuracy === 'great' ? freq * 3.5 : freq * 1.8;
      filter.frequency.setValueAtTime(filterCutoff, now);
      filter.Q.setValueAtTime(1.2, now);
      filter.connect(noteGain);

      harmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = h.mult === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * h.mult, now);

        oscGain.gain.setValueAtTime(h.gain, now);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start(now);
        osc.stop(now + totalTime + 0.1);
      });
    }
  }

  /**
   * Play Wrong Note / Game Over sound effect
   */
  public playErrorSound(): void {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Play Gold Star / Combo fanfare chime
   */
  public playSparkleSound(): void {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  /**
   * Start Dynamic Layering ("طبقات الإيقاع المتصاعدة")
   * Generates synchronized background audio layers:
   * - Layer 1: Continuous warm rhythmic bassline (Bassline) to maintain momentum
   * - Layer 3: Escalating percussion & echo/arp accents that appear as score/speed increases
   */
  public startDynamicLayering(bpm: number = 120): void {
    this.stopDynamicLayering();
    this.currentLayerIntensity = 1;
    this.beatStep = 0;

    const stepMs = Math.round((60000 / Math.max(80, bpm)) / 2); // 8th note steps
    this.layeringInterval = setInterval(() => {
      if (this.isMuted || !this.ctx || !this.masterGain || this.currentLayerIntensity <= 0) return;

      const now = this.ctx.currentTime;
      const step = this.beatStep++;

      // Layer 1: Warm continuous background Bassline (Every quarter note: step % 2 === 0)
      if (step % 2 === 0) {
        const rootFreqs = [110.0, 82.41, 87.31, 82.41]; // A2, E2, F2, E2
        const bassFreq = rootFreqs[Math.floor(step / 2) % rootFreqs.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(bassFreq * 2.5, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.25);
      }

      // Layer 3a: Rhythmic Percussive Accents (When intensity >= 2: Combo/Score increases)
      if (this.currentLayerIntensity >= 2 && step % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        const clickFreq = step % 4 === 1 ? 800 : 1200;
        osc.frequency.setValueAtTime(clickFreq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
      }

      // Layer 3b: Atmospheric Synth Echo / Arpeggio Shimmer (When intensity >= 3: Fever / High Speed)
      if (this.currentLayerIntensity >= 3 && step % 4 === 3) {
        const arpFreqs = [659.25, 880.00, 1046.50, 1318.51]; // E5, A5, C6, E6
        const freq = arpFreqs[(Math.floor(step / 4)) % arpFreqs.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.35);
      }
    }, stepMs);
  }

  /**
   * Adjust layering intensity based on live gameplay progression
   */
  public setLayeringIntensity(combo: number, score: number, isEndless: boolean = false, isFever: boolean = false): void {
    if (combo >= 15 || isFever || (isEndless && score > 1200)) {
      this.currentLayerIntensity = 3; // All 3 layers: Bassline + Percussion + Synth Arp
    } else if (combo >= 6 || score > 400 || (isEndless && score > 300)) {
      this.currentLayerIntensity = 2; // 2 layers: Bassline + Percussion
    } else {
      this.currentLayerIntensity = 1; // 1 layer: Foundation Bassline
    }
  }

  /**
   * Stop background dynamic layering
   */
  public stopDynamicLayering(): void {
    if (this.layeringInterval) {
      clearInterval(this.layeringInterval);
      this.layeringInterval = null;
    }
    this.currentLayerIntensity = 0;
    this.beatStep = 0;
  }
}

export const audioEngine = new AudioEngine();
