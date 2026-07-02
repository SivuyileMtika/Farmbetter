import React, { useState, useEffect } from 'react';
import { Province, TrackedPlant, TrackedAnimal, FarmLog } from './types';
import WeatherWidget from './components/WeatherWidget';
import DiagnosticScanner from './components/DiagnosticScanner';
import UssdSimulator from './components/UssdSimulator';
import FarmLogbook from './components/FarmLogbook';
import AdvisorChat from './components/AdvisorChat';
import UserAuth from './components/UserAuth';
import GlobalAgrometPortal from './components/GlobalAgrometPortal';
import TerminalLogs from './components/TerminalLogs';
import { 
  Home as HomeIcon, 
  Sprout, 
  Users, 
  Camera, 
  MessageSquare, 
  User, 
  MapPin, 
  CloudRain, 
  Sun, 
  Cloud, 
  Droplets, 
  Wind, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  LogOut, 
  Settings, 
  Calendar,
  Wifi,
  Battery,
  ShieldCheck,
  Search,
  MessageCircle,
  HelpCircle,
  Clock,
  Compass,
  Activity,
  Heart,
  ChevronRight,
  Database,
  X,
  PlusCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CROPS, PROVINCES } from './data';

interface UserProfile {
  name: string;
  email: string;
  location: string;
  joinedAt: string;
}

interface ForumPost {
  id: string;
  author: string;
  role: string;
  province: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  comments: { author: string; content: string; date: string }[];
  time: string;
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

// Initial local presets to ensure WeFarm is immediately functional and realistic
const INITIAL_CROPS: TrackedPlant[] = [
  {
    id: 'plant-1',
    cropId: 'maize',
    name: 'Main Field Maize',
    plantedDate: '2026-06-15',
    fieldSizeSqM: 500,
    growthProgress: 35,
    wateringDueDays: 1,
    status: 'Healthy'
  },
  {
    id: 'plant-2',
    cropId: 'spinach',
    name: 'Homestead Spinach Beds',
    plantedDate: '2026-06-28',
    fieldSizeSqM: 80,
    growthProgress: 65,
    wateringDueDays: 0,
    status: 'Needs Attention'
  }
];

const INITIAL_ANIMALS: TrackedAnimal[] = [
  {
    id: 'animal-1',
    category: 'Cattle',
    tagId: 'C-0482',
    breed: 'Bonsmara',
    count: 6,
    status: 'Healthy',
    lastLogDate: '2026-07-01'
  },
  {
    id: 'animal-2',
    category: 'Poultry',
    tagId: 'P-Flock1',
    breed: 'Rhode Island Red',
    count: 45,
    status: 'Healthy',
    lastLogDate: '2026-07-02'
  }
];

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Bongani Ndlovu',
    role: 'Smallholder Farmer',
    province: 'Limpopo',
    content: 'Our winter tomatoes are thriving in the Lowveld! Zero frost is a massive blessing here. We are monitoring our soil pH closely and maintaining regular morning watering to avoid fungal leaf diseases.',
    likes: 12,
    likedByUser: false,
    comments: [
      { author: 'Zanele Khumalo', content: 'Incredible Bongani! Are you utilizing organic mulch around your beds?', date: '1 hour ago' },
      { author: 'Sipho (AI Advisor)', content: 'Excellent practice, Bongani. Make sure to watch out for Red Spider Mite as the dry winter spells progress. Morning irrigation is indeed perfect to let the foliage dry off.', date: '30 mins ago' }
    ],
    time: '3 hours ago'
  },
  {
    id: 'post-2',
    author: 'Sanele Gwala',
    role: 'Cooperative Lead',
    province: 'KwaZulu-Natal',
    content: 'Severe dry wind gusts along the Midlands today. Ensure your shade netting and temporary wind barrier structures are anchored securely. Our cabbages are showing light moisture stress, so we bumped up drip irrigation slightly.',
    likes: 8,
    likedByUser: false,
    comments: [],
    time: '5 hours ago'
  }
];

export default function App() {
  const [selectedProvince, setSelectedProvince] = useState<Province>('Gauteng');
  const [activeTab, setActiveTab] = useState<'home' | 'crops' | 'livestock' | 'scan' | 'community' | 'profile'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Local inventories state
  const [trackedPlants, setTrackedPlants] = useState<TrackedPlant[]>([]);
  const [trackedAnimals, setTrackedAnimals] = useState<TrackedAnimal[]>([]);
  const [communityPosts, setCommunityPosts] = useState<ForumPost[]>([]);
  const [dailyWaterLogged, setDailyWaterLogged] = useState<number>(0);

  // Forms states
  const [showAddPlantModal, setShowAddPlantModal] = useState<boolean>(false);
  const [newPlantCrop, setNewPlantCrop] = useState<string>('maize');
  const [newPlantName, setNewPlantName] = useState<string>('');
  const [newPlantSize, setNewPlantSize] = useState<number>(100);

  const [showAddAnimalModal, setShowAddAnimalModal] = useState<boolean>(false);
  const [newAnimalCat, setNewAnimalCat] = useState<'Cattle' | 'Poultry' | 'Goats' | 'Sheep'>('Cattle');
  const [newAnimalBreed, setNewAnimalBreed] = useState<string>('');
  const [newAnimalCount, setNewAnimalCount] = useState<number>(5);

  const [newPostText, setNewPostText] = useState<string>('');
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  // Soil Scanner simulator states
  const [scanMode, setScanMode] = useState<'soil' | 'disease'>('soil');
  const [soilCrop, setSoilCrop] = useState<string>('maize');
  const [soilPh, setSoilPh] = useState<number>(6.2);
  const [soilN, setSoilN] = useState<string>('Medium');
  const [soilP, setSoilP] = useState<string>('Low');
  const [soilK, setSoilK] = useState<string>('High');
  const [soilMoisture, setSoilMoisture] = useState<number>(55);
  const [isSoilScanning, setIsSoilScanning] = useState<boolean>(false);
  const [soilReport, setSoilReport] = useState<any | null>(null);

  // Modals for secondary features
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [showUssdModal, setShowUssdModal] = useState<boolean>(false);
  const [showSiphoFloating, setShowSiphoFloating] = useState<boolean>(false);

  // Onboarding Carousel State
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingName, setOnboardingName] = useState<string>('');
  const [onboardingProvince, setOnboardingProvince] = useState<Province>('Gauteng');

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Logger helper
  const logAction = (action: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const formattedLog = `[${timestamp}] ${action}`;
    setLogs(prev => [formattedLog, ...prev].slice(0, 100));
  };

  // Load from LocalStorage
  useEffect(() => {
    // Audit boot
    logAction("SYSTEM_CORE_INIT: Restoring encrypted memory stack");

    const savedProfile = localStorage.getItem('agri_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        const provinceMatch = parsed.location.split(',')[0].trim() as Province;
        if (PROVINCES.some(p => p.province === provinceMatch)) {
          setSelectedProvince(provinceMatch);
        }
        logAction(`SESSION_RESTORED: Verified smallholder signature for ${parsed.name}`);
      } catch (e) {
        console.error(e);
      }
    } else {
      logAction("AWAITING_REGISTRATION: Launching introductory onboarding portal");
    }

    // Load crops
    const savedPlants = localStorage.getItem('wefarm_plants');
    if (savedPlants) {
      try { setTrackedPlants(JSON.parse(savedPlants)); } catch(e) { setTrackedPlants(INITIAL_CROPS); }
    } else {
      setTrackedPlants(INITIAL_CROPS);
      localStorage.setItem('wefarm_plants', JSON.stringify(INITIAL_CROPS));
    }

    // Load animals
    const savedAnimals = localStorage.getItem('wefarm_animals');
    if (savedAnimals) {
      try { setTrackedAnimals(JSON.parse(savedAnimals)); } catch(e) { setTrackedAnimals(INITIAL_ANIMALS); }
    } else {
      setTrackedAnimals(INITIAL_ANIMALS);
      localStorage.setItem('wefarm_animals', JSON.stringify(INITIAL_ANIMALS));
    }

    // Load posts
    const savedPosts = localStorage.getItem('wefarm_posts');
    if (savedPosts) {
      try { setCommunityPosts(JSON.parse(savedPosts)); } catch(e) { setCommunityPosts(INITIAL_POSTS); }
    } else {
      setCommunityPosts(INITIAL_POSTS);
      localStorage.setItem('wefarm_posts', JSON.stringify(INITIAL_POSTS));
    }

    // Load water
    const savedWater = localStorage.getItem('wefarm_water');
    if (savedWater) {
      setDailyWaterLogged(Number(savedWater));
    }
  }, []);

  // Save changes
  const savePlants = (plants: TrackedPlant[]) => {
    setTrackedPlants(plants);
    localStorage.setItem('wefarm_plants', JSON.stringify(plants));
  };

  const saveAnimals = (animals: TrackedAnimal[]) => {
    setTrackedAnimals(animals);
    localStorage.setItem('wefarm_animals', JSON.stringify(animals));
  };

  const savePosts = (posts: ForumPost[]) => {
    setCommunityPosts(posts);
    localStorage.setItem('wefarm_posts', JSON.stringify(posts));
  };

  // Auth Handling
  const handleOnboardingComplete = () => {
    if (!onboardingName.trim()) return;
    const profile: UserProfile = {
      name: onboardingName.trim(),
      email: `${onboardingName.trim().toLowerCase().replace(/\s+/g, '')}@wefarm.co.za`,
      location: `${onboardingProvince}, South Africa`,
      joinedAt: new Date().toLocaleDateString('en-ZA')
    };
    setUserProfile(profile);
    setSelectedProvince(onboardingProvince);
    localStorage.setItem('agri_user_profile', JSON.stringify(profile));
    logAction(`REGISTRATION_SUCCESS: Profile created for ${profile.name} in district ${onboardingProvince}`);
  };

  const handleSignOut = () => {
    logAction("DEAUTHENTICATE: Purged cache registers and exited");
    localStorage.removeItem('agri_user_profile');
    setUserProfile(null);
    setOnboardingStep(1);
    setOnboardingName('');
  };

  // Add Plant
  const handleAddPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cropMeta = CROPS.find(c => c.id === newPlantCrop);
    if (!cropMeta) return;

    const newPlant: TrackedPlant = {
      id: `plant-${Date.now()}`,
      cropId: newPlantCrop,
      name: newPlantName.trim() || `${cropMeta.name} Field`,
      plantedDate: new Date().toISOString().split('T')[0],
      fieldSizeSqM: newPlantSize,
      growthProgress: 5,
      wateringDueDays: 1,
      status: 'Healthy'
    };

    const updated = [newPlant, ...trackedPlants];
    savePlants(updated);
    logAction(`CROP_TRACKER_ADD: Registered ${newPlant.name} (${cropMeta.name}) - ${newPlant.fieldSizeSqM}sqm`);
    
    // Log in Farm Logbook too
    try {
      const savedLogs = localStorage.getItem('agri_farm_logs');
      const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
      const newLog: FarmLog = {
        id: `log-${Date.now()}`,
        date: newPlant.plantedDate,
        cropId: newPlant.cropId,
        activityType: 'planting',
        notes: `Sowed and registered a new patch of ${cropMeta.name} named "${newPlant.name}" across ${newPlant.fieldSizeSqM} square meters.`,
        quantity: `${newPlant.fieldSizeSqM} sqm`
      };
      localStorage.setItem('agri_farm_logs', JSON.stringify([newLog, ...parsedLogs]));
    } catch(e) {}

    setShowAddPlantModal(false);
    setNewPlantName('');
  };

  const handleWaterPlant = (id: string) => {
    const updated = trackedPlants.map(p => {
      if (p.id === id) {
        logAction(`CROP_TRACKER_WATER: Hydrated ${p.name}`);
        return { ...p, wateringDueDays: 3, status: 'Healthy' as const };
      }
      return p;
    });
    savePlants(updated);

    // Create log record
    try {
      const plant = trackedPlants.find(p => p.id === id);
      if (plant) {
        const savedLogs = localStorage.getItem('agri_farm_logs');
        const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
        const newLog: FarmLog = {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          cropId: plant.cropId,
          activityType: 'watering',
          notes: `Logged supplementary watering for "${plant.name}". Moisture levels restored to optimal capacity.`,
          quantity: 'Drip 1.5hr'
        };
        localStorage.setItem('agri_farm_logs', JSON.stringify([newLog, ...parsedLogs]));
      }
    } catch(e) {}
  };

  const handleHarvestPlant = (id: string) => {
    const target = trackedPlants.find(p => p.id === id);
    if (!target) return;
    const updated = trackedPlants.filter(p => p.id !== id);
    savePlants(updated);
    logAction(`CROP_TRACKER_HARVEST: Harvested ${target.name}`);

    // Create log record
    try {
      const savedLogs = localStorage.getItem('agri_farm_logs');
      const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
      const newLog: FarmLog = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        cropId: target.cropId,
        activityType: 'harvest',
        notes: `Successfully harvested "${target.name}". Soil cleared for crop rotation.`,
        quantity: 'Full Yield'
      };
      localStorage.setItem('agri_farm_logs', JSON.stringify([newLog, ...parsedLogs]));
    } catch(e) {}
  };

  const handleDeletePlant = (id: string) => {
    const updated = trackedPlants.filter(p => p.id !== id);
    savePlants(updated);
    logAction(`CROP_TRACKER_REMOVE: Deleted plant tracker ${id}`);
  };

  // Add Animal
  const handleAddAnimalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: TrackedAnimal = {
      id: `animal-${Date.now()}`,
      category: newAnimalCat,
      tagId: `${newAnimalCat.substring(0, 1).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      breed: newAnimalBreed.trim() || 'Local Hardy Breed',
      count: newAnimalCount,
      status: 'Healthy',
      lastLogDate: new Date().toISOString().split('T')[0]
    };

    const updated = [newAnimal, ...trackedAnimals];
    saveAnimals(updated);
    logAction(`LIVESTOCK_ADD: Registered flock/herd ${newAnimal.tagId} (${newAnimal.breed}) - ${newAnimal.count} heads`);
    setShowAddAnimalModal(false);
    setNewAnimalBreed('');
  };

  const handleUpdateAnimalStatus = (id: string, newStatus: 'Healthy' | 'Treated' | 'Quarantined') => {
    const updated = trackedAnimals.map(a => {
      if (a.id === id) {
        logAction(`LIVESTOCK_STATUS_CHANGE: Updated tag ${a.tagId} to ${newStatus}`);
        return { ...a, status: newStatus, lastLogDate: new Date().toISOString().split('T')[0] };
      }
      return a;
    });
    saveAnimals(updated);
  };

  const handleDeleteAnimal = (id: string) => {
    const updated = trackedAnimals.filter(a => a.id !== id);
    saveAnimals(updated);
    logAction(`LIVESTOCK_DELETE: Removed livestock tracker ${id}`);
  };

  // Log water
  const handleLogWater = (litres: number) => {
    const val = Math.max(0, dailyWaterLogged + litres);
    setDailyWaterLogged(val);
    localStorage.setItem('wefarm_water', String(val));
    logAction(`LIVESTOCK_WATER_LOG: Logged ${litres}L today (Total: ${val}L)`);
  };

  // Soil Scan Simulation (Fully interactive local scan!)
  const handleRunSoilScan = () => {
    setIsSoilScanning(true);
    setSoilReport(null);
    logAction(`SOIL_SPECTROMETER_START: Initiating multi-spectral scan for crop target "${soilCrop}"`);

    setTimeout(() => {
      setIsSoilScanning(false);
      // Realistic calculations based on selected crop
      const isPhOk = soilPh >= 5.5 && soilPh <= 7.2;
      const nitrogenStatus = soilN === 'Low' ? 'Deficient' : soilN === 'Medium' ? 'Optimal' : 'Slight Excess';
      
      let recommendations = [];
      if (soilPh < 5.5) {
        recommendations.push("Apply Dolomitic Agricultural Lime to raise soil pH to an optimal 6.0 - 6.5 range.");
      } else if (soilPh > 7.5) {
        recommendations.push("Incorporate organic compost, pine needles, or agricultural sulfur to acidify the root bed.");
      }

      if (soilN === 'Low') {
        recommendations.push("Top-dress with LAN (Limestone Ammonium Nitrate) or enrich with composted chicken manure.");
      }
      if (soilP === 'Low') {
        recommendations.push("Add bone meal or apply single superphosphate fertilizer to boost root system development.");
      }
      if (soilMoisture < 40) {
        recommendations.push("Soil moisture is low. Set drip lines to run for 2 hours and apply dry organic leaf mulch.");
      } else {
        recommendations.push("Moisture content is excellent. Continue current watering schedules.");
      }

      setSoilReport({
        phStatus: isPhOk ? 'Optimal' : soilPh < 5.5 ? 'Strongly Acidic' : 'Alkaline',
        phColor: isPhOk ? 'text-emerald-700 bg-emerald-50' : 'text-amber-800 bg-amber-50',
        nitrogenStatus,
        recommendations,
        timestamp: new Date().toLocaleTimeString('en-ZA')
      });

      logAction(`SOIL_SPECTROMETER_SUCCESS: Spectral analysis logged. pH: ${soilPh}, Nitrogen: ${soilN}, Moisture: ${soilMoisture}%`);
    }, 2000);
  };

  // Forum interactions
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !userProfile) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: userProfile.name,
      role: 'Registered Farmer',
      province: selectedProvince,
      content: newPostText.trim(),
      likes: 0,
      likedByUser: false,
      comments: [],
      time: 'Just now'
    };

    const updated = [newPost, ...communityPosts];
    savePosts(updated);
    setNewPostText('');
    logAction(`COMMUNITY_POST_CREATED: Published local bulletin entry`);
  };

  const handleLikePost = (id: string) => {
    const updated = communityPosts.map(p => {
      if (p.id === id) {
        const isLiked = p.likedByUser;
        return {
          ...p,
          likedByUser: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    });
    savePosts(updated);
    logAction(`COMMUNITY_POST_LIKE: Liked post ID ${id}`);
  };

  const handleAddComment = (postId: string) => {
    const text = newComments[postId];
    if (!text || !text.trim() || !userProfile) return;

    const updated = communityPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            { author: userProfile.name, content: text.trim(), date: 'Just now' }
          ]
        };
      }
      return p;
    });

    savePosts(updated);
    setNewComments(prev => ({ ...prev, [postId]: '' }));
    logAction(`COMMUNITY_COMMENT_ADD: Added discussion reply on post ID ${postId}`);
  };

  // Check badges achievement
  const getBadges = () => {
    const list = [];
    if (trackedPlants.length >= 2) {
      list.push({ title: "Green Thumb", desc: "Tracked at least 2 active crop plots", color: "bg-emerald-100 text-emerald-800" });
    }
    if (soilReport) {
      list.push({ title: "Soil Master", desc: "Performed a detailed Soil Spectrometer Scan", color: "bg-orange-100 text-orange-800" });
    }
    if (trackedAnimals.length >= 2) {
      list.push({ title: "Herd Champion", desc: "Registered cattle or flock counts", color: "bg-blue-100 text-blue-800" });
    }
    if (dailyWaterLogged > 0) {
      list.push({ title: "Hydrologist", desc: "Logged animal water consumption", color: "bg-teal-100 text-teal-800" });
    }
    return list;
  };

  // Weather Metrics Helper
  const weatherAdviceList: Record<Province, string> = {
    Gauteng: "High frost risk tonight. Keep covers secured over cabbage.",
    Limpopo: "Hot dry spell. Clear drip tubes of sediment.",
    'Western Cape': "Heavy rainfall. Clear furrow run-offs immediately.",
    'KwaZulu-Natal': "Midlands damp fog. Monitor for powdery mildew.",
    Mpumalanga: "Dry winter wind. Ensure compost piles are moist.",
    'Eastern Cape': "Coastal cold drafts. Support young tomato trellises.",
    'Free State': "Severe black frost warning! Harvest mature leaves.",
    'North West': "Dusty dry spells. Cover soil with dense straw mulch.",
    'Northern Cape': "Solar pumps optimum window is currently 10 AM to 2 PM."
  };

  return (
    <div className="min-h-screen bg-[#F0ECE1] flex items-center justify-center font-sans py-4 px-2 select-none md:py-8">
      
      {/* 📱 Real Smartphone Frame Container on Desktop / Adaptive on Mobile */}
      <div className="w-full h-screen md:w-[415px] md:h-[860px] md:rounded-[55px] md:border-[12px] md:border-[#22261F] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] md:bg-[#22261F] relative flex flex-col overflow-hidden">
        
        {/* Smartphone Camera Notch / Dynamic Island */}
        <div className="hidden md:block w-32 h-6.5 bg-[#22261F] rounded-b-3xl absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-black/40 rounded-full" />
        </div>

        {/* Dynamic App Interface Viewport */}
        <div className="w-full h-full bg-[#F7F4EC] rounded-none md:rounded-[42px] flex flex-col overflow-hidden relative">
          
          {/* Mock Mobile Status Bar (Desktop Only) */}
          <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-1 text-[11px] text-[#22261F] font-mono z-40 bg-transparent font-extrabold select-none">
            <span>{currentTime}</span>
            <div className="flex items-center space-x-2.5">
              <span className="text-[9px] bg-emerald-700/10 text-emerald-800 font-mono px-1.5 py-0.5 rounded font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5 text-[#22261F]" />
              <div className="flex items-center space-x-1 border border-[#22261F] rounded px-0.5 py-0.2 shrink-0">
                <span className="w-2.5 h-1.5 bg-emerald-600 rounded-2xs" />
                <span className="text-[8px] font-bold">98%</span>
              </div>
            </div>
          </div>

          {/* ONBOARDING FLOW */}
          {!userProfile ? (
            <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
              {onboardingStep === 1 ? (
                <div className="flex-1 flex flex-col justify-center text-center space-y-6 my-auto">
                  <div className="w-20 h-20 bg-emerald-100 text-[#1F4D36] border border-emerald-200 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                    <Sprout className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-black text-[#22261F] tracking-tight">WeFarm Better</h1>
                    <p className="text-xs text-[#4A5147] px-2 leading-relaxed">
                      High-precision agrometeorological stats, real-time diagnostic scanning, and peer forums customized for South African smallholders.
                    </p>
                  </div>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    style={{ background: COLORS.forest }}
                    className="w-full text-white font-bold py-3.5 px-4 rounded-2xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : onboardingStep === 2 ? (
                <div className="flex-1 flex flex-col justify-center text-center space-y-6 my-auto">
                  <div className="w-20 h-20 bg-orange-100 text-[#A9552E] border border-orange-200 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                    <Camera className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-serif font-bold text-[#22261F] tracking-tight">AI Diagnostic Scanning</h2>
                    <p className="text-xs text-[#4A5147] px-2 leading-relaxed">
                      Instant multi-spectral soil report logs and crop disease detection powered by custom Gemini computer vision models. No guesswork.
                    </p>
                  </div>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    style={{ background: COLORS.forest }}
                    className="w-full text-white font-bold py-3.5 px-4 rounded-2xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center space-y-5 my-auto">
                  <div className="text-center space-y-1.5">
                    <h2 className="text-xl font-serif font-bold text-[#22261F]">Farmer Profile</h2>
                    <p className="text-xs text-[#4A5147]">Set your district to configure agromet parameters</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Farmer Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Thabo Nkosi"
                        value={onboardingName}
                        onChange={(e) => setOnboardingName(e.target.value)}
                        className="w-full bg-white border border-[#E4E0D3] rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1F4D36]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">My Province</label>
                      <select
                        value={onboardingProvince}
                        onChange={(e) => setOnboardingProvince(e.target.value as Province)}
                        className="w-full bg-white border border-[#E4E0D3] rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none"
                      >
                        {PROVINCES.map((p) => (
                          <option key={p.province} value={p.province}>{p.province}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleOnboardingComplete}
                    disabled={!onboardingName.trim()}
                    style={{ background: COLORS.forest }}
                    className="w-full text-white font-bold py-3.5 px-4 rounded-2xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40"
                  >
                    <span>Enter My Farm</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Stepper Dots */}
              <div className="flex justify-center space-x-1.5 pt-4">
                <span className={`w-2 h-2 rounded-full ${onboardingStep === 1 ? 'bg-[#1F4D36]' : 'bg-[#E4E0D3]'}`} />
                <span className={`w-2 h-2 rounded-full ${onboardingStep === 2 ? 'bg-[#1F4D36]' : 'bg-[#E4E0D3]'}`} />
                <span className={`w-2 h-2 rounded-full ${onboardingStep === 3 ? 'bg-[#1F4D36]' : 'bg-[#E4E0D3]'}`} />
              </div>
            </div>
          ) : (
            
            // MAIN APPLICATION WORKSPACE
            <div className="flex-1 flex flex-col h-full relative">
              
              {/* STICKY PHONE APP HEADER */}
              <header className="px-5 pt-4.5 pb-3 border-b border-[#E4E0D3]/50 flex justify-between items-center bg-white/70 backdrop-blur-md z-30">
                <div className="flex items-center space-x-2.5">
                  <div style={{ background: COLORS.forest }} className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black select-none">
                    W
                  </div>
                  <div>
                    <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4A5147] flex items-center gap-1 leading-none">
                      <span>AgriApp</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <span className="text-sm font-serif font-black text-[#22261F] block">{userProfile.name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] bg-[#DCE6D6] text-[#123425] font-bold px-2 py-0.8 rounded-full border border-[#92A88C]/20 flex items-center gap-1 shrink-0 select-none">
                    <MapPin className="w-3 h-3 text-[#A9552E]" />
                    <span>{selectedProvince}</span>
                  </span>
                </div>
              </header>

              {/* SCROLLABLE SCENE BODY */}
              <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 scrollbar-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    
                    {/* 1. HOME TAB */}
                    {activeTab === 'home' && (
                      <div className="space-y-4">
                        {/* Welcome Slide Banner */}
                        <div className="bg-[#123425] rounded-3xl p-4 text-white space-y-3 shadow-md relative overflow-hidden">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-[#92A88C] uppercase tracking-wider block">Agromet Advisory</span>
                            <h2 className="text-base font-serif font-bold text-[#F7F4EC]">Winter Frost Mitigation</h2>
                            <p className="text-[11px] text-[#DCE6D6] leading-relaxed font-medium">
                              {weatherAdviceList[selectedProvince]}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setScanMode('soil'); setActiveTab('scan'); }}
                              className="bg-[#E3A23C] text-[#123425] font-mono text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:scale-95 active:scale-95 flex items-center gap-1"
                            >
                              <span>Soil Spectrum</span>
                            </button>
                            <button
                              onClick={() => { setScanMode('disease'); setActiveTab('scan'); }}
                              className="bg-white/10 border border-white/20 text-white font-mono text-[9px] font-bold uppercase px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-white/15 flex items-center gap-1"
                            >
                              <span>Disease Scanner</span>
                            </button>
                          </div>
                        </div>

                        {/* Meteorological Summary */}
                        <WeatherWidget selectedProvince={selectedProvince} onProvinceChange={(prov) => { setSelectedProvince(prov); logAction(`WEATHER_REGION_CHANGED: Updated to ${prov}`); }} />

                        {/* Quick Action Diagnostic Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            onClick={() => { setScanMode('soil'); setActiveTab('scan'); }}
                            className="bg-white border border-[#E4E0D3] rounded-2xl p-3.5 space-y-2 cursor-pointer hover:border-[#1F4D36] hover:shadow-xs transition-all"
                          >
                            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#A9552E] flex items-center justify-center">
                              <Compass className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-[#22261F] font-serif">Soil Analyzer</h3>
                              <p className="text-[10px] text-[#4A5147] mt-0.5 font-medium">Insert pH/NPK reads</p>
                            </div>
                          </div>

                          <div
                            onClick={() => { setScanMode('disease'); setActiveTab('scan'); }}
                            className="bg-white border border-[#E4E0D3] rounded-2xl p-3.5 space-y-2 cursor-pointer hover:border-[#1F4D36] hover:shadow-xs transition-all"
                          >
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1F4D36] flex items-center justify-center">
                              <Camera className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-[#22261F] font-serif">Leaf Diagnostics</h3>
                              <p className="text-[10px] text-[#4A5147] mt-0.5 font-medium">Capture leaf disease</p>
                            </div>
                          </div>
                        </div>

                        {/* Farm Stats Summary Box */}
                        <div className="bg-white border border-[#E4E0D3] rounded-3xl p-4 space-y-3 shadow-xs">
                          <h3 className="text-xs font-mono font-bold text-[#4A5147] uppercase tracking-wider block">My Farm Summary</h3>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-[#F7F4EC]/50 p-2 rounded-xl border border-[#E4E0D3]/30">
                              <span className="text-[9px] text-[#92A88C] uppercase font-mono block">CROPS</span>
                              <span className="text-base font-bold text-[#22261F] font-mono">{trackedPlants.length}</span>
                            </div>
                            <div className="bg-[#F7F4EC]/50 p-2 rounded-xl border border-[#E4E0D3]/30">
                              <span className="text-[9px] text-[#92A88C] uppercase font-mono block">LIVESTOCK</span>
                              <span className="text-base font-bold text-[#22261F] font-mono">
                                {trackedAnimals.reduce((sum, a) => sum + a.count, 0)}
                              </span>
                            </div>
                            <div className="bg-[#F7F4EC]/50 p-2 rounded-xl border border-[#E4E0D3]/30">
                              <span className="text-[9px] text-[#92A88C] uppercase font-mono block">BADGES</span>
                              <span className="text-base font-bold text-[#22261F] font-mono">{getBadges().length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. CROPS TAB */}
                    {activeTab === 'crops' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-serif font-black text-[#22261F]">My Active Crops</h2>
                          <button
                            onClick={() => setShowAddPlantModal(true)}
                            className="bg-[#1F4D36] text-white text-[10px] font-bold px-3 py-1.8 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Track Crop</span>
                          </button>
                        </div>

                        {/* Crops Inventory List */}
                        <div className="space-y-3">
                          {trackedPlants.length === 0 ? (
                            <div className="text-center py-10 bg-white border border-[#E4E0D3] rounded-3xl space-y-2">
                              <Sprout className="w-8 h-8 text-[#92A88C] mx-auto opacity-60" />
                              <p className="text-xs font-bold text-[#22261F]">No crops tracked yet</p>
                              <p className="text-[10px] text-[#4A5147]">Click the track button above to start your inventory!</p>
                            </div>
                          ) : (
                            trackedPlants.map((plant) => {
                              const cropMeta = CROPS.find(c => c.id === plant.cropId);
                              return (
                                <div key={plant.id} className="bg-white border border-[#E4E0D3] rounded-3xl p-4 space-y-3.5 shadow-xs relative">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-xs font-mono font-bold text-[#4A5147] uppercase tracking-wider">{cropMeta?.name} ({cropMeta?.localName})</h3>
                                      <h4 className="text-sm font-serif font-bold text-[#22261F] mt-0.5">{plant.name}</h4>
                                      <p className="text-[10px] text-[#4A5147] mt-1 flex items-center gap-1 font-semibold">
                                        <Calendar className="w-3.5 h-3.5 text-[#92A88C]" />
                                        <span>Planted: {plant.plantedDate} • {plant.fieldSizeSqM} sqm</span>
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleDeletePlant(plant.id)}
                                      className="text-gray-300 hover:text-[#B84A3A] p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Progress bar */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-mono font-bold">
                                      <span className="text-[#4A5147]">Growth Progress</span>
                                      <span className="text-[#1F4D36]">{plant.growthProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-[#F7F4EC] rounded-full overflow-hidden">
                                      <div style={{ width: `${plant.growthProgress}%` }} className="h-full bg-emerald-600 rounded-full" />
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex justify-between items-center pt-2.5 border-t border-[#F7F4EC] gap-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                                      plant.wateringDueDays === 0 
                                        ? 'bg-rose-50 border-rose-100 text-rose-800 font-extrabold animate-pulse' 
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                    }`}>
                                      {plant.wateringDueDays === 0 ? '⚠️ WATER DUE' : '💧 Hydrated'}
                                    </span>

                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => handleWaterPlant(plant.id)}
                                        className="bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-800 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer active:scale-95"
                                      >
                                        Log Watering
                                      </button>
                                      {plant.growthProgress >= 80 && (
                                        <button
                                          onClick={() => handleHarvestPlant(plant.id)}
                                          className="bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-800 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer active:scale-95"
                                        >
                                          Harvest
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Connected Logbook Component (Unified structure) */}
                        <FarmLogbook />
                      </div>
                    )}

                    {/* 3. LIVESTOCK TAB */}
                    {activeTab === 'livestock' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-serif font-black text-[#22261F]">My Livestock</h2>
                          <button
                            onClick={() => setShowAddAnimalModal(true)}
                            className="bg-[#1F4D36] text-white text-[10px] font-bold px-3 py-1.8 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Animal</span>
                          </button>
                        </div>

                        {/* Livestock Inventory Cards */}
                        <div className="space-y-3">
                          {trackedAnimals.length === 0 ? (
                            <div className="text-center py-10 bg-white border border-[#E4E0D3] rounded-3xl space-y-2">
                              <Heart className="w-8 h-8 text-[#92A88C] mx-auto opacity-60 animate-pulse" />
                              <p className="text-xs font-bold text-[#22261F]">No livestock tracked</p>
                              <p className="text-[10px] text-[#4A5147]">Click the Add Animal button above to begin logging animals.</p>
                            </div>
                          ) : (
                            trackedAnimals.map((animal) => (
                              <div key={animal.id} className="bg-white border border-[#E4E0D3] rounded-3xl p-4 space-y-3.5 shadow-xs">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-mono font-bold text-[#A9552E] uppercase tracking-wider block">{animal.category}</span>
                                    <h3 className="text-sm font-serif font-bold text-[#22261F]">{animal.breed} <span className="text-xs text-gray-400 font-normal">({animal.tagId})</span></h3>
                                    <p className="text-[11px] font-semibold text-[#4A5147]">Registered count: <strong className="text-[#22261F]">{animal.count} heads</strong></p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteAnimal(animal.id)}
                                    className="text-gray-300 hover:text-[#B84A3A] p-1 rounded-lg cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="flex justify-between items-center pt-2.5 border-t border-[#F7F4EC] gap-2">
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleUpdateAnimalStatus(animal.id, 'Healthy')}
                                      className={`text-[9px] font-bold px-2 py-1 rounded-md border cursor-pointer ${animal.status === 'Healthy' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                      Healthy
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAnimalStatus(animal.id, 'Treated')}
                                      className={`text-[9px] font-bold px-2 py-1 rounded-md border cursor-pointer ${animal.status === 'Treated' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                      Treated
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAnimalStatus(animal.id, 'Quarantined')}
                                      className={`text-[9px] font-bold px-2 py-1 rounded-md border cursor-pointer ${animal.status === 'Quarantined' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                      Quarantined
                                    </button>
                                  </div>

                                  <span className="text-[9px] font-mono text-[#92A88C] font-semibold">Log: {animal.lastLogDate}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Livestock Hydration / Water Cup Logger */}
                        <div className="bg-white border border-[#E4E0D3] rounded-3xl p-4.5 space-y-4 shadow-xs">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xs font-serif font-black text-[#22261F] flex items-center gap-1.5">
                                <Droplets className="w-4 h-4 text-blue-500 animate-pulse" />
                                <span>Daily Water Logging</span>
                              </h3>
                              <p className="text-[10px] text-[#4A5147] mt-0.5">Log water supplied to herds & pens today</p>
                            </div>
                            <span className="text-sm font-bold font-mono text-[#1F4D36]">{dailyWaterLogged} L</span>
                          </div>

                          {/* Water Progress bar */}
                          <div className="h-3 bg-[#F7F4EC] rounded-full overflow-hidden border border-[#E4E0D3]/40 relative">
                            <div style={{ width: `${Math.min((dailyWaterLogged / 250) * 100, 100)}%` }} className="h-full bg-blue-500 rounded-full transition-all duration-300" />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLogWater(20)}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-800 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                            >
                              +20 Litres
                            </button>
                            <button
                              onClick={() => handleLogWater(50)}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-800 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                            >
                              +50 Litres
                            </button>
                            <button
                              onClick={() => handleLogWater(-dailyWaterLogged)}
                              className="border border-[#E4E0D3] text-[#4A5147] text-[10px] font-bold px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-800 cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        {/* Local South African Veterinary Bulletins */}
                        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-4 space-y-2">
                          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-700" />
                            <span>KZN & Highveld Winter Vet Guidelines</span>
                          </h4>
                          <p className="text-[10px] text-amber-950 leading-relaxed font-semibold">
                            Redwater and Heartwater tick-borne parasites carry high virulence index despite cold dry seasons. Continue monthly plunge dipping or tick grease dressings on livestock hindquarters.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 4. SCANNER TAB (Dual Mode: Soil and Leaf disease scans!) */}
                    {activeTab === 'scan' && (
                      <div className="space-y-4">
                        {/* Dual Scanner Header Navigation */}
                        <div className="bg-[#EFEBDD] p-1 rounded-2xl flex border border-[#E4E0D3]">
                          <button
                            onClick={() => setScanMode('soil')}
                            className={`flex-1 text-[10px] font-mono font-bold uppercase py-2 rounded-xl transition-all cursor-pointer ${
                              scanMode === 'soil' ? 'bg-white shadow-sm text-[#1F4D36]' : 'text-[#4A5147] hover:text-[#1F4D36]'
                            }`}
                          >
                            📈 Soil Spectrum Scan
                          </button>
                          <button
                            onClick={() => setScanMode('disease')}
                            className={`flex-1 text-[10px] font-mono font-bold uppercase py-2 rounded-xl transition-all cursor-pointer ${
                              scanMode === 'disease' ? 'bg-white shadow-sm text-[#1F4D36]' : 'text-[#4A5147] hover:text-[#1F4D36]'
                            }`}
                          >
                            🔬 Leaf Disease Scan
                          </button>
                        </div>

                        {/* SCAN MODE A: SOIL SPECTROMETER (Instant live scan, no uploading!) */}
                        {scanMode === 'soil' && (
                          <div className="space-y-4">
                            <div className="bg-white border border-[#E4E0D3] rounded-3xl p-4.5 space-y-4 shadow-sm">
                              <div>
                                <h3 className="text-sm font-serif font-bold text-[#22261F] flex items-center gap-1.5">
                                  <Compass className="w-4.5 h-4.5 text-[#1F4D36]" />
                                  <span>Soil Spectrum Scanner</span>
                                </h3>
                                <p className="text-[10px] text-[#4A5147] mt-0.5">Input your soil properties to generate instantaneous spectrum reports</p>
                              </div>

                              <div className="space-y-3">
                                {/* Soil parameters inputs */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Target Crop</label>
                                    <select
                                      value={soilCrop}
                                      onChange={(e) => { setSoilCrop(e.target.value); setSoilReport(null); }}
                                      className="w-full text-xs font-semibold bg-[#F7F4EC]/45 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
                                    >
                                      {CROPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Soil pH (Active)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      min="4"
                                      max="10"
                                      value={soilPh}
                                      onChange={(e) => { setSoilPh(Number(e.target.value)); setSoilReport(null); }}
                                      className="w-full text-xs font-semibold bg-[#F7F4EC]/45 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Nitrogen (N)</label>
                                    <select
                                      value={soilN}
                                      onChange={(e) => { setSoilN(e.target.value); setSoilReport(null); }}
                                      className="w-full text-xs font-semibold bg-[#F7F4EC]/45 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
                                    >
                                      <option value="Low">Low</option>
                                      <option value="Medium">Medium (Optimal)</option>
                                      <option value="High">High</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Moisture (%)</label>
                                    <input
                                      type="number"
                                      min="10"
                                      max="100"
                                      value={soilMoisture}
                                      onChange={(e) => { setSoilMoisture(Number(e.target.value)); setSoilReport(null); }}
                                      className="w-full text-xs font-semibold bg-[#F7F4EC]/45 border border-[#E4E0D3] rounded-xl p-2.5 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <button
                                  onClick={handleRunSoilScan}
                                  disabled={isSoilScanning}
                                  style={{ background: COLORS.forest }}
                                  className="w-full text-white font-mono uppercase font-bold text-[10px] py-3.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-40"
                                >
                                  {isSoilScanning ? '🤖 RUNNING SPECTRAL ALIGNMENT...' : '📊 Run Soil Spectrum Report'}
                                </button>
                              </div>
                            </div>

                            {/* SCAN REPORT WORKSPACE */}
                            {soilReport && (
                              <div className="bg-white border border-[#E4E0D3] rounded-3xl p-4.5 space-y-4 shadow-xs animate-fadeIn">
                                <div className="flex justify-between items-center pb-2.5 border-b border-[#F7F4EC]">
                                  <div>
                                    <span className="text-[8px] font-mono font-bold bg-[#DCE6D6] text-[#123425] px-2 py-0.5 rounded-full uppercase">Soil Report Diagnostic</span>
                                    <h4 className="text-sm font-serif font-bold text-[#22261F] mt-1">Status: {soilReport.phStatus}</h4>
                                  </div>
                                  <span className="text-[9px] font-mono text-[#92A88C] font-semibold">{soilReport.timestamp}</span>
                                </div>

                                <div className="space-y-3">
                                  {/* Recommendations bullet points */}
                                  <div className="space-y-1.5">
                                    <span className="text-[9px] font-mono font-bold text-[#A9552E] uppercase block">Conditioning Checklist</span>
                                    <ul className="space-y-1 text-xs">
                                      {soilReport.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1.5 text-xs text-[#4A5147] font-semibold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* SCAN MODE B: LEAF DISEASE DIAGNOSTIC STREAM (Real-time capture!) */}
                        {scanMode === 'disease' && (
                          <DiagnosticScanner selectedProvince={selectedProvince} onLogAction={logAction} />
                        )}
                      </div>
                    )}

                    {/* 5. COMMUNITY TAB */}
                    {activeTab === 'community' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-base font-serif font-black text-[#22261F]">WeFarm Forum</h2>
                          <button
                            onClick={() => setShowSiphoFloating(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-[#123425] text-[10px] font-bold px-3 py-1.8 rounded-xl flex items-center gap-1 shadow-md cursor-pointer transition-all shrink-0 font-mono"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ask Sipho AI</span>
                          </button>
                        </div>

                        {/* Bulletin post publisher */}
                        <form onSubmit={handleAddPost} className="bg-white border border-[#E4E0D3] rounded-3xl p-3.5 shadow-xs space-y-2.5">
                          <label htmlFor="forum-post-text" className="sr-only">Post to WeFarm bulletin</label>
                          <textarea
                            id="forum-post-text"
                            rows={2}
                            placeholder="Share winter crop tips, local pricing, or field updates..."
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            className="w-full text-xs bg-[#F7F4EC]/35 border border-[#E4E0D3]/60 rounded-xl p-3 focus:outline-none focus:bg-white transition-all placeholder:text-[#92A88C]"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono text-[#92A88C] font-semibold">Posting as {userProfile.name}</span>
                            <button
                              type="submit"
                              disabled={!newPostText.trim()}
                              style={{ background: COLORS.forest }}
                              className="text-white text-[10px] font-bold py-1.5 px-3.5 rounded-lg disabled:opacity-40 shadow-xs cursor-pointer active:scale-95 transition-all"
                            >
                              Publish
                            </button>
                          </div>
                        </form>

                        {/* Social posts feed */}
                        <div className="space-y-3.5">
                          {communityPosts.map((post) => (
                            <div key={post.id} className="bg-white border border-[#E4E0D3] rounded-3xl p-4 space-y-3.5 shadow-xs">
                              {/* Post Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2.5">
                                  <div style={{ background: COLORS.forest }} className="w-8 h-8 rounded-full text-white font-serif font-black flex items-center justify-center text-xs">
                                    {post.author.substring(0, 1)}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#22261F] flex items-center gap-1">
                                      <span>{post.author}</span>
                                      <span className="text-[9px] font-normal text-[#92A88C]">({post.role})</span>
                                    </h4>
                                    <p className="text-[9px] text-[#4A5147] font-semibold">{post.time} • District: {post.province}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <p className="text-xs text-[#22261F] leading-relaxed font-medium">
                                {post.content}
                              </p>

                              {/* Comments & Likes HUD footer */}
                              <div className="flex items-center space-x-4 pt-2.5 border-t border-[#F7F4EC] text-xs font-semibold text-[#4A5147]">
                                <button
                                  onClick={() => handleLikePost(post.id)}
                                  className={`flex items-center gap-1 cursor-pointer transition-colors ${post.likedByUser ? 'text-rose-600' : 'hover:text-rose-600'}`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${post.likedByUser ? 'fill-rose-600' : ''}`} />
                                  <span>{post.likes} Likes</span>
                                </button>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>{post.comments.length} Comments</span>
                                </span>
                              </div>

                              {/* Comment list */}
                              {post.comments.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-gray-50 bg-[#F7F4EC]/40 p-2.5 rounded-xl">
                                  {post.comments.map((c, idx) => (
                                    <div key={idx} className="text-[11px] leading-relaxed text-[#22261F]">
                                      <span className="font-bold block text-emerald-800">{c.author} <span className="text-[9px] text-gray-400 font-normal">{c.date}</span></span>
                                      <p className="font-medium text-gray-700">{c.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Write a comment */}
                              <div className="flex gap-2 pt-1.5">
                                <label htmlFor={`comment-box-${post.id}`} className="sr-only">Write comment</label>
                                <input
                                  id={`comment-box-${post.id}`}
                                  type="text"
                                  placeholder="Add cooperative comment..."
                                  value={newComments[post.id] || ''}
                                  onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  className="flex-1 bg-[#F7F4EC]/35 border border-[#E4E0D3]/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="bg-[#DCE6D6] hover:bg-[#1F4D36] hover:text-white border border-[#92A88C]/30 text-[#123425] text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. PROFILE TAB */}
                    {activeTab === 'profile' && (
                      <div className="space-y-4">
                        {/* Digital Farmer Card */}
                        <div className="bg-white border border-[#E4E0D3] rounded-3xl p-4.5 shadow-sm space-y-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-35" />
                          <div className="flex items-center space-x-3.5 pb-3.5 border-b border-[#F7F4EC]">
                            <div style={{ background: COLORS.forest }} className="w-12 h-12 rounded-2xl text-white font-serif font-black flex items-center justify-center text-lg shadow-sm">
                              {userProfile.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-base font-serif font-bold text-[#22261F]">{userProfile.name}</h3>
                              <p className="text-[10px] text-[#4A5147] font-mono leading-none mt-0.5">MEMBER: WeFarm South Africa</p>
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100/30 inline-block mt-1.5 uppercase font-mono tracking-wider">
                                District verified
                              </span>
                            </div>
                          </div>

                          {/* Achievements Badges shelf */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-mono font-bold text-[#4A5147] uppercase tracking-wider block">Unlocked District Badges</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {getBadges().map((b, i) => (
                                <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${b.color}`}>
                                  <Award className="w-3.5 h-3.5" />
                                  <span>{b.title}</span>
                                </span>
                              ))}
                              {getBadges().length === 0 && (
                                <span className="text-[10px] text-gray-400 font-mono">No badges achieved yet. Start farming to unlock!</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Settings links */}
                        <div className="bg-white border border-[#E4E0D3] rounded-3xl p-3.5 shadow-xs space-y-1 text-xs font-bold text-[#22261F]">
                          
                          <button
                            onClick={() => setShowUssdModal(true)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F4EC]/50 transition-colors cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Compass className="w-4 h-4 text-emerald-700" />
                              <span>Virtual Offline USSD Portal (*120*2474#)</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setShowLogsModal(true)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F4EC]/50 transition-colors cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-amber-700" />
                              <span>Session Audit Logs (Compliance Terminal)</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50 text-rose-800 transition-colors cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2">
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out of WeFarm</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 🧭 PREMIUM STICKY FLOATING BOTTOM MOBILE NAVIGATION BAR */}
              <nav className="bg-white/95 backdrop-blur-md border border-[#E4E0D3]/70 py-1 px-3 flex justify-between absolute bottom-3.5 left-3.5 right-3.5 rounded-2xl shadow-lg z-40 select-none">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'home' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">Home</span>
                </button>

                <button
                  onClick={() => setActiveTab('crops')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'crops' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <Sprout className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">Crops</span>
                </button>

                <button
                  onClick={() => setActiveTab('livestock')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'livestock' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">Stock</span>
                </button>

                <button
                  onClick={() => setActiveTab('scan')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'scan' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">Scan</span>
                </button>

                <button
                  onClick={() => setActiveTab('community')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'community' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">Forum</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center py-1 px-2.5 rounded-xl cursor-pointer ${activeTab === 'profile' ? 'text-[#1F4D36]' : 'text-gray-400 hover:text-[#1F4D36]'}`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5 font-mono">User</span>
                </button>
              </nav>

            </div>
          )}

          {/* Smartphone Swipe Bar (Visual detail only) */}
          <div className="hidden md:block w-32 h-1 bg-[#22261F]/30 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none" />

        </div>
      </div>

      {/* ==================== 🛠️ SUB-PANEL MODALS DRAWER (COMPLIANT OVERLAY LAYER) ==================== */}

      {/* A. FLOATING SIPHO CHAT HELP MODAL */}
      <AnimatePresence>
        {showSiphoFloating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E4E0D3] flex flex-col h-[560px]"
            >
              <div className="bg-[#123425] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-sm font-serif font-black">Sipho AI Consultant</h3>
                </div>
                <button
                  onClick={() => setShowSiphoFloating(false)}
                  className="text-white/85 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-[#F7F4EC]/35">
                <AdvisorChat selectedProvince={selectedProvince} onLogAction={logAction} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. OFFLINE USSD DIALER EMULATOR */}
      <AnimatePresence>
        {showUssdModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E4E0D3] flex flex-col max-h-[90vh]"
            >
              <div className="bg-[#123425] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-serif font-black">USSD Emulator</h3>
                </div>
                <button
                  onClick={() => setShowUssdModal(false)}
                  className="text-white/85 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 bg-[#F7F4EC]/30">
                <UssdSimulator />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. DEVELOPER AUDIT SYSTEM LOGS CONSOLE */}
      <AnimatePresence>
        {showLogsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E4E0D3] flex flex-col max-h-[85vh]"
            >
              <div className="bg-[#123425] text-white p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-serif font-black">Telemetry Audit Console</h3>
                </div>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="text-white/85 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-[#22261F] text-emerald-400 font-mono text-[10px] h-96 overflow-y-auto space-y-1 scrollbar-thin flex-1">
                <TerminalLogs logs={logs} onClearLogs={() => setLogs([])} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. ADD PLANT DRAWER MODAL */}
      <AnimatePresence>
        {showAddPlantModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E4E0D3]"
            >
              <div className="bg-[#1F4D36] text-white p-4 flex justify-between items-center">
                <h3 className="text-sm font-serif font-bold">Register Plant Plot</h3>
                <button onClick={() => setShowAddPlantModal(false)} className="text-white hover:opacity-85"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddPlantSubmit} className="p-5 space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label htmlFor="new-plant-type" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Select Crop Type</label>
                  <select
                    id="new-plant-type"
                    value={newPlantCrop}
                    onChange={(e) => setNewPlantCrop(e.target.value)}
                    className="w-full bg-[#F7F4EC]/50 border border-[#E4E0D3] rounded-xl p-2.5"
                  >
                    {CROPS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.localName})</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-plant-name" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Custom Name</label>
                  <input
                    id="new-plant-name"
                    type="text"
                    placeholder="e.g. Backgarden Spinach Patch"
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                    className="w-full bg-white border border-[#E4E0D3] rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-plant-size" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Plot Size (Square Meters)</label>
                  <input
                    id="new-plant-size"
                    type="number"
                    min="10"
                    max="10000"
                    value={newPlantSize}
                    onChange={(e) => setNewPlantSize(Number(e.target.value))}
                    className="w-full bg-white border border-[#E4E0D3] rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  style={{ background: COLORS.forest }}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Tracking Plot</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. ADD ANIMAL DRAWER MODAL */}
      <AnimatePresence>
        {showAddAnimalModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E4E0D3]"
            >
              <div className="bg-[#1F4D36] text-white p-4 flex justify-between items-center">
                <h3 className="text-sm font-serif font-bold">Add Animal Stock</h3>
                <button onClick={() => setShowAddAnimalModal(false)} className="text-white hover:opacity-85"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddAnimalSubmit} className="p-5 space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label htmlFor="new-animal-category" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Stock Category</label>
                  <select
                    id="new-animal-category"
                    value={newAnimalCat}
                    onChange={(e) => setNewAnimalCat(e.target.value as any)}
                    className="w-full bg-[#F7F4EC]/50 border border-[#E4E0D3] rounded-xl p-2.5"
                  >
                    <option value="Cattle">Cattle</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Goats">Goats</option>
                    <option value="Sheep">Sheep</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-animal-breed" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Breed Name</label>
                  <input
                    id="new-animal-breed"
                    type="text"
                    placeholder="e.g. Bonsmara, Merino, Lohmann Brown"
                    value={newAnimalBreed}
                    onChange={(e) => setNewAnimalBreed(e.target.value)}
                    className="w-full bg-white border border-[#E4E0D3] rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-animal-count" className="text-[10px] font-bold text-[#4A5147] uppercase tracking-wider block font-mono">Stock Count (Heads)</label>
                  <input
                    id="new-animal-count"
                    type="number"
                    min="1"
                    max="1000"
                    value={newAnimalCount}
                    onChange={(e) => setNewAnimalCount(Number(e.target.value))}
                    className="w-full bg-white border border-[#E4E0D3] rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  style={{ background: COLORS.forest }}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Stock Pen</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
