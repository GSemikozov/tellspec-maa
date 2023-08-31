import React from 'react';
import { Layout } from '../../widgets/layout';
import { NavTiles } from '../../widgets/nav-tiles';

import './home-page.css';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <NavTiles />
    </Layout>
  );
};
