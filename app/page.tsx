import LifeWeeksVisualizer from './components/LifeWeeksVisualizer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span className="font-bold text-foreground">WeeksToDie</span>
          </div>
          {/* <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-foreground text-sm
                         hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Iniciar Sesion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-[#ff5252] text-white text-sm
                         hover:bg-[#ff3333] transition-colors font-medium"
            >
              Registrarse
            </Link>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <LifeWeeksVisualizer />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div
          className="p-8 rounded-2xl bg-gradient-to-r from-[#ff5252]/10 via-orange-500/10 to-pink-500/10
                      border border-[#ff5252]/20 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Guarda tu progreso y crea metas por semana
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
            Crea una cuenta gratuita para guardar tu fecha de nacimiento, personalizar la
            configuracion y agregar tareas y metas a cada semana de tu vida.
          </p>
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                         bg-[#ff5252] text-white font-medium
                         hover:bg-[#ff3333] transition-colors"
            >
              Crear Cuenta Gratis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <span className="text-zinc-400 text-sm">o continua explorando arriba</span>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h3 className="text-xl font-bold text-center text-foreground mb-8">
          Que puedes hacer con WeeksToDie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-bold text-foreground mb-2">Visualiza tu vida</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Ve cada una de las ~4,160 semanas de una vida de 80 anos representadas en una
              cuadricula visual.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-3xl mb-3">⚙️</div>
            <h4 className="font-bold text-foreground mb-2">Personaliza etapas</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Configura las edades de ninez, estudios, trabajo y jubilacion segun tu realidad
              personal.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-3xl mb-3">📈</div>
            <h4 className="font-bold text-foreground mb-2">Estadisticas detalladas</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Calcula cuantas semanas pasaras trabajando, durmiendo, en trafico y mas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-zinc-500">
          <p>
            Basado en el concepto de &quot;4000 semanas&quot; del libro de Oliver Burkeman.
          </p>
          <p className="mt-2">
            Hecho con Next.js y Tailwind CSS.
          </p>
        </div>
      </footer>
    </main>
  );
}
