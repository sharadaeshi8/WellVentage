import LeadCreateForm from "@/components/leads/LeadCreateForm";

export default function NewLeadPage() {
  return (
    <div className="p-8 mt-3 lg:mt-0 space-y-6 h-full overflow-auto w-full">
      <h1 className="text-2xl font-semibold">Lead Management</h1>
      <LeadCreateForm />
    </div>
  );
}
