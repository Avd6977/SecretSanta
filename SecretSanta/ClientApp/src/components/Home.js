import { Button, Grid, Input, InputLabel, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { bottle } from "../provider/Bottle";
import { ImportParticipants } from "./ImportParticipants";

export class Home extends Component {
  apiService = bottle.container.ApiService;
  importService = bottle.container.ParticipantImportService;
  state = {
    participants: [],
    results: {}
  };

  async componentDidMount() {
    await this.load();
  }

  load = async () => {
    const participants = await this.apiService.get("/secretsanta/participants");
    const banned =
      JSON.stringify(await this.apiService.get("/secretsanta/banned")) || "";
    this.setState({ banned, participants, firstName: "", lastName: "" });
  };

  addPerson = async () => {
    const person = {
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };
    await this.apiService.put(`/secretsanta/add`, person);
    await this.load();
  };

  removePerson = async index => {
    await this.apiService.delete(`/secretsanta/remove/${index}`);
    await this.load();
  };

  generateResults = async () => {
    const results = (await this.apiService.get(`/secretsanta/results`)) || {
      "Sorry, we've failed to generate results": "Please try again!"
    };
    this.setState({ results });
  };

  onInputChange = (event, isFirstName) => {
    if (isFirstName) {
      this.setState({ firstName: event.target.value });
    } else {
      this.setState({ lastName: event.target.value });
    }
  };

  importParticipants = () => this.setState({ showImport: true });

  onModalClose = () => {
    this.load();
    this.setState({ showImport: false });
  };

  changeBanned = event => this.setState({ banned: event.target.value });

  saveBanned = async () => {
    const banned = await this.apiService.post(
      "/secretsanta/banned",
      this.state.banned,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    this.setState({ banned: JSON.stringify(banned) });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showImport && (
          <ImportParticipants
            {...this.props}
            onImport={this.onModalClose}
            onClose={this.onModalClose}
          />
        )}
        <Grid container spacing={24}>
          <Grid item md={12} sm={24}>
            <div>
              <Typography variant="title">
                <strong>Welcome to the Secret Santa generator!</strong>
              </Typography>
            </div>
            <Typography variant="body1">
              Import your participants in a csv, add or remove one participant
              at a time, replace all of your users, or add restrited pairings
              such as family members via a dictionary. Then generate and enjoy
              the gift of giving!
            </Typography>
          </Grid>
          <Grid item sm={8}>
            <Button onClick={this.importParticipants}>
              Import Participants
            </Button>
            <Button
              onClick={this.generateResults}
              disabled={this.state.participants.length < 2}
            >
              Generate Results
            </Button>
            {Object.keys(this.state.results).map(key => {
              return (
                <div>
                  <Typography variant="body1">
                    {key} -> {this.state.results[key]}
                  </Typography>
                </div>
              );
            })}
          </Grid>

          <Grid item sm={8}>
            {this.state.participants.map((p, index) => {
              return (
                <div>
                  <span variant="body1">{p.firstName} </span>
                  <span variant="body1">{p.lastName} </span>
                  <span>
                    <Button onClick={() => this.removePerson(index)}>
                      Remove
                    </Button>
                  </span>
                </div>
              );
            })}
            <InputLabel>First Name</InputLabel>
            <input
              type="text"
              onChange={event => this.onInputChange(event, true)}
              value={this.state.firstName}
            />
            <InputLabel>Last Name </InputLabel>
            <input
              type="text"
              onChange={event => this.onInputChange(event)}
              value={this.state.lastName}
            />
            <Button onClick={this.addPerson}>Add Participant</Button>
          </Grid>
          <Grid item sm={8}>
            <Input
              multiline
              onChange={this.changeBanned}
              value={this.state.banned}
            />
            <Button onClick={this.saveBanned}>Save Banned Pairings</Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
