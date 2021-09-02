import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeServicerProfileDialog } from './store/servicersSlice';

const defaultFormState = {
	id: '',
	name:'',
	email: '',
	emailValidation: false,
	role: '',
	roleValidation: false
};

function EditServicerDialog(props) { 
	const dispatch = useDispatch();
	const servicerProfileDialog = useSelector(({ servicersApp }) => servicersApp.servicers.servicerProfileDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => { 
		if (servicerProfileDialog.data) {
			setForm({ ...servicerProfileDialog.data });
		}
	}, [servicerProfileDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (servicerProfileDialog.props.open) {
			initDialog();
		}
	}, [servicerProfileDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeServicerProfileDialog());
	}

	function handleRemove() {
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...servicerProfileDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{'Servicer Profile'}
					</Typography>
				</Toolbar>			
			</AppBar>
			<form noValidate className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">					
						<TextField
							className="mb-24"
							label="Name"
							autoFocus
							id="name"
							name="name"
							value={form.displayName}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
							inputProps={{
								readOnly: Boolean(true),
								disabled: Boolean(true),
							}}
						/>
					</div>
					<div className="flex">					
						<TextField
							className="mb-24"
							label="Email"
							autoFocus
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
							inputProps={{
								readOnly: Boolean(true),
								disabled: Boolean(true),
							}}
					
						/>
					</div>					
				</DialogContent>				
				<DialogActions className="justify-between p-8">				
					<IconButton onClick={handleRemove}>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			
			</form>
		</Dialog>
	);
}

export default EditServicerDialog;
