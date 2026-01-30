"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/adminHomePage",
  },
  {
    label: "Products",
    icon: Package,
    href: "/adminProductsPage",
  },
  { label: "Customers", icon: Users, href: "/customers" },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  const renderNavItems = (showLabels = true) => (
    <>
      {sidebarItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const IconComponent = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            } ${showLabels ? "justify-start" : "justify-center"}`}
            title={!showLabels ? item.label : ""}
          >
            {/* <IconComponent
              size={showLabels ? 20 : 24} // Larger icons when collapsed
              className={showLabels ? "" : "text-zinc-700"}
            /> */}
            {showLabels && <span className="ml-2">{item.label}</span>}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-start border-b border-zinc-200 bg-white px-4 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="lg:hidden pt-16"></div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6">
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            AdminPanel
          </span>
          <button
            onClick={closeMobileMenu}
            className="flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 p-4">{renderNavItems(true)}</nav>
      </aside>

      <aside className="hidden lg:block">
        <div
          className={`fixed left-0 top-0 h-screen border-r border-zinc-200 bg-white transition-all duration-300 ${
            isDesktopCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex h-16 items-center border-b border-zinc-100 px-4">
            <button
              onClick={toggleDesktopSidebar}
              className="flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label={
                isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <Menu size={isDesktopCollapsed ? 24 : 20} />{" "}
            </button>
            {!isDesktopCollapsed && (
              <span className="ml-3 text-sm font-medium text-zinc-900">
                Admin
              </span>
            )}
          </div>

          <nav className={`space-y-2 p-4 ${isDesktopCollapsed ? "px-3" : ""}`}>
            {" "}
            {renderNavItems(!isDesktopCollapsed)}
          </nav>
        </div>

        <div
          className={`hidden lg:block transition-all duration-300 ${
            isDesktopCollapsed ? "ml-20" : "ml-64"
          }`}
        ></div>
      </aside>
    </>
  );
}
