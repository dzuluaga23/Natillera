import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Administradores",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Administradores"
      description="Gestiona las cuentas de administrador y los accesos de los socios, con un máximo de 3 admins."
      sprint="Sprint 1"
      backHref="/admin"
      features={[
        "Creación de cuentas con usuario y contraseña temporal",
        "Límite estricto de 3 administradores y mínimo de 1",
        "Cambio de contraseña obligatorio en el primer ingreso",
        "Activación y desactivación de accesos de socios",
      ]}
    />
  );
}
