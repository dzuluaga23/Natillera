import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Banco y conciliación",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Banco y conciliación"
      description="Organiza el dinero real de la natillera en bolsillos y compara los saldos con lo registrado."
      sprint="Sprint 3"
      backHref="/admin"
      features={[
        "Bolsillos por destino: ahorro, polla, rifas, préstamos",
        "Movimientos de entrada y salida con soporte",
        "Conciliación entre saldo del banco y saldo del sistema",
        "Diferencias marcadas para revisión del administrador",
      ]}
    />
  );
}
