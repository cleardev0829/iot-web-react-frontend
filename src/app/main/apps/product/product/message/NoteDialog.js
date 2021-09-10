import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNote, addNote, closeNewNoteDialog, closeEditNoteDialog, updateNote } from '../../store/noteSlice';
import FormUploadFile from './FormUploadFile';

const defaultFormState = {
	id: '',
	title: '',
	note: '',
	messageId: '',
	fileObjs: [],
	files: [],
	urls: []
};

function NoteDialog(props) {
	const dispatch = useDispatch();
	const noteDialog = useSelector(({ productApp }) => productApp.notes.noteDialog);

	const { form, handleChange, setForm } = useForm({ ...defaultFormState });

	const initDialog = useCallback(() => {
		console.log(noteDialog.data);
		/**
		 * Dialog type: 'edit'
		 */
		if (noteDialog.type === 'edit' && noteDialog.data) {
			setForm({ ...noteDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (noteDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...noteDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [noteDialog.data, noteDialog.type, setForm]);

	function closeNoteDialog() {
		return noteDialog.type === 'edit' ? dispatch(closeEditNoteDialog()) : dispatch(closeNewNoteDialog());
	}

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (noteDialog.props.open) {
			initDialog();
		}
	}, [noteDialog.props.open, initDialog]);

	function closeNoteDialog() {
		return noteDialog.type === 'edit' ? dispatch(closeEditNoteDialog()) : dispatch(closeNewNoteDialog());
	}

	function handleUploadChange(e) {
		const file = e.target.files[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.readAsBinaryString(file);

		reader.onload = () => {
			let _fileObjs = form.fileObjs;
			let _files = form.files;

			_fileObjs.push(`data:${file.type};base64,${btoa(reader.result)}`);
			_files.push(file);

			setForm(_.setIn(form, `fileObjs`, _fileObjs));
			setForm(_.setIn(form, `files`, _files));
		};

		reader.onerror = () => {
			console.log('error on load file');
		};
	}

	function handleRemoveFile() {
		setForm(_.setIn(form, `fileObjs`, form.fileObjs.splice(form.fileObjs.length - 1, 1)));
		setForm(_.setIn(form, `files`, form.files.splice(-1, 1)));
	}

	function canBeSubmitted() {
		return form.title.length > 0;
	}

	return (
		<Dialog
			{...noteDialog.props}
			onClose={closeNoteDialog}
			fullWidth
			maxWidth="sm"
			classes={{
				paper: 'rounded-8'
			}}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{noteDialog.type === 'new' ? 'New Note' : 'Edit Note'}
					</Typography>
				</Toolbar>
			</AppBar>

			<DialogContent classes={{ root: 'p-0 mt-12' }}>
				<div className="px-16 sm:px-24">
					<FormControl className="mt-8 mb-16" required fullWidth>
						<TextField
							label="Title"
							autoFocus
							name="title"
							value={form.title}
							onChange={handleChange}
							required
							variant="outlined"
						/>
					</FormControl>

					<FormControl className="mt-8 mb-16" required fullWidth>
						<TextField
							label="Notes"
							name="notes"
							multiline
							rows="6"
							value={form.notes}
							onChange={handleChange}
							variant="outlined"
						/>
					</FormControl>

					{noteDialog.type === 'new' && form.fileObjs && form.fileObjs.length > 0 && (
						<FormControl className="mt-8 mb-16" required fullWidth>
							<div className="relative">
								<div className="flex flex-row items-center">
									{form.fileObjs.map((fileObj, index) => (
										<img
											key={index}
											src={fileObj}
											className="w-52 h-52 mr-8 block rounded"
											alt="note"
										/>
									))}
								</div>

								<Fab
									className="absolute right-0 bottom-0 m-8"
									variant="extended"
									size="small"
									color="secondary"
									aria-label="Delete File"
									onClick={handleRemoveFile}
								>
									<Icon fontSize="small">delete</Icon>
								</Fab>
							</div>
						</FormControl>
					)}

					{noteDialog.type === 'edit' && form.urls && form.urls.length > 0 && (
						<FormControl className="mt-8 mb-16" required fullWidth>
							<div className="relative">
								<div className="flex flex-row items-center">
									{form.urls.map((url, index) => (
										<img
											key={index}
											src={url}
											className="w-52 h-52 mr-8 block rounded"
											alt="note"
										/>
									))}
								</div>

								<Fab
									className="absolute right-0 bottom-0 m-8"
									variant="extended"
									size="small"
									color="secondary"
									aria-label="Delete File"
									onClick={handleRemoveFile}
								>
									<Icon fontSize="small">delete</Icon>
								</Fab>
							</div>
						</FormControl>
					)}

					{/* <FormControl className="mt-8 mb-16" required fullWidth>
						<Tooltip title="Add file" placement="bottom">
							<div>
								<FormUploadFile onChange={handleUploadChange} />
							</div>
						</Tooltip>
					</FormControl> */}
				</div>
			</DialogContent>

			{noteDialog.type === 'new' ? (
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								dispatch(addNote({ ...form, isNotes: true })).then(() => {
									closeNoteDialog();
								});
							}}
							disabled={!canBeSubmitted()}
						>
							Add
						</Button>
					</div>
				</DialogActions>
			) : (
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								dispatch(updateNote({ ...form, isNote: true })).then(() => {
									closeNoteDialog();
								});
							}}
							disabled={!canBeSubmitted()}
						>
							Save
						</Button>
					</div>
					<IconButton
						className="min-w-auto"
						onClick={() => {
							dispatch(
								removeNote({
									isNotes: false,
									messageId: form.messageId,
									title: '',
									notes: '',
									urls: []
								})
							).then(() => {
								closeNoteDialog();
							});
						}}
					>
						<Icon>delete</Icon>
					</IconButton>
				</DialogActions>
			)}
		</Dialog>
	);
}

export default NoteDialog;
