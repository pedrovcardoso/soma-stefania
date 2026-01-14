'use client';

import { useState, useEffect, useMemo } from 'react';
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
  MdArchive,
  MdTableChart,
  MdSlideshow,
  MdPictureAsPdf,
  MdInsertDriveFile,
  MdSearch,
} from 'react-icons/md';

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();

  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webmp'].includes(ext)) {
    return <MdImage className="text-green-500" />;
  }

  if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(ext)) {
    return <MdAudiotrack className="text-pink-500" />;
  }

  if (['mp4', 'webm', 'mov', 'avi', 'ogg'].includes(ext)) {
    return <MdVideocam className="text-purple-500" />;
  }

  if (['js', 'ts', 'json', 'xml', 'html', 'css', 'md', 'log', 'yaml'].includes(ext)) {
    return <MdCode className="text-gray-500" />;
  }

  if (['pdf'].includes(ext)) {
    return <MdPictureAsPdf className="text-red-500" />;
  }

  if (['docx', 'odt', 'txt'].includes(ext)) {
    return <MdDescription className="text-blue-500" />;
  }

  if (['xlsx', 'csv'].includes(ext)) {
    return <MdTableChart className="text-emerald-500" />;
  }

  if (['pptx'].includes(ext)) {
    return <MdSlideshow className="text-orange-500" />;
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <MdArchive className="text-amber-600" />;
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

function TreeNode({ node, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  if (node.isDir) {
    return (
      <div className="ml-4">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
        >
          {open ? <MdExpandMore className="text-slate-400" /> : <MdChevronRight className="text-slate-400" />}
          {open ? (
            <MdFolderOpen className="text-amber-500" />
          ) : (
            <MdFolder className="text-amber-500" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>

        {open &&
          Object.values(node.children).map((child) => (
            <TreeNode key={child.name} node={child} defaultOpen={defaultOpen} />
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
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadZip = async () => {
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);

        const loadedEntries = [];
        zip.forEach((_, entry) => {
          loadedEntries.push({
            name: entry.name,
            isDir: entry.dir,
            zipEntry: entry,
          });
        });

        setEntries(loadedEntries);
      } catch (error) {
        console.error("Error loading zip:", error);
      } finally {
        setLoading(false);
      }
    };

    loadZip();
  }, [url]);

  const tree = useMemo(() => {
    const filtered = searchTerm
      ? entries.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : entries;
    return buildTree(filtered);
  }, [entries, searchTerm]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-100">
        <ImSpinner8 className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 overflow-hidden font-sans select-none">
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1 border border-slate-200">
          <MdSearch className="text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Pesquisar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 bg-transparent text-sm text-slate-700 outline-none focus:ring-0 border-0 p-1"
          />
        </div>
        <div className="hidden sm:block text-xs font-semibold text-slate-500 truncate max-w-[300px]">
          {name || 'arquivo.zip'}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 min-h-full">
          {Object.values(tree).length > 0 ? (
            Object.values(tree).map((node) => (
              <TreeNode
                key={node.name}
                node={node}
                defaultOpen={!!searchTerm}
              />
            ))
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-slate-400 gap-2">
              <MdSearch size={48} className="opacity-10" />
              <p className="text-sm">Nenhum arquivo encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
