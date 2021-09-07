/* eslint-disable */
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from './store/productsSlice';
import reducer from './store';
import MessageTable from './message/MessageTable';
import MessageInfoDialog from './message/MessageInfoDialog';

function Error() {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);

	const user = useSelector(({ auth }) => auth.user);
	const [count, setCount] = useState(0);

	useEffect(() => {
		dispatch(getProducts({ userId: user.id }));
	}, [dispatch]);

	const handleRefresh = () => {
		setCount(count + 1);
	};

	return (
		<>
			<FusePageSimple
				classes={{
					root: 'bg-red',
					header: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					sidebarHeader: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
					rightSidebar: 'w-320'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between p-8 sm:p-12">
						<div className="flex items-center max-w-full">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Icon className="text-32">error_outline</Icon>
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
									Errors
								</Typography>
							</FuseAnimate>
						</div>

						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-nowrap normal-case"
								variant="contained"
								color="secondary"
								onClick={() => handleRefresh()}
							>
								Refresh
							</Button>
						</FuseAnimate>
					</div>
				}
				content={<MessageTable counter={count} />}
				ref={pageLayout}
				innerScroll
			/>
			<MessageInfoDialog />
		</>
	);
}

export default withReducer('errorsApp', reducer)(Error);
