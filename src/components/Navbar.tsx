import React from 'react';
import { Volume2, VolumeX, Globe, Settings, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenSettings: () => void;
  onOpenCrazyGuide: () => void;
  totalNotesHit: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageToggle,
  onOpenSettings,
  onOpenCrazyGuide,
  totalNotesHit,
}) => {
  const [isMuted, setIsMuted] = React.useState(audioEngine.getMuted());
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  const handleMuteToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const getSubTitle = () => {
    if (isAr) return 'عزف البيانو الإيقاعي';
    if (isFr) return 'Rythme & Symphonie';
    return 'Rhythm & Symphony';
  };

  const getTotalNotesLabel = () => {
    if (isAr) return 'إجمالي النغمات:';
    if (isFr) return 'Notes Totales :';
    return 'Total Notes:';
  };

  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wide leading-none flex items-center gap-1.5">
              <span>Magic Tiles</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                Piano
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              {getSubTitle()}
            </p>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs text-slate-300">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{getTotalNotesLabel()}</span>
          <span className="font-bold text-amber-400">{totalNotesHit}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* CrazyGames Compliance Badge */}
          <button
            onClick={onOpenCrazyGuide}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
            title={isAr ? 'معايير CrazyGames' : 'CrazyGames Guidelines'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>CrazyGames</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? (isAr ? 'تفعيل الصوت' : isFr ? 'Activer le son' : 'Unmute') : (isAr ? 'كتم الصوت' : isFr ? 'Couper le son' : 'Mute')}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            title="Changer de langue / تغيير اللغة / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase font-bold text-amber-400">{lang}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            title={isAr ? 'الإعدادات' : isFr ? 'Paramètres' : 'Settings'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
