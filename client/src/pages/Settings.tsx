import { useThemeStore } from "@/lib/theme";
import Navigation from "@/components/Navigation";
import { Palette, Moon, Sun, Type } from "lucide-react";

export default function Settings() {
  const { theme, mode, font, setTheme, setMode, setFont } = useThemeStore();

  const themes = [
    { id: 'sunset', name: 'Sunset', color: 'bg-orange-500' },
    { id: 'ocean', name: 'Ocean', color: 'bg-blue-500' },
    { id: 'forest', name: 'Forest', color: 'bg-green-500' },
    { id: 'midnight', name: 'Midnight', color: 'bg-indigo-500' },
    { id: 'amethyst', name: 'Amethyst', color: 'bg-fuchsia-500' },
    { id: 'monochrome', name: 'Monochrome', color: 'bg-gray-800' },
  ] as const;

  const fonts = [
    { id: 'inter', name: 'Inter' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'playfair', name: 'Playfair Display' },
    { id: 'space', name: 'Space Grotesk' },
    { id: 'comic', name: 'Comic Neue' },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-2 text-foreground">Customization Engine</h1>
        <p className="text-muted-foreground mb-12">Personalize your Nairobi Apparel experience.</p>

        <div className="space-y-12">
          {/* Theme Selector */}
          <section className="p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Palette className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-foreground">Color Theme</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    theme === t.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${t.color} shadow-inner`}></div>
                  <span className="font-semibold text-foreground">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Mode Selector */}
          <section className="p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Moon className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('light')}
                className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  mode === 'light' ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 bg-background'
                }`}
              >
                <Sun className="w-8 h-8 text-foreground" />
                <span className="font-bold text-foreground">Light Mode</span>
              </button>
              <button
                onClick={() => setMode('dark')}
                className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  mode === 'dark' ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 bg-background'
                }`}
              >
                <Moon className="w-8 h-8 text-foreground" />
                <span className="font-bold text-foreground">Dark Mode</span>
              </button>
            </div>
          </section>

          {/* Font Selector */}
          <section className="p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Type className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-foreground">Typography</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    font === f.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 bg-background'
                  }`}
                  style={{ fontFamily: `var(--font-${f.id})` }}
                >
                  <span className="block text-xl font-bold text-foreground mb-1">Ag</span>
                  <span className="text-sm font-medium text-muted-foreground">{f.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
