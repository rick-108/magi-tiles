import React from 'react';
import { ShieldCheck, Music, Keyboard, Smartphone, Code, Globe, X } from 'lucide-react';
import { Language } from '../types';

interface CrazyGamesGuideProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CrazyGamesGuide: React.FC<CrazyGamesGuideProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'معايير النشر على CrazyGames' : 'CrazyGames Publisher Compliance'}
            </h2>
            <p className="text-xs text-amber-400 font-mono">
              HTML5 Web Standards & Royalty-Free Audio Rules
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Music className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">
                {isAr ? '1. موسيقى ملكية عامة خالية من الحقوق (Public Domain)' : '1. 100% Royalty-Free Classical Audio'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'تم استخدام محرك صوتی Web Audio API لتوليد نغمات بيانو كلاسيكية حقيقية لمقطوعات بيتهوفن وموزارت وشوبان التي انقضت حمايتها الفكرية وصارت ملكاً عاماً، دون الحاجة لملفات صوتية خارجية قد تفشل أو تخترق حقوق النشر.'
                  : 'Engineered using Web Audio API synthesis for Public Domain masterpieces (Beethoven, Mozart, Chopin, Vivaldi). Zero copyright risks, zero external server audio failure.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">
                {isAr ? '2. دعم الجوال والحاسوب (Mobile & Desktop Multi-Touch)' : '2. Mobile & PC Touch/Keyboard Mapping'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'تحكم سلس عبر اللمس المتعدد على الجوال (Multi-Touch) وعبر لوحة المفاتيح (أزرار A-S-D-F أو 1-2-3-4) والماوس على الحاسوب.'
                  : 'Responsive control system supporting multi-touch gestures on mobile and keyboard keybindings (A-S-D-F / 1-2-3-4) or mouse on PC.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Keyboard className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">
                {isAr ? '3. تجنب المفاتيح المحظورة (No Forbidden Keys)' : '3. Safe Key Binding Compliance'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'لا يتم استخدام مفاتيح المتصفح المحظورة مثل Escape أو Ctrl+W لضمان عدم الخروج من الشاشة الكاملة على منصات الألعاب.'
                  : 'Compliant with browser escape rules; no interception of standard browser shortcuts or fullscreen exit bindings.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Code className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">
                {isAr ? '4. بناء HTML5 واستدعاءات نسبية (Relative Paths)' : '4. Standalone HTML5 Bundle & Relative Paths'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr
                  ? 'جميع الموارد تستدعى عبر مسارات نسبية لضمان عمل اللعبة فور استضافتها على خوادم CrazyGames المستقلة.'
                  : 'All assets and scripts load via standard relative paths inside the export bundle.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:brightness-110 transition-all shadow-lg"
          >
            {isAr ? 'فهمت، البدء باللعب' : 'Got it! Let\'s Play'}
          </button>
        </div>
      </div>
    </div>
  );
};
