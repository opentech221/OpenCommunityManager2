import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Optimisation du bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk vendor pour les grandes librairies
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'icons-vendor': ['lucide-react'],
          'utils-vendor': ['axios'],
          
          // Chunks par modules métier
          'pages-main': [
            './src/pages/DashboardPage.tsx',
            './src/pages/MembersPage.tsx',
            './src/pages/EventsPage.tsx'
          ],
          'pages-finance': [
            './src/pages/FinancesPage.tsx',
            './src/pages/CotisationsPageResponsive.tsx',
            './src/pages/BillingPage.tsx'
          ],
          'pages-communication': [
            './src/pages/MessagesPage.tsx',
            './src/pages/DocumentsPage.tsx',
            './src/pages/NotificationsPage.tsx'
          ],
          'pages-guidance': [
            './src/pages/GuidancePage.tsx',
            './src/pages/ActionPlanPage.tsx',
            './src/pages/DiagnosticPage.tsx'
          ]
        }
      }
    },
    // Limite d'avertissement pour chunks
    chunkSizeWarningLimit: 400,
    // Optimisation CSS
    cssCodeSplit: true,
    // Compression avec minification
    minify: 'terser',
  },
})
