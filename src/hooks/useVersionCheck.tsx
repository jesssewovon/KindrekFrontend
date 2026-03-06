import { useEffect } from "react";

interface useVersionCheckProps{
  storageKey?: string;
  persistor?: any;
}

// optional: pass in persistor if you use redux-persist
export function useVersionCheck({ storageKey = "app_version", persistor }: useVersionCheckProps) {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch("/version.json?_=" + Date.now()); // bust cache
        if (!res.ok) return;

        const { version } = await res.json();
        const current = localStorage.getItem(storageKey);
        //alert('checking version')
        if (current && current !== version) {
          alert('version changed')
          console.log(`[VersionCheck] New version detected: ${version} (was ${current})`);
          // clear storage
          localStorage.clear();
          sessionStorage.clear();

          setTimeout(function(){ 
            localStorage.clear();
            sessionStorage.clear();
          }, 2000);

          // clear redux-persist if provided
          if (persistor) {
            //alert('purging')
            await persistor.purge();
          }
          // force reload new build
          window.location.reload();
        }

        // save new version
        localStorage.setItem(storageKey, version);
        /* setTimeout(function(){ 
          localStorage.setItem('persist:root', '');
        }, 2000); */
        
      } catch (err) {
        console.warn("[VersionCheck] Failed to check version:", err);
      }
    };

    checkVersion();
  }, [storageKey, persistor]);
}
