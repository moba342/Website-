import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {readRoute} from './router.js';
document.body.classList.add('midnight-site');
createRoot(document.getElementById('root')).render(<App initialPage={readRoute()}/>);
