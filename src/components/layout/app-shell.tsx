"use client";

import {
  ChevronDown,
  LogOut,
  Menu,
  Palette,
  PanelLeftClose,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/brand/logo";
import {
  adminFooterNav,
  adminNav,
  disenoNav,
  type NavItem,
  socioNav,
} from "@/components/layout/nav-items";
import { type PeriodoOpcion, PeriodSelector } from "@/components/layout/period-selector";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { etiquetaRol } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type AppShellProps = {
  role: "admin" | "socio";
  userName: string;
  username: string;
  periods: PeriodoOpcion[];
  children: React.ReactNode;
};

function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className={cn("size-4 shrink-0", active ? "text-sidebar-primary" : "opacity-80")} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.soon && (
        <span className="rounded-full border border-sidebar-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-sidebar-foreground/50">
          Pronto
        </span>
      )}
    </Link>
  );
}

export function AppShell({ role, userName, username, periods, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainNav = role === "admin" ? adminNav : socioNav;
  const footerNav = role === "admin" ? adminFooterNav : [];
  const allNav = useMemo(() => [...mainNav, ...footerNav, disenoNav], [mainNav, footerNav]);

  const current = allNav
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const selectedPeriodId =
    searchParams.get("periodo") ??
    periods.find((periodo) => periodo.estado === "activo")?.id ??
    periods[0]?.id;

  // biome-ignore lint/correctness/useExhaustiveDependencies: cerramos el menú móvil al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function cerrarSesion() {
    await authClient.signOut();
    window.location.assign("/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo variant="light" />
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
          aria-label="Cerrar menú"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mx-4 mb-4 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-sidebar-primary">
          <ShieldCheck className="size-3.5" />
          {etiquetaRol(role)}
        </div>
        <p className="mt-1 truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
        <p className="truncate text-xs text-sidebar-foreground/50">@{username}</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={current?.href === item.href}
            onNavigate={() => setMenuOpen(false)}
          />
        ))}

        {footerNav.length > 0 && (
          <>
            <div className="mx-3 my-3 border-t border-sidebar-border" />
            {footerNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={current?.href === item.href}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={disenoNav.href}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <Palette className="size-3.5" />
          Sistema de diseño
          <Sparkles className="ml-auto size-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-sidebar text-sidebar-foreground md:block">
        {sidebar}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-sidebar text-sidebar-foreground shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 py-2.5 md:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg border border-border bg-card p-2 text-foreground md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-4" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                NatilleraApp
              </p>
              <h1 className="truncate font-heading text-lg font-semibold text-foreground">
                {current?.label ?? "Panel"}
              </h1>
            </div>

            <PeriodSelector
              periods={periods}
              selectedId={selectedPeriodId}
              className="hidden sm:inline-flex"
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-2 pl-1 text-left transition-colors hover:bg-muted"
                aria-label="Menú de usuario"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {iniciales(userName) || <UserRound className="size-4" />}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-medium text-foreground lg:block">
                  {userName}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <span className="block text-sm font-medium text-foreground">{userName}</span>
                  <span className="block text-xs text-muted-foreground">
                    @{username} · {etiquetaRol(role)}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(disenoNav.href);
                  }}
                >
                  <Palette className="size-4" />
                  Sistema de diseño
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={cerrarSesion}>
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 border-t border-border/60 px-4 py-2 sm:hidden">
            <PeriodSelector periods={periods} selectedId={selectedPeriodId} compact />
            <Badge variant="outline" className="ml-auto text-[10px]">
              Sprint 0
            </Badge>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 pb-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <span className="flex items-center gap-1.5">
            <PanelLeftClose className="size-3" />
            NatilleraApp · Periodo dic–nov · COP
          </span>
          <span>Sprint 0 · Fundaciones</span>
        </footer>
      </div>
    </div>
  );
}
