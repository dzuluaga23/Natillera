import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Polla",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Polla"
      description="Controla el sorteo mensual, el número ganador y el premio de cada mes del periodo."
      sprint="Sprint 2"
      backHref="/admin"
      features={[
        "Sorteo por mes con número ganador y evidencia",
        "Cálculo del premio y del excedente para la natillera",
        "Historial de ganadores y números participantes",
        "Vista de polla general para los socios",
      ]}
    />
  );
}
