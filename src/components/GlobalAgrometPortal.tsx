import React, { useState, useEffect } from 'react';
import { Search, Globe, Info, Database, ShieldAlert, Check } from 'lucide-react';

interface AgrometData {
  locationName: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  soilType: string;
  soilPh: number;
  organicCarbonPercent: number;
  nitrogenLevel: string;
  phosphorusLevel: string;
  potassiumLevel: string;
  annualRainfallMm: number;
  avgTemperatureC: number;
  elevationMeters: number;
  climateZone: string;
  topCrops: string[];
  worldBankStats: { indicator: string; value: string }[];
  faoSoilClassification: string;
  plantingCalendar: { month: string; suitability: string }[];
  generalAdvisory: string;
}

interface GlobalAgrometPortalProps {
  currentLocation: string;
  onLocationUpdate: (newLoc: string) => void;
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

const PRESETS = [
  "Gauteng, South Africa",
  "Limpopo, South Africa",
  "Nairobi, Kenya",
  "Punjab, India",
  "Sinaloa, Mexico"
];

export default function GlobalAgrometPortal({ currentLocation, onLocationUpdate, onLogAction }: GlobalAgrometPortalProps) {
  const [searchQuery, setSearchQuery] = useState(currentLocation);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AgrometData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAgricultureData = async (query: string) => {
    setLoading(true);
    setError(null);
    onLogAction(`QUERY_AGRICULTURAL_DATABASE_START: Target "${query}"`);

    try {
      const res = await fetch('/api/location-agriculture-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: query })
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve world agricultural data records.');
      }

      const result: AgrometData = await res.json();
      setData(result);
      onLocationUpdate(result.locationName);
      onLogAction(`QUERY_AGRICULTURAL_DATABASE_SUCCESS: ${result.locationName}, ${result.country}`);
    } catch (err: any) {
      setError(err.message || 'System error while extracting records.');
      onLogAction(`QUERY_AGRICULTURAL_DATABASE_ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgricultureData(currentLocation);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchAgricultureData(searchQuery);
  };

  const selectPreset = (preset: string) => {
    setSearchQuery(preset);
    fetchAgricultureData(preset);
  };

  return (
    <div className="bg-white border border-[#E4E0D3] rounded-3xl overflow-hidden shadow-sm text-[#22261F] font-sans">
      
      {/* Search Header Banner */}
      <div className="p-6 bg-[#123425] text-white border-b border-[#1F4D36]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#92A88C] text-[10px] font-mono uppercase tracking-wider mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>FAO & World Bank Integrated Registry</span>
            </div>
            <h2 className="text-xl font-serif font-semibold tracking-tight text-[#F7F4EC]">
              Location & World Ag Data
            </h2>
            <p className="text-xs text-[#92A88C] mt-1 max-w-lg leading-relaxed">
              Extract detailed FAO soil classification, multi-spectral profile indexes, local moisture thresholds, and sovereign agricultural stats.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto md:max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#92A88C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any global location..."
                className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-medium text-white placeholder:text-[#92A88C] focus:outline-none focus:ring-1 focus:ring-[#E3A23C] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ background: COLORS.gold, color: COLORS.forestDark }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold font-mono uppercase disabled:opacity-50 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {loading ? 'WAIT' : 'EXTRACT'}
            </button>
          </form>
        </div>

        {/* Hotspot Presets */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-[#92A88C] uppercase tracking-wider font-mono mr-1">Hotspots:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => selectPreset(preset)}
              disabled={loading}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                data?.locationName.toLowerCase().includes(preset.split(',')[0].toLowerCase())
                  ? 'bg-white text-[#123425] border-white font-bold'
                  : 'bg-white/5 text-[#92A88C] border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Stats Workspace */}
      <div className="p-5">
        
        {loading && (
          <div className="py-12 text-center space-y-3">
            <div style={{ borderTopColor: 'transparent', borderLeftColor: COLORS.forest, borderRightColor: COLORS.forest, borderBottomColor: COLORS.forest }} className="w-8 h-8 border-2 rounded-full animate-spin mx-auto" />
            <p className="text-[11px] text-[#4A5147] font-mono tracking-wider uppercase">Querying World Agronomic Databases...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#F6DEDA] border border-[#B84A3A]/20 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#B84A3A] font-bold text-xs font-mono uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>Query Interrupted</span>
            </div>
            <p className="text-xs text-[#B84A3A]/90 leading-relaxed font-semibold">
              The query could not be completed: {error}
            </p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-5">
            
            {/* Geographic & Soil Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Geo Telemetry */}
              <div className="border border-[#E4E0D3] rounded-2xl p-4 bg-[#F7F4EC]/30 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E4E0D3]">
                  <Globe className="w-4 h-4 text-[#1F4D36]" />
                  <h3 className="text-xs font-serif font-bold text-[#22261F]">Geographic Boundaries</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Bound Location</span>
                    <span className="font-bold text-[#22261F] truncate block">{data.locationName}</span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Latitude & Longitude</span>
                    <span className="font-semibold text-[#22261F] font-mono text-[11px]">
                      {data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Region / State</span>
                    <span className="font-semibold text-[#22261F] block truncate">{data.region}</span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Country Sovereign</span>
                    <span className="font-semibold text-[#22261F] block truncate">{data.country}</span>
                  </div>
                </div>
              </div>

              {/* Climate Stats */}
              <div className="border border-[#E4E0D3] rounded-2xl p-4 bg-[#F7F4EC]/30 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E4E0D3]">
                  <Database className="w-4 h-4 text-[#A9552E]" />
                  <h3 className="text-xs font-serif font-bold text-[#22261F]">Met Micro-Climate</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Köppen Climate</span>
                    <span className="font-bold text-[#22261F] truncate block" title={data.climateZone}>{data.climateZone}</span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Elevation AMSL</span>
                    <span className="font-semibold text-[#22261F]">{data.elevationMeters}m</span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Mean Precipitation</span>
                    <span className="font-semibold text-[#22261F]">{data.annualRainfallMm} mm/year</span>
                  </div>
                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">Mean Annual Temp</span>
                    <span className="font-semibold text-[#22261F]">{data.avgTemperatureC} °C</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Soil Profile Meter */}
            <div className="border border-[#E4E0D3] rounded-2xl p-4 bg-white space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E4E0D3]">
                <h3 className="text-xs font-serif font-bold text-[#22261F]">FAO Soil Diagnostic Profile</h3>
                <span className="text-[9px] font-mono bg-[#DCE6D6] px-2 py-0.5 rounded-full text-[#123425] uppercase font-bold">
                  {data.faoSoilClassification}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-mono mb-1">
                    <span className="text-[#4A5147] uppercase text-[9px]">Active Soil pH</span>
                    <span className="font-bold text-[#22261F]">{data.soilPh} pH</span>
                  </div>
                  {/* pH Slider */}
                  <div className="h-2 bg-[#F7F4EC] rounded-full relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        data.soilPh < 5.5 ? 'bg-[#A9552E]' : data.soilPh > 7.5 ? 'bg-indigo-600' : 'bg-[#1F4D36]'
                      }`}
                      style={{ width: `${(data.soilPh / 14) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-[#92A88C] mt-1">
                    <span>4.0 Acidic</span>
                    <span>7.0 Neutral</span>
                    <span>10.0 Alkaline</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between font-mono mb-1">
                      <span className="text-[#4A5147] uppercase text-[9px]">Soil Organic Carbon (SOC)</span>
                      <span className="font-bold text-[#22261F]">{data.organicCarbonPercent}%</span>
                    </div>
                    <div className="h-2 bg-[#F7F4EC] rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-[#1F4D36] rounded-full"
                        style={{ width: `${Math.min((data.organicCarbonPercent / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[#92A88C] block text-[9px] uppercase font-mono">USDA Textural Matrix</span>
                    <span className="font-bold text-[#22261F]">{data.soilType}</span>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-[#F7F4EC]/50 border border-[#E4E0D3]/40 p-2 rounded-xl">
                    <span className="text-[#92A88C] block text-[8px] uppercase">N (Nitrogen)</span>
                    <span className="font-bold text-[#1F4D36]">{data.nitrogenLevel}</span>
                  </div>
                  <div className="bg-[#F7F4EC]/50 border border-[#E4E0D3]/40 p-2 rounded-xl">
                    <span className="text-[#92A88C] block text-[8px] uppercase">P (Phosphorus)</span>
                    <span className="font-bold text-[#A9552E]">{data.phosphorusLevel}</span>
                  </div>
                  <div className="bg-[#F7F4EC]/50 border border-[#E4E0D3]/40 p-2 rounded-xl">
                    <span className="text-[#92A88C] block text-[8px] uppercase">K (Potassium)</span>
                    <span className="font-bold text-[#E3A23C]">{data.potassiumLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* World Bank Economic Stats */}
            <div className="border border-[#E4E0D3] rounded-2xl p-4 bg-white space-y-3">
              <span className="text-xs font-serif font-bold text-[#22261F] block">World Bank Macroeconomic Indicators</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.worldBankStats.map((stat, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F4EC]/40 rounded-xl border border-[#E4E0D3]/30">
                    <span className="text-[#92A88C] text-[9px] uppercase font-mono leading-tight block h-5 overflow-hidden">
                      {stat.indicator}
                    </span>
                    <span className="text-xs font-bold text-[#22261F] font-mono mt-1 block">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planting Calendar Suite */}
            <div className="border border-[#E4E0D3] rounded-2xl p-4 bg-white space-y-3">
              <span className="text-xs font-serif font-bold text-[#22261F] block">Seasonal Planting Suitability Index</span>
              <div className="space-y-2">
                {data.plantingCalendar.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-xs font-mono py-1.5 border-b border-[#F7F4EC] last:border-0">
                    <span className="font-bold text-[#1F4D36] min-w-[70px]">{item.month}</span>
                    <span className="text-[#4A5147] text-right text-[11px] leading-tight flex-1">
                      {item.suitability}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Advisor Advisory Box */}
            <div className="p-4 bg-[#123425] text-[#F7F4EC] rounded-2xl space-y-3.5 border border-[#1F4D36]/40">
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#92A88C] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>INTEGRATED SYSTEM ADVISORY</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {data.generalAdvisory}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 items-center border-t border-white/10">
                <span className="text-[9px] text-[#92A88C] font-mono">Recommended Crops:</span>
                {data.topCrops.map((crop) => (
                  <span key={crop} className="text-[9px] font-mono bg-white/10 border border-white/10 text-white px-2 py-0.5 rounded-full">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
