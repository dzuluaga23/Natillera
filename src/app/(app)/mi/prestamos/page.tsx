import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Mis préstamos",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Mis préstamos"
      description="Revisa el saldo de tus préstamos, los intereses y el historial de abonos."
      sprint="Sprint 3"
      backHref="/mi"
      features={[
        "Préstamos activos con capital e interés",
        "Abonos registrados y saldo pendiente",
        "Fechas de desembolso y vencimiento",
      ]}
    />
  );
}
