export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}

export default function Page({ params }) {
  return (
    <div>
      <h1>Página SEI {params.id}</h1>
    </div>
  );
}
