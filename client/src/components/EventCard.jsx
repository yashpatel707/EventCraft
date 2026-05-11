export default function EventCard({ type, img, select }) {
  return (
    <div className="shadow p-3 cursor-pointer" onClick={() => select(type)}>
      <img src={img} className="h-40 w-full object-cover" />
      <h2 className="text-xl">{type}</h2>
    </div>
  );
}
