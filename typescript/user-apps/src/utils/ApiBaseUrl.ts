// This function will return the API base URL based on the region.
// The region is set in the .env file. The region can be one of the following:
// - legacy
// - south-br
// - northcentral-us
// - west-eu
// The API base URL is used to make requests to the API.
export function getApiBaseUrl(): string {
  const region = process.env["REGION"];

  // Check that the region is set and throw an error if it is not
  if (!region) {
    throw new Error("Missing REGION");
  }

  const lowerCaseRegion = region.toLowerCase();

  // Return the API base URL based on the region
  if (lowerCaseRegion === "legacy") {
    return `https://apps2digital-api.azurewebsites.net/api/v4`;
  } else if (
    lowerCaseRegion === "south-br" ||
    lowerCaseRegion === "northcentral-us" ||
    lowerCaseRegion === "west-eu"
  ) {
    return `https://${region}.api.flexxanalyzer.com/api/v4`;
  } else {
    // If the region is not valid, throw an error
    throw new Error(`Invalid region: ${region}`);
  }
}
