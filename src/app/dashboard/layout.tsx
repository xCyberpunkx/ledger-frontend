"use client";

import { UserButton } from "@clerk/nextjs";
import { OrgSwitcher } from "@/components/dashboard/OrgSwitcher";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-paper/90 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <OrgSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      {children}
    </div>
  );
}
