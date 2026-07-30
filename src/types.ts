export type Language = 'en' | 'ar' | 'fr';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export type TileSkin = 'classic' | 'neon' | 'wooden';
export type SoundStyle = 'piano' | 'synth' | 'wooden';
export type AccuracyRating = 'perfect' | 'great' | 'good';

export interface Note {
  pitch: string; // e.g. "E5", "D#5", "C4"
  freq: number;  // frequency in Hz
  duration: number; // in seconds (for hold notes)
  lane: number;  // 0, 1, 2, 3
  isLong?: boolean;
}

export interface Song {
  id: string;
  title: {
    en: string;
    ar: string;
    fr: string;
  };
  composer: {
    en: string;
    ar: string;
    fr: string;
  };
  difficulty: Difficulty;
  bpm: number;
  baseSpeed: number; // pixels per second
  coverGradient: string;
  notes: Note[];
  tags: string[];
  isEndless?: boolean;
}

export interface ActiveTile {
  id: string;
  lane: number;
  y: number; // Y position on screen (0 at top, canvasHeight at bottom)
  height: number; // Tile height (normal = e.g. 140px, long = 140 + duration*speed)
  noteIndex: number;
  note: Note;
  status: 'pending' | 'holding' | 'completed' | 'missed';
  holdProgress: number; // 0 to 1
  isGold?: boolean;
  isMistake?: boolean; // Red mistake square
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  isSparkle?: boolean;
  rotation?: number;
}

export interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'completed';

export interface UserStats {
  highScores: Record<string, number>; // songId -> score
  stars: Record<string, number>; // songId -> 1..3
  totalNotesHit: number;
  maxCombo: number;
}
