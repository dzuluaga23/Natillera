"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { quitarSocioDelPeriodo } from "@/app/(app)/admin/socios/actions";
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

type QuitarSocioDialogProps = {
  periodoId: string;
  socioId: string;
  nombre: string;
  numeroPolla: string;
};

export function QuitarSocioDialog({
  periodoId,
  socioId,
  nombre,
  numeroPolla,
}: QuitarSocioDialogProps) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function quitar() {
    setEnviando(true);
    setError(null);

    const resultado = await quitarSocioDelPeriodo(periodoId, socioId);

    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    toast.success(`${nombre} ya no está en el periodo`);
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialog
      open={abierto}
      onOpenChange={(nuevo) => {
        setAbierto(nuevo);
        if (nuevo) setError(null);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Quitar a ${nombre} del periodo`} />
        }
      >
        <Trash2 className="size-4 text-destructive" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quitar a {nombre} del periodo</DialogTitle>
          <DialogDescription>
            El número {numeroPolla} queda libre para otro socio. El historial y la auditoría se
            conservan, y puedes volver a agregarlo cuando quieras.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>Cancelar</DialogClose>
          <Button variant="destructive" onClick={quitar} disabled={enviando}>
            {enviando && <Loader2 className="size-4 animate-spin" />}
            Quitar del periodo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
