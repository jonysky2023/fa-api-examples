import axios from "axios";
import * as dotenv from "dotenv";
import { getApiBaseUrl } from "./ApiBaseUrl";

// Load environment variables from .env file
dotenv.config();

let token: string | null = null;
let tokenPromise: Promise<string> | null = null;

// This function will return the auth token. If the token is not available,
// it will request a new token from the API and return it.
export async function getToken(): Promise<string> {
  if (token) {
    return token;
  }

  if (!tokenPromise) {
    tokenPromise = requestToken();
  }

  return tokenPromise;
}

// This function will save the auth token. It will also clear the tokenPromise
// so that a new token can be requested.
export function saveToken(newToken: string | null) {
  token = newToken;
  tokenPromise = null;
}

// This function will request a new auth token from the API
async function requestToken(): Promise<string> {
  // Check that the required environment variables are set
  if (!process.env["CUSTOMER_ID"] || !process.env["ACCESS_TOKEN"]) {
    throw new Error("Missing CUSTOMER_ID or ACCESS_TOKEN");
  }

  try {
    console.log("Fetching auth token...");
    const url = getApiBaseUrl() + "/login";
    // Send a POST request to the API to request an auth token
    // The request body must contain the Customer ID and Access Token
    const response = await axios.post(url, {
      customer_id: process.env["CUSTOMER_ID"],
      access_token: process.env["ACCESS_TOKEN"],
    });

    // If the request was successful, save the token and return it
    if (response.status === 200 && response.data.token) {
      let token = response.data.token;
      saveToken(token);
      console.log("Auth token fetched successfully");
      return token;
    } else {
      throw new Error(`The authentication request failed`);
    }
  } catch (e) {
    // If the request failed, throw an error containing the status code
    if (axios.isAxiosError(e)) {
      // If the request failed because of an invalid access token or customer ID,
      // throw a more specific error
      if (e.response && e.response.status === 401) {
        throw new Error(`Invalid Access Token`);
      } else if (e.response && e.response.status === 403) {
        throw new Error(`Invalid Customer ID`);
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
