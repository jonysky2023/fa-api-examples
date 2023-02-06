import path from "path";
import { queryApi } from "./utils/ApiRequests";
import type { Filter } from "./types/Filter";
import { getUserProcesses } from "./modules/getUserProcesses";
import { createUserProcessesReport } from "./modules/createUserProcessesReport";
import type { UserProcesses } from "./types/UserProcesses";

(async () => {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  let users;
  let userProcesses: UserProcesses[] = [];

  console.log(`Fetching users...`);
  try {
    const filter: Filter = {
      lastReport: {
        type: "greaterThanOrEqual",
        filter: thirtyDaysAgo,
      },
    };

    users = await queryApi("/ad-users", filter);
    console.log(`Fetched ${users.length} users`);
  } catch (e) {
    console.log(e);
  }

  console.log(`Fetching apps per user...`);
  try {
    userProcesses = await getUserProcesses(users);
  } catch (e) {
    console.log(e);
  }

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
