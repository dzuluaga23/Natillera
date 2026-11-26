import { ArrowLeft, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/common/link-button";
import { Badge } from "@/components/ui/badge";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  sprint: string;
  features: string[];
  backHref?: string;
};

export function ModulePlaceholder({
  title,
  description,
  sprint,
  features,
  backHref = "/admin",
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="paper-texture rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="size-3" />
            {sprint}
          </Badge>
          <Badge variant="outline">En construcción</Badge>
        </div>

        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
            Lo que incluirá
          </p>
          <ul className="mt-2.5 space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <LinkButton href={backHref} variant="outline" size="lg" className="h-9">
            <ArrowLeft className="size-4" />
            Volver al panel
          </LinkButton>
          <span className="text-xs text-muted-foreground">
            Mientras tanto, revisa el sistema de diseño.
          </span>
        </div>
      </div>
    </div>
  );
}
