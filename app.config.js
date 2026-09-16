/**
 * Config Expo com suporte a env (API key do Google Maps no build nativo).
 * Mantém o conteúdo de app.json e acrescenta o plugin do react-native-maps.
 */
const fs = require('fs');
const path = require('path');

const appJson = require('./app.json');

/** Preenche process.env a partir de arquivos locais sem sobrescrever o ambiente da máquina. */
function applyEnvFile(fileName) {
  const file = path.join(__dirname, fileName);
  if (!fs.existsSync(file)) {
    return;
  }

  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eq = line.indexOf('=');
    if (eq <= 0) {
      continue;
    }

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = value;
    }
  }
}

applyEnvFile('.env');
applyEnvFile('.env.local');

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
    'expo-sqlite',
  ],
};

module.exports = { expo: config };
