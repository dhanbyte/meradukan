/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Add type declarations for modules without types
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Add any other global type declarations here
declare global {
  // Add global types here if needed
  interface Window {
    // Add any window extensions here
  }
}
