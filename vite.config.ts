import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite'
import fs from 'fs'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components')
    }
  },
  server: {
    fs: {
      allow: ['./']
    },
    https: {
      key: fs.readFileSync('./elem.key.pem'),
      cert: fs.readFileSync('./elem.pem'),
    },
  },
}

export default config