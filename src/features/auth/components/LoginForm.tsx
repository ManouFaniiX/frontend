"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
    .max(10, "Le nom d'utilisateur ne doit pas dépasser 10 caractères.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Il ne peut contenir que des lettres, chiffres et underscores."
    ),
})

export function FormRhfInput() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Valeurs soumises avec succès :", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-zinc-900 p-4 text-zinc-100 border border-white/10">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
    })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
        
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md font-bold text-white border border-white/20 shadow-inner">
              G
            </div>
            <span className="text-xl font-semibold tracking-wide">GProd</span>
          </div>

          <div className="space-y-4 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Toute votre production, <span className="text-amber-300">au même endroit.</span>
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Produits, catégories, fournisseurs, clients et factures : pilotez l'ensemble de votre activité depuis un tableau de bord unique.
            </p>
          </div>

          <div className="text-xs text-zinc-400">
            © 2026 GProd — Gestion de production
          </div>
        </div>

        <div className="flex items-center justify-center p-8 md:p-12 bg-black">
          <Card className="w-full border-0 bg-transparent shadow-none text-white">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Paramètres du profil
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Mettez à jour vos informations personnelles ci-dessous.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="space-y-4">
                  <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="space-y-2">
                        <FieldLabel htmlFor="form-rhf-input-username" className="text-sm font-medium text-zinc-200">
                          Nom d'utilisateur
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-input-username"
                          aria-invalid={fieldState.invalid}
                          placeholder="Entrez votre nom d'utilisateur"
                          autoComplete="username"
                          className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-purple-500 focus-visible:ring-purple-500/20 rounded-xl h-11"
                        />
                        <FieldDescription className="text-xs text-zinc-500">
                          Entre 3 et 10 caractères (lettres, chiffres et underscores uniquement).
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} className="text-red-400 text-xs" />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="px-0 pt-6 flex gap-3 bg-none">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                className="flex-1 bg-transparent   text-white rounded-xl h-11"
              >
                Réinitialiser
              </Button>
              <Button 
                type="submit" 
                form="form-rhf-input"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-purple-500/25 rounded-xl h-11 transition-all"
              >
                Enregistrer →
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default FormRhfInput