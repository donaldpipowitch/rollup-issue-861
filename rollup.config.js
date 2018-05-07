import { relative, resolve } from 'path';
import assets from './rollup-plugin-assets';

const copiedIds = Object.create(null);

export default {
  input: 'src/index.js',
  output: {
    paths: (id) => {
      // if this id was copied before change it from an absolute path
      // to a relative path, so it is properly referenced from the output dir
      if (id in copiedIds) {
        let relativePath = relative(resolve('build'), id).replace(/\\/g, '/');
        if (relativePath[0] !== '.') relativePath = `./${relativePath}`;
        return relativePath;
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
      dest: 'build', // output."dir"
      oncopy: (copiedId) => (copiedIds[copiedId] = true)
    })
  ],
  external: (id) => {
    return id in copiedIds;
  }
};
