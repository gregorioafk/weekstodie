'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string) => Promise<{ error: string | null }>;
  isLoading?: boolean;
}

export default function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    const result = await onSubmit(email, password);

    if (result.error) {
      setError(result.error);
    } else if (mode === 'register') {
      setSuccess('Cuenta creada. Revisa tu email para confirmar.');
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {isLogin
              ? 'Accede a tu visualizador de semanas'
              : 'Comienza a visualizar tu vida en semanas'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600
                         bg-white dark:bg-zinc-800 text-foreground
                         focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent
                         disabled:opacity-50 transition-all"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contrasena
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600
                         bg-white dark:bg-zinc-800 text-foreground
                         focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent
                         disabled:opacity-50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password (only for register) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Confirmar Contrasena
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600
                           bg-white dark:bg-zinc-800 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent
                           disabled:opacity-50 transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-medium
                       bg-[#ff5252] text-white
                       hover:bg-[#ff3333] active:bg-[#e04545]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cargando...
              </span>
            ) : isLogin ? (
              'Iniciar Sesion'
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Toggle Link */}
        <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isLogin ? (
            <>
              No tienes cuenta?{' '}
              <Link href="/register" className="text-[#ff5252] hover:underline font-medium">
                Registrate
              </Link>
            </>
          ) : (
            <>
              Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#ff5252] hover:underline font-medium">
                Inicia Sesion
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
