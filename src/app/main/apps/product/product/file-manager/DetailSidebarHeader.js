import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import { deleteFile, downloadFile, getFiles, selectFileById } from '../../store/filesSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function DetailSidebarHeader(props) {
	const dispatch = useDispatch();
	const routeParams = useParams([]);
	const selectedItem = useSelector(state => selectFileById(state, state.productApp.files.selectedItemId));

	const onFileDelete = async () => {
		dispatch(
			openDialog({
				children: (
					<React.Fragment>
						<DialogTitle id="alert-dialog-title">Are you really delete?</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{`You will be lost ${selectedItem.name}`}.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => dispatch(closeDialog())} color="primary">
								Disagree
							</Button>
							<Button
								onClick={() =>
									dispatch(deleteFile(selectedItem)).then(() => {
										dispatch(getFiles(routeParams));
										dispatch(closeDialog());
									})
								}
								color="primary"
								autoFocus
							>
								Agree
							</Button>
						</DialogActions>
					</React.Fragment>
				)
			})
		);
	};

	const onFileDownload = () => {
		dispatch(downloadFile(selectedItem)).then(() => {
			dispatch(showMessage({ message: 'File Download succefully', variant: 'success' }));
		});
	};

	return (
		<div className="flex flex-col justify-between h-full p-4 sm:p-12">
			<div className="toolbar flex align-center justify-end">
				<FuseAnimate animation="transition.expandIn" delay={200}>
					<IconButton onClick={onFileDelete} disabled={!selectedItem}>
						<Icon>delete</Icon>
					</IconButton>
				</FuseAnimate>
				<FuseAnimate animation="transition.expandIn" delay={200}>
					<IconButton onClick={onFileDownload} disabled={!selectedItem}>
						<Icon>cloud_download</Icon>
					</IconButton>
				</FuseAnimate>
			</div>

			{selectedItem && (
				<div className="p-12">
					<FuseAnimate delay={200}>
						<Typography variant="subtitle1" className="mb-8">
							{selectedItem.name}
						</Typography>
					</FuseAnimate>
					<FuseAnimate delay={300}>
						<Typography variant="caption" className="">
							<span>Edited</span>
							<span>: {moment(selectedItem.modified).format('MMM M, YYYY')}</span>
						</Typography>
					</FuseAnimate>
				</div>
			)}
		</div>
	);
}

export default DetailSidebarHeader;
