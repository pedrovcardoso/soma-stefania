'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdWarning,
  MdZoomIn,
  MdZoomOut,
  MdFitScreen
} from 'react-icons/md';

const getFileExtension = (url) => {
  if (!url) return '';
  return url.split('?')[0].split('.').pop().toLowerCase();
};

const odtStyleMap = {
  'fo:font-weight': 'fontWeight',
  'fo:font-style': 'fontStyle',
  'fo:font-size': 'fontSize',
  'fo:color': 'color',
  'fo:text-align': 'textAlign',
  'style:text-underline-style': 'textDecoration',
};

const odtUnderlineMap = { 'solid': 'underline' };

const handleOdt = async (arrayBuffer) => {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const stylesXmlString = await zip.file("styles.xml").async("string");
  const contentXmlString = await zip.file("content.xml").async("string");

  const parser = new DOMParser();
  const stylesDoc = parser.parseFromString(stylesXmlString, "application/xml");
  const contentDoc = parser.parseFromString(contentXmlString, "application/xml");

  const styles = {};

  const processStyles = (styleNodes) => {
    styleNodes.forEach(styleNode => {
      const name = styleNode.getAttribute('style:name');
      if (!name) return;
      styles[name] = {};
      const textProps = styleNode.querySelector('text-properties');
      if (textProps) {
        for (const attr of textProps.attributes) {
          if (odtStyleMap[attr.name]) {
            let value = attr.value;
            if (attr.name === 'style:text-underline-style' && odtUnderlineMap[value]) {
              value = odtUnderlineMap[value];
            }
            styles[name][odtStyleMap[attr.name]] = value;
          }
        }
      }
      const paragraphProps = styleNode.querySelector('paragraph-properties');
      if (paragraphProps) {
        for (const attr of paragraphProps.attributes) {
          if (odtStyleMap[attr.name]) {
            styles[name][odtStyleMap[attr.name]] = attr.value;
          }
        }
      }
    });
  };

  processStyles(stylesDoc.querySelectorAll('style'));
  processStyles(contentDoc.querySelectorAll('automatic-styles > style'));

  const imageMap = {};
  const imageNodes = contentDoc.querySelectorAll('image');

  for (const imageNode of imageNodes) {
    const href = imageNode.getAttribute('xlink:href');
    if (href && zip.file(href)) {
      const blob = await zip.file(href).async('blob');
      imageMap[href] = URL.createObjectURL(blob);
    }
  }

  const transformNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.replace(/\s{2,}/g, ' ');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    let childrenHtml = Array.from(node.childNodes).map(transformNode).join('');
    let styleString = '';

    const styleName = node.getAttribute('text:style-name');
    if (styleName && styles[styleName]) {
      styleString = Object.entries(styles[styleName])
        .map(([key, value]) => `${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}:${value}`)
        .join(';');
    }

    const tagName = node.tagName.toLowerCase();
    switch (tagName) {
      case 'text:p': return `<p style="${styleString}">${childrenHtml || '&nbsp;'}</p>`;
      case 'text:h':
        const level = node.getAttribute('text:outline-level') || '1';
        return `<h${level} style="${styleString}">${childrenHtml}</h${level}>`;
      case 'text:span': return `<span style="${styleString}">${childrenHtml}</span>`;
      case 'text:a':
        const href = node.getAttribute('xlink:href');
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="${styleString}">${childrenHtml}</a>`;
      case 'draw:image':
        const imgHref = node.getAttribute('xlink:href');
        return imageMap[imgHref] ? `<img src="${imageMap[imgHref]}" style="max-width:100%; height:auto;" />` : '';
      case 'text:list': return `<ul style="${styleString}">${childrenHtml}</ul>`;
      case 'text:list-item': return `<li>${childrenHtml}</li>`;
      case 'table:table': return `<table>${childrenHtml}</table>`;
      case 'table:table-row': return `<tr>${childrenHtml}</tr>`;
      case 'table:table-cell': return `<td>${childrenHtml}</td>`;
      case 'text:tab': return '&emsp;';
      case 'text:s': return '&nbsp;';
      default: return childrenHtml;
    }
  };

  const officeBody = contentDoc.querySelector('body > text');
  const html = Array.from(officeBody.childNodes).map(transformNode).join('');
  return { value: html };
};

export default function DocumentViewer({ url, onLoad }) {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [contentHeight, setContentHeight] = useState(1000);

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const BASE_WIDTH = 816;
  const VIEWER_PADDING = 40;

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [htmlContent]);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError("Nenhuma URL de arquivo fornecida.");
      return;
    };

    setLoading(true);
    setError(null);
    setHtmlContent('');

    const convertFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao baixar arquivo");
        const arrayBuffer = await response.arrayBuffer();
        const extension = getFileExtension(url);
        let result;

        if (extension === 'docx') {
          result = await mammoth.convertToHtml({ arrayBuffer });
        } else if (extension === 'odt') {
          result = await handleOdt(arrayBuffer);
        } else {
          throw new Error(`Formato de arquivo .${extension} não suportado.`);
        }

        if (!result.value) throw new Error("Documento vazio ou ilegível");
        setHtmlContent(result.value);
        if (onLoad) onLoad();
        setTimeout(() => fitToWidth(), 100);
      } catch (err) {
        console.error(err);
        setError(err.message || "Falha ao processar documento.");
      } finally {
        setLoading(false);
      }
    };
    convertFile();
  }, [url, onLoad]);

  const fitToWidth = () => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const safeWidth = clientWidth - (VIEWER_PADDING * 2);
      if (safeWidth > 0) {
        updateZoom(safeWidth / BASE_WIDTH);
      }
    }
  };

  const updateZoom = (val) => {
    setZoom(Math.max(0.3, Math.min(val, 3)));
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      updateZoom(zoom - e.deltaY * 0.001);
    }
  };

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center gap-4 text-slate-500">
      <ImSpinner8 className="animate-spin text-3xl text-blue-600" />
    </div>
  );

  if (error) {
    // Throw to let ViewerErrorBoundary show UnsupportedViewer
    throw new Error(error);
  }

  const docStyles = `
    .document-content { font-family: 'Calibri', sans-serif; line-height: 1.6; color: #333; }
    .document-content p { margin-bottom: 1em; text-align: justify; }
    .document-content h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
    .document-content h2 { font-size: 1.5em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
    .document-content h3 { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
    .document-content ul, .document-content ol { margin-left: 2em; margin-bottom: 1em; }
    .document-content ul { list-style-type: disc; }
    .document-content ol { list-style-type: decimal; }
    .document-content table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
    .document-content td, .document-content th { border: 1px solid #ddd; padding: 8px; }
    .document-content img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
    .document-content a { color: #2563eb; text-decoration: underline; }
  `;

  const wrapperStyle = {
    width: BASE_WIDTH * zoom,
    height: contentHeight * zoom,
    position: 'relative',
    transition: 'width 0.1s ease-out, height 0.1s ease-out'
  };

  const contentStyle = {
    width: BASE_WIDTH,
    minHeight: BASE_WIDTH * 1.41,
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="flex h-full w-full bg-slate-100 overflow-hidden font-sans select-none relative">
      <style>{docStyles}</style>

      <div className="flex-1 relative bg-slate-200 flex flex-col h-full overflow-hidden min-w-0">
        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-end shadow-sm z-20 shrink-0">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200">
              <button onClick={() => updateZoom(zoom - 0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomOut size={18} /></button>
              <span className="text-xs font-mono w-10 text-center text-slate-700">{Math.round(zoom * 100)}%</span>
              <button onClick={() => updateZoom(zoom + 0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomIn size={18} /></button>
              <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
              <button onClick={fitToWidth} title="Ajustar" className="p-1 hover:bg-slate-200 text-slate-600"><MdFitScreen size={18} /></button>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-500/10 relative scroll-smooth"
          onWheel={handleWheel}
        >
          <div className="min-w-full min-h-full flex justify-center py-10 items-start">

            <div style={wrapperStyle}>
              <div
                ref={contentRef}
                className="bg-white shadow-lg p-16 document-content absolute top-0 left-0 origin-top-left"
                style={contentStyle}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}