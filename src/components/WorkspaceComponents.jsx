import React, { useState } from "react";
import {
  Waves, LayoutDashboard, ScanSearch, History, UserRound, Settings,
  Bell, Search, ChevronDown, ArrowUpRight, ArrowRight, UploadCloud,
  Image as ImageIcon, Video, ScanEye, FileText, Clock3, CheckCircle2,
  AlertTriangle, CircleHelp, X, Play, Sparkles, Layers3, Download,
  Trash2, Menu, SlidersHorizontal, Eye, Activity, ShieldCheck, Plus,
  FileImage, RefreshCw, Check, ExternalLink
} from "lucide-react";
import { demoObjects } from "../data/demoData.js";

export function NavItem({ icon, label, active, onClick, tag }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{tag && <em>{tag}</em>}</button>;
}

export function PageHeading({ eyebrow = "OVERVIEW", title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

export function Dashboard({ analyses, onAnalyze, onHistory, onReport }) {
  const latest = analyses.slice(0, 4);
  return <>
    <PageHeading eyebrow="THURSDAY, OCTOBER 29, 2026" title={<>Good to see you, <span className="gradient-text">Mouvya</span></>} subtitle="Here's what's happening across your underwater analyses." action={<button className="button button-primary" onClick={onAnalyze}><Plus size={17}/> New analysis</button>}/>
    <section className="hero-banner">
      <div className="hero-copy"><div className="hero-chip"><Sparkles size={13}/> YOUR AI WORKSPACE</div><h2>See beneath the surface.</h2><p>Turn low-visibility underwater media into clearer, actionable insights with AI-assisted analysis.</p><button className="button button-light" onClick={onAnalyze}>Start an analysis <ArrowUpRight size={16}/></button></div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-bubble bubble-one"></div><div className="hero-bubble bubble-two"></div><div className="hero-wave"><Waves size={94}/></div><div className="hero-scan"><ScanEye size={40}/><span>AI VISION</span></div></div>
      <div className="hero-glow"></div>
    </section>
    <div className="section-heading"><div><h2>Workspace overview</h2><p>Your analysis activity at a glance</p></div><span className="updated-label"><span className="footer-dot"></span> Updated just now</span></div>
    <div className="stats-grid">
      <StatCard icon={<Layers3 size={18}/>} label="Total analyses" value="48" trend="+12.5%" sub="vs. last month" tone="teal" />
      <StatCard icon={<ScanEye size={18}/>} label="Objects detected" value="326" trend="+8.2%" sub="across all scans" tone="blue" />
      <StatCard icon={<Activity size={18}/>} label="Avg. image quality" value="76.4" suffix="/100" trend="+6.4%" sub="after enhancement" tone="purple" />
      <StatCard icon={<ShieldCheck size={18}/>} label="Need review" value="3" trend="Review" sub="uncertain detections" tone="amber" />
    </div>
    <div className="dashboard-grid">
      <section className="panel recent-panel">
        <div className="panel-heading"><div><h3>Recent analyses</h3><p>Your latest image and video scans</p></div><button className="text-button" onClick={onHistory}>View all <ArrowRight size={14}/></button></div>
        <AnalysisTable analyses={latest} onReport={onReport}/>
      </section>
      <section className="panel breakdown-panel">
        <div className="panel-heading"><div><h3>Detection breakdown</h3><p>Illustrative category distribution</p></div><button className="icon-button subtle-button" aria-label="Detection options"><SlidersHorizontal size={16}/></button></div>
        <div className="donut-wrap"><div className="donut"><div><strong>326</strong><span>objects</span></div></div><div className="donut-center-label"><span>Across all scans</span></div></div>
        <div className="legend-list"><Legend color="mint" label="Marine debris" value="48%" count="157"/><Legend color="blue" label="Infrastructure" value="29%" count="95"/><Legend color="purple" label="Marine life" value="23%" count="74"/></div>
        <div className="panel-footnote"><AlertTriangle size={13}/> Example statistics for UI preview only</div>
      </section>
    </div>
  </>;
}

export function StatCard({ icon, label, value, suffix, trend, sub, tone }) {
  return <div className="stat-card"><div className="stat-top"><span className={`stat-icon ${tone}`}>{icon}</span><span className={`trend ${tone === "amber" ? "trend-neutral" : ""}`}>{trend}</span></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="stat-label">{label}</div><div className="stat-sub">{sub}</div></div>;
}

export function Legend({ color, label, value, count }) {
  return <div className="legend-row"><span className={`legend-dot ${color}`}></span><span className="legend-label">{label}</span><span className="legend-count">{count}</span><span className="legend-value">{value}</span></div>;
}

export function AnalysisTable({ analyses, onReport }) {
  if (!analyses.length) return <div className="empty-state"><Search size={24}/><strong>No analyses found</strong><span>Try a different search.</span></div>;
  return <div className="table-wrap"><table className="analysis-table"><thead><tr><th>FILE</th><th>TYPE</th><th>STATUS</th><th>OBJECTS</th><th></th></tr></thead><tbody>{analyses.map(item => <tr key={item.id}><td><div className="file-cell"><span className={`file-icon ${item.kind === "Video" ? "video-file" : ""}`}>{item.kind === "Video" ? <Video size={17}/> : <FileImage size={17}/>}</span><div><strong>{item.name}</strong><span>{item.date}</span></div></div></td><td><span className="type-pill">{item.kind}</span></td><td><Status status={item.status}/></td><td><strong className="object-count">{item.objects}</strong></td><td><button className="row-action" title="Export report" onClick={() => onReport(item)}><Download size={15}/></button></td></tr>)}</tbody></table></div>;
}

export function Status({ status }) {
  const review = status.toLowerCase().includes("review");
  const demo = status.toLowerCase().includes("demo");
  return <span className={`status-pill ${review ? "status-review" : demo ? "status-demo" : ""}`}><span></span>{status}</span>;
}

export function AnalyzePage({ mediaTab, setMediaTab, file, preview, analysisStarted, showDetection, setShowDetection, onFile, onChoose, onAnalyze, onReset, imageInput, videoInput }) {
  return <>
    <PageHeading eyebrow="AI WORKSPACE" title="Analyze your media" subtitle="Upload underwater imagery to enhance visibility and inspect detected objects."/>
    <div className="media-tabs"><button className={mediaTab === "Image" ? "selected" : ""} onClick={() => setMediaTab("Image")}><ImageIcon size={17}/> Image analysis</button><button className={mediaTab === "Video" ? "selected" : ""} onClick={() => setMediaTab("Video")}><Video size={17}/> Video analysis <span className="soon-pill">BETA</span></button></div>
    <input ref={imageInput} type="file" accept="image/*" hidden onChange={e => onFile(e.target.files?.[0])}/>
    <input ref={videoInput} type="file" accept="video/*" hidden onChange={e => onFile(e.target.files?.[0])}/>
    <div className="analyze-layout">
      <section className="panel upload-panel">
        <div className="panel-heading"><div><h3>{mediaTab === "Image" ? "Upload an image" : "Upload a video"}</h3><p>{mediaTab === "Image" ? "Choose an underwater photo to get started." : "Choose an underwater video for frame-by-frame analysis."}</p></div><span className="step-indicator">STEP 01</span></div>
        {!file ? <button className="dropzone" onClick={onChoose} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}><span className="upload-icon"><UploadCloud size={25}/></span><strong>Drag and drop your {mediaTab.toLowerCase()}</strong><span>or <b>browse files</b> from your device</span><small>{mediaTab === "Image" ? "JPG, PNG, WEBP · Up to 100 MB" : "MP4, MOV, WEBM · Up to 100 MB"}</small></button> :
          <div className="selected-file"><div className="selected-file-preview">{mediaTab === "Image" ? <img src={preview} alt="Selected underwater media"/> : <video src={preview} controls muted/>}</div><div className="selected-file-meta"><span className="success-check"><Check size={13}/></span><div><strong>{file.name}</strong><span>{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to analyze</span></div><button className="icon-button" onClick={onReset} aria-label="Remove selected file"><Trash2 size={16}/></button></div><button className="button button-secondary full-width" onClick={onChoose}><RefreshCw size={15}/> Replace file</button></div>}
        <div className="upload-footer"><ShieldCheck size={15}/><span>Your files stay in this browser demo and are not sent to a server.</span></div>
      </section>
      <section className="panel settings-panel">
        <div className="panel-heading"><div><h3>Analysis settings</h3><p>Choose what to include in your scan.</p></div><span className="settings-icon"><Settings size={17}/></span></div>
        <div className="setting-row"><div className="setting-icon"><Sparkles size={17}/></div><div className="setting-copy"><strong>AI image enhancement</strong><span>Improve contrast and visibility</span></div><span className="toggle on"><i/></span></div>
        <div className="setting-row"><div className="setting-icon"><ScanEye size={17}/></div><div className="setting-copy"><strong>Object detection</strong><span>Identify visible objects</span></div><span className="toggle on"><i/></span></div>
        <div className="setting-row"><div className="setting-icon"><Layers3 size={17}/></div><div className="setting-copy"><strong>Segmentation masks</strong><span>Outline object boundaries</span></div><span className="toggle"><i/></span></div>
        <div className="setting-row"><div className="setting-icon"><GitCompareIcon/></div><div className="setting-copy"><strong>Compare results</strong><span>Original vs. enhanced image</span></div><span className="toggle on"><i/></span></div>
        <div className="model-info"><div className="model-badge"><Waves size={16}/></div><div><strong>Underwater vision model</strong><span>Pretrained model · Backend not connected</span></div><span className="model-status">Preview</span></div>
        <button className="button button-primary full-width analyze-button" onClick={onAnalyze}><Sparkles size={16}/> {analysisStarted ? "Run again" : "Start AI analysis"} <ArrowRight size={16}/></button>
        <p className="demo-note"><AlertTriangle size={13}/> This prototype displays sample results, not real AI predictions.</p>
      </section>
    </div>
    {analysisStarted && <section className="panel result-panel"><div className="panel-heading"><div><h3>Analysis preview</h3><p>Sample detection overlay for interface testing</p></div><span className="status-pill status-demo"><span/> Demo results</span></div><DetectionCanvas showDetection={showDetection} setShowDetection={setShowDetection} preview={mediaTab === "Image" ? preview : ""}/><div className="result-metrics"><MiniMetric label="Objects detected" value={mediaTab === "Image" ? "3" : "8"}/><MiniMetric label="Image quality" value="+32%"/><MiniMetric label="Needs review" value="1"/></div></section>}
  </>;
}

export function GitCompareIcon() { return <Layers3 size={17}/>; }

export function DetectionCanvas({ showDetection, setShowDetection, preview }) {
  return <div className="detection-canvas-wrap"><div className="detection-canvas">
    {preview ? <img className="canvas-image" src={preview} alt="Uploaded image analysis preview"/> : <div className="underwater-scene"><div className="scene-light"></div><div className="scene-rock rock-a"></div><div className="scene-rock rock-b"></div><div className="scene-seabed"></div><div className="scene-plant plant-a"></div><div className="scene-plant plant-b"></div><div className="scene-fish">◁</div></div>}
    {showDetection && demoObjects.map((o, i) => <div key={o.name} className={`detect-box detect-${o.color}`} style={{left:o.x,top:o.y,width:o.w,height:o.h}}><span>{o.name} · {o.confidence}%</span></div>)}
    <div className="canvas-top-label"><span className="live-dot"></span> {preview ? "UPLOADED IMAGE" : "SAMPLE UNDERWATER SCENE"}</div>
    <div className="canvas-tools"><button className={showDetection ? "tool-active" : ""} onClick={() => setShowDetection(!showDetection)}><Eye size={14}/>{showDetection ? "Hide overlays" : "Show overlays"}</button></div>
  </div></div>;
}

export function MiniMetric({ label, value }) { return <div className="mini-metric"><span>{label}</span><strong>{value}</strong></div>; }

export function DetectionPage({ showDetection, setShowDetection, onAnalyze }) {
  return <>
    <PageHeading eyebrow="COMPUTER VISION" title="Object detection" subtitle="Inspect the objects identified in an underwater scene." action={<button className="button button-primary" onClick={onAnalyze}><Plus size={16}/> New scan</button>}/>
    <div className="detection-summary-grid"><StatCard icon={<ScanEye size={18}/>} label="Objects detected" value="3" sub="In selected sample" tone="teal"/><StatCard icon={<CheckCircle2 size={18}/>} label="High confidence" value="2" sub="90% confidence or higher" tone="blue"/><StatCard icon={<AlertTriangle size={18}/>} label="Needs review" value="1" sub="Below 90% confidence" tone="amber"/></div>
    <section className="panel detection-detail-panel"><div className="panel-heading"><div><h3>Detection viewer</h3><p>Sample annotation layer — not real model output</p></div><button className="button button-secondary button-small" onClick={() => setShowDetection(!showDetection)}><Eye size={15}/>{showDetection ? "Hide overlays" : "Show overlays"}</button></div><DetectionCanvas showDetection={showDetection} setShowDetection={setShowDetection}/><div className="object-list-heading"><h3>Detected objects</h3><span className="type-pill">3 objects</span></div><div className="object-list">{demoObjects.map((o,i) => <div className="object-row" key={o.name}><div className={`object-swatch ${o.color}`}>{i+1}</div><div className="object-name"><strong>{o.name}</strong><span>{o.type}</span></div><div className="confidence"><div className="confidence-bar"><i style={{width:`${o.confidence}%`}}/></div><strong>{o.confidence}%</strong></div><span className={`review-tag ${o.confidence < 90 ? "review-needed" : ""}`}>{o.confidence < 90 ? "Review" : "Confident"}</span></div>)}</div></section>
  </>;
}

export function HistoryPage({ analyses, onReport, searchTerm }) {
  return <>
    <PageHeading eyebrow="YOUR WORKSPACE" title="History & reports" subtitle="All your recent scans, ready to review or export."/>
    <div className="history-stats"><div><span>Total records</span><strong>{analyses.length}</strong></div><div><span>Image analyses</span><strong>{analyses.filter(a=>a.kind==="Image").length}</strong></div><div><span>Video analyses</span><strong>{analyses.filter(a=>a.kind==="Video").length}</strong></div></div>
    <section className="panel history-panel"><div className="panel-heading"><div><h3>Analysis history</h3><p>{searchTerm ? `Filtered by “${searchTerm}”` : "Your saved analysis sessions"}</p></div><span className="type-pill">{analyses.length} records</span></div><AnalysisTable analyses={analyses} onReport={onReport}/><div className="history-footnote"><FileText size={15}/> Export creates a sample text report. Connect a backend to persist records and generate PDF reports.</div></section>
  </>;
}

