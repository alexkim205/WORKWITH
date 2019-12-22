import React from "react";
import { shallow } from "enzyme";
import App from "./index";

test("renders Hello World", () => {
  const app = shallow(<App />);
  expect(app.text()).toEqual("Hello World!");
});
