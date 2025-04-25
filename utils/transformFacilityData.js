export function transformFacilityData(rawData) {
  if (!rawData?.results?.counts) return [];

  const countyName = rawData.results.row_comparison[0]?.name || "Unknown";
  const countyData = rawData.results.counts[countyName];

  const rows = [];

  // Iterate through each level (Level 2, Level 3, Level 4)
  for (const [level, levelData] of Object.entries(countyData)) {
    // Iterate through each regulatory body
    for (const [regulatoryBody, regulatoryBodyData] of Object.entries(
      levelData
    )) {
      // Iterate through each facility type
      for (const [facilityType, facilityData] of Object.entries(
        regulatoryBodyData
      )) {
        // Create a row for each combination
        const row = {
          id: `${level}-${regulatoryBody}-${facilityType}`,
          level,
          regulatoryBody,
          facilityType,
          county: countyName,
        };

        // Add each metric as a column
        for (const [metric, value] of Object.entries(facilityData)) {
          row[metric] = value;
        }

        rows.push(row);
      }
    }
  }

  return rows;
}
