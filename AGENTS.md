<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Task: Build the Survival Guidebook Module

Your task is to implement a comprehensive, interactive **Survival Guidebook** module.

## 1. Core Objective

Build an educational and informational handbook that helps astronauts understand:

- The Martian environment.
- Potential environmental and geological hazards.
- Spacesuit and life-support systems.
- Extravehicular Activity (EVA) safety concepts.
- Habitat and mission safety considerations.
- Lessons from previous Mars exploration missions.

The guidebook must prioritize astronaut safety, scientific accuracy, readability, and practical information.

IMPORTANT: This is an educational and mission-planning prototype, NOT a certified survival manual or operational safety system. Do not invent emergency procedures, safety thresholds, or validated human Mars survival protocols.

## 2. Guidebook Sections

Create nine main categories:

### 01 — Understanding Mars

Cover:

- Atmospheric composition and pressure.
- Temperature and environmental conditions.
- Martian gravity.
- Solar and cosmic radiation.
- Martian dust and dust storms.
- Length of a Martian day (sol) and seasonal changes.

### 02 — Spacesuit and Life Support

Cover:

- Spacesuit components and their functions.
- Pressure and oxygen systems.
- Temperature regulation.
- Water and hydration systems.
- Communication equipment.
- Battery and power systems.
- Dust protection and suit integrity.

Include explanations of the major spacesuit subsystems.

### 03 — Surface and Terrain Hazards

Cover:

- Steep slopes.
- Loose sand and regolith.
- Rock fields and surface obstacles.
- Craters, cliffs, and depressions.
- Dust-covered terrain.
- Geological boundaries and potentially unstable surfaces.

Explain how topography, slope, and surface characteristics relate to exploration risk.

Where possible, connect this section to ARES map layers such as elevation, slope, roughness, and high-resolution imagery.

### 04 — Environmental Hazards

Cover:

- Solar and cosmic radiation.
- Dust storms and reduced visibility.
- Extreme temperatures.
- Dust accumulation on equipment.
- Atmospheric conditions.
- Perchlorate-bearing Martian soil and contamination considerations.

Explain the causes, potential consequences, and relevant observations for each hazard.

### 05 — EVA (Extravehicular Activity) Safety

Cover:

- General EVA preparation concepts.
- Mission objectives and exploration boundaries.
- Navigation and location awareness.
- Crew coordination and buddy-system concepts.
- Communication with mission control.
- Return-to-habitat planning.
- Post-EVA equipment inspection.

Keep this educational. Do not invent real operational EVA checklists or emergency procedures.

### 06 — Habitat and Base Safety

Cover:

- Air supply and pressure monitoring.
- Water and food resources.
- Power generation and storage.
- Fire and electrical hazards.
- Habitat structural integrity.
- Waste management and hygiene.
- Environmental monitoring.

### 07 — Communication and Emergency Awareness

Cover:

- Communication delays between Earth and Mars.
- Loss-of-communication considerations.
- Location reporting.
- Emergency notification concepts.
- Mission abort and return-to-habitat concepts.
- Coordination between crew members and mission control.

Explain why Mars missions require autonomous decision-making and reliable communication systems.

### 08 — Human Health and Wellbeing

Cover:

- Effects of reduced gravity.
- Dehydration and fatigue awareness.
- Sleep and circadian rhythm.
- Isolation and psychological stress.
- General medical preparedness.
- Long-duration mission health considerations.

### 09 — Past Missions

Create a dedicated historical and educational section documenting previous Mars exploration missions.

Include:

- Viking 1 and Viking 2.
- Mars Pathfinder and Sojourner.
- Spirit and Opportunity.
- Curiosity.
- InSight.
- Perseverance.
- Ingenuity.
- Other relevant Mars missions where appropriate.

For each mission, provide:

1. Mission name.
2. Mission type (orbiter, lander, rover, helicopter, etc.).
3. Launch and landing dates, where applicable.
4. Mission objectives.
5. Major discoveries and achievements.
6. Technologies or innovations introduced.
7. Challenges and mission limitations.
8. Lessons relevant to future human exploration.

Pay special attention to Perseverance because ARES focuses on Jezero Crater.

For Perseverance, discuss:

- Its landing in Jezero Crater.
- Geological exploration and sample collection.
- Evidence of ancient water environments.
- Its instruments and scientific observations.
- Its autonomous navigation capabilities.
- How its mission contributes to preparing for future human exploration.

For Ingenuity, explain its role as a technology demonstration and its contribution to aerial exploration concepts.

Clearly distinguish actual mission achievements from possible future applications to human exploration.

## 3. Article Structure

Every guidebook article should follow a consistent structure:

1. Overview — What is the topic?
2. Why It Matters — Why should an astronaut understand it?
3. Key Information — Important scientific or technical facts.
4. Potential Risks — Relevant hazards and consequences, where applicable.
5. What to Monitor — Relevant observations, indicators, or environmental data.
6. Safety Considerations — General educational considerations.
7. Related ARES Map Layers — Relevant datasets or map layers.
8. Related Landmarks — Relevant Martian locations, if applicable.
9. References — Reliable sources and further reading.

Not every section must appear if it is irrelevant to the article. Avoid repetitive or artificially padded content.

### Article Viewer

When an article is selected, display:

- Article title and category.
- Short introduction.
- Main article content.
- Relevant images or diagrams where available.
- Key information and safety considerations.
- Related map layers.
- Related landmarks.
- Source references and external links.
- Navigation back to the guidebook.

Make the content easy to scan. Use headings, bullet points, callouts, and structured information rather than large blocks of text.

## 5. Interactive Features

Implement the following:

### A. Search and Filtering

Allow users to search articles by title, keyword, or category.

### B. Hazard Cards

Provide reusable cards displaying:

- Hazard name.
- Category.
- Short explanation.
- Why it matters.
- Relevant guidebook article.

Do not assign numerical danger ratings unless supported by actual data and a defined methodology.

### C. Related Map Information

Connect guidebook content to the existing ARES map.

For example:

- Terrain hazards → elevation, slope, and roughness layers.
- Geological exploration → CTX and HiRISE imagery.
- Mineral hazards and scientific context → mineral composition datasets, where available.
- Jezero landmarks → existing landmark records.

If a user selects a related landmark, provide a way to navigate to it on the map.

If the existing map does not yet expose the required functionality, implement a clean integration interface without breaking existing map behavior.

### D. Scenario-Based Learning

Create a small optional learning area with hypothetical exploration scenarios.

Each scenario should:

- Present a fictional situation.
- Explain the relevant environmental or geological context.
- Ask the user to identify relevant hazards.
- Provide an educational explanation of the answer.

Do not simulate real emergency operations or provide unvalidated operational instructions.

## 7. Scientific Accuracy and Sources

Prioritize credible scientific and institutional sources:

- NASA.
- NASA Human Research Program.
- NASA Mars Exploration Program.
- NASA/JPL mission documentation.
- NASA technical publications.
- Peer-reviewed scientific research.
- USGS planetary science resources.

For historical mission data, verify dates, discoveries, and mission outcomes.

Every article should include references with descriptive titles and working external links when possible.

Do not fabricate citations, scientific measurements, mission outcomes, or technical specifications.

Clearly distinguish:

- Observed data.
- Scientific interpretation.
- Derived analysis.
- Hypothetical future applications.

## 9. Final Expectations

It should help a first-time Mars explorer understand the environment, identify potential hazards, learn from previous missions, and explore the scientific context of Jezero Crater.

Before modifying existing files, inspect the current project structure and existing UI components. Reuse existing design patterns and avoid unnecessary rewrites.

After implementation, report:

- Files created or modified.
- Features implemented.
- Any incomplete integrations.
- How to access the guidebook.
- Any assumptions or limitations.
