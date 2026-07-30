import React from 'react';
import { Play, Star, Music2, Flame, Search, Sparkles, Trophy } from 'lucide-react';
import { Song, Difficulty, Language, UserStats } from '../types';
import { SONGS } from '../data/songs';

interface SongSelectorProps {
  lang: Language;
  stats: UserStats;
  onSelectSong: (song: Song) => void;
  onQuickStart: () => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  lang,
  stats,
  onSelectSong,
  onQuickStart,
}) => {
  const [activeTab, setActiveTab] = React.useState<Difficulty | 'all'>('all');
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
      const categoryMatch = activeTab === 'all' || song.difficulty === activeTab;
      return (titleMatch || composerMatch) && categoryMatch;
    });
  }, [searchQuery, activeTab]);

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'hard':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'master':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner / Fast Gameplay Direct Start */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'جاهز للنشر على CrazyGames'
                  : isFr
                  ? 'Jeu Instantané - Prêt pour CrazyGames'
                  : 'Instant Gameplay - CrazyGames Ready'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isAr
                ? 'عزف أشهر المقطوعات الكلاسيكية'
                : isFr
                ? 'Jouez les Plus Grands Chefs-d\'Œuvre Classiques'
                : 'Master World Classical Symphonies'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'موسيقى خالية من حقوق الملكية 100%. استخدم مفاتيح (A-S-D-F) أو اللمس المباشر على الشاشة لعزف النغمات وسحق النقاط القياسية!'
                : isFr
                ? 'Musique classique 100% libre de droits. Utilisez les touches (A-S-D-F) ou l\'écran tactile pour jouer les notes !'
                : '100% Royalty-Free classical masterpieces. Tap black tiles using keyboard (A-S-D-F) or mobile multi-touch to build high combos!'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                const endlessSong = SONGS.find((s) => s.isEndless) || SONGS[0];
                onSelectSong(endlessSong);
              }}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-rose-400/30"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-pulse fill-current" />
              <span>
                {isAr ? '⚡ النمط المفتوح (اللانهائي)' : isFr ? '⚡ MODE SURVIE INFINI' : '⚡ ENDLESS SURVIVAL'}
              </span>
            </button>

            <button
              onClick={onQuickStart}
              className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isAr ? 'لعب سريع' : isFr ? 'DÉPART RAPIDE' : 'QUICK START'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Difficulty Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'easy', 'medium', 'hard', 'master'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labels: Record<string, { en: string; ar: string; fr: string }> = {
              all: { en: 'All', ar: 'الكل', fr: 'Tous' },
              easy: { en: 'Easy', ar: 'سهل', fr: 'Facile' },
              medium: { en: 'Medium', ar: 'متوسط', fr: 'Moyen' },
              hard: { en: 'Hard', ar: 'صعب', fr: 'Difficile' },
              master: { en: 'Master', ar: 'محترف', fr: 'Expert' },
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isAr ? labels[tab].ar : isFr ? labels[tab].fr : labels[tab].en}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr ? 'بحث عن مقطوعة أو مؤلف...' : isFr ? 'Rechercher une musique...' : 'Search song or composer...'
            }
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Song Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => {
          const songHighScore = stats.highScores[song.id] || 0;
          const starsEarned = stats.stars[song.id] || 0;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="group relative bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wide ${getDifficultyBadge(
                      song.difficulty
                    )}`}
                  >
                    {song.difficulty}
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
