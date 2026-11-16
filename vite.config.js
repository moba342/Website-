import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{output:{manualChunks(id){
 if(id.includes('/node_modules/qrcode.react/'))return 'qr-code';
 if(/\/node_modules\/(react|react-dom|scheduler)\//.test(id))return 'react-vendor';
}}}}});
