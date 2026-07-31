import React from 'react';
import { Play, Star, Flame, Search, Trophy, ArrowRight, ArrowLeft, Music } from 'lucide-react';
import { Song, Language, UserStats } from '../types';
import { SONGS } from '../data/songs';

interface SongSelectorProps {
  lang: Language;
  stats: UserStats;
  onSelectSong: (song: Song) => void;
  onQuickStart: () => void;
  onBackToHome?: () => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  lang,
  stats,
  onSelectSong,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  const filteredSongs = React.useMemo(() => {
    return SONGS.filter((song) => {
      const q = searchQuery.toLowerCase();
      const titleMatch =
        song.title.en.toLowerCase().includes(q) ||
        song.title.ar.includes(searchQuery) ||
        song.title.fr.toLowerCase().includes(q);
      const composerMatch =
        song.composer.en.toLowerCase().includes(q) ||
        song.composer.ar.includes(searchQuery) ||
        song.composer.fr.toLowerCase().includes(q);
      return titleMatch || composerMatch;
    });
  }, [searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar with Back Button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition-all shadow-md flex items-center justify-center"
              title={isAr ? 'العودة للرئيسية' : isFr ? 'Retour à l\'accueil' : 'Back to Home'}
            >
              {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}

          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Music className="w-6 h-6 text-amber-400" />
              <span>
                {isAr
                  ? 'قائمة الأغاني والموسيقى الكلاسيكية'
                  : isFr
                  ? 'Liste des Musiques Classiques'
                  : 'Classical Songs & Music List'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'اختر مقطوعتك المفضلة لعزفها وتحقيق أعلى الأرقام القياسية (جميع المستويات متساوية وممتعة)'
                : isFr
                ? 'Choisissez votre morceau favori et battez votre score'
                : 'Select your favorite classical masterpiece to play'}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'بحث عن مقطوعة أو مؤلف...'
                : isFr
                ? 'Rechercher une musique...'
                : 'Search song or composer...'
            }
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Song Cards Grid (All Songs Same Equal Level / No Difficulty Filter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => {
          const songHighScore = stats.highScores[song.id] || 0;
          const starsEarned = stats.stars[song.id] || 0;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="group relative bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[160px]"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {song.isEndless
                      ? isAr
                        ? '⚡ النمط اللانهائي'
                        : '⚡ Endless Mode'
                      : song.tags[0] || (isAr ? 'بيانو كلاسيكي' : 'Classical')}
                  </span>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-3.5 h-3.5 ${
                          starIndex <= starsEarned ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Song Title & Composer */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {isAr ? song.title.ar : isFr ? song.title.fr : song.title.en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? song.composer.ar : isFr ? song.composer.fr : song.composer.en}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-200">{songHighScore}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>{song.bpm} BPM</span>
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-md">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
