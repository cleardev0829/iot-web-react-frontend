import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const rows = [		
	{
		id: '',
		align: 'left',
		disablePadding: false,
		label: '',
		sort: true
	},
	{
		id: 'deviceId',
		align: 'left',
		disablePadding: false,
		label: 'Device ID',
		sort: true
	},
	{
		id: 'timestamp',
		align: 'left',
		disablePadding: false,
		label: 'Time',
		sort: true
	},
	{
		id: 'log',
		align: 'left',
		disablePadding: false,
		label: 'Log',
		sort: true
	},
	{
		id: 'number',
		align: 'left',
		disablePadding: false,
		label: 'Number',
		sort: true
	},
	{
		id: 'description',
		align: 'left',
		disablePadding: false,
		label: 'Description',
		sort: true
	},	
];

function MessageTableHead(props) {

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-64">				
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.order.id === row.id}
										direction={props.order.direction}
										onClick={createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default MessageTableHead;