import { useState, useEffect } from "react";

export function useFacilityMatrixData(countyId, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Token is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://41.89.92.168/api/analytics/matrix-report/?report_type=matrix_report&metric=number_of_facilities&col_dims=keph_level__name,regulatory_body__name,facility_type__name,infrastructure&county=${countyId}&row_comparison=county&format=json`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache, no-store, max-age=0",
              "User-Agent": "node",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(response.json());

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (countyId && token) {
      fetchData();
    }
  }, [countyId, token]);

  return { data, loading, error };
}
