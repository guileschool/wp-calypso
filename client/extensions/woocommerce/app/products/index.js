/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ActionHeader from 'woocommerce/components/action-header';
import Button from 'components/button';
import EmptyContent from 'components/empty-content';
import { fetchProducts } from 'woocommerce/state/sites/products/actions';
import { getLink } from 'woocommerce/lib/nav-utils';
import { getTotalProducts, areProductsLoaded } from 'woocommerce/state/sites/products/selectors';
import { getProductListCurrentPage, getProductListProducts, getProductListRequestedPage } from 'woocommerce/state/ui/products/selectors';
import { getSelectedSiteWithFallback } from 'woocommerce/state/sites/selectors';
import Main from 'components/main';
import Pagination from 'my-sites/stats/pagination';
import ProductsListRow from './products-list-row';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import Table from 'woocommerce/components/table';
import TableRow from 'woocommerce/components/table/table-row';
import TableItem from 'woocommerce/components/table/table-item';

class Products extends Component {
	static propTypes = {
	};

	componentDidMount() {
		const { site } = this.props;

		if ( site && site.ID ) {
			this.props.fetchProducts( site.ID, 1 );
		}
	}

	componentWillReceiveProps( newProps ) {
		const { site } = this.props;

		const newSiteId = newProps.site && newProps.site.ID || null;
		const oldSiteId = site && site.ID || null;

		if ( oldSiteId !== newSiteId ) {
			this.props.fetchProducts( newSiteId, 1 );
		}
	}

	switchPage = ( page ) => {
		const { site } = this.props;
		this.props.fetchProducts( site.ID, page );
	}

	pagination() {
		const { site, currentPage, totalProducts, currentPageLoaded, requestedPage } = this.props;

		if ( ! site || ! currentPageLoaded ) {
			return ( <div className="products__list-placeholder pagination"></div> );
		}

		const page = requestedPage || currentPage;
		return (
			<Pagination
				page={ page }
				perPage={ 10 }
				total={ totalProducts }
				pageClick={ this.switchPage }
			/>
		);
	}

	renderList() {
		const { site, translate, products, totalProducts, currentPageLoaded, requestedPageLoaded, requestedPage } = this.props;

		if ( currentPageLoaded === true && totalProducts === 0 ) {
			const emptyContentAction = (
				<Button href={ getLink( '/store/product/:site/', site ) }>
					{ translate( 'Add a product' ) }
				</Button>
			);
			return <EmptyContent
					title={ translate( 'You don\'t have any products.' ) }
					action={ emptyContentAction }
			/>;
		}

		let isRequesting = false;
		if ( requestedPage && ! requestedPageLoaded ) {
			isRequesting = true;
		} else if ( ! products ) {
			isRequesting = true;
		}

		const headings = (
			<TableRow isHeader className={ classNames( { 'products__list-placeholder': ! products } ) }>
				{ [ translate( 'Product' ), translate( 'Stock' ), translate( 'Category' ) ].map( ( item, i ) =>
					<TableItem isHeader key={ i } isTitle={ 0 === i }>{ item }</TableItem>
				) }
			</TableRow>
		);

		return (
			<div className="products__list-wrapper">
				{ this.pagination() }

				<Table header={ headings } className={ classNames( { 'is-requesting': isRequesting } ) }>
					{ products && products.map( ( product, i ) => (
						<ProductsListRow
							key={ i }
							site={ site }
							product={ product }
						/>
					) ) }
				</Table>

				{ ! products && ( <div className="products__list-placeholder"></div> ) }

				{ this.pagination() }
			</div>
		);
	}

	render() {
		const { className, site, translate } = this.props;
		const classes = classNames( 'products__list', className );
		return (
			<Main className={ classes }>
				<SidebarNavigation />
				<ActionHeader>
					<Button href={ getLink( '/store/product/:site/', site ) }>
						{ translate( 'Add new product' ) }
					</Button>
				</ActionHeader>
				{ this.renderList() }
			</Main>
		);
	}
}

function mapStateToProps( state ) {
	const site = getSelectedSiteWithFallback( state );
	const currentPage = site && getProductListCurrentPage( state, site.ID );
	const currentPageLoaded = site && currentPage && areProductsLoaded( state, currentPage, site.ID );
	const requestedPage = site && getProductListRequestedPage( state, site.ID );
	const requestedPageLoaded = site && requestedPage && areProductsLoaded( state, requestedPage, site.ID );
	const products = site && getProductListProducts( state, site.ID );
	const totalProducts = site && getTotalProducts( state, site.ID );
	return {
		site,
		currentPage,
		currentPageLoaded,
		requestedPage,
		requestedPageLoaded,
		products,
		totalProducts,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchProducts,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( Products ) );
