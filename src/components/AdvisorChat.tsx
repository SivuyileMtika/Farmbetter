import React, { useState, useRef, useEffect } from 'react';
import { Province } from '../types';
import { Send, Sparkles, Loader2, ArrowRight, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AdvisorChatProps {
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
};

const SUGGESTED_QUESTIONS = [
  {
    q: 'How to make pest spray at home?',
    answer: `**Dumela! Here is how to make an effective, low-cost organic insect spray using simple ingredients found around your South African home:**

### 1. Chilli, Garlic & Onion Spray (For Aphids, caterpillars & whiteflies)
* **What you need:** 2 hot chillies (cayenne or bird's eye), 1 bulb of garlic, 1 small onion, and 1 litre of water.
* **How to make it:** 
  1. Blend or chop the garlic, onion, and chillies very finely.
  2. Mix into the 1 litre of water and let it sit (steep) overnight (12-24 hours).
  3. Strain the mixture through a clean pantyhose or fine cloth into a bottle.
  4. Add 1 teaspoon of standard dishwashing liquid (like Sunlight liquid) - this helps the spray stick to leaf surfaces.
* **How to apply:** Spray directly on both top and bottom of affected leaves early in the morning or late afternoon (avoid midday sun to prevent leaf-scorch).

### 2. Baking Soda Spray (Excellent for powdery mildew fungus)
* Mix 1 tablespoon of baking soda with 1 teaspoon of Sunlight dishwashing liquid in 4 litres of clean water. Spray once a week on winter leafy greens.
* Keep soil weed-free to ensure proper airflow!`
  },
  {
    q: 'Organic fertilizer tips for maize?',
    answer: `**To boost your Maize (Mielies) yield using organic or low-cost fertilizers common in South African smallholding contexts, follow these agronomist steps:**

### 1. Use Animal Manure (The foundation)
* **Chicken Composted Manure:** High in nitrogen. Apply only *fully composted* chicken manure 2-3 weeks before planting. Fresh manure will burn young seeds.
* **Kraal Manure:** Excellent for soil structure. Dig plenty of dry kraal manure deep into your soil beds during land preparation.

### 2. Green Manure & Cover Crops
* Rotate maize lands with **cowpeas, dry beans, or groundnuts**. These legumes naturally "fix" nitrogen from the air into the soil, reducing your LAN fertilizer requirements for the next season.

### 3. Compost Tea (For liquid feeding)
* Fill a large sack with kraal manure, submerge it in a 200-litre water drum for 10-14 days. 
* Dilute the resulting dark liquid with clean water until it looks like weak black tea, and use it to irrigate young maize plants at week 4 and week 8. This provides rapid organic nutrient delivery!`
  },
  {
    q: 'How do I control Fall Armyworm?',
    answer: `**Fall Armyworm (FAW) is a major threat to South African summer Maize. Controlling it on a smallholder budget requires quick, daily scouting and a combination of tactics:**

### 1. Daily Land Scouting (Critical)
* Walk your fields twice a week starting 10 days after germination. Look for "windowpane" leaf damage (tiny see-through patches) or sawdust-like waste inside the whorl (funnel) of the plant.

### 2. Low-Cost Physical Controls
* **Handpicking:** For plots under 0.5 hectares, physically remove and crush egg masses and caterpillars.
* **Dry Sand application:** Pour a small pinch of dry soil or wood ash directly into the center whorl (funnel) of infected maize plants. This suffocates the hidden caterpillar.

### 3. Biological & Safe Sprays
* Apply **Bacillus thuringiensis (Bt)** organic biological spray while larvae are small.
* **Neem oil spray:** Spray weekly into the leaf whorls.`
  }
];

export default function AdvisorChat({ selectedProvince, onLogAction }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Dumela! I am **Sipho**, your AgriApp AI Agronomist companion. 

How can I help you succeed with your crops in **${selectedProvince}** today? Ask me about planting cycles, soil preparation, pest control, or organic fertilizers!`
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setError(null);
    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);
    
    onLogAction(`AI_ADVISORY_QUERY_START: "${textToSend}"`);

    try {
      const response = await fetch('/api/advise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: textToSend,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          province: selectedProvince
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Server connection failed.');
      }

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      onLogAction(`AI_ADVISORY_QUERY_SUCCESS: Received diagnostic recommendation`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect. AI advisor may be offline.');
      onLogAction(`AI_ADVISORY_QUERY_FALLBACK: Invoking client-side agronomical heuristics`);
      
      const lowerText = textToSend.toLowerCase();
      let fallbackText = "I apologize, but my online AI Advisor engine is temporarily busy. Here is a helpful general smallholder guide: Ensure your soil is mulched, water in the mornings, and rotate crops between leafy greens and root tubers every season to protect your soil health!";
      
      if (lowerText.includes('spray') || lowerText.includes('pest') || lowerText.includes('chilli') || lowerText.includes('garlic')) {
        fallbackText = SUGGESTED_QUESTIONS[0].answer;
      } else if (lowerText.includes('fertilizer') || lowerText.includes('manure') || lowerText.includes('compost')) {
        fallbackText = SUGGESTED_QUESTIONS[1].answer;
      } else if (lowerText.includes('armyworm') || lowerText.includes('fall') || lowerText.includes('maize')) {
        fallbackText = SUGGESTED_QUESTIONS[2].answer;
      }

      setMessages(prev => [...prev, { role: 'model', text: `*[Offline Mode Heuristics]* \n\n${fallbackText}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div id="advisor-chat-panel" className="space-y-4 flex flex-col h-[520px] bg-white rounded-3xl border border-[#E4E0D3] p-4 shadow-sm">
      
      {/* Advisor Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-[#E4E0D3]/60 shrink-0">
        <div className="relative">
          <div style={{ background: COLORS.forest }} className="w-10 h-10 rounded-full text-white font-serif font-black flex items-center justify-center text-sm shadow-sm">
            S
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <h3 className="text-sm font-serif font-bold text-[#22261F]">Sipho Chat</h3>
          <p className="text-[10px] text-[#4A5147] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E3A23C]" />
            <span>AI Smallholder Specialist</span>
          </p>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 text-xs leading-relaxed">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              style={{
                background: m.role === 'user' ? COLORS.forest : '#F7F4EC',
                color: m.role === 'user' ? '#FFFFFF' : '#22261F',
                borderColor: m.role === 'user' ? COLORS.forest : '#E4E0D3'
              }}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs whitespace-pre-line border ${
                m.role === 'user'
                  ? 'rounded-tr-none'
                  : 'rounded-tl-none font-medium'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F7F4EC] rounded-2xl rounded-tl-none px-4 py-3 border border-[#E4E0D3] flex items-center gap-2 text-[#4A5147] font-semibold shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1F4D36]" />
              <span>Sipho is writing tips...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Topics Tags */}
      {messages.length < 4 && (
        <div className="shrink-0 space-y-1.5 pt-2 border-t border-[#E4E0D3]/60">
          <p className="text-[9px] text-[#4A5147] font-bold uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#92A88C]" />
            <span>Suggested Inquiries</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.q)}
                disabled={loading}
                className="bg-[#F7F4EC] hover:bg-[#DCE6D6] border border-[#E4E0D3] text-[10px] text-[#22261F] px-2.5 py-1.5 rounded-xl font-bold text-left transition-all cursor-pointer disabled:opacity-50 flex items-center justify-between gap-1"
              >
                <span>{item.q}</span>
                <ArrowRight className="w-3 h-3 text-[#92A88C] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSubmit} className="shrink-0 flex gap-2 pt-2 border-t border-[#E4E0D3]/60">
        <label htmlFor="agri-chat-box" className="sr-only">Type your farming query</label>
        <input
          id="agri-chat-box"
          type="text"
          placeholder="Ask Sipho a farming question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          className="flex-1 bg-[#F7F4EC]/30 border border-[#E4E0D3] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#22261F] placeholder:text-[#92A88C] focus:outline-none focus:ring-1 focus:ring-[#1F4D36]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          style={{ background: COLORS.forest }}
          className="hover:opacity-95 text-white disabled:bg-gray-100 disabled:text-gray-400 px-4 py-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 active:scale-95"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
