/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { fetchPaymentMethods } from 'woocommerce/state/sites/payment-methods/actions';
import { getPaymentMethodsGroup } from 'woocommerce/state/ui/payments/methods/selectors';
import { getSelectedSiteWithFallback } from 'woocommerce/state/sites/selectors';
import List from 'woocommerce/components/list/list';
import ListHeader from 'woocommerce/components/list/list-header';
import ListItemField from 'woocommerce/components/list/list-item-field';
import PaymentMethodItem from './payment-method-item';

class SettingsPaymentsMethodList extends Component {
	static propTypes = {
		fetchPaymentMethods: PropTypes.func.isRequired,
		methodType: PropTypes.string.isRequired,
		paymentMethods: PropTypes.array.isRequired,
		site: PropTypes.object,
	};

	componentDidMount = () => {
		const { site } = this.props;

		if ( site && site.ID ) {
			this.props.fetchPaymentMethods( site.ID );
		}
	}

	componentWillReceiveProps = ( newProps ) => {
		const { site } = this.props;

		const newSiteId = newProps.site && newProps.site.ID || null;
		const oldSiteId = site && site.ID || null;

		if ( oldSiteId !== newSiteId ) {
			this.props.fetchPaymentMethods( newSiteId );
		}
	}

	renderMethodItem = ( method ) => {
		return (
			<PaymentMethodItem method={ method } key={ method.title } />
		);
	}

	render() {
		const { translate, methodType, paymentMethods } = this.props;

		return (
			<List>
				<ListHeader>
					<ListItemField className="payments__methods-column-method">
						{ translate( 'Method' ) }
					</ListItemField>
					{ methodType !== 'offline' && (
						<ListItemField className="payments__methods-column-fees">
							{ translate( 'Fees' ) }
						</ListItemField>
					) }
					<ListItemField className="payments__methods-column-settings">
					</ListItemField>
				</ListHeader>
				{ paymentMethods && paymentMethods.map( this.renderMethodItem ) }
			</List>
		);
	}
}

function mapStateToProps( state, ownProps ) {
	const paymentMethods = getPaymentMethodsGroup( state, ownProps.methodType );
	const site = getSelectedSiteWithFallback( state );
	return {
		paymentMethods,
		site,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchPaymentMethods,
		},
		dispatch
	);
}

export default localize(
	connect( mapStateToProps, mapDispatchToProps )( SettingsPaymentsMethodList )
);