// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import Router from 'next/router';

// Workaround for "No router instance found. You should only use "next/router" inside the client side of your app."
Router.router = {
  prefetch: () => {},
};

import Article from '../fluent-interface-a-pcre';

it('renders correctly', () => {
  expect(renderer.create(<Article />).toJSON()).toMatchSnapshot();
});
