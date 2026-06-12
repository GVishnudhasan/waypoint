import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const icon = (path: string, viewBox = '0 0 24 24') =>
  ({ size = 20, color = 'currentColor', className }: IconProps) =>
    React.createElement('svg', { width: size, height: size, viewBox, fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className }, 
      ...path.split('|').map((d, i) => React.createElement('path', { key: i, d }))
    );

export const Icons = {
  home: icon('M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z|M9 21V12h6v9'),
  compass: icon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'),
  users: icon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75'),
  calendar: icon('M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z|M16 2v4|M8 2v4|M3 10h18'),
  map: icon('M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z|M8 2v16|M16 6v16'),
  target: icon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z|M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'),
  search: icon('M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z|M21 21l-4.35-4.35'),
  bell: icon('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0'),
  settings: icon('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'),
  user: icon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'),
  plus: icon('M12 5v14|M5 12h14'),
  x: icon('M18 6L6 18|M6 6l12 12'),
  check: icon('M20 6L9 17l-5-5'),
  chevronRight: icon('M9 18l6-6-6-6'),
  chevronDown: icon('M6 9l6 6 6-6'),
  arrowRight: icon('M5 12h14|M12 5l7 7-7 7'),
  arrowUp: icon('M12 19V5|M5 12l7-7 7 7'),
  arrowDown: icon('M12 5v14|M19 12l-7 7-7-7'),
  star: icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'),
  heart: icon('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'),
  bookmark: icon('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'),
  send: icon('M22 2L11 13|M22 2l-7 20-4-9-9-4 20-7z'),
  messageCircle: icon('M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'),
  zap: icon('M13 2L3 14h9l-1 8 10-12h-9l1-8z'),
  trending: icon('M23 6l-9.5 9.5-5-5L1 18'),
  barChart: icon('M12 20V10|M18 20V4|M6 20v-4'),
  clock: icon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 6v6l4 2'),
  mapPin: icon('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'),
  link: icon('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'),
  externalLink: icon('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6|M15 3h6v6|M10 14L21 3'),
  menu: icon('M3 12h18|M3 6h18|M3 18h18'),
  command: icon('M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z'),
  filter: icon('M22 3H2l8 9.46V19l4 2v-8.54L22 3z'),
  grid: icon('M3 3h7v7H3z|M14 3h7v7h-7z|M14 14h7v7h-7z|M3 14h7v7H3z'),
  wifi: icon('M1 1l22 22|M5 12.55a11 11 0 0 1 14.08 0|M8.53 16.11a6 6 0 0 1 6.95 0|M12 20h.01'),
  globe: icon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M2 12h20|M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'),
  layout: icon('M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z|M3 9h18|M9 21V9'),
  shield: icon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),
  sliders: icon('M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M1 14h6|M9 8h6|M17 12h6'),
  trash: icon('M3 6h18|M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  edit: icon('M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z'),
  award: icon('M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z|M8.21 13.89L7 23l5-3 5 3-1.21-9.12'),
  briefcase: icon('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
  coffee: icon('M18 8h1a4 4 0 0 1 0 8h-1|M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z|M6 1v3|M10 1v3|M14 1v3'),
  alertCircle: icon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 8v4|M12 16h.01'),
  lock: icon('M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z|M7 11V7a5 5 0 0 1 10 0v4'),
  unlock: icon('M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z|M7 11V7a5 5 0 0 1 9.9-1'),
  logOut: icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9'),
  activity: icon('M22 12h-4l-3 9L9 3l-3 9H2'),
};
