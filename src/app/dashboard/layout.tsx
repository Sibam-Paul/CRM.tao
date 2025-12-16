"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Mail, Users, Settings, BarChart3, Package, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Email", href: "/dashboard/email", icon: Mail },
  { name: "Logs", href: "/dashboard/logs", icon: FileText },
  { name: "Users", href: "#", icon: Users, disabled: true },
  { name: "Products", href: "#", icon: Package, disabled: true },
  { name: "Analytics", href: "#", icon: BarChart3, disabled: true },
  { name: "Settings", href: "#", icon: Settings, disabled: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your business</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">General</div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-foreground/5 text-foreground"
                    : item.disabled
                      ? "text-muted-foreground cursor-not-allowed opacity-50"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-semibold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@crm.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
