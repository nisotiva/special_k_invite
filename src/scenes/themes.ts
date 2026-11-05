export const sceneIds = ['welcome', 'question', 'flowers', 'nights', 'attorney', 'musicals', 'interlude', 'invitation', 'date', 'confirmation'] as const;
export type SceneId = typeof sceneIds[number];
export interface SceneTheme {
  backgroundImage: string;
  mobileBackgroundImage?: string;
  preblurred?: boolean;
  overlayColor: string;
  overlayOpacity: number;
  blurAmount: number;
  textColor: string;
  accentColor: string;
  glassStyle: { background: string; border: string };
  animationPreset: 'gentle' | 'precise';
  atmosphere?: 'garden' | 'stars' | 'theatre';
  transitionDuration?: number;
}
const asset = (name: string) => `${import.meta.env.BASE_URL}backgrounds/${name}.webp`;
const background = (name: string) => ({ backgroundImage: asset(name), mobileBackgroundImage: asset(`${name}-mobile`), preblurred: true });
export const themes: Record<SceneId, SceneTheme> = {
  welcome: { ...background('evening'), overlayColor: '#10110f', overlayOpacity: .32, blurAmount: 5, textColor: '#faf8f3', accentColor: '#dfc7a2', glassStyle: { background: 'rgba(255,248,234,.10)', border: 'rgba(255,244,224,.22)' }, animationPreset: 'gentle' },
  question: { ...background('garage'), overlayColor: '#080e17', overlayOpacity: .3, blurAmount: 4, textColor: '#f3f6fa', accentColor: '#c9d7e9', glassStyle: { background: 'rgba(192,210,232,.07)', border: 'rgba(218,231,246,.17)' }, animationPreset: 'precise' },
  flowers: { ...background('garden'), overlayColor: '#1f3025', overlayOpacity: .44, blurAmount: 6, textColor: '#fff9ed', accentColor: '#f3d9bd', glassStyle: { background: 'rgba(255,241,221,.10)', border: 'rgba(255,242,222,.25)' }, animationPreset: 'gentle', atmosphere: 'garden' },
  nights: { ...background('palace-night'), overlayColor: '#090d29', overlayOpacity: .35, blurAmount: 3, textColor: '#f9f5ed', accentColor: '#d9c593', glassStyle: { background: 'rgba(173,185,232,.07)', border: 'rgba(223,213,178,.23)' }, animationPreset: 'gentle', atmosphere: 'stars' },
  attorney: { ...background('study'), overlayColor: '#211a13', overlayOpacity: .40, blurAmount: 5, textColor: '#fbf2df', accentColor: '#d9bf91', glassStyle: { background: 'rgba(239,217,175,.09)', border: 'rgba(243,224,194,.22)' }, animationPreset: 'precise' },
  musicals: { ...background('cinema'), overlayColor: '#140c13', overlayOpacity: .48, blurAmount: 4, textColor: '#fcf3eb', accentColor: '#e3b7a0', glassStyle: { background: 'rgba(230,194,190,.06)', border: 'rgba(240,218,214,.18)' }, animationPreset: 'gentle' },
  interlude: { ...background('dark'), overlayColor: '#030305', overlayOpacity: .97, blurAmount: 0, textColor: '#f4e8d8', accentColor: '#d9bf91', glassStyle: { background: 'transparent', border: 'transparent' }, animationPreset: 'gentle', transitionDuration: 1.4 },
  invitation: { ...background('theatre'), overlayColor: '#160e10', overlayOpacity: .43, blurAmount: 4, textColor: '#fff4e4', accentColor: '#e8cd98', glassStyle: { background: 'rgba(255,227,180,.09)', border: 'rgba(241,212,164,.25)' }, animationPreset: 'gentle', atmosphere: 'theatre', transitionDuration: 2.3 },
  date: { ...background('theatre-close'), overlayColor: '#140f12', overlayOpacity: .55, blurAmount: 6, textColor: '#fff4e4', accentColor: '#e8cd98', glassStyle: { background: 'rgba(255,227,180,.07)', border: 'rgba(241,212,164,.2)' }, animationPreset: 'gentle', atmosphere: 'theatre' },
  confirmation: { ...background('theatre'), overlayColor: '#211217', overlayOpacity: .52, blurAmount: 7, textColor: '#fff4e4', accentColor: '#e8cd98', glassStyle: { background: 'rgba(255,227,180,.09)', border: 'rgba(241,212,164,.25)' }, animationPreset: 'gentle', atmosphere: 'theatre' },
};
export const dawnTheme: SceneTheme = { ...themes.nights, ...background('palace-dawn'), overlayColor: '#463d49', overlayOpacity: .27, accentColor: '#ffe1b0', textColor: '#fff5e8', atmosphere: undefined, transitionDuration: 4 };
