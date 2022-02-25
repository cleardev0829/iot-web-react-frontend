import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectServicers, sendMessage } from '../../store/servicersSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function MessageDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams([]);
	const servicers = useSelector(selectServicers);
	const product = useSelector(({ productApp }) => productApp.product);

	const [openDialog, setOpenDialog] = useState(false);
	const { form, handleChange } = useForm({
		email: '',
		phone: '',
		subject: '',
		message: ''
	});	

	function handleOpenDialog() {
		setOpenDialog(true);
	}

	function handleCloseDialog() {
		setOpenDialog(false);
	}

	function handleDelete() {
		setOpenDialog(false);
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		setOpenDialog(false);

		const _servicers = _.filter(servicers, item => item.devices.includes(routeParams.productId));
		let promises = [];

		promises.push(
			new Promise((resolve, reject) =>
				_servicers.map(async servicer => {
					await dispatch(sendMessage({ 
						...form, message: `An error was reported from the ${product.uid} - ${product.name} - ${product.location.address}. \n ${form.subject}`, 
						email: servicer.email, 
						phone: servicer.phone 
					}))
						.then(response => resolve(response))
						.catch(error => resolve(error));
				})
			)
		);

		Promise.all(promises).then(() => {		
			dispatch(showMessage({ message: 'Sent a message successfully', variant: 'success' }));
		});
	}

	function canBeSubmitted() {
		return form.subject.length > 0 && form.message.length > 0;
	}

	return (
		<div className="p-0">
			<IconButton onClick={handleOpenDialog}>
				<Icon style={{ color: green[0] }}>send</Icon>
			</IconButton>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
				classes={{
					paper: 'rounded-8'
				}}
			>
				<AppBar position="static">
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Send Message
						</Typography>
					</Toolbar>
				</AppBar>

				<form noValidate onSubmit={handleSubmit} className="flex flex-col">
					<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
						<TextField
							className="mt-8 mb-16"
							label="Subject"
							id="subject"
							name="subject"
							value={form.subject}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>

						<TextField
							className="mt-8 mb-16"
							id="message"
							name="message"
							onChange={handleChange}
							value={form.message}
							label="Message"
							type="text"
							multiline
							rows={5}
							variant="outlined"
							fullWidth
						/>
					</DialogContent>

					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted()}>
								Send
							</Button>
						</div>
						<IconButton onClick={handleDelete}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	);
}

export default MessageDialog;
