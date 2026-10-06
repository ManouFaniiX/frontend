"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Boxes, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/features/auth/api/authApi"
import type { LoginCredentials } from "@/features/auth/types/auth.types"

export function LoginForm() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", password: "" })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await authApi.login(credentials)
      router.replace("/")
    } catch (caughtError) {
      setError(caughtError instanceof Error
        ? caughtError.message
        : "Connexion impossible. Vérifiez vos identifiants et réessayez.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-dvh w-full bg-background text-foreground lg:grid-cols-2">
      <section className="relative hidden min-h-dvh overflow-hidden bg-[var(--palette-espresso)] px-12 py-10 text-[var(--palette-ivory)] lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-32 size-[32rem] rounded-full border border-[color-mix(in_srgb,var(--palette-taupe)_25%,transparent)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-52 -left-32 size-[34rem] rounded-full border border-[color-mix(in_srgb,var(--palette-cocoa)_70%,transparent)]" />

        <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--palette-cocoa)] text-[var(--palette-ivory)]">
            <Boxes aria-hidden="true" size={25} />
          </span>
          <span className="text-2xl font-bold tracking-tight">GProd</span>
        </Link>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--palette-taupe)]">
            Gestion de production
          </p>
          <h1 className="text-5xl font-bold leading-[1.12] tracking-tight xl:text-6xl">
            Toute votre activité, au même endroit.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--palette-stone)]">
            Gérez vos produits, vos stocks, vos clients et vos factures depuis un espace simple et centralisé.
          </p>
        </div>

        <p className="relative z-10 text-sm text-[var(--palette-taupe)]">
          © {new Date().getFullYear()} GProd · Gestion de production
        </p>
      </section>

      <section className="flex min-h-dvh items-center justify-center bg-background px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes aria-hidden="true" size={23} />
            </span>
            <span className="text-xl font-bold">GProd</span>
          </Link>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
            <header className="mb-8">
              <p className="mb-2 text-sm font-semibold text-primary">Bienvenue</p>
              <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Entrez vos identifiants pour accéder à votre tableau de bord.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-medium">Adresse e-mail</label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={credentials.email}
                  onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                  required
                  placeholder="vous@exemple.com"
                  className="h-12 rounded-xl border-border bg-background px-3 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-medium">Mot de passe</label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                    required
                    className="h-12 rounded-xl border-border bg-background px-3 pr-12 text-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={passwordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={passwordVisible}
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    {passwordVisible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                  </Button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Connexion…" : "Se connecter"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Vos identifiants sont transmis de manière sécurisée à votre serveur.
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginForm
