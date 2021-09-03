/* eslint-disable */
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { saveProduct, updateProduct } from '../store/productSlice';
import { setMessagesSearchText } from '../store/messagesSlice';
import MessageTable from './message/MessageTable';
import ParameterTable from './parameter/ParameterTable';
import Stats from './stats/Stats';
import FileList from './file-manager/FileList';
import DetailSidebarHeader from './file-manager/DetailSidebarHeader';
import DetailSidebarContent from './file-manager/DetailSidebarContent';
import MessageInfoDialog from './message/MessageInfoDialog';
import ParameterInfoDialog from './parameter/ParameterInfoDialog';
import reducer from '../store';
import BaseInfo from './baseinfo/BaseInfo';

const logs = [
	{ id: 'All', value: 'All', label: 'All' },
	{ id: 'alarm', value: 'alarm', label: 'alarm' },
	{ id: 'info', value: 'info', label: 'info' },
	{ id: 'error', value: 'error', label: 'error' }
];

function Product() {
	const dispatch = useDispatch();
	const routeParams = useParams([]);
	const history = useHistory();
	const pageLayout = useRef(null);

	const role = useSelector(({ auth }) => auth.user.role);
	const product = useSelector(({ productApp }) => productApp.product);
	const searchText = useSelector(({ productApp }) => productApp.messages.searchText);
	const theme = useTheme();

	const [tabValue, setTabValue] = useState(1);
	const [count, setCount] = useState(0);
	const [form, setForm] = useState({});

	useEffect(() => {
		const { productId } = routeParams;
		if (productId === 'new') {
			setTabValue(3);
		}
	}, [routeParams]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	const handleRefresh = () => {
		setCount(count + 1);
	};

	function canBeSubmitted() {
		return !_.isEmpty(form) && form.name.length > 0 && !_.isEmpty(form.location) && !_.isEqual(product, form);
	}

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
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/product/products"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Lifts</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form && form.name ? `${form.name} - ${form.uid}` : 'New Lift'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Lift Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						{tabValue === 1 && (
							<div className="flex flex-1 items-center justify-center px-12">
								<FuseAnimate animation="transition.slideDownIn" delay={300}>
									<FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
										<InputLabel htmlFor="category-label-placeholder"> Log </InputLabel>
										<Select
											value={tabValue === 2 ? 'para' : searchText}
											onChange={ev => dispatch(setMessagesSearchText(ev))}
											input={
												<OutlinedInput
													labelWidth={'Log'.length * 9}
													name="category"
													id="category-label-placeholder"
												/>
											}
											inputProps={{
												readOnly: tabValue === 2 && true,
												disabled: tabValue === 2 && true
											}}
										>
											<MenuItem value="all">
												<em> All </em>
											</MenuItem>
											{logs.map(log => (
												<MenuItem value={log.value} key={log.id}>
													{log.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</FuseAnimate>
							</div>
						)}
						{role === 'admin' && tabValue === 3 && (
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-nowrap normal-case"
									variant="contained"
									color="secondary"
									disabled={!canBeSubmitted()}
									onClick={() =>
										routeParams.productId === 'new'
											? dispatch(saveProduct({ form })).then(() => {
													history.goBack();
											  })
											: dispatch(updateProduct({ form, routeParams }))
									}
								>
									Save
								</Button>
							</FuseAnimate>
						)}
						{(tabValue === 0 || tabValue === 1 || tabValue === 2) && (
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
						)}
					</div>
				}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64 normal-case" label="Stats" />
						<Tab className="h-64 normal-case" label="Message" />
						<Tab className="h-64 normal-case" label="Parameter" />
						<Tab className="h-64 normal-case" label="Basic Info" />
						<Tab className="h-64 normal-case" label="Files" />
						<Tab className="h-64 normal-case" label="Echtzeit" />
						<Tab className="h-64 normal-case" label="Monteure" />
					</Tabs>
				}
				content={
					<>
						{tabValue === 0 && <Stats />}
						{tabValue === 1 && <MessageTable counter={count} />}
						{tabValue === 2 && <ParameterTable />}
						{tabValue === 3 && (
							<BaseInfo
								setForm={form => {
									setForm(form);
								}}
							/>
						)}
						{tabValue === 4 && <FileList pageLayout={pageLayout} />}
						{tabValue === 5 && <div></div>}
						{tabValue === 6 && <div></div>}
					</>
				}
				leftSidebarVariant="temporary"
				rightSidebarHeader={tabValue === 4 && <DetailSidebarHeader />}
				rightSidebarContent={tabValue === 4 && <DetailSidebarContent />}
				ref={pageLayout}
				innerScroll
			/>
			<MessageInfoDialog />
			<ParameterInfoDialog />
		</>
	);
}

export default withReducer('productApp', reducer)(Product);
