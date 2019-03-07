import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { bottle } from "../../provider/Bottle";

export class ImportParticipants extends React.Component {
  importService = bottle.container.ParticipantImportService;

  constructor(props) {
    super(props);
    this.state = {
      isImporting: false,
      didFinishImporting: false,
      modalOpen: true,
      file: undefined,
      replaceExisting: false
    };
  }

  onFileLoad = files => this.setState({ file: files[0] });

  importParticipants = async () => {
    this.setState({ isImporting: true });
    const parsed = await this.importService.parseUploadedFile(this.state.file);
    const result = await this.importService.importParticipants(
      parsed.data,
      this.state.replaceExisting
    );
    this.props.onImport && this.props.onImport(result);
    this.setState({
      didFinishImporting: true,
      isImporting: false
    });
  };

  onModalClose = () => {
    this.setState({ modalOpen: false });
    this.props.onClose && this.props.onClose();
  };

  onCheckboxChange = e => {
    this.setState({ replaceExisting: e.target.checked });
  };

  buildUploadBody = () => {
    return (
      <React.Fragment>
        <Typography variant="title" id="simple-modal-description">
          Import Participants
        </Typography>
        <Grid container justify="center">
          <FileUpload
            id="import-Participants"
            fileTypes=".csv"
            onDrop={this.onFileLoad}
            filesUploaded={this.state.file ? [this.state.file] : []}
          >
            {"Click or drag to add a file..."}
          </FileUpload>
        </Grid>
        <div style={{ margin: "1rem 0" }}>
          <Typography variant="body1" id="simple-modal-description">
            <a
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline"
              }}
              onClick={() => this.importService.getTemplateFile()}
            >
              Example File
            </a>
          </Typography>
          <Typography variant="body2" id="simple-modal-description">
            <li>Imported file must be of type .csv</li>
            <li>Row one must include the label of the field</li>
            <li>File must include email address</li>
          </Typography>
        </div>
        <div>
          <Typography variant="title" id="simple-modal-description">
            Replace current participants
          </Typography>
          <Checkbox onChange={this.onCheckboxChange} />
          />
        </div>
        <ButtonGroup layout="right">
          <Button id="close" onClick={this.onModalClose}>
            Cancel
          </Button>
          <Button
            disabled={!this.state.file}
            id="upload"
            color="primary"
            onClick={this.importParticipants}
          >
            Upload
          </Button>
        </ButtonGroup>
      </React.Fragment>
    );
  };

  buildImportBody = () => {
    return (
      <React.Fragment>
        <Typography variant="title" id="simple-modal-description">
          Importing participants, please do not close this page.
        </Typography>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={this.onModalClose}
        id="import-participants"
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            backgroundColor: "#eeeeee",
            padding: "1.5rem",
            transform: "translate(-50%, -50%)"
          }}
        >
          {!this.state.didFinishImporting &&
            !this.state.isImporting &&
            this.buildUploadBody()}
          {this.state.isImporting && this.buildImportBody()}
        </div>
      </Modal>
    );
  }
}
