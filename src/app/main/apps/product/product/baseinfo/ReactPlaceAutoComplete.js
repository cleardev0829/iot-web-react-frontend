import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const ReactPlaceAutoComplete = props => {
	const { className, error, inputProps, label, id, name, value, variant, onComplete } = props;

	const [address, setAddress] = useState('');

	useEffect(() => {
		setAddress(value);
	}, [value]);

	const handleChange = address => {
		setAddress(address);
	};

	const handleSelect = address => {
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				onComplete({
					...latLng,
					address
				});
			})
			.catch(error => console.error('Error', error));
		setAddress(address);
	};

	return (
		<PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
			{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
				<div>
					<TextField
						className={className}
						error={error}
						required
						label={label}
						id={id}
						name={name}
						onChange={handleChange}
						variant={variant}
						fullWidth
						inputProps={inputProps}
						{...getInputProps({
							placeholder: 'Search Places ...'
						})}
					/>
					<div>
						<List className="p-0">
							<FuseAnimateGroup
								enter={{
									animation: 'transition.slideUpBigIn'
								}}
							>
								{loading && <Typography variant="caption">Loading...</Typography>}
								{suggestions.map((suggestion, n) => {
									const style = suggestion.active
										? { backgroundColor: '#f6f7f9', cursor: 'pointer' }
										: { backgroundColor: '', cursor: 'pointer' };
									return (
										<div
											key={`div-${n}`}
											{...getSuggestionItemProps(suggestion, {
												style
											})}
										>
											<Typography variant="caption" key={`span-${n}`}>
												{suggestion.description}
											</Typography>
										</div>
									);
								})}
							</FuseAnimateGroup>
						</List>
					</div>
				</div>
			)}
		</PlacesAutocomplete>
	);
};

export default ReactPlaceAutoComplete;
