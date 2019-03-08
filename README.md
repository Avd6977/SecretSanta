# SecretSanta

Welcome to my Secret Santa project.

To run this project locally, you will need to install dotnet core 2.2, Node, and npm.
1. Open the Solution file in Visual Studio (or your preferred IDE).
1. Open a bash terminal (command prompt or powershell window will work as well).
1. Navigate to the repository home directory
1. Navigate to $REPO_HOME/SecretSanta/SecretSanta/ClientApp
1. Run npm install
1. Build and run the solution
1. If a window doesn't open up to localhost:5000, open up a new window

1. To consume the api, download Postman (or another similar application)
1. The routes are all localhost:5000/api/sescretsanta/{action}
1. To setup the application through the API and test it, perform the following steps:
  1. POST: localhost:5000/api/secretsanta/import with JSON body like [{ "firstName": "Test", "lastName": "User" }, { "firstName": "Test", "lastName": "Banned" ]
  1. POST: localhost:5000/api/secretsanta/banned with JSON body like { "Test User": "Test Banned" }
  1. GET: localhost:5000/api/secretsanta/results
1. You can add individual users using PUT: localhost:5000/api/secretsanta/add
1. You can remove individual users using DELETE: localhost:5000/api/secretsanta/remove/{index}
1. You can append users to the participant list instead of replacing on import with ?replace=false as a query parameter
1. You can view all participants by calling GET: localhost:5000/api/secretsanta/participants
1. You can view all banned pairings by calling GET: localhost:5000/api/secretsanta/banned

1. To use the front-end website, follow these steps
1. Select "Import Participants"
1. Click on the "Click or drag to add a file..." and select a CSV to upload
  1. An example file can be downloaded using the "Example File" link
1. Select whether to replace all participants or not using the checkbox
1. Select "Upload"
1. Add individual users by filling in First Name and Last Name fields and hitting "Add Participant"
1. Remove any participants by selecting "Remove" next to the participant
1. Update banned pairings by inputting a JSON dictionary into the text area and selecting "Save Banned Pairings"
  1. This should look the same as the API e.g.: { "Test User": "Test Banned" }
1. Generate results by selecting "Generate Results"

If you have any questions about the API or the UI, please reach out! I appreciate the opportunity and look forward to hearing from you!
