// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import Router from 'next/router';

// Workaround for "No router instance found. You should only use "next/router" inside the client side of your app."
Router.router = {
  prefetch: () => {},
};

import Article from '../rss-a-sitemap-jednoduse-a-rychle';

it('renders correctly', () => {
  expect(renderer.create(<Article />).toJSON()).toMatchSnapshot();
});
