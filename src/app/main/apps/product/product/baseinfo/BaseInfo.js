/* eslint-disable */
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import { useForm, useDeepCompareEffect } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import _ from '@lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetProduct, newProduct, getProduct } from '../../store/productSlice';
import { getUsers, selectUsers } from '../../store/usersSlice';
import ReactPlaceAutoComplete from './ReactPlaceAutoComplete';
import Map from './Map';

function Component(props) {
	const dispatch = useDispatch();
	const routeParams = useParams([]);

	const role = useSelector(({ auth }) => auth.user.role);
	const product = useSelector(({ productApp }) => productApp.product);
	const users = useSelector(selectUsers);

	const [noProduct, setNoProduct] = useState(false);
	const { form, handleChange, setForm } = useForm(null);	

	useDeepCompareEffect(() => {
		function updateProductState() {
			const { productId } = routeParams;

			dispatch(getUsers());

			if (productId === 'new') {
				dispatch(newProduct());
			} else {
				dispatch(getProduct(routeParams)).then(action => {
					if (!action.payload) {
						setNoProduct(true);
					}
				});
			}
		}

		updateProductState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if ((product && !form) || (product && form && product.id !== form.id)) {
			setForm(product);
			props.setForm(product);
		}
	}, [form, product, setForm]);

	useEffect(() => {
		return () => {
			dispatch(resetProduct());
			setNoProduct(false);
		};
	}, [dispatch]);

	function handleChipChange(value, name) {
		setForm(
			_.set(
				{ ...form },
				name,
				value.map(item => item.id)
			)
		);
		props.setForm(
			_.set(
				{ ...form },
				name,
				value.map(item => item.id)
			)
		);
	}

	const onChange = event => {
		handleChange(event);
		props.setForm({
			...form,
			[event.target.name]: event.target.value
		})
	};

	const _onGoogleApiLoaded = data => {
		console.log(data);
	};

	const _onClick = async location => {
		console.log('Selected address', location);
		setForm({ ...form, location: { ...location } });
		props.setForm({ ...form, location: { ...location } });
	};

	const _onComplete = location => {
		console.log('Location', location);
		setForm({ ...form, location });
		props.setForm({ ...form, location });
	};	

	if (noProduct) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-col flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There is no such Lift!
					</Typography>
					<Button
						className="normal-case mt-24"
						component={Link}
						variant="outlined"
						to="/apps/product/products"
						color="inherit"
					>
						Go to Lifts Page
					</Button>
				</div>
			</FuseAnimate>
		);
	}

	if ((!product || (product && routeParams.productId !== product.id)) && routeParams.productId !== 'new') {
		return <FuseLoading />;
	}

	return (
		form && (
			<div className="flex w-full h-full flex-row">
				<div className="p-16 sm:p-24 max-w-2xl">
					<div>
						<TextField
							className="mt-8 mb-16"
							error={form.uid === ''}
							required
							label="ID"
							autoFocus
							id="id"
							name="id"
							value={form.uid}
							onChange={onChange}
							variant="outlined"
							fullWidth
							inputProps={{
								readOnly: role !== 'admin'
							}}
							disabled={role !== 'admin'}
						/>

						<TextField
							className="mt-8 mb-16"
							error={form.name === ''}
							required
							label="Name"
							id="name"
							name="name"
							value={form.name}
							onChange={onChange}
							variant="outlined"
							fullWidth
							inputProps={{
								readOnly: role !== 'admin'
							}}
						/>

						{role === 'admin' && (
							<FuseChipSelect
								className="mt-8 mb-24"
								value={form.categories.map(item => {
									if (!_.isEmpty(_.find(users, { id: item }))) {
										return {
											id: item,
											value: _.find(users, { id: item }).label,
											label: _.find(users, { id: item }).label
										};
									}
								})}
								onChange={value => handleChipChange(value, 'categories')}
								placeholder="Select multiple Users"
								textFieldProps={{
									label: 'Users',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={users}
								isMulti
							/>
						)}

						<ReactPlaceAutoComplete
							className="mt-8 mb-16"
							error={_.isEmpty(form.location)}
							required
							label="Address"
							id="location"
							name="location"
							value={!_.isEmpty(form.location) ? form.location.address : ''}
							onChange={onChange}
							variant="outlined"
							inputProps={{
								readOnly: role !== 'admin'
							}}
							onComplete={_onComplete}
						/>
					</div>
				</div>

				<div className="flex flex-1 flex-col my-8 min-w-0">
					<motion.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							show: { opacity: 1, y: 0 }
						}}
						className="widget w-full h-full p-16"
					>
						<Map location={form.location} onGoogleApiLoaded={_onGoogleApiLoaded} onClick={_onClick} />
					</motion.div>
				</div>
			</div>
		)
	);
}

export default Component;
