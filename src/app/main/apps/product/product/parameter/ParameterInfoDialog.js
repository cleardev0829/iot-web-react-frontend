import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeParameterInfoDialog } from '../../store/dialogSlice';
import { MIN_ROW_HEIGHT, PARAMETERS } from 'app/utils/Globals';

let defaultFormState = {};
let dofileDownload = null;
let filename = '';
const defaultFileType = 'text';

function ParameterInfoDialog(props) {
	const dispatch = useDispatch();

	const parameterInfoDialog = useSelector(({ productApp }) => productApp.dialog.parameterInfoDialog);

	defaultFormState = _.isEmpty(parameterInfoDialog.data) ? {} : PARAMETERS[parameterInfoDialog.data.rootGroup];

	const { form, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		console.log(parameterInfoDialog.data);
		filename = parameterInfoDialog.data.group;
		setForm({ ...defaultFormState, ...parameterInfoDialog.data.params });
	}, [parameterInfoDialog.data, setForm]);

	const [state, setState] = useState({
		fileType: defaultFileType,
		fileDownloadUrl: null,
		status: '',
		data: []
	});

	useEffect(() => {
		if (parameterInfoDialog.props.open) {
			initDialog();
		}
	}, [parameterInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if (state.fileDownloadUrl) {
			dofileDownload.click();
			URL.revokeObjectURL(state.fileDownloadUrl); // free up storage--no longer needed.
			setState({ ...state, fileDownloadUrl: '' });
		}
	}, [state]);

	function closeComposeDialog() {
		return dispatch(closeParameterInfoDialog());
	}

	const download = event => {
		event.preventDefault();

		// Prepare the file
		let output;

		// Prepare data:
		output = '';
		Object.keys(form).map(key => (output += `${key}=${form[key]}\n`));

		// Download it
		const blob = new Blob([output]);
		const fileDownloadUrl = URL.createObjectURL(blob);
		setState({ ...state, fileDownloadUrl: fileDownloadUrl });
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...parameterInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Information
					</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent classes={{ root: 'p-24' }}>
				<Table>
					<TableBody>
						{Object.keys(form).map((key, n) => {
							return (
								<TableRow
									className={`h-${MIN_ROW_HEIGHT} cursor-pointer`}
									hover
									tabIndex={-1}
									key={`row-${key}`}
								>
									<TableCell key={`col-1-${key}`} className="p-4 md:p-16" component="th" scope="row">
										{key}
									</TableCell>

									<TableCell key={`col-2-${key}`} className="p-4 md:p-16 truncate" component="th" scope="row">
										{form[key]}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</DialogContent>

			<a className="hidden" download={filename} href={state.fileDownloadUrl} ref={e => (dofileDownload = e)}>
				download
			</a>

			<DialogActions className="justify-between p-8">
				<div className="px-16">
					<Button variant="contained" color="primary" startIcon={<CloudDownloadIcon />} onClick={download}>
						<span>Download</span>
					</Button>
				</div>
				<div className="px-16">
					<Button variant="contained" color="primary" onClick={closeComposeDialog}>
						Cancel
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default ParameterInfoDialog;
