import FuseAnimate from '@fuse/core/FuseAnimate';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getFiles, selectFileById, uploadFile } from '../../store/filesSlice';
import { isStorageConfigured } from '../../../../../utils/azure-storage-blob';

const storageConfigured = isStorageConfigured();

const useStyles = makeStyles({
	table: {
		'& th': {
			padding: '16px 0'
		}
	},
	typeIcon: {
		'&.folder:before': {
			content: "'folder'",
			color: '#FFB300'
		},
		'&.document:before': {
			content: "'insert_drive_file'",
			color: '#1565C0'
		},
		'&.spreadsheet:before': {
			content: "'insert_chart'",
			color: '#4CAF50'
		}
	}
});

function DetailSidebarContent(props) {
	const dispatch = useDispatch();
	const routeParams = useParams([]);
	const classes = useStyles();

	const selectedItem = useSelector(state => selectFileById(state, state.productApp.files.selectedItemId));

	// current file to upload into container
	const [fileSelected, setFileSelected] = useState(null);

	// UI/form management
	const [uploading, setUploading] = useState(false);
	const [inputKey, setInputKey] = useState(Math.random().toString(36));

	const onFileChange = event => {
		// capture file into state
		setFileSelected(event.target.files[0]);
	};

	const onFileUpload = async () => {
		// prepare UI
		setUploading(true);

		// *** UPLOAD TO AZURE STORAGE ***
		dispatch(uploadFile({ file: fileSelected, lift: routeParams })).then(() => {
			// prepare UI for results
			dispatch(getFiles(routeParams));
			// reset state/form
			setFileSelected(null);
			setUploading(false);
			setInputKey(Math.random().toString(36));
		});
	};

	// display form
	const DisplayForm = () => (
		<div className="my-12">
			<input type="file" onChange={onFileChange} key={inputKey || ''} />
			<Button
				className="mt-24 mb-12"
				variant="contained"
				color="primary"
				startIcon={<CloudUploadIcon />}
				component="span"
				onClick={onFileUpload}
				disabled={!fileSelected}
			>
				Upload
			</Button>
		</div>
	);

	// if (!selectedItem) {
	// 	return null;
	// }

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={200}>
			<div className="file-details p-16 sm:p-24">
				<div>
					<Typography variant="subtitle2">Upload file to Azure Storage</Typography>
					{storageConfigured && !uploading && DisplayForm()}
					{storageConfigured && uploading && (
						<Typography className="my-12" variant="subtitle1">
							uploading...
						</Typography>
					)}
					<hr />
					{/* {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()} */}
					{!storageConfigured && <div className="mt-12">Storage is not configured.</div>}
				</div>

				<Typography variant="subtitle1" className="py-16">
					Info
				</Typography>

				{selectedItem && (
					<table className={clsx(classes.table, 'w-full text-justify')}>
						<tbody>
							{/* <tr className="type">
								<th>Type</th>
								<td>{selectedItem.contentType}</td>
							</tr> */}

							<tr className="size">
								<th>Size</th>
								<td>
									{selectedItem.size === ''
										? '-'
										: `${selectedItem.size / 1000} KiB`}
								</td>
							</tr>

							{/* <tr className="modified">
								<th>Modified</th>
								<td>{moment(selectedItem.lastModified).format('MMM M, YYYY')}</td>
							</tr>

							<tr className="opened">
								<th>Opened</th>
								<td>{moment(selectedItem.lastAccessOn).format('MMM M, YYYY')}</td>
							</tr>

							<tr className="created">
								<th>Created</th>
								<td>{moment(selectedItem.createdOn).format('MMM M, YYYY')}</td>
							</tr> */}
						</tbody>
					</table>
				)}
			</div>
		</FuseAnimate>
	);
}

export default DetailSidebarContent;
