import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AllUserView } from 'src/sections/user/view/all-users';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`AllUsers - ${CONFIG.appName}`}</title>
      </Helmet>

      <AllUserView />
    </>
  );
}
