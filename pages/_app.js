import 'tailwindcss/tailwind.css'
import '/assets/css/style.css'
import NProgress from 'nprogress';
import { Router } from 'next/router';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp