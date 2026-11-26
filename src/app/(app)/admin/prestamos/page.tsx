import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Préstamos",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Préstamos"
      description="Registra préstamos de la natillera a sus socios, con interés, abonos y saldo actualizado."
      sprint="Sprint 3"
      backHref="/admin"
      features={[
        "Préstamo con capital, tasa de interés y fecha de desembolso",
        "Abonos a capital e intereses con historial",
        "Saldo pendiente y proyección de cuotas",
        "Alertas de préstamos vencidos o cerca del cierre",
      ]}
    />
  );
}
