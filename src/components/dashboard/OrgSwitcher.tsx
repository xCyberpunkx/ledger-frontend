"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: { role: "OWNER" | "ADMIN" | "MEMBER" }[];
};

export function OrgSwitcher() {
  const { getToken } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Same queryKey as the dashboard list page and the per-org page —
  // TanStack Query dedupes identical keys, so this is one shared cache
  // entry and one network request no matter how many components read it.
  const { data: orgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Organization[]>("/organizations", token);
    },
  });

  // The URL is the single source of truth for "which org am I looking
  // at" — deriving it here instead of tracking separate state means
  // there's nothing that can drift out of sync with the actual page.
  const currentSlug = pathname.startsWith("/dashboard/") ? pathname.split("/")[2] : null;
  const currentOrg = orgs?.find((o) => o.slug === currentSlug);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-ink shadow-soft transition hover:bg-paper-dim"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-moss/10">
          <Building2 className="h-3.5 w-3.5 text-moss" />
        </div>
        <span className="max-w-[160px] truncate">
          {currentOrg ? currentOrg.name : "All organizations"}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-white p-1.5 shadow-lifted">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted hover:bg-paper-dim"
          >
            All organizations
          </Link>
          <div className="my-1 h-px bg-border" />
          {orgs?.map((org) => (
            <Link
              key={org.id}
              href={`/dashboard/${org.slug}`}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-paper-dim ${
                org.slug === currentSlug ? "bg-paper-dim font-medium text-ink" : "text-ink"
              }`}
            >
              <span className="truncate">{org.name}</span>
              <span className="ml-2 shrink-0 text-[10px] font-semibold text-muted">
                {org.memberships[0]?.role}
              </span>
            </Link>
          ))}
          <div className="my-1 h-px bg-border" />
          <Link
            href="/dashboard?create=1"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-moss hover:bg-paper-dim"
          >
            <Plus className="h-3.5 w-3.5" /> New organization
          </Link>
        </div>
      )}
    </div>
  );
}
