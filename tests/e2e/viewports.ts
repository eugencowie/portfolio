/** A portrait phone: the screen the Highrise must stay usable on. */
export const portraitPhone = { width: 390, height: 844 };

/**
 * Every screen the Hero must fit on: portrait and landscape phones, laptops
 * and a desktop monitor.
 */
export const viewports = [
  { name: "portrait phone", ...portraitPhone },
  { name: "landscape phone", width: 844, height: 390 },
  { name: "small laptop", width: 1280, height: 720 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];
