import axios from "axios";
import * as dotenv from "dotenv";
import { getToken, saveToken } from "./ApiAuth";
import { getApiBaseUrl } from "./ApiBaseUrl";

import type { Filter } from "../types/Filter";
import type { Sort } from "../types/Sort";

// Load environment variables from .env file
dotenv.config();

// This function will make a request to the API and return the response
export async function queryApi(
  // The API URL is the path to the API endpoint (e.g. /devices)
  apiUrl: string,
  // The filter is used to filter the results
  // You can view the filter documentation here: https://docs.flexxanalyzer.com/dev/docs/filters
  filter: Filter | null = null,
  // The sort is used to sort the results
  // You can view the sort documentation here: https://docs.flexxanalyzer.com/dev/docs/filters
  sort: Sort | null = null,
  // The page number to request
  page = 1,
  // The number of requests per second to make to the API
  // If this is not set, the requests will be made as fast as possible
  requestsPerSecond: number | null = null
): Promise<any> {
  const token = await getToken();

  // Configure the number of results per page to request from the API
  let perPage;
  if (!process.env["PER_PAGE"]) {
    perPage = 50;
  } else {
    perPage = parseInt(process.env["PER_PAGE"]);
    if (perPage < 1 || perPage > 1000) {
      throw new Error("PER_PAGE must be between 1 and 100");
    }
  }

  // Configure the wait time between requests
  let waitTime = 0;
  if (requestsPerSecond) {
    waitTime = 1000 / requestsPerSecond;
  }

  try {
    // Configure the request parameters
    const params = {
      perPage,
      page,
      // Convert the filter and sort objects to JSON strings
      ...(filter && { query: JSON.stringify(filter) }),
      ...(sort && { sort: JSON.stringify(sort) }),
    };
    // Configure the request headers
    const headers = {
      "customer-id": process.env["CUSTOMER_ID"],
      Authorization: `Bearer ${token}`,
    };
    // Send the request to the API
    const url = getApiBaseUrl() + apiUrl;
    const response = await axios.get(url, {
      params: params,
      headers: headers,
    });

    // If the request was successful, return the results
    if (response.status === 200) {
      let objects = response.data.data.results;
      let totalCount = response.data.data.totalCount;
      let pages = Math.ceil(totalCount / perPage);

      // Wait for the configured amount of time before making the next request
      if (waitTime) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      // If there are more pages, make another request to get the next page
      // and concatenate the results
      if (page < pages) {
        objects = objects.concat(
          await queryApi(apiUrl, filter, sort, page + 1, requestsPerSecond)
        );
      }

      // Return the results
      return objects;
    }
  } catch (e) {
    let consecutive401Errors = 0;

    // If the request failed, check if the error was a 401 error
    if (axios.isAxiosError(e)) {
      if (e.response && e.response.status === 401) {
        saveToken(null);
        consecutive401Errors++;
        // If the request failed with a 401 error, try to get a new token
        // and make the request again. Only try this once to avoid an infinite loop
        if (consecutive401Errors > 1) {
          throw new Error(`Invalid Customer ID or Access Token`);
        }
        console.log(`Bearer token expired, fetching new token...`);
        await queryApi(apiUrl, filter, sort, page + 1, requestsPerSecond);
      } else {
        // Otherwise, throw a more generic error
        throw new Error(
          `Request failed with status ${e.response ? e.response.status : "N/A"}`
        );
      }
    } else {
      // If the request failed for another reason, throw a generic error
      throw new Error(`Request failed with error: ${e}`);
    }
  }
}
