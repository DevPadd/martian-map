import type { MarsLandmark } from "./landmarkTypes";

export const LANDMARK_CATALOG: MarsLandmark[] = [
  {
    id: "jezero-crater",
    name: "Jezero Crater",
    category: "crater",
    coordinates: [77.4, 18.4],
    description:
      "Impact crater explored by NASA's Perseverance rover; its western edge contains an ancient river delta.",
    details:
      "Jezero is an approximately 45-kilometer-wide impact crater on the western edge of Isidis Planitia. Orbital observations revealed ancient channels entering the crater and fan-shaped deposits along its western margin. NASA selected the site for the Perseverance rover because these environments may preserve evidence of past habitable conditions. Perseverance landed in February 2021 and has investigated the crater floor and delta deposits.",
    images: [
      {
        src: "/landmarks/jezero-crater.jpg",
        alt: "Orbital view of Jezero Crater, the Mars 2020 landing site",
        caption: "Jezero Crater and its ancient delta region from orbit.",
        attribution: "NASA/JPL-Caltech",
        sourceUrl: "https://images.nasa.gov/details/PIA23239",
        width: 640,
        height: 513,
      },
    ],
  },
  {
    id: "jezero-western-delta",
    name: "Jezero Western Delta",
    category: "delta",
    coordinates: [77.45, 18.43],
    description:
      "Fan-shaped deposit where an ancient river flowed into Jezero Crater. Marker location is approximate.",
    details:
      "The western delta formed as a river carried sediment into an ancient lake within Jezero Crater. Layered deposits and exposed rock textures provide a record of changing water and sediment conditions. NASA's Perseverance rover has explored the delta and collected rock cores for possible return to Earth. This marker is an approximate location for the delta; the feature covers a broad area.",
    images: [],
  },
  {
    id: "gale-crater",
    name: "Gale Crater",
    category: "crater",
    coordinates: [137.4, -5.4],
    description: "Large impact crater explored by NASA's Curiosity rover.",
    details:
      "Gale Crater is about 154 kilometers across and contains the layered mound Aeolis Mons, also called Mount Sharp, rising from its center. Orbital evidence of clay and sulfate minerals helped make the crater a compelling target for the Curiosity rover. Curiosity landed in 2012 and has studied sedimentary rocks that record ancient environments and their transition over time.",
    images: [],
  },
  {
    id: "olympus-mons",
    name: "Olympus Mons",
    category: "mountain",
    coordinates: [-133.8, 18.65],
    description:
      "The largest known volcano in the Solar System. Longitude is represented in the map's -180 to 180 degree range.",
    details:
      "Olympus Mons is a giant shield volcano in the Tharsis region. It rises nearly 22 kilometers above the surrounding plains and spans hundreds of kilometers. Its broad profile was built by repeated eruptions of low-viscosity lava, while a prominent escarpment marks much of its outer margin. The marker gives an approximate position for the volcano.",
    images: [],
  },
  {
    id: "valles-marineris",
    name: "Valles Marineris",
    category: "canyon",
    coordinates: [-70, -10.5],
    description:
      "A vast system of canyons near Mars's equator. Marker indicates an approximate central location.",
    details:
      "Valles Marineris is a vast system of connected troughs and canyons extending thousands of kilometers along the Martian equator. Its formation is associated with the tectonic stretching and fracturing of the Tharsis region, followed by erosion and landslides. The system contains diverse landforms and layered deposits; this point marks only an approximate central location.",
    images: [],
  },
  {
    id: "eberswalde-crater",
    name: "Eberswalde Crater",
    category: "crater",
    coordinates: [-33.5, -23.9],
    description:
      "Impact crater containing a well-preserved ancient delta deposit.",
    details:
      "Eberswalde Crater contains one of the clearest examples of a fossilized river delta identified on Mars. An ancient channel delivered sediment into standing water, depositing a fan-shaped feature on the crater floor. The preserved branching channels and layered deposits make the site important for understanding the history of surface water. The marker is an approximate crater location.",
    images: [],
  },
  {
    id: "korolev-crater",
    name: "Korolev Crater",
    category: "crater",
    coordinates: [164, 72.7],
    description:
      "A large northern crater whose floor is partly covered by a thick deposit of water ice.",
    details:
      "Korolev Crater is about 82 kilometers wide and lies in the northern lowlands of Mars. A thick, year-round deposit of water ice fills much of its interior. The crater's rim helps trap cold air above the ice, creating conditions that help preserve the deposit. The marker indicates the approximate center of the crater.",
    images: [],
  },
  {
    id: "hellas-basin",
    name: "Hellas Basin",
    category: "crater",
    coordinates: [70, -42],
    description:
      "An immense impact basin in Mars's southern hemisphere and one of the planet's lowest regions.",
    details:
      "Hellas is a multi-ring impact basin roughly 2,300 kilometers across. Its deep interior lies several kilometers below the surrounding terrain, producing some of the highest atmospheric pressures found at the Martian surface. Dust, frost, and seasonal weather make the basin's surface conditions distinct from much of the planet. The marker is an approximate central location.",
    images: [],
  },
  {
    id: "arsia-mons",
    name: "Arsia Mons",
    category: "mountain",
    coordinates: [-120.1, -8.4],
    description: "A major shield volcano in the Tharsis volcanic region.",
    details:
      "Arsia Mons is the southernmost of the three large aligned Tharsis Montes volcanoes. It is a broad shield volcano built by repeated lava flows and has a large summit caldera. The volcano is part of the extensive Tharsis region, where volcanic activity and uplift reshaped the surrounding crust. The marker gives an approximate summit location.",
    images: [],
  },
  {
    id: "ascraeus-mons",
    name: "Ascraeus Mons",
    category: "mountain",
    coordinates: [-104.4, 11.9],
    description:
      "A tall shield volcano and the northernmost of the Tharsis Montes.",
    details:
      "Ascraeus Mons is a large shield volcano in the Tharsis region, north of Pavonis Mons and Arsia Mons. Its broad flanks are made up of overlapping lava flows, while its summit contains a complex caldera. The marker gives an approximate summit location.",
    images: [],
  },
  {
    id: "hypanis-delta",
    name: "Hypanis Delta",
    category: "delta",
    coordinates: [-46, 11.8],
    description:
      "A fan-shaped deposit at the mouth of an ancient river system near the Martian northern lowlands.",
    details:
      "The Hypanis deposit lies where channels from the Hypanis Valles system meet the boundary between the southern highlands and northern lowlands. Its branching form and sedimentary layers have been interpreted as evidence of river deposition, possibly at the margin of an ancient sea. The feature covers a broad area, so this marker is approximate.",
    images: [],
  },
  {
    id: "holden-crater-delta",
    name: "Holden Crater Fan",
    category: "delta",
    coordinates: [-34.5, -26.4],
    description: "An ancient fan-shaped sediment deposit within Holden Crater.",
    details:
      "Holden Crater contains layered deposits and landforms associated with past water activity. A prominent fan-shaped feature formed where channels delivered sediment into the crater, making it a candidate ancient delta. The crater also preserves evidence of a large lake and episodes of flooding. The marker is an approximate location for the fan deposit.",
    images: [],
  },
  {
    id: "candor-chasma",
    name: "Candor Chasma",
    category: "canyon",
    coordinates: [-71, -6],
    description: "A major canyon within the central Valles Marineris system.",
    details:
      "Candor Chasma is one of the large troughs that make up Valles Marineris. Its steep walls expose layered rocks, and parts of its floor contain light-toned deposits that have been studied for clues to past water-related processes. The marker indicates an approximate central location within the chasma.",
    images: [],
  },
  {
    id: "melas-chasma",
    name: "Melas Chasma",
    category: "canyon",
    coordinates: [-68, -10.5],
    description:
      "A deep section of Valles Marineris with layered deposits and landslide-shaped terrain.",
    details:
      "Melas Chasma is a deep, broad trough in the central part of Valles Marineris. Its interior includes layered sedimentary deposits, landslides, and floor materials shaped by a complex history of erosion and deposition. The marker indicates an approximate central location within the chasma.",
    images: [],
  },
  {
    id: "mount-sharp",
    name: "Mount Sharp (Aeolis Mons)",
    category: "mountain",
    coordinates: [137.4, -5.1],
    description:
      "A towering layered mound at the center of Gale Crater, explored by Curiosity.",
    details:
      "Mount Sharp rises about 5 kilometers above the floor of Gale Crater. Its exposed sedimentary layers preserve a record of changing Martian environments, including periods when water altered or deposited minerals. NASA's Curiosity rover has been climbing and studying the mound since landing in Gale Crater in 2012. This marker is an approximate location on the mound.",
    images: [],
  },
  {
    id: "pavonis-mons",
    name: "Pavonis Mons",
    category: "mountain",
    coordinates: [-112.6, 0.8],
    description:
      "The middle volcano in the aligned chain of Tharsis Montes shield volcanoes.",
    details:
      "Pavonis Mons is a large shield volcano on the Tharsis rise, between Arsia Mons and Ascraeus Mons. It formed through repeated eruptions of fluid lava and has a summit caldera. Its position near the Martian equator and the alignment of the Tharsis Montes make it a prominent feature of the planet's volcanic province. The marker indicates the approximate summit.",
    images: [],
  },
  {
    id: "gusev-crater",
    name: "Gusev Crater",
    category: "crater",
    coordinates: [175.5, -14.6],
    description:
      "Impact crater explored by NASA's Spirit rover, including the Columbia Hills.",
    details:
      "Gusev Crater is about 166 kilometers across and was selected as a landing site because channels appear to drain into it. NASA's Spirit rover landed there in 2004 and investigated the plains and the Columbia Hills, finding rocks altered by past water. The crater's floor also contains volcanic materials, showing that its history includes more than one type of geologic process.",
    images: [],
  },
  {
    id: "endeavour-crater",
    name: "Endeavour Crater",
    category: "crater",
    coordinates: [-5.4, -2.3],
    description:
      "Large impact crater visited by NASA's Opportunity rover during its extended mission.",
    details:
      "Endeavour Crater is roughly 22 kilometers across in Meridiani Planum. Opportunity reached its rim in 2011 after traveling for years from its landing site. Observations of rocks around the crater revealed evidence of ancient water-related alteration and provided a window into older Martian terrain. This marker gives an approximate position for the crater.",
    images: [],
  },
  {
    id: "victoria-crater",
    name: "Victoria Crater",
    category: "crater",
    coordinates: [-5.5, -2.05],
    description:
      "An eroded impact crater examined by Opportunity before the rover continued toward Endeavour Crater.",
    details:
      "Victoria Crater is about 800 meters across and has scalloped, cliff-like segments around its rim. NASA's Opportunity rover studied the crater from the rim and later descended into it to examine exposed layers of rock. Those layers helped scientists investigate the ancient environmental history of Meridiani Planum. The marker indicates the approximate crater center.",
    images: [],
  },
  {
    id: "peace-vallis-fan",
    name: "Peace Vallis Fan",
    category: "delta",
    coordinates: [137.4, -4.7],
    description:
      "Alluvial fan at the base of a channel system on the northern floor of Gale Crater.",
    details:
      "Peace Vallis and its tributaries cut into the rim of Gale Crater and deliver sediment to an alluvial fan near the crater floor. Orbital images show branching channels that led scientists to investigate the area as a possible record of ancient flowing water. The fan lies near Curiosity's landing region; this marker is approximate.",
    images: [],
  },
  {
    id: "kasei-valles",
    name: "Kasei Valles",
    category: "canyon",
    coordinates: [-63, 24],
    description:
      "One of Mars's largest outflow channel systems, extending from the volcanic highlands toward the northern plains.",
    details:
      "Kasei Valles is a vast network of channels carved by powerful flows, likely involving large volumes of water released from the Martian crust. The system stretches thousands of kilometers and includes streamlined landforms and streamlined islands that record the direction of past flow. This marker gives an approximate location within the channel system.",
    images: [],
  },
];
