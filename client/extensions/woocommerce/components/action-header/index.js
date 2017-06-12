/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import StickyPanel from 'components/sticky-panel';

const ActionHeader = ( { children } ) => {
	// TODO: Implement breadcrumbs component.

	return (
		<StickyPanel>
			<Card className="action-header__header">
				<span>Breadcrumbs &gt; go &gt; here</span>
				<div className="action-header__actions">
					{ children }
				</div>
			</Card>
		</StickyPanel>
	);
};

export default ActionHeader;
