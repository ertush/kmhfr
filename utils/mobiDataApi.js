import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Fetches data from the given URL with authorization.
 * @param {string} url - The URL to fetch data from.
 * @param {string} authToken - The authorization token.
 * @returns {Promise<Object>} The response data.
 */
export const fetchData = async (url, authToken) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: false,
      baseURL: API_BASE_URL,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

/**
 * Fetches sub-counties for a given county ID.
 * @param {string} countyId - The ID of the county.
 * @param {string} authToken - The authorization token.
 * @param {string} [nextPageUrl=null] - URL for the next page of results.
 * @returns {Promise<Object>} Data containing sub-county options and pagination info.
 */
export const fetchSubCountiesApi = async (countyId, authToken, nextPageUrl = null) => {
  const url = nextPageUrl || `/common/sub_counties/?county=${countyId}`;
  return fetchData(url, authToken);
};

/**
 * Fetches wards for a given sub-county ID.
 * @param {string} subCountyId - The ID of the sub-county.
 * @param {string} authToken - The authorization token.
 * @param {string} [nextPageUrl=null] - URL for the next page of results.
 * @returns {Promise<Object>} Data containing ward options and pagination info.
 */
export const fetchWardsApi = async (subCountyId, authToken, nextPageUrl = null) => {
  const url = nextPageUrl || `/common/wards/?sub_county=${subCountyId}`;
  return fetchData(url, authToken);
};


/**
 * Fetches paginated filter options from a given API endpoint.
 * This function uses the native `fetch` API instead of axios.
 * @param {string} endpoint - The API endpoint (e.g., "/common/facility_types/").
 * @param {string} token - The authorization token.
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<Object>} An object containing results, pagination links, and counts.
 */
export async function fetchPaginatedFilterOptions(endpoint, token, page = 1) {
  try {
    const url = `${API_BASE_URL}${endpoint}?page=${page}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results,
      next: data.next,
      previous: data.previous,
      count: data.count,
      currentPage: data.current_page || page,
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error(`Error fetching paginated filter options from ${endpoint}:`, error);
    return { results: [], next: null, previous: null, count: 0, currentPage: 1, totalPages: 1 };
  }
}