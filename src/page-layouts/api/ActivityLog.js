import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import your feature components
import HomePageTest from '../home-page/HomePage'; // Import your homepage component
import ModelViewerRenderPage from '../ModelViewerRenderPage'; // Import your ModelViewer component
// Import other feature components as needed

function Routes() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={HomePageTest} />
				<Route
					path="/model-viewer/:featureId"
					component={ModelViewerRenderPage}
				/>
				{/* Define other routes for different features */}
				{/* ... */}
			</Switch>
		</Router>
	);
}

export default Routes;
