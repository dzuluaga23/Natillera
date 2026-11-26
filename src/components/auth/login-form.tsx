"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { rutaInicio } from "@/lib/permissions";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario es demasiado largo"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [verPassword, setVerPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginValues) {
    const { error } = await authClient.signIn.username({
      username: values.username.trim(),
      password: values.password,
    });

    if (error) {
      toast.error("No pudimos iniciar sesión", {
        description:
          error.status === 401 || error.status === 400
            ? "Usuario o contraseña incorrectos."
            : (error.message ?? "Intenta de nuevo en unos segundos."),
      });
      return;
    }

    const session = await authClient.getSession();
    const rol = session.data?.user.role;
    toast.success("Bienvenido de vuelta");
    // Navegación completa para que el servidor lea la cookie de sesión recién creada.
    window.location.assign(rutaInicio(rol));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="admin"
          aria-invalid={Boolean(form.formState.errors.username)}
          className="h-11 text-base"
          {...form.register("username")}
        />
        {form.formState.errors.username && (
          <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={verPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(form.formState.errors.password)}
            className="h-11 pr-11 text-base"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setVerPassword((valor) => !valor)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {verPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        {isSubmitting ? "Entrando…" : "Entrar"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Las cuentas son creadas por un administrador. No hay registro público.
      </p>
    </form>
  );
}
