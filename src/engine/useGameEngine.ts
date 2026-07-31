import React from 'react';
import { Song, ActiveTile, Note, Particle, ShockwaveRing } from '../types';
import { getNextEndlessNote } from '../data/songs';
import { audioEngine } from '../utils/audioSynth';

export interface UseGameEngineOptions {
  onFinish?: (finalScore: number, maxCombo: number, completed: boolean) => void;
  initialKeyBindings?: string[];
}

export function useGameEngine(song: Song, options: UseGameEngineOptions = {}) {
  const { onFinish } = options;

  // State kept in refs for high-frequency updates
  const scoreRef = React.useRef<number>(0);
  const comboRef = React.useRef<number>(0);
  const maxComboRef = React.useRef<number>(0);
  const isGameOverRef = React.useRef<boolean>(false);
  const hasGameStartedRef = React.useRef<boolean>(false);

  const noteIndexRef = React.useRef<number>(0);
  const activeTilesRef = React.useRef<ActiveTile[]>([]);
  const particlesRef = React.useRef<Particle[]>([]);
  const shockwaveRingsRef = React.useRef<ShockwaveRing[]>([]);

  const currentSpeedRef = React.useRef<number>(song.baseSpeed || 400);

  // Helpers
  const reset = React.useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    isGameOverRef.current = false;
    hasGameStartedRef.current = false;

    noteIndexRef.current = 0;
    activeTilesRef.current = [];
    particlesRef.current = [];
    shockwaveRingsRef.current = [];
    currentSpeedRef.current = song.baseSpeed || 400;

    // spawn initial
    for (let i = 0; i < 6; i++) spawnNextTile();
  }, [song]);

  const spawnNextTile = React.useCallback(() => {
    let note: Note;
    if (song.isEndless) {
      const speedMultiplier = currentSpeedRef.current / (song.baseSpeed || 400);
      note = getNextEndlessNote(noteIndexRef.current, speedMultiplier);
    } else {
      if (noteIndexRef.current >= song.notes.length) return;
      note = song.notes[noteIndexRef.current];
    }

    const isGold = (noteIndexRef.current + 1) % 10 === 0;
    const tileHeight = note.isLong ? 180 + (note.duration || 0.5) * 120 : 140;
    const hitLineY = 700 - 140; // consumer should override canvas size; default safe value

    const normalTiles = activeTilesRef.current.filter((t) => !t.isMistake);
    const lastTile = normalTiles[normalTiles.length - 1];

    let startY = 0;
    if (!lastTile) startY = hitLineY - tileHeight;
    else startY = lastTile.y - tileHeight - 80;

    const newTile: ActiveTile = {
      id: `tile-${noteIndexRef.current}-${Date.now()}`,
      lane: note.lane,
      y: startY,
      height: tileHeight,
      noteIndex: noteIndexRef.current,
      note,
      status: 'pending',
      holdProgress: 0,
    };

    if (isGold) newTile.isGold = true;

    activeTilesRef.current.push(newTile);
    noteIndexRef.current += 1;
  }, [song]);

  const triggerGameOver = React.useCallback((mistakeTile?: ActiveTile) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    try {
      audioEngine.stopDynamicLayering();
      audioEngine.playErrorSound();
    } catch (e) {
      // ignore audio errors
    }
    if (mistakeTile) activeTilesRef.current.push(mistakeTile);

    setTimeout(() => {
      onFinish && onFinish(scoreRef.current, maxComboRef.current, false);
    }, 800);
  }, [onFinish]);

  const hitTile = React.useCallback((tile: ActiveTile) => {
    if (isGameOverRef.current) return;
    if (!hasGameStartedRef.current) {
      hasGameStartedRef.current = true;
      try {
        audioEngine.startDynamicLayering(song.bpm || 120);
      } catch {}
    }

    tile.status = tile.note.isLong ? 'holding' : 'completed';

    const hitLineY = 700 - 140; // placeholder
    const distance = Math.abs((tile.y + tile.height) - hitLineY);

    let points = 100;
    if (distance < 75) points = 300;
    else if (distance < 130) points = 200;

    comboRef.current += 1;
    if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
    const multiplier = Math.min(5, 1 + Math.floor(comboRef.current / 10));
    scoreRef.current += points * multiplier;

    try {
      audioEngine.playNote(tile.note.pitch, tile.note.duration || 0.4, 'good', 'piano');
    } catch {}

    // spawn particles & next tile
    spawnNextTile();
  }, [song, spawnNextTile]);

  // Tick: called by render loop with dt and canvas height to update positions
  const tick = React.useCallback((dt: number, canvasHeight: number) => {
    if (isGameOverRef.current) return;

    if (song.isEndless) {
      const speedBonus = Math.min(350, scoreRef.current * 0.04);
      currentSpeedRef.current = song.baseSpeed + speedBonus;
    } else {
      const speedBonus = Math.min(220, scoreRef.current * 0.02);
      currentSpeedRef.current = song.baseSpeed + speedBonus;
    }

    // move tiles
    activeTilesRef.current.forEach((tile) => {
      if (!tile.isMistake) {
        tile.y += currentSpeedRef.current * dt;
        if (tile.status === 'holding') {
          tile.holdProgress += dt / (tile.note.duration || 0.5);
          if (tile.holdProgress >= 1) tile.status = 'completed';
        }
        if (tile.status === 'pending' && tile.y > canvasHeight) {
          tile.status = 'missed';
          triggerGameOver();
        }
      }
    });

    // cleanup completed
    activeTilesRef.current = activeTilesRef.current.filter((t) => (t.y < canvasHeight + 200 && t.status !== 'completed') || t.isMistake);

    // keep queue
    if (activeTilesRef.current.filter((t) => !t.isMistake).length < 6) spawnNextTile();

    // check finite song completion
    if (!song.isEndless && noteIndexRef.current >= song.notes.length && activeTilesRef.current.length === 0) {
      onFinish && onFinish(scoreRef.current, maxComboRef.current, true);
    }
  }, [song, spawnNextTile, triggerGameOver, onFinish]);

  // public API
  return {
    reset,
    spawnNextTile,
    hitTile,
    triggerGameOver,
    tick,
    refs: {
      scoreRef,
      comboRef,
      maxComboRef,
      activeTilesRef,
      particlesRef,
      shockwaveRingsRef,
      isGameOverRef,
      hasGameStartedRef,
    }
  } as const;
}
