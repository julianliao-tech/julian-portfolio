// ---------------------------------------------------------------------
// Shape of a project's design system, as it exists in that project's
// Figma file, plus the two helpers the renderer needs.
//
// `status` records where a value came from: 'kit' means the project's
// original design kit had it, 'new' means it was added when the system
// was built. The page prints the difference rather than smoothing it
// over. Nothing here is a proposal: every value is in the Figma file.
// ---------------------------------------------------------------------

export type Status = 'kit' | 'new';

export type Ramp = {
  family: string;
  note: string;
  /** Steps whose hex the project was already using before the system. */
  anchors: string[];
  steps: [string, string][];
};

export type TokenGroup = { group: string; rows: [string, string, string][] };

export type Semantic = { name: string; aliases: string[]; note?: string };

export type TypeRow = {
  style: string;
  face: string;
  weight: number;
  sample: string;
  use: string;
  status: Status;
  /** [size, line-height] in px, one pair per typography mode. */
  modes: [number, number][];
};

export type Face = {
  sample: string;
  name: string;
  stack: string;
  weights: string;
  note: string;
  status: Status;
};

export type DesignSystemData = {
  slug: string;
  project: string;

  accent: string;
  accentDeep: string;
  accentSoft: string;
  onAccent: string;

  /** Section heading. A sentence, not a label. */
  headline: string;
  lede: string;
  stats: { n: string; label: string }[];

  ramps: Ramp[];
  rawValues: string[];
  rampsIntro: string;
  rampsTake: string;

  tokenIntro: string;
  tokenGroups: TokenGroup[];
  tokenPreview: { title: string; sub: string; label: string };
  radii: [string, string, number][];

  semIntro: string;
  semModes: string[];
  semModeNote: string[];
  semantics: Semantic[];
  semPreview: { button: string; badge: string };
  semTake: string;

  typeIntro: string;
  typeModes: string[];
  typeDefault: string;
  typeModeNote: string;
  typeRows: TypeRow[];
  faces: Face[];

  layoutTitle: string;
  layoutIntro: string;
  layoutModes: string[];
  layoutRows: string[][];
};

/** Figma resolves an alias to the primitive's hex; so does this. */
export function primitiveMap(ramps: Ramp[]): Record<string, string> {
  const m: Record<string, string> = {};
  for (const r of ramps) for (const [step, hex] of r.steps) m[`${r.family}/${step}`] = hex;
  return m;
}

/** A stable, unique attribute value per mode, per group. */
export const modeKey = (group: string, mode: string) =>
  `${group}-${mode.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
