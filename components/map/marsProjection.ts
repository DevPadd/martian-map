import type Projection from "ol/proj/Projection.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

const MARS_CRS = "urn:ogc:def:crs:EPSG::104905";
const MARS_EQUATORIAL_RADIUS = 3_396_190;
const MARS_INVERSE_FLATTENING = 169.894447223612;
const MARS_CRS_DEFINITION =
  `+proj=longlat +a=${MARS_EQUATORIAL_RADIUS} +rf=${MARS_INVERSE_FLATTENING} +no_defs +type=crs`;

export function registerMarsProjection(): void {
  proj4.defs("EPSG:104905", MARS_CRS_DEFINITION);
  proj4.defs(MARS_CRS, MARS_CRS_DEFINITION);
  register(proj4);
}

export function configureMarsPointResolution(projection: Projection): void {
  const metersPerUnit = projection.getMetersPerUnit();

  if (!metersPerUnit) {
    throw new Error("The WMTS projection has no distance conversion.");
  }

  const flattening = 1 / MARS_INVERSE_FLATTENING;
  const eccentricitySquared = flattening * (2 - flattening);

  projection.setGetPointResolution((resolution, coordinate) => {
    const latitude = (coordinate[1] * Math.PI) / 180;
    const denominator =
      1 - eccentricitySquared * Math.sin(latitude) ** 2;
    const primeVerticalRadius =
      MARS_EQUATORIAL_RADIUS / Math.sqrt(denominator);
    const marsMetersPerDegree =
      (Math.PI / 180) * primeVerticalRadius * Math.cos(latitude);

    return (resolution * marsMetersPerDegree) / metersPerUnit;
  });
}
