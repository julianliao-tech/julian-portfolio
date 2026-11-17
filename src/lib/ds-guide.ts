// The real contents of the project's Figma design-system file.
// Generated from the file itself; see src/lib/ds.ts for the shape.
import type { DesignSystemData } from './ds';

const WORK = "'Work Sans', system-ui, sans-serif";

export const guideSystem: DesignSystemData = {
  slug: 'guide',
  project: 'Guide',
  headline: 'Five groups of variables, built on top of the kit it came with',

  accent: '#97add1',
  accentDeep: '#475977',
  accentSoft: '#cdd9ed',
  onAccent: '#000000',

  lede:
    'Guide came with a design kit: one picture with Work Sans on it, four text styles and seven colors. The Figma file behind it had nothing bound, so every screen pointed at a hex code I had typed in by hand. I went back and built the thing the kit was describing, then pointed all 17 screens at it. <strong>Everything below is what is actually in the file now.</strong> Click a mode and the values change the same way they do in Figma.',

  stats: [
    { n: '5', label: 'variable collections' },
    { n: '17', label: 'screens' },
    { n: '10', label: 'text styles' },
    { n: '4', label: 'color modes' },
  ],

  rampsIntro:
    'Four color families, each running from nearly white down to nearly black. The colors Guide was already using sit exactly where they were, marked with a dot. <strong>Every other step was worked out from those, keeping the same color and only changing how light it is</strong>, so nothing I had already drawn came out a different color.',
  rampsTake:
    'Seven colors is enough to draw a screen and not enough to build one. A pressed button, a disabled button, a selected filter and a broken elevator marker all need a color that still looks periwinkle without being the periwinkle. <strong>Before this I picked those in the moment, which is why the same thing came out slightly different on two screens.</strong>',

  ramps: [
    {
      family: 'Periwinkle',
      note: 'Primary. Routes, the turn banner, selected filters, every action.',
      anchors: ['400'],
      steps: [
        ['50', '#f2f6fb'], ['100', '#e7edf7'], ['200', '#cdd9ed'], ['300', '#b1c3df'],
        ['400', '#97add1'], ['500', '#788fb4'], ['600', '#5f7598'], ['700', '#475977'],
        ['800', '#303d54'], ['900', '#1a2433'], ['950', '#0c131e'],
      ],
    },
    {
      family: 'Mint',
      note: 'Accessible. A step is clear, a route is step free, a report was confirmed.',
      anchors: ['300'],
      steps: [
        ['50', '#eef9f0'], ['100', '#dff2e3'], ['200', '#bde4c4'], ['300', '#97d1a3'],
        ['400', '#71bc83'], ['500', '#4fa265'], ['600', '#37874e'], ['700', '#216938'],
        ['800', '#114924'], ['900', '#052c12'], ['950', '#011907'],
      ],
    },
    {
      family: 'Coral',
      note: 'Obstacle. A blocked route, a broken elevator, and the END button.',
      anchors: ['400'],
      steps: [
        ['50', '#fef2f2'], ['100', '#ffe6e5'], ['200', '#fbcac9'], ['300', '#f4acab'],
        ['400', '#e28a8a'], ['500', '#cb6e70'], ['600', '#ac5658'], ['700', '#883e41'],
        ['800', '#61292b'], ['900', '#3c1517'], ['950', '#24090a'],
      ],
    },
    {
      family: 'Greyscale',
      note: 'The map, every surface, every border and all four text roles.',
      anchors: ['0', '200', '300', '950'],
      steps: [
        ['0', '#ffffff'], ['50', '#f5f5f5'], ['100', '#ececec'], ['200', '#e2e0e1'],
        ['300', '#c0c0c0'], ['400', '#a8a8a8'], ['500', '#8d8d8d'], ['600', '#747474'],
        ['700', '#585858'], ['800', '#3d3d3d'], ['900', '#232323'], ['950', '#000000'],
      ],
    },
  ],

  rawValues: [
    'Value/0', 'Value/4', 'Value/8', 'Value/12', 'Value/16',
    'Value/24', 'Value/32', 'Value/44', 'Value/full · 10000',
  ],

  tokenIntro:
    'The greyscale, assigned to the four jobs a neutral color actually does, with a second mode that reverses the scale. Guide gets used outside at night by someone who can&rsquo;t easily stop and look closely, so dark mode matters here. <strong>Pointing the screens at these names instead of at #FFFFFF is what makes it one setting rather than a second set of frames.</strong>',

  tokenGroups: [
    {
      group: 'Surface',
      rows: [
        ['Surface/default', 'Greyscale/0', 'Greyscale/950'],
        ['Surface/subtle', 'Greyscale/50', 'Greyscale/900'],
        ['Surface/elevated', 'Greyscale/100', 'Greyscale/800'],
        ['Surface/disabled', 'Greyscale/200', 'Greyscale/700'],
        ['Surface/inverted', 'Greyscale/950', 'Greyscale/0'],
      ],
    },
    {
      group: 'Border',
      rows: [
        ['Border/default', 'Greyscale/200', 'Greyscale/700'],
        ['Border/strong', 'Greyscale/400', 'Greyscale/500'],
        ['Border/disabled', 'Greyscale/100', 'Greyscale/800'],
        ['Border/inverted', 'Greyscale/950', 'Greyscale/0'],
        ['Border/negative', 'Greyscale/0', 'Greyscale/950'],
      ],
    },
    {
      group: 'Text',
      rows: [
        ['Text/title', 'Greyscale/950', 'Greyscale/0'],
        ['Text/subtitle', 'Greyscale/800', 'Greyscale/100'],
        ['Text/body', 'Greyscale/700', 'Greyscale/200'],
        ['Text/caption', 'Greyscale/600', 'Greyscale/300'],
        ['Text/negative', 'Greyscale/0', 'Greyscale/950'],
        ['Text/disabled', 'Greyscale/400', 'Greyscale/600'],
      ],
    },
  ],

  tokenPreview: {
    label: 'Surface/default · Text/caption',
    title: 'Warm Springs Plaza',
    sub: "Text/body, step free route, 7 min, 0.5 mi.",
  },

  radii: [
    ['Radius/sharp', 'Value/0', 0],
    ['Radius/xs', 'Value/4', 4],
    ['Radius/sm', 'Value/8', 8],
    ['Radius/md', 'Value/12', 12],
    ['Radius/lg', 'Value/16', 16],
    ['Radius/xl', 'Value/24', 24],
    ['Radius/pill', 'Value/full', 9999],
  ],

  semIntro:
    'Ten names that give you a different color depending on the mode a layer is set to. A periwinkle route card and a coral obstacle card are both called <code>Surface/default</code>, and the only difference between them is the mode. <strong>It sets the text color too, so the thing that broke my contrast, picking a text color by eye on each screen, stops being a decision.</strong>',

  semModes: ['Route', 'Accessible', 'Obstacle', 'Neutral'],
  semModeNote: [
    'Periwinkle. Anything to do with getting there: the active route, the turn banner, a selected filter.',
    'Mint. The good news: this step is clear, this entrance is step free, your report went through.',
    'Coral. Something is in the way, or the action ends the trip. The END button lives here.',
    'Greyscale. Inactive filters, map furniture, disabled controls.',
  ],

  semantics: [
    { name: 'Surface/subtle', aliases: ['Periwinkle/100', 'Mint/100', 'Coral/100', 'Greyscale/100'] },
    { name: 'Surface/light', aliases: ['Periwinkle/200', 'Mint/200', 'Coral/200', 'Greyscale/200'] },
    {
      name: 'Surface/default',
      aliases: ['Periwinkle/400', 'Mint/300', 'Coral/400', 'Greyscale/300'],
      note: 'Every mode lands on a color the kit already names.',
    },
    { name: 'Surface/strong', aliases: ['Periwinkle/700', 'Mint/700', 'Coral/700', 'Greyscale/700'] },
    { name: 'Border/subtle', aliases: ['Periwinkle/200', 'Mint/200', 'Coral/200', 'Greyscale/200'] },
    { name: 'Border/default', aliases: ['Periwinkle/400', 'Mint/400', 'Coral/400', 'Greyscale/400'] },
    { name: 'Border/strong', aliases: ['Periwinkle/600', 'Mint/600', 'Coral/600', 'Greyscale/600'] },
    {
      name: 'Text/label',
      aliases: ['Periwinkle/700', 'Mint/700', 'Coral/700', 'Greyscale/700'],
      note: 'Colored text on white: 7.09, 6.68, 7.47 and 7.11:1.',
    },
    {
      name: 'Text/on-default',
      aliases: ['Greyscale/950', 'Greyscale/950', 'Greyscale/950', 'Greyscale/950'],
      note: 'On Surface/default: 9.21, 11.96, 8.24 and 11.54:1.',
    },
    {
      name: 'Text/on-strong',
      aliases: ['Greyscale/0', 'Greyscale/0', 'Greyscale/0', 'Greyscale/0'],
      note: 'On Surface/strong: 7.09, 6.68, 7.47 and 7.11:1.',
    },
  ],

  semPreview: { button: 'Start route', badge: 'STEP FREE' },
  semTake:
    'The four modes aren&rsquo;t decoration. They are the four things Guide ever has to say: this is the way, this is clear, this is blocked, this is off. <strong>The day I decide the coral is too soft for a blocked route, I change it in one place instead of on every screen with an obstacle on it.</strong>',

  typeIntro:
    'Work Sans in the four weights the kit already picked, with real sizes and line heights attached to them for the first time. The four styles from the kit are here, and so are the ones a working app needs that the kit never wrote down. <strong>Three sizes of everything, because someone reading this outside with one hand should get the text size they set on their phone</strong> instead of whatever I chose.',

  typeDefault: 'Default',
  typeModes: ['Compact', 'Default', 'Large'],
  typeModeNote:
    'Default is the normal size. Compact is a bit smaller and Large is a quarter bigger, rounded to whole pixels, and nothing goes under 10px.',

  typeRows: [
    { style: 'Heading/H1', face: WORK, weight: 600, sample: 'Warm Springs Plaza', use: 'Screen titles', status: 'kit', modes: [[27, 34], [31, 39], [39, 49]] },
    { style: 'Heading/H2', face: WORK, weight: 500, sample: 'Nearby accessible entrances', use: 'Section headings', status: 'kit', modes: [[22, 28], [25, 32], [31, 39]] },
    { style: 'Heading/H3', face: WORK, weight: 500, sample: 'Report an obstacle', use: 'Sheet and card titles', status: 'new', modes: [[18, 23], [20, 26], [25, 32]] },
    { style: 'Metric/M1', face: WORK, weight: 500, sample: '12:34 · 7 min · 0.5 mi', use: 'Trip stats, read while moving', status: 'new', modes: [[22, 26], [25, 30], [31, 37]] },
    { style: 'Body/B1', face: WORK, weight: 400, sample: 'Walk straight 0.2 miles, then turn left at the ramp.', use: 'Primary body text', status: 'kit', modes: [[14, 21], [16, 24], [20, 30]] },
    { style: 'Body/B2', face: WORK, weight: 400, sample: 'Elevator out of service since Tuesday.', use: 'Secondary body text', status: 'new', modes: [[12, 18], [14, 21], [18, 27]] },
    { style: 'Subtitle', face: WORK, weight: 300, sample: 'Reported 4 minutes ago', use: 'Smaller text', status: 'kit', modes: [[12, 18], [14, 21], [18, 27]] },
    { style: 'Label/L1', face: WORK, weight: 500, sample: 'ARRIVAL', use: 'Stat captions, filter chips', status: 'new', modes: [[11, 16], [12, 18], [15, 22]] },
    { style: 'Label/L2', face: WORK, weight: 500, sample: 'NEARBY', use: 'Tab bar, the smallest label', status: 'new', modes: [[10, 15], [10, 15], [13, 19]] },
    { style: 'Button/BTN', face: WORK, weight: 600, sample: 'Start route', use: 'Every button, in a 44px target', status: 'new', modes: [[14, 21], [16, 24], [20, 30]] },
  ],

  faces: [
    {
      sample: 'Aa Gg 0.5 mi',
      name: 'Work Sans',
      stack: WORK,
      weights: 'Light 300 · Regular 400 · Medium 500 · SemiBold 600',
      note:
        'The whole interface, exactly as the kit says. Four weights, no fifth: Light is for the subtitle line only, SemiBold is for H1 and buttons, and nothing is ever italic.',
      status: 'kit',
    },
    {
      sample: '12:34 · 0.5',
      name: 'Tabular numerals',
      stack: WORK,
      weights: "font-variant-numeric: tabular-nums",
      note:
        'One setting, not a second typeface. The time and the distance keep updating while someone is walking, and without this every digit is a different width, so the whole row jumps sideways each time it changes.',
      status: 'new',
    },
  ],

  layoutTitle: 'Layout & density',
  layoutIntro:
    'The spacing, the tap targets and the icon sizes, on the same three settings as the text. <strong>Nothing you tap goes under 44px in any of them</strong>, because the person using this is usually moving and usually has one hand free.',
  layoutModes: ['Compact', 'Default', 'Large'],
  layoutRows: [
    ['Target/min', '44', '44', '48'],
    ['Space/xs', '4', '4', '6'],
    ['Space/sm', '8', '8', '10'],
    ['Space/md', '12', '16', '20'],
    ['Space/lg', '16', '24', '28'],
    ['Space/xl', '24', '32', '40'],
    ['Screen/margin', '16', '20', '24'],
    ['Icon/size', '20', '24', '28'],
    ['Marker/size', '32', '40', '48'],
    ['Sheet/peek-height', '160', '200', '240'],
  ],

};
