import React, { useState, useRef, useEffect } from 'react';
import { Province, DiagnosticResult } from '../types';
import { CROPS, DIAGNOSTIC_PRESETS } from '../data';
import { Camera, Upload, AlertTriangle, RefreshCw, Video, Info, ArrowRight, CheckCircle, Leaf, Eye, Zap } from 'lucide-react';

interface DiagnosticScannerProps {
  selectedProvince: Province;
  onLogAction: (action: string) => void;
}

const COLORS = {
  forest: "#1F4D36",
  forestDark: "#123425",
  soil: "#A9552E",
  soilDark: "#7C3D20",
  gold: "#E3A23C",
  goldDark: "#B87A24",
  cream: "#F7F4EC",
  card: "#FFFFFF",
  charcoal: "#22261F",
  ink: "#4A5147",
  sage: "#92A88C",
  sageLight: "#DCE6D6",
  line: "#E4E0D3",
  danger: "#B84A3A",
};

export default function DiagnosticScanner({ selectedProvince, onLogAction }: DiagnosticScannerProps) {
  const [activeMode, setActiveMode] = useState<'live' | 'manual'>('live');
  const [selectedCrop, setSelectedCrop] = useState<string>(CROPS[0].id);
  const [symptomText, setSymptomText] = useState<string>('');
  
  // Manual Upload States
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  // Global Diagnostic States
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  // Camera & Live Scanner States
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<boolean>(false);
  const [scanningStatus, setScanningStatus] = useState<string>('STANDBY');
  
  // Telemetry simulation states
  const [chlorophyll, setChlorophyll] = useState<number>(78.2);
  const [moisture, setMoisture] = useState<number>(64.8);
  const [leafArea, setLeafArea] = useState<number>(2.8);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Periodic simulated local telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      if (cameraActive) {
        setChlorophyll(prev => Math.max(40, Math.min(98, prev + (Math.random() - 0.5) * 3)));
        setMoisture(prev => Math.max(30, Math.min(95, prev + (Math.random() - 0.5) * 4)));
        setLeafArea(prev => Math.max(1.0, Math.min(4.5, prev + (Math.random() - 0.5) * 0.08)));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [cameraActive]);

  // Start Real Camera Stream
  const startCamera = async () => {
    setCameraPermissionError(false);
    setError(null);
    onLogAction("CAMERA_STREAM_START_REQUEST: Accessing facingMode=environment");

    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setScanningStatus('SCANNING_ACTIVE');
      onLogAction("CAMERA_STREAM_SUCCESS: Live agrometeorological camera streaming active");
    } catch (err: any) {
      console.warn("Camera permission denied or unavailable, falling back to Simulated Scan Feed", err);
      setCameraPermissionError(true);
      setCameraActive(true); // Treat as active simulator
      setScanningStatus('SIMULATED_FEED_ACTIVE');
      onLogAction("CAMERA_STREAM_FALLBACK: Camera unavailable, loaded synthesized neural simulator");
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setScanningStatus('STANDBY');
    onLogAction("CAMERA_STREAM_STOP: Scanner entered idle sleep mode");
  };

  // Keep camera synced to mode
  useEffect(() => {
    if (activeMode === 'live') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeMode]);

  // Capture Frame and Trigger Real AI Diagnosis
  const handleLiveScanAndAnalyze = async () => {
    setLoading(true);
    setError(null);
    setDiagnosticResult(null);
    onLogAction("LIVE_CAMERA_SCAN_TRIGGERED: Capturing video stream frame buffer");

    let base64Data = '';
    const activeCrop = CROPS.find(c => c.id === selectedCrop);

    try {
      if (!cameraPermissionError && videoRef.current) {
        const video = videoRef.current;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth || 640;
        tempCanvas.height = video.videoHeight || 480;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
          const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.85);
          base64Data = dataUrl.split(',')[1];
        }
      } else {
        onLogAction("SIMULATED_FRAME_CONVERSION: Reading local preset sample matching target crop");
        const matchingPreset = DIAGNOSTIC_PRESETS.find(p => p.cropId === selectedCrop);
        if (matchingPreset) {
          await new Promise(resolve => setTimeout(resolve, 1400));
          const simulatedResult: DiagnosticResult = {
            cropId: selectedCrop,
            symptom: matchingPreset.description,
            diagnosis: matchingPreset.diagnosis,
            confidence: matchingPreset.confidence,
            cause: matchingPreset.cause,
            treatmentOrganic: matchingPreset.treatmentOrganic,
            treatmentChemical: matchingPreset.treatmentChemical,
            prevention: matchingPreset.prevention,
            createdAt: new Date().toLocaleDateString('en-ZA')
          };
          setDiagnosticResult(simulatedResult);
          saveToDiagnosticHistory(simulatedResult);
          onLogAction(`AI_DIAGNOSIS_SUCCESS (SIMULATED): Diagnosed ${matchingPreset.diagnosis}`);
          setLoading(false);
          return;
        }
      }

      if (!base64Data) {
        throw new Error('Unable to capture a clean frame buffer from agrometeorological camera feed.');
      }

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropId: selectedCrop,
          cropName: activeCrop?.name,
          province: selectedProvince,
          symptomDescription: symptomText || "Analyzed via live-captured camera frame",
          imageData: base64Data,
          imageMimeType: 'image/jpeg'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Server diagnostic error');
      }

      const freshResult: DiagnosticResult = {
        cropId: selectedCrop,
        symptom: symptomText || 'Analyzed via live-captured camera stream frame',
        diagnosis: data.diagnosis,
        confidence: data.confidence || 88,
        cause: data.cause,
        treatmentOrganic: data.treatmentOrganic,
        treatmentChemical: data.treatmentChemical,
        prevention: data.prevention,
        createdAt: new Date().toLocaleDateString('en-ZA')
      };

      setDiagnosticResult(freshResult);
      saveToDiagnosticHistory(freshResult);
      onLogAction(`AI_DIAGNOSIS_SUCCESS: Diagnosed ${data.diagnosis} with ${data.confidence || 88}% confidence`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during real-time diagnostic scan.');
      onLogAction(`AI_DIAGNOSIS_FAILED: ${err.message}`);
    } {
      setLoading(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG/JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setCustomImage(base64Data);
      setImageMimeType(file.type);
      setError(null);
      onLogAction(`MANUAL_UPLOAD_CONVERTED: File Name: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleManualDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText && !customImage) {
      setError('Please provide either a crop photo or describe the symptoms in detail.');
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosticResult(null);
    onLogAction("AI_MANUAL_DIAGNOSTIC_TRIGGERED: Submitting manual telemetry");

    const activeCrop = CROPS.find(c => c.id === selectedCrop);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropId: selectedCrop,
          cropName: activeCrop?.name,
          province: selectedProvince,
          symptomDescription: symptomText,
          imageData: customImage,
          imageMimeType: imageMimeType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Server diagnostic error');
      }

      const result: DiagnosticResult = {
        cropId: selectedCrop,
        symptom: symptomText || 'Analyzed via uploaded manual image',
        diagnosis: data.diagnosis,
        confidence: data.confidence || 85,
        cause: data.cause,
        treatmentOrganic: data.treatmentOrganic,
        treatmentChemical: data.treatmentChemical,
        prevention: data.prevention,
        createdAt: new Date().toLocaleDateString('en-ZA')
      };

      setDiagnosticResult(result);
      saveToDiagnosticHistory(result);
      onLogAction(`AI_MANUAL_DIAGNOSIS_SUCCESS: ${data.diagnosis}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Diagnostic failed. Please check your API configuration or use manual presets.');
      onLogAction(`AI_MANUAL_DIAGNOSIS_ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveToDiagnosticHistory = (result: DiagnosticResult) => {
    try {
      const historyStr = localStorage.getItem('agri_diagnostic_history');
      const history = historyStr ? JSON.parse(historyStr) : [];
      localStorage.setItem('agri_diagnostic_history', JSON.stringify([result, ...history].slice(0, 10)));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = DIAGNOSTIC_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setError(null);
    setSelectedCrop(preset.cropId);
    setSymptomText(preset.description);
    
    const simulatedResult: DiagnosticResult = {
      cropId: preset.cropId,
      symptom: preset.description,
      diagnosis: preset.diagnosis,
      confidence: preset.confidence,
      cause: preset.cause,
      treatmentOrganic: preset.treatmentOrganic,
      treatmentChemical: preset.treatmentChemical,
      prevention: preset.prevention,
      createdAt: new Date().toLocaleDateString('en-ZA')
    };

    setDiagnosticResult(simulatedResult);
    saveToDiagnosticHistory(simulatedResult);
    onLogAction(`DIAGNOSTIC_PRESET_LOADED: ID: ${presetId}`);
  };

  const clearInputs = () => {
    setSymptomText('');
    setCustomImage(null);
    setImageMimeType(null);
    setDiagnosticResult(null);
    setError(null);
  };

  return (
    <div className="space-y-5">
      
      {/* Mode Selector Tab Bar */}
      <div className="bg-[#EFEBDD] p-1 rounded-2xl flex border border-[#E4E0D3]">
        <button
          onClick={() => setActiveMode('live')}
          style={{ color: activeMode === 'live' ? COLORS.forest : COLORS.ink }}
          className={`flex-1 text-[11px] font-mono font-bold uppercase py-2.5 rounded-xl transition-all cursor-pointer ${
            activeMode === 'live' ? 'bg-white shadow-sm font-semibold' : 'hover:text-[#1F4D36]'
          }`}
        >
          🔬 Live Viewport Scanner
        </button>
        <button
          onClick={() => setActiveMode('manual')}
          style={{ color: activeMode === 'manual' ? COLORS.forest : COLORS.ink }}
          className={`flex-1 text-[11px] font-mono font-bold uppercase py-2.5 rounded-xl transition-all cursor-pointer ${
            activeMode === 'manual' ? 'bg-white shadow-sm font-semibold' : 'hover:text-[#1F4D36]'
          }`}
        >
          📁 Manual Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        
        {/* Active Viewport Frame */}
        {activeMode === 'live' ? (
          <div className="border border-[#1F4D36]/40 bg-[#123425] rounded-3xl overflow-hidden relative shadow-md">
            
            {/* Live Agrometeorological Metrics HUD */}
            <div className="absolute top-3 left-3 z-20 bg-black/75 border border-[#1F4D36]/30 rounded-lg px-2.5 py-1.5 text-[9px] font-mono text-white/90 space-y-0.5">
              <div className="flex justify-between gap-3">
                <span className="text-[#92A88C] font-semibold">HUD RETICLE</span>
                <span className="text-[#E3A23C] font-extrabold animate-pulse">● {scanningStatus}</span>
              </div>
              <div>CHLOROPHYLL_INDEX: {chlorophyll.toFixed(1)}%</div>
              <div>CANOPY_MOISTURE: {moisture.toFixed(1)}%</div>
              <div>LEAF_AREA_INDEX: {leafArea.toFixed(2)}</div>
            </div>

            {/* Scanning Target HUD Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
              {/* Target reticle */}
              <div className="w-24 h-24 border border-dashed border-[#E3A23C]/50 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '15s' }} />
              <div className="w-12 h-12 border border-[#E3A23C] rounded-lg absolute flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#E3A23C] rounded-full animate-ping" />
              </div>
              {/* Laser sweeping beam line */}
              <div className="w-full h-0.5 bg-[#E3A23C]/60 absolute left-0 shadow-[0_0_8px_rgba(227,162,60,0.8)] animate-bounce" style={{ top: '25%', animationDuration: '3.5s' }} />
            </div>

            {/* Video Element / Simulated Feed Fallback */}
            {!cameraPermissionError ? (
              <div className="relative aspect-video w-full bg-black">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600"
                  alt="Simulated crop leaf telemetry feed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-50 filter saturate-75 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35 flex items-end p-4">
                  <span className="text-[10px] font-mono text-white/85 bg-black/80 px-2 py-1 rounded border border-[#1F4D36]/30">
                    On-device camera fallback loaded. Capturing simulated agricultural leaf grid.
                  </span>
                </div>
              </div>
            )}

            {/* Viewport Control Panel */}
            <div className="p-3 bg-[#123425] border-t border-[#1F4D36]/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-white/70 font-mono text-[9px]">
                <Video className="w-3.5 h-3.5 text-[#E3A23C]" />
                <span>TELEMETRY STREAM NOMINAL</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startCamera}
                  title="Restart stream"
                  className="p-1.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-white/80 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleLiveScanAndAnalyze}
                  disabled={loading}
                  style={{ background: COLORS.gold, color: COLORS.forestDark }}
                  className="font-mono uppercase font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {loading ? 'ANALYZING...' : '🔬 Analyze Live Reticle'}
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Manual Text / Image Form */
          <div className="bg-white border border-[#E4E0D3] rounded-3xl p-5 space-y-4 shadow-sm">
            <form onSubmit={handleManualDiagnose} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider font-mono block">Image Upload</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    isDragOver ? 'border-[#1F4D36] bg-[#F7F4EC]' : 'border-[#E4E0D3] hover:border-[#92A88C] hover:bg-[#F7F4EC]/30'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {customImage ? (
                    <div className="relative w-20 h-20 rounded-xl border border-[#E4E0D3] overflow-hidden">
                      <img
                        src={`data:${imageMimeType || 'image/jpeg'};base64,${customImage}`}
                        alt="manual payload"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-2 bg-[#DCE6D6] rounded-xl text-[#1F4D36]">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <p className="text-xs font-semibold text-[#22261F]">
                    {customImage ? 'Image buffer locked' : 'Upload leaf photograph'}
                  </p>
                  <p className="text-[10px] text-[#4A5147] font-mono">
                    Drag/drop JPEG or PNG files directly
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="manual-symptom-input" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider font-mono block">Symptom Observations</label>
                <textarea
                  id="manual-symptom-input"
                  rows={2}
                  placeholder="Describe yellowing spots, brown stripes, wilting leaves, or web patterns..."
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="w-full text-xs font-medium bg-[#F7F4EC]/30 border border-[#E4E0D3] rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#1F4D36] focus:bg-white transition-all placeholder:text-[#92A88C]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || (!customImage && !symptomText)}
                  style={{ background: COLORS.forest }}
                  className="flex-1 text-white font-mono uppercase font-bold text-[10px] py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                >
                  {loading ? 'DIAGNOSING...' : 'RUN TELEMETRY ANALYSIS'}
                </button>
                {(customImage || symptomText) && (
                  <button
                    type="button"
                    onClick={clearInputs}
                    className="border border-[#E4E0D3] text-[#4A5147] px-3.5 py-2 rounded-xl hover:bg-[#F7F4EC]/50 transition-all cursor-pointer text-xs font-bold font-mono"
                  >
                    RESET
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

        {/* Bound Inspection Target Crop Selector */}
        <div className="bg-white border border-[#E4E0D3] rounded-2xl p-4 space-y-1.5">
          <label htmlFor="diagnostic-crop-bound" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider font-mono block">Bound Inspection Target Crop</label>
          <select
            id="diagnostic-crop-bound"
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              setDiagnosticResult(null);
            }}
            className="w-full bg-[#F7F4EC]/50 border border-[#E4E0D3] rounded-xl py-2 px-3 text-xs font-semibold text-[#22261F] focus:outline-none focus:ring-1 focus:ring-[#1F4D36] transition-all"
          >
            {CROPS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name} ({crop.localName})
              </option>
            ))}
          </select>
        </div>

        {/* Diagnostic Result Output */}
        {diagnosticResult && (
          <div className="border border-[#E4E0D3] bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#E4E0D3]/60">
              <div>
                <span style={{ color: COLORS.forest, background: COLORS.sageLight }} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  AI BOTANICAL INSPECTION REPORT
                </span>
                <h3 className="text-base font-serif font-semibold text-[#22261F] mt-1.5">{diagnosticResult.diagnosis}</h3>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-[#4A5147] block uppercase">CONFIDENCE</span>
                <span className="text-sm font-bold font-mono text-[#22261F]">{diagnosticResult.confidence}%</span>
              </div>
            </div>

            <div className="text-xs space-y-3.5">
              <div className="space-y-0.5">
                <span className="text-[#92A88C] font-mono text-[9px] font-bold uppercase block">Etiology & Vector Cause</span>
                <p className="text-[#22261F] leading-relaxed font-medium">{diagnosticResult.cause}</p>
              </div>

              <div className="p-3 bg-[#DCE6D6] border border-[#92A88C]/20 rounded-xl space-y-1">
                <span className="text-[#123425] font-mono text-[9px] font-bold uppercase block">Organic / Agro-Ecological treatment</span>
                <p className="text-[#22261F] leading-relaxed text-[11px] whitespace-pre-line">{diagnosticResult.treatmentOrganic}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#B84A3A] font-mono text-[9px] font-bold uppercase block">Chemical control alternative</span>
                <p className="text-[#22261F] leading-relaxed font-medium">{diagnosticResult.treatmentChemical}</p>
              </div>

              <div className="pt-2 border-t border-[#E4E0D3]/60 space-y-0.5">
                <span className="text-[#4A5147] font-mono text-[9px] uppercase block">Preventative cultural strategy</span>
                <p className="text-[#4A5147] leading-relaxed text-[11px]">{diagnosticResult.prevention}</p>
              </div>
            </div>
          </div>
        )}

        {/* Offline Backup Lexicon */}
        <div className="bg-[#F7F4EC] border border-[#E4E0D3] rounded-3xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider font-mono">Offline Botanical Presets</span>
            <span className="text-[8px] font-mono text-[#92A88C] uppercase">NO NETWORK</span>
          </div>
          <div className="space-y-1.5">
            {DIAGNOSTIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-[#E4E0D3] hover:border-[#1F4D36] hover:bg-[#F7F4EC]/20 transition-all flex justify-between items-center group cursor-pointer text-xs"
              >
                <div className="truncate flex-1 pr-2 space-y-0.5">
                  <span className="text-[8px] font-mono font-bold bg-[#DCE6D6] text-[#123425] px-1.5 py-0.5 rounded-md uppercase mr-1.5">
                    {preset.cropId}
                  </span>
                  <span className="font-semibold text-[#22261F] group-hover:text-[#123425] transition-colors font-serif">{preset.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#92A88C] group-hover:text-[#1F4D36] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
