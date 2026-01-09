'use client';

import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { ImSpinner8 } from 'react-icons/im';
import { MdWarning, MdZoomIn, MdZoomOut, MdFitScreen, MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const INDEXED_COLORS = { 0:"000000",1:"FFFFFF",2:"FF0000",3:"00FF00",4:"0000FF",5:"FFFF00",6:"FF00FF",7:"00FFFF",8:"000000",9:"FFFFFF",10:"FF0000",11:"00FF00",12:"0000FF",13:"FFFF00",14:"FF00FF",15:"00FFFF",16:"800000",17:"008000",18:"000080",19:"808000",20:"800080",21:"008080",22:"C0C0C0",23:"808080",24:"9999FF",25:"993366",26:"FFFFCC",27:"CCFFFF",28:"660066",29:"FF8080",30:"0066CC",31:"CCCCFF",32:"000080",33:"FF00FF",34:"FFFF00",35:"00FFFF",36:"800080",37:"800000",38:"008080",39:"0000FF",40:"00CCFF",41:"CCFFFF",42:"CCFFCC",43:"FFFF99",44:"99CCFF",45:"FF99CC",46:"CC99FF",47:"FFCC99",48:"3366FF",49:"33CCCC",50:"99CC00",51:"FFCC00",52:"FF9900",53:"FF6600",54:"666699",55:"969696",56:"003366",57:"339966",58:"003300",59:"333300",60:"993300",61:"993366",62:"333399",63:"333333",64:"TRANSPARENT"};
function applyTint(hex, tint) { if(!hex||!tint)return hex;hex=hex.replace('#','');let r=parseInt(hex.substring(0,2),16),g=parseInt(hex.substring(2,4),16),b=parseInt(hex.substring(4,6),16);if(tint>0){r=Math.round(r*(1-tint)+255*tint);g=Math.round(g*(1-tint)+255*tint);b=Math.round(b*(1-tint)+255*tint)}else{r=Math.round(r*(1+tint));g=Math.round(g*(1+tint));b=Math.round(b*(1+tint))}const toHex=(c)=>{const h=Math.min(255,Math.max(0,c)).toString(16);return h.length===1?"0"+h:h};return"#"+toHex(r)+toHex(g)+toHex(b)}
const resolveColorNode=(node,themeColors)=>{if(!node)return null;let hex=null;const rgb=node.getAttribute("rgb");if(rgb){hex=rgb.length===8?"#"+rgb.substring(2):"#"+rgb}else if(node.hasAttribute("theme")){const themeIdx=node.getAttribute("theme");hex=themeColors[themeIdx]}else if(node.hasAttribute("indexed")){const idx=node.getAttribute("indexed");hex=INDEXED_COLORS[idx]?"#"+INDEXED_COLORS[idx]:null}if(hex&&node.hasAttribute("tint")){hex=applyTint(hex,parseFloat(node.getAttribute("tint")))}return hex};

export default function XlsxViewer({ url }) {
  const [data, setData] = useState({ workbook:null, sheetNames:[], currentSheet:null, styles:{}, theme:{}, zip:null });
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    const processXlsx = async () => {
      setLoading(true); setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao baixar planilha");
        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'buffer' });
        const zip = await JSZip.loadAsync(arrayBuffer);
        const parser = new DOMParser();
        const themeMap = {"0":"#FFFFFF","1":"#000000","2":"#EEECE1","3":"#1F497D","4":"#4F81BD","5":"#C0504D","6":"#9BBB59","7":"#8064A2","8":"#4BACC6","9":"#F79646"};
        const themeFile = Object.keys(zip.files).find(f => f.match(/theme\/theme\d+\.xml/));
        if(themeFile){const tXml=parser.parseFromString(await zip.file(themeFile).async("string"),"application/xml");const clrScheme=tXml.getElementsByTagName("a:clrScheme")[0];if(clrScheme){const readClr=(tagName)=>{const el=clrScheme.getElementsByTagName("a:"+tagName)[0];return el?.getElementsByTagName("a:srgbClr")[0]?.getAttribute("val")||el?.getElementsByTagName("a:sysClr")[0]?.getAttribute("lastClr")};const t0=readClr("lt1");if(t0)themeMap["0"]="#"+t0;const t1=readClr("dk1");if(t1)themeMap["1"]="#"+t1;const t2=readClr("lt2");if(t2)themeMap["2"]="#"+t2;const t3=readClr("dk2");if(t3)themeMap["3"]="#"+t3;const t4=readClr("accent1");if(t4)themeMap["4"]="#"+t4;const t5=readClr("accent2");if(t5)themeMap["5"]="#"+t5}}
        const styles = {};
        const stylesFile = zip.file("xl/styles.xml");
        if(stylesFile){const sXml=parser.parseFromString(await stylesFile.async("string"),"application/xml");const fonts=[];const fontNodes=sXml.getElementsByTagName("font");for(let i=0;i<fontNodes.length;i++){const f=fontNodes[i];fonts.push({b:f.getElementsByTagName("b").length>0,color:resolveColorNode(f.getElementsByTagName("color")[0],themeMap)||"#000"})}const fills=[];const fillNodes=sXml.getElementsByTagName("fill");for(let i=0;i<fillNodes.length;i++){const pattern=fillNodes[i].getElementsByTagName("patternFill")[0];let bg=null;if(pattern){const fg=pattern.getElementsByTagName("fgColor")[0];bg=resolveColorNode(fg,themeMap)}fills.push(bg)}const cellXfsContainer=sXml.getElementsByTagName("cellXfs")[0];const xfNodes=cellXfsContainer?cellXfsContainer.getElementsByTagName("xf"):sXml.getElementsByTagName("xf");for(let i=0;i<xfNodes.length;i++){const xf=xfNodes[i];const fId=parseInt(xf.getAttribute("fontId")||0);const fillId=parseInt(xf.getAttribute("fillId")||0);const alignNode=xf.getElementsByTagName("alignment")[0];const horizontal=alignNode?alignNode.getAttribute("horizontal"):null;styles[i]={fontWeight:(fonts[fId]&&fonts[fId].b)?'bold':'normal',color:fonts[fId]?fonts[fId].color:'#000',backgroundColor:fills[fillId]||'transparent',textAlign:horizontal==='center'?'center':horizontal==='right'?'right':'left'}}}
        setData({ workbook:wb, sheetNames:wb.SheetNames, currentSheet:wb.SheetNames[0], styles, theme:themeMap, zip });
      } catch (err) { console.error("Xlsx Error:", err); setError("Erro ao processar planilha."); } finally { setLoading(false); }
    };
    processXlsx();
  }, [url]);

  useEffect(() => {
      if (!data.workbook || !data.currentSheet || !data.zip) return;
      const loadGrid = async () => {
          const ws=data.workbook.Sheets[data.currentSheet];const range=XLSX.utils.decode_range(ws['!ref']||"A1:A1");const sheetIdx=data.workbook.SheetNames.indexOf(data.currentSheet);const sheetPath=`xl/worksheets/sheet${sheetIdx+1}.xml`;const file=data.zip.file(sheetPath);const cellStyleMap={};if(file){const xmlText=await file.async("string");const xml=new DOMParser().parseFromString(xmlText,"application/xml");const rows=xml.getElementsByTagName("row");for(let r=0;r<rows.length;r++){const cols=rows[r].getElementsByTagName("c");for(let c=0;c<cols.length;c++){const ref=cols[c].getAttribute("r");const s=cols[c].getAttribute("s");if(ref&&s)cellStyleMap[ref]=parseInt(s)}}}const newGrid=[];for(let R=range.s.r;R<=range.e.r;++R){const rowData=[];for(let C=range.s.c;C<=range.e.c;++C){const cellRef=XLSX.utils.encode_cell({r:R,c:C});const cellVal=ws[cellRef];const styleId=cellStyleMap[cellRef];rowData.push({value:cellVal?(cellVal.w||cellVal.v):"",style:(styleId!==undefined&&data.styles[styleId])?data.styles[styleId]:{}})}newGrid.push(rowData)}setGridData(newGrid)};
      loadGrid();
  }, [data.currentSheet]);

  useEffect(() => {
    if (!searchTerm) { setMatches([]); return; }
    const newMatches = [];
    gridData.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.value && cell.value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
          newMatches.push({ r, c });
        }
      });
    });
    setMatches(newMatches);
    setCurrentMatchIndex(0);
  }, [searchTerm, gridData]);

  useEffect(() => {
    if (matches.length > 0) {
      const match = matches[currentMatchIndex];
      const cellId = `cell-${match.r}-${match.c}`;
      const cellElement = document.getElementById(cellId);
      cellElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [currentMatchIndex, matches]);

  const goToMatch = (direction) => {
    if (matches.length === 0) return;
    setCurrentMatchIndex(prev => (prev + direction + matches.length) % matches.length);
  };

  const fitToWidth = () => { if (containerRef.current) { const {clientWidth}=containerRef.current;const tableWidth=containerRef.current.querySelector('table')?.offsetWidth||1200;updateZoom(clientWidth/tableWidth)} };
  const updateZoom = (val) => { setZoom(Math.max(0.3, Math.min(val, 3))) };
  const handleWheel = (e) => { if (e.ctrlKey) { e.preventDefault(); updateZoom(zoom - e.deltaY * 0.001); } };

  const getColLetter = (n) => { let s="";while(n>=0){s=String.fromCharCode((n%26)+65)+s;n=Math.floor(n/26)-1}return s };
  const maxCols = gridData.length > 0 ? Math.max(...gridData.map(r=>r.length)) : 0;

  if (loading) return (<div className="flex h-full w-full items-center justify-center gap-4 text-slate-500 bg-slate-200"><ImSpinner8 className="animate-spin text-3xl text-blue-600"/></div>);
  if (error) return (<div className="flex h-full w-full items-center justify-center bg-red-50 p-6"><div className="text-center text-red-600"><MdWarning size={40} className="mx-auto mb-2"/><h3 className="font-bold">Erro</h3><p className="text-sm">{error}</p></div></div>);

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 overflow-hidden font-sans select-none">
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-30 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1 border border-slate-200">
            <MdSearch className="text-slate-400 ml-1" /><input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-48 bg-transparent text-sm text-slate-700 outline-none focus:ring-0 border-0 p-1"/>{matches.length>0&&(<span className="text-xs font-mono text-slate-500 pr-1">{currentMatchIndex+1}/{matches.length}</span>)}<button onClick={()=>goToMatch(-1)} disabled={matches.length===0} className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"><MdChevronLeft size={18}/></button><button onClick={()=>goToMatch(1)} disabled={matches.length===0} className="p-1 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"><MdChevronRight size={18}/></button>
        </div>
        <div className="flex gap-2 items-center">
             <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 border border-slate-200">
                <button onClick={()=>updateZoom(zoom-0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomOut size={18}/></button><span className="text-xs font-mono w-10 text-center text-slate-700">{Math.round(zoom*100)}%</span><button onClick={()=>updateZoom(zoom+0.1)} className="p-1 hover:bg-slate-200 text-slate-600"><MdZoomIn size={18}/></button><div className="w-[1px] h-4 bg-slate-300 mx-1"></div><button onClick={fitToWidth} title="Ajustar" className="p-1 hover:bg-slate-200 text-slate-600"><MdFitScreen size={18}/></button>
             </div>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto bg-slate-200 relative scroll-smooth" onWheel={handleWheel}>
        <div className="origin-top-left" style={{transform:`scale(${zoom})`, transformOrigin:'top left'}}>
          <table className="border-collapse bg-white">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 bg-slate-100 w-12 border-r border-b border-slate-300"></th>
                {Array.from({length:maxCols}).map((_,i)=>(<th key={i} className="sticky top-0 z-10 bg-slate-100 px-2 h-6 text-xs text-slate-500 font-normal border-r border-b border-slate-300 select-none text-center">{getColLetter(i)}</th>))}
              </tr>
            </thead>
            <tbody>
              {gridData.map((row,rI)=>(<tr key={rI}><td className="sticky left-0 z-10 bg-slate-100 text-center text-xs text-slate-500 border-r border-b border-slate-300 select-none">{rI+1}</td>{row.map((cell,cI)=>{const isMatch=searchTerm&&matches.some(m=>m.r===rI&&m.c===cI);const isCurrentMatch=isMatch&&matches[currentMatchIndex]?.r===rI&&matches[currentMatchIndex]?.c===cI;return(<td id={`cell-${rI}-${cI}`} key={cI} className={`px-2 py-1 text-xs whitespace-nowrap border-r border-b border-slate-200 transition-colors ${isCurrentMatch?'bg-orange-400 text-white':isMatch?'bg-yellow-200':''}`} style={{backgroundColor:cell.style.backgroundColor,color:cell.style.color,fontWeight:cell.style.fontWeight,textAlign:cell.style.textAlign}}>{cell.value}</td>)})}</tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white border-t border-slate-200 flex items-center px-2 py-1 gap-1 overflow-x-auto h-9 flex-shrink-0 shadow-inner">
        {data.sheetNames.map(sheet=>(<button key={sheet} onClick={()=>setData(prev=>({...prev,currentSheet:sheet}))} className={`px-3 py-1 text-xs font-medium transition-all rounded-md truncate max-w-[150px] ${data.currentSheet===sheet?'bg-slate-200 text-slate-800':'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>{sheet}</button>))}
      </div>
    </div>
  );
}