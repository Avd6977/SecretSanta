import React, { Component } from "react";
import { Route } from "react-router";
import { Home } from "./components/Home";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
      </div>
    );
  }
}
