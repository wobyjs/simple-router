import { defineConfig } from 'vite'

const config = defineConfig({
    root: '.',  // Set root to current directory
    server: {
        hmr: {
            overlay: false  // Disable error overlay to see actual errors
        }
    },
    build: {
        minify: false,
        rollupOptions: {
            input: {
                main: './index.html',  // Specify the HTML file as entry
            },
        },
        outDir: './build',
        sourcemap: false,
    },
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'woby',  // Specify the JSX import source
    },
    optimizeDeps: {
        include: ['woby', '@woby/simple-router'],
    },
    plugins: [],
    resolve: {
        alias: {
            // Remove explicit aliases to allow workspace protocol to work properly
        },
    },
})



export default config
