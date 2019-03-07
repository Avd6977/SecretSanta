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

  async importSubscribers(participants, replaceExisting = true) {
    return await this.apiService.post(
      `/secretSanta/import?replace=${replaceExisting}`,
      participants
    );
  }
}
