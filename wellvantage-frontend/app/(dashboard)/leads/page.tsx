"use client";
import LeadFilters, { LeadFiltersQuery } from "@/components/leads/LeadFilters";
import LeadsTable from "@/components/leads/LeadsTable";
import Link from "next/link";
import { useState } from "react";

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadFiltersQuery>({});
  return (
    <div className="p-5 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mt-4 lg:mt-0">
        <h1 className="text-xl lg:text-2xl font-semibold">Lead Management</h1>
        <Link
          href="/leads/new"
          className="h-10 px-4 bg-[#28A745] text-white rounded-xl inline-flex items-center justify-center"
        >
          +<span className=" hidden md:flex">Add</span>
        </Link>
      </div>
      <LeadFilters onChange={setFilters} />
      <LeadsTable filters={filters} />
    </div>
  );
}
