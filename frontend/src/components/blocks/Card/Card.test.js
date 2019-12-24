import React from "react";
import renderer from "react-test-renderer";
import Card from "./index";

describe("<Card />", () => {
  it("shapshot renders", () => {
    const component = renderer.create(<Card />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
