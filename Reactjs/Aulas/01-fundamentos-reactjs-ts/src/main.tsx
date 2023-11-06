import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

//DOM (Document Object Model)
//Representação dos elementos HTML através do JS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
