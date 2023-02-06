import fs from "fs";

import type { UserProcesses } from "../types/UserProcesses";

// This function creates a report of the user processes
// and saves it to a specified file in CSV format
export function createUserProcessesReport(
  users: UserProcesses[],
  file: string
) {
  // Create a Set to store unique process names
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  const processNames = new Set<string>();

  // Loop through each user and add their processes to the Set
  for (const user of users) {
    for (const process of user.processes) {
      processNames.add(process);
    }
  }

  // The header row for the CSV, including the userPrincipalName column and
  // a column for each process name
  const header = [`userPrincipalName`]
    .concat(Array.from(processNames))
    .map((item) => `"${item}"`)
    .join(",");

  // Loop through each user and create a row with the userPrincipalName and
  // a column for each process indicating whether they have run that process
  const rows = [];
  for (const user of users) {
    const processData = Array.from(processNames).map((processName) =>
      user.processes.includes(processName) ? `"x"` : `""`
    );
    rows.push([`"${user.userPrincipalName}"`].concat(processData).join(","));
  }

  // Join the header and rows to create the final CSV string
  const csv = [header].concat(rows).join("\n");

  try {
    // Write the CSV to the specified file
    fs.writeFileSync(file, csv);
  } catch (error) {
    console.error(error);
  }
}
