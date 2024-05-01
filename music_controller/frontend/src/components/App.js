import React, { Component, createRoot } from "react";
import { createRoot as createRootDOM } from "react-dom/client";
import HomePage from "./HomePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center">
        <HomePage />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
createRootDOM(appDiv).render(<App />);
