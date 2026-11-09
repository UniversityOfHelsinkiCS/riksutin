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
      '@types': path.resolve(__dirname, '../types.ts'),
      '@config': path.resolve(__dirname, '../config.ts'),
      '@common': path.resolve(__dirname, '../common'),
      '@routes/types': path.resolve(__dirname, '../types/routes.ts'),
      '@client/types': path.resolve(__dirname, '../types/client.ts'),
      '@server/types': path.resolve(__dirname, '../types/server.ts'),
      '@dbmodels': path.resolve(__dirname, '../server/db/models/index.ts'),
      '@userconfig': path.resolve(__dirname, '../../config/index.ts'),
      '@userservices': path.resolve(__dirname, '../../config/services'),
      '@server/config': path.resolve(__dirname, '../server/util/config.ts'),
      '@validators': path.resolve(__dirname, '../validators'),
      '@resultRenderer': path.resolve(__dirname, '../resultRenderer'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.ORGANISATION_ID': JSON.stringify(process.env.ORGANISATION_ID),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL),
    'process.env.DEFAULT_SURVEY_NAME': JSON.stringify(process.env.DEFAULT_SURVEY_NAME),
    'process.env.REACT_APP_E2E': JSON.stringify(process.env.REACT_APP_E2E),
    'process.env.REACT_APP_CONTROL_REPORT_CHECK_ENABLED': JSON.stringify(
      process.env.REACT_APP_CONTROL_REPORT_CHECK_ENABLED
    ),
  },
})
