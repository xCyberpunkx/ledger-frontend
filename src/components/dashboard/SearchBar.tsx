"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Search, FolderKanban, ListTodo } from "lucide-react";

type SearchProject = {
  id: string;
  name: string;
  client: { id: string; name: string };
};

type SearchTask = {
  id: string;
  title: string;
  project: { id: string; name: string };
};

type SearchResults = {
  projects: SearchProject[];
  tasks: SearchTask[];
};

// No debounce library in this repo (deliberate, per CONTEXT.md — one
// less tool to add) — a small inline hook does the same job for a
// single input, no dependency needed.
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function SearchBar({
  organizationId,
  slug,
}: {
  organizationId: string;
  slug: string;
}) {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  // Mirrors the backend's MinLength(2) on SearchQueryDto — no point
  // firing a request that would just come back a 400.
  const enabled = debouncedQuery.length >= 2;

  const { data: results, isFetching } = useQuery({
    queryKey: ["search", organizationId, debouncedQuery],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<SearchResults>(
        `/organizations/${organizationId}/search?q=${encodeURIComponent(debouncedQuery)}`,
        token,
      );
    },
    enabled,
  });

  const showDropdown = focused && enabled;
  const hasResults =
    (results?.projects.length ?? 0) + (results?.tasks.length ?? 0) > 0;

  return (
    <div className="relative mt-6">
      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-soft">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          // Delay so a click on a result fires before blur removes the dropdown.
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search projects and tasks…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white p-2 shadow-soft">
          {isFetching && (
            <p className="px-3 py-2 text-xs text-muted">Searching…</p>
          )}

          {!isFetching && !hasResults && (
            <p className="px-3 py-2 text-xs text-muted">
              No matches for &quot;{debouncedQuery}&quot;.
            </p>
          )}

          {!isFetching &&
            results?.projects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/${slug}/projects/${p.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-paper-dim"
              >
                <FolderKanban className="h-3.5 w-3.5 text-moss" />
                <span className="font-medium text-ink">{p.name}</span>
                <span className="text-muted">{p.client.name}</span>
              </Link>
            ))}

          {!isFetching &&
            results?.tasks.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/${slug}/projects/${t.project.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-paper-dim"
              >
                <ListTodo className="h-3.5 w-3.5 text-moss" />
                <span className="font-medium text-ink">{t.title}</span>
                <span className="text-muted">in {t.project.name}</span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
