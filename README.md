![alt text](.github/assets/design-1.png)

## what the hell is this?

A web-based interactive Mars exploration map that is designed to help future astronauts understand and navigate the Martian surface after landing. Think of it as Google Maps for Mars.

The application combines scientific data from multiple NASA missions into one interactive map, allowing users to explore Mars, discover geographical landmarks, access scientific information, and identify potential exploration destinations.

Instead of simply displaying a map, it tells astronauts what is around them, what makes each location scientifically interesting, and what they should know before exploring it.

Demo: https://martian-map-eight.vercel.app/

## Features

### Ration and time estimator

The tool estimates **route time** and **food mass per person** from the distance you draw and the two values you enter.

1. **Route distance:** The map calculates the Mars-surface distance between each pair of points along your drawn line, then adds those distances together. It uses Mars’s ellipsoid rather than treating the map as a flat surface. This measures the drawn route’s length, but doesn’t account for elevation, terrain, or obstacles. See `calculateMarsDistance`.

2. **Estimated sols:**  
   `route distance in km ÷ your planned km per sol`  
   For example, a 12 km route at 3 km/sol gives `12 ÷ 3 = 4 sols`.

3. **Earth-time equivalent:**  
   `estimated sols × 1.0275 Earth days`  
   One sol is about **24 hours, 39 minutes, 35 seconds**, or **1.0275 Earth days**. So 4 sols is about 4.11 Earth days.

4. **Estimated food per person:**  
   `estimated sols × your food allowance in kg per person per sol`  
   For example, at 0.8 kg/person/sol for 4 sols, the estimate is `4 × 0.8 = 3.2 kg per person`.

The inputs must be positive numbers. Results are rounded to two decimal places for display. These are simple planning estimates—not mission-ready travel predictions, packing requirements, or nutrition guidance. They don’t account for rest, terrain, EVA constraints, or delays. The formulas and sol conversion are in `MapDistanceControl.tsx`.

## Tech stack used

- Next.js
- Tailwind.css
- Typescript
- Openlayers WMTS
- Proj4js
- lucide-react
- Turf.js
- GeoJSON
- Zod

## NASA data usage

- Mars Trek Map Service: https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars
  - MRO HiRISE, Jezero Mosaic, Controlled
  - MRO HiRISE, Mosaic Jezero NE Syrtis Midway
  - MRO CTX, Jezero Mosaic, Controlled
  - MRO CTX, Jezero Mosaic, Preliminary
- Perseverance's traverse path at Jezero Crater: https://science.nasa.gov/mission/mars-2020-perseverance/location-map/

## TO DO

## Essential features

- [x] interactive map, panning, coords, and zooming feature
- [x] premade landmark and checkpoints
- [x] survival guidebook
- [x] multiple layers (CTX, Topography, etc)
- [x] clickable landmarks, which opens a popup and displays informations
- [x] Rover traverse path?
- [x] Distance calculator
- [x] Add estimated travel time and food consumption for distance calculator
- [ ] add more map layers

## Would be nice to have (IF I HAD THE TIME ASAFOSAJFO)

- [ ] add sound effect and sound
- [ ] use custom cursor
- [ ] add evangelion-like screen overlay
- [ ] AI chatbot (magi lol)
- [ ] All landmarks on global mars
- [ ] Add feature that allows user to add their own checkpoint/landmark

## Running Locally

```bash
# clone repo
git clone https://github.com/DevPadd/martian-map.git

# move to project directory
cd martian-map

# install dependencies
bun install
# or
npm install

# run development
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
