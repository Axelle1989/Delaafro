import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';

interface ThemeLangControlsProps {
  compact?: boolean;
  className?: string;
}

export const ThemeLangControls: React.FC<ThemeLangControlsProps> = ({
  compact = false,
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {/* Sélecteur de langue FR | EN en pilules */}
      <div
        role="group"
        aria-label={t('common.languageSwitcherAria')}
        className="inline-flex items-center rounded-full p-0.5 bg-[var(--surface)] border border-[var(--border)]"
      >
        <button
          type="button"
          onClick={() => setLanguage('fr')}
          aria-pressed={language === 'fr'}
          className={`${
            compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]'
          } rounded-full font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            language === 'fr'
              ? 'bg-[var(--accent)] text-[#FBF5EC] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          className={`${
            compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]'
          } rounded-full font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            language === 'en'
              ? 'bg-[var(--accent)] text-[#FBF5EC] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
          }`}
        >
          EN
        </button>
      </div>

      {/* Bouton bascule thème Clair / Sombre (SVG Soleil / Lune) */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={isDark ? t('common.switchToLight') : t('common.switchToDark')}
        title={isDark ? t('common.switchToLight') : t('common.switchToDark')}
        className={`${
          compact ? 'w-8 h-8' : 'w-9 h-9'
        } rounded-full inline-flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0`}
      >
        {isDark ? (
          /* Icône Soleil (SVG) */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-[var(--gold)]"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Icône Lune (SVG) */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>
    </div>
  );
};
