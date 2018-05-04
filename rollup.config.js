import { relative, resolve } from 'path';
import assets from './rollup-plugin-assets';

let external = Object.create(null);

export default {
  input: 'src/index.js',
  output: {
    paths: (id) => {
      // if this is an external path to an asset, we need to rewrite
      // the URL to be relative to the bundle, *not* the source
      if (id.startsWith(resolve('build/assets'))) {
        let relativeUrl = relative(resolve('build'), id).replace(/\\/g, '/');
        if (relativeUrl[0] !== '.') relativeUrl = `./${relativeUrl}`;
        return relativeUrl;
      }

      return id;
    },
    file: 'build/index.js',
    format: 'es'
  },
  plugins: [
    assets({
      //   include: 'src/assets/**',
      include: '**/*.(css|png)',
      dest: 'build/assets',
      oncopy: (dest) => (external[dest] = true)
    })
  ],
  external: (id) => {
    return id in external;
  }
};
