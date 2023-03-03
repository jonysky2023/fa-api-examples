import { queryApi } from "../utils/ApiRequests";

import type { User } from "../types/User";
import type { UserProcesses } from "../types/UserProcesses";
import type { Sort } from "../types/Sort";
import type { Process } from "../types/Process";

// This function retrieves the processes for each user
export async function getUserProcesses(
  users: User[],
  // Define the default start and end dates for the report.
  // By default, the report will show data from the past 30 days
  // The date has yyyy-mm-dd format
  startDate: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10),
  endDate: string = new Date(Date.now()).toISOString().substring(0, 10)
) {
  const userProcesses: UserProcesses[] = [];

  // This query performs better if sorted by report
  const sort: Sort = {
    propertyName: "report",
    sort: "asc",
  };

  let counter = 0;

  // Loop through each user to retrieve the data
  for (const user of users) {
    counter++;

    // We use stdout.write to update the console with the current user
    // We use \r to return to the beginning of the line so that we can
    // overwrite the previous user
    const message = `Processing ${user.userPrincipalName} (${counter} of ${users.length})...`;
    const padding = " ".repeat(message.length);
    process.stdout.write(`${message}${padding}\r`);

    // Do not process users without a userPrincipalName
    if (user.userPrincipalName) {
      // Call the API to retrieve the data for the current user
      const response = await queryApi(
        `/app-reports/${user.id}/used-in-time-interval?startDate=${startDate}&endDate=${endDate}`,
        undefined,
        sort
      );

      // Extract the process names from the API response and add the data
      // to the array
      const processes = response.map((process: Process) => process.productName);
      userProcesses.push({
        userPrincipalName: user.userPrincipalName,
        processes,
      });
    }

    // During processing we are using stdout.write to update the console
    // with the current user. When we reach the end of the loop, we need
    // to add a new line to the console
    if (counter === users.length) {
      console.log("");
    }
  }

  // Return the array of user processes
  return userProcesses;
}
