import React, { Component } from "react";
import bottle from "../provider/Bottle";

export class Home extends Component {
  apiService = bottle.container.ApiService;
  baseUrl = window.location.origin;

  addPerson = async person =>
    await apiService.put(`${baseUrl}/api/secretsanta/add`, person);

  render() {
    return <div />;
  }
}
