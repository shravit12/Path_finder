"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-16 items-center border-b px-6">
      <SidebarTrigger />

      <h1 className="ml-4 text-lg font-semibold">
        AlgoVision
      </h1>
    </header>
  );
}