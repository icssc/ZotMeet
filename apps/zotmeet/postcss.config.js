// @ts-check

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

/**
 * @type{import('postcss-load-config').ConfigFn}
 */
function config() {
  return {
    plugins: [tailwindcss(), autoprefixer()],
  }
}

export default config
