import Papa from "papaparse";

export class ParticipantImportService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  getTemplateFile = () => {
    const fileName = "secretSantaTemplate.csv";
    const blob = new Blob(["First Name,Last Name"], {
      type: "text/plain;charset=utf-8"
    });
    const isEdge = navigator.userAgent.match(/Edge/g);

    if (isEdge) {
      return navigator.msSaveBlob(blob, fileName);
    } else {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  async parseUploadedFile(file) {
    return new Promise(resolve => {
      const config = {
        header: true,
        skipEmptyLines: true,
        complete: async result => {
          const results = this.parseCsv(result);
          resolve(results);
        }
      };
      Papa.parse(file, config);
    });
  }

  async importParticipants(participants, replaceExisting = true) {
    return await this.apiService.post(
      `/secretSanta/import?replace=${replaceExisting}`,
      participants
    );
  }

  async parseCsv(result) {
    const fields = result.meta.fields;
    const mapped = fields.map(f => ({
      name: f,
      parsed: f.toLowerCase().replace(/ /g, "")
    }));
    const get = field => {
      const result = mapped.find(m => m.parsed === field);
      return result ? result.name : "";
    };
    const response = {
      errors: result.errors,
      firstNameField: get("firstname"),
      lastNameField: get("lastname"),
      data: []
    };
    if (!response.firstNameField) {
      response.errors.push("Required first name column was not found.");
    }
    if (!response.lastNameField) {
      response.errors.push("Required last name column was not found.");
    }

    if (response.errors.length === 0) {
      response.data = result.data.map(r => {
        return {
          firstName: r[response.firstNameField].trim(),
          lastName: r[response.lastNameField].trim()
        };
      });
    }
    return response;
  }
}
