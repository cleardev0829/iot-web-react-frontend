/* eslint-disable */
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './store/productsSlice';
import { setMessagesSearchText } from './store/messagesSlice';
import reducer from './store';
import MessageTable from './message/MessageTable';
import MessageInfoDialog from './message/MessageInfoDialog';

const options = [
	{ id: 'last', value: 'last', label: 'Only last messages' },
	{ id: 'all', value: 'all', label: 'All messages' },
];

function Error() {
	const dispatch = useDispatch();
	const pageLayout = useRef(null);

	const searchText = useSelector(({ errorsApp }) => errorsApp.messages.searchText);
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
					content: 'flex'
				}}
				header={
					<div className="flex flex-wrap flex-1 items-center justify-between p-12 md:p-24">
						<div className="flex flex-row w-full sm:w-auto">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Icon className="text-32">error_outline</Icon>
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
									Errors
								</Typography>
							</FuseAnimate>
						</div>

						<div className="flex flex-1 items-center justify-center w-full sm:w-auto sm:px-12">
								<FuseAnimate animation="transition.slideDownIn" delay={300}>
									<FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
										<InputLabel htmlFor="category-label-placeholder"> Log </InputLabel>
										<Select
											value={searchText}
											onChange={ev => dispatch(setMessagesSearchText(ev))}
											input={
												<OutlinedInput
													labelWidth={'Log'.length * 9}
													name="category"
													id="category-label-placeholder"
												/>
											}											
										>											
											{options.map(option => (
												<MenuItem value={option.value} key={option.id}>
													{option.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</FuseAnimate>
							</div>

						<FuseAnimate animation="transition.slideRightIn" delay={300}>					
							<Button
								className="normal-case ml-8 sm:ml-0"
								variant="outlined"
								target="_blank"
								role="button"
								color="default"
								onClick={() => handleRefresh()}
							>
								<Icon>refresh</Icon>
								<span className="mx-4 hidden sm:flex">Refresh</span>
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
