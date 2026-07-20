import Link from "next/link";
import RecetaManager from "@/components/RecetaManager";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="group flex flex-col gap-1">
            <span className="text-lg font-semibold text-slate-950">
              Recetas Cocina
            </span>
            <span className="text-xs text-slate-500">Sabores para tu hogar</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
            <Link href="#inicio" className="transition hover:text-slate-950">
              Inicio
            </Link>
            <Link href="#login" className="transition hover:text-slate-950">
              Login
            </Link>
            <Link href="#registro" className="transition hover:text-slate-950">
              Registro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <section
          id="inicio"
          className="mb-16 rounded-[2rem] bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 p-1 shadow-xl shadow-slate-200/30"
        >
          <div className="rounded-[1.75rem] bg-white p-10 sm:p-12">
            <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">
              Recetas populares
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Cocina creativa y fácil para todos los días
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Descubre recetas de cocina con ingredientes accesibles, técnicas
              claras y sabor impecable. Ideal para quien quiere cocinar sin
              complicaciones.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#recetas"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver recetas
              </a>
              <a
                href="#registro"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Regístrate gratis
              </a>
            </div>
          </div>
        </section>

        <section id="recetas" className="mb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Recetas
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Cocina del mundo con sabor casero
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Inspírate con recetas sencillas, menús rápidos y opciones para
              cada momento del día.
            </p>
          </div>

          <div className="mt-10">
            <RecetaManager />
          </div>
        </section>

        <section
          id="login"
          className="mb-16 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Accede a tu cuenta
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                Inicia sesión para guardar tus recetas favoritas, crear listas
                de compras y acceder a ideas personalizadas.
              </p>
            </div>

            <form className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Ingresar
              </button>
            </form>
          </div>
        </section>

        <section
          id="registro"
          className="mb-16 rounded-[2rem] bg-slate-50 p-8 shadow-sm sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.75rem] bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Registro
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Crea tu cuenta
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Regístrate para guardar tus favoritos, planificar comidas y
                recibir recomendaciones que se adapten a tu estilo.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Guarda tus recetas favoritas.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Organiza menús para la semana.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Comparte ideas con amigos y familia.
                </li>
              </ul>
            </div>
            <form className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <label className="block text-sm font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <label className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Crea una contraseña"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Crear cuenta
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}