import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Polla general",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Polla general"
      description="La polla de todos los socios: números asignados, ganadores y premios de cada mes."
      sprint="Sprint 2"
      backHref="/mi"
      features={[
        "Números de polla de todos los socios del periodo",
        "Ganador y premio de cada mes",
        "Historial de sorteos anteriores",
      ]}
    />
  );
}
