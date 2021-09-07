import React from 'react';

const ErrorAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/errors',
			component: React.lazy(() => import('./Messages'))
		},		
	]
};

export default ErrorAppConfig;
