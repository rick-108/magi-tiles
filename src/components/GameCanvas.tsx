import React from 'react';
import { Pause, Play, ArrowLeft, Flame, Zap } from 'lucide-react';
import { Song, ActiveTile, Particle, ShockwaveRing, FloatingText, Language, Note, TileSkin, SoundStyle, AccuracyRating } from '../types';
import { audioEngine } from '../utils/audioSynth';
import { getNextEndlessNote } from '../data/songs';

interface GameCanvasProps {
  song: Song;
  lang: Language;
  keyBindings: string[];
  tileSkin?: TileSkin;
  soundStyle?: SoundStyle;
  onFinishGame: (finalScore: number, maxCombo: number, isCompleted: boolean) => void;
  onBackToMenu: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  song,
  lang,
  keyBindings,
  tileSkin = 'classic',
  soundStyle = 'piano',
  onFinishGame,
  onBackToMenu,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // React states for HUD
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameProgress, setGameProgress] = React.useState(0);

  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  // Game Engine Refs
  const scoreRef = React.useRef(0);
  const comboRef = React.useRef(0);
  const maxComboRef = React.useRef(0);
  const isPausedRef = React.useRef(false);
  const isGameOverRef = React.useRef(false);
  const hasGameStartedRef = React.useRef(false); // Waiting for first tap

  // Song Queue & Entities
  const noteIndexRef = React.useRef(0);
  const activeTilesRef = React.useRef<ActiveTile[]>([]);
  const particlesRef = React.useRef<Particle[]>([]);
  const shockwaveRingsRef = React.useRef<ShockwaveRing[]>([]);
  const floatingTextsRef = React.useRef<FloatingText[]>([]);

  // Speed and time tracking
  const currentSpeedRef = React.useRef(song.baseSpeed);
  const lastTimeRef = React.useRef<number>(0);
  const lanePressStateRef = React.useRef<boolean[]>([false, false, false, false]);

  // Viewport dimensions
  const canvasWidthRef = React.useRef(400);
  const canvasHeightRef = React.useRef(700);

  // Audio unlock state
  const hasAudioUnlocked = React.useRef(false);

  const unlockAudio = () => {
    if (!hasAudioUnlocked.current) {
      audioEngine.initAudioContext();
      hasAudioUnlocked.current = true;
    }
  };

  // Ensure dynamic audio layering stops when component unmounts
  React.useEffect(() => {
    return () => {
      audioEngine.stopDynamicLayering();
    };
  }, []);

  // Resize Observer for smooth scaling
  React.useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvasWidthRef.current = width;
      canvasHeightRef.current = height;

      canvasRef.current.width = width;
      canvasRef.current.height = height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Spawn next tile into song stream
  const spawnNextTile = React.useCallback(() => {
    let note: Note;
    if (song.isEndless) {
      const speedMultiplier = currentSpeedRef.current / (song.baseSpeed || 400);
      note = getNextEndlessNote(noteIndexRef.current, speedMultiplier);
    } else {
      if (noteIndexRef.current >= song.notes.length) return;
      note = song.notes[noteIndexRef.current];
    }

    const isGold = (noteIndexRef.current + 1) % 10 === 0; // Every 10th note is gold bonus
    const tileHeight = note.isLong ? 180 + (note.duration || 0.5) * 120 : 140;

    const hitLineY = canvasHeightRef.current > 0 ? canvasHeightRef.current - 140 : 500;
    const normalTiles = activeTilesRef.current.filter((t) => !t.isMistake);
    const lastTile = normalTiles[normalTiles.length - 1];

    let startY = 0;
    if (!lastTile) {
      // The VERY FIRST tile rests right above the hit line waiting for START tap!
      startY = hitLineY - tileHeight;
    } else {
      // Subsequent tiles stack above the previous tile with comfortable spacing
      startY = lastTile.y - tileHeight - 80;
    }

    const newTile: ActiveTile = {
      id: `tile-${noteIndexRef.current}-${Date.now()}`,
      lane: note.lane,
      y: startY,
      height: tileHeight,
      noteIndex: noteIndexRef.current,
      note,
      status: 'pending',
      holdProgress: 0,
      isGold,
    };

    activeTilesRef.current.push(newTile);
    noteIndexRef.current += 1;
  }, [song]);

  // Initialize song stream on mount
  React.useEffect(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    isPausedRef.current = false;
    isGameOverRef.current = false;
    hasGameStartedRef.current = false;
    setGameStarted(false);

    noteIndexRef.current = 0;
    activeTilesRef.current = [];
    particlesRef.current = [];
    shockwaveRingsRef.current = [];
    floatingTextsRef.current = [];
    currentSpeedRef.current = song.baseSpeed;

    // Spawn initial queue of notes
    for (let i = 0; i < 6; i++) {
      spawnNextTile();
    }
  }, [song, spawnNextTile]);

  // High-Energy Particle Explosion & Shockwave Rings effect on successful tile press
  const createParticles = (x: number, y: number, color: string, count = 24) => {
    // 1. Shockwave Ring
    shockwaveRingsRef.current.push({
      x,
      y,
      radius: 12,
      maxRadius: 85,
      color,
      alpha: 1,
    });

    // Second inner ring for gold / combo bursts
    if (count > 20) {
      shockwaveRingsRef.current.push({
        x,
        y,
        radius: 5,
        maxRadius: 55,
        color: '#ffffff',
        alpha: 1,
      });
    }

    // 2. High velocity directional particle burst
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 3,
        color: Math.random() > 0.4 ? color : '#ffffff',
        life: 0,
        maxLife: Math.random() * 25 + 25,
        isSparkle: Math.random() > 0.5,
        rotation: Math.random() * Math.PI,
      });
    }
  };

  // Add floating rating text
  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    floatingTextsRef.current.push({
      id: `float-${Date.now()}-${Math.random()}`,
      text,
      x,
      y,
      color,
      opacity: 1,
    });
  };

  // Game Over handler with 1000ms delay to display red square & impact before modal
  const triggerGameOver = (mistakeTile?: ActiveTile) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    audioEngine.stopDynamicLayering();
    audioEngine.playErrorSound();

    if (mistakeTile) {
      activeTilesRef.current.push(mistakeTile);
    }

    // 1-Second delay so the player visually sees where they tapped wrong!
    setTimeout(() => {
      onFinishGame(scoreRef.current, maxComboRef.current, false);
    }, 1000);
  };

  // Process hit on a specific tile
  const hitTile = (targetTile: ActiveTile) => {
    unlockAudio();
    if (isPausedRef.current || isGameOverRef.current) return;

    // If game hasn't started yet, tap starts the scrolling!
    if (!hasGameStartedRef.current) {
      hasGameStartedRef.current = true;
      setGameStarted(true);
      audioEngine.startDynamicLayering(song.bpm || 128);
    }

    const laneWidth = canvasWidthRef.current / 4;
    const tapX = targetTile.lane * laneWidth + laneWidth / 2;
    const hitLineY = canvasHeightRef.current - 140;

    // Mark tile status
    targetTile.status = targetTile.note.isLong ? 'holding' : 'completed';

    // Score & Precision calculation
    const distance = Math.abs((targetTile.y + targetTile.height) - hitLineY);
    let points = 100;
    let ratingText = 'GOOD!';
    let ratingColor = '#38bdf8'; // Sky blue
    let precisionRating: AccuracyRating = 'good';

    if (distance < 75) {
      points = 300;
      ratingText = 'PERFECT!!';
      ratingColor = '#fbbf24'; // Amber gold
      precisionRating = 'perfect';
    } else if (distance < 130) {
      points = 200;
      ratingText = 'GREAT!';
      ratingColor = '#c084fc'; // Purple
      precisionRating = 'great';
    } else {
      points = 100;
      ratingText = 'GOOD';
      ratingColor = '#38bdf8';
      precisionRating = 'good';
    }

    // Play real synthesized note with precision audio feedback & selected sound style!
    audioEngine.playNote(targetTile.note.pitch, targetTile.note.duration || 0.4, precisionRating, soundStyle);

    if (targetTile.isGold) {
      points += 300;
      ratingText += ' ⭐';
      audioEngine.playSparkleSound();
    }

    comboRef.current += 1;
    if (comboRef.current > maxComboRef.current) {
      maxComboRef.current = comboRef.current;
    }

    const multiplier = Math.min(5, 1 + Math.floor(comboRef.current / 10));
    scoreRef.current += points * multiplier;

    setScore(scoreRef.current);
    setCombo(comboRef.current);

    // Update dynamic audio layering intensity based on score & combo!
    audioEngine.setLayeringIntensity(comboRef.current, scoreRef.current, song.isEndless, isFever);

    // High Energy Particle Explosion FX
    createParticles(tapX, Math.min(targetTile.y + targetTile.height, hitLineY), ratingColor, targetTile.isGold ? 32 : 22);
    addFloatingText(ratingText, tapX, hitLineY - 20, ratingColor);

    // Spawn replacement notes
    spawnNextTile();
  };

  // Handle Touch/Pointer direct coordinates click on canvas with edge-forgiveness & precision
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    unlockAudio();
    if (isPausedRef.current || isGameOverRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const laneWidth = canvasWidthRef.current / 4;
    const tappedLane = Math.floor(touchX / laneWidth);

    if (tappedLane < 0 || tappedLane > 3) return;

    // Flash lane visual
    lanePressStateRef.current[tappedLane] = true;
    setTimeout(() => {
      lanePressStateRef.current[tappedLane] = false;
    }, 150);

    // Search for pending tile in tapped lane with generous vertical hit box (-60 to +90)
    let targetTile = activeTilesRef.current.find((t) => {
      if (t.lane !== tappedLane || t.status !== 'pending' || t.isMistake) return false;
      const tileTop = t.y - 60;
      const tileBottom = t.y + t.height + 90;
      return touchY >= tileTop && touchY <= tileBottom;
    });

    // Touch Edge Forgiveness: If finger landed near the lane divider line (< 24px), check adjacent lane tile!
    if (!targetTile) {
      const laneXStart = tappedLane * laneWidth;
      const laneXEnd = laneXStart + laneWidth;
      let adjacentLane = -1;

      if (touchX - laneXStart < 24 && tappedLane > 0) adjacentLane = tappedLane - 1;
      else if (laneXEnd - touchX < 24 && tappedLane < 3) adjacentLane = tappedLane + 1;

      if (adjacentLane !== -1) {
        targetTile = activeTilesRef.current.find((t) => {
          if (t.lane !== adjacentLane || t.status !== 'pending' || t.isMistake) return false;
          const tileTop = t.y - 50;
          const tileBottom = t.y + t.height + 80;
          return touchY >= tileTop && touchY <= tileBottom;
        });
      }
    }

    if (targetTile) {
      hitTile(targetTile);
    } else {
      // 🚨 WRONG TAP: Spawn glowing Red Square at tap location, play error sound, wait 1 sec, then show Game Over!
      const mistakeTile: ActiveTile = {
        id: `mistake-${Date.now()}`,
        lane: tappedLane,
        y: Math.max(80, Math.min(touchY - 60, canvasHeightRef.current - 180)),
        height: 120,
        noteIndex: -1,
        note: { pitch: 'X', freq: 0, duration: 0.2, lane: tappedLane },
        status: 'missed',
        holdProgress: 0,
        isMistake: true,
      };

      createParticles(touchX, touchY, '#ef4444', 28);
      addFloatingText('MISS!', touchX, touchY - 20, '#ef4444');
      comboRef.current = 0;
      setCombo(0);

      triggerGameOver(mistakeTile);
    }
  };

  // Keyboard controls listener (A - S - D - F)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyUpper = e.key.toUpperCase();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPaused((prev) => {
          isPausedRef.current = !prev;
          return !prev;
        });
        return;
      }

      const laneIndex = keyBindings.findIndex((k) => k.toUpperCase() === keyUpper);
      if (laneIndex !== -1) {
        e.preventDefault();

        // Flash lane
        lanePressStateRef.current[laneIndex] = true;
        setTimeout(() => {
          lanePressStateRef.current[laneIndex] = false;
        }, 150);

        // Find closest pending tile in this lane
        const targetTile = activeTilesRef.current
          .filter((t) => t.lane === laneIndex && t.status === 'pending' && !t.isMistake)
          .sort((a, b) => (b.y + b.height) - (a.y + a.height))[0];

        if (targetTile) {
          hitTile(targetTile);
        } else {
          // Keyboard tap on empty lane -> Red mistake box & Game over!
          const laneWidth = canvasWidthRef.current / 4;
          const hitLineY = canvasHeightRef.current - 140;
          const tapX = laneIndex * laneWidth + laneWidth / 2;

          const mistakeTile: ActiveTile = {
            id: `mistake-${Date.now()}`,
            lane: laneIndex,
            y: hitLineY - 60,
            height: 120,
            noteIndex: -1,
            note: { pitch: 'X', freq: 0, duration: 0.2, lane: laneIndex },
            status: 'missed',
            holdProgress: 0,
            isMistake: true,
          };

          createParticles(tapX, hitLineY, '#ef4444', 28);
          addFloatingText('MISS!', tapX, hitLineY - 20, '#ef4444');
          triggerGameOver(mistakeTile);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyBindings]);

  // Main 60FPS Delta-Time Render Loop
  React.useEffect(() => {
    let animFrameId: number;

    const render = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvasWidthRef.current;
      const height = canvasHeightRef.current;
      const laneWidth = width / 4;
      const hitLineY = height - 140;

      // Update Game State ONLY if game has started and is not paused and not game over
      if (hasGameStartedRef.current && !isPausedRef.current && !isGameOverRef.current) {
        // Smooth Gradual Speed Acceleration
        if (song.isEndless) {
          // Continuous smooth increase: +4 speed per 100 points, capped gently at +350
          const speedBonus = Math.min(350, scoreRef.current * 0.04);
          currentSpeedRef.current = song.baseSpeed + speedBonus;
        } else {
          const speedBonus = Math.min(220, scoreRef.current * 0.02);
          currentSpeedRef.current = song.baseSpeed + speedBonus;
        }

        // Move active tiles down
        activeTilesRef.current.forEach((tile) => {
          if (!tile.isMistake) {
            tile.y += currentSpeedRef.current * dt;

            // Holding state for long notes
            if (tile.status === 'holding') {
              tile.holdProgress += dt / (tile.note.duration || 0.5);
              if (tile.holdProgress >= 1) {
                tile.status = 'completed';
              }
            }

            // Game Over condition ONLY when a tile physically passes off the bottom of the canvas untouched
            if (tile.status === 'pending' && tile.y > height) {
              tile.status = 'missed';
              triggerGameOver();
            }
          }
        });

        // Clean completed tiles
        activeTilesRef.current = activeTilesRef.current.filter(
          (t) => (t.y < height + 200 && t.status !== 'completed') || t.isMistake
        );

        // Check Song Completion (Only for standard finite songs)
        if (!song.isEndless && noteIndexRef.current >= song.notes.length && activeTilesRef.current.length === 0) {
          onFinishGame(scoreRef.current, maxComboRef.current, true);
          return;
        }

        // Keep queue filled (Endless stream or standard song stream)
        if (activeTilesRef.current.filter((t) => !t.isMistake).length < 6) {
          spawnNextTile();
        }

        // Progress tracker
        if (song.isEndless) {
          setGameProgress(100);
        } else {
          const progress = Math.min(
            100,
            Math.round((noteIndexRef.current / song.notes.length) * 100)
          );
          setGameProgress(progress);
        }
      }

      // --- DRAW CANVAS ---
      ctx.clearRect(0, 0, width, height);

      // Background Gradient
      const isFever = comboRef.current >= 15;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (song.isEndless) {
        bgGrad.addColorStop(0, '#31103f');
        bgGrad.addColorStop(1, '#090514');
      } else if (isFever) {
        bgGrad.addColorStop(0, '#1e1b4b');
        bgGrad.addColorStop(1, '#0f172a');
      } else {
        bgGrad.addColorStop(0, '#0b0f19');
        bgGrad.addColorStop(1, '#111827');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Lane Dividers
      ctx.strokeStyle = song.isEndless
        ? 'rgba(244, 63, 94, 0.25)'
        : isFever
        ? 'rgba(168, 85, 247, 0.25)'
        : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, height);
        ctx.stroke();
      }

      // Flash Lane on Press
      lanePressStateRef.current.forEach((isPressed, laneIdx) => {
        if (isPressed) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
          ctx.fillRect(laneIdx * laneWidth, 0, laneWidth, height);
        }
      });

      // Target Hit Line Zone
      ctx.fillStyle = song.isEndless
        ? 'rgba(244, 63, 94, 0.15)'
        : isFever
        ? 'rgba(236, 72, 153, 0.15)'
        : 'rgba(59, 130, 246, 0.12)';
      ctx.fillRect(0, hitLineY - 20, width, 40);

      ctx.strokeStyle = song.isEndless ? '#f43f5e' : isFever ? '#ec4899' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = song.isEndless ? '#f43f5e' : isFever ? '#ec4899' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, hitLineY);
      ctx.lineTo(width, hitLineY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Tiles
      activeTilesRef.current.forEach((tile, index) => {
        const x = tile.lane * laneWidth;
        const radius = 12;

        // 🚨 DRAW RED MISTAKE SQUARE
        if (tile.isMistake) {
          const redGrad = ctx.createLinearGradient(x, tile.y, x, tile.y + tile.height);
          redGrad.addColorStop(0, '#ef4444');
          redGrad.addColorStop(1, '#991b1b');

          ctx.fillStyle = redGrad;
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 3;

          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 22;
          ctx.beginPath();
          ctx.roundRect(x + 6, tile.y, laneWidth - 12, tile.height, radius);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Drawing Big White 'X' inside red mistake tile
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          const cx = x + laneWidth / 2;
          const cy = tile.y + tile.height / 2;
          ctx.beginPath();
          ctx.moveTo(cx - 20, cy - 20);
          ctx.lineTo(cx + 20, cy + 20);
          ctx.moveTo(cx + 20, cy - 20);
          ctx.lineTo(cx - 20, cy + 20);
          ctx.stroke();

        } else if (tile.status === 'pending' || tile.status === 'holding') {
          const tileGrad = ctx.createLinearGradient(x, tile.y, x, tile.y + tile.height);
          let strokeColor = '#38bdf8';

          if (tileSkin === 'neon') {
            if (tile.isGold) {
              tileGrad.addColorStop(0, '#ec4899');
              tileGrad.addColorStop(1, '#a855f7');
              strokeColor = '#f43f5e';
            } else {
              tileGrad.addColorStop(0, '#0284c7');
              tileGrad.addColorStop(1, '#0f172a');
              strokeColor = '#00f3ff';
            }
            ctx.shadowColor = tile.isGold ? '#ec4899' : '#00f3ff';
            ctx.shadowBlur = 12;
          } else if (tileSkin === 'wooden') {
            if (tile.isGold) {
              tileGrad.addColorStop(0, '#f59e0b');
              tileGrad.addColorStop(1, '#b45309');
              strokeColor = '#fef08a';
            } else {
              tileGrad.addColorStop(0, '#78350f');
              tileGrad.addColorStop(1, '#451a03');
              strokeColor = '#d97706';
            }
          } else {
            // Classic Onyx
            if (tile.isGold) {
              tileGrad.addColorStop(0, '#f59e0b');
              tileGrad.addColorStop(1, '#d97706');
              strokeColor = '#fbbf24';
            } else {
              tileGrad.addColorStop(0, '#1e293b');
              tileGrad.addColorStop(1, '#0f172a');
              strokeColor = song.isEndless ? '#f43f5e' : isFever ? '#a855f7' : '#38bdf8';
            }
          }

          ctx.fillStyle = tileGrad;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.roundRect(x + 6, tile.y, laneWidth - 12, tile.height, radius);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset shadow blur

          // If game hasn't started yet and this is the FIRST tile, draw glowing START label!
          if (!hasGameStartedRef.current && index === 0) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = isAr ? 'انقر للبدء 🎵' : isFr ? 'TOUCHER POUR COMMENCER 🎵' : 'TAP TO START';
            ctx.fillText(text, x + laneWidth / 2, tile.y + tile.height / 2);
          } else if (tile.note.isLong) {
            ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
            const filledHeight = tile.height * tile.holdProgress;
            ctx.fillRect(x + 12, tile.y + tile.height - filledHeight, laneWidth - 24, filledHeight);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('HOLD 🎵', x + laneWidth / 2, tile.y + 24);
          } else {
            ctx.fillStyle = tile.isGold ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.roundRect(x + 12, tile.y + 8, laneWidth - 24, 8, 4);
            ctx.fill();
          }
        }
      });

      // Shockwave Rings FX
      shockwaveRingsRef.current.forEach((ring) => {
        ring.radius += 3.5;
        ring.alpha -= 0.035;

        if (ring.alpha > 0) {
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 3;
          ctx.globalAlpha = Math.max(0, ring.alpha);
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
      shockwaveRingsRef.current = shockwaveRingsRef.current.filter((r) => r.alpha > 0);

      // Particles FX
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity pull for realistic explosive drop
        p.life += 1;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        if (p.isSparkle) {
          ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      // Floating Rating Text
      floatingTextsRef.current.forEach((ft) => {
        ft.y -= 1.2;
        ft.opacity -= 0.02;

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.opacity);
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.opacity > 0);

      // Key Hints Prompts (A - S - D - F)
      keyBindings.forEach((key, idx) => {
        const kx = idx * laneWidth + laneWidth / 2;
        const ky = height - 40;

        ctx.fillStyle = lanePressStateRef.current[idx] ? '#f59e0b' : '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(kx, ky, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = lanePressStateRef.current[idx] ? '#020617' : '#94a3b8';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(key, kx, ky);
      });

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [song, keyBindings, onFinishGame, spawnNextTile, isAr, isFr]);

  return (
    <div className="relative w-full h-[88vh] max-w-lg mx-auto bg-slate-950 flex flex-col justify-between overflow-hidden select-none touch-none rounded-3xl border border-slate-800 shadow-2xl">
      {/* HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-auto">
        <button
          onClick={() => {
            audioEngine.stopDynamicLayering();
            onBackToMenu();
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isAr ? 'العودة للقائمة' : isFr ? 'Retour au Menu' : 'Back to Menu'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Live Score */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {song.isEndless && <Zap className="w-4 h-4 text-rose-500 animate-bounce" />}
            <span className="text-2xl font-black font-mono text-amber-400 tracking-wider">
              {score}
            </span>
          </div>
          {combo > 2 && (
            <span className="text-xs font-black text-rose-400 flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{combo}x COMBO</span>
            </span>
          )}
        </div>

        {/* Pause Button */}
        <button
          onClick={() => {
            setIsPaused((prev) => {
              const nextState = !prev;
              isPausedRef.current = nextState;
              if (nextState) {
                audioEngine.stopDynamicLayering();
              } else if (hasGameStartedRef.current) {
                audioEngine.startDynamicLayering(song.bpm || 128);
                audioEngine.setLayeringIntensity(comboRef.current, scoreRef.current, song.isEndless, isFever);
              }
              return nextState;
            });
          }}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isAr ? 'إيقاف مؤقت' : isFr ? 'Pause' : 'Pause'}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-16 inset-x-4 z-20 h-1 bg-slate-800 rounded-full overflow-hidden">
        {song.isEndless ? (
          <div className="h-full w-full bg-gradient-to-r from-rose-500 via-amber-400 to-purple-500 animate-pulse" />
        ) : (
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          />
        )}
      </div>

      {/* Main Interactive Canvas with direct Pointer/Touch detection on tiles */}
      <div ref={containerRef} className="relative w-full h-full flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full block cursor-pointer"
        />

        {/* "Tap First Tile To Start" Banner Overlay when waiting */}
        {!gameStarted && (
          <div className="absolute bottom-28 inset-x-0 z-20 text-center pointer-events-none animate-bounce">
            <span className="inline-block px-4 py-2 bg-amber-500 text-slate-950 text-xs font-black rounded-full shadow-lg border border-amber-300">
              {isAr ? '👇 انقر على المربع الأسود لبدء العزف!' : isFr ? '👇 TOUCHER LA TUILE NOIRE POUR COMMENCER !' : '👇 TAP THE BLACK TILE TO START!'}
            </span>
          </div>
        )}

        {/* Endless Mode Active Floating Tag */}
        {song.isEndless && gameStarted && (
          <div className="absolute top-20 right-4 z-20 pointer-events-none">
            <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-extrabold rounded-full backdrop-blur-sm">
              {isAr ? '⚡ النمط المفتوح (السرعة تزداد تدريجياً)' : isFr ? '⚡ MODE INFINI (VITESSE PROGRESSIVE)' : '⚡ ENDLESS (GRADUAL SPEED UP)'}
            </span>
          </div>
        )}
      </div>

      {/* Pause Modal */}
      {isPaused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
          <div className="w-full max-w-xs text-center space-y-4">
            <h3 className="text-2xl font-black text-white">
              {isAr ? 'اللعبة متوقفة مؤقتاً' : isFr ? 'Jeu en Pause' : 'Game Paused'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? song.title.ar : isFr ? song.title.fr : song.title.en}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsPaused(false);
                  isPausedRef.current = false;
                  if (hasGameStartedRef.current) {
                    audioEngine.startDynamicLayering(song.bpm || 128);
                    audioEngine.setLayeringIntensity(comboRef.current, scoreRef.current, song.isEndless, isFever);
                  }
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isAr ? 'استئناف اللعب' : isFr ? 'Reprendre' : 'Resume Play'}</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.stopDynamicLayering();
                  onBackToMenu();
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                {isAr ? 'الخروج للقائمة' : isFr ? 'Menu Principal' : 'Quit to Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
