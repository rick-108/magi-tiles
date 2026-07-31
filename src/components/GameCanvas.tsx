import React from 'react';
import { Song, ActiveTile } from '../types';
import { SONGS } from '../data/songs';
import { ObjectPool } from '../utils/objectPool';

// Lazy-load audio engine (kept compatible with previous lazy import approach)
let audioEngine: typeof import('../utils/audioSynth').audioEngine | null = null;
const getAudioEngine = async () => {
  if (audioEngine) return audioEngine;
  const mod = await import('../utils/audioSynth');
  audioEngine = mod.audioEngine;
  return audioEngine;
};

interface Props {
  song: Song;
  lang: string;
  keyBindings: string[];
  tileSkin: string;
  soundStyle: string;
  onFinishGame: (score: number, maxCombo: number, completed: boolean) => void;
  onBackToMenu: () => void;
}

// Simple particle / effect types used by the canvas
type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number; maxLife: number };
type Shock = { x: number; y: number; radius: number; maxRadius: number; alpha: number; color: string };
type FloatingText = { id: string; text: string; x: number; y: number; opacity: number };

const SHOW_FPS = false; // set true for diagnostics in development

export const GameCanvas: React.FC<Props> = ({ song, lang, keyBindings, tileSkin, soundStyle, onFinishGame, onBackToMenu }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number>(performance.now());

  // Pools
  const particlePoolRef = React.useRef<ObjectPool<Particle> | null>(null);
  const shockPoolRef = React.useRef<ObjectPool<Shock> | null>(null);
  const textPoolRef = React.useRef<ObjectPool<FloatingText> | null>(null);

  // Active lists
  const particlesRef = React.useRef<Particle[]>([]);
  const shocksRef = React.useRef<Shock[]>([]);
  const textsRef = React.useRef<FloatingText[]>([]);

  // Cached graphics resources (gradients / path2D)
  const graphicsCacheRef = React.useRef<Map<string, { gradient: CanvasGradient | null; path?: Path2D }>>(new Map());

  // Game state kept in refs to avoid rerenders every frame
  const scoreRef = React.useRef<number>(0);
  const comboRef = React.useRef<number>(0);
  const maxComboRef = React.useRef<number>(0);
  const finishedRef = React.useRef<boolean>(false);

  // Throttled React state updates
  const [, setLastScore] = React.useState(0);
  const [, setLastMaxCombo] = React.useState(0);

  // FPS meter
  const fpsRef = React.useRef({ frames: 0, last: performance.now(), value: 60 });

  // Initialize pools once
  React.useEffect(() => {
    particlePoolRef.current = new ObjectPool<Particle>(
      () => ({ x: 0, y: 0, vx: 0, vy: 0, size: 2, color: '#fff', life: 0, maxLife: 0 }),
      (p) => {
        p.life = 0;
      },
      100
    );

    shockPoolRef.current = new ObjectPool<Shock>(
      () => ({ x: 0, y: 0, radius: 0, maxRadius: 0, alpha: 0.0, color: '#fff' }),
      (s) => {
        s.alpha = 0;
      },
      20
    );

    textPoolRef.current = new ObjectPool<FloatingText>(
      () => ({ id: '', text: '', x: 0, y: 0, opacity: 0 }),
      (t) => {
        t.opacity = 0;
      },
      20
    );

    return () => {
      // cleanup pools if needed
      particlePoolRef.current = null;
      shockPoolRef.current = null;
      textPoolRef.current = null;
    };
  }, []);

  // utility to get or create cached gradient
  const getCachedGradient = (ctx: CanvasRenderingContext2D, key: string) => {
    const cache = graphicsCacheRef.current;
    if (cache.has(key)) return cache.get(key)!.gradient;
    // create gradient based on tileSkin or song
    let gradient: CanvasGradient | null = null;
    try {
      gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      if (tileSkin === 'neon') {
        gradient.addColorStop(0, '#7c3aed');
        gradient.addColorStop(1, '#06b6d4');
      } else if (tileSkin === 'wooden') {
        gradient.addColorStop(0, '#b97a57');
        gradient.addColorStop(1, '#8b5e3c');
      } else {
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#b45309');
      }
    } catch (e) {
      gradient = null;
    }
    cache.set(key, { gradient });
    return gradient;
  };

  // Add particle helper
  const spawnParticles = (x: number, y: number, count = 8) => {
    const pool = particlePoolRef.current;
    if (!pool) return;
    for (let i = 0; i < count; i++) {
      const p = pool.acquire();
      p.x = x + (Math.random() - 0.5) * 20;
      p.y = y + (Math.random() - 0.5) * 10;
      p.vx = (Math.random() - 0.5) * 120;
      p.vy = -Math.random() * 120;
      p.size = 1 + Math.random() * 3;
      p.color = `hsl(${Math.floor(Math.random() * 40 + 40)},90%,60%)`;
      p.life = 0;
      p.maxLife = 0.6 + Math.random() * 0.6;
      particlesRef.current.push(p);
    }
  };

  const spawnShock = (x: number, y: number) => {
    const pool = shockPoolRef.current;
    if (!pool) return;
    const s = pool.acquire();
    s.x = x;
    s.y = y;
    s.radius = 8;
    s.maxRadius = 120 + Math.random() * 40;
    s.alpha = 0.8;
    s.color = '#fff';
    shocksRef.current.push(s);
  };

  const spawnFloatingText = (text: string, x: number, y: number) => {
    const pool = textPoolRef.current;
    if (!pool) return;
    const t = pool.acquire();
    t.id = String(Math.random()).slice(2);
    t.text = text;
    t.x = x;
    t.y = y;
    t.opacity = 1;
    textsRef.current.push(t);
  };

  // Throttled flush for React state (every 100ms)
  React.useEffect(() => {
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      setLastScore(scoreRef.current);
      setLastMaxCombo(maxComboRef.current);
    }, 100);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Main render loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth * devicePixelRatio;
    let height = canvas.height = canvas.clientHeight * devicePixelRatio;

    const resizeHandler = () => {
      width = canvas.width = canvas.clientWidth * devicePixelRatio;
      height = canvas.height = canvas.clientHeight * devicePixelRatio;
      graphicsCacheRef.current.clear();
    };

    window.addEventListener('resize', resizeHandler);

    const loop = (time: number) => {
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      // clear
      ctx.clearRect(0, 0, width, height);

      // draw background / gradient cached per skin and song
      const gradKey = `${tileSkin}-${song.id}`;
      const grad = getCachedGradient(ctx, gradKey);
      if (grad) {
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      }

      // Update & draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          const removed = particles.splice(i, 1)[0];
          particlePoolRef.current?.release(removed);
          continue;
        }
        p.vy += 220 * dt; // gravity
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        ctx.globalAlpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & draw shocks
      const shocks = shocksRef.current;
      for (let i = shocks.length - 1; i >= 0; i--) {
        const s = shocks[i];
        s.radius += 180 * dt;
        s.alpha -= 1.2 * dt;
        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          const removed = shocks.splice(i, 1)[0];
          shockPoolRef.current?.release(removed);
          continue;
        }
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * devicePixelRatio, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update & draw floating texts
      const texts = textsRef.current;
      for (let i = texts.length - 1; i >= 0; i--) {
        const t = texts[i];
        t.y -= 30 * dt;
        t.opacity -= 0.8 * dt;
        if (t.opacity <= 0) {
          const removed = texts.splice(i, 1)[0];
          textPoolRef.current?.release(removed);
          continue;
        }
        ctx.globalAlpha = t.opacity;
        ctx.fillStyle = '#fff';
        ctx.font = `${14 * devicePixelRatio}px Roboto, system-ui, -apple-system`;
        ctx.fillText(t.text, t.x, t.y);
        ctx.globalAlpha = 1;
      }

      // FPS diagnostics
      if (SHOW_FPS) {
        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.last >= 500) {
          fpsRef.current.value = Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.last));
          fpsRef.current.frames = 0;
          fpsRef.current.last = now;
        }
        ctx.fillStyle = '#fff';
        ctx.font = `${12 * devicePixelRatio}px monospace`;
        ctx.fillText(`FPS: ${fpsRef.current.value}`, 10 * devicePixelRatio, 20 * devicePixelRatio);
      }

      // schedule next frame
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [song, tileSkin]);

  // Example: expose a simple API for other components to spawn effects
  React.useEffect(() => {
    // For demo/testing: spawn an effect when song changes
    spawnFloatingText(song.title.en || song.id, 120, 120);
  }, [song.id]);

  // Expose handlers for clicks / key events
  const handleCanvasClick = async (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) * devicePixelRatio;
    const y = (e.clientY - rect.top) * devicePixelRatio;
    spawnParticles(x, y, 12);
    spawnShock(x, y);
    spawnFloatingText('+10', x, y - 20);
    try {
      const ae = await getAudioEngine();
      ae.playNote('C5', 0.25, 'perfect', soundStyle as any);
    } catch {
      // ignore audio errors
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default GameCanvas;
