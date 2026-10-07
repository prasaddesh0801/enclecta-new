import Image from "next/image";

/**
 * A project photo that fills its parent (the parent must be position: relative, overflow hidden).
 * Until an image is set in lib/featured-projects.ts it draws a coloured placeholder with the project name.
 */
export default function Shot({ src, name, sizes, alt = "" }: { src?: string; name: string; sizes: string; alt?: string }) {
  if (!src) return <span className="pw-ph heading-font">{name}</span>;
  return <Image src={src} alt={alt} fill sizes={sizes} className="pw-img" />;
}
