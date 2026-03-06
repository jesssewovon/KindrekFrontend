/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string;
  // add other variables here as needed
  // readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
