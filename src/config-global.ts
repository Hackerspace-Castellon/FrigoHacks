import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appURL: string;
  appVersion: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'FrigoHacks',
  appURL: 'http://localhost:8000',
  appVersion: packageJson.version,
};
