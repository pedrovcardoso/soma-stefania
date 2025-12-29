'use client';

import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdFolder,
  MdFolderOpen,
  MdChevronRight,
  MdExpandMore,
  MdDownload,
  MdImage,
  MdAudiotrack,
  MdVideocam,
  MdDescription,
  MdCode,
  MdInsertDriveFile,
} from 'react-icons/md';

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();

  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
    return <MdImage className="text-pink-500" />;
  }

  if (['mp3', 'wav', 'ogg'].includes(ext)) {
    return <MdAudiotrack className="text-purple-500" />;
  }

  if (['mp4', 'webm', 'mov'].includes(ext)) {
    return <MdVideocam className="text-indigo-500" />;
  }

  if (['js', 'ts', 'json', 'xml', 'html', 'css'].includes(ext)) {
    return <MdCode className="text-emerald-500" />;
  }

  if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
    return <MdDescription className="text-blue-500" />;
  }

  return <MdInsertDriveFile className="text-slate-400" />;
}

function buildTree(entries) {
  const root = {};

  entries.forEach(({ name, isDir, zipEntry }) => {
    const parts = name.split('/').filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          isDir: index < parts.length - 1 || isDir,
          children: {},
          zipEntry: null,
        };
      }

      if (index === parts.length - 1) {
        current[part].zipEntry = zipEntry;
      }

      current = current[part].children;
    });
  });

  return root;
}

async function downloadZipEntry(zipEntry) {
  const blob = await zipEntry.async('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipEntry.name.split('/').pop();
  a.click();
  URL.revokeObjectURL(url);
}

function TreeNode({ node }) {
  const [open, setOpen] = useState(false);

  if (node.isDir) {
    return (
      <div className="ml-4">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
        >
          {open ? <MdExpandMore /> : <MdChevronRight />}
          {open ? (
            <MdFolderOpen className="text-amber-500" />
          ) : (
            <MdFolder className="text-amber-500" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>

        {open &&
          Object.values(node.children).map((child) => (
            <TreeNode key={child.name} node={child} />
          ))}
      </div>
    );
  }

  return (
    <div className="ml-10 flex items-center justify-between hover:bg-slate-50 p-1 rounded">
      <div className="flex items-center gap-2">
        {getFileIcon(node.name)}
        <span className="text-sm truncate">{node.name}</span>
      </div>

      <button
        onClick={() => downloadZipEntry(node.zipEntry)}
        className="p-1 text-slate-500 hover:text-blue-600"
      >
        <MdDownload />
      </button>
    </div>
  );
}

export default function ZipViewer({ url, name }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadZip = async () => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const entries = [];
      zip.forEach((_, entry) => {
        entries.push({
          name: entry.name,
          isDir: entry.dir,
          zipEntry: entry,
        });
      });

      setTree(buildTree(entries));
      setLoading(false);
    };

    loadZip();
  }, [url]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <ImSpinner8 className="animate-spin text-2xl text-slate-500" />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto h-full">
      <h3 className="text-sm font-semibold mb-3">
        Conteúdo de {name || 'arquivo.zip'}
      </h3>

      {Object.values(tree).map((node) => (
        <TreeNode key={node.name} node={node} />
      ))}
    </div>
  );
}
