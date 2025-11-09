
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: Add a global declaration to extend NodeJS.Process with cwd()
// This resolves the TypeScript error by explicitly declaring the cwd method,
// which is typically available in Node.js environments where Vite configs run.
declare namespace NodeJS {
  interface Process {
    cwd(): string;
  }
}

export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files, not just those prefixed with VITE_.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Expose process.env.API_KEY to the client-side code.
      // This is necessary because Vite by default only exposes VITE_ prefixed variables via import.meta.env
      // and process.env is a Node.js concept that needs to be polyfilled/defined for browser use.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});