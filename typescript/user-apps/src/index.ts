import path from "path";
import { queryApi } from "./utils/ApiRequests";
import type { Filter } from "./types/Filter";
import { getUserProcesses } from "./modules/getUserProcesses";
import { createUserProcessesReport } from "./modules/createUserProcessesReport";
import type { UserProcesses } from "./types/UserProcesses";

// This is the entry point of the example
// We use a self-invoking function to be able to use async/await
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

(async () => {
  // Define variables used in the example
  let users;
  let userProcesses: UserProcesses[] = [];

  // Fetch all users with a lastReport date greater than 30 days ago
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  console.log(`Fetching users...`);
  try {
    const filter: Filter = {
      lastReport: {
        type: "greaterThanOrEqual",
        filter: thirtyDaysAgo,
      },
    };

    // Use the queryApi function to fetch users
    // The queryApi function is defined in utils/ApiRequests.ts
    users = await queryApi("/ad-users", filter);
    console.log(`Fetched ${users.length} users`);
  } catch (e) {
    console.log(e);
  }

  // Fetch all apps for each user
  // The getUserProcesses function is defined in modules/getUserProcesses.ts
  console.log(`Fetching apps per user...`);
  try {
    userProcesses = await getUserProcesses(users);
  } catch (e) {
    console.log(e);
  }

  // Create a CSV report
  // The createUserProcessesReport function is defined in modules/createUserProcessesReport.ts
  console.log(`Creating report...`);
  try {
    const filename = "report.csv";
    const directory = ".";
    const fullPath = path.join(directory, filename);
    createUserProcessesReport(userProcesses, fullPath);
  } catch (e) {
    console.log(e);
  }
})();
