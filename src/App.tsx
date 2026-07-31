import React from 'react';
import { Song, GameState, Language, UserStats, TileSkin, SoundStyle } from './types';
import { SONGS } from './data/songs';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { SongSelector } from './components/SongSelector';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { CrazyGamesGuide } from './components/CrazyGamesGuide';

const STATS_STORAGE_KEY = 'magic_tiles_piano_stats_v1';
const SKIN_STORAGE_KEY = 'magic_tiles_piano_skin_v1';
const SOUND_STORAGE_KEY = 'magic_tiles_piano_sound_v1';

export default function App() {
  const [lang, setLang] = React.useState<Language>('ar');
  const [gameState, setGameState] = React.useState<GameState>('menu');
  const [menuView, setMenuView] = React.useState<'home' | 'songs'>('home');
  const [selectedSong, setSelectedSong] = React.useState<Song>(SONGS[0]);

  // Tile Skin & Sound Style
  const [tileSkin, setTileSkin] = React.useState<TileSkin>(() => {
    try {
      const saved = localStorage.getItem(SKIN_STORAGE_KEY);
      if (saved && (saved === 'classic' || saved === 'neon' || saved === 'wooden')) return saved;
    } catch {}
    return 'classic';
  });

  const [soundStyle, setSoundStyle] = React.useState<SoundStyle>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved && (saved === 'piano' || saved === 'synth' || saved === 'wooden')) return saved;
    } catch {}
    return 'piano';
  });

  const handleUpdateTileSkin = (skin: TileSkin) => {
    setTileSkin(skin);
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, skin);
    } catch {}
  };

  const handleUpdateSoundStyle = (style: SoundStyle) => {
    setSoundStyle(style);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, style);
    } catch {}
  };

  // Game Result State
  const [lastScore, setLastScore] = React.useState(0);
  const [lastMaxCombo, setLastMaxCombo] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isNewHighScore, setIsNewHighScore] = React.useState(false);

  // Keybindings
  const [keyBindings, setKeyBindings] = React.useState<string[]>(['A', 'S', 'D', 'F']);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isCrazyGuideOpen, setIsCrazyGuideOpen] = React.useState(false);
  const [gameSessionId, setGameSessionId] = React.useState(1);

  // User persistent stats
  const [stats, setStats] = React.useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      highScores: {},
      stars: {},
      totalNotesHit: 0,
      maxCombo: 0,
    };
  });

  // Save stats to localStorage on update
  React.useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }, [stats]);

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : prev === 'en' ? 'fr' : 'ar'));
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setGameSessionId((id) => id + 1);
    setGameState('playing');
  };

  const handleStartEndless = () => {
    const endlessSong = SONGS.find((s) => s.isEndless) || SONGS[0];
    handleSelectSong(endlessSong);
  };

  const handleQuickStart = () => {
    const endlessSong = SONGS.find((s) => s.isEndless) || SONGS[0];
    handleSelectSong(endlessSong);
  };

  const handleFinishGame = (finalScore: number, maxCombo: number, completed: boolean) => {
    setLastScore(finalScore);
    setLastMaxCombo(maxCombo);
    setIsCompleted(completed);

    const prevHigh = stats.highScores[selectedSong.id] || 0;
    const isNewHigh = finalScore > prevHigh;
    setIsNewHighScore(isNewHigh);

    // Calculate stars
    let starsEarned = 0;
    if (completed || finalScore >= 1000) starsEarned = 1;
    if (finalScore >= 2000) starsEarned = 2;
    if (finalScore >= 4000) starsEarned = 3;

    // Update persistent stats
    setStats((prev) => ({
      ...prev,
      highScores: {
        ...prev.highScores,
        [selectedSong.id]: Math.max(prevHigh, finalScore),
      },
      stars: {
        ...prev.stars,
        [selectedSong.id]: Math.max(prev.stars[selectedSong.id] || 0, starsEarned),
      },
      totalNotesHit: prev.totalNotesHit + Math.floor(finalScore / 100),
      maxCombo: Math.max(prev.maxCombo, maxCombo),
    }));

    setGameState('gameover');
  };

  const handleRestart = () => {
    setGameSessionId((id) => id + 1);
    setGameState('playing');
  };

  const handleNextSong = () => {
    const currentIndex = SONGS.findIndex((s) => s.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % SONGS.length;
    setSelectedSong(SONGS[nextIndex]);
    setGameSessionId((id) => id + 1);
    setGameState('playing');
  };

  const handleMenu = () => {
    setGameState('menu');
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between"
    >
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCrazyGuide={() => setIsCrazyGuideOpen(true)}
        totalNotesHit={stats.totalNotesHit}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        {gameState === 'menu' && menuView === 'home' && (
          <HomeHero
            lang={lang}
            stats={stats}
            onStartEndless={handleStartEndless}
            onOpenSongList={() => setMenuView('songs')}
          />
        )}

        {gameState === 'menu' && menuView === 'songs' && (
          <SongSelector
            lang={lang}
            stats={stats}
            onSelectSong={handleSelectSong}
            onQuickStart={handleStartEndless}
            onBackToHome={() => setMenuView('home')}
          />
        )}

        {(gameState === 'playing' || gameState === 'gameover') && (
          <GameCanvas
            key={gameSessionId}
            song={selectedSong}
            lang={lang}
            keyBindings={keyBindings}
            tileSkin={tileSkin}
            soundStyle={soundStyle}
            onFinishGame={handleFinishGame}
            onBackToMenu={handleMenu}
          />
        )}
      </main>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState === 'gameover'}
        score={lastScore}
        maxCombo={lastMaxCombo}
        isNewHighScore={isNewHighScore}
        song={selectedSong}
        isCompleted={isCompleted}
        lang={lang}
        onRestart={handleRestart}
        onMenu={handleMenu}
        onNextSong={handleNextSong}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        keyBindings={keyBindings}
        onUpdateKeys={setKeyBindings}
        tileSkin={tileSkin}
        onUpdateTileSkin={handleUpdateTileSkin}
        soundStyle={soundStyle}
        onUpdateSoundStyle={handleUpdateSoundStyle}
      />

      {/* CrazyGames Compliance Info Modal */}
      <CrazyGamesGuide
        isOpen={isCrazyGuideOpen}
        onClose={() => setIsCrazyGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
