import _ from '@lodash';
import mock from '../mock';
import axios from 'axios';
import { API_URL } from 'app/fuse-configs/endpointConfig';

const productDB = {
	products: [],
	descriptions: {
		error: [
			'',
			'SC INTERRUPT',
			'FI_ERROR',
			'TIMEOUT',
			'DRIVE-TIME ERROR',
			'NOT IN LEVEL',
			'NO DOORZONE',
			'Early dooropening is missing',
			'Dooropen switch is missing',
			'Doorclosed switch is missing',
			'MEMORY_IMAGE',
			'MOTOR_TEMPERATURE',
			'CANFLAG_OFF',
			'CANFLAG_PASSIVE',
			'CANFLAG_OVERFLOW',
			'CANFLAG_Rxbuffer overflow',
			'CANFLAG_Txbuffer overflow',
			'RELEVELING_TRY',
			'RELEVELING NOT IN LEVEL',
			'INTERNAL_ERROR',
			'BYPASS_SC_ERROR',
			'',
			'RECALL',
			'UNKNOWN',
			'DOOR_CLOSED_SC_MISSING',
			'AWM_CABIN_LIGHT',
			'AWM_LEVEL_ERROR',
			'AWM_BYPASS_SC_ERROR',
			'QSPI ERROR',
			'',
			'RECALL_BYPASS',
			'RECALL_BUTTON_NO',
			'RECALL_BUTTON_NC',
			'ENCODER PSU',
			'CABIN_INSPBUTTON',
			'PIT_INSPBUTTON',
			'BYPASS CONNECTOR',
			'START_UP_ERROR',
			'QUICKSTOP',
			'UCM ERROR',
			'',
			'PSU-Bypass Error',
			'',
			'Braketest: Movement detected',
			'Braketest: not executed',
			'OVG relay is not energized',
			'OVG relay has not dropped out'
		],
		info: [
			'CanOpenBus Init',
			'initialization',
			'Inspection',
			'Inspection drive',
			'',
			'Wait for call',
			'Call available',
			'Normal drive',
			'Landing phases',
			'In destination',
			'Assembly mode',
			'Door stays open',
			'',
			'FireFightingMode',
			'',
			'',
			'',
			'',
			'Overload',
			'Driving stop',
			'Escape fire',
			'Engine overheat',
			'Start up',
			'',
			'Out of Order',
			'EmergencyPower',
			'Shaft drive',
			'AutomaticEvac.',
			'EmergencyEvac.',
			'Wait for guest',
			'Fill all mode'
		],
		para: []
	}
};

mock.onGet(`/api/product-app/descriptions`).reply(() => {
	return [200, productDB.descriptions];
});

mock.onGet(`/api/product-app/products`).reply(() => {
	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/products`, {}).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});

mock.onGet(`/api/product-app/products-by-user-id`).reply(request => {
	const { userId } = request.params;

	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/products/getByUserId`, { params: { userId } }).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});

mock.onPost('/api/product-app/remove-products').reply(request => {
	const { productIds } = JSON.parse(request.data);
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/products/deleteByIds`, { productIds }).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});

mock.onGet('/api/product-app/product').reply(request => {
	const { productId } = request.params;
	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/products/${productId}`, {}).then(response => {
			const data = response.data;
			resolve([200, data]);
		});
	});
});

mock.onPost('/api/product-app/product/save').reply(request => {
	const data = JSON.parse(request.data);
	return new Promise((resolve, reject) => {
		axios
			.post(`${API_URL}/products/register`, {
				uid: data.uid,
				name: data.name,
				location: data.location,
				categories: data.categories
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			});
	});
});

mock.onPost('/api/product-app/product/update').reply(request => {
	const data = JSON.parse(request.data);
	return new Promise((resolve, reject) => {
		axios
			.put(`${API_URL}/products/${data.id}`, {
				uid: data.uid,
				name: data.name,
				location: data.location,
				categories: data.categories
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			});
	});
});

mock.onGet('/api/product-app/messages').reply(request => {
	const { deviceId, limit, skip, log } = request.params;

	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/messages/getByPagenation`, { params: { ...request.params } }).then(response => {
			let data = [];
			response.data.map(item => {
				const log =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('log') ? item.message.log : '';
				const state =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('state') ? item.message.state : 0;
				const errid =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('errid') ? item.message.errid : 0;
				const number = log === 'info' ? state : log === 'error' ? errid : 0;

				let description = '';
				let errorDescription = '';
				if (log === 'info' || log === 'error') {
					description = productDB.descriptions[log][number];
					errorDescription = productDB.descriptions['info'][state];
				}

				data.push({				
					...item,
					id: item._id,
					number: number,
					log: log,
					description: description,
					errorDescription: errorDescription
				});

				return data;
			});

			console.log('MESSAGES:', data);
			resolve([200, data]);
		});
	});
});

mock.onGet('/api/product-app/last-messages').reply(request => {
	const { limit, skip, log } = request.params;

	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/messages/getLastMsgs`, { params: { limit, skip, log } }).then(response => {
			let data = [];
			response.data.map(item => {
				const log =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('log') ? item.message.log : '';
				const state =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('state') ? item.message.state : 0;
				const errid =
					item.hasOwnProperty('message') && item.message.hasOwnProperty('errid') ? item.message.errid : 0;
				const number = log === 'info' ? state : log === 'error' ? errid : 0;

				let description = '';
				let errorDescription = '';
				if (log === 'info' || log === 'error') {
					description = productDB.descriptions[log][number];
					errorDescription = productDB.descriptions['info'][state];
				}

				data.push({
					...item,
					_id: item.id,
					number: number,
					log: log,
					description: description,
					errorDescription: errorDescription
				});

				return data;
			});

			console.log('LAST MESSAGES:', data);
			resolve([200, data]);
		});
	});
});

mock.onPost('/api/product-app/message/update').reply(request => {
	const data = JSON.parse(request.data);
	return new Promise((resolve, reject) => {
		axios
			.put(`${API_URL}/messages/${data.messageId}`, {
				isNotes: data.isNotes,
				notes: {
					title: data.title,
					notes: data.notes,
					urls: data.urls
				}
			})
			.then(response => {
				const data = response.data;
				resolve([200, data]);
			});
	});
});

mock.onGet('/api/product-app/users').reply(() => {
	return new Promise((resolve, reject) => {
		axios.get(`${API_URL}/users`, {}).then(response => {
			const data = response.data;
			const users = data.map(item => ({
				id: item.id,
				value: item.displayName,
				label: item.displayName
			}));
			resolve([200, users]);
		});
	});
});

mock.onGet('/api/product-app/orders').reply(() => {
	return [200, productDB.orders];
});

mock.onPost('/api/product-app/remove-orders').reply(request => {
	const { orderIds } = JSON.parse(request.data);
	productDB.orders = productDB.orders.filter(order => !orderIds.includes(order.id));
	return [200, orderIds];
});

mock.onGet('/api/product-app/order').reply(request => {
	const { orderId } = request.params;
	const response = _.find(productDB.orders, { id: orderId });
	return [200, response];
});
