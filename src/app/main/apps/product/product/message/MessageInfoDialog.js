import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeMessageInfoDialog } from '../../store/dialogSlice';
import { MIN_ROW_HEIGHT } from 'app/utils/Globals';

const defaultFormState = {
	ID: '',
	log: '',
	lcd: 0,
	state: 0,
	stop: 0,
	inLevel: 0,
	trips: 0
};

function MessageInfoDialog(props) {
	const dispatch = useDispatch();
	const messageInfoDialog = useSelector(({ productApp }) => productApp.dialog.messageInfoDialog);

	const { form, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		let tempForm = messageInfoDialog.data.message;
		if (tempForm.log === 'info') {
			tempForm = { ...tempForm, state: messageInfoDialog.data.description };
		} else if (tempForm.log === 'error') {
			tempForm = { ...tempForm, state: messageInfoDialog.data.errorDescription };
		}

		setForm({ ...defaultFormState, ...tempForm });
	}, [messageInfoDialog.data, setForm]);

	useEffect(() => {
		if (messageInfoDialog.props.open) {
			initDialog();
		}
	}, [messageInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return dispatch(closeMessageInfoDialog());
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...messageInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{messageInfoDialog.data && messageInfoDialog.data.description}
					</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent classes={{ root: 'p-24' }}>
				<Table>
					<TableBody>
						{Object.keys(form)
							.splice(0, 3)
							.map((key, n) => {
								return (
									<TableRow
										className={`h-${MIN_ROW_HEIGHT} cursor-pointer`}
										hover
										tabIndex={-1}
										key={`row-${key}-up`}
									>
										<TableCell
											key={`col-${n}-key-up`}
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="left"
										>
											{key}
										</TableCell>

										<TableCell
											key={`col-${n}-key-up`}
											className="p-4 md:p-16 truncate"
											component="th"
											scope="row"
											align="right"
										>
											{form[key]}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				<Divider className="card-divider w-full" />
				<Table>
					<TableHead>
						<TableRow className={`h-${MIN_ROW_HEIGHT}`}>
							<TableCell className="p-4 md:p-16 font-black" align="left">
								Key
							</TableCell>
							<TableCell className="p-4 md:p-16 font-black" align="right">
								Value
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(form)
							.splice(3, Object.keys(form).length - 1)
							.map((key, n) => {
								return (
									<TableRow
										className={`h-${MIN_ROW_HEIGHT} cursor-pointer`}
										hover
										tabIndex={-1}
										key={`row-${n}-under`}
									>
										<TableCell
											key={`col-${n}-key-under`}
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="left"
										>
											{key}
										</TableCell>

										<TableCell
											key={`col-${n}-value-under`}
											className="p-4 md:p-16 truncate"
											component="th"
											scope="row"
											align="right"
										>
											{form[key]}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</DialogContent>

			<DialogActions className="justify-end p-8">
				<div className="px-16">
					<Button variant="contained" color="primary" onClick={closeComposeDialog}>
						Cancel
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default MessageInfoDialog;
