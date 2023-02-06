# FlexxAnalyzer API Examples: TypeScript

## Get apps by user

### Overview

This project is used to create a report of user processes. The report will contain a list of users and their processes, represented as a CSV file.

Be sure to check out the full [FlexxAnalyzer API documentation](https://docs.flexxanalyzer.com/dev/docs/) for more details.

If you want to view other examples, you can find them at the [root of this repository](https://github.com/flexxibleit/fa-api-examples).

### Technical details

The project is written in TypeScript and uses the following libraries:

```
axios
dotenv
fs
path
```

You will need to have [Node.js](https://nodejs.org) installed to run the project. Flexxible recommends using the latest LTS version of Node.js.

### How to run the project

1. Clone the repository
2. Install dependencies using `npm install`
3. Set environment variables using a `.env` file in the root directory. You can use the .env.example file as a template
4. Run the project using `npm start`

### Project structure

The project is structured as follows:

- `src/modules/` contains the main functionality of the project, including `createUserProcessesReport.ts` and `getUserProcesses.ts`
- `src/types/` contains the TypeScript interfaces used in the project
- `src/utils/` contains reusable utility functions to query the FlexxAnalyzer API
- `index.ts` is the entry point of the project.

### Features

The project has two main functionalities:

- Fetches the processes used by each user in the past 30 days
- Creates a report of the user processes, stored as a CSV file
