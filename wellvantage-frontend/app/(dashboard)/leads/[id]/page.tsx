import LeadEditForm from "@/components/leads/LeadEditForm";

export default async function LeadDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="p-8 mt-3 lg:mt-0  space-y-6">
      <h1 className="text-2xl font-semibold">Lead Management</h1>
      <LeadEditForm id={id} />
    </div>
  );
}
