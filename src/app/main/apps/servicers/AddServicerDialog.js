/* eslint-disable */

import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import _ from '@lodash';
import SelectBox from 'app/utils/components/SelectBox';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveServicer, updateServicer, closeServicerDialog } from './store/servicersSlice';
import { selectProducts } from './store/productsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { types } from 'app/utils/Globals';

const defaultFormState = {
	id: '',
	customerId: '',
	displayName: '',
	email: '',
	emailValidation: false,
	phone: '',
	role: 'service man',
	devices: [],
	type: 3
};

const sourceLists = [{ item: 'Admin', value: 'admin' }];

const sourceAdminLists = [
	{ item: 'Admin', value: 'admin' },
	{ item: 'Service Man', value: 'service man' },
	{ item: 'Servicer', value: 'servicer' }
];

function AddServicerDialog() {
	const dispatch = useDispatch();
	const addServicerDialog = useSelector(({ servicersApp }) => servicersApp.servicers.addServicerDialog);
	const authUser = useSelector(({ auth }) => auth.user);
	const devices = useSelector(selectProducts);
	const [lists, setLists] = useState(sourceAdminLists);
	const [labelMenuEl, setLabelMenuEl] = useState(null);

	useEffect(() => {
		if (authUser.role[0] === 'service man') {
			setLists(sourceLists);
		}
	}, [authUser]);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const handleChangeValue = data => {
		if (
			Object.keys(data)[0] === 'type' &&
			(Object.values(data)[0] === 0 || Object.values(data)[0] === 2) &&
			form.phone === ''
		) {
			console.log(form.phone);
			dispatch(showMessage({ message: 'Please enter phone number', variant: 'warning' }));
			return;
		}
		setForm({ ...form, ...data });
	};

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (addServicerDialog.type === 'edit' && addServicerDialog.data) {
			setForm({ ...addServicerDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (addServicerDialog.type === 'new') {
			setForm({
				...defaultFormState,
				id: FuseUtils.generateGUID(),
				customerId: authUser.uuid
			});
		}
	}, [addServicerDialog.data, addServicerDialog.type, authUser, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (addServicerDialog.props.open) {
			initDialog();
		}
	}, [addServicerDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return addServicerDialog.type === 'edit' ? dispatch(closeServicerDialog()) : dispatch(closeServicerDialog());
	}

	function canBeSubmitted() {
		return form.email.length > 0 && form.role.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (addServicerDialog.type === 'new') {
			dispatch(saveServicer({ ...form }));
		} else {
			dispatch(updateServicer({ ...form }));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		closeComposeDialog();
	}

	function handleLabelMenuClose(event) {
		setLabelMenuEl(null);
	}

	function handleToggleLabel(event, id) {
		event.stopPropagation();
		setForm(
			_.set({
				...form,
				devices: form.devices.includes(id)
					? form.devices.filter(labelId => labelId !== id)
					: [...form.devices, id]
			})
		);
	}

	function handleLabelMenuOpen(event) {
		setLabelMenuEl(event.currentTarget);
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...addServicerDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{addServicerDialog.type === 'new' ? 'New Servicer' : 'Edit Servicer'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<TextField
							className="mb-24"
							label="Name"
							autoFocus
							id="displayName"
							name="displayName"
							value={form.displayName}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								readOnly: addServicerDialog.type === 'new' ? false : true
							}}
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Phone"
							id="phone"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex mb-24">
						<SelectBox
							id="outlined-basic"
							label="Role"
							data={lists}
							variant="outlined"
							value={form.role}
							validation="role"
							handleChangeValue={handleChangeValue}
							willvalidation={false}
							size={100}
							readOnly={true}
						/>
					</div>

					<div className="flex mb-24">
						<SelectBox
							id="outlined-basic"
							label="Type"
							data={types}
							variant="outlined"
							value={form.type}
							validation="type"
							handleChangeValue={handleChangeValue}
							willvalidation={false}
							size={100}
							readOnly={false}
						/>
					</div>

					<div className="flex justify-end">
						<h3 className="self-center">Select Device:</h3>
						<IconButton
							aria-owns={labelMenuEl ? 'label-menu' : null}
							aria-haspopup="true"
							onClick={handleLabelMenuOpen}
						>
							<Icon>label</Icon>
						</IconButton>
						<Menu
							id="label-menu"
							anchorEl={labelMenuEl}
							open={Boolean(labelMenuEl)}
							onClose={handleLabelMenuClose}
						>
							{devices.length > 0 &&
								_.filter(devices, item => item.categories.includes(authUser.id)) &&
								_.filter(devices, item => item.categories.includes(authUser.id)).map(label => (
									<MenuItem onClick={ev => handleToggleLabel(ev, label.id)} key={label.id}>
										<ListItemIcon className="min-w-24">
											<Icon color="action">
												{form.devices.includes(label.id)
													? 'check_box'
													: 'check_box_outline_blank'}
											</Icon>
										</ListItemIcon>
										<ListItemText className="mx-8" primary={label.name} disableTypography />
										<ListItemIcon className="min-w-24">
											<Icon style={{ color: label.color }} color="action">
												label
											</Icon>
										</ListItemIcon>
									</MenuItem>
								))}
						</Menu>
					</div>
					<Divider className="mx-0" />

					<div className="flex">
						{form.devices.length > 0 && (
							<div className="flex flex-wrap w-full px-12 sm:px-0 mb-16">
								{form.devices.map(label => {
									if (!_.isEmpty(_.find(devices, { id: label }))) {
										return (
											<Chip
												label={_.find(devices, { id: label }).name}
												onDelete={ev => handleToggleLabel(ev, label)}
												className="mx-4 my-4"
												classes={{ label: 'px-8' }}
												key={label}
											/>
										);
									}
								})}
							</div>
						)}
					</div>
				</DialogContent>

				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							type="submit"
							disabled={!canBeSubmitted()}
						>
							Save
						</Button>
					</div>
					<div className="px-16">
						<Button variant="contained" color="primary" onClick={handleRemove}>
							Cancel
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default AddServicerDialog;
