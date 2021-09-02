import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React from 'react';
import reducer from './store';
import ServicersHeader from './ServicersHeader';
import ServicersTable from './ServicersTable';
import AddServicerDialog from './AddServicerDialog'
import ServicerProfileDialog from './ServicerProfileDialog'

function Servicers() {
	return (
		<>
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ServicersHeader />}
			content={<ServicersTable />}
			innerScroll
		/>
		<AddServicerDialog />
		<ServicerProfileDialog />
		</>
	);
}

export default withReducer('servicersApp', reducer)(Servicers);
