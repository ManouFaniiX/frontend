import { Boxes, FileText, LayoutDashboard, Package, Tags, Truck, UsersRound } from "lucide-react"
import Link from "next/link"

interface AppSidebarProps {
  active: "dashboard" | "products" | "categories" | "suppliers" | "customers" | "invoices"
}

const links = [
  { id: "dashboard", label: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { id: "products", label: "Produits", href: "/produits", icon: Package },
  { id: "categories", label: "Catégories", href: "/categories", icon: Tags },
  { id: "suppliers", label: "Fournisseurs", href: "/fournisseurs", icon: Truck },
  { id: "customers", label: "Clients", href: "/clients", icon: UsersRound },
  { id: "invoices", label: "Factures", href: "/factures", icon: FileText },
] as const

export function AppSidebar({ active }: AppSidebarProps) {
  return (
    <aside className="flex flex-col border-b border-border bg-card lg:fixed lg:inset-y-0 lg:w-[250px] lg:border-b-0 lg:border-r">
      <Link href="/" className="flex h-[74px] items-center gap-3 border-b border-border px-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Boxes aria-hidden="true" size={21} />
        </span>
        <span className="text-xl font-bold tracking-tight">GProd</span>
      </Link>

      <nav aria-label="Navigation principale" className="flex gap-2 overflow-x-auto p-3 lg:flex-col">
        {links.map(({ id, label, href, icon: Icon }) => {
          const isActive = active === id
          return (
            <Link
              key={id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={isActive
                ? "flex shrink-0 items-center gap-3 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground"
                : "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"}
            >
              <Icon aria-hidden="true" size={19} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto hidden border-t border-border p-5 text-sm text-muted-foreground lg:block">
        Gestion de production
      </div>
    </aside>
  )
}
