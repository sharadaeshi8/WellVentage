export default function LeadNotes() {
  const notes = [
    { date: "30 July 2025", content: "Called the customer again." },
    { date: "12 July 2025", content: "Customer walked in, offered 10% discount." },
    { date: "12 July 2025", content: "Lead created." },
  ];
  return (
    <div className="space-y-3">
      <button className="h-10 px-4 bg-green-500 text-white rounded">+ Add note</button>
      {notes.map((n, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="w-40 h-10 border rounded flex items-center justify-center">{n.date}</span>
          <input className="flex-1 h-10 px-3 border rounded" defaultValue={n.content} />
        </div>
      ))}
      <div className="flex items-center justify-center pt-2">
        <button className="h-10 px-8 bg-green-500 text-white rounded">Update</button>
      </div>
    </div>
  );
}
