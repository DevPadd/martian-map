export type GuideCategory = {
  id: string;
  title: string;
  shortTitle: string;
};

export type GuideReference = {
  title: string;
  publisher: string;
  url: string;
};

export type RelatedMapLayer = {
  label: string;
  mapLayerId?: string;
  availability: "available" | "planned";
};

export type GuideArticle = {
  id: string;
  categoryId: string;
  title: string;
  introduction: string;
  keywords: string[];
  overview: string;
  whyItMatters: string;
  keyInformation: string[];
  potentialRisks?: string[];
  whatToMonitor?: string[];
  relatedLayers?: RelatedMapLayer[];
  relatedLandmarks?: string[];
  references: GuideReference[];
};

export type MissionRecord = {
  name: string;
  missionType: string;
  dates: string;
  objectives: string;
  achievements: string;
  technology: string;
  limitations: string;
  explorationLesson: string;
};

export type HazardCard = {
  name: string;
  category: string;
  explanation: string;
  whyItMatters: string;
  articleId: string;
};

export type LearningScenario = {
  id: string;
  title: string;
  situation: string;
  question: string;
  choices: string[];
  correctChoice: number;
  explanation: string;
  articleId: string;
};

export const SURVIVAL_MODULE_TITLE = "SURVIVAL MODULE";

export const SURVIVAL_MODULE_INTRO =
  "A field guide to the Martian environment, exploration context, and lessons from robotic missions. This is an educational prototype—not a certified survival manual, operational checklist, or substitute for mission-specific training.";

export const GUIDE_CATEGORIES: GuideCategory[] = [
  { id: "mars", title: "Understanding Mars", shortTitle: "Mars" },
  {
    id: "spacesuit",
    title: "Spacesuit and Life Support",
    shortTitle: "Suit & life support",
  },
  {
    id: "terrain",
    title: "Surface and Terrain Hazards",
    shortTitle: "Terrain",
  },
  {
    id: "environment",
    title: "Environmental Hazards",
    shortTitle: "Environment",
  },
  { id: "eva", title: "EVA Safety Concepts", shortTitle: "EVA" },
  { id: "habitat", title: "Habitat and Base Safety", shortTitle: "Habitat" },
  {
    id: "communication",
    title: "Communication and Emergency Awareness",
    shortTitle: "Communication",
  },
  { id: "health", title: "Human Health and Wellbeing", shortTitle: "Health" },
  { id: "missions", title: "Past Mars Missions", shortTitle: "Past missions" },
];

const MARS_FACTS: GuideReference = {
  title: "Mars: Facts",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mars/facts/",
};
const HUMANS_TO_MARS: GuideReference = {
  title: "Humans to Mars",
  publisher: "NASA",
  url: "https://www.nasa.gov/humans-in-space/humans-to-mars/",
};
const SPACE_RADIATION: GuideReference = {
  title: "Hazard: Space Radiation",
  publisher: "NASA Human Research Program",
  url: "https://www.nasa.gov/hrp/hazard-space-radiation/",
};
const HUMAN_RESEARCH_PROGRAM: GuideReference = {
  title: "Human Research Program",
  publisher: "NASA",
  url: "https://www.nasa.gov/hrp/",
};
const PERCHLORATE_RESEARCH: GuideReference = {
  title:
    "Detection of Perchlorate and the Soluble Chemistry of Martian Soil at the Phoenix Lander Site",
  publisher: "Science",
  url: "https://doi.org/10.1126/science.1172466",
};
const PERSEVERANCE: GuideReference = {
  title: "Mars 2020: Perseverance Rover",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/mars-2020-perseverance/",
};
const CURIOSITY: GuideReference = {
  title: "Mars Science Laboratory: Curiosity",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/msl-curiosity/",
};
const VIKING: GuideReference = {
  title: "Viking 1",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/viking-1/",
};
const PATHFINDER: GuideReference = {
  title: "Mars Pathfinder",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/mars-pathfinder/",
};
const SPIRIT_OPPORTUNITY: GuideReference = {
  title: "Mars Exploration Rovers: Spirit and Opportunity",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
};
const INSIGHT: GuideReference = {
  title: "InSight",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/insight/",
};
const INGENUITY: GuideReference = {
  title: "Ingenuity Mars Helicopter",
  publisher: "NASA Science",
  url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: "understanding-mars",
    categoryId: "mars",
    title: "Understanding Mars",
    introduction:
      "Mars is a cold, dry terrestrial planet with a thin carbon-dioxide-rich atmosphere, a day similar in length to Earth's, and seasons shaped by its tilted axis and elongated orbit.",
    keywords: ["sol", "gravity", "atmosphere", "radiation", "seasons", "dust"],
    overview:
      "Mars has a rocky surface, a very tenuous atmosphere, polar caps, and a global system of volcanoes, impact basins, canyons, and ancient channels. Present-day conditions differ greatly from Earth's.",
    whyItMatters:
      "Environmental context affects how people would interpret observations and how future mission systems must be designed. Robotic measurements are not a substitute for human-rated system validation.",
    keyInformation: [
      "A Martian solar day, or sol, is about 24 hours and 39 minutes. A Martian year is about 687 Earth days.",
      "Mars's surface gravity is about 38% of Earth's. Long-term human adaptation to partial gravity remains an open research area.",
      "The atmosphere is mostly carbon dioxide and has less than 1% of Earth's average surface pressure.",
      "Mars has seasons; their duration differs from Earth's because the Martian year is longer and its orbit is more elliptical.",
      "NASA describes Mars as a planet with a dynamic dust cycle, including local and planet-encircling dust storms.",
    ],
    whatToMonitor: [
      "Local time and season when comparing observations.",
      "Weather and atmospheric measurements from the relevant lander or rover; conditions vary by place and time.",
      "Map projection, coordinate convention, data resolution, and acquisition date before interpreting imagery.",
    ],
    relatedLayers: [
      {
        label: "Global MOLA/HRSC hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw",
        availability: "available",
      },
      {
        label: "Global color hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw",
        availability: "available",
      },
    ],
    relatedLandmarks: ["olympus-mons", "valles-marineris", "hellas-basin"],
    references: [MARS_FACTS, HUMANS_TO_MARS],
  },
  {
    id: "spacesuit-life-support",
    categoryId: "spacesuit",
    title: "Spacesuit and Life Support",
    introduction:
      "A spacesuit is a personal spacecraft: it provides a pressurized environment and integrates systems for breathing, thermal management, communications, mobility, and power.",
    keywords: [
      "pressure",
      "oxygen",
      "cooling",
      "water",
      "battery",
      "communications",
      "dust",
      "suit",
    ],
    overview:
      "Human-rated Mars surface suits and their life-support systems require dedicated engineering, testing, and certification. This article describes general subsystem roles, not a particular flight suit or operating procedure.",
    whyItMatters:
      "Suit functions are interdependent. A leak, thermal-control issue, loss of power, or communication fault could affect multiple capabilities; safe operation depends on validated integrated systems and mission procedures.",
    keyInformation: [
      "The pressure garment maintains a habitable pressure around the wearer against Mars's very low ambient pressure.",
      "A life-support subsystem manages a breathable gas supply and removes metabolic carbon dioxide; exact architectures vary by suit.",
      "Thermal control moves heat away from or toward the crew member, while layers help limit heat transfer and protect against the environment.",
      "A portable life-support pack may integrate oxygen, carbon-dioxide removal, cooling, power, telemetry, and communications.",
      "Gloves, boots, joints, visors, seals, and dust-tolerant interfaces affect mobility, visibility, and system integrity.",
      "Water and consumable management are mission-level design concerns; the availability and arrangement depend on the specific suit.",
    ],
    potentialRisks: [
      "Pressure loss, thermal stress, contamination, reduced visibility, mobility limitations, or depleted consumables are design hazards that require formal analysis.",
      "Mars dust is fine and abrasive; its interaction with seals, joints, optics, and mechanisms must be assessed for each design.",
    ],
    whatToMonitor: [
      "Suit pressure, oxygen and carbon-dioxide system status, thermal-control indicators, battery state, communications, and suit-integrity telemetry as defined by a qualified mission system.",
      "Dust exposure and changes in mobility, visibility, or equipment condition.",
    ],
    relatedLandmarks: ["perseverance-landing-site", "curiosity-landing-site"],
    references: [HUMANS_TO_MARS, HUMAN_RESEARCH_PROGRAM, PERSEVERANCE],
  },
  {
    id: "surface-terrain-hazards",
    categoryId: "terrain",
    title: "Surface and Terrain Hazards",
    introduction:
      "A terrain map can reveal broad landforms, but surface hazards may exist below the data's resolution or be hidden by shadow, dust, or viewing geometry.",
    keywords: [
      "slope",
      "sand",
      "regolith",
      "rocks",
      "craters",
      "cliffs",
      "roughness",
      "terrain",
    ],
    overview:
      "Martian terrain includes steep crater rims, cliffs, dunes, loose regolith, rock fields, channels, and boundaries between geological units. Their appearance depends on image scale, illumination, and data processing.",
    whyItMatters:
      "Slope and surface texture can affect mobility, visibility, and route interpretation. A digital elevation model or image supports awareness, but cannot independently establish traversability or structural stability.",
    keyInformation: [
      "Loose sand and regolith may have different mechanical properties from exposed bedrock; visual appearance alone can be misleading.",
      "Rocks and small craters can be hidden by pixel size, image angle, shadows, or dust cover.",
      "Cliffs, crater walls, and depressions may create steep gradients or local visibility constraints.",
      "Elevation, slope, and roughness products are derived from measurements and carry resolution, registration, and uncertainty limitations.",
      "Geologic contacts identify mapped units; a boundary is not itself proof of a hazard or a stable surface.",
    ],
    potentialRisks: [
      "Unrecognized slope, loose material, obstacles, drop-offs, and terrain obscured by dust can complicate route planning.",
      "A map or image can be outdated, incomplete, or too coarse to show a local hazard.",
    ],
    whatToMonitor: [
      "Data resolution, acquisition date, illumination, stereo coverage, and uncertainty when available.",
      "Terrain changes across multiple image scales and from independent data products.",
      "Local slope, roughness, rock abundance, and known limitations of the selected dataset.",
    ],
    relatedLayers: [
      {
        label: "Global MOLA/HRSC hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw",
        availability: "available",
      },
      {
        label: "Jezero HiRISE ortho mosaic",
        mapLayerId:
          "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd",
        availability: "available",
      },
      {
        label: "Gale CTX mosaic",
        mapLayerId: "Gale_CTX_BlockAdj_dd",
        availability: "available",
      },
      { label: "Slope and roughness rasters", availability: "planned" },
    ],
    relatedLandmarks: ["jezero-crater", "gale-crater", "valles-marineris"],
    references: [MARS_FACTS, PERSEVERANCE, CURIOSITY],
  },
  {
    id: "environmental-hazards",
    categoryId: "environment",
    title: "Environmental Hazards",
    introduction:
      "Mars's thin atmosphere, temperature extremes, radiation environment, dust, and soil chemistry create challenges for both people and equipment.",
    keywords: [
      "radiation",
      "dust storm",
      "temperature",
      "perchlorate",
      "atmosphere",
      "solar",
      "cosmic",
    ],
    overview:
      "Environmental hazards arise from conditions such as low atmospheric pressure, cold, radiation, wind-driven dust, and reactive or toxic compounds. The actual exposure depends on location, time, shielding, and mission design.",
    whyItMatters:
      "Understanding what is measured—and what is not—helps teams avoid treating global averages or remote-sensing products as local real-time conditions.",
    keyInformation: [
      "Mars's atmosphere is dominated by carbon dioxide and is extremely thin compared with Earth's; it is not breathable.",
      "Temperature varies with season, latitude, time of day, elevation, and weather.",
      "Solar energetic particles and galactic cosmic rays are distinct radiation sources; shielding and exposure assessment are mission-design topics.",
      "Dust storms can reduce visibility and affect solar-powered hardware, while fine dust can accumulate on exposed surfaces.",
      "Perchlorate salts have been measured in Martian soil at landing sites. Their potential biological and material effects require careful handling and analysis.",
    ],
    potentialRisks: [
      "Radiation exposure, cold, pressure, reduced visibility, dust loading, and soil contamination are potential human-system concerns.",
      "Perchlorate detection is evidence about specific sampled locations, not a measurement of every surface area or a direct human exposure assessment.",
    ],
    whatToMonitor: [
      "Local weather and dust observations, instrument provenance, acquisition time, and spatial coverage.",
      "Radiation environment using suitable instruments and mission-specific exposure analysis.",
      "Dust accumulation and environmental control data for relevant equipment.",
    ],
    relatedLayers: [
      {
        label: "Global MOLA/HRSC hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw",
        availability: "available",
      },
    ],
    relatedLandmarks: [
      "hellas-basin",
      "korolev-crater",
      "perseverance-landing-site",
    ],
    references: [
      MARS_FACTS,
      HUMANS_TO_MARS,
      SPACE_RADIATION,
      PERCHLORATE_RESEARCH,
      PERSEVERANCE,
    ],
  },
  {
    id: "eva-safety",
    categoryId: "eva",
    title: "EVA Safety Concepts",
    introduction:
      "An extravehicular activity (EVA) is a complex team operation that depends on a clear objective, shared situational awareness, and a mission-approved plan.",
    keywords: [
      "EVA",
      "extravehicular",
      "navigation",
      "buddy",
      "mission control",
      "return",
      "inspection",
    ],
    overview:
      "EVA planning spans the crew, suit and vehicle systems, communications, navigation, science goals, terrain, and support teams. Mars communication delays mean some decisions cannot rely on immediate Earth response.",
    whyItMatters:
      "Clear objectives and shared understanding help teams manage complexity and recognize when observations, system status, or conditions differ from expectations.",
    keyInformation: [
      "Mission objectives and boundaries should be defined through approved mission planning.",
      "Location awareness involves coordinate references, landmarks, route context, and communication conventions.",
      "Crew coordination includes maintaining shared context and accounting for each team member's status.",
      "Communication plans must account for distance, relay availability, and time delays.",
      "Post-activity equipment inspection and data review are part of learning about system performance.",
    ],
    potentialRisks: [
      "Navigation ambiguity, terrain uncertainty, communication gaps, equipment degradation, or changing conditions can increase mission complexity.",
    ],
    whatToMonitor: [
      "Crew and vehicle location, planned-versus-observed route context, communication status, environmental information, and equipment telemetry as specified in mission procedures.",
    ],
    relatedLayers: [
      {
        label: "Jezero HiRISE ortho mosaic",
        mapLayerId:
          "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd",
        availability: "available",
      },
      {
        label: "Global color hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw",
        availability: "available",
      },
    ],
    relatedLandmarks: ["perseverance-landing-site", "curiosity-landing-site"],
    references: [HUMANS_TO_MARS, PERSEVERANCE, CURIOSITY],
  },
  {
    id: "habitat-safety",
    categoryId: "habitat",
    title: "Habitat and Base Safety",
    introduction:
      "A future Mars habitat would need to maintain a controlled environment and manage air, water, food, power, waste, and equipment over long periods far from Earth.",
    keywords: [
      "habitat",
      "air",
      "pressure",
      "water",
      "food",
      "power",
      "fire",
      "waste",
      "hygiene",
    ],
    overview:
      "Habitat safety is a systems-engineering challenge. Life-support, power, thermal control, structure, environmental monitoring, and crew operations interact and require redundancy and verified procedures.",
    whyItMatters:
      "Mars missions cannot rely on rapid resupply or immediate physical assistance from Earth. Resource planning, system reliability, maintenance, and crew health are central design considerations.",
    keyInformation: [
      "Atmosphere and pressure control must be integrated with leak detection, gas monitoring, and life-support functions.",
      "Water and food availability depend on mission architecture, storage, recycling, and resupply assumptions.",
      "Power systems must be matched to habitat loads, location, environmental conditions, and maintenance constraints.",
      "Electrical and fire safety require engineered controls; Earth-habitat experience cannot be transferred without accounting for the mission environment.",
      "Waste handling, hygiene, and environmental monitoring are essential parts of long-duration habitation.",
    ],
    potentialRisks: [
      "Loss or degradation of pressure, air quality, power, thermal control, water systems, or structural integrity may affect multiple habitat functions.",
    ],
    whatToMonitor: [
      "Habitat environmental sensors, system health, power generation and storage, consumable inventories, and maintenance trends as defined by the mission.",
    ],
    relatedLandmarks: ["perseverance-landing-site"],
    references: [HUMANS_TO_MARS, HUMAN_RESEARCH_PROGRAM, PERSEVERANCE],
  },
  {
    id: "communication-awareness",
    categoryId: "communication",
    title: "Communication and Emergency Awareness",
    introduction:
      "Communication between Mars and Earth is delayed by the distance between the planets, so a crewed mission would need robust communication systems and carefully defined autonomy.",
    keywords: [
      "communication",
      "delay",
      "emergency",
      "location",
      "mission control",
      "autonomy",
      "abort",
    ],
    overview:
      "Mars mission communications may use direct-to-Earth links and relay spacecraft. Availability and delay vary with geometry, network coverage, and system status.",
    whyItMatters:
      "Earth-based controllers cannot provide instantaneous guidance. Mission architectures must define authority, decision-making, location reporting, and contingency concepts before flight.",
    keyInformation: [
      "One-way light time varies with the changing Earth–Mars distance; conversations are not real-time.",
      "Orbiters can relay data between surface assets and Earth, but relay opportunities and network availability are not continuous guarantees.",
      "Location reporting requires consistent coordinate conventions, shared reference data, and clear status communication.",
      "Mission abort and return concepts depend on vehicle design and approved procedures; no universal procedure can be given here.",
    ],
    potentialRisks: [
      "Communication delay, loss of relay, ambiguous location reports, or different mental models can complicate coordination.",
    ],
    whatToMonitor: [
      "Link status, relay opportunities, message timestamps, crew location, and the agreed communication protocol.",
    ],
    relatedLandmarks: ["perseverance-landing-site", "curiosity-landing-site"],
    references: [HUMANS_TO_MARS, PERSEVERANCE, CURIOSITY],
  },
  {
    id: "human-health",
    categoryId: "health",
    title: "Human Health and Wellbeing",
    introduction:
      "A long-duration Mars mission would expose crew to partial gravity, isolation, radiation, constrained resources, and distance from Earth-based medical support.",
    keywords: [
      "health",
      "gravity",
      "dehydration",
      "fatigue",
      "sleep",
      "isolation",
      "psychological",
      "medical",
    ],
    overview:
      "Human health in space is an active research area. Evidence from orbital missions and analog environments can inform planning, but does not fully represent the duration, gravity, or surface conditions of a Mars mission.",
    whyItMatters:
      "Physical and psychological wellbeing affect individual health, teamwork, and mission performance. Future crews would need medical planning adapted to the mission and communication delays.",
    keyInformation: [
      "Mars gravity is about 0.38 times Earth's; the long-term effects of living and working in Martian gravity remain uncertain.",
      "Sleep, circadian rhythm, workload, hydration, nutrition, and exercise are interconnected health considerations.",
      "Isolation and confinement can affect mood, cognition, relationships, and team dynamics.",
      "Medical capability, equipment, training, and access to remote expertise depend on mission design.",
    ],
    potentialRisks: [
      "Reduced gravity, radiation, fatigue, stress, limited medical resources, and delayed support are subjects for mission-specific risk assessment.",
    ],
    whatToMonitor: [
      "Crew health and wellbeing through private, validated medical and human-factors systems—not through this map interface.",
      "Sleep, workload, nutrition, exercise, and team factors using approved mission protocols.",
    ],
    relatedLandmarks: ["perseverance-landing-site", "curiosity-landing-site"],
    references: [HUMANS_TO_MARS, HUMAN_RESEARCH_PROGRAM, MARS_FACTS],
  },
  {
    id: "past-missions",
    categoryId: "missions",
    title: "Past Mars Missions",
    introduction:
      "Robotic missions have built a growing record of Mars's geology, atmosphere, climate, and engineering challenges. Their achievements are informative, but robotic capability is not proof of human-system readiness.",
    keywords: [
      "Viking",
      "Pathfinder",
      "Sojourner",
      "Spirit",
      "Opportunity",
      "Curiosity",
      "InSight",
      "Perseverance",
      "Ingenuity",
      "mission",
    ],
    overview:
      "Each mission was designed for a specific scientific or technology objective. Landing systems, instruments, mobility, autonomy, power, and mission operations changed substantially across decades.",
    whyItMatters:
      "Mission history shows how teams work with long communication delays, limited power, uncertain terrain, aging hardware, and unexpected discoveries. These are lessons for engineering and science—not ready-made human procedures.",
    keyInformation: [
      "Viking 1 and Viking 2 combined orbiters and landers; Viking 1 made the first NASA successful Mars landing in 1976.",
      "Mars Pathfinder demonstrated an airbag-assisted landing and deployed Sojourner, the first Mars rover, in 1997.",
      "Spirit and Opportunity explored opposite sides of Mars and found evidence of past water-related environments.",
      "Curiosity has studied Gale Crater's geology and habitability, including its layered Mount Sharp deposits.",
      "InSight investigated Mars's interior using seismic and geophysical measurements from Elysium Planitia.",
      "Perseverance explores Jezero Crater, studies its geological record, and collects samples for possible future return; sample return is not complete.",
      "Ingenuity was a technology demonstration that achieved powered, controlled flight on another planet and later supported rover operations as an aerial scout.",
    ],
    relatedLayers: [
      {
        label: "Jezero HiRISE ortho mosaic",
        mapLayerId:
          "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd",
        availability: "available",
      },
      {
        label: "Gale CTX mosaic",
        mapLayerId: "Gale_CTX_BlockAdj_dd",
        availability: "available",
      },
      {
        label: "Global color hillshade",
        mapLayerId: "Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw",
        availability: "available",
      },
    ],
    relatedLandmarks: [
      "perseverance-landing-site",
      "curiosity-landing-site",
      "viking-1-landing-site",
      "insight-landing-site",
      "gale-crater",
      "jezero-crater",
      "gusev-crater",
    ],
    references: [
      VIKING,
      PATHFINDER,
      SPIRIT_OPPORTUNITY,
      CURIOSITY,
      INSIGHT,
      PERSEVERANCE,
      INGENUITY,
    ],
  },
];

export const MARS_MISSIONS: MissionRecord[] = [
  {
    name: "Viking 1",
    missionType: "Orbiters and stationary landers",
    dates:
      "Launched August 20, 1975; orbiter arrived June 19, 1976; lander touched down July 20, 1976.",
    objectives:
      "Image and map Mars from orbit; study surface composition, atmosphere, weather, and possible signs of life at the Chryse Planitia landing site.",
    achievements:
      "Returned extensive orbital and surface images, weather observations, and soil analyses. Its lander made NASA's first successful Mars landing.",
    technology:
      "Combined orbiter-lander architecture, long-lived surface platforms, robotic sampling arms, and onboard biological experiments.",
    limitations:
      "The lander was stationary and could examine only its immediate surroundings; its life-detection results remain scientifically debated and are not evidence of confirmed life.",
    explorationLesson:
      "Long-lived surface instruments and environmental monitoring provide valuable context, while interpretations require careful review of the measurement and experiment limits.",
  },
  {
    name: "Viking 2",
    missionType: "Orbiter and stationary lander",
    dates:
      "Launched September 9, 1975; orbiter arrived August 7, 1976; lander touched down September 3, 1976.",
    objectives:
      "Map Mars from orbit and investigate the surface, atmosphere, weather, and soil at Utopia Planitia.",
    achievements:
      "Returned orbital observations and surface images, weather records, and soil analyses from a second landing site.",
    technology:
      "Used the Viking orbiter-lander architecture, surface imaging, meteorological instruments, and robotic soil sampling.",
    limitations:
      "The lander was stationary and its measurements represented a limited local area; its biological experiment results do not confirm life.",
    explorationLesson:
      "Observations from more than one landing site help reveal geographic differences and the limits of generalizing from a single location.",
  },
  {
    name: "Mars Pathfinder and Sojourner",
    missionType: "Lander and technology-demonstration rover",
    dates: "Launched December 4, 1996; landed July 4, 1997.",
    objectives:
      "Demonstrate a lower-cost Mars landing approach and explore rocks and soil at Ares Vallis.",
    achievements:
      "Returned surface images, weather data, and in-situ rock and soil measurements; Sojourner demonstrated mobility and proximity science.",
    technology:
      "Used parachutes and airbags to cushion landing, then deployed a small rover from the lander.",
    limitations:
      "The lander and rover operated for a short surface campaign and within a small area compared with later long-duration rovers.",
    explorationLesson:
      "Landing system design, deployment, communications, and surface operations must work as an integrated sequence.",
  },
  {
    name: "Spirit",
    missionType: "Solar-powered Mars rover",
    dates:
      "Launched June 10, 2003; landed at Gusev Crater on January 4, 2004; last communication was in 2010.",
    objectives:
      "Study the geology of Gusev Crater and investigate evidence that water may once have altered the region.",
    achievements:
      "Found rocks and soils with evidence of past water-related alteration and explored the Columbia Hills.",
    technology:
      "Mobile robotic geology with panoramic imaging, instruments for rock analysis, and autonomous navigation capabilities.",
    limitations:
      "Solar power, dust, terrain, hardware wear, and communication geometry constrained operations; Spirit became immobilized in soft soil and later ceased communicating.",
    explorationLesson:
      "Mobility and power margins strongly shape science return, and an immobilized rover may still contribute through stationary observations.",
  },
  {
    name: "Opportunity",
    missionType: "Solar-powered Mars rover",
    dates:
      "Launched July 7, 2003; landed at Meridiani Planum on January 25, 2004; mission ended in 2018.",
    objectives:
      "Study rocks and soils at Meridiani Planum, where orbital observations suggested past water-related mineral deposits.",
    achievements:
      "Found evidence of ancient water-related environments and traveled far beyond its originally planned surface campaign.",
    technology:
      "Mobile robotic geology with panoramic imaging, instruments for rock analysis, and autonomous navigation capabilities.",
    limitations:
      "Solar power, dust, terrain, hardware wear, and communication geometry constrained operations; a planet-encircling dust event contributed to the end of contact.",
    explorationLesson:
      "Environmental conditions can affect energy and mission lifetime; long-lived missions must adapt science plans as hardware and conditions change.",
  },
  {
    name: "Curiosity",
    missionType: "Nuclear-powered Mars rover",
    dates:
      "Launched November 26, 2011; landed in Gale Crater on August 6, 2012.",
    objectives:
      "Assess whether Gale Crater once had environments capable of supporting microbial life and investigate its geology and climate history.",
    achievements:
      "Found evidence of ancient habitable lake environments and has studied a long record of sedimentary rocks, including Mount Sharp.",
    technology:
      "Introduced the Mars Science Laboratory's sky-crane landing system, a large mobile laboratory, onboard sample analysis, and autonomous driving capabilities.",
    limitations:
      "The rover is limited by terrain, energy, communications, instrument condition, and the small area it can directly sample.",
    explorationLesson:
      "Autonomous hazard assessment and onboard science tools help a rover work despite communication delays, but do not replace human judgment or prove human systems are ready.",
  },
  {
    name: "InSight",
    missionType: "Stationary geophysical lander",
    dates:
      "Launched May 5, 2018; landed in Elysium Planitia on November 26, 2018; mission ended in 2022.",
    objectives:
      "Study Mars's interior and geophysical activity, including marsquakes and heat flow.",
    achievements:
      "Recorded marsquakes and provided data used to investigate the planet's crust, mantle, core, and seismicity.",
    technology:
      "Deployed a highly sensitive seismometer and other geophysical instruments on the surface.",
    limitations:
      "Its stationary design could not travel to alternate terrain; dust accumulation on solar panels eventually reduced available power.",
    explorationLesson:
      "Power margins and environmental effects can end a mission even when scientific instruments remain valuable.",
  },
  {
    name: "Perseverance",
    missionType: "Astrobiology and sample-caching rover",
    dates:
      "Launched July 30, 2020; landed in Jezero Crater on February 18, 2021.",
    objectives:
      "Study ancient habitability, seek evidence of past microbial life, collect and cache samples, and test technologies relevant to future exploration.",
    achievements:
      "Explores a crater with an ancient lake and delta record; studies rocks and weather, collects samples, and demonstrated oxygen production from the atmosphere with MOXIE.",
    technology:
      "Uses terrain-relative navigation during landing, autonomous driving, and a sample-caching system. Instruments include Mastcam-Z, SuperCam, PIXL, SHERLOC, MEDA, and RIMFAX. MOXIE was an oxygen-production technology demonstration, not crew life support.",
    limitations:
      "Samples are cached on Mars; their return to Earth depends on a future mission and has not been completed. Scientific observations do not confirm past life.",
    explorationLesson:
      "Autonomy, resource demonstrations, and sample curation advance robotic science and help inform future concepts, but do not validate crewed landing, EVA, or survival systems.",
  },
  {
    name: "Ingenuity",
    missionType: "Technology-demonstration helicopter and aerial scout",
    dates:
      "Arrived with Perseverance; first powered flight April 19, 2021; final flight January 18, 2024, after 72 flights.",
    objectives:
      "Demonstrate powered, controlled flight in the thin Martian atmosphere; later provide aerial scouting support for rover operations.",
    achievements:
      "Became the first aircraft to achieve powered, controlled flight on another planet and substantially exceeded its original demonstration plan.",
    technology:
      "A lightweight rotorcraft used autonomous flight control and onboard navigation in an environment with very low atmospheric density.",
    limitations:
      "Its performance depended on local conditions, limited communications and energy, and a small-scale technology-demonstration design; the mission ended after flight damage.",
    explorationLesson:
      "Aerial perspectives can support route reconnaissance and science planning as a future concept, but Ingenuity was not a human transport or safety system.",
  },
];

export const HAZARD_CARDS: HazardCard[] = [
  {
    name: "Thin atmosphere and pressure",
    category: "Environment",
    explanation:
      "Mars's atmosphere is mostly carbon dioxide and far thinner than Earth's.",
    whyItMatters:
      "The environment is not breathable and requires specially designed pressure and life-support systems for human exploration.",
    articleId: "environmental-hazards",
  },
  {
    name: "Radiation exposure",
    category: "Environment / health",
    explanation:
      "Solar particles and galactic cosmic rays contribute to the radiation environment beyond Earth's protective atmosphere and magnetic field.",
    whyItMatters:
      "Exposure assessment and shielding are mission-design concerns; this map does not measure a crew member's dose.",
    articleId: "environmental-hazards",
  },
  {
    name: "Dust and reduced visibility",
    category: "Environment / equipment",
    explanation:
      "Wind-driven dust can affect visibility and accumulate on exposed surfaces.",
    whyItMatters:
      "Dust is relevant to instruments, power systems, seals, mobility, and observation quality.",
    articleId: "environmental-hazards",
  },
  {
    name: "Uncertain terrain",
    category: "Surface",
    explanation:
      "Slope, loose material, rocks, cliffs, and data resolution can complicate interpretation of a route.",
    whyItMatters:
      "Remote imagery cannot independently certify traversability or reveal every local obstacle.",
    articleId: "surface-terrain-hazards",
  },
  {
    name: "Suit and life-support dependence",
    category: "Systems",
    explanation:
      "Suit pressure, breathable gas, thermal management, communications, and power are interdependent functions.",
    whyItMatters:
      "Human surface operations require integrated, validated systems and approved procedures.",
    articleId: "spacesuit-life-support",
  },
  {
    name: "Communication delay",
    category: "Mission operations",
    explanation:
      "The Earth–Mars distance causes communication delays that vary over time.",
    whyItMatters:
      "Mission architectures must support reliable coordination and planned autonomy.",
    articleId: "communication-awareness",
  },
];

export const LEARNING_SCENARIOS: LearningScenario[] = [
  {
    id: "dusty-imagery",
    title: "A dusty image",
    situation:
      "A map image shows a low-contrast patch near a planned science area. The image is several months old, and the mission feed has recently reported regional dust activity.",
    question: "What is the most scientifically careful interpretation?",
    choices: [
      "Treat the patch as confirmed safe, because it appears flat.",
      "Check the image date, resolution, viewing conditions, and newer independent observations before drawing conclusions.",
      "Assume the patch is a dust storm at the surface right now.",
    ],
    correctChoice: 1,
    explanation:
      "The image alone cannot confirm current local conditions or traversability. Date, scale, illumination, and corroborating data matter; operational route decisions require mission-approved products.",
    articleId: "surface-terrain-hazards",
  },
  {
    id: "delayed-message",
    title: "A delayed reply",
    situation:
      "A fictional surface team sends a status update to Earth and does not receive an immediate reply.",
    question: "What does this scenario illustrate?",
    choices: [
      "Earth can always respond in real time if the message is important.",
      "Mars missions need predefined communication architecture and autonomy because Earth–Mars communication is delayed.",
      "A map application can determine the correct emergency response.",
    ],
    correctChoice: 1,
    explanation:
      "Communication delay is a mission architecture constraint. This educational scenario does not prescribe any response; real procedures would be designed, verified, and trained for the mission.",
    articleId: "communication-awareness",
  },
  {
    id: "rover-discovery",
    title: "A promising rock",
    situation:
      "A rover detects minerals and textures consistent with past interaction with water at an ancient lake site.",
    question: "Which conclusion is supported without overstating the evidence?",
    choices: [
      "The rover has confirmed ancient life.",
      "The site records geological evidence of past water; habitability and any evidence of life require careful, separate assessment.",
      "The site is automatically safe for humans.",
    ],
    correctChoice: 1,
    explanation:
      "Geological evidence of water and potential habitability is not confirmation of life and says nothing by itself about present-day human safety. Interpretations must match the measurements and their limits.",
    articleId: "past-missions",
  },
];
