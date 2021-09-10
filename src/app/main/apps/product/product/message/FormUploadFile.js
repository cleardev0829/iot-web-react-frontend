import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';

function FormUploadFile(props) {
	return (
		<>
			<label htmlFor="button-file">
				<input accept="image/*" className="hidden" id="button-file" type="file" onChange={props.onChange} />
				<IconButton className="w-32 h-32 mx-4 p-0" component="span">
					<Icon fontSize="small" label='sdf'>image</Icon>
				</IconButton>
			</label>
		</>
	);
}

export default FormUploadFile;
