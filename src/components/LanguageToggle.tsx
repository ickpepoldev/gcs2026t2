import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('zh-TW')}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative group ${language === 'zh-TW'
            ? 'text-text'
            : 'text-text-muted hover:text-text'
          }`}
      >
        {language === 'zh-TW' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-coral"></span>
        )}
        繁體中文
      </button>
      <button
        onClick={() => setLanguage('zh-CN')}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative group ${language === 'zh-CN'
            ? 'text-text'
            : 'text-text-muted hover:text-text'
          }`}
      >
        {language === 'zh-CN' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-coral"></span>
        )}
        简体中文
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative group ${language === 'en'
            ? 'text-text'
            : 'text-text-muted hover:text-text'
          }`}
      >
        {language === 'en' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-coral"></span>
        )}
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
