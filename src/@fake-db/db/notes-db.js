import mock from '../mock';
import axios from 'axios';
import { API_URL } from 'app/fuse-configs/endpointConfig';

mock.onGet('/api/notes-app/notes/getByMessageId').reply(request => {
	const { messageId } = request.params;

	return new Promise((resolve, reject) => {
		axios
			.get(`${API_URL}/notes/getByMessageId/`, {
				params: { messageId: messageId }
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			});
	});
});

mock.onPost('/api/notes-app/notes/save').reply(request => {
	const data = JSON.parse(request.data);
	
	return new Promise((resolve, reject) => {
		axios
			.post(`${API_URL}/notes/register`, {
				uid: data.uid,
				messageId: data.messageId,
				title: data.title,
				note: data.note,
				url: data.url,
				file: data.image,
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

mock.onPost('/api/notes-app/notes/remove').reply(request => {
	const { id } = JSON.parse(request.data);

	return new Promise((resolve, reject) => {
		axios.delete(`${API_URL}/notes/${id}`, {}).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});
