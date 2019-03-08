# SecretSanta

Welcome to my Secret Santa project.

To run this project locally, you will need to install dotnet core 2.2, Node, and npm.
- Open the Solution file in Visual Studio (or your preferred IDE).
- Open a bash terminal (command prompt or powershell window will work as well).
- Navigate to the repository home directory
- Navigate to $REPO_HOME/SecretSanta/SecretSanta/ClientApp
- Run npm install
- Build and run the solution
- If a window doesn't open up to localhost:5000, open up a new window

- To consume the api, download Postman (or another similar application)
- The routes are all localhost:5000/api/sescretsanta/{action}
- To setup the application through the API and test it, perform the following steps:
  - POST: localhost:5000/api/secretsanta/import with JSON body like [{ "firstName": "Test", "lastName": "User" }, { "firstName": "Test", "lastName": "Banned" ]
  - POST: localhost:5000/api/secretsanta/banned with JSON body like { "Test User": "Test Banned" }
  - GET: localhost:5000/api/secretsanta/results
- You can add individual users using PUT: localhost:5000/api/secretsanta/add
- You can remove individual users using DELETE: localhost:5000/api/secretsanta/remove/{index}
- You can append users to the participant list instead of replacing on import with ?replace=false as a query parameter
- You can view all participants by calling GET: localhost:5000/api/secretsanta/participants
- You can view all banned pairings by calling GET: localhost:5000/api/secretsanta/banned

- To use the front-end website, follow these steps
- Select "Import Participants"
- Click on the "Click or drag to add a file..." and select a CSV to upload
  - An example file can be downloaded using the "Example File" link
- Select whether to replace all participants or not using the checkbox
- Select "Upload"
- Add individual users by filling in First Name and Last Name fields and hitting "Add Participant"
- Remove any participants by selecting "Remove" next to the participant
- Update banned pairings by inputting a JSON dictionary into the text area and selecting "Save Banned Pairings"
  - This should look the same as the API e.g.: { "Test User": "Test Banned" }
- Generate results by selecting "Generate Results"

If you have any questions about the API or the UI, please reach out! I appreciate the opportunity and look forward to hearing from you!
