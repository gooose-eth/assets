import { defineConfig, loadEnv } from 'vite'

const config = defineConfig(({ mode }) => {
  const path = process.cwd()
  const env = loadEnv(mode, path)
  return {
    base: './',
    server: {
      host: '0.0.0.0',
      port: 4000,
      open: false,
    },
    build: {
      // outDir: '../../dest/markdown',
      // assetsDir: '',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          // assetFileNames: (assetInfo) => {},
        },
      },
    },
    plugins: [],
  }
})

export default config
