
import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/lib/services";

export function useLeads(filters: any) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadService.getLeads(filters),
  });
}
