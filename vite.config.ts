import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-toast'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          supabase: ['@supabase/supabase-js'],
          cashfree: ['@cashfreepayments/cashfree-js'],
          // Split large libraries
          spline: ['@splinetool/react-spline', '@splinetool/runtime'],
          animations: ['animejs'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit to 600KB
  },
})
