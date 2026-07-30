import React from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Menu, Star, Trophy, Flame, Play } from 'lucide-react';
import { Song, Language } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  maxCombo: number;
  isNewHighScore: boolean;
  song: Song;
  isCompleted: boolean;
  lang: Language;
  onRestart: () => void;
  onMenu: () => void;
  onNextSong?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  maxCombo,
  isNewHighScore,
  song,
  isCompleted,
  lang,
  onRestart,
  onMenu,
  onNextSong,
}) => {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  // Calculate earned stars based on score / completion
  const starsEarned = React.useMemo(() => {
    if (!isCompleted && score < 1000) return 0;
    if (score >= 4000) return 3;
    if (score >= 2000) return 2;
    return 1;
  }, [score, isCompleted]);

  React.useEffect(() => {
    if (isOpen && (isCompleted || isNewHighScore)) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, isCompleted, isNewHighScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl text-center">
        {/* Top Status Header */}
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {isCompleted
              ? isAr
                ? 'اكتملت المقطوعة بنجاح!'
                : isFr
                ? 'Morceau Terminé avec Succès !'
                : 'Stage Complete!'
              : isAr
              ? 'انتهت اللعبة!'
              : isFr
              ? 'Partie Terminée !'
              : 'Game Over!'}
          </span>
        </div>

        {/* Song Title */}
        <h2 className="text-xl font-black text-white">
          {isAr ? song.title.ar : isFr ? song.title.fr : song.title.en}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isAr ? song.composer.ar : isFr ? song.composer.fr : song.composer.en}
        </p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 my-5">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl border transition-all transform ${
                starIdx <= starsEarned
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 border-slate-700 text-slate-600'
              }`}
            >
              <Star className={`w-8 h-8 ${starIdx <= starsEarned ? 'fill-current' : ''}`} />
            </div>
          ))}
        </div>

        {/* New High Score Tag */}
        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 rounded-full font-black text-xs shadow-lg mb-4 animate-bounce">
            <Trophy className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'رقم قياسي جديد!' : isFr ? 'NOUVEAU MEILLEUR SCORE !' : 'NEW HIGH SCORE!'}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              {isAr ? 'النقاط النهائي' : isFr ? 'Score Final' : 'Final Score'}
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono">{score}</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              {isAr ? 'أعلى كومبو' : isFr ? 'Combo Max' : 'Max Combo'}
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{maxCombo}x</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة المحاولة' : isFr ? 'Rejouer' : 'Play Again'}</span>
          </button>

          {onNextSong && (
            <button
              onClick={onNextSong}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isAr ? 'المقطوعة التالية' : isFr ? 'Musique Suivante' : 'Next Symphony'}</span>
            </button>
          )}

          <button
            onClick={onMenu}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <Menu className="w-4 h-4" />
            <span>{isAr ? 'قائمة المقطوعات' : isFr ? 'Choix des Musiques' : 'Song Selection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
