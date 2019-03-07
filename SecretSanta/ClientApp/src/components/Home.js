import { Button, Grid, Input, InputLabel, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { bottle } from "../provider/Bottle";

export class Home extends Component {
  apiService = bottle.container.ApiService;
  importService = bottle.container.ParticipantImportService;
  state = {
    participants: []
  };

  async componentDidMount() {
    await this.load();
  }

  load = async () => {
    const participants = await this.apiService.get("/secretsanta/participants");
    this.setState({ participants, firstName: "", lastName: "" });
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

  generateResults = async () =>
    await this.apiService.get(`/secretsanta/results`);

  onInputChange = (event, isFirstName) => {
    if (isFirstName) {
      this.setState({ firstName: event.target.value });
    } else {
      this.setState({ lastName: event.target.value });
    }
  };

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item md={12} sm={24}>
          <div>
            <Typography variant="title">
              <strong>Welcome to the Secret Santa generator!</strong>
            </Typography>
          </div>
          <Typography variant="body1">
            Import your participants in a csv, add or remove one participant at
            a time, replace all of your users, or add restrited pairings such as
            family members via a dictionary. Then generate and enjoy the gift of
            giving!
          </Typography>
        </Grid>
        <Grid item sm={24}>
          <Button onClick={this.importParticipants}>Import Participants</Button>
          <Button
            onClick={this.generateResults}
            disabled={this.state.participants.length > 2}
          >
            Generate Results
          </Button>
        </Grid>

        <Grid item sm={24}>
          {this.state.participants.map((p, index) => {
            return (
              <div>
                <Typography variant="body1">{p.firstName}</Typography>
                <Typography variant="body1">{p.lastName}</Typography>
                <Button onClick={p => this.removePerson(index)}>Remove</Button>
              </div>
            );
          })}
          <Grid item md={6} sm={12}>
            <InputLabel>First Name</InputLabel>
            <Input
              onChange={event => this.onInputChange(event, true)}
              value={this.state.firstName}
            />
            <InputLabel>Last Name</InputLabel>
            <Input
              onChange={event => this.onInputChange(event)}
              value={this.state.lastName}
            />
            <Button onClick={this.addPerson}>Add Participant</Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
