/**
 * External dependencies
 */
import { createReducer } from 'state/utils';

/**
 * Internal dependencies
 */
import {
	WOOCOMMERCE_PRODUCTS_REQUEST,
	WOOCOMMERCE_PRODUCTS_REQUEST_SUCCESS,
} from 'woocommerce/state/action-types';

export default createReducer( null, {
	[ WOOCOMMERCE_PRODUCTS_REQUEST ]: productRequest,
	[ WOOCOMMERCE_PRODUCTS_REQUEST_SUCCESS ]: productRequestSuccess,
} );

function productRequestSuccess( state, action ) {
	const prevState = state || {};
	const { page, products } = action;
	const productIds = products.map( ( p ) => {
		return p.id;
	} );
	return { ...prevState,
		currentPage: page,
		productIds,
		requestedPage: null,
	};
}

function productRequest( state, action ) {
	const prevState = state || {};
	const { page } = action;
	return { ...prevState,
		requestedPage: page,
	};
}
