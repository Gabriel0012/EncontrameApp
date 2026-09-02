import { Redirect } from 'expo-router';

/** Entrada do app: a home de pessoas + mapa é `/inicio`. */
export default function Index() {
  return <Redirect href="/inicio" />;
}
