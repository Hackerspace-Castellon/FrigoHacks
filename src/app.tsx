import 'src/global.css';

import Fab from '@mui/material/Fab';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';
import { Sanctum } from 'react-sanctum';
import axios from 'axios';
import { CONFIG } from 'src/config-global';
// change dotenv file path

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;



// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const sanctumConfig = {
    apiUrl: CONFIG.appURL,
    csrfCookieRoute: 'sanctum/csrf-cookie',
    signInRoute: 'api/login',
    signOutRoute: 'logout',
    userObjectRoute: 'api/user',
  };

  return (
    <ThemeProvider>
      <Sanctum config={sanctumConfig}>
        <Router />
      </Sanctum>
    </ThemeProvider>
  );
}
