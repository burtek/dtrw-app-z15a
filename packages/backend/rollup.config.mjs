import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';

import packageJson from './package.json' with { type: 'json' };


export default defineConfig({
    input: {
        index: 'index.ts',
        'drizzle.config': 'drizzle.config.ts'
    },
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        preserveModules: true,
        preserveModulesRoot: '.'
    },
    external: packageJson.externalDependencies,
    plugins: [
        resolve({
            extensions: ['.mjs', '.js', '.json', '.ts', '.node'],
            moduleDirectories: ['node_modules'],
            browser: false,
            preferBuiltins: true
        }),
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto'
        }),
        json(),
        typescript({
            tsconfig: './tsconfig.build.json',
            clean: true
        }),
        copy({
            targets: [
                { src: 'src/assets/*', dest: 'dist/src/assets' },
                { src: 'scripts/*', dest: 'dist/scripts' },
                { src: 'drizzle/*', dest: 'dist/drizzle' }
            ]
        })
    ]
});
