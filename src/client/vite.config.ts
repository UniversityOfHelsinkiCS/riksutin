import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: { outDir: '../../dist' },
  plugins: [react()],
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000,
  },
  resolve: {
    alias: {
      '@types': path.resolve('/opt/app-root/src/src/types.ts'),
      '@config': path.resolve('/opt/app-root/src/src/config.ts'),
      '@common': path.resolve('/opt/app-root/src/src/common'),
      '@routes/types': path.resolve('/opt/app-root/src/src/types/routes.ts'),
      '@client/types': path.resolve('/opt/app-root/src/src/types/client.ts'),
      '@server/types': path.resolve('/opt/app-root/src/src/types/server.ts'),
      '@dbmodels': path.resolve('/opt/app-root/src/src/server/db/models/index.ts'),
      '@userconfig': path.resolve('/opt/app-root/src/config/index.ts'),
      '@userservices': path.resolve('/opt/app-root/src/config/services'),
      '@server/config': path.resolve('/opt/app-root/src/src/server/util/config.ts'),
      '@validators': path.resolve('/opt/app-root/src/src/validators'),
      '@resultRenderer': path.resolve('/opt/app-root/src/src/resultRenderer'),
    },
  },
  define: {
    'process.env': process.env,
  },
})
