export enum ImageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ORIGINAL = 'original',
}

export const ImageWidths = {
  [ImageSize.SMALL]: 320,
  [ImageSize.MEDIUM]: 768,
  [ImageSize.LARGE]: 1280,
  [ImageSize.ORIGINAL]: 1920, // Max width for original size
};
