// pages/_app.tsx
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.css'; 


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="content"> {/* 追加 */}
        <Component {...pageProps} />
      </main> {/* 追加 */}
    </>
  );
}

export default MyApp;
