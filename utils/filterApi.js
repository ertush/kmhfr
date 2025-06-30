export async function fetchPaginatedFilterOptions(endpoint, token, page = 1) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}?page=${page}`;
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
