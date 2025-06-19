import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@/styles/globals.css'; // путь зависит от import-alias

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <Component {...pageProps} />
    </MantineProvider>
  );
}
