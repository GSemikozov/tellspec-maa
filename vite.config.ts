import path from 'path';

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';

const rootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react({ tsDecorators: true }), legacy(), svgr()],
    resolve: {
        alias: {
            '@app': path.resolve(rootDir, 'src/app'),
            '@widgets': path.resolve(rootDir, 'src/widgets'),
            '@pages': path.resolve(rootDir, 'src/pages'),
            '@middlewares': path.resolve(rootDir, 'src/middlewares'),
            '@features': path.resolve(rootDir, 'src/features'),
            '@entities': path.resolve(rootDir, 'src/entities'),

            '@api': path.resolve(rootDir, 'src/api'),
            '@ui': path.resolve(rootDir, 'src/ui'),
            '@shared': path.resolve(rootDir, 'src/shared'),

            $fonts: path.resolve(rootDir, 'public/fonts'),
        },
    },
});
