import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Socios y números de polla",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Socios y números de polla"
      description="Administra las personas de la natillera, su número de polla y su estado dentro de cada periodo."
      sprint="Sprint 1"
      backHref="/admin"
      features={[
        "Alta, edición y búsqueda de socios con validación de duplicados",
        "Asignación de números de polla sin repetir dentro del periodo",
        "Retiros con fecha y motivo, sin borrar el historial",
        "Restauración de socios desde la papelera",
      ]}
    />
  );
}
