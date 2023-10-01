import Head from 'next/head';

import './styles/globals.css';
import { Nav, RouteGuard } from './components';

export default App;

function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>TODO List</title>

                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className="app-container bg-light">
                <Nav />
                <div className="container pt-4 pb-4">
                    <RouteGuard>
                        <Component {...pageProps} />
                    </RouteGuard>
                </div>
            </div>

            <div className="container">
                <footer className="py-3 my-4">
                    <p className="text-center text-muted">© 2021 Guilherme Campos</p>
                </footer>
            </div>
        </>
    );
}
