import { defineConfig, loadEnv } from 'vite'
import { compileStylesheet } from './plugins/compileStylesheet'

const config = defineConfig(({ mode }) => {
  const path = import.meta.dir
  const env = loadEnv(mode, path)
  return {
    base: './',
    server: {
      host: '0.0.0.0',
      port: 4000,
      open: false,
    },
    build: {
      outDir: '../../dest/fonts',
      assetsDir: '',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const name = info[0]
            const ext = info[info.length - 1]
            switch (ext)
            {
              case 'woff2':
                if (/^ortsa/.test(name))
                {
                  return `ortsa/[name][extname]`
                }
                else if (/^Pretendard/.test(name))
                {
                  return `pretendard/[name][extname]`
                }
                break
            }
            return `assets/[name]-[hash][extname]`
          },
        },
      },
    },
    plugins: [
      compileStylesheet(),
    ],
  }
})

export default config
