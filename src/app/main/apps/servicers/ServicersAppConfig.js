import React from 'react';

const ServicerAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/servicers',
			component: React.lazy(() => import('./Servicers'))
		}					
	]
};

export default ServicerAppConfig;
