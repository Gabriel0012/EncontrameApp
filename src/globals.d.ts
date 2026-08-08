declare module '*.css';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_USE_MOCKS?: string;
    readonly EXPO_PUBLIC_API_URL?: string;
  }
}
