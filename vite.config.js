import {defineConfig} from 'vite';
export default defineConfig({define:{'import.meta.env.VITE_SITE_NOINDEX':JSON.stringify(process.env.VERCEL_ENV==='preview'||process.env.VITE_SITE_NOINDEX==='true'?'true':'false')},build:{rollupOptions:{onwarn(warning,warn){if(warning.code==='MODULE_LEVEL_DIRECTIVE'&&warning.message.includes('use client')&&warning.id?.includes('@vercel/speed-insights'))return;warn(warning);},output:{manualChunks(id){
 if(id.includes('/node_modules/qrcode.react/'))return 'qr-code';
 if(/\/node_modules\/(react|react-dom|scheduler)\//.test(id))return 'react-vendor';
}}}}});
