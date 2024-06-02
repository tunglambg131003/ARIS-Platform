// Import necessary dependencies and components
import { Provider } from 'next-auth/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import '../../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Router>
        <Layout>
          {/* Define your routes using Switch and Route */}
          <Switch>
            {/* Route for the homepage */}
            <Route exact path="/" component={Component} />
            {/* Add other routes for different pages */}
            {/* Example: */}
            {/* <Route path="/about" component={AboutPage} /> */}
          </Switch>
        </Layout>
      </Router>
    </Provider>
  );
}

export default MyApp;
