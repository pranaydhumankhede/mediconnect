export default function Spinner({ size = 20 }) {
  return (
    <div
      style={{ width: size, height: size, borderTopColor: "#2563eb" }}
      className="rounded-full border-2 border-blue-200 animate-spin"
    />
  );
}
