import Layout from '../components/Layout';
import '../styles/globals.css';
import {ToastContainer} from "react-toastify";

function MyApp({Component, pageProps}) {
  return (
    <Layout>
      <ToastContainer limit={1} position="top-center" autoClose={1500} hideProgressBar={true} pauseOnHover />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
