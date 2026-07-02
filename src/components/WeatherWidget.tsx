import React from 'react';
import { Province, ProvinceData, WeatherData } from '../types';
import { CloudRain, Sun, Cloud, Wind, Thermometer, Droplets, MapPin, Compass, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { PROVINCES as provincesData, PROVINCE_WEATHER as provinceWeatherData, CROPS } from '../data';

interface WeatherWidgetProps {
  selectedProvince: Province;
  onProvinceChange: (province: Province) => void;
}

export default function WeatherWidget({ selectedProvince, onProvinceChange }: WeatherWidgetProps) {
  const currentProvinceData = provincesData.find((p) => p.province === selectedProvince)!;
  const weather = provinceWeatherData[selectedProvince];

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) {
      return <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />;
    }
    if (cond.includes('showers') || cond.includes('rain')) {
      return <CloudRain className="w-10 h-10 text-blue-500 animate-bounce" />;
    }
    if (cond.includes('cloudy') || cond.includes('cloud')) {
      return <Cloud className="w-10 h-10 text-gray-400" />;
    }
    return <Sun className="w-10 h-10 text-amber-500" />;
  };

  const getProvinceCrops = () => {
    return CROPS.filter(crop => currentProvinceData.idealCropsNow.includes(crop.id));
  };

  return (
    <div id="weather-section" className="space-y-4">
      {/* Province Selector Header */}
      <div id="province-header-card" className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-300" />
            <span className="font-semibold text-lg">My Province</span>
          </div>
          <span className="text-xs bg-emerald-700 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-600/50">
            South Africa
          </span>
        </div>
        
        <div>
          <label htmlFor="province-selector" className="sr-only">Select Province</label>
          <select
            id="province-selector"
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value as Province)}
            className="w-full bg-white text-emerald-950 font-medium py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-emerald-700 shadow-inner"
          >
            {provincesData.map((p) => (
              <option key={p.province} value={p.province}>
                {p.province}
              </option>
            ))}
          </select>
        </div>
        
        <p className="text-xs text-emerald-200/90 leading-relaxed flex items-start gap-1">
          <Compass className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span><strong>Climate:</strong> {currentProvinceData.climateZone}</span>
        </p>
      </div>

      {/* Local Weather Status Card */}
      <div id="weather-status-card" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Today's Local Weather</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">{weather.temp}</span>
                <span className="text-lg font-semibold text-gray-500">°C</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">{weather.condition}</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 rounded-full">
            {currentProvinceData.currentSeason}
          </span>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50 text-center">
          <div className="space-y-1 p-2 bg-gray-50/50 rounded-xl">
            <div className="flex justify-center text-blue-500">
              <CloudRain className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Rain Prob.</p>
            <p className="text-sm font-bold text-gray-800">{weather.rainProbability}%</p>
          </div>
          <div className="space-y-1 p-2 bg-gray-50/50 rounded-xl">
            <div className="flex justify-center text-sky-500">
              <Droplets className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Humidity</p>
            <p className="text-sm font-bold text-gray-800">{weather.humidity}%</p>
          </div>
          <div className="space-y-1 p-2 bg-gray-50/50 rounded-xl">
            <div className="flex justify-center text-teal-600">
              <Wind className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">Wind Speed</p>
            <p className="text-sm font-bold text-gray-800">{weather.windSpeed} km/h</p>
          </div>
        </div>

        {/* Smallholder Weather Advice Banner */}
        <div className="mt-3.5 bg-emerald-50/70 border border-emerald-100/50 rounded-xl p-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-950 leading-relaxed font-medium">
            {weather.advice}
          </p>
        </div>
      </div>

      {/* Recommended Crops Section */}
      <div id="crops-recommendations" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center justify-between">
          <span>What to Plant Now (July)</span>
          <span className="text-xs text-emerald-700 bg-emerald-50 font-medium px-2 py-0.5 rounded-md">Optimal</span>
        </h3>
        
        <div className="space-y-2.5">
          {getProvinceCrops().map((crop) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={crop.id}
              className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-emerald-50/20 hover:border-emerald-100/50 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {crop.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{crop.name} <span className="text-xs text-emerald-700 font-normal">({crop.localName})</span></h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{crop.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-800">R {crop.avgPriceZAR.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400">per {crop.unit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Provincial Agronomical Tips */}
      <div id="provincial-tips" className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-100/60 shadow-sm">
        <h3 className="text-sm font-bold text-amber-900 mb-2.5 flex items-center gap-1.5">
          <Thermometer className="w-4 h-4 text-amber-700" />
          <span>Agronomic Advisory for {selectedProvince}</span>
        </h3>
        <ul className="space-y-2">
          {currentProvinceData.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-amber-950 font-medium leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
