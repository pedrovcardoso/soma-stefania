export default function ActionPlansPage() {
  return (
    <div className="w-full h-full">
      <iframe
        src="/planos_acao/pages/planos/index.html"
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
}