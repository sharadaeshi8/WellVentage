export default function LeadForm() {
  return (
    <form className="grid grid-cols-2 gap-4">
      <input className="h-10 px-3 border rounded" placeholder="First Name*" />
      <input className="h-10 px-3 border rounded" placeholder="Last Name*" />
      <input className="h-10 px-3 border rounded" placeholder="Phone" />
      <input className="h-10 px-3 border rounded" placeholder="Email" />
      <select className="h-10 px-2 border rounded"><option>Gender</option></select>
      <input className="h-10 px-3 border rounded" placeholder="Date of Birth" />
      <div className="col-span-2 flex items-center justify-center">
        <button className="h-10 px-8 bg-green-500 text-white rounded">Update</button>
      </div>
    </form>
  );
}
