import React from 'react';
import { X, Volume2, Globe, Keyboard, Sliders, Palette, Music, HardDrive } from 'lucide-react';
import { Language, TileSkin, SoundStyle } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageToggle: () => void;
  keyBindings: string[];
  onUpdateKeys: (keys: string[]) => void;
  tileSkin: TileSkin;
  onUpdateTileSkin: (skin: TileSkin) => void;
  soundStyle: SoundStyle;
  onUpdateSoundStyle: (style: SoundStyle) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageToggle,
  keyBindings,
  onUpdateKeys,
  tileSkin,
  onUpdateTileSkin,
  soundStyle,
  onUpdateSoundStyle,
}) => {
  const [volume, setVolume] = React.useState(audioEngine.getVolume() * 100);
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val / 100);
  };

  const presets = [
    { label: 'A - S - D - F', keys: ['A', 'S', 'D', 'F'] },
    { label: '1 - 2 - 3 - 4', keys: ['1', '2', '3', '4'] },
    { label: 'J - K - L - ;', keys: ['J', 'K', 'L', ';'] },
  ];

  const skins: { id: TileSkin; name: { en: string; ar: string; fr: string }; icon: string; desc: { en: string; ar: string; fr: string }; defaultSound: SoundStyle }[] = [
    {
      id: 'classic',
      name: { en: 'Classic Onyx', ar: 'كلاسيكي فخم', fr: 'Classique' },
      icon: '🖤',
      desc: { en: 'Deep black & gold keys with acoustic piano sound', ar: 'بلاط أسود وذهبي مع صوت بيانو نقي', fr: 'Tuiles noires et dorées' },
      defaultSound: 'piano',
    },
    {
      id: 'neon',
      name: { en: 'Neon Cyberpunk', ar: 'نيون مشع', fr: 'Néon Cyberpunk' },
      icon: '⚡',
      desc: { en: 'Glowing cyan & magenta keys with synthwave sound', ar: 'بلاط سيان ووردي مشع مع صوت سينث نيون', fr: 'Tuiles lumineuses et son synthé' },
      defaultSound: 'synth',
    },
    {
      id: 'wooden',
      name: { en: 'Wooden Mahogany', ar: 'خشب الماهوجني', fr: 'Bois d\'Acajou' },
      icon: '🪵',
      desc: { en: 'Polished wood grain tiles with marimba sound', ar: 'بلاط خشبي دافئ مع صوت ماريمبا خشبي', fr: 'Tuiles en bois et son marimba' },
      defaultSound: 'wooden',
    },
  ];

  const handleSelectSkin = (skinId: TileSkin, defaultSound: SoundStyle) => {
    onUpdateTileSkin(skinId);
    onUpdateSoundStyle(defaultSound);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {isAr ? 'إعدادات اللعبة والتصاميم' : isFr ? 'Paramètres & Thèmes' : 'Game Settings & Skins'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'تخصيص شكل البلاط، أصوات النقر، والمفاتيح'
                : isFr
                ? 'Personnaliser les tuiles, sons et touches'
                : 'Customize Tile Skins, Tap Sounds & Controls'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tile Skins Selector */}
          <div className="space-y-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'نمط البلاط (Tile Skins)' : isFr ? 'Style des Tuiles' : 'Tile Skins'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {skins.map((s) => {
                const isSelected = tileSkin === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSkin(s.id, s.defaultSound)}
                    className={`p-3 rounded-2xl border text-right sm:text-center transition-all flex flex-row sm:flex-col items-center justify-start gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1 sm:flex-initial">
                      <div className="text-xs font-extrabold text-slate-100">
                        {isAr ? s.name.ar : isFr ? s.name.fr : s.name.en}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isAr ? s.desc.ar : isFr ? s.desc.fr : s.desc.en}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Effect Style Selector */}
          <div className="space-y-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'صوت النقر المخصص' : isFr ? 'Son des Tuiles' : 'Tap Sound Feedback'}</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'piano', label: { en: 'Piano', ar: 'بيانو 🎹', fr: 'Piano' } },
                { id: 'synth', label: { en: 'Synth', ar: 'سينث ⚡', fr: 'Synthé' } },
                { id: 'wooden', label: { en: 'Wooden', ar: 'خشبي 🪵', fr: 'Bois' } },
              ].map((snd) => {
                const isSelected = soundStyle === snd.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => onUpdateSoundStyle(snd.id as SoundStyle)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isAr ? snd.label.ar : isFr ? snd.label.fr : snd.label.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Volume Slider */}
          <div className="space-y-2 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'مستوى الصوت' : isFr ? 'Volume Principal' : 'Master Volume'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{Math.round(volume)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Keyboard Controls Preset */}
          <div className="space-y-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>
                {isAr
                  ? 'اختصارات لوحة المفاتيح (PC)'
                  : isFr
                  ? 'Raccourcis Clavier (PC)'
                  : 'Keyboard Controls (PC)'}
              </span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => {
                const isSelected = keyBindings.join('') === preset.keys.join('');
                return (
                  <button
                    key={preset.label}
                    onClick={() => onUpdateKeys(preset.keys)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'لغة الواجهة' : isFr ? 'Langue d\'interface' : 'Interface Language'}</span>
            </span>
            <button
              onClick={onLanguageToggle}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors uppercase"
            >
              {lang === 'ar' ? 'العربية 🇸🇦' : lang === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}
            </button>
          </div>

          {/* Game Footprint Info Banner */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-2xl flex items-center gap-3 text-xs text-indigo-200">
            <HardDrive className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">
                {isAr ? 'مساحة اللعبة:' : isFr ? 'Taille du Jeu :' : 'Game Footprint:'} ~150 KB
              </div>
              <div className="text-[11px] text-indigo-300 mt-0.5">
                {isAr
                  ? 'خفيفة وسريعة جداً بدون تنزيل ملفات صوتیة خاريجية! توليد الصوت يتم فورياً باستخدام Web Audio API.'
                  : isFr
                  ? 'Hyper léger ! Sons générés directement en temps réel sans téléchargement audio.'
                  : 'Ultra fast & lightweight! Synthesizes audio live without external MP3 downloads.'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg"
          >
            {isAr ? 'حفظ وإغلاق' : isFr ? 'Enregistrer et Fermer' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
