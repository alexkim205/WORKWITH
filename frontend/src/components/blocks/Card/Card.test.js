import React from "react";
import { shallow } from "enzyme";
import Card from "./index.js";

describe("Card", () => {
  it("should render Card component", () => {
    const wrapper = shallow(<Card />);
  });
});
