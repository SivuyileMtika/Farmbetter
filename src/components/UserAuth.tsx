import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, MapPin, ArrowRight, Leaf, HelpCircle } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  location: string;
  joinedAt: string;
}

interface UserAuthProps {
  onLoginSuccess: (user: UserProfile) => void;
  onLogAction: (action: string) => void;
}

const COLORS = {
  forest: "#1F4D36",
  forestDark: "#123425",
  soil: "#A9552E",
  gold: "#E3A23C",
  cream: "#F7F4EC",
  card: "#FFFFFF",
  charcoal: "#22261F",
  ink: "#4A5147",
  sage: "#92A88C",
  sageLight: "#DCE6D6",
  line: "#E4E0D3",
};

const PROVINCES = [
  "Gauteng",
  "KwaZulu-Natal",
  "Western Cape",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Free State",
  "Northern Cape"
];

export default function UserAuth({ onLoginSuccess, onLogAction }: UserAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Required fields are missing.');
      setLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setError('Please provide your name.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        name: isSignUp ? name : email.split('@')[0],
        email: email,
        location: isSignUp ? `${province}, South Africa` : 'Gauteng, South Africa',
        joinedAt: new Date().toLocaleDateString('en-ZA')
      };
      
      localStorage.setItem('agri_user_profile', JSON.stringify(user));
      onLogAction(`USER_AUTHENTICATION_${isSignUp ? 'SIGNUP' : 'SIGNIN'}_SUCCESS: Email: ${email}`);
      onLoginSuccess(user);
    }, 800);
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#E4E0D3] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(31,77,54,0.08)] p-8 space-y-6">
      
      {/* Visual Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-[#DCE6D6] rounded-2xl border border-[#92A88C]/30 text-[#1F4D36]">
          <Leaf className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-[#22261F] tracking-tight">
          {isSignUp ? 'Begin Farming Smarter' : 'Sign In to Your Farm'}
        </h2>
        <p className="text-xs text-[#4A5147] max-w-xs mx-auto leading-relaxed">
          Access high-precision agrometeorological stats, real-time crop disease diagnosis, and community insights tailored to your South African zone.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#F6DEDA] border border-[#B84A3A]/20 rounded-xl text-xs text-[#B84A3A] font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#B84A3A] rounded-full shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4A5147] uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#92A88C]">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Thabo Nkosi"
                className="w-full pl-9 pr-3 py-2 border border-[#E4E0D3] rounded-xl text-sm bg-[#F7F4EC]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F4D36] focus:border-[#1F4D36] transition-all placeholder:text-[#92A88C]/70"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4A5147] uppercase tracking-wider block">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#92A88C]">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@domain.co.za"
              className="w-full pl-9 pr-3 py-2 border border-[#E4E0D3] rounded-xl text-sm bg-[#F7F4EC]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F4D36] focus:border-[#1F4D36] transition-all placeholder:text-[#92A88C]/70"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#4A5147] uppercase tracking-wider block">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#92A88C]">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 border border-[#E4E0D3] rounded-xl text-sm bg-[#F7F4EC]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F4D36] focus:border-[#1F4D36] transition-all placeholder:text-[#92A88C]/70"
              required
            />
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4A5147] uppercase tracking-wider block">Province / Agro-Ecological Zone</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#92A88C]">
                <MapPin className="w-4 h-4" />
              </span>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-[#E4E0D3] rounded-xl text-sm bg-[#F7F4EC]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F4D36] focus:border-[#1F4D36] transition-all appearance-none"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ background: COLORS.forest }}
          className="w-full text-white font-semibold py-3 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-90 active:scale-[0.98]"
        >
          {loading ? 'Processing...' : isSignUp ? 'Register & Enter' : 'Secure Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="border-t border-[#E4E0D3]/60 pt-4 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-xs text-[#1F4D36] hover:text-[#123425] font-semibold underline"
        >
          {isSignUp ? 'Already registered? Sign in here' : 'New to WeFarm? Create a farm account'}
        </button>
      </div>

    </div>
  );
}
