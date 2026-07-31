import React from 'react';
import { Play, Music2, Flame, Sparkles, Volume2, Trophy } from 'lucide-react';
import { Language, UserStats } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface HomeHeroProps {
  lang: Language;
  stats: UserStats;
  onStartEndless: () => void;
  onOpenSongList: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  lang,
  stats,
  onStartEndless,
  onOpenSongList,
}) => {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  // Animated background piano keys
  const [activeKeyIndex, setActiveKeyIndex] = React.useState<number | null>(null);

  // Piano keys definition for the background visual piano
  const PIANO_KEYS = [
    { pitch: 'C4', isBlack: false },
    { pitch: 'C#4', isBlack: true },
    { pitch: 'D4', isBlack: false },
    { pitch: 'D#4', isBlack: true },
    { pitch: 'E4', isBlack: false },
    { pitch: 'F4', isBlack: false },
    { pitch: 'F#4', isBlack: true },
    { pitch: 'G4', isBlack: false },
    { pitch: 'G#4', isBlack: true },
    { pitch: 'A4', isBlack: false },
    { pitch: 'A#4', isBlack: true },
    { pitch: 'B4', isBlack: false },
    { pitch: 'C5', isBlack: false },
    { pitch: 'C#5', isBlack: true },
    { pitch: 'D5', isBlack: false },
    { pitch: 'D#5', isBlack: true },
    { pitch: 'E5', isBlack: false },
  ];

  // Auto-play ambient light animation on piano keys
  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * PIANO_KEYS.length);
      setActiveKeyIndex(randomIndex);
      setTimeout(() => setActiveKeyIndex(null), 400);
    }, 1800);
    return () => clearInterval(interval);
  }, [PIANO_KEYS.length]);

  const handleKeyTap = (index: number, pitch: string) => {
    setActiveKeyIndex(index);
    audioEngine.playNote(pitch, 0.4, 'perfect', 'piano');
    setTimeout(() => setActiveKeyIndex(null), 350);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-between min-h-[75vh] overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 shadow-2xl">
      {/* Subtle Glow Backgrounds */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Musical Notes Animation Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 pt-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400 shadow-sm">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>
            {isAr
              ? '🎹 واجهة البيانو الموسيقية اللانهائية'
              : isFr
              ? '🎹 Expérience de Piano Classique & Infini'
              : '🎹 Classical & Endless Piano Experience'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
          {isAr ? (
            <span>
              ماجيك تايلز <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">بيانو</span>
            </span>
          ) : isFr ? (
            <span>
              Magic Tiles <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">Piano</span>
            </span>
          ) : (
            <span>
              Magic Tiles <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">Piano</span>
            </span>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
          {isAr
            ? 'اعزف أجمل الألحان الكلاسيكية على بلاطات البيانو، وتحدى مهارتك وسرعتك في النمط اللانهائي المتغير بالألوان!'
            : isFr
            ? 'Jouez de belles mélodies classiques, défiez votre vitesse dans le mode infini aux couleurs dynamiques !'
            : 'Play classical melodies on piano tiles and challenge your reflex & rhythm in the color-evolving endless mode!'}
        </p>

        {/* Player Mini Stats */}
        <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>
              {isAr ? 'أعلى كومبو:' : isFr ? 'Meilleur Combo:' : 'Max Combo:'}{' '}
              <span className="text-white font-bold">{stats.maxCombo}x</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <Music2 className="w-4 h-4 text-indigo-400" />
            <span>
              {isAr ? 'النغمات المنجزة:' : isFr ? 'Notes Jouées:' : 'Notes Hit:'}{' '}
              <span className="text-white font-bold">{stats.totalNotesHit}</span>
            </span>
          </div>
        </div>

        {/* MAIN ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-4">
          {/* PRIMARY BUTTON: START ENDLESS MODE */}
          <button
            onClick={onStartEndless}
            className="w-full sm:w-auto flex-1 px-8 py-5 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-2xl shadow-rose-500/25 border border-rose-400/40 transition-all transform hover:scale-105 flex items-center justify-center gap-3 group"
          >
            <Flame className="w-6 h-6 text-amber-300 animate-pulse fill-current group-hover:scale-110 transition-transform" />
            <span>
              {isAr ? 'البدء (النمط اللانهائي)' : isFr ? 'COMMENCER (MODE INFINI)' : 'START ENDLESS MODE'}
            </span>
          </button>

          {/* SECONDARY BUTTON: SONG LIST */}
          <button
            onClick={onOpenSongList}
            className="w-full sm:w-auto px-7 py-5 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 text-slate-100 font-extrabold text-sm sm:text-base rounded-2xl border border-slate-700 hover:border-indigo-500/50 shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2.5 group"
          >
            <Music2 className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
            <span>
              {isAr ? 'قائمة الأغاني والموسيقى' : isFr ? 'LISTE DES MUSIQUES' : 'SONGS & MUSIC LIST'}
            </span>
          </button>
        </div>
      </div>

      {/* PIANO KEYBOARD BACKGROUND DECORATION & INTERACTIVITY */}
      <div className="relative z-10 w-full mt-10 pt-6 flex flex-col items-center">
        <div className="flex items-center justify-center gap-1.5 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            {isAr
              ? 'انقر على المفاتيح أدناه لتجربة عزف البيانو المباشر'
              : isFr
              ? 'Toucher les touches ci-dessous pour essayer le piano en direct'
              : 'Tap the keyboard below to test live piano sounds'}
          </span>
        </div>

        {/* Realistic Styled Interactive Mini Piano Keyboard */}
        <div className="relative flex items-start justify-center p-3 bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-2xl overflow-x-auto max-w-full">
          {PIANO_KEYS.map((key, idx) => {
            const isActive = activeKeyIndex === idx;

            if (key.isBlack) {
              return (
                <button
                  key={key.pitch}
                  onClick={() => handleKeyTap(idx, key.pitch)}
                  className={`relative -mx-3 z-20 w-8 sm:w-10 h-24 sm:h-28 rounded-b-lg border-x border-b border-slate-800 transition-all select-none ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500 to-rose-600 shadow-lg shadow-rose-500/50 scale-95'
                      : 'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-900'
                  }`}
                  title={key.pitch}
                />
              );
            }

            return (
              <button
                key={key.pitch}
                onClick={() => handleKeyTap(idx, key.pitch)}
                className={`relative z-10 w-11 sm:w-14 h-36 sm:h-44 rounded-b-xl border border-slate-300/30 transition-all select-none flex flex-col justify-end pb-2 items-center text-[10px] font-bold ${
                  isActive
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 scale-95'
                    : 'bg-gradient-to-b from-slate-100 to-slate-300 text-slate-700 hover:bg-white'
                }`}
                title={key.pitch}
              >
                <span className="opacity-75">{key.pitch}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
