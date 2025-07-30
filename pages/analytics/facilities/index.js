import Head from "next/head";
import MainLayout from "../../../components/MainLayout";
import { DownloadIcon } from "@heroicons/react/solid";
import { checkToken } from "../../../controllers/auth/auth";
import { useState, useEffect, useCallback, useContext } from "react";

import Select from "react-select";
import { fetchStandardAnalyticsReports } from "../../../utils/mobiDataApi";
import { FacilityMatrixTable } from "../../../components/FacilityMatrixTable.js";

// @mui imports
import AnalyticsSideFilters from "../../../components/AnalyticsSideFilters";
import { UserContext } from "../../../providers/user";
import withAuth from "../../../components/ProtectedRoute";
import { ANALYTICS_FILTER_TREE_DATA } from "../../../utils/analyticsFilterConfig";
import { fetchPaginatedFilterOptions } from "../../../utils/filterApi";

function FacilityAnalytics(props) {
  const filters = props?.filters;
  const userCtx = useContext(UserContext);

  // Analytics filters state
  const [analyticsFilters, setAnalyticsFilters] = useState({});
  const [columnDimensions, setColumnDimensions] = useState(["bed_types"]);
  const [analyticsData, setAnalyticsData] = useState(props?.data);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [drillDown, setDrillDown] = useState({});

  const [tab, setTab] = useState("dynamic_report");
  // quick filter themes

  const [isClient, setIsClient] = useState(false);
  const [analyticsFilterObj, setAnalyticsFilterObj] = useState({});
  const [standardReports, setStandardReports] = useState([]);

  // const pageParams = useSearchParams();

  useEffect(() => {
    if (tab && tab !== "dynamic_report" && standardReports.length > 0) {
      console.log("Fetching Analytics Data...");
      fetchAnalyticsData();
    }
  }, [tab, standardReports, analyticsFilterObj]);

  useEffect(() => {
    setIsClient(true);
    let qry = props?.query;

    delete qry?.searchTerm;
    delete qry?.qfstart;
    setDrillDown({ ...drillDown, ...qry });

    fetchStandardAnalyticsReports(props?.token)
      .then((data) => setStandardReports(data.reports || []))
      .catch((e) => setStandardReports([]));
  }, []);

  // Function to fetch analytics data with current filters
  const COLUMN_ORDER = [
    "facility_type__name",
    "owner__owner_type__name",
    "keph_level__name",
    "service_category",
    "owner__name",
    "infrastructure__category",
    "regulatory_body__name",
    "infrastructure",
    "specialty",
    "specialty_category",
    "services",
    "bed_types",
  ];

  // Function to transform selected filters to API body format
  // const transformFiltersToAPIBody = (selectedFilters, colDims) => {
  //   // Limit to a maximum of 5 at a time
  //   const limitedColDims = Array.isArray(colDims)
  //     ? colDims.slice(0, 5)
  //     : [colDims];

  //   const body = {
  //     col_dims: limitedColDims.join(","),
  //     report_type: "matrix_report",
  //     metric: "number_of_facilities",
  //     row_comparison: "county",
  //     filters: {},
  //   };

  //   // Map level selections to row_comparison
  //   if (selectedFilters.national) {
  //     body.row_comparison = "national";
  //   } else if (selectedFilters.county) {
  //     body.row_comparison = "county";
  //   } else if (selectedFilters["sub-county"]) {
  //     body.row_comparison = "subcounty";
  //   } else if (selectedFilters.ward) {
  //     body.row_comparison = "ward";
  //   }

  //   // Mapping selected UUIDs back to their API filter categories.
  //   const filterIdToCategoryMap = {};
  //   for (const categoryKey in filters) {
  //     const categoryData = filters[categoryKey];
  //     if (
  //       categoryData &&
  //       categoryData.results &&
  //       Array.isArray(categoryData.results)
  //     ) {
  //       categoryData.results.forEach((item) => {
  //         filterIdToCategoryMap[item.id] = categoryKey;
  //       });
  //     }
  //   }

  //   for (const filterId in selectedFilters) {
  //     if (selectedFilters[filterId] === true) {
  //       // Skip static 'level' filters as they are handled by row_comparison
  //       if (
  //         [
  //           "national",
  //           "county",
  //           "sub-county",
  //           "ward",
  //           "by-service-category",
  //           "by-service-availability",
  //         ].includes(filterId)
  //       ) {
  //         continue;
  //       }

  //       const category = filterIdToCategoryMap[filterId];
  //       if (category) {
  //         let apiFilterKey = category;

  //         if (category === "owner_types") {
  //           apiFilterKey = "owners";
  //         } else if (category === "regulating_bodies") {
  //           apiFilterKey = "regulatory_bodies";
  //         } else if (category === "facility_status") {
  //           apiFilterKey = "operation_status";
  //         } else if (category === "keph_level") {
  //           apiFilterKey = "keph_levels";
  //         }

  //         if (!body.filters[apiFilterKey]) {
  //           body.filters[apiFilterKey] = [];
  //         }
  //         body.filters[apiFilterKey].push(filterId);
  //       } else {
  //         console.warn(
  //           `Selected filter ID ${filterId} not found in filterIdToCategoryMap. It might be a static filter or an unmapped dynamic filter.`,
  //         );
  //       }
  //     }
  //   }

  //   return body;
  // };

  const fetchAnalyticsData = async (
    currentSelectedFilters = {},
    colDims = ["bed_types"],
  ) => {
    setIsLoadingData(true);

    try {
      let body;
      if (tab === "dynamic_report") {
        // Existing dynamic report logic
        let rowComparison = "county";
        if (analyticsFilters.national) rowComparison = "national";
        else if (analyticsFilters.county) rowComparison = "county";
        else if (analyticsFilters["sub-county"]) rowComparison = "subcounty";
        else if (analyticsFilters.ward) rowComparison = "ward";

        // Always send colDims in the specified COLUMN_ORDER
        const orderedColDims = Array.isArray(colDims)
          ? colDims
              .slice(0, 5)
              .sort((a, b) => COLUMN_ORDER.indexOf(a) - COLUMN_ORDER.indexOf(b))
              .join(",")
          : colDims;

        body = {
          col_dims: orderedColDims,
          report_type: "matrix_report",
          metric: "number_of_facilities",
          row_comparison: rowComparison,
          filters: analyticsFilterObj,
        };
      } else {
        // Standard report logic
        const report = standardReports.find((r) => r.id === tab);
        if (!report) return;
        // Always send report.columnkeys in the specified COLUMN_ORDER
        const orderedColumnKeys = Array.isArray(report.columnkeys)
          ? report.columnkeys
              .slice(0, 5)
              .sort((a, b) => COLUMN_ORDER.indexOf(a) - COLUMN_ORDER.indexOf(b))
          : report.columnkeys;

        body = {
          col_dims: orderedColumnKeys,
          report_type: report.reporttype,
          metric: report.metric,
          row_comparison: report.rowcomparison,
          filters: analyticsFilterObj,
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix/facilities/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${props?.token}`,
            "Cache-Control": "no-cache, no-store, max-age=0",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        setAnalyticsData(null);
      }
    } catch (error) {
      setAnalyticsData(null);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleColumnDimensionChange = (selectedOptions) => {
    setColumnDimensions(
      selectedOptions ? selectedOptions.map((option) => option.value) : [],
    );
  };

  const handleFiltersChange = (newFilters, filterObj) => {
    setAnalyticsFilters(newFilters);
    setAnalyticsFilterObj(filterObj);
  };

  const handleFetchAnalyticsData = useCallback(() => {
    if (tab === "dynamic_report") {
      // Only fetch if it's the dynamic report tab
      fetchAnalyticsData(analyticsFilters, columnDimensions);
    }
  }, [analyticsFilters, columnDimensions, tab]);

  // If analyticsFilters or columnDimensions change, fetch new analytics data
  useEffect(() => {
    if (tab === "dynamic_report") {
      if (
        Object.keys(analyticsFilters).length > 0 ||
        columnDimensions.length > 0
      ) {
        handleFetchAnalyticsData();
      } else {
        // If no filters or column dimensions selected, fetch with default bed_types
        fetchAnalyticsData({}, ["bed_types"]);
      }
    }
  }, [analyticsFilters, columnDimensions, tab]);

  // Initial fetch of analytics data when component mounts and token is available
  useEffect(() => {
    if (tab === "dynamic_report") {
      fetchAnalyticsData(analyticsFilters, columnDimensions);
    }
  }, [tab]);

  // Options for dynamic column dimensions
  const dynamicColumnOptions = [
    { value: "facility_type__name", label: "Facility Type" },
    { value: "owner__owner_type__name", label: "Owner" },
    { value: "keph_level__name", label: "KEPH Level" },
    { value: "regulatory_body__name", label: "Regulatory Body" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "services", label: "Services" },
    { value: "bed_types", label: "Bed Types" },
  ];

  if (isClient) {
    return (
      <>
        <Head>
          <title>KMHFR | Facilities</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
          <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
            {/* Header Section with Title and Export Buttons */}
            <div className="col-span-1 md:col-span-5 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between">
                <div className="flex w-full flex-wrap items-start md:items-center justify-between gap-2 text-sm md:text-base py-1">
                  {/* Header with Title and Export Buttons */}
                  <div
                    className={
                      "col-span-1 md:col-span-5 flex justify-between w-full bg-django-blue border drop-shadow text-black p-4 md:divide-x md:divide-gray-200 items-start md:items-center border-l-8 " +
                      (true ? "border-gray-700" : "border-red-600")
                    }
                  >
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 capitalize gap-2">
                      Facility Reports
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-5 bg-white rounded border border-gray-200 p-6">
              <div className="flex gap-4 md:flex-row flex-col md:justify-between">
                {/* Filter Label and Select */}
                <div className="flex-1 w-full sm:w-auto">
                  <label
                    htmlFor="report-filter"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Report Type
                  </label>
                  <Select
                    id="report-filter"
                    className="w-full sm:min-w-[300px]"
                    classNamePrefix="select"
                    options={[
                      ...standardReports.map((r) => ({
                        value: r.id,
                        label: r.name,
                        report: r,
                      })),
                      { value: "dynamic_report", label: "Dynamic Report" },
                    ]}
                    onChange={(option) => {
                      setTab(option.value);
                      // setSelectedStandardReport(option.report || null);
                    }}
                    defaultValue={{
                      value: tab,
                      label:
                        tab === "dynamic_report"
                          ? "Dynamic Report"
                          : standardReports.find((r) => r.id === tab)?.name ||
                            tab
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase()),
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "44px",
                        borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
                        boxShadow: state.isFocused
                          ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                          : "none",
                        "&:hover": {
                          borderColor: "#9CA3AF",
                        },
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#3B82F6"
                          : state.isFocused
                            ? "#EFF6FF"
                            : "white",
                        color: state.isSelected ? "white" : "#374151",
                        "&:hover": {
                          backgroundColor: state.isSelected
                            ? "#3B82F6"
                            : "#EFF6FF",
                        },
                      }),
                    }}
                  />
                </div>

                {/* Dynamic Report Column Dimension Selector */}
                {tab === "dynamic_report" && (
                  <div className="flex-1 w-full">
                    <label
                      htmlFor="column-dimensions"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Select Columns{" "}
                      <span className="text-gray-500 font-normal">
                        (Maximum 3)
                      </span>
                    </label>
                    <Select
                      id="column-dimensions"
                      isMulti
                      options={dynamicColumnOptions}
                      onChange={handleColumnDimensionChange}
                      value={dynamicColumnOptions.filter((option) =>
                        columnDimensions.includes(option.value),
                      )}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Choose columns to include in your report..."
                      isOptionDisabled={() => columnDimensions.length >= 3}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "44px",
                          borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
                          boxShadow: state.isFocused
                            ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                            : "none",
                          "&:hover": {
                            borderColor: "#9CA3AF",
                          },
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "#EFF6FF",
                          borderRadius: "6px",
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "#1E40AF",
                          fontWeight: "500",
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: "#3B82F6",
                          "&:hover": {
                            backgroundColor: "#DBEAFE",
                            color: "#1E40AF",
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#3B82F6"
                            : state.isFocused
                              ? "#EFF6FF"
                              : "white",
                          color: state.isSelected ? "white" : "#374151",
                          "&:hover": {
                            backgroundColor: state.isSelected
                              ? "#3B82F6"
                              : "#EFF6FF",
                          },
                        }),
                      }}
                    />
                    {columnDimensions.length > 0 && (
                      <div className="mt-3 flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-1 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {columnDimensions.length} column
                        {columnDimensions.length !== 1 ? "s" : ""} selected
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Side Filter Section (conditionally rendered) */}
            {tab === "dynamic_report" && (
              <div className="col-span-1 md:col-span-1 flex flex-col gap-3">
                <AnalyticsSideFilters
                  filters={filters}
                  authToken={props?.token}
                  user={userCtx}
                  onFiltersChange={handleFiltersChange}
                  reportType={"facilities"}
                  filterTree={ANALYTICS_FILTER_TREE_DATA}
                />
              </div>
            )}
            {/* Main Body */}
            {/* Data Indicator section */}
            <div
              className={`p-4 w-full rounded ${tab === "dynamic_report" ? "md:col-span-4" : "md:col-span-5"} md:h-auto bg-gray-50 shadow-md`}
            >
              {tab === "dynamic_report" ? (
                isLoadingData ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">
                      Loading analytics data...
                    </span>
                  </div>
                ) : analyticsData && Object.keys(analyticsData).length > 0 ? (
                  <FacilityMatrixTable data={analyticsData} />
                ) : (
                  <div className="flex justify-center items-center py-8 text-gray-600">
                    No data available for the selected filters and dimensions.
                  </div>
                )
              ) : (
                <FacilityMatrixTable data={analyticsData} />
              )}
            </div>
          </div>
        </MainLayout>
      </>
    );
  } else {
    return null;
  }
}

export async function getServerSideProps(ctx) {
  let data = null;
  let filters = {};
  const token = (await checkToken(ctx.req, ctx.res))?.token;

  const paginatedEndpoints = {
    counties: "/common/counties/?page_size=47&page=1",
    sub_counties: "/common/sub_counties/",
    wards: "/common/wards/",
    facility_types: "/facilities/facility_types/?is_parent=true",
    keph_level: "/facilities/keph/?is_active=true",
    owner_types: "/facilities/owner_types/",
    regulating_bodies: "/facilities/regulating_bodies/",
    service_categories: "/facilities/service_categories/",
    facility_status: "/facilities/facility_status/",
  };

  for (const key in paginatedEndpoints) {
    if (paginatedEndpoints.hasOwnProperty(key)) {
      try {
        const filterData = await fetchPaginatedFilterOptions(
          paginatedEndpoints[key],
          token,
        );
        filters[key] = filterData;
      } catch (e) {
        console.error(`Error fetching initial page for ${key}:`, e.message);
        filters[key] = {
          results: [],
          next: null,
          previous: null,
          count: 0,
          currentPage: 1,
          totalPages: 1,
        };
      }
    }
  }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix/facilities/`;

  const initialBody = {
    col_dims: "bed_types",
    // report_type: "matrix_report",
    // metric: "number_of_facilities",
    row_comparison: "county",
    filters: {},
  };

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, max-age=0",
        "User-Agent": "node",
      },
      method: "POST",
      body: JSON.stringify(initialBody),
    });

    if (response.ok) {
      data = await response.json();
    } else {
      console.error(
        "Failed to fetch initial analytics data:",
        response.statusText,
      );
    }
  } catch (e) {
    console.error("Error fetching initial analytics data:", e.message);
  }

  return {
    props: {
      data,
      token,
      filters,
    },
  };
}

export default withAuth(FacilityAnalytics);
