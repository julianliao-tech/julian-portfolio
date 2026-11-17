// The real contents of the project's Figma design-system file.
// Generated from the file itself; see src/lib/ds.ts for the shape.
import type { DesignSystemData } from './ds';

const GEIST = "'Geist', system-ui, sans-serif";
const REDDIT = "'Reddit Sans', system-ui, sans-serif";

export const michiganSystem: DesignSystemData = {
  slug: 'michigan-chatgpt',
  project: 'Michigan ChatGPT',
  headline: 'Sixty two text styles, collapsed into ten',

  accent: '#ffcb05',
  accentDeep: '#00274c',
  accentSoft: '#ffebb7',
  onAccent: '#1d1b20',

  lede:
    'This file wasn&rsquo;t missing a design system. It had four of them going at once: some named text size variables, a Michigan Blue and Yellow pair, eighteen component sets, and a page that audited the rest and printed the damage. <strong>62 text styles across three typefaces, 65 different spacing values, 21 stroke widths and 10 corner radii.</strong> I pulled all of that down into the five groups below, using values that were already in the file, and pointed the screens and the components at them.',

  stats: [
    { n: '10', label: 'text styles' },
    { n: '22', label: 'screens' },
    { n: '18', label: 'component sets' },
    { n: '2', label: 'screen widths' },
  ],

  rampsIntro:
    'Three color families. <strong>Almost every step below is a color that was already somewhere in the file</strong>, marked with a dot. The greys are the surprising part: the ones already in use line up with a normal scale almost exactly, so only three steps had to be filled in.',
  rampsTake:
    'The file had #F6F6F6 and #F5F5F5, #DEE1E3 and #D9D9D9, #FFBF0B and #FFCB05. Three pairs where each pair is one color pretending to be two. <strong>Nobody sat down and decided to have two almost identical light greys. They turned up one screen at a time.</strong> Having a set list is what stops the fourth one turning up.',

  ramps: [
    {
      family: 'Blue',
      note: 'Michigan Blue, already a variable. The navbar, solid buttons, links and all strong text.',
      anchors: ['900'],
      steps: [
        ['50', '#eff6ff'], ['100', '#e0eeff'], ['200', '#bddcfe'], ['300', '#93c6ff'],
        ['400', '#5facfe'], ['500', '#3a91e8'], ['600', '#2076c7'], ['700', '#085a9f'],
        ['800', '#013e72'], ['900', '#00274c'], ['950', '#00132b'],
      ],
    },
    {
      family: 'Maize',
      note: 'Michigan Yellow at 200 and the file’s second yellow #FFBF0B at 300, which is already doing the job of a pressed state.',
      anchors: ['200', '300'],
      steps: [
        ['50', '#fff5db'], ['100', '#ffebb7'], ['200', '#ffcb05'], ['300', '#ffbf0b'],
        ['400', '#cda202'], ['500', '#ad8907'], ['600', '#8e7001'], ['700', '#6d5503'],
        ['800', '#4c3b02'], ['900', '#2d2200'], ['950', '#1a1200'],
      ],
    },
    {
      family: 'Greyscale',
      note: 'Eight of these eleven are hexes already in the file. 300, 500 and 600 are the holes, generated on the same hue as #4C5155.',
      anchors: ['0', '50', '100', '200', '400', '700', '800', '900', '950'],
      steps: [
        ['0', '#ffffff'], ['50', '#f5f5f5'], ['100', '#ececec'], ['200', '#d9d9d9'],
        ['300', '#bdc2c6'], ['400', '#a9aaac'], ['500', '#888f94'], ['600', '#6f7579'],
        ['700', '#4c5155'], ['800', '#333637'], ['900', '#1d1b20'], ['950', '#000000'],
      ],
    },
  ],

  rawValues: [
    'Value/0', 'Value/4', 'Value/8', 'Value/12', 'Value/16',
    'Value/24', 'Value/32', 'Value/48', 'Value/full · 10000',
  ],

  tokenIntro:
    'The greys, handed to the four jobs a plain color actually does, plus a second mode that flips the whole thing dark. Two of these already existed in the file under names that matched nothing else in it, which is this list started and then dropped. <strong>Finishing it was less work than leaving it half done.</strong>',

  tokenGroups: [
    {
      group: 'Surface',
      rows: [
        ['Surface/default', 'Greyscale/0', 'Greyscale/950'],
        ['Surface/subtle', 'Greyscale/50', 'Greyscale/900'],
        ['Surface/elevated', 'Greyscale/100', 'Greyscale/800'],
        ['Surface/disabled', 'Greyscale/200', 'Greyscale/700'],
        ['Surface/inverted', 'Greyscale/900', 'Greyscale/0'],
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
        ['Text/title', 'Greyscale/900', 'Greyscale/0'],
        ['Text/subtitle', 'Greyscale/800', 'Greyscale/100'],
        ['Text/body', 'Greyscale/700', 'Greyscale/200'],
        ['Text/caption', 'Greyscale/600', 'Greyscale/300'],
        ['Text/negative', 'Greyscale/0', 'Greyscale/900'],
        ['Text/disabled', 'Greyscale/400', 'Greyscale/600'],
      ],
    },
  ],

  tokenPreview: {
    label: 'Surface/default · Text/caption',
    title: 'Create a Study Guide for SI 110',
    sub: "Text/body, UM-GPT can make mistakes. Verify important information.",
  },

  radii: [
    ['Radius/sharp', 'Value/0', 0],
    ['Radius/xs', 'Value/4', 4],
    ['Radius/sm', 'Value/8', 8],
    ['Radius/md', 'Value/12', 12],
    ['Radius/lg', 'Value/16', 16],
    ['Radius/xl', 'Value/24', 24],
    ['Radius/2xl', 'Value/32', 32],
    ['Radius/pill', 'Value/full', 9999],
  ],

  semIntro:
    'Eleven names that give you a different color depending on the mode a layer is set to. <strong>One row does something the others don&rsquo;t: the text sitting on a default surface is white in Primary and nearly black in the other two</strong>, because the blue is dark and the maize is light. That row is the reason this group exists at all.',

  semModes: ['Primary', 'Accent', 'Neutral'],
  semModeNote: [
    'Michigan Blue #00274C. The navbar, the solid buttons, every link and all strong text.',
    'Michigan Yellow #FFCB05. Highlight and selection. A maize surface always takes #1D1B20 text, never white.',
    'Greyscale. Message bubbles, the sidebar, dividers, disabled controls.',
  ],

  semantics: [
    { name: 'Surface/subtle', aliases: ['Blue/50', 'Maize/50', 'Greyscale/50'] },
    { name: 'Surface/light', aliases: ['Blue/100', 'Maize/100', 'Greyscale/100'] },
    {
      name: 'Surface/default',
      aliases: ['Blue/900', 'Maize/200', 'Greyscale/200'],
      note: 'All three were already in the file.',
    },
    { name: 'Surface/strong', aliases: ['Blue/950', 'Maize/700', 'Greyscale/700'] },
    { name: 'Border/subtle', aliases: ['Blue/100', 'Maize/100', 'Greyscale/200'] },
    { name: 'Border/default', aliases: ['Blue/700', 'Maize/400', 'Greyscale/400'] },
    { name: 'Border/strong', aliases: ['Blue/900', 'Maize/600', 'Greyscale/700'] },
    {
      name: 'Border/brand',
      aliases: ['Blue/900', 'Maize/200', 'Greyscale/400'],
      note: 'The outline the file actually draws: 110 maize outlines needed Maize/200, not Maize/400.',
    },
    {
      name: 'Text/label',
      aliases: ['Blue/900', 'Maize/700', 'Greyscale/700'],
      note: 'On white: 15.06, 7.12 and 8.03:1. Maize itself is 1.52:1, so it is never here.',
    },
    {
      name: 'Text/on-default',
      aliases: ['Greyscale/0', 'Greyscale/900', 'Greyscale/900'],
      note: 'On Surface/default: 15.06, 11.22 and 12.10:1. The one row that changes with the mode.',
    },
    {
      name: 'Text/on-strong',
      aliases: ['Greyscale/0', 'Greyscale/0', 'Greyscale/0'],
      note: 'On Surface/strong: 18.62, 7.12 and 8.03:1.',
    },
  ],

  semPreview: { button: 'New Chat', badge: 'TRANSLATION MODE' },
  semTake:
    'Three modes, not four, and that is a gap rather than a shortcut. <strong>The file&rsquo;s own audit page has a heading for feedback colors with nothing underneath it.</strong> There is still no success color and no error color in a product that uploads files, sends messages and runs a translation. Picking those two is a brand call, so I left it listed as missing instead of quietly inventing them.',

  typeIntro:
    'Ten text styles, down from 62. Every size, weight and line height here was already being used somewhere in the file, and six of the ten already had names. <strong>Geist does the interface work and Reddit Sans keeps one job.</strong> Inter turned up in two styles and is on the list to go.',

  typeModes: ['Mobile', 'Desktop'],
  typeDefault: 'Desktop',
  typeModeNote:
    'Two sizes, because the file only has two screen widths: 393px and 1280px. Body text stays the same in both, and only the big headings grow.',

  typeRows: [
    { style: 'Display/Large', face: GEIST, weight: 800, sample: 'Fellow Wolverine!', use: 'The landing headline. Desktop value is the real Desktop/Display/Large variable.', status: 'kit', modes: [[40, 44], [70, 70]] },
    { style: 'Display/Small', face: GEIST, weight: 800, sample: 'One place to start', use: 'Section hero. Both sizes exist in the file today.', status: 'new', modes: [[34, 36], [48, 58]] },
    { style: 'Headline/Large', face: GEIST, weight: 600, sample: 'All Michigan Tools', use: 'Section headings', status: 'new', modes: [[28, 34], [40, 50]] },
    { style: 'Headline/Small', face: GEIST, weight: 500, sample: 'Why generative AI', use: 'Headings inside a section', status: 'new', modes: [[24, 30], [36, 47]] },
    { style: 'Title/Large', face: REDDIT, weight: 600, sample: 'Customize Chatbot', use: 'Card and sidebar titles. The real Desktop/Label/Large variable.', status: 'kit', modes: [[20, 26], [24, 32]] },
    { style: 'Title/Small', face: GEIST, weight: 500, sample: 'Translation Mode', use: 'Row and list titles', status: 'new', modes: [[18, 24], [20, 28]] },
    { style: 'Body/Large', face: GEIST, weight: 500, sample: 'Good Afternoon, would you like me to respond as a Teacher, Friend, Tutor or other?', use: 'Chat messages and primary body. The real Mobile/Body/Large variable.', status: 'kit', modes: [[16, 24], [16, 24]] },
    { style: 'Body/Small', face: GEIST, weight: 500, sample: 'UM-GPT can make mistakes. Verify important information.', use: 'Disclaimers and secondary text. The real Mobile/Body/Small variable.', status: 'kit', modes: [[14, 20], [14, 20]] },
    { style: 'Label/Large', face: GEIST, weight: 600, sample: 'New Chat', use: 'Every button. The real Mobile/Button/Large variable, with its 18/18 leading kept.', status: 'kit', modes: [[18, 18], [18, 18]] },
    { style: 'Label/Small', face: GEIST, weight: 500, sample: 'Today · Yesterday · Past Week', use: 'Sidebar group labels and captions', status: 'kit', modes: [[12, 20], [12, 20]] },
  ],

  faces: [
    {
      sample: 'Aa Gg 0123',
      name: 'Geist',
      stack: GEIST,
      weights: 'Light · Regular · Medium · SemiBold · Bold · ExtraBold',
      note:
        'The primary, and it already carries most of the file. 48 of the 62 styles are Geist. Eight of those are at 20px alone, which is the clearest single case for collapsing the scale.',
      status: 'kit',
    },
    {
      sample: 'Aa Gg 0123',
      name: 'Reddit Sans',
      stack: REDDIT,
      weights: 'Medium · SemiBold',
      note:
        'Twelve styles in the file, sitting on top of Geist at 14px and 24px. Giving it one job is the fix. Left alone it means two typefaces setting the same size on different screens.',
      status: 'kit',
    },
    {
      sample: 'Aa Gg 0123',
      name: 'Inter, still to remove',
      stack: "'Inter', system-ui, sans-serif",
      weights: 'Regular 20/20 · SemiBold 20/20',
      note:
        'Two styles, both at 20px, both already covered by a Geist style at the same size. It is a third typeface for no reason anyone wrote down, and nothing breaks if it goes.',
      status: 'kit',
    },
  ],

  layoutTitle: 'Responsive variables',
  layoutIntro:
    'Measured off the real frames rather than decided in advance. <strong>Two of these rows are the finding:</strong> the file has two different navigation bars at four different heights, and the search bar exists twice in the components, at the same size both times.',
  layoutModes: ['Mobile', 'Desktop'],
  layoutRows: [
    ['Breakpoint/width', '393', '1280'],
    ['Screen/height', '852', '832'],
    ['Nav/height · Header', '68', '76'],
    ['Nav/height · Navbar', '51', '91'],
    ['Sidebar/width', '280', '240'],
    ['Searchbar/width', '270', '693'],
    ['Searchbar/height', '45', '61'],
    ['Bubble/sent-width', '261', '560'],
    ['Bubble/reply-width', '270', '460'],
    ['Button/height · mode', '50', '87.5'],
  ],

};
