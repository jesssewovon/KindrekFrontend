//main.tsx
import { createRoot } from 'react-dom/client'

import './assets/css/style.css'
import './assets/css/custom.css'

import App from './App'

import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/index";

//CLEAR LOCALSTORAGE CACHE EVERY HMR HOT UPDATED (ONLY ON DEV ENV)
if (import.meta.hot) {
  import.meta.hot.accept(async () => { 
    setTimeout(function(){ 
      localStorage.clear();
      localStorage.setItem('persist:root', '');
      alert('cleared')
    }, 3000);

    // clear redux-persist if provided
    if (persistor) { 
       await persistor.purge();
    }
  });
}
//END CLEAR LOCALSTORAGE CACHE EVERY HMR HOT UPDATED (ONLY ON DEV ENV)

createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
      <PersistGate loading={<div>Loading persisted state...</div>} persistor={persistor}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
)
