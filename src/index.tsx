// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './main.css';

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './main.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId={clientId}> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);