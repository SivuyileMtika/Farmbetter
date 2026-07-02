import React, { useState } from 'react';
import { CROPS as cropsData, PROVINCES as provincesData, PROVINCE_WEATHER as weatherData } from '../data';
import { PhoneCall, WifiOff, Delete } from 'lucide-react';

type USSDState = 
  | 'idle'
  | 'dialing'
  | 'menu_main'
  | 'menu_weather'
  | 'menu_weather_result'
  | 'menu_prices'
  | 'menu_crops'
  | 'menu_callback'
  | 'menu_error';

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

export default function UssdSimulator() {
  const [ussdCode, setUssdCode] = useState<string>('*120*2474#'); // *120*AGRI#
  const [sessionState, setSessionState] = useState<USSDState>('idle');
  const [userInput, setUserInput] = useState<string>('');
  const [selectedProvinceIdx, setSelectedProvinceIdx] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  
  const dialPadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const handleKeyPress = (key: string) => {
    if (sessionState === 'idle') {
      setUssdCode(prev => prev + key);
    } else {
      setUserInput(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    if (sessionState === 'idle') {
      setUssdCode(prev => prev.slice(0, -1));
    } else {
      setUserInput(prev => prev.slice(0, -1));
    }
  };

  const handleDial = () => {
    if (ussdCode.trim() === '*120*2474#') {
      setSessionState('menu_main');
      setUserInput('');
      setFeedbackMsg('');
    } else {
      setSessionState('menu_error');
    }
  };

  const handleCancel = () => {
    setSessionState('idle');
    setUssdCode('*120*2474#');
    setUserInput('');
  };

  const handleSend = () => {
    const choice = userInput.trim();
    setUserInput('');

    if (sessionState === 'menu_main') {
      if (choice === '1') {
        setSessionState('menu_weather');
      } else if (choice === '2') {
        setSessionState('menu_prices');
      } else if (choice === '3') {
        setSessionState('menu_crops');
      } else if (choice === '4') {
        setSessionState('menu_callback');
      } else {
        setFeedbackMsg('Invalid choice. Enter 1-4.');
      }
    } 
    else if (sessionState === 'menu_weather') {
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < provincesData.length) {
        setSelectedProvinceIdx(idx);
        setSessionState('menu_weather_result');
      } else {
        setFeedbackMsg(`Invalid. Enter 1-${provincesData.length}.`);
      }
    }
    else if (sessionState === 'menu_weather_result' || sessionState === 'menu_prices' || sessionState === 'menu_crops' || sessionState === 'menu_callback') {
      setSessionState('menu_main');
    }
    else if (sessionState === 'menu_error') {
      setSessionState('idle');
    }
  };

  return (
    <div id="ussd-simulator-panel" className="space-y-5">
      
      {/* Intro Context Banner */}
      <div className="bg-[#F7F4EC] border border-[#E4E0D3] rounded-3xl p-5 space-y-2">
        <h3 className="text-xs font-bold text-[#1F4D36] uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <WifiOff className="w-4 h-4 text-[#A9552E] animate-pulse" />
          <span>Interactive Offline USSD Simulator</span>
        </h3>
        <p className="text-xs text-[#4A5147] leading-relaxed font-semibold">
          Smallholder farmers in remote South African districts often leverage cost-free USSD channels due to expensive mobile data. Dial the default system code <strong className="text-[#1F4D36] font-mono">*120*2474#</strong> on the keypad below to query real-time market averages, provincial advisories, or agronomist callbacks.
        </p>
      </div>

      {/* Virtual Handset */}
      <div className="flex justify-center py-2">
        <div className="w-[285px] bg-[#22261F] rounded-[40px] p-4.5 shadow-lg border-4 border-[#4A5147] relative">
          
          {/* Speaker notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#4A5147] rounded-full flex items-center justify-center">
            <span className="w-6 h-1 bg-[#22261F] rounded-full" />
          </div>

          {/* Liquid Crystal retro USSD display */}
          <div className="bg-[#F7F4EC] rounded-2xl p-4 border border-[#E4E0D3] min-h-[210px] font-mono text-xs text-[#22261F] flex flex-col justify-between shadow-inner mt-2.5">
            
            {/* Carrier signal banner */}
            <div className="flex justify-between items-center text-[10px] text-[#4A5147] font-bold border-b border-[#E4E0D3] pb-1.5 mb-2">
              <span>MTN-SA</span>
              <span>📶 EDGE 12:45</span>
            </div>

            {/* Content Thread based on state */}
            <div className="flex-1 flex flex-col justify-center">
              {sessionState === 'idle' && (
                <div className="text-center py-4 space-y-2">
                  <p className="text-[10px] text-[#92A88C] uppercase tracking-wider font-bold">Ready to Dial</p>
                  <p className="text-lg font-bold tracking-wider bg-white/70 py-1.5 rounded-xl border border-[#E4E0D3] text-[#1F4D36]">
                    {ussdCode || ' '}
                  </p>
                  <p className="text-[9px] text-[#A9552E] font-bold">
                    Dial *120*2474# to begin
                  </p>
                </div>
              )}

              {sessionState === 'menu_main' && (
                <div className="space-y-1">
                  <p className="font-bold text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5 text-[10px]">AgriApp Mobile Portal:</p>
                  <p>1. Local Weather Advisory</p>
                  <p>2. ZAR Crop Prices</p>
                  <p>3. Top Winter Crops</p>
                  <p>4. Request Callback</p>
                  {feedbackMsg && <p className="text-[9px] text-[#B84A3A] font-bold mt-1">{feedbackMsg}</p>}
                </div>
              )}

              {sessionState === 'menu_weather' && (
                <div className="space-y-1">
                  <p className="font-bold text-[10px] text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5">Select Province:</p>
                  <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[10px]">
                    {provincesData.slice(0, 6).map((p, index) => (
                      <p key={p.province}>{index + 1}. {p.province.substring(0, 10)}</p>
                    ))}
                  </div>
                  {feedbackMsg && <p className="text-[9px] text-[#B84A3A] font-bold mt-0.5">{feedbackMsg}</p>}
                </div>
              )}

              {sessionState === 'menu_weather_result' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-[10px] text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5">
                    Weather: {provincesData[selectedProvinceIdx].province}
                  </p>
                  <p className="text-[10px] leading-tight">
                    Temp: {weatherData[provincesData[selectedProvinceIdx].province].temp}°C | {weatherData[provincesData[selectedProvinceIdx].province].condition}
                  </p>
                  <p className="text-[10px] leading-relaxed text-[#1F4D36] bg-[#DCE6D6] p-1.5 rounded-lg">
                    {weatherData[provincesData[selectedProvinceIdx].province].advice.substring(0, 75)}...
                  </p>
                  <p className="text-[9px] text-[#4A5147] text-right mt-1">Press any key to return</p>
                </div>
              )}

              {sessionState === 'menu_prices' && (
                <div className="space-y-0.5 text-[10px]">
                  <p className="font-bold text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5">ZAR Market Prices (per kg):</p>
                  {cropsData.slice(0, 5).map((crop) => (
                    <div key={crop.id} className="flex justify-between">
                      <span>{crop.name} ({crop.localName}):</span>
                      <span className="font-bold">R{crop.avgPriceZAR.toFixed(1)}</span>
                    </div>
                  ))}
                  <p className="text-[9px] text-[#4A5147] text-right mt-1.5">Press any key to return</p>
                </div>
              )}

              {sessionState === 'menu_crops' && (
                <div className="space-y-1">
                  <p className="font-bold text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5">Recommended Crops:</p>
                  <p className="leading-relaxed text-[10px]">
                    Frost-resistant selections: Cabbage (kool), Spinach (spinasie), Winter Potatoes (aartappels).
                  </p>
                  <p className="text-[9px] text-[#4A5147] text-right mt-2">Press any key to return</p>
                </div>
              )}

              {sessionState === 'menu_callback' && (
                <div className="space-y-1.5">
                  <p className="font-bold text-[#1F4D36] border-b border-[#E4E0D3] pb-0.5">Request Callback</p>
                  <p className="text-[10px] leading-relaxed">
                    Dumela! Your callback has been logged successfully. An agronomist will contact you on your mobile line shortly.
                  </p>
                  <p className="text-[9px] text-[#4A5147] text-right">Press any key to return</p>
                </div>
              )}

              {sessionState === 'menu_error' && (
                <div className="text-center space-y-1 py-4">
                  <p className="font-bold text-[#B84A3A]">MMI Dial Error</p>
                  <p className="text-[10px]">Invalid code format or coverage dropout.</p>
                  <p className="text-[9px] text-[#4A5147]">Press dial/back to reset</p>
                </div>
              )}
            </div>

            {/* Input fields in-session */}
            {sessionState !== 'idle' && (
              <div className="border-t border-[#E4E0D3] pt-2 mt-2 flex flex-col gap-1.5">
                {(sessionState === 'menu_main' || sessionState === 'menu_weather') && (
                  <div className="flex items-center bg-white px-2 py-1 rounded-lg border border-[#E4E0D3]">
                    <span className="text-[#92A88C] mr-1 font-bold">&gt;</span>
                    <input
                      type="text"
                      readOnly
                      placeholder="Enter option"
                      value={userInput}
                      className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-[#22261F] pointer-events-none"
                    />
                  </div>
                )}

                <div className="flex gap-1.5 text-[10px] font-sans font-bold">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-[#B84A3A] text-white py-1 rounded-lg border border-[#B84A3A]/20 shadow-xs active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    style={{ background: COLORS.forest }}
                    className="flex-1 text-white py-1 rounded-lg border border-[#1F4D36]/20 shadow-xs active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Keypad dialpad */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-white font-sans">
            {dialPadKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="bg-[#4A5147]/40 hover:bg-[#4A5147]/60 active:bg-[#4A5147] h-9.5 rounded-xl flex items-center justify-center font-bold text-xs border border-white/5 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                {key}
              </button>
            ))}

            <button
              onClick={handleBackspace}
              className="bg-[#4A5147]/40 hover:bg-[#4A5147]/60 active:bg-[#4A5147] h-9.5 rounded-xl flex items-center justify-center border border-white/5 shadow-xs cursor-pointer active:scale-95 transition-all"
              title="Backspace"
            >
              <Delete className="w-3.5 h-3.5 text-white/60" />
            </button>

            <button
              onClick={handleDial}
              disabled={sessionState !== 'idle'}
              style={{ background: COLORS.forest }}
              className="col-span-2 hover:opacity-95 disabled:bg-[#4A5147]/40 disabled:text-white/30 h-9.5 rounded-xl flex items-center justify-center gap-1 font-bold text-[10px] shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>DIAL CODE</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
