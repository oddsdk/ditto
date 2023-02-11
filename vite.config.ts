import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite'
import fs from 'fs'

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: true
  },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $root: resolve('./'),
      $routes: resolve('./src/routes'),
      $src: resolve('./src'),
      $static: resolve('./static')
    },
  },
  server: {
    fs: {
      allow: [ './' ]
    },
    https: {
      key: fs.readFileSync('./elem.key.pem'),
      cert: fs.readFileSync('./elem.pem'),
    },
  },
}

export default config
