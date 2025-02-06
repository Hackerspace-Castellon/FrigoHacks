import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { useSanctum } from 'react-sanctum';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

const prefix = '/dashboard';

export const navData1 = [
  {
    title: 'Dashboard',
    path: `${prefix}/`,
    icon: icon('ic-analytics'),
  },
  {
    title: 'Your Profile',
    path: `${prefix}/user`,
    icon: icon('ic-user'),
  },
  {
    title: 'All users',
    path: `${prefix}/users`,
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: `${prefix}/products`,
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },

  {
    title: 'Sign in',
    path: '/login',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];

export const navData2 = [
  {
    title: 'Your Profile',
    path: `${prefix}/user`,
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: `${prefix}/products`,
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },

];
