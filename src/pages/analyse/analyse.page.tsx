import React from 'react';

import { Layout } from '@widgets/layout';
import { AnalyseMilkWidget } from '@widgets/analyse-milk-widget';

export const AnalysePage: React.FunctionComponent = () => {
    return (
        <Layout title='Analyse Milk'>
            <AnalyseMilkWidget />
        </Layout>
    );
};
