import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import {readRoute} from './router.js';
document.body.classList.add('midnight-site');
hydrateRoot(document.getElementById('root'),<App initialPage={window.location.pathname.replace(/^\/+|\/+$/g,'')||'home'}/>);
