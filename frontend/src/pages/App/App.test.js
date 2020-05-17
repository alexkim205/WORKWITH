import React from 'react';
import renderer from 'react-test-renderer';
import App from './index';

describe('<App/>', () => {
  it('snapshot renders', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
