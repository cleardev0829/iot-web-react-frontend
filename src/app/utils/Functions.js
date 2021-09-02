export const diff = (m1, m2) => {
	let diff = '';

	const min = m1.diff(m2, 'minutes');
	const hour = m1.diff(m2, 'hours');
	const day = m1.diff(m2, 'days');
	if (min < 2) diff = 'a few seconds';
	else if (min < 60) diff = `${min} mins ago`;
	else if (hour < 2) diff = `${hour} hour ago`;
	else if (hour < 24) diff = `${hour} hours ago`;
	else if (day < 2) diff = `${day} day ago`;
	else diff = `${day} days ago`;

	return diff;
};

export const getDuration = sec => {
	const d = parseInt(sec / 86400);
	const h = parseInt((sec - 86400 * d) / 3600);
	const m = parseInt((sec - 86400 * d - 3600 * h) / 60);
	const s = parseInt(sec - 86400 * d - 3600 * h - 60 * m);

	let duration = '';
	duration = d > 0 ? `${d}d` : duration; 
	duration = h > 0 ? `${duration} - ${h}` : duration;
	duration = m > 0 ? `${duration}:${m}` : duration;
	duration = s > 0 ? `${duration}:${s}` : duration;

	return duration;
};

export function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
