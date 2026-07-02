import React, { useState, useEffect } from 'react';
import { FarmLog } from '../types';
import { CROPS } from '../data';
import { BookOpen, Calendar, Plus, Trash2, Tag, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
};

const LOG_PRESETS: FarmLog[] = [
  {
    id: 'log-1',
    date: '2026-06-25',
    cropId: 'maize',
    activityType: 'planting',
    notes: 'Planted 2 hectares of maize seeds using row marker cords. Weather was warm and soil had great pre-rain moisture.',
    quantity: '100 000 seeds'
  },
  {
    id: 'log-2',
    date: '2026-06-28',
    cropId: 'spinach',
    activityType: 'fertilizer',
    notes: 'Applied organic compost tea and dressed with light LAN nitrogen fertilizer on spinach beds to boost green leaves development.',
    quantity: '5 bags compost'
  },
  {
    id: 'log-3',
    date: '2026-07-01',
    cropId: 'cabbages',
    activityType: 'watering',
    notes: 'Watered winter cabbage transplant beds in the morning. Frost protective nets are set.',
    quantity: '2 hours drip'
  }
];

export default function FarmLogbook() {
  const [logs, setLogs] = useState<FarmLog[]>([]);
  const [cropId, setCropId] = useState<string>(CROPS[0].id);
  const [activityType, setActivityType] = useState<FarmLog['activityType']>('planting');
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load logs on mount
  useEffect(() => {
    const saved = localStorage.getItem('agri_farm_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        setLogs(LOG_PRESETS);
      }
    } else {
      setLogs(LOG_PRESETS);
      localStorage.setItem('agri_farm_logs', JSON.stringify(LOG_PRESETS));
    }
  }, []);

  const saveLogs = (newLogs: FarmLog[]) => {
    setLogs(newLogs);
    localStorage.setItem('agri_farm_logs', JSON.stringify(newLogs));
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const newLog: FarmLog = {
      id: `log-${Date.now()}`,
      date,
      cropId,
      activityType,
      notes: notes.trim(),
      quantity: quantity.trim() || undefined
    };

    const updated = [newLog, ...logs];
    saveLogs(updated);

    setNotes('');
    setQuantity('');
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    saveLogs(updated);
  };

  const getActivityColor = (type: FarmLog['activityType']) => {
    switch (type) {
      case 'planting': return 'bg-[#DCE6D6] text-[#123425] border-[#92A88C]/30';
      case 'watering': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'fertilizer': return 'bg-[#FBEAD1] text-[#7C3D20] border-[#E3A23C]/20';
      case 'harvest': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'diagnostic': return 'bg-[#F6DEDA] text-[#B84A3A] border-[#B84A3A]/10';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div id="farm-logbook" className="space-y-5">
      
      {/* Log Form Card */}
      <div className="bg-white rounded-3xl border border-[#E4E0D3] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-serif font-bold text-[#22261F] flex items-center gap-1.5">
          <BookOpen className="w-4.5 h-4.5" style={{ color: COLORS.forest }} />
          <span>Record Daily Farm Activity</span>
        </h3>

        <form onSubmit={handleAddLog} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="space-y-1">
              <label htmlFor="logbook-date" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Date</label>
              <input
                id="logbook-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold bg-[#F7F4EC]/40 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            {/* Crop Select */}
            <div className="space-y-1">
              <label htmlFor="logbook-crop" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Associated Crop</label>
              <select
                id="logbook-crop"
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="w-full text-xs font-semibold bg-[#F7F4EC]/40 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
              >
                {CROPS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Activity Type */}
            <div className="space-y-1">
              <label htmlFor="logbook-activity" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Activity Type</label>
              <select
                id="logbook-activity"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as FarmLog['activityType'])}
                className="w-full text-xs font-semibold bg-[#F7F4EC]/40 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
              >
                <option value="planting">Planting</option>
                <option value="watering">Watering</option>
                <option value="fertilizer">Fertilization</option>
                <option value="harvest">Harvesting</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="other">Other / Maintenance</option>
              </select>
            </div>

            {/* Quantity / Scale */}
            <div className="space-y-1">
              <label htmlFor="logbook-quantity" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Quantity / Details</label>
              <input
                id="logbook-quantity"
                type="text"
                placeholder="e.g. 5 bags, 2 hours, 10kg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-xs font-semibold bg-[#F7F4EC]/40 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-[#1F4D36]"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="logbook-notes" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Notes & Observations</label>
            <textarea
              id="logbook-notes"
              rows={2}
              placeholder="Record crop leaf condition, soil humidity, insect sightings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC]/40 border border-[#E4E0D3] rounded-xl p-3 focus:outline-none placeholder:text-[#92A88C]"
            />
          </div>

          <button
            type="submit"
            style={{ background: COLORS.forest }}
            className="w-full text-white font-bold py-3 px-4 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Log Entry</span>
          </button>
        </form>
      </div>

      {/* History Notebook */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#22261F] flex items-center gap-1.5">
            <ClipboardList className="w-4.5 h-4.5" style={{ color: COLORS.soil }} />
            <span>My Farm Notebook</span>
          </h3>
          <span className="text-[10px] bg-[#DCE6D6] text-[#123425] font-bold px-2 py-0.5 rounded-full font-mono">
            {logs.length} entries
          </span>
        </div>

        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-8 bg-[#F7F4EC]/35 rounded-2xl border border-[#E4E0D3]">
              <ClipboardList className="w-8 h-8 text-[#92A88C] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#4A5147] font-bold">Notebook is empty</p>
              <p className="text-[10px] text-[#92A88C]">Log your first farm activity above!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {logs.map((log) => {
                const crop = CROPS.find(c => c.id === log.cropId);
                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-[#E4E0D3] p-3.5 shadow-xs hover:shadow-sm transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-[10px] text-[#4A5147] font-mono">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#92A88C]" />
                          <span>{log.date}</span>
                        </div>
                        {crop && (
                          <span className="text-[9px] font-bold bg-[#DCE6D6] text-[#123425] px-1.5 py-0.5 rounded-md">
                            {crop.name}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getActivityColor(log.activityType)}`}>
                          {log.activityType}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-[#92A88C] hover:text-[#B84A3A] p-1 rounded-md hover:bg-[#F6DEDA]/45 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#22261F] leading-relaxed font-medium">
                      {log.notes}
                    </p>

                    {log.quantity && (
                      <div className="flex items-center gap-1 bg-[#F7F4EC]/60 w-fit px-2 py-0.5 rounded-lg text-[10px] text-[#4A5147] font-bold border border-[#E4E0D3]/40">
                        <Tag className="w-3 h-3 text-[#92A88C]" />
                        <span>Qty: {log.quantity}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

    </div>
  );
}
