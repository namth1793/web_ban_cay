import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const SiteSettingsContext = createContext({
  site_name: 'Xương Rồng Nông Lâm',
  site_tagline: 'Cây Cảnh - Xương Rồng - Sen Đá - Bonsai',
  contact_phone: '0979.840.050',
  contact_email: '',
  contact_address: '',
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    site_name: 'Xương Rồng Nông Lâm',
    site_tagline: 'Cây Cảnh - Xương Rồng - Sen Đá - Bonsai',
    contact_phone: '0979.840.050',
    contact_email: '',
    contact_address: '',
  });

  useEffect(() => {
    api.getSettings()
      .then(s => {
        setSettings(s);
        if (s.site_name) document.title = s.site_name;
      })
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
