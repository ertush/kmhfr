import 'tailwindcss/tailwind.css'
import '/assets/css/style.css'
import NProgress from 'nprogress';
import { Router } from 'next/router';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT
};


function MyApp({ Component, pageProps }) {
  return (
    <Provider template={AlertTemplate} {...options}>
        <Component {...pageProps} />
    </Provider>
  )
  
}

export default MyApp