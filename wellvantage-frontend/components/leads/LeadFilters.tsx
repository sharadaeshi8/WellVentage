"use client";
import { Search, X } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useRef, useState, useEffect } from "react";

// Simple debounce hook
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return debounced;
}

type SortIconProps = { dir: boolean | null };
function SortIcon({ dir }: SortIconProps) {
  return (
    <span className="ml-2 text-xs" aria-hidden>
      {dir === null ? "↕" : dir ? "↑" : "↓"}
    </span>
  );
}

export type LeadFiltersQuery = {
  search?: string;
  interestLevel?: string;
  assignedTo?: string;
  createdAtFrom?: string;
  sortBy?: string;
  sortOrder?: string;
  gymId?: string;
};

type Props = {
  selectedCount?: number;
  totalCount?: number;
  gymId?: string;
  users?: Array<{ id: string; name: string }>;
  onChange?: (query: LeadFiltersQuery) => void;
};

export default function LeadFilters({
  selectedCount = 0,
  totalCount = 0,
  gymId,
  users = [],
  onChange,
}: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search.trim(), 300);
  const [lastInteraction, setLastInteraction] = useState<string>("");
  const [interest, setInterest] = useState("");
  const [assignee, setAssignee] = useState("");
  const [sortCreatedAsc, setSortCreatedAsc] = useState<boolean | null>(null);
  const [sortNameAsc, setSortNameAsc] = useState<boolean | null>(null);

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // -----------------------------------------------------------
  // FORMAT DATE FOR DISPLAY
  // -----------------------------------------------------------
  const formattedLastInteraction = useMemo(() => {
    if (!lastInteraction) return "All time";
    const d = new Date(lastInteraction);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }, [lastInteraction]);

  // -----------------------------------------------------------
  // CLEAR FILTERS
  // -----------------------------------------------------------
  const clearAll = () => {
    setSearch("");
    setInterest("");
    setAssignee("");
    setSortCreatedAsc(null);
    setSortNameAsc(null);
    setLastInteraction("");
  };

  // -----------------------------------------------------------
  // 🔥 BUILD QUERY PARAMS FOR BACKEND
  // -----------------------------------------------------------
  // (removed helper function to avoid unstable deps)

  // -----------------------------------------------------------
  // 🔥 CALL BACKEND WHEN FILTERS CHANGE
  // -----------------------------------------------------------
  // Build params whenever filters change and notify parent
  useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearch) params.search = debouncedSearch;

    if (interest) {
      params.interestLevel = interest;
    }

    if (assignee) params.assignedTo = assignee; // must be a real userId string

    if (lastInteraction) params.lastInteractionDate = lastInteraction;

    // Sorting
    if (sortCreatedAsc !== null) {
      params.sortBy = "createdAt";
      params.sortOrder = sortCreatedAsc ? "asc" : "desc";
    }

    if (sortNameAsc !== null) {
      // Backend doesn't support 'name'; use 'firstName' for alphabetical sorting
      params.sortBy = "firstName";
      params.sortOrder = sortNameAsc ? "asc" : "desc";
    }

    onChange?.({ ...params, ...(gymId ? { gymId } : {}) });
  }, [
    debouncedSearch,
    interest,
    assignee,
    lastInteraction,
    sortCreatedAsc,
    sortNameAsc,
    gymId,
    onChange,
  ]);

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Search and Last interaction */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[260px]">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden
            >
              <Search className="w-5 h-5" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full py-3 px-4 pl-10 rounded-xl border text-[#8C8C8C] border-[#DFDFDF] bg-[#F6F6F8] focus:outline-none shadow-[0px_1px_4px_0px_#B4B4B440]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const input = dateInputRef.current as
                | (HTMLInputElement & { showPicker?: () => void })
                | null;
              if (input?.showPicker) input.showPicker();
              else dateInputRef.current?.focus();
            }}
            className="px-4 py-3 rounded-md border border-gray-200 bg-[#F6F6F8] text-[#737373] shadow-[0px_0px_2px_2px_#D9D9D9] flex items-center gap-2 cursor-pointer"
            aria-label="Open last interaction date picker"
          >
            <span className="whitespace-nowrap">
              Last interaction : {formattedLastInteraction}
            </span>
            <span aria-hidden>▾</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={lastInteraction}
            onChange={(e) => setLastInteraction(e.target.value)}
            className="sr-only"
            aria-label="Pick last interaction date"
          />
        </div>
      </div>

      {/* Row 2: Filters and sorts */}
      <div className="flex flex-wrap items-center gap-4 lg:gap-[30px]">
        {/* Dropdowns */}
        <div className="flex flex-wrap  items-center gap-4 lg:gap-[30px]">
          <div>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="px-4 py-3 rounded-md border border-gray-200 bg-[#F6F6F8] text-[#737373] shadow-[0px_0px_2px_2px_#D9D9D9] cursor-pointer"
            >
              <option value="">Interest Level</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>
          <div>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="px-4 py-3 rounded-md border border-gray-200 bg-[#F6F6F8] text-[#737373] shadow-[0px_0px_2px_2px_#D9D9D9] cursor-pointer"
            >
              <option value="">Assigned to</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort pills */}
        <button
          type="button"
          onClick={() => setSortCreatedAsc((p) => (p === null ? true : !p))}
          className="px-4 py-3 rounded-md border border-gray-200 bg-[#F6F6F8] text-[#737373] shadow-[0px_0px_2px_2px_#D9D9D9] flex items-center gap-3 cursor-pointer"
        >
          Created At <Image src="sort.svg" alt="sort" width={10} height={12} />
        </button>
        <button
          type="button"
          onClick={() => setSortNameAsc((p) => (p === null ? true : !p))}
          className="px-4 py-3 rounded-md border border-gray-200 bg-[#F6F6F8] text-[#737373] shadow-[0px_0px_2px_2px_#D9D9D9] flex items-center gap-3 cursor-pointer"
        >
          Name Alphabetical{" "}
          <Image src="sort.svg" alt="sort" width={10} height={10} />
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={clearAll}
          className="ml-auto h-10 w-10 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
          aria-label="Clear filters"
          title="Clear filters"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selected count */}
      <div className="text-sm text-gray-500">
        {selectedCount} of {totalCount} leads selected
      </div>
    </div>
  );
}
