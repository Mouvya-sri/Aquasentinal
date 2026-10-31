import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Waves, LayoutDashboard, ScanSearch, History, UserRound, Settings,
  Bell, Search, ChevronDown, ArrowUpRight, ArrowRight, UploadCloud,
  Image as ImageIcon, Video, ScanEye, FileText, Clock3, CheckCircle2,
  AlertTriangle, CircleHelp, X, Play, Sparkles, Layers3, Download,
  Trash2, Menu, SlidersHorizontal, Eye, Activity, ShieldCheck, Plus,
  FileImage, RefreshCw, Check, ExternalLink
} from "lucide-react";
import "./styles.css";
import { NavItem, PageHeading, Dashboard, StatCard, Legend, AnalysisTable, Status, AnalyzePage, GitCompareIcon, DetectionCanvas, MiniMetric, DetectionPage, HistoryPage, AccountPage } from "./components/WorkspaceComponents.jsx";
import { initialAnalyses } from "./data/demoData.js";
import { getApiHealth, getAnalyses, submitAnalysis } from "./services/api.js";




export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [mediaTab, setMediaTab] = useState("Image");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [showDetection, setShowDetection] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [notice, setNotice] = useState("");
  const [accountName, setAccountName] = useState("Mouvya Sri");
  const [backendStatus, setBackendStatus] = useState("connecting");

  useEffect(() => {
    let alive = true;
    getApiHealth()
      .then(() => alive && setBackendStatus("online"))
      .catch(() => alive && setBackendStatus("offline"));
    getAnalyses()
      .then(data => { if (alive && Array.isArray(data.analyses) && data.analyses.length) setAnalyses(data.analyses); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const imageInput = useRef(null);
  const videoInput = useRef(null);

  const filteredAnalyses = useMemo(() => analyses.filter(a =>
    `${a.name} ${a.kind} ${a.status}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [analyses, searchTerm]);

  const choosePage = (page) => {
    setActive(page);
    setMobileNav(false);
    setNotice("");
  };

  const resetUpload = () => {
    setFile(null); setPreview(""); setAnalysisStarted(false);
    if (imageInput.current) imageInput.current.value = "";
    if (videoInput.current) videoInput.current.value = "";
  };

  const handleFile = (selected) => {
    if (!selected) return;
    const isVideo = selected.type.startsWith("video/");
    const isImage = selected.type.startsWith("image/");
    if ((mediaTab === "Image" && !isImage) || (mediaTab === "Video" && !isVideo)) {
      setNotice(`Please choose a ${mediaTab.toLowerCase()} file for the selected tab.`);
      return;
    }
    if (selected.size > 100 * 1024 * 1024) {
      setNotice("Please choose a file smaller than 100 MB.");
      return;
    }
    setNotice("");
    setFile(selected);
    setAnalysisStarted(false);
    setPreview(isImage ? URL.createObjectURL(selected) : URL.createObjectURL(selected));
  };

  const startDemoAnalysis = async () => {
    if (!file) {
      setNotice(`Upload an ${mediaTab.toLowerCase()} first to start a scan.`);
      return;
    }
    setAnalysisStarted(true);
    try {
      const data = await submitAnalysis(file, mediaTab);
      setAnalyses(prev => [data.analysis, ...prev.filter(a => a.id !== data.analysis.id)]);
      setBackendStatus("online");
      setNotice(data.message || "Scan saved. Enhancement is available for supported images; object labels are marked as illustrative until a detection model is connected.");
    } catch (error) {
      setBackendStatus("offline");
      const newItem = { id: `LOCAL-${Date.now().toString().slice(-6)}`, name: file.name, kind: mediaTab, date: "Just now", status: "Local preview", objects: 0, quality: "—" };
      setAnalyses(prev => [newItem, ...prev]);
      setNotice("Backend is not running. This file is shown as a local preview only; start the API server to save scans persistently.");
    }
  };

  const exportReport = (item) => {
    const report = [
      "AquaSentinel AI — Analysis Report",
      `Analysis ID: ${item.id}`,
      `File: ${item.name}`,
      `Media type: ${item.kind}`,
      `Date: ${item.date}`,
      `Status: ${item.status}`,
      `Objects shown: ${item.objects}`,
      `Image quality change: ${item.quality}`,
      "",
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${item.id}-report.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const pageTitle = active === "Analyze" ? "Analyze media" : active === "Object Detection" ? "Object detection" : active === "History & Reports" ? "History & reports" : active;
  const pageSubtitle = {
    Dashboard: "Your underwater intelligence workspace at a glance.",
    Analyze: "Enhance underwater media and inspect what the AI can identify.",
    "Object Detection": "Review detected objects, confidence and visual annotations.",
    "History & Reports": "Revisit previous scans and export their reports.",
    Account: "Manage your profile and workspace preferences."
  }[active];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Waves size={24} strokeWidth={2.2}/></div>
          <div><div className="brand-name">AquaSentinel<span> AI</span></div><div className="brand-caption">UNDERWATER INTELLIGENCE</div></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-pill"><span className="live-dot"></span><span>Research workspace</span><ChevronDown size={14}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={active === "Dashboard"} onClick={() => choosePage("Dashboard")}/>
          <NavItem icon={<ScanSearch size={18}/>} label="Analyze" active={active === "Analyze"} onClick={() => choosePage("Analyze")} tag="NEW"/>
          <NavItem icon={<ScanEye size={18}/>} label="Object Detection" active={active === "Object Detection"} onClick={() => choosePage("Object Detection")}/>
          <NavItem icon={<History size={18}/>} label="History & Reports" active={active === "History & Reports"} onClick={() => choosePage("History & Reports")}/>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17}/></div>
            <div><strong>Need a hand?</strong><p>Learn how to analyze your first scan.</p><button onClick={() => setNotice("Tip: open Analyze, choose Image or Video, then upload a file.")}>Quick guide <ArrowRight size={13}/></button></div>
          </div>
          <button className={`nav-item ${active === "Account" ? "active" : ""}`} onClick={() => choosePage("Account")}><UserRound size={18}/><span>Account</span></button>
          <div className="sidebar-user">
            <div className="avatar">MS</div><div className="user-meta"><strong>{accountName}</strong><span>Researcher account</span></div><button className="more-button" onClick={() => choosePage("Account")} aria-label="Account options">•••</button>
          </div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
          <div className="breadcrumbs"><span>FIELD STATION 07</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          <div className="top-actions">
            <label className="search-box"><Search size={16}/><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search analyses..." aria-label="Search analyses"/><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" onClick={() => setNotice("You're all caught up. No new notifications.")} aria-label="Notifications"><Bell size={18}/><i></i></button>
            <div className={`system-status ${backendStatus}`} title={`API ${backendStatus}`}><i></i><span>{backendStatus === "online" ? "API CONNECTED" : backendStatus === "connecting" ? "CONNECTING" : "API OFFLINE"}</span></div><div className="top-avatar">MS</div>
          </div>
        </header>

        <div className="page-content">
          {notice && <div className="notice"><div><AlertTriangle size={17}/><span>{notice}</span></div><button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={16}/></button></div>}
          {active === "Dashboard" && <Dashboard analyses={filteredAnalyses} onAnalyze={() => choosePage("Analyze")} onHistory={() => choosePage("History & Reports")} onReport={exportReport} />}
          {active === "Analyze" && <AnalyzePage mediaTab={mediaTab} setMediaTab={v => { setMediaTab(v); resetUpload(); setNotice(""); }} file={file} preview={preview} analysisStarted={analysisStarted} showDetection={showDetection} setShowDetection={setShowDetection} onFile={handleFile} onChoose={() => (mediaTab === "Image" ? imageInput.current : videoInput.current)?.click()} onAnalyze={startDemoAnalysis} onReset={resetUpload} imageInput={imageInput} videoInput={videoInput} />}
          {active === "Object Detection" && <DetectionPage showDetection={showDetection} setShowDetection={setShowDetection} onAnalyze={() => choosePage("Analyze")}/>}
          {active === "History & Reports" && <HistoryPage analyses={filteredAnalyses} onReport={exportReport} searchTerm={searchTerm}/>}
          {active === "Account" && <AccountPage accountName={accountName} setAccountName={setAccountName} onSave={() => setNotice("Account profile updated in this demo session.")}/>}
          <footer className="footer"><span>© 2026 AquaSentinel AI</span><span><span className="footer-dot"></span> FIELD STATION 07 <span className="footer-sep">·</span> Detection labels remain illustrative until a model is configured</span></footer>
        </div>
      </main>
    </div>
  );
}





























