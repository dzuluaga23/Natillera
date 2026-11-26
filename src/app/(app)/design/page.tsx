import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Palette,
  Plus,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCOP } from "@/lib/money";

export const metadata: Metadata = {
  title: "Sistema de diseño",
};

const paleta = [
  { nombre: "Fondo", token: "--background", hex: "#F6F1E7", uso: "Fondo general de la app" },
  { nombre: "Superficie", token: "--card", hex: "#FBF8F1", uso: "Tarjetas, tablas y paneles" },
  { nombre: "Texto", token: "--foreground", hex: "#3B2F26", uso: "Texto principal y sidebar" },
  { nombre: "Oliva", token: "--primary", hex: "#5F6F3E", uso: "Acciones, acentos y éxito" },
  { nombre: "Marrón", token: "--secondary", hex: "#7A5C43", uso: "Etiquetas y datos secundarios" },
  { nombre: "Salvia", token: "--accent", hex: "#A8B58A", uso: "Énfasis suave y selección" },
  { nombre: "Arcilla", token: "--destructive", hex: "#9C4A3C", uso: "Errores y alertas críticas" },
  { nombre: "Borde", token: "--border", hex: "#DDCFB8", uso: "Bordes y separadores" },
];

const estados = [
  {
    nombre: "A tiempo",
    clase: "bg-state-ontime text-state-ontime-foreground",
    detalle: "Pagó antes del día 20",
  },
  {
    nombre: "Con mora",
    clase: "bg-state-late text-state-late-foreground",
    detalle: "Pagó después del vencimiento",
  },
  {
    nombre: "Parcial",
    clase: "bg-state-partial text-state-partial-foreground",
    detalle: "Abonó menos de la cuota",
  },
  {
    nombre: "Pendiente",
    clase: "bg-state-unpaid text-state-unpaid-foreground",
    detalle: "No ha pagado",
  },
  {
    nombre: "Retirado",
    clase: "bg-state-retired text-state-retired-foreground",
    detalle: "Salió del periodo",
  },
];

const filas = [
  { numero: "00", nombre: "Ana María Restrepo", ahorro: 50_000, mora: 0, estado: estados[0] },
  { numero: "01", nombre: "Carlos Andrés Pérez", ahorro: 50_000, mora: 5_000, estado: estados[1] },
  { numero: "02", nombre: "Diana Carolina Gómez", ahorro: 25_000, mora: 0, estado: estados[2] },
  { numero: "03", nombre: "Juan Pablo Rodríguez", ahorro: 0, mora: 0, estado: estados[3] },
];

export default function DesignPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fundaciones"
        icon={Palette}
        title="Sistema de diseño"
        description="Guía corta de color, tipografía y componentes. Todo el producto usa esta base: beige cálido, marrón y verde oliva, pensada primero para el celular."
      />

      <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
        <h3 className="font-heading text-lg font-semibold">Paleta</h3>
        <p className="text-xs text-muted-foreground">
          Valores en OKLCH/hex definidos en{" "}
          <code className="rounded bg-muted px-1">globals.css</code> como variables CSS y tokens de
          Tailwind.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {paleta.map((color) => (
            <div key={color.token} className="overflow-hidden rounded-xl ring-1 ring-border">
              <div className="h-14 w-full" style={{ background: color.hex }} />
              <div className="bg-background/60 p-2.5">
                <p className="text-sm font-medium">{color.nombre}</p>
                <p className="money text-[11px] text-muted-foreground">
                  {color.hex} · {color.token}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{color.uso}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
          <h3 className="font-heading text-lg font-semibold">Tipografía</h3>
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                Fraunces · títulos
              </p>
              <p className="font-heading text-3xl font-semibold tracking-tight">
                Natillera 2026-2027
              </p>
              <p className="font-heading text-xl font-semibold">Ahorros y mora</p>
            </div>
            <Separator />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                Inter · interfaz y datos
              </p>
              <p className="text-sm">
                La cuota del mes se registra con la fecha real de pago. La mora es una sugerencia
                que el administrador puede ajustar.
              </p>
              <p className="money mt-2 text-2xl font-semibold">{formatCOP(1_250_000)}</p>
              <p className="text-xs text-muted-foreground">
                Cifras siempre en pesos enteros, con <code>font-variant-numeric: tabular-nums</code>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
          <h3 className="font-heading text-lg font-semibold">Botones</h3>
          <p className="text-xs text-muted-foreground">
            Altura mínima de 36–44 px en móvil. La acción principal siempre es oliva.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button>
              <Plus className="size-4" />
              Registrar pago
            </Button>
            <Button variant="secondary">Editar cuota</Button>
            <Button variant="outline">
              <Search className="size-4" />
              Buscar
            </Button>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="destructive">Eliminar</Button>
            <Button variant="link">
              Ver detalle <ArrowRight className="size-3.5" />
            </Button>
            <Button disabled>Deshabilitado</Button>
          </div>
          <Separator className="my-4" />
          <h4 className="text-sm font-medium">Estados de pago</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {estados.map((estado) => (
              <span
                key={estado.nombre}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${estado.clase}`}
                title={estado.detalle}
              >
                {estado.nombre}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge>Socio activo</Badge>
            <Badge variant="secondary">Polla 07</Badge>
            <Badge variant="outline">Periodo cerrado</Badge>
            <Badge variant="destructive">3 cuotas vencidas</Badge>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
          <h3 className="font-heading text-lg font-semibold">Matriz de ahorros</h3>
          <p className="text-xs text-muted-foreground">
            Referencia visual: tabla compacta con scroll horizontal en móvil y cifras alineadas a la
            derecha.
          </p>
          <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">N.º</TableHead>
                  <TableHead>Socio</TableHead>
                  <TableHead className="text-right">Ahorro</TableHead>
                  <TableHead className="text-right">Mora</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filas.map((fila) => (
                  <TableRow key={fila.numero}>
                    <TableCell className="money text-muted-foreground">{fila.numero}</TableCell>
                    <TableCell className="font-medium">{fila.nombre}</TableCell>
                    <TableCell className="money text-right">{formatCOP(fila.ahorro)}</TableCell>
                    <TableCell className="money text-right">{formatCOP(fila.mora)}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${fila.estado.clase}`}
                      >
                        {fila.estado.nombre}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
            <h3 className="font-heading text-lg font-semibold">Formulario</h3>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="demo-monto">Monto del pago</Label>
                <Input
                  id="demo-monto"
                  inputMode="numeric"
                  placeholder="50.000"
                  className="h-11 text-base"
                />
                <p className="text-xs text-muted-foreground">Solo enteros en COP, sin centavos.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-buscar">Buscar socio</Label>
                <Input
                  id="demo-buscar"
                  placeholder="Nombre o número de polla"
                  className="h-11 text-base"
                />
              </div>
              <Button className="h-11 w-full text-base">
                <Wallet className="size-4" />
                Guardar pago
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Mora sugerida</AlertTitle>
              <AlertDescription>
                El sistema calcula {formatCOP(5_000)} de mora. Puedes ajustarla antes de guardar.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Periodo cerrado</AlertTitle>
              <AlertDescription>
                Para editar este periodo debes reabrirlo. La acción queda en auditoría.
              </AlertDescription>
            </Alert>
            <div className="flex items-center gap-2 rounded-lg bg-state-ontime px-3 py-2 text-sm text-state-ontime-foreground">
              <CheckCircle2 className="size-4" />
              Pago registrado correctamente.
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
        <h3 className="font-heading text-lg font-semibold">Reglas de interfaz</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              titulo: "Móvil primero",
              detalle:
                "Una columna por defecto; las tablas hacen scroll horizontal en lugar de encogerse. Botones de 40–44 px.",
            },
            {
              titulo: "Español de Colombia",
              detalle:
                "Fechas dd/mm/aaaa, moneda COP y zona horaria America/Bogota. Sin jerga técnica en la UI.",
            },
            {
              titulo: "Alertar, no bloquear",
              detalle:
                "Las reglas del negocio generan advertencias visibles; el administrador puede continuar.",
            },
            {
              titulo: "Confirmar lo delicado",
              detalle:
                "Cierres, reaperturas y eliminaciones piden confirmación explícita y quedan en auditoría.",
            },
            {
              titulo: "Estados con color + texto",
              detalle:
                "Nunca solo color: cada estado lleva etiqueta escrita para que sea legible y accesible.",
            },
            {
              titulo: "Radios y sombras",
              detalle:
                "Radios de 8–16 px y sombras muy suaves. Sin gradientes fuertes ni bordes duros.",
            },
          ].map((regla) => (
            <div
              key={regla.titulo}
              className="rounded-lg border border-border bg-background/50 p-3"
            >
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-3.5 text-primary" />
                {regla.titulo}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{regla.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Tarjeta de referencia</CardTitle>
          <CardDescription>
            Superficie beige, borde suave y título en Fraunces para separar secciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Usa tarjetas para agrupar información relacionada y deja el fondo de la app para
          separarlas.
        </CardContent>
      </Card>
    </div>
  );
}
