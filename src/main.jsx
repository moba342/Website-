import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import {readRoute} from './router.js';
document.body.classList.add('midnight-site');
const root=document.getElementById('root');
const app=<App initialPage={window.location.pathname.replace(/^\/+|\/+$/g,'')||'home'}/>;
if(root.hasChildNodes())hydrateRoot(root,app);else createRoot(root).render(app);
