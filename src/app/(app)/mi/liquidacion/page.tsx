import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Mi liquidación",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Mi liquidación"
      description="La proyección de tu cierre de periodo y, al final, tu estado de cuenta."
      sprint="Sprint 4"
      backHref="/mi"
      features={[
        "Proyección de ahorro y mora al cierre",
        "Participación en utilidades de polla, rifas y préstamos",
        "Estado de cuenta final en PDF",
      ]}
    />
  );
}
