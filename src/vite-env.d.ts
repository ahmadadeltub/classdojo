/// <reference types="vite/client" />

// Declare Office global for TypeScript
declare const Office: {
  onReady: (callback: () => void) => void;
  context: {
    document: any;
  };
};
