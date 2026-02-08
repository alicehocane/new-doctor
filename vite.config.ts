import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      // Increase the warning limit to 1000kb (1MB) to reduce noise, 
      // but rely on manualChunks to actually split the files.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'wouter'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-icons': ['lucide-react'],
          }
        }
      }
    },
    define: {
      // Prioritize process.env (Vercel) over loaded env file, fall back to empty string to prevent undefined errors
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify((process as any).env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY': JSON.stringify((process as any).env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || ''),
      // Safe fallback for other process.env accesses
      'process.env': {}
    }
  };
});