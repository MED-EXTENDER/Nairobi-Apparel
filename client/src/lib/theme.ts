import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'sunset' | 'ocean' | 'forest' | 'midnight' | 'amethyst' | 'monochrome';
type Mode = 'light' | 'dark';
type Font = 'inter' | 'roboto' | 'playfair' | 'space' | 'comic';

interface ThemeState {
  theme: Theme;
  mode: Mode;
  font: Font;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setFont: (font: Font) => void;
  init: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'sunset',
      mode: 'light',
      font: 'inter',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      setMode: (mode) => {
        set({ mode });
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setFont: (font) => {
        set({ font });
        document.documentElement.setAttribute('data-font', font);
      },
      init: () => {
        const { theme, mode, font } = get();
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-font', font);
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    { name: 'nairobi-apparel-theme' }
  )
);
