"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { actualizarSocio, crearSocio } from "@/app/(app)/admin/socios/actions";
import { SelectorNumero } from "@/components/socios/selector-numero";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SocioInput, socioSchema } from "@/modules/socios/schema";

export type SocioEditable = {
  socioId: string;
  nombre: string;
  telefono: string | null;
  numeroPolla: string;
  cuotaAhorro: number;
  estado: string;
  motivoRetiro: string | null;
};

type SocioDialogProps = {
  periodoId: string;
  ocupados: Record<string, string>;
  socio?: SocioEditable;
  cuotaSugerida?: number;
};

const CLASE_SELECT =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SocioDialog({
  periodoId,
  ocupados,
  socio,
  cuotaSugerida = 50_000,
}: SocioDialogProps) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esEdicion = Boolean(socio);

  const valoresIniciales: SocioInput = socio
    ? {
        nombre: socio.nombre,
        telefono: socio.telefono ?? "",
        numero: socio.numeroPolla,
        cuota: socio.cuotaAhorro,
        estado: socio.estado === "retirado" ? "retirado" : "activo",
        motivoRetiro: socio.motivoRetiro ?? "",
      }
    : {
        nombre: "",
        telefono: "",
        numero: "",
        cuota: cuotaSugerida,
        estado: "activo",
        motivoRetiro: "",
      };

  const form = useForm<SocioInput>({
    resolver: zodResolver(socioSchema),
    defaultValues: valoresIniciales,
  });

  const estado = form.watch("estado");
  const numero = form.watch("numero");

  function cambiarApertura(nuevoEstado: boolean) {
    setAbierto(nuevoEstado);

    if (nuevoEstado) {
      setError(null);
      form.reset(valoresIniciales);
    }
  }

  async function enviar(values: SocioInput) {
    setEnviando(true);
    setError(null);

    const resultado = socio
      ? await actualizarSocio(periodoId, socio.socioId, values)
      : await crearSocio(periodoId, values);

    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    toast.success(socio ? "Socio actualizado" : "Socio agregado al periodo");
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialog open={abierto} onOpenChange={cambiarApertura}>
      <DialogTrigger
        render={
          <Button
            variant={esEdicion ? "ghost" : "default"}
            size={esEdicion ? "icon-sm" : "lg"}
            className={esEdicion ? undefined : "h-9"}
            aria-label={esEdicion ? `Editar a ${socio?.nombre}` : undefined}
          />
        }
      >
        {esEdicion ? (
          <Pencil className="size-4" />
        ) : (
          <>
            <Plus className="size-4" />
            Nuevo socio
          </>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar socio" : "Nuevo socio"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Puedes cambiar el número de polla mientras esté libre. Los cambios quedan en auditoría."
              : "El número de polla lo elige el socio entre 00 y 99; no se asigna por orden de llegada."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(enviar)} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                autoComplete="name"
                placeholder="Ana María Restrepo"
                aria-invalid={Boolean(form.formState.errors.nombre)}
                {...form.register("nombre")}
              />
              {form.formState.errors.nombre && (
                <p className="text-xs text-destructive">{form.formState.errors.nombre.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="telefono">Teléfono (opcional)</Label>
              <Input
                id="telefono"
                inputMode="tel"
                placeholder="300 000 0000"
                {...form.register("telefono")}
              />
              {form.formState.errors.telefono && (
                <p className="text-xs text-destructive">{form.formState.errors.telefono.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cuota">Cuota mensual (COP)</Label>
              <Input
                id="cuota"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                className="money"
                {...form.register("cuota", { valueAsNumber: true })}
              />
              {form.formState.errors.cuota && (
                <p className="text-xs text-destructive">{form.formState.errors.cuota.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <Label>Número de polla</Label>
              <span className="money text-xs text-muted-foreground">
                {numero ? `Elegido: ${numero}` : "Ninguno elegido"}
              </span>
            </div>
            <Controller
              control={form.control}
              name="numero"
              render={({ field }) => (
                <SelectorNumero
                  valor={field.value}
                  onCambio={(elegido) => field.onChange(elegido)}
                  ocupados={ocupados}
                  numeroActual={socio?.numeroPolla ?? null}
                />
              )}
            />
            {form.formState.errors.numero ? (
              <p className="text-xs text-destructive">{form.formState.errors.numero.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Los números atenuados ya están ocupados en este periodo.
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="estado">Estado en el periodo</Label>
            <select id="estado" className={CLASE_SELECT} {...form.register("estado")}>
              <option value="activo">Activo</option>
              <option value="retirado">Retirado</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Un socio retirado conserva su número, pero no participa en el reparto.
            </p>
          </div>

          {estado === "retirado" && (
            <div className="grid gap-1.5">
              <Label htmlFor="motivoRetiro">Motivo del retiro (opcional)</Label>
              <Input
                id="motivoRetiro"
                placeholder="Se retiró por cambio de ciudad"
                {...form.register("motivoRetiro")}
              />
              {form.formState.errors.motivoRetiro && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.motivoRetiro.message}
                </p>
              )}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" size="lg" type="button" className="h-10" />}
            >
              Cancelar
            </DialogClose>
            <Button type="submit" size="lg" className="h-10" disabled={enviando}>
              {enviando && <Loader2 className="size-4 animate-spin" />}
              {esEdicion ? "Guardar cambios" : "Crear socio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
