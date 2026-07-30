import { Song, Note } from '../types';

// Helper function to extend and repeat note sequences with natural musical phrase loops and lane variations
const buildLongSongNotes = (baseNotes: Note[], repetitions = 3): Note[] => {
  const result: Note[] = [];
  for (let rep = 0; rep < repetitions; rep++) {
    baseNotes.forEach((n, idx) => {
      // Shift lanes subtly across repetitions for rhythm game variety
      const lane = (n.lane + rep) % 4;
      result.push({
        ...n,
        lane,
      });
    });
  }
  return result;
};

export const SONGS: Song[] = [
  {
    id: 'fur-elise',
    title: {
      en: 'Für Elise',
      ar: 'Für Elise',
      fr: 'Für Elise',
    },
    composer: {
      en: 'L. v. Beethoven',
      ar: 'بيتهوفن',
      fr: 'L. v. Beethoven',
    },
    difficulty: 'easy',
    bpm: 130,
    baseSpeed: 440,
    coverGradient: 'from-amber-600 to-amber-900',
    tags: ['Classical', 'Popular', 'Piano Masterpiece'],
    notes: buildLongSongNotes([
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.35, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.35, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.35, lane: 0 },
      { pitch: 'D5', freq: 587.33, duration: 0.35, lane: 3 },
      { pitch: 'C5', freq: 523.25, duration: 0.35, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.7, lane: 0, isLong: true },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.35, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.7, lane: 3, isLong: true },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 0 },
      { pitch: 'G#4', freq: 415.30, duration: 0.35, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.35, lane: 2 },
      { pitch: 'C5', freq: 523.25, duration: 0.7, lane: 3, isLong: true },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 0 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.35, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.35, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.35, lane: 0 },
      { pitch: 'D5', freq: 587.33, duration: 0.35, lane: 3 },
      { pitch: 'C5', freq: 523.25, duration: 0.35, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.8, lane: 0, isLong: true },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.35, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.35, lane: 3 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 0 },
      { pitch: 'C5', freq: 523.25, duration: 0.35, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.35, lane: 2 },
      { pitch: 'A4', freq: 440.00, duration: 0.9, lane: 0, isLong: true },
    ], 3), // ~105 notes
  },
  {
    id: 'ode-to-joy',
    title: {
      en: 'Ode to Joy',
      ar: 'Ode to Joy',
      fr: 'Ode to Joy',
    },
    composer: {
      en: 'L. v. Beethoven',
      ar: 'بيتهوفن',
      fr: 'L. v. Beethoven',
    },
    difficulty: 'easy',
    bpm: 120,
    baseSpeed: 420,
    coverGradient: 'from-blue-600 to-indigo-900',
    tags: ['Beginner', 'Anthem', 'Symphony'],
    notes: buildLongSongNotes([
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'F4', freq: 349.23, duration: 0.35, lane: 2 },
      { pitch: 'G4', freq: 392.00, duration: 0.35, lane: 3 },
      { pitch: 'G4', freq: 392.00, duration: 0.35, lane: 3 },
      { pitch: 'F4', freq: 349.23, duration: 0.35, lane: 2 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'D4', freq: 293.66, duration: 0.35, lane: 0 },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'D4', freq: 293.66, duration: 0.35, lane: 1 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 2 },
      { pitch: 'E4', freq: 329.63, duration: 0.6, lane: 2, isLong: true },
      { pitch: 'D4', freq: 293.66, duration: 0.3, lane: 1 },
      { pitch: 'D4', freq: 293.66, duration: 0.7, lane: 1, isLong: true },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 2 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 2 },
      { pitch: 'F4', freq: 349.23, duration: 0.35, lane: 3 },
      { pitch: 'G4', freq: 392.00, duration: 0.35, lane: 3 },
      { pitch: 'G4', freq: 392.00, duration: 0.35, lane: 3 },
      { pitch: 'F4', freq: 349.23, duration: 0.35, lane: 2 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'D4', freq: 293.66, duration: 0.35, lane: 0 },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'C4', freq: 261.63, duration: 0.35, lane: 0 },
      { pitch: 'D4', freq: 293.66, duration: 0.35, lane: 1 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 2 },
      { pitch: 'D4', freq: 293.66, duration: 0.6, lane: 1, isLong: true },
      { pitch: 'C4', freq: 261.63, duration: 0.8, lane: 0, isLong: true }
    ], 3), // ~87 notes
  },
  {
    id: 'turkish-march',
    title: {
      en: 'Turkish March',
      ar: 'Turkish March',
      fr: 'Turkish March',
    },
    composer: {
      en: 'W. A. Mozart',
      ar: 'موزارت',
      fr: 'W. A. Mozart',
    },
    difficulty: 'medium',
    bpm: 145,
    baseSpeed: 500,
    coverGradient: 'from-emerald-600 to-teal-900',
    tags: ['Energetic', 'Masterpiece', 'Fast'],
    notes: buildLongSongNotes([
      { pitch: 'B4', freq: 493.88, duration: 0.25, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.25, lane: 0 },
      { pitch: 'G#4', freq: 415.30, duration: 0.25, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.25, lane: 0 },
      { pitch: 'C5', freq: 523.25, duration: 0.45, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.25, lane: 3 },
      { pitch: 'C5', freq: 523.25, duration: 0.25, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.25, lane: 1 },
      { pitch: 'C5', freq: 523.25, duration: 0.25, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.45, lane: 3 },
      { pitch: 'F5', freq: 698.46, duration: 0.25, lane: 3 },
      { pitch: 'E5', freq: 659.25, duration: 0.25, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.25, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.25, lane: 2 },
      { pitch: 'B5', freq: 987.77, duration: 0.25, lane: 3 },
      { pitch: 'A5', freq: 880.00, duration: 0.25, lane: 2 },
      { pitch: 'G#5', freq: 830.61, duration: 0.25, lane: 1 },
      { pitch: 'A5', freq: 880.00, duration: 0.25, lane: 2 },
      { pitch: 'B5', freq: 987.77, duration: 0.45, lane: 3, isLong: true },
      { pitch: 'A5', freq: 880.00, duration: 0.25, lane: 2 },
      { pitch: 'G5', freq: 783.99, duration: 0.25, lane: 1 },
      { pitch: 'F5', freq: 698.46, duration: 0.25, lane: 0 },
      { pitch: 'E5', freq: 659.25, duration: 0.5, lane: 2, isLong: true },
    ], 4), // ~92 notes
  },
  {
    id: 'canon-in-d',
    title: {
      en: 'Canon in D',
      ar: 'Canon in D',
      fr: 'Canon in D',
    },
    composer: {
      en: 'J. Pachelbel',
      ar: 'باكتبيل',
      fr: 'J. Pachelbel',
    },
    difficulty: 'easy',
    bpm: 110,
    baseSpeed: 400,
    coverGradient: 'from-purple-600 to-indigo-950',
    tags: ['Harmonious', 'Relaxing', 'Classic'],
    notes: buildLongSongNotes([
      { pitch: 'F#5', freq: 739.99, duration: 0.5, lane: 3 },
      { pitch: 'E5', freq: 659.25, duration: 0.5, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.5, lane: 1 },
      { pitch: 'C#5', freq: 554.37, duration: 0.5, lane: 0 },
      { pitch: 'B4', freq: 493.88, duration: 0.5, lane: 1 },
      { pitch: 'A4', freq: 440.00, duration: 0.5, lane: 0 },
      { pitch: 'B4', freq: 493.88, duration: 0.5, lane: 1 },
      { pitch: 'C#5', freq: 554.37, duration: 0.5, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.6, lane: 1, isLong: true },
      { pitch: 'F#5', freq: 739.99, duration: 0.4, lane: 3 },
      { pitch: 'A5', freq: 880.00, duration: 0.5, lane: 3 },
      { pitch: 'G5', freq: 783.99, duration: 0.5, lane: 2 },
      { pitch: 'F#5', freq: 739.99, duration: 0.5, lane: 3 },
      { pitch: 'E5', freq: 659.25, duration: 0.5, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.5, lane: 1 },
      { pitch: 'C5', freq: 523.25, duration: 0.5, lane: 0 },
      { pitch: 'D5', freq: 587.33, duration: 0.7, lane: 1, isLong: true }
    ], 4), // ~68 notes
  },
  {
    id: 'moonlight-sonata',
    title: {
      en: 'Moonlight Sonata',
      ar: 'Moonlight Sonata',
      fr: 'Moonlight Sonata',
    },
    composer: {
      en: 'L. v. Beethoven',
      ar: 'بيتهوفن',
      fr: 'L. v. Beethoven',
    },
    difficulty: 'medium',
    bpm: 105,
    baseSpeed: 430,
    coverGradient: 'from-slate-700 to-sky-950',
    tags: ['Atmospheric', 'Deep', 'Masterpiece'],
    notes: buildLongSongNotes([
      { pitch: 'C#4', freq: 277.18, duration: 0.35, lane: 0 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'G#4', freq: 415.30, duration: 0.35, lane: 2 },
      { pitch: 'C#4', freq: 277.18, duration: 0.35, lane: 0 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'G#4', freq: 415.30, duration: 0.35, lane: 2 },
      { pitch: 'C#4', freq: 277.18, duration: 0.35, lane: 0 },
      { pitch: 'E4', freq: 329.63, duration: 0.35, lane: 1 },
      { pitch: 'G#4', freq: 415.30, duration: 0.35, lane: 2 },
      { pitch: 'G#5', freq: 830.61, duration: 0.8, lane: 3, isLong: true },
      { pitch: 'F#5', freq: 739.99, duration: 0.35, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.35, lane: 1 },
      { pitch: 'D#5', freq: 622.25, duration: 0.35, lane: 0 },
      { pitch: 'C#5', freq: 554.37, duration: 0.8, lane: 1, isLong: true }
    ], 5), // ~70 notes
  },
  {
    id: 'spring-vivaldi',
    title: {
      en: 'Spring (Vivaldi)',
      ar: 'Spring (Vivaldi)',
      fr: 'Spring (Vivaldi)',
    },
    composer: {
      en: 'A. Vivaldi',
      ar: 'فيفالدي',
      fr: 'A. Vivaldi',
    },
    difficulty: 'medium',
    bpm: 135,
    baseSpeed: 480,
    coverGradient: 'from-pink-600 to-rose-900',
    tags: ['Baroque', 'Upbeat', 'Violin Transcribed'],
    notes: buildLongSongNotes([
      { pitch: 'E5', freq: 659.25, duration: 0.3, lane: 2 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'F#5', freq: 739.99, duration: 0.2, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.3, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.5, lane: 0, isLong: true },
      { pitch: 'E5', freq: 659.25, duration: 0.3, lane: 2 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'G#5', freq: 830.61, duration: 0.3, lane: 3 },
      { pitch: 'F#5', freq: 739.99, duration: 0.2, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.3, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.6, lane: 0, isLong: true }
    ], 5), // ~70 notes
  },
  {
    id: 'swan-lake',
    title: {
      en: 'Swan Lake Theme',
      ar: 'Swan Lake Theme',
      fr: 'Swan Lake Theme',
    },
    composer: {
      en: 'P. I. Tchaikovsky',
      ar: 'تشايكوفسكي',
      fr: 'P. I. Tchaikovsky',
    },
    difficulty: 'easy',
    bpm: 115,
    baseSpeed: 430,
    coverGradient: 'from-cyan-600 to-blue-900',
    tags: ['Ballet', 'Graceful', 'Classical'],
    notes: buildLongSongNotes([
      { pitch: 'F#5', freq: 739.99, duration: 0.4, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.4, lane: 0 },
      { pitch: 'C#5', freq: 554.37, duration: 0.4, lane: 1 },
      { pitch: 'D5', freq: 587.33, duration: 0.4, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.4, lane: 3 },
      { pitch: 'F#5', freq: 739.99, duration: 0.7, lane: 2, isLong: true },
      { pitch: 'D5', freq: 587.33, duration: 0.4, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.8, lane: 0, isLong: true },
      { pitch: 'F#5', freq: 739.99, duration: 0.4, lane: 2 },
      { pitch: 'B4', freq: 493.88, duration: 0.4, lane: 0 },
      { pitch: 'C#5', freq: 554.37, duration: 0.4, lane: 1 },
      { pitch: 'D5', freq: 587.33, duration: 0.4, lane: 2 },
      { pitch: 'E5', freq: 659.25, duration: 0.4, lane: 3 },
      { pitch: 'F#5', freq: 739.99, duration: 0.7, lane: 2, isLong: true },
      { pitch: 'D5', freq: 587.33, duration: 0.4, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.9, lane: 0, isLong: true }
    ], 5), // ~80 notes
  },
  {
    id: 'symphony-5',
    title: {
      en: 'Symphony No. 5',
      ar: 'Symphony No. 5',
      fr: 'Symphony No. 5',
    },
    composer: {
      en: 'L. v. Beethoven',
      ar: 'بيتهوفن',
      fr: 'L. v. Beethoven',
    },
    difficulty: 'medium',
    bpm: 140,
    baseSpeed: 490,
    coverGradient: 'from-red-700 to-zinc-900',
    tags: ['Dramatic', 'Iconic', 'Orchestral'],
    notes: buildLongSongNotes([
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'Eb4', freq: 311.13, duration: 0.8, lane: 0, isLong: true },
      { pitch: 'F4', freq: 349.23, duration: 0.2, lane: 2 },
      { pitch: 'F4', freq: 349.23, duration: 0.2, lane: 2 },
      { pitch: 'F4', freq: 349.23, duration: 0.2, lane: 2 },
      { pitch: 'D4', freq: 293.66, duration: 0.9, lane: 3, isLong: true },
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'G4', freq: 392.00, duration: 0.2, lane: 1 },
      { pitch: 'Eb4', freq: 311.13, duration: 0.7, lane: 0, isLong: true },
      { pitch: 'Ab4', freq: 415.30, duration: 0.2, lane: 3 },
      { pitch: 'Ab4', freq: 415.30, duration: 0.2, lane: 3 },
      { pitch: 'Ab4', freq: 415.30, duration: 0.2, lane: 3 },
      { pitch: 'G4', freq: 392.00, duration: 0.8, lane: 2, isLong: true }
    ], 5), // ~80 notes
  },
  {
    id: 'clair-de-lune',
    title: {
      en: 'Clair de Lune',
      ar: 'Clair de Lune',
      fr: 'Clair de Lune',
    },
    composer: {
      en: 'C. Debussy',
      ar: 'ديبوسي',
      fr: 'C. Debussy',
    },
    difficulty: 'easy',
    bpm: 100,
    baseSpeed: 410,
    coverGradient: 'from-violet-600 to-purple-950',
    tags: ['Dreamy', 'Impressionist', 'Soft'],
    notes: buildLongSongNotes([
      { pitch: 'F5', freq: 698.46, duration: 0.5, lane: 2 },
      { pitch: 'Eb5', freq: 622.25, duration: 0.5, lane: 1 },
      { pitch: 'Db5', freq: 554.37, duration: 0.5, lane: 0 },
      { pitch: 'C5', freq: 523.25, duration: 0.5, lane: 1 },
      { pitch: 'Bb4', freq: 466.16, duration: 0.7, lane: 2, isLong: true },
      { pitch: 'Ab4', freq: 415.30, duration: 0.5, lane: 0 },
      { pitch: 'F4', freq: 349.23, duration: 0.5, lane: 1 },
      { pitch: 'Db4', freq: 277.18, duration: 0.9, lane: 0, isLong: true }
    ], 7), // ~56 notes
  },
  {
    id: 'minuet-in-g',
    title: {
      en: 'Minuet in G',
      ar: 'Minuet in G',
      fr: 'Minuet in G',
    },
    composer: {
      en: 'J. S. Bach',
      ar: 'باخ',
      fr: 'J. S. Bach',
    },
    difficulty: 'easy',
    bpm: 115,
    baseSpeed: 430,
    coverGradient: 'from-blue-700 to-cyan-900',
    tags: ['Baroque', 'Graceful', 'Piano'],
    notes: buildLongSongNotes([
      { pitch: 'D5', freq: 587.33, duration: 0.4, lane: 3 },
      { pitch: 'G4', freq: 392.00, duration: 0.3, lane: 0 },
      { pitch: 'A4', freq: 440.00, duration: 0.3, lane: 1 },
      { pitch: 'B4', freq: 493.88, duration: 0.3, lane: 2 },
      { pitch: 'C5', freq: 523.25, duration: 0.3, lane: 3 },
      { pitch: 'D5', freq: 587.33, duration: 0.5, lane: 2, isLong: true },
      { pitch: 'G4', freq: 392.00, duration: 0.4, lane: 0 },
      { pitch: 'G4', freq: 392.00, duration: 0.4, lane: 0 },
      { pitch: 'E5', freq: 659.25, duration: 0.4, lane: 3 },
      { pitch: 'C5', freq: 523.25, duration: 0.3, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.3, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.3, lane: 2 },
      { pitch: 'F#5', freq: 739.99, duration: 0.3, lane: 3 },
      { pitch: 'G5', freq: 783.99, duration: 0.6, lane: 2, isLong: true }
    ], 5), // ~70 notes
  },
  {
    id: 'flight-of-bumblebee',
    title: {
      en: 'Flight of the Bumblebee',
      ar: 'Flight of the Bumblebee',
      fr: 'Flight of the Bumblebee',
    },
    composer: {
      en: 'N. Rimsky-Korsakov',
      ar: 'كورساكوف',
      fr: 'N. Rimsky-Korsakov',
    },
    difficulty: 'master',
    bpm: 180,
    baseSpeed: 620,
    coverGradient: 'from-yellow-500 to-amber-800',
    tags: ['Extreme', 'Ultra Fast', 'Challenge'],
    notes: buildLongSongNotes([
      { pitch: 'A5', freq: 880.00, duration: 0.15, lane: 3 },
      { pitch: 'G#5', freq: 830.61, duration: 0.15, lane: 2 },
      { pitch: 'G5', freq: 783.99, duration: 0.15, lane: 1 },
      { pitch: 'F#5', freq: 739.99, duration: 0.15, lane: 0 },
      { pitch: 'F5', freq: 698.46, duration: 0.15, lane: 1 },
      { pitch: 'E5', freq: 659.25, duration: 0.15, lane: 2 },
      { pitch: 'D#5', freq: 622.25, duration: 0.15, lane: 1 },
      { pitch: 'D5', freq: 587.33, duration: 0.15, lane: 0 },
      { pitch: 'C#5', freq: 554.37, duration: 0.15, lane: 1 },
      { pitch: 'C5', freq: 523.25, duration: 0.15, lane: 0 },
      { pitch: 'B4', freq: 493.88, duration: 0.15, lane: 2 },
      { pitch: 'A4', freq: 440.00, duration: 0.15, lane: 1 },
      { pitch: 'G#4', freq: 415.30, duration: 0.15, lane: 0 },
      { pitch: 'A4', freq: 440.00, duration: 0.15, lane: 1 },
      { pitch: 'A5', freq: 880.00, duration: 0.3, lane: 3, isLong: true },
      { pitch: 'E5', freq: 659.25, duration: 0.15, lane: 2 },
      { pitch: 'D5', freq: 587.33, duration: 0.15, lane: 1 },
      { pitch: 'C5', freq: 523.25, duration: 0.15, lane: 0 },
      { pitch: 'A4', freq: 440.00, duration: 0.5, lane: 2, isLong: true }
    ], 5), // ~95 notes
  },
  {
    id: 'endless-survival',
    title: {
      en: 'Endless Survival Mode',
      ar: 'النمط المفتوح (اللانهائي)',
      fr: 'Mode Survie Infini',
    },
    composer: {
      en: 'Symphony Medley',
      ar: 'مزيج المقطوعات الكلاسيكية',
      fr: 'Mélodie Symphonique',
    },
    difficulty: 'master',
    bpm: 160,
    baseSpeed: 460,
    coverGradient: 'from-rose-600 via-purple-600 to-indigo-900',
    tags: ['Endless', 'Speed Up', 'High Score'],
    isEndless: true,
    notes: [] // Dynamically generated in runtime
  }
];

// Energetic A Harmonic Minor & C Harmonic Minor pitch-to-frequency map for Procedural Generation
const PROCEDURAL_PITCH_FREQ: Record<string, number> = {
  'A3': 220.00, 'B3': 246.94, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G#4': 415.30,
  'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G#5': 830.61,
  'A5': 880.00, 'B5': 987.77, 'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G#6': 1661.22,
};

// Procedural musical scale tiers that escalate in intensity & tempo as the player advances
const MINOR_SCALE_TIERS = [
  // Tier 1: Foundation (A3 -> A4) - Strong melodic minor theme
  ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G#4', 'A4'],
  // Tier 2: Mid-Energetic (A4 -> A5) - Fast classical arpeggios
  ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G#5', 'A5'],
  // Tier 3: Virtuosic Climax (E5 -> E6) - High octave intense runs
  ['E5', 'F5', 'G#5', 'A5', 'B5', 'C6', 'D6', 'E6'],
];

/**
 * Procedural Musical Generator ("الخوارزمية التوليدية المتغيرة")
 * Generates evolving A Harmonic Minor sequences based on stage and speed multiplier.
 * Ensures rules of musical harmony (scale steps, arpeggiated chords, cadence resolutions)
 * so the soundtrack never repeats and becomes more intense and fast as gameplay progresses.
 */
export const getNextEndlessNote = (noteIndex: number, speedMultiplier: number = 1.0): Note => {
  // Each 16 notes is a musical phrase / stage
  const stage = Math.floor(noteIndex / 16);
  const positionInPhrase = noteIndex % 16;

  // Escalate intensity based on speed increase or stage progress
  const intensityLevel = Math.min(
    2,
    Math.floor((speedMultiplier - 1.0) * 3) + Math.floor(stage / 2)
  );
  const scaleTier = MINOR_SCALE_TIERS[intensityLevel] || MINOR_SCALE_TIERS[0];

  let pitch: string;
  let duration = 0.35;
  let isLong = false;

  // Rule-based harmonic phrasing
  if (positionInPhrase === 15) {
    // Cadence resolution note at the end of phrase (Root note A4 or A5)
    pitch = intensityLevel === 2 ? 'A5' : 'A4';
    duration = 0.6;
    isLong = true;
  } else if (positionInPhrase === 14) {
    // Leading tone tension (G#4 or G#5) resolving into cadence
    pitch = intensityLevel === 2 ? 'G#5' : 'G#4';
    duration = 0.3;
  } else if (positionInPhrase >= 8 && positionInPhrase <= 13) {
    // Second half of phrase: Rapid arpeggiated triad runs (A minor / E major dominant)
    const arpeggioIndices = intensityLevel === 2
      ? [0, 2, 4, 7, 5, 3] // A5, C6, E6, ...
      : [0, 2, 4, 6, 4, 2]; // A4, C5, E5, G#5...
    const idx = arpeggioIndices[positionInPhrase - 8] % scaleTier.length;
    pitch = scaleTier[idx];
    duration = Math.max(0.18, 0.3 - (intensityLevel * 0.04));
  } else {
    // First half of phrase: Ascending or motif melodic steps with procedural variation
    const stepOffset = (stage * 3 + positionInPhrase) % scaleTier.length;
    pitch = scaleTier[stepOffset];
    duration = Math.max(0.22, 0.35 - (intensityLevel * 0.05));
  }

  // Generate playable dynamic lane patterns (Stairs, Zigzag, Alternating) avoiding same lane repeats
  const lanePatterns = [
    [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 1, 2, 3, 2, 1, 0], // Wave
    [0, 2, 1, 3, 0, 2, 1, 3, 2, 0, 3, 1, 2, 0, 3, 1], // Zigzag
    [1, 0, 2, 3, 1, 2, 0, 3, 1, 3, 0, 2, 1, 2, 3, 0], // Dynamic
  ];
  const selectedPattern = lanePatterns[stage % lanePatterns.length];
  const lane = selectedPattern[positionInPhrase] % 4;

  const freq = PROCEDURAL_PITCH_FREQ[pitch] || 440.0;

  return {
    pitch,
    freq,
    duration,
    lane,
    isLong,
  };
};

