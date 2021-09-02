import mock from '../mock';
import axios from 'axios';
import { API_URL } from 'app/fuse-configs/endpointConfig';

mock.onGet('/api/file-manager-app/files/getByLiftId').reply(request => {
	const { productId } = request.params;

	return new Promise((resolve, reject) => {
		axios
			.get(`${API_URL}/files/getByLiftId/`, {
				params: { liftId: productId }
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			});
	});
});

mock.onPost('/api/file-manager-app/files/save').reply(request => {
	const data = JSON.parse(request.data);
	return new Promise((resolve, reject) => {
		axios
			.post(`${API_URL}/files/register`, {
				uid: data.uid,
				liftId: data.liftId,
				name: data.name,
				size: data.size,
				type: data.type,
				url: data.url
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			})
			.catch(err => {
				reject(err);
			});
	});
});

mock.onPost('/api/file-manager-app/files/remove-file').reply(request => {
	const { id } = JSON.parse(request.data);

	return new Promise((resolve, reject) => {
		axios.delete(`${API_URL}/files/${id}`, {}).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});
