"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  User2,
  Flame,
  SunMedium,
  Snowflake,
  MessageCircle,
  Clock3,
  Box,
} from "lucide-react";
import { useLeads } from "@/lib/hooks/useLeads";
import type { LeadFiltersQuery } from "./LeadFilters";
import type { Lead, AssignedUser } from "@/lib/types";

type Row = {
  id: string;
  name: string;
  interest: string;
  assigned: string;
  lastInteraction: string;
  followUp: string;
};

type Props = { filters?: LeadFiltersQuery };

export default function LeadsTable({ filters = {} }: Props) {
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  // Fetch leads with filters and pagination; backend uses JWT gymId
  const { data, isLoading, isError } = useLeads({ ...filters, page, limit });

  const rows: Row[] = useMemo(() => {
    const list: Lead[] = (data?.data as Lead[]) ?? [];
    return list.map((lead: Lead): Row => {
      const name = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
      const interest = lead.status?.interestLevel ?? "Cold";
      const assigned =
        lead.status?.assignedTo && typeof lead.status.assignedTo === "object"
          ? `${(lead.status.assignedTo as AssignedUser).firstName ?? ""} ${
              (lead.status.assignedTo as AssignedUser).lastName ?? ""
            }`.trim()
          : "Unassigned";
      const lastInteraction = lead.lastInteractionDate
        ? new Date(lead.lastInteractionDate).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";
      const followUp = lead.status?.followUpStatus ?? "-";
      return {
        id: lead._id,
        name,
        interest,
        assigned,
        lastInteraction,
        followUp,
      };
    });
  }, [data]);

  const total: number = data?.pagination?.total ?? rows.length;
  const totalPages: number = data?.pagination?.totalPages ?? 1;
  const currentPage: number = data?.pagination?.page ?? page;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);
  console.log(rows);
  const badge = (type: string) => {
    if (type === "Hot") return "bg-[#FFDBDB] text-[#A91313] ";
    if (type === "Warm") return "bg-[#FFECCD] text-[#F59E0B] ";
    return "bg-[#C9E8FF] text-[#3B82F6]";
  };
  const badgeIcon = (type: string) => {
    if (type === "Hot")
      return <Image src="/flame.svg" alt="Hot" width={14} height={14} />;
    if (type === "Warm")
      return <Image src="/warm.svg" alt="Warm" width={16} height={16} />;
    return <Snowflake className="h-3.5 w-3.5" />;
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-auto">
      <table className="w-full text-left text-[14px]">
        <thead className="border-b border-neutral-200 text-[13px] text-neutral-600">
          <tr className="h-12">
            {/* <th className="px-4 font-semibold">
              <input type="checkbox" />
            </th> */}
            <th className="px-2 font-semibold">Name</th>
            <th className="px-2 font-semibold">Interest Level</th>
            <th className="px-2 font-semibold">Assigned to</th>
            <th className="px-2 font-semibold">Last Interaction</th>
            <th className="px-2 font-semibold">Follow Up</th>
            <th className="px-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-neutral-500"
              >
                Loading leads...
              </td>
            </tr>
          )}
          {isError && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-red-600">
                Failed to load leads
              </td>
            </tr>
          )}
          {!isLoading && !isError && rows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-neutral-500"
              >
                No leads found
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            rows.map((r: Row) => (
              <tr
                key={r.id}
                className="h-16 border-b border-neutral-200 last:border-0 hover:bg-neutral-50/80"
              >
                <td className="px-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-neutral-100 grid place-items-center text-neutral-500">
                      <User2 className="h-5 w-5" />
                    </div>
                    <Link href={`/leads/${r.id}`} className="text-[#2563EB]">
                      {r.name}
                    </Link>
                  </div>
                </td>
                <td className="px-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1  text-[12px] ${badge(
                      r.interest
                    )}`}
                  >
                    {badgeIcon(r.interest)}
                    {r.interest}
                  </span>
                </td>
                <td className="px-2 text-neutral-800">{r.assigned}</td>
                <td className="px-2 ">
                  <span className="text-neutral-800">{r.lastInteraction}</span>
                </td>
                <td className="px-2">
                  <span className="inline-flex items-center px-3 py-1 text-[12px] bg-[#FFECCD] text-[#F59E0B]">
                    {r.followUp}
                  </span>
                </td>
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="WhatsApp"
                      className="h-8 w-8 grid place-items-center rounded-full text-green-600 hover:bg-green-50 cursor-pointer"
                    >
                      <Image
                        src="/whatsapp.svg"
                        alt="WhatsApp"
                        width={30}
                        height={30}
                      />
                    </button>
                    <button
                      aria-label="Remind"
                      className="h-8 w-8 grid place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                    >
                      <Image
                        src="/right-arrow.svg"
                        alt="Right Arrow"
                        width={24}
                        height={25}
                      />
                    </button>
                    <button
                      aria-label="View"
                      className="h-8 w-8 grid place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                    >
                      <Image src="/box.svg" alt="Box" width={27} height={28} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-3 flex flex-wrap justify-end items-center gap-3 text-[13px]">
        <div className="text-neutral-600">
          {(() => {
            const start = (currentPage - 1) * 10 + 1;
            const end = Math.min(currentPage * 10, total);
            return `Showing ${start} to ${end} of ${total} entries`;
          })()}
        </div>

        <button
          className="h-8 w-8 grid place-items-center border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          {"<"}
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              className="h-8 px-3 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer"
              onClick={() => goToPage(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-1 text-neutral-500">.....</span>
            )}
          </>
        )}
        {pageNumbers.map((p) => (
          <button
            key={p}
            className={`h-8 px-3 border rounded-md cursor-pointer ${
              p === currentPage
                ? "bg-green-500 text-white border-green-500"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
            onClick={() => goToPage(p)}
          >
            {p}
          </button>
        ))}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1 text-neutral-500">.....</span>
            )}
            <button
              className="h-8 px-3 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="h-8 w-8 grid place-items-center border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
