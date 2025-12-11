const basePath = import.meta.env.BASE_URL ?? '/';
const withBase = (path: string) => `${basePath.replace(/\/$/, '')}/${path}`;

const IMAGE_PLATFORM = {
  ADUANA_LOGO: withBase('images/image-1.png'),
  ADUANA_LARGE_LOGO: withBase('images/image-2.png'),
  GOBIERNO_DE_CHILE_LOGO: withBase('images/image-3.png'),
}

export default IMAGE_PLATFORM;

