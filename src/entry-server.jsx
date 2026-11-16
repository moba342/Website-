import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.jsx';
export {seoPages,utilityPages,metadataFor,socialMetadata} from './seo.js';
export function renderPage(route){return renderToString(<App initialPage={route}/>);}
