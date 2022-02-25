import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseAnimate from '@fuse/core/FuseAnimate/FuseAnimate';
import { openMessageInfoDialog } from '../store/dialogSlice';
import { getMessages, selectMessages } from '../store/messagesSlice';
import { selectProducts } from '../store/productsSlice';
import MessageTableHead from './MessageTableHead';
import { diff } from 'app/utils/Functions';
import { ROW_HEIGHT, ROWS_PER_PAGE_50 } from 'app/utils/Globals';

function Component(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const messages = useSelector(selectMessages);
	const products = useSelector(selectProducts);
	const searchText = useSelector(({ errorsApp }) => errorsApp.messages.searchText);
	const user = useSelector(({ auth }) => auth.user);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(searchText === 'last' ? 1000 : ROWS_PER_PAGE_50);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		setPage(0);
	}, [searchText, props.counter]);

	useEffect(() => {
		setLoading(true);

		dispatch(
			getMessages({
				limit: searchText === 'last' ? 1000 : 50,
				skip: 0,
				log: 'error',
				searchText
			})
		).then(() => setLoading(false));
	}, [dispatch, searchText, page, rowsPerPage, props.counter]);

	useEffect(() => {
		let _messages = [];
		const productUIDs = _.map(products, 'uid');

		if (user.role === 'admin') _messages = [...messages];
		else _messages = _.filter(messages, item => productUIDs.includes(item.message.ID.toString()));

		setData(_.orderBy(_messages, ['timestamp'], ['desc']));
	}, [products, messages, user]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There are no messages!
					</Typography>
				</div>
			</FuseAnimate>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="" aria-labelledby="tableTitle">
					<MessageTableHead order={order} onRequestSort={handleRequestSort} rowCount={data.length} />

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n, i) => {
								return (
									<TableRow
										className={`h-${ROW_HEIGHT} cursor-pointer`}
										hover
										tabIndex={-1}
										key={n.id}
										
									>
										<TableCell className="p-4 md:p-16" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{i + 1}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{n.message.ID}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{diff(moment(), n.timestamp)}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{n.log}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{n.number}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={() => dispatch(openMessageInfoDialog(n))}>
											{n.description}
										</TableCell>

										<TableCell
											className="w-52 px-4 md:px-16 truncate"
											component="th"
											scope="row"
											align="center"
											padding="none"
										>
											<IconButton
													onClick={() => history.push(`/apps/product/products/${n.lift}/${n.message.ID}`)}
												>													
														<Icon>navigate_next</Icon>																									
												</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default Component;
