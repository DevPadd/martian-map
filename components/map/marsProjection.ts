import type Projection from "ol/proj/Projection.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

const MARS_CRS = "urn:ogc:def:crs:EPSG::104905";
const MARS_EQUATORIAL_RADIUS = 3_396_190;
const MARS_INVERSE_FLATTENING = 169.894447223612;
const MARS_FLATTENING = 1 / MARS_INVERSE_FLATTENING;
const MARS_CRS_DEFINITION =
  `+proj=longlat +a=${MARS_EQUATORIAL_RADIUS} +rf=${MARS_INVERSE_FLATTENING} +no_defs +type=crs`;

export function calculateMarsDistance(
  start: readonly [number, number],
  end: readonly [number, number],
): number {
  const semiMajorAxis = MARS_EQUATORIAL_RADIUS;
  const semiMinorAxis = semiMajorAxis * (1 - MARS_FLATTENING);
  const longitudeDegrees =
    ((end[0] - start[0] + 540) % 360) - 180;
  const longitudeDifference = (longitudeDegrees * Math.PI) / 180;
  const latitude1 = (start[1] * Math.PI) / 180;
  const latitude2 = (end[1] * Math.PI) / 180;
  const reducedLatitude1 = Math.atan(
    (1 - MARS_FLATTENING) * Math.tan(latitude1),
  );
  const reducedLatitude2 = Math.atan(
    (1 - MARS_FLATTENING) * Math.tan(latitude2),
  );
  const sinReducedLatitude1 = Math.sin(reducedLatitude1);
  const cosReducedLatitude1 = Math.cos(reducedLatitude1);
  const sinReducedLatitude2 = Math.sin(reducedLatitude2);
  const cosReducedLatitude2 = Math.cos(reducedLatitude2);

  let lambda = longitudeDifference;
  let sinSigma = 0;
  let cosSigma = 0;
  let sigma = 0;
  let sinAlpha = 0;
  let cosSquaredAlpha = 0;
  let cosTwiceSigmaMidpoint = 0;
  let converged = false;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    const firstTerm = cosReducedLatitude2 * sinLambda;
    const secondTerm =
      cosReducedLatitude1 * sinReducedLatitude2 -
      sinReducedLatitude1 * cosReducedLatitude2 * cosLambda;

    sinSigma = Math.hypot(firstTerm, secondTerm);
    if (sinSigma === 0) return 0;

    cosSigma =
      sinReducedLatitude1 * sinReducedLatitude2 +
      cosReducedLatitude1 * cosReducedLatitude2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha =
      (cosReducedLatitude1 * cosReducedLatitude2 * sinLambda) / sinSigma;
    cosSquaredAlpha = 1 - sinAlpha ** 2;
    cosTwiceSigmaMidpoint =
      cosSquaredAlpha === 0
        ? 0
        : cosSigma -
          (2 * sinReducedLatitude1 * sinReducedLatitude2) / cosSquaredAlpha;

    const coefficient =
      (MARS_FLATTENING / 16) *
      cosSquaredAlpha *
      (4 + MARS_FLATTENING * (4 - 3 * cosSquaredAlpha));
    const previousLambda = lambda;

    lambda =
      longitudeDifference +
      (1 - coefficient) *
        MARS_FLATTENING *
        sinAlpha *
        (sigma +
          coefficient *
            sinSigma *
            (cosTwiceSigmaMidpoint +
              coefficient *
                cosSigma *
                (-1 + 2 * cosTwiceSigmaMidpoint ** 2)));

    if (Math.abs(lambda - previousLambda) < 1e-12) {
      converged = true;
      break;
    }
  }

  if (!converged) {
    throw new Error("Could not calculate Mars distance for this segment.");
  }

  const squaredReducedMajorAxis =
    (cosSquaredAlpha * (semiMajorAxis ** 2 - semiMinorAxis ** 2)) /
    semiMinorAxis ** 2;
  const coefficientA =
    1 +
    (squaredReducedMajorAxis / 16384) *
      (4096 +
        squaredReducedMajorAxis *
          (-768 + squaredReducedMajorAxis * (320 - 175 * squaredReducedMajorAxis)));
  const coefficientB =
    (squaredReducedMajorAxis / 1024) *
    (256 +
      squaredReducedMajorAxis *
        (-128 + squaredReducedMajorAxis * (74 - 47 * squaredReducedMajorAxis)));
  const deltaSigma =
    coefficientB *
    sinSigma *
    (cosTwiceSigmaMidpoint +
      (coefficientB / 4) *
        (cosSigma * (-1 + 2 * cosTwiceSigmaMidpoint ** 2) -
          (coefficientB / 6) *
            cosTwiceSigmaMidpoint *
            (-3 + 4 * sinSigma ** 2) *
            (-3 + 4 * cosTwiceSigmaMidpoint ** 2)));

  return semiMinorAxis * coefficientA * (sigma - deltaSigma);
}

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

  const eccentricitySquared =
    MARS_FLATTENING * (2 - MARS_FLATTENING);

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
