import {
  Banknote,
  CircleDollarSign,
  HandCoins,
  History,
  LayoutDashboard,
  type LucideIcon,
  Palette,
  Percent,
  Scale,
  Settings,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  soon?: boolean;
};

export const adminNav: NavItem[] = [
  {
    href: "/admin",
    label: "Panel",
    icon: LayoutDashboard,
    description: "Resumen general de la natillera",
  },
  {
    href: "/admin/socios",
    label: "Socios",
    icon: Users,
    description: "Personas, números de polla y retiros",
    soon: true,
  },
  {
    href: "/admin/ahorros",
    label: "Ahorros y mora",
    icon: Wallet,
    description: "Matriz mensual de pagos",
    soon: true,
  },
  {
    href: "/admin/polla",
    label: "Polla",
    icon: CircleDollarSign,
    description: "Sorteos, ganadores y premios",
    soon: true,
  },
  {
    href: "/admin/rifas",
    label: "Rifas",
    icon: Ticket,
    description: "Boletas, números y ganancias",
    soon: true,
  },
  {
    href: "/admin/prestamos",
    label: "Préstamos",
    icon: HandCoins,
    description: "Capital, intereses y abonos",
    soon: true,
  },
  {
    href: "/admin/banco",
    label: "Banco",
    icon: Banknote,
    description: "Bolsillos, movimientos y conciliación",
    soon: true,
  },
  {
    href: "/admin/liquidacion",
    label: "Liquidación",
    icon: Scale,
    description: "Cierre del periodo y estados de cuenta",
    soon: true,
  },
];

export const socioNav: NavItem[] = [
  {
    href: "/mi",
    label: "Mi resumen",
    icon: LayoutDashboard,
    description: "Tu ahorro, tus deudas y tu liquidación",
  },
  {
    href: "/mi/ahorros",
    label: "Mis ahorros",
    icon: Wallet,
    description: "Cuotas pagadas y pendientes",
    soon: true,
  },
  {
    href: "/mi/prestamos",
    label: "Mis préstamos",
    icon: HandCoins,
    description: "Saldo, intereses e historial",
    soon: true,
  },
  {
    href: "/mi/rifas",
    label: "Mis boletas",
    icon: Ticket,
    description: "Números de rifa y pagos",
    soon: true,
  },
  {
    href: "/mi/polla",
    label: "Polla general",
    icon: CircleDollarSign,
    description: "Números, resultados y ganadores",
    soon: true,
  },
  {
    href: "/mi/liquidacion",
    label: "Mi liquidación",
    icon: Scale,
    description: "Proyección de tu cierre de año",
    soon: true,
  },
];

export const adminFooterNav: NavItem[] = [
  {
    href: "/admin/configuracion",
    label: "Configuración",
    icon: Settings,
    description: "Parámetros del periodo y usuarios",
    soon: true,
  },
  {
    href: "/admin/auditoria",
    label: "Auditoría",
    icon: History,
    description: "Historial de cambios y papelera",
    soon: true,
  },
  {
    href: "/admin/administradores",
    label: "Administradores",
    icon: Percent,
    description: "Máximo 3 administradores",
    soon: true,
  },
];

export const disenoNav: NavItem = {
  href: "/design",
  label: "Sistema de diseño",
  icon: Palette,
  description: "Paleta, tipografía y componentes",
};
