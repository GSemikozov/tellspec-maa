import React from 'react';

import { Layout } from '@widgets/layout';
import { NavTiles } from '@widgets/nav-tiles';

import './home-page.css';

export const HomePage: React.FunctionComponent = () => {
    return (
        <Layout>
            <NavTiles />
        </Layout>
    );
};
