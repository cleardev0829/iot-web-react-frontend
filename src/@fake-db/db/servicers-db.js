import mock from '../mock';
import axios from 'axios';
import { API_URL } from 'app/fuse-configs/endpointConfig';

mock.onGet(`/api/servicers-app/servicers`).reply(() => { 
	return new Promise((resolve, reject) => {
		axios
			.get(`${API_URL}/servicers`, {})
			.then(response => { 			
				const data = response.data;
				resolve([200, data])
			});
	});
});

mock.onPost('/api/servicers-app/remove-servicers').reply(request => {
	const { ids } = JSON.parse(request.data); 
	return new Promise((resolve, reject) => {
		axios
			.post(`${API_URL}/servicers/deleteByIds`, { ids })
			.then(response => { 
				const data = response.data;
				resolve([200, data])
			});
	});
});

mock.onGet('/api/servicers-app/servicer').reply(request => { 
	const { productId } = request.params;						
	return new Promise((resolve, reject) => {
		axios
			.get(`${API_URL}/servicers/${productId}`, {})
			.then(response => { 
				const data = response.data;
				resolve([200, data])
			});
	});
});

mock.onPost('/api/servicers-app/servicer/save').reply(request => { 
	const data = JSON.parse(request.data); 
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/servicers/register`, {
			uid: data.id,
			customerId: data.customerId,
			displayName: data.displayName,
			email: data.email,
			emailValidation: false,
			phone: data.phone,
			devices: data.devices,
			role: data.role,
			type: data.type
		})
		.then(response => {
			const data = response.data;
			resolve([200, data])
		}).catch(err => {
			reject(err)
		});
	});
});

mock.onPost('/api/servicers-app/servicer/update').reply(request => {
	const data = JSON.parse(request.data); 
	return new Promise((resolve, reject) => {
		axios.put(`${API_URL}/servicers/${data.id}`, {
			uid: data.id,
			displayName: data.displayName,
			email: data.email,
			phone: data.phone,
			devices: data.devices,
			emailValidation: false,
			role: data.role,
			type: data.type
		})
		.then(response => {
			const data = response.data;
			resolve([200, data])
		});
	});
});


