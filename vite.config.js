import { defineConfig } from 'vite'
import compressDist from 'rollup-plugin-compress-dist'
import react from '@vitejs/plugin-react'

const compressOpts = {
  type: 'tgz',
  archiverName: 'pages.tar.gz',
  sourceName: 'pages',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compressDist(compressOpts)
  ],
  preview: {
    port: 10081,
    host: "0.0.0.0"
  },
  server: {
    port: 10081,
    host: "0.0.0.0"
  },
  build: {
    outDir: "./pages"
  }
})
