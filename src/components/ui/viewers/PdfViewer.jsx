'use client';

export default function PdfViewer({ url }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500">Nenhum arquivo PDF para exibir.</p>
      </div>
    );
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