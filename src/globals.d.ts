declare module '*.css';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_USE_MOCKS?: string;
    readonly EXPO_PUBLIC_API_URL?: string;
    readonly EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY?: string;
    readonly EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?: string;
    readonly EXPO_PUBLIC_APP_KEY?: string;
    readonly GOOGLE_MAPS_API_KEY?: string;
  }
}
