/**
 * Config Expo com suporte a env (API key do Google Maps no build nativo).
 * Mantém o conteúdo de app.json e acrescenta o plugin do react-native-maps.
 */
const appJson = require('./app.json');

/** @type {import('expo/config').ExpoConfig} */
const config = {
  ...appJson.expo,
  plugins: [
    ...(appJson.expo.plugins ?? []),
    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    ],
  ],
};

module.exports = { expo: config };
