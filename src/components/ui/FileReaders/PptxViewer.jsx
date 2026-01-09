'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdWarning,
  MdNavigateNext,
  MdNavigateBefore,
  MdZoomIn,
  MdZoomOut,
  MdFitScreen,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';

const EMU_TO_INCH = 914400;
const DPI = 96;
const EMU_TO_PX = (emu) => (parseInt(emu) / EMU_TO_INCH) * DPI;

const DEFAULT_THEME = {
  dk1: '#000000', lt1: '#FFFFFF', dk2: '#1f497d', lt2: '#EEECE1',
  accent1: '#4f81bd', accent2: '#c0504d', accent3: '#9bbb59',
  accent4: '#8064a2', accent5: '#4bacc6', accent6: '#f79646'
};

const SlideRenderer = ({ slide, width, height, scale, isThumbnail = false }) => {
  return (
    <div
      className="bg-white relative shadow-sm overflow-hidden shrink-0 select-none"
      style={{
        width: width,
        height: height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {slide.elements.map((el, i) => {
        const boxStyle = {
          position: 'absolute',
          left: el.x,
          top: el.y,
          width: el.w,
          height: el.h,
          backgroundColor: el.style?.backgroundColor || 'transparent',
          border: el.style?.border || 'none',
          transform: el.rotation ? `rotate(${el.rotation}deg)` : 'none',
          opacity: isThumbnail && el.type === 'text' ? 0.7 : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: el.verticalAlign === 'b' ? 'flex-end' : el.verticalAlign === 'ctr' ? 'center' : 'flex-start',
          padding: el.padding || '4px',
          overflow: 'hidden',
          pointerEvents: 'none'
        };

        if (el.type === 'image') {
          return (
            <img
              key={i}
              src={el.url}
              alt=""
              style={{ ...boxStyle, objectFit: 'fill', padding: 0 }}
            />
          );
        }

        if (el.type === 'shape' || el.type === 'text') {
          return (
            <div key={i} style={boxStyle}>
              {el.paragraphs.map((p, pi) => (
                <div key={pi} style={{
                  display: 'flex',
                  textAlign: p.align,
                  marginLeft: `${p.marginLeft}px`,
                  marginBottom: '2px',
                  minHeight: '1em',
                }}>
                  {p.hasBullet && (
                    <span style={{
                      width: '1.2em',
                      flexShrink: 0,
                      textAlign: 'center',
                      color: p.runs[0]?.style?.color || '#000',
                      fontSize: p.runs[0]?.style?.fontSize || '16px'
                    }}>•</span>
                  )}
                  <div style={{ flexGrow: 1, wordWrap: 'break-word' }}>
                    {p.runs.map((r, ri) => (
                      <span key={ri} style={{
                        fontSize: r.style.fontSize,
                        fontFamily: r.style.fontFamily || 'Arial, sans-serif',
                        color: r.style.color,
                        fontWeight: r.style.fontWeight,
                        fontStyle: r.style.fontStyle,
                        textDecoration: r.style.textDecoration,
                        lineHeight: 1.2,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {r.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default function PptxViewer({ url }) {
  const [slides, setSlides] = useState([]);
  const [slideSize, setSlideSize] = useState({ width: 960, height: 540 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [zoomInput, setZoomInput] = useState("100");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const SIDEBAR_WIDTH = 250;
  const THUMBNAIL_WIDTH = 200;

  const sidebarRef = useRef(null);
  const viewContainerRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    const processPptx = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Falha no download`);
        const buffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const parser = new DOMParser();

        let themeColors = { ...DEFAULT_THEME };
        const themeFile = Object.keys(zip.files).find(f => f.includes("theme/theme"));
        if (themeFile) {
          const tXml = parser.parseFromString(await zip.file(themeFile).async("string"), "application/xml");
          const clrScheme = tXml.getElementsByTagName("a:clrScheme")[0];
          const resolveThemeColor = (nodeName) => {
            const node = clrScheme?.getElementsByTagName("a:" + nodeName)[0];
            if (!node) return null;
            const srgb = node.getElementsByTagName("a:srgbClr")[0];
            if (srgb) return "#" + srgb.getAttribute("val");
            const sysClr = node.getElementsByTagName("a:sysClr")[0];
            if (sysClr) return "#" + sysClr.getAttribute("lastClr");
            return null;
          };
          if (clrScheme) {
            Object.keys(themeColors).forEach(k => { const c = resolveThemeColor(k); if (c) themeColors[k] = c; });
          }
        }

        const resolveColor = (node) => {
          if (!node) return null;
          const srgb = node.getElementsByTagName("a:srgbClr")[0];
          if (srgb) return "#" + srgb.getAttribute("val");
          const scheme = node.getElementsByTagName("a:schemeClr")[0];
          return scheme ? (themeColors[scheme.getAttribute("val")] || "#000000") : null;
        };

        let pW = 9144000, pH = 6858000;
        const presXml = await zip.file("ppt/presentation.xml")?.async("string");
        if (presXml) {
          const px = parser.parseFromString(presXml, "application/xml");
          const sldSz = px.getElementsByTagName("p:sldSz")[0];
          if (sldSz) { pW = parseInt(sldSz.getAttribute("cx")); pH = parseInt(sldSz.getAttribute("cy")); }
        }

        const finalW = EMU_TO_PX(pW);
        const finalH = EMU_TO_PX(pH);
        setSlideSize({ width: finalW, height: finalH });

        const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml/))
          .sort((a, b) => parseInt(a.match(/slide(\d+)\.xml/)[1]) - parseInt(b.match(/slide(\d+)\.xml/)[1]));

        const parsedSlides = [];
        for (const path of slideFiles) {
          const xmlText = await zip.file(path).async("string");
          const xml = parser.parseFromString(xmlText, "application/xml");

          const relsPath = path.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
          const relsData = await zip.file(relsPath)?.async("string");
          const imgMap = {};
          if (relsData) {
            const rXml = parser.parseFromString(relsData, "application/xml");
            const rels = rXml.getElementsByTagName("Relationship");
            for (let i = 0; i < rels.length; i++) {
              const type = rels[i].getAttribute("Type");
              if (type && type.includes("image")) {
                let target = rels[i].getAttribute("Target");
                let cleanTarget = target.replace("../", "ppt/").replace("ppt/media", "ppt/media");
                if (!cleanTarget.startsWith("ppt/")) {
                  cleanTarget = "ppt/" + target.replace("../", "");
                  if (target.startsWith("media/")) cleanTarget = "ppt/" + target;
                }
                const imgBlob = await zip.file(cleanTarget)?.async("blob");
                if (imgBlob) imgMap[rels[i].getAttribute("Id")] = URL.createObjectURL(imgBlob);
              }
            }
          }

          const elements = [];
          const getPos = (xfrm) => {
            if (!xfrm) return null;
            const off = xfrm.getElementsByTagName("a:off")[0];
            const ext = xfrm.getElementsByTagName("a:ext")[0];
            const rot = xfrm.getAttribute("rot");
            if (!off || !ext) return null;
            return {
              x: EMU_TO_PX(off.getAttribute("x")),
              y: EMU_TO_PX(off.getAttribute("y")),
              w: EMU_TO_PX(ext.getAttribute("cx")),
              h: EMU_TO_PX(ext.getAttribute("cy")),
              rotation: rot ? parseInt(rot) / 60000 : 0
            };
          };

          const pics = xml.getElementsByTagName("p:pic");
          for (let i = 0; i < pics.length; i++) {
            const pos = getPos(pics[i].getElementsByTagName("p:spPr")[0]?.getElementsByTagName("a:xfrm")[0]);
            const embed = pics[i].getElementsByTagName("a:blip")[0]?.getAttribute("r:embed");
            if (pos && embed && imgMap[embed]) elements.push({ type: 'image', url: imgMap[embed], ...pos });
          }

          const sps = xml.getElementsByTagName("p:sp");
          for (let i = 0; i < sps.length; i++) {
            const spPr = sps[i].getElementsByTagName("p:spPr")[0];
            const pos = getPos(spPr?.getElementsByTagName("a:xfrm")[0]);
            if (!pos) continue;

            const style = {};
            const fill = spPr?.getElementsByTagName("a:solidFill")[0];
            if (fill) { const c = resolveColor(fill); if (c) style.backgroundColor = c; }
            const ln = spPr?.getElementsByTagName("a:ln")[0];
            if (ln) {
              const lc = resolveColor(ln.getElementsByTagName("a:solidFill")[0]);
              const lw = ln.getAttribute("w");
              if (lc) style.border = `${Math.max(1, lw ? EMU_TO_PX(lw) : 1)}px solid ${lc}`;
            }

            const txBody = sps[i].getElementsByTagName("p:txBody")[0];
            let paragraphs = [];
            let verticalAlign = 't';
            let padding = '4px';

            if (txBody) {
              const bodyPr = txBody.getElementsByTagName("a:bodyPr")[0];
              if (bodyPr) {
                const anchor = bodyPr.getAttribute("anchor");
                if (anchor === 'ctr') verticalAlign = 'ctr'; else if (anchor === 'b') verticalAlign = 'b';
                const tIns = bodyPr.getAttribute("tIns"), lIns = bodyPr.getAttribute("lIns");
                if (tIns || lIns) padding = `${tIns ? EMU_TO_PX(tIns) : 0}px ${lIns ? EMU_TO_PX(lIns) : 0}px`;
              }

              const ps = txBody.getElementsByTagName("a:p");
              for (let p = 0; p < ps.length; p++) {
                const pPr = ps[p].getElementsByTagName("a:pPr")[0];
                let align = 'left';
                const algn = pPr?.getAttribute("algn");
                if (algn === 'ctr') align = 'center'; else if (algn === 'r') align = 'right'; else if (algn === 'j') align = 'justify';

                const lvl = parseInt(pPr?.getAttribute("lvl") || "0");
                const hasBullet = pPr && (pPr.getElementsByTagName("a:buFont").length > 0 || pPr.getElementsByTagName("a:buChar").length > 0 || pPr.getElementsByTagName("a:buAutoNum").length > 0);

                const runs = [];
                const rs = ps[p].getElementsByTagName("a:r");
                for (let r = 0; r < rs.length; r++) {
                  const t = rs[r].getElementsByTagName("a:t")[0]?.textContent;
                  if (t) {
                    const rPr = rs[r].getElementsByTagName("a:rPr")[0];
                    const rStyle = { color: "#000000", fontSize: "16px" };
                    if (rPr) {
                      const sz = rPr.getAttribute("sz");
                      if (sz) rStyle.fontSize = Math.round((parseInt(sz) / 100) * (96 / 72)) + "px";
                      if (rPr.getAttribute("b") === "1") rStyle.fontWeight = "bold";
                      if (rPr.getAttribute("i") === "1") rStyle.fontStyle = "italic";
                      if (rPr.getAttribute("u") === "sng") rStyle.textDecoration = "underline";
                      const rf = rPr.getElementsByTagName("a:solidFill")[0];
                      if (rf) { const rc = resolveColor(rf); if (rc) rStyle.color = rc; }
                      const lat = rPr.getElementsByTagName("a:latin")[0];
                      if (lat) rStyle.fontFamily = `'${lat.getAttribute("typeface")}', sans-serif`;
                    }
                    runs.push({ text: t, style: rStyle });
                  }
                }
                if (runs.length > 0 || hasBullet) paragraphs.push({ align, marginLeft: lvl * 24, hasBullet, runs });
              }
            }
            elements.push({ type: paragraphs.length > 0 ? 'text' : 'shape', ...pos, style, verticalAlign, padding, paragraphs });
          }
          parsedSlides.push({ id: path, elements });
        }

        setSlides(parsedSlides);
        setTimeout(() => fitToScreen(finalW, finalH), 100);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    processPptx();
  }, [url]);

  const fitToScreen = useCallback((w = slideSize.width, h = slideSize.height) => {
    if (viewContainerRef.current) {
      const { clientWidth, clientHeight } = viewContainerRef.current;
      const padding = 60;
      const scaleX = (clientWidth - padding) / w;
      const scaleY = (clientHeight - padding) / h;
      const fitScale = Math.min(scaleX, scaleY, 1.5);
      const finalScale = Math.max(fitScale, 0.1);

      updateZoom(finalScale);
      setPan({ x: 0, y: 0 });
    }
  }, [slideSize]);

  const updateZoom = (val) => {
    setZoom(val);
    setZoomInput(Math.round(val * 100).toString());
  };

  const handleZoomInputChange = (e) => setZoomInput(e.target.value);

  const handleZoomInputBlur = () => {
    let val = parseInt(zoomInput);
    if (!isNaN(val)) {
      val = Math.max(10, Math.min(val, 500));
      updateZoom(val / 100);
    } else {
      setZoomInput(Math.round(zoom * 100).toString());
    }
  };

  const handleZoomInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleZoomInputBlur();
      e.target.blur();
    }
  };

  useEffect(() => {
    if (sidebarRef.current && isSidebarOpen) {
      const activeThumb = document.getElementById(`ppt-thumb-${currentSlideIndex}`);
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSlideIndex, isSidebarOpen]);

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newZoom = Math.min(Math.max(zoom - e.deltaY * zoomSensitivity, 0.1), 5);
      updateZoom(newZoom);
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (loading) return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-slate-500">
      <ImSpinner8 className="animate-spin text-3xl text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
      <div className="text-center text-red-600">
        <MdWarning size={40} className="mx-auto mb-2" />
        <h3 className="font-bold">Erro ao abrir</h3>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  const thumbScale = THUMBNAIL_WIDTH / slideSize.width;
  const thumbHeight = slideSize.height * thumbScale;

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="flex h-full w-full bg-slate-100 overflow-hidden font-sans select-none relative">

      <div
        ref={sidebarRef}
        style={{ width: isSidebarOpen ? SIDEBAR_WIDTH : 0 }}
        className="flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-[width] duration-300 ease-in-out overflow-hidden relative"
      >
        <div className="p-3 border-b border-slate-100 flex items-center justify-between whitespace-nowrap overflow-hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slides</span>
          <span className="text-xs text-slate-400">{slides.length} total</span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 items-center">
          {slides.map((slide, idx) => (
            <div
              id={`ppt-thumb-${idx}`}
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`cursor-pointer transition-all rounded p-2 flex flex-col gap-1 items-center flex-shrink-0
                ${idx === currentSlideIndex ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-slate-50'}
              `}
            >
              <div
                className="relative border border-slate-200 shadow-sm bg-white"
                style={{
                  width: THUMBNAIL_WIDTH,
                  height: thumbHeight,
                  overflow: 'hidden'
                }}
              >
                <SlideRenderer
                  slide={slide}
                  width={slideSize.width}
                  height={slideSize.height}
                  scale={thumbScale}
                  isThumbnail={true}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col z-20 h-full justify-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-[-12px] bg-white border border-slate-300 shadow-md rounded-full p-1 hover:bg-slate-50 text-slate-600 z-40 w-6 h-6 flex items-center justify-center"
          title={isSidebarOpen ? "Ocultar slides" : "Mostrar slides"}
        >
          {isSidebarOpen ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
        </button>
      </div>

      <div className="flex-1 relative bg-slate-200 flex flex-col h-full overflow-hidden min-w-0">

        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-20 shrink-0">
          <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
            Slide {currentSlideIndex + 1} <span className="text-slate-400 font-normal">/ {slides.length}</span>
          </span>

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 mr-4 border border-slate-200">
              <button onClick={() => updateZoom(Math.max(zoom - 0.1, 0.1))} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdZoomOut size={18} />
              </button>

              <div className="relative flex items-center justify-center w-14">
                <input
                  type="text"
                  value={zoomInput}
                  onChange={handleZoomInputChange}
                  onBlur={handleZoomInputBlur}
                  onKeyDown={handleZoomInputKeyDown}
                  className="w-full bg-transparent text-center text-xs font-mono font-medium text-slate-700 outline-none focus:text-blue-600"
                />
                <span className="absolute right-0 text-[10px] text-slate-400 pointer-events-none top-1/2 -translate-y-1/2">%</span>
              </div>

              <button onClick={() => updateZoom(Math.min(zoom + 0.1, 5))} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdZoomIn size={18} />
              </button>

              <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>

              <button onClick={() => fitToScreen()} title="Ajustar à tela" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                <MdFitScreen size={18} />
              </button>
            </div>

            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-700">
              <MdNavigateBefore size={24} />
            </button>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-700">
              <MdNavigateNext size={24} />
            </button>
          </div>
        </div>

        <div
          ref={viewContainerRef}
          className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing bg-slate-300/50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              className="shadow-2xl ring-1 ring-black/5 pointer-events-auto bg-white"
            >
              {currentSlide && (
                <SlideRenderer
                  slide={currentSlide}
                  width={slideSize.width}
                  height={slideSize.height}
                  scale={1}
                />
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}