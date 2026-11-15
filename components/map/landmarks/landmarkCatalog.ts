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
    images: [
      {
        src: "/landmarks/jezero-delta.jpg",
        alt: "View of the remnant fan-shaped delta in Jezero Crater from Perseverance",
        caption: "Perseverance's view of the remnant delta in Jezero Crater.",
        attribution: "NASA/JPL-Caltech/ASU/MSSS",
        sourceUrl: "https://images.nasa.gov/details/PIA24485",
        width: 640,
        height: 466,
      },
    ],
  },
  {
    id: "gale-crater",
    name: "Gale Crater",
    category: "crater",
    coordinates: [137.4, -5.4],
    description: "Large impact crater explored by NASA's Curiosity rover.",
    details:
      "Gale Crater is about 154 kilometers across and contains the layered mound Aeolis Mons, also called Mount Sharp, rising from its center. Orbital evidence of clay and sulfate minerals helped make the crater a compelling target for the Curiosity rover. Curiosity landed in 2012 and has studied sedimentary rocks that record ancient environments and their transition over time.",
    images: [
      {
        src: "/landmarks/gale-crater.jpg",
        alt: "Orbital image of Gale Crater, home to the Curiosity rover",
        caption: "Gale Crater as seen by NASA's Mars Odyssey spacecraft.",
        attribution: "NASA/JPL-Caltech/ASU",
        sourceUrl: "https://images.nasa.gov/details/PIA17705",
        width: 289,
        height: 640,
      },
    ],
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
    images: [
      {
        src: "/landmarks/olympus-mons.jpg",
        alt: "Olympus Rupes, the steep escarpment around Olympus Mons",
        caption: "Part of the escarpment surrounding Olympus Mons.",
        attribution: "NASA/JPL-Caltech/ASU",
        sourceUrl: "https://images.nasa.gov/details/PIA15443",
        width: 285,
        height: 640,
      },
    ],
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
    images: [
      {
        src: "/landmarks/valles-marineris.jpg",
        alt: "Regional view of the Tharsis volcanoes and Valles Marineris",
        caption: "Valles Marineris and the Tharsis region.",
        attribution: "NASA/JPL-Caltech",
        sourceUrl: "https://images.nasa.gov/details/PIA02005",
        width: 640,
        height: 640,
      },
    ],
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
    images: [
      {
        src: "/landmarks/eberswalde-delta.jpg",
        alt: "Orbital image showing the delta deposit inside Eberswalde Crater",
        caption: "The ancient delta deposit on the floor of Eberswalde Crater.",
        attribution: "NASA/JPL-Caltech/ASU",
        sourceUrl: "https://images.nasa.gov/details/PIA13159",
        width: 289,
        height: 640,
      },
    ],
  },
  {
    id: "rumah-devin",
    name: "Rumah Devin",
    category: "misc",
    coordinates: [75.45, 18.24],
    description: "who the hell lives here",
    details:
      "A custom point added to the landmark catalog. Replace this description with verified notes about the location when available.",
    images: [],
  },
];
