import React from 'react';
import Card from '@material-ui/core/Card';
import GoogleMap from 'google-map-react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import { mapStyles } from 'app/utils/Globals';
import { GOOGLE_MAP_API } from 'app/fuse-configs/endpointConfig';
import Geocode from 'react-geocode';

const defulatCenter = [47.516231, 14.550072];

Geocode.setApiKey(GOOGLE_MAP_API);
Geocode.enableDebug();

function Map(props) {
	const { location } = props;

	const Marker = props => {
		return (
			<Tooltip title={props.text} placement="top">
				<Icon className="text-red">place</Icon>
			</Tooltip>
		);
	};

	const getAddrFromLatLng = location => {
		Geocode.fromLatLng(location.lat, location.lng).then(
			response => {
				// const address = response.results[0].formatted_address;
				// onClick({ lat: location.lat, lng: location.lng, address });
			},
			error => {
				console.error(error);
			}
		);
	};

	return (
		<Card className="w-full h-full rounded-20 shadow">
			<GoogleMap
				bootstrapURLKeys={{
					key: GOOGLE_MAP_API
				}}
				defaultZoom={12}
				defaultCenter={defulatCenter}
				center={!_.isEmpty(location) ? [location.lat, location.lng] : defulatCenter}
				options={{
					styles: mapStyles
				}}
				yesIWantToUseGoogleMapApiInternals
				onClick={getAddrFromLatLng}
			>
				{!_.isEmpty(location) && (
					<Marker key={location.address} text={location.address} lat={location.lat} lng={location.lng} />
				)}
			</GoogleMap>
		</Card>
	);
}

export default Map;
