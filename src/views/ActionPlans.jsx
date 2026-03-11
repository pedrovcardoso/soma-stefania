export default function ActionPlansPage({ data }) {
  let url = "/planos_acao/pages/planos/index.html";
  if (data?.url) {
    url = data.url;
  } else if (data?.isNew) {
    url = "/planos_acao/pages/planos/index.html?create=true";
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={url}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
}