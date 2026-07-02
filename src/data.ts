import { CropInfo, ProvinceData, Province, WeatherData } from './types';

export const CROPS: CropInfo[] = [
  {
    id: 'maize',
    name: 'Maize',
    localName: 'Mielies',
    avgPriceZAR: 4.80,
    unit: 'kg',
    rowSpacingCm: 90,
    plantSpacingCm: 30,
    seedsPerHa: 50000,
    fertilizerNeeds: 'Apply 2:3:2 (37) at planting, top-dress with LAN (28) 4-6 weeks later.',
    bestMonths: [10, 11, 12, 1], // Oct - Jan
    description: 'The staple crop of South Africa. Requires good summer rain and plenty of sunshine. Susceptible to Fall Armyworm.'
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    localName: 'Aartappels',
    avgPriceZAR: 11.50,
    unit: 'kg',
    rowSpacingCm: 75,
    plantSpacingCm: 30,
    seedsPerHa: 33000,
    fertilizerNeeds: 'Requires high Potassium and Phosphorus. Use 2:3:4 (30) at planting.',
    bestMonths: [8, 9, 10, 11, 12, 1, 2], // Aug - Feb
    description: 'Highly profitable. Prefers cool temperatures or frost-free winters. Keep well-watered but drained.'
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    localName: 'Tamaties',
    avgPriceZAR: 14.50,
    unit: 'kg',
    rowSpacingCm: 100,
    plantSpacingCm: 50,
    seedsPerHa: 20000,
    fertilizerNeeds: 'Balanced feeding. Calcium is essential to prevent Blossom End Rot. Use 3:1:5.',
    bestMonths: [9, 10, 11, 12], // Sept - Dec (frost areas), LP lowveld: Mar - Jul
    description: 'High value crop. Requires staking/trellising and careful pest control (Tomato leafminer / Tuta absoluta).'
  },
  {
    id: 'cabbages',
    name: 'Cabbages',
    localName: 'Kool',
    avgPriceZAR: 8.50,
    unit: 'head',
    rowSpacingCm: 60,
    plantSpacingCm: 45,
    seedsPerHa: 37000,
    fertilizerNeeds: 'Heavy nitrogen feeder. Use LAN or urea as top dressing 3 and 6 weeks after transplanting.',
    bestMonths: [2, 3, 4, 5, 6, 7, 8], // Feb - Aug (Cool season crop)
    description: 'Very reliable winter staple. Tolerates frost. Highly susceptible to aphids and diamondback moth larvae.'
  },
  {
    id: 'spinach',
    name: 'Swiss Chard',
    localName: 'Spinasie',
    avgPriceZAR: 13.00,
    unit: 'kg',
    rowSpacingCm: 40,
    plantSpacingCm: 25,
    seedsPerHa: 80000,
    fertilizerNeeds: 'Thrives with regular nitrogen-rich compost or LAN fertilizer dressings.',
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9, 10], // Feb - Oct (performs best in cooler times)
    description: 'Grows continuously, pick outer leaves weekly. Extremely resilient and popular in local communities.'
  },
  {
    id: 'dry_beans',
    name: 'Dry Beans',
    localName: 'Bone',
    avgPriceZAR: 19.00,
    unit: 'kg',
    rowSpacingCm: 45,
    plantSpacingCm: 10,
    seedsPerHa: 220000,
    fertilizerNeeds: 'Fixes its own nitrogen but benefits from light 2:3:2 application at planting.',
    bestMonths: [11, 12, 1], // Nov - Jan
    description: 'Excellent for soil rotation. Low water requirements. Harvest when pods are dry and yellow.'
  },
  {
    id: 'sweet_potatoes',
    name: 'Sweet Potatoes',
    localName: 'Patats',
    avgPriceZAR: 9.80,
    unit: 'kg',
    rowSpacingCm: 100,
    plantSpacingCm: 30,
    seedsPerHa: 33000,
    fertilizerNeeds: 'Prefers organic matter. Avoid over-fertilizing with Nitrogen to prevent long vines with no tubers.',
    bestMonths: [10, 11, 12], // Oct - Dec
    description: 'Highly nutritious, drought-hardy. Grown from vine cuttings (slips) rather than seeds.'
  }
];

export const PROVINCES: ProvinceData[] = [
  {
    province: 'Gauteng',
    climateZone: 'Subtropical Highveld (moderate summers, dry cold frosty winters)',
    currentSeason: 'Dry Winter (July)',
    idealCropsNow: ['cabbages', 'spinach'],
    tips: [
      'Cover vulnerable seedlings at night to protect from frost.',
      'Water in the mornings (9:00 AM - 11:00 AM) so leaves dry before freezing night temps.',
      'Mulch heavily to preserve soil moisture in this dry winter.'
    ]
  },
  {
    province: 'Limpopo',
    climateZone: 'Subtropical Lowveld/Bushveld (hot summers, mild frost-free winters)',
    currentSeason: 'Mild Winter (July)',
    idealCropsNow: ['tomatoes', 'potatoes', 'cabbages', 'spinach'],
    tips: [
      'July is prime tomato planting season in Limpopo Lowveld because there is no frost.',
      'Check crops daily for Red Spider Mite as the dry climate encourages them.',
      'Water drip systems regularly but monitor for root fungal infections.'
    ]
  },
  {
    province: 'Western Cape',
    climateZone: 'Mediterranean (hot dry summers, wet cool winters)',
    currentSeason: 'Wet Winter (July)',
    idealCropsNow: ['cabbages', 'spinach', 'potatoes'],
    tips: [
      'Ensure fields have excellent drainage to prevent root rot from winter rains.',
      'July is very wet; reduce supplementary irrigation accordingly to save water/power.',
      'Apply nitrogen top-dressings after heavy rainfall to replace leached nutrients.'
    ]
  },
  {
    province: 'KwaZulu-Natal',
    climateZone: 'Humid Subtropical coastal & temperate Midlands',
    currentSeason: 'Mild Winter (July)',
    idealCropsNow: ['cabbages', 'spinach', 'potatoes', 'tomatoes'],
    tips: [
      'Coastal areas are warm enough for all crops; watch out for late blight in high humidity.',
      'Check Midlands region for frost in valleys and irrigate lightly before frost forecasts.',
      'Use windbreaks to protect delicate crops from gusty coastal winter winds.'
    ]
  },
  {
    province: 'Mpumalanga',
    climateZone: 'Highveld (cold dry winters) & Lowveld (warm sub-tropical)',
    currentSeason: 'Dry Winter (July)',
    idealCropsNow: ['cabbages', 'spinach', 'tomatoes'],
    tips: [
      'Highveld smallholders should focus on winter leafy greens under light cover.',
      'Lowveld areas (e.g. Nelspruit, Komatipoort) can harvest winter tomatoes now.',
      'Apply high potassium fertilizers to winter-grown crops to build frost resistance.'
    ]
  },
  {
    province: 'Eastern Cape',
    climateZone: 'Semi-arid interior to humid temperate coast',
    currentSeason: 'Cool Winter (July)',
    idealCropsNow: ['cabbages', 'spinach', 'dry_beans'],
    tips: [
      'Winter wind-chill can be severe. Protect seedlings with temporary wind barriers.',
      'In the dry Karoo interior, focus water conservation on deep soil mulching.',
      'Check soils for acidity before spring planting; add agricultural lime if needed.'
    ]
  },
  {
    province: 'Free State',
    climateZone: 'Continental (very cold frosty dry winters, hot summers)',
    currentSeason: 'Severe Cold Winter (July)',
    idealCropsNow: ['spinach', 'cabbages'],
    tips: [
      'Severe black frost is common. Use crop covers/shade nets to safeguard spinach.',
      'Do not transplant warm-season crops like tomatoes or maize until mid-October.',
      'This is an excellent time to prepare lands and repair irrigation lines for spring.'
    ]
  },
  {
    province: 'North West',
    climateZone: 'Semi-arid Highveld (dry sunny winter, summer rains)',
    currentSeason: 'Dry Sunny Winter (July)',
    idealCropsNow: ['cabbages', 'spinach'],
    tips: [
      'Water resources are critical. Use drip irrigation rather than overhead sprinklers.',
      'Prepare compost heaps using crop residues to boost soil organic matter for spring.',
      'Keep soil covered with organic mulch to prevent wind erosion from dry winter winds.'
    ]
  },
  {
    province: 'Northern Cape',
    climateZone: 'Arid desert (extreme temps, minimal rainfall, frosty winters)',
    currentSeason: 'Cold Dry Desert Winter (July)',
    idealCropsNow: ['spinach', 'cabbages'],
    tips: [
      'Water in the afternoon only if temperatures are high enough to avoid freezing.',
      'Ensure livestock is kept away from your vegetable gardens using secure wire fencing.',
      'Solar pumps will have shorter running windows in winter; schedule irrigation accordingly.'
    ]
  }
];

export const PROVINCE_WEATHER: Record<Province, WeatherData> = {
  Gauteng: {
    temp: 16,
    condition: 'Sunny & Clear',
    humidity: 25,
    rainProbability: 0,
    windSpeed: 12,
    advice: 'Perfect winter sunshine, but cold tonight (approx 3°C). Mulch lands now and protect frost-sensitive spinach.'
  },
  Limpopo: {
    temp: 23,
    condition: 'Mild & Sunny',
    humidity: 35,
    rainProbability: 0,
    windSpeed: 8,
    advice: 'Great conditions for winter tomatoes in Lowveld. Watch for fungal diseases like early blight due to dew.'
  },
  'Western Cape': {
    temp: 13,
    condition: 'Showers & Windy',
    humidity: 85,
    rainProbability: 80,
    windSpeed: 28,
    advice: 'Heavy winter rains. Stop irrigation systems. Ensure drainage channels are completely clear of weeds.'
  },
  'KwaZulu-Natal': {
    temp: 21,
    condition: 'Partly Cloudy',
    humidity: 60,
    rainProbability: 10,
    windSpeed: 15,
    advice: 'Moderate coastal humidity. Check for leaf spot or powdery mildew. Great planting window.'
  },
  Mpumalanga: {
    temp: 18,
    condition: 'Sunny',
    humidity: 28,
    rainProbability: 0,
    windSpeed: 10,
    advice: 'Cold night coming. Harvest cabbage and spinach in Highveld. Lowveld is warm and ideal for tomatoes.'
  },
  'Eastern Cape': {
    temp: 15,
    condition: 'Cool & Breeze',
    humidity: 55,
    rainProbability: 15,
    windSpeed: 22,
    advice: 'Windy conditions along the coast. Ensure young plants or windbreaks are stable.'
  },
  'Free State': {
    temp: 11,
    condition: 'Very Cold & Sunny',
    humidity: 20,
    rainProbability: 0,
    windSpeed: 14,
    advice: 'Severe night frost alert! Double-cover young leafy greens. Keep planting fields dry in late afternoon.'
  },
  'North West': {
    temp: 17,
    condition: 'Sunny & Dry',
    humidity: 22,
    rainProbability: 0,
    windSpeed: 11,
    advice: 'Dry winter winds can deplete soil humidity. Keep mulching active. Monitor pump filter screens.'
  },
  'Northern Cape': {
    temp: 14,
    condition: 'Clear Skies',
    humidity: 18,
    rainProbability: 0,
    windSpeed: 16,
    advice: 'Very cold desert nights. Maximize solar pump utilization between 10:00 AM and 2:00 PM.'
  }
};

// Preset sample photos representing crop leaf disease symptoms
export const DIAGNOSTIC_PRESETS = [
  {
    id: 'maize_streak',
    cropId: 'maize',
    title: 'Yellow striped leaf lines',
    description: 'Long yellow/white stripes running down the length of maize leaf blades.',
    imageLabel: 'Maize Striping (Viral)',
    diagnosis: 'Maize Streak Virus (MSV)',
    confidence: 94,
    cause: 'Transmitted by Leafhoppers (Cicadulina species). Highly prevalent in late-planted maize or during warm winter periods.',
    treatmentOrganic: 'There is no cure for viral streak. Uproot and burn infected plants immediately to stop leafhopper vectors from spreading it. Keep lands clear of weeds/wild grasses.',
    treatmentChemical: 'Apply pesticide targeting leafhopper vectors early in the morning: Chlorpyrifos or Imidacloprid (use with strict precaution and appropriate protective gear).',
    prevention: 'Plant resistant MSV seed hybrids next season. Plant early at the start of summer rains (October) to avoid peak leafhopper populations.'
  },
  {
    id: 'tomato_blight',
    cropId: 'tomatoes',
    title: 'Dark rings on tomato leaves',
    description: 'Concentric dark brown target-like spots with yellow halo rings on lower leaves first.',
    imageLabel: 'Tomato Early Blight (Fungal)',
    diagnosis: 'Early Blight (Alternaria solani)',
    confidence: 89,
    cause: 'Fungal spores multiplying in humid warm conditions. Splashed up from soil or carried by wind/tools.',
    treatmentOrganic: 'Prune lower leaves to enhance air circulation. Spray homemade copper sulfate mixture or organic baking soda spray (1 tbsp baking soda, 1 tsp organic liquid soap in 4L water).',
    treatmentChemical: 'Apply systemic fungicide containing Mancozeb, Difenoconazole, or Azoxystrobin on a 7-10 day cycle.',
    prevention: 'Always practice crop rotation (do not plant tomatoes/potatoes in the same soil for 3 years). Use drip irrigation instead of overhead sprays to keep leaves dry.'
  },
  {
    id: 'cabbage_caterpillar',
    cropId: 'cabbages',
    title: 'Holes in cabbage leaves',
    description: 'Large irregular holes eaten out of cabbage heads, accompanied by fine silky webs and dark insect waste.',
    imageLabel: 'Cabbage Diamondback Larvae',
    diagnosis: 'Diamondback Moth (DBM) Attack',
    confidence: 92,
    cause: 'Small grey caterpillars of Plutella xylostella feeding on cruciferous leaves. Increases fast in dry warm spells.',
    treatmentOrganic: 'Apply Bacillus thuringiensis (Bt) - an organic, safe biological soil bacterium spray. Release beneficial parasitic wasps (Diadegma) or hand-pick larger larvae.',
    treatmentChemical: 'Rotate chemical classes to prevent resistance. Use Spinetoram, Emamectin benzoate, or Cypermethrin spray.',
    prevention: 'Intercrop cabbages with mustard or garlic to repel moths. Use insect netting over seedlings. Remove wild brassica weeds.'
  },
  {
    id: 'potato_scab',
    cropId: 'potatoes',
    title: 'Rough corky brown lesions on tubers',
    description: 'Dry raised pitted lesions or dark scabby spots on the skin of newly dug potatoes.',
    imageLabel: 'Potato Common Scab (Bacterial)',
    diagnosis: 'Common Scab (Streptomyces scabies)',
    confidence: 85,
    cause: 'Soil-dwelling bacterium that attacks tubers in alkaline or dry soils (pH above 5.5).',
    treatmentOrganic: 'Incorporate pine needles or sulfur into soil to lower pH. Keep soil continuously moist during the first 6 weeks of tuber formation to discourage bacterial growth.',
    treatmentChemical: 'Treat seed tubers with fludioxonil or mancozeb-based seed dressings prior to planting. Clean tools thoroughly.',
    prevention: 'Choose certified scab-free seed potatoes. Keep soil pH slightly acidic (5.0 - 5.5). Avoid alkaline wood ash in potato lands.'
  }
];
