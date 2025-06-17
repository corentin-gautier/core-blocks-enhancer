// ./src/front/main.js --format iife --compact --minifyInternalExports --name \"coreBlocksEnhancer\" --file ./build/front.js

import terser from '@rollup/plugin-terser';
 
export default {
    input: './src/front/main.js',
    output: {
        file: './build/front.min.js',
        format: 'iife'
    },
    plugins: [terser()]
}
