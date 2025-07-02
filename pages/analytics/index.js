import Head from "next/head";
import MainLayout from "../../components/MainLayout";
import { DownloadIcon, PlusIcon } from "@heroicons/react/solid";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import Select from "react-select";
import { FacilityMatrixTable } from "../../components/FacilityMatrixTable.js";

// @mui imports
import AnalyticsSideFilters from "../../components/AnalyticsSideFilters";
import { UserContext } from "../../providers/user";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import withAuth from "../../components/ProtectedRoute";
import { ANALYTICS_FILTER_TREE_DATA } from "../../utils/analyticsFilterConfig";
import { fetchPaginatedFilterOptions } from "../../utils/filterApi";
import { data } from "jquery";
// import {jsPDF} from "jspdf";
// import autoTable from "jspdf-autotable";

function FacilityHome(props) {
  const router = useRouter();

  const filters = props?.filters;

  const userCtx = useContext(UserContext);

  const groupID = userCtx?.groups[0]?.id;

  const userCounty = userCtx?.user_counties[0]?.county;

  const userSubCounty = userCtx?.user_sub_counties[0]?.sub_county;

  const [searchTerm, setSearchTerm] = useState("");

  const [facilityStatus, setFacilityStatus] = useState("");

  // Analytics filters state
  const [analyticsFilters, setAnalyticsFilters] = useState({});
  const [columnDimensions, setColumnDimensions] = useState(["bed_types"]);
  const [analyticsData, setAnalyticsData] = useState(props?.data);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const [drillDown, setDrillDown] = useState({});

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [title, setTitle] = useState("Facilities Analysis");
  const [tab, setTab] = useState("dynamic_report");

  // quick filter themes
  const [khisSynched, setKhisSynched] = useState(false);
  const [facilityFeedBack, setFacilityFeedBack] = useState([]);
  const [pathId, setPathId] = useState(props?.path?.split("id=")[1] || "");
  const [allFctsSelected, setAllFctsSelected] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuToOpen] = useState(false);
  const [analyticsFilterObj, setAnalyticsFilterObj] = useState({});

  const pageParams = useSearchParams();

  const currentPageParams = {
    filter: pageParams.get("filter"),
  };

  const orgUnitFilter = (() => {
    if (groupID == 1) {
      //CHHIO
      return `&county=${userCtx?.county ?? userCtx?.user_counties[0]?.county}`;
    } else if (groupID == 2) {
      //SCHRIO
      return `&sub_county=${userCtx?.user_sub_counties[0]?.sub_county}`;
    } else if (groupID == 5 || groupID == 7 || groupID == 6) {
      // National & Admin
      return "";
    }
  })();

  const countyFilterOptions = filters?.counties?.results?.map(({ id, name }) => ({
    label: name,
  }));

  const [subCountyFilterOptions, setSubCountyFilterOptions] = useState(
    (prev) => {
      if (!prev) return [];
      return filters?.sub_counties?.results?.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
    }
  );


  const handleApprovalStatus = useCallback(({ value }) => {
    if (!!value) {
      setFacilityStatus(value);

      router.push({
        pathname: "/facilities",
        query: {
          filter: "updated_pending_validation_facilities",
          have_updates: true,
          closed: false,
          [value.split(":")[0]]: value.split(":")[1],
        },
      });
    }
  });

  useEffect(() => {
    setIsClient(true);
    // Set the token from props to state for client-side usage
    setAuthToken(props?.token);
  }, [props?.token]);

  useEffect(() => {
    let qry = props?.query;

    delete qry?.searchTerm;
    delete qry?.qfstart;
    setDrillDown({ ...drillDown, ...qry });

    return () => {};
  }, [facilityFeedBack, title]);

  function userOrgUnit() {
    if (groupID === 1) {
      // CHRIO
      return { county: userCounty };
    } else if (groupID === 2) {
      // SCHRIO
      return { sub_county: userSubCounty };
    } else {
      return {};
    }
  }

  async function handleOrgUnitFilter(event) {
    event.preventDefault();

    const url = (() => {
      if (event.target?.name === "county") {
        return `${process.env.NEXT_PUBLIC_API_URL}/common/sub_counties/?county=${event.currentTarget?.value}`;
      }

      if (event.target?.name === "sub_county") {
        return `${process.env.NEXT_PUBLIC_API_URL}/common/wards/?sub_county=${event.currentTarget?.value}`;
      }

      if (event.target?.name === "constituency") {
        return `${process.env.NEXT_PUBLIC_API_URL}/common/wards/?constituency=${event.currentTarget?.value}`;
      }
    })();

    try {
      const filteredOrgUnits = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${props?.token}`,
        },
      });

      if (event.target?.name === "county") {
        const subCounties = (await filteredOrgUnits?.json())?.results;

        setSubCountyFilterOptions(() =>
          subCounties?.map(({ id, name }) => ({ value: id, label: name }))
        );

        event.target.defaultValue = event.target?.value;
      }

      if (event.target?.name === "sub_county") {
        const wards = (await filteredOrgUnits?.json())?.results;
        setWardFilterOptions(
          wards?.map(({ id, name }) => ({ value: id, label: name }))
        );
      }
      if (event.target?.name === "constituency") {
        const wards = (await filteredOrgUnits?.json())?.results;
        setWardFilterOptions(
          wards?.map(({ id, name }) => ({ value: id, label: name }))
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Error occurred. \nOrgUnit: ${e.message}\n`);
      }
    }
  }

  function handleAccordionExpand(ev) {
    if (isAccordionExpanded) {
      setIsAccordionExpanded(false);
    } else {
      setIsAccordionExpanded(true);
    }
  }

  function handleFiltersReset(event) {
    event.preventDefault();

    const filterForm = document.querySelector("#filter-panel");

    filterForm.reset();
  }

  function handleNext() {
    router.push({
      pathname: "/facilities",
      query: {
        next: Buffer.from(`${props?.next}`).toString("base64"),
        ...userOrgUnit,
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),
      },
    });
  }

  function handlePrevious() {
    router.push({
      pathname: "/facilities",
      query: {
        previous: Buffer.from(`${props?.previous}`).toString("base64"),
        ...userOrgUnit,
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),
      },
    });
  }

  function handlePageLoad(e) {
    const page = e.target.innerHTML;

    router.push({
      pathname: "/facilities",
      query: {
        page,
        ...userOrgUnit(),
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),
      },
    });
  }

  // Function to fetch analytics data with current filters
  const fetchAnalyticsData = async (currentSelectedFilters = {}, colDims = ["bed_types"]) => {
    setIsLoadingData(true);

    try {
      let rowComparison = "county";
        if (analyticsFilters.national) rowComparison = "national";
        else if (analyticsFilters.county) rowComparison = "county";
        else if (analyticsFilters["sub-county"]) rowComparison = "subcounty";
        else if (analyticsFilters.ward) rowComparison = "ward";

        const body = {
          col_dims: Array.isArray(colDims) ? colDims.slice(0, 5).join(",") : colDims,
          report_type: "matrix_report",
          metric: "number_of_facilities",
          row_comparison: rowComparison,
          filters: analyticsFilterObj,
        };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix-report/?format=json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache, no-store, max-age=0',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics data:', response.statusText);
        setAnalyticsData(null); // Set data to null or empty on failure
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData(null); // Set data to null or empty on error
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleColumnDimensionChange = (selectedOptions) => {
    setColumnDimensions(selectedOptions ? selectedOptions.map(option => option.value) : []);
  }

  const handleFiltersChange = (newFilters, filterObj) => {
  setAnalyticsFilters(newFilters);
  setAnalyticsFilterObj(filterObj);
};

  const handleFetchAnalyticsData = useCallback(() => {
    if (tab === "dynamic_report") { // Only fetch if it's the dynamic report tab
      fetchAnalyticsData(analyticsFilters, columnDimensions);
    }
  }, [analyticsFilters, columnDimensions, tab]);

  // If analyticsFilters or columnDimensions change, fetch new analytics data
  useEffect(() => {
    if (authToken && tab === "dynamic_report") {
      if (Object.keys(analyticsFilters).length > 0 || columnDimensions.length > 0) {
        handleFetchAnalyticsData();
      } else {
        // If no filters or column dimensions selected, fetch with default bed_types
        fetchAnalyticsData({}, ["bed_types"]);
      }
    } else if (tab !== "dynamic_report") {
      setAnalyticsData(null); // Clear data if not on dynamic report tab
    }
  }, [analyticsFilters, columnDimensions, authToken, tab]);

  // Initial fetch of analytics data when component mounts and token is available
  useEffect(() => {
    if (authToken && tab === "dynamic_report") {
      fetchAnalyticsData(analyticsFilters, columnDimensions);
    }
  }, [authToken, tab]);

  // Options for dynamic column dimensions
  const dynamicColumnOptions = [
    { value: 'facility_type__name', label: 'Facility Type' },
    { value: 'owner__name', label: 'Owner' },
    { value: 'keph_level__name', label: 'KEPH Level' },
    { value: 'regulatory_body__name', label: 'Regulatory Body' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'services', label: 'Services' },
    { value: 'bed_types', label: 'Bed Types' }
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
                  <div className={
                    "col-span-1 md:col-span-5 flex justify-between w-full bg-django-blue border drop-shadow text-black p-4 md:divide-x md:divide-gray-200 items-start md:items-center border-l-8 " +
                    (true ? "border-gray-700" : "border-red-600")
                  }>
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 capitalize gap-2">
                      {title}
                    </h2>

                    {/* Export Buttons - Now on the right side */}
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                        onClick={async () => {
                          // Build export body based on current filters and columns
                          const exportBody = transformFiltersToAPIBody(analyticsFilters, columnDimensions);
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix-report/?format=json`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${authToken}`,
                                },
                                body: JSON.stringify(exportBody),
                              }
                            );
                            if (response.ok) {

                              const data = await response.json();
                              let counts = data?.results?.counts;
                              let flatRows = [];
                              if (Array.isArray(counts) && counts.length > 0) {

                                flatRows = counts.map(obj => {
                                  const county = Object.keys(obj)[0];
                                  return { county, ...obj[county] };
                                });

                                // Prepare headers & rows
                                const headers = ["county", ...Object.keys(flatRows[0]).filter(k => k !== "county")].join(",");
                                const rows = flatRows.map(row =>
                                  headers.split(",").map(h => {
                                  const value = row[h];
                                  // If value is an object or array, stringify it
                                  if (typeof value === "object" && value !== null) {
                                    return JSON.stringify(value);
                                  }
                                  return value;
                                  }).join(",")
                                ).join("\n");

                                const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
                                console.log("CSV Content:", csvContent);
                              }
                                // If counts is a JSON object, convert it to an array for CSV export
                                if (counts && typeof counts === "object" && !Array.isArray(counts)) {
                                // Convert object to array of rows
                                const flatRows = Object.entries(counts).map(([key, value]) => ({
                                  key,
                                  ...value
                                }));
                                const headers = Object.keys(flatRows[0]).join(",");
                                const rows = flatRows.map(row =>
                                  headers.split(",").map(h => {
                                  const value = row[h];
                                  // If value is an array or object, stringify it
                                  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
                                    return JSON.stringify(value);
                                  }
                                  return value;
                                  }).join(",")
                                ).join("\n");

                                const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
                                const encodedUri = encodeURI(csvContent);
                                const a = document.createElement("a");
                                a.href = encodedUri;
                                a.download = `facilities_report_${exportBody?.col_dims}.xlsx`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                alert(`Data table ${exportBody?.col_dims} exported as Excel.`);
                                }
                              // Create a link to download the CSV file
                                // const data = await response.json();
                                // let counts = data?.results?.counts;
                                // let flatRows = [];
                                // let headers = [];
                                // let rows = [];

                                // if (Array.isArray(counts) && counts.length > 0) {
                                // flatRows = counts.map(obj => {
                                //   const county = Object.keys(obj)[0];
                                //   return { county, ...obj[county] };
                                // });
                                // headers = ["county", ...Object.keys(flatRows[0]).filter(k => k !== "county")];
                                // rows = flatRows.map(row =>
                                //   headers.map(h => row[h]).join(",")
                                // );
                                // } else if (counts && typeof counts === "object" && !Array.isArray(counts)) {
                                // flatRows = Object.entries(counts).map(([key, value]) => ({
                                //   key,
                                //   ...value
                                // }));
                                // headers = Object.keys(flatRows[0]);
                                // rows = flatRows.map(row =>
                                //   headers.map(h => row[h]).join(",")
                                // );
                                // }

                                // // Convert rows to a table for PDF
                                // const tableData = [
                                // headers,
                                // ...flatRows.map(row => headers.map(h => row[h]))
                                // ];

                                // // Dynamically import jsPDF and autotable
                                // const { jsPDF } = await import("jspdf");
                                // const autoTable = (await import("jspdf-autotable")).default;

                                // const doc = new jsPDF({
                                // orientation: "landscape",
                                // unit: "pt",
                                // format: "a4"
                                // });

                                // doc.text("Facilities Report", 40, 40);
                                // autoTable(doc, {
                                // head: [headers],
                                // body: flatRows.map(row => headers.map(h => row[h])),
                                // startY: 60,
                                // styles: { fontSize: 8 }
                                // });

                                // doc.save(`facilities_report_${exportBody?.col_dims}.pdf`);
                                // alert(`Data table ${exportBody?.col_dims} exported as PDF.`);

                            } else {
                              alert("Failed to export excel. Please try again.");
                            }
                          } catch (err) {
                            alert("Error exporting Excel: " + err.message);
                          }
                        }}
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium">Excel</span>
                      </button>

                      <button
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={async () => {
                          // Build export body based on current filters and columns
                          const exportBody = transformFiltersToAPIBody(analyticsFilters, columnDimensions);
                          // console.log("excel body:", exportBody?.col_dims);
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix-report/?format=json`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${authToken}`,
                                },
                                body: JSON.stringify(exportBody),
                              }
                            );
                            if (response.ok) {
                              const data = await response.json();
                              let counts = data?.results?.counts;
                              let flatRows = [];
                              if (Array.isArray(counts) && counts.length > 0) {
                                flatRows = counts.map(obj => {
                                  const county = Object.keys(obj)[0];
                                  return { county, ...obj[county] };
                                });

                                // Prepare headers & rows
                                const headers = ["county", ...Object.keys(flatRows[0]).filter(k => k !== "county")].join(",");
                                const rows = flatRows.map(row =>
                                  headers.split(",").map(h => row[h]).join(",")
                                ).join("\n");

                                const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
                                console.log("CSV Content:", csvContent);
                              }
                                // If counts is a JSON object, convert it to an array for CSV export
                                if (counts && typeof counts === "object" && !Array.isArray(counts)) {
                                // Convert object to array of rows
                                const flatRows = Object.entries(counts).map(([key, value]) => ({
                                  key,
                                  ...value
                                }));
                                const headers = Object.keys(flatRows[0]).join(",");
                                const rows = flatRows.map(row =>
                                  headers.split(",").map(h => row[h]).join(",")
                                ).join("\n");

                                const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
                                const encodedUri = encodeURI(csvContent);
                                const a = document.createElement("a");
                                a.href = encodedUri;
                                a.download = `facilities_report_${exportBody?.col_dims}.csv`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();

                                alert(`Data table ${exportBody?.col_dims} exported as CSV.`);
                                } 
                            } else {
                              alert("Failed to export CSV. Please try again.");
                            }
                          } catch (err) {
                            alert("Error exporting CSV: " + err.message);
                          }
                        }}
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium">CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-5 bg-white border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Filter Label and Select */}
                <div className="flex-1 w-full sm:w-auto">
                  <label htmlFor="report-filter" className="block text-sm font-semibold text-gray-700 mb-3">
                    Report Type
                  </label>
                  <Select
                    id="report-filter"
                    className="w-full sm:min-w-[300px]"
                    classNamePrefix="select"
                    options={[
                      { value: "facilities_by_county", label: "Facilities by County" },
                      { value: "facilities_by_county_by_type", label: "Facilities by County By Type" },
                      { value: "facilities_by_county_by_ownership", label: "Facilities by County by Ownership" },
                      { value: "facilities_by_county_by_keph", label: "Facilities by County by KEPH" },
                      { value: "facilities_by_county_by_bed_and_cots", label: "Facilities by County by Beds/Cots" },
                      { value: "dynamic_report", label: "Dynamic Report" },
                    ]}
                    onChange={(option) => setTab(option.value)}
                    defaultValue={{
                      value: tab,
                      label: tab.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: '44px',
                        borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
                        boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                        '&:hover': {
                          borderColor: '#9CA3AF'
                        }
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
                        color: state.isSelected ? 'white' : '#374151',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#3B82F6' : '#EFF6FF'
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Report Column Dimension Selector */}
            {tab === "dynamic_report" && (
              <div className="col-span-1 md:col-span-5 bg-white border border-gray-200 p-6">
                <div className="w-full">
                  <label htmlFor="column-dimensions" className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Columns <span className="text-gray-500 font-normal">(Maximum 5)</span>
                  </label>
                  <Select
                    id="column-dimensions"
                    isMulti
                    options={dynamicColumnOptions}
                    onChange={handleColumnDimensionChange}
                    value={dynamicColumnOptions.filter(option => columnDimensions.includes(option.value))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Choose columns to include in your report..."
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: '44px',
                        borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
                        boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                        '&:hover': {
                          borderColor: '#9CA3AF'
                        }
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#EFF6FF',
                        borderRadius: '6px'
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#1E40AF',
                        fontWeight: '500'
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#3B82F6',
                        '&:hover': {
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF'
                        }
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
                        color: state.isSelected ? 'white' : '#374151',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#3B82F6' : '#EFF6FF'
                        }
                      })
                    }}
                  />
                  {columnDimensions.length > 0 && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {columnDimensions.length} column{columnDimensions.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Side Filter Section (conditionally rendered) */}
            {tab === "dynamic_report" && (
              <div className="col-span-1 md:col-span-1 flex flex-col gap-3">
                <AnalyticsSideFilters
                  filters={filters}
                  authToken={authToken}
                  user={userCtx}
                  onFiltersChange={handleFiltersChange}
                  filterTree={ANALYTICS_FILTER_TREE_DATA}
                />
              </div>
            )}

            {/* Main Body */}
            {/* Data Indicator section */}
            <div className={`p-4 w-full ${tab === "dynamic_report" ? "md:col-span-4" : "md:col-span-5"} md:h-auto bg-gray-50 shadow-md`}>
              {tab === "dynamic_report" ? (
                isLoadingData ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading analytics data...</span>
                  </div>
                ) : analyticsData && Object.keys(analyticsData).length > 0 ? (
                  <FacilityMatrixTable data={analyticsData} />
                ) : (
                  <div className="flex justify-center items-center py-8 text-gray-600">
                    No data available for the selected filters and dimensions.
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center py-8 text-gray-600">
                  No data available for this report type.
                </div>
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
    counties: "/common/counties/",
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
        const filterData = await fetchPaginatedFilterOptions(paginatedEndpoints[key], token);
        filters[key] = filterData;
      } catch (e) {
        console.error(`Error fetching initial page for ${key}:`, e.message);
        filters[key] = { results: [], next: null, previous: null, count: 0, currentPage: 1, totalPages: 1 };
      }
    }
  }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix-report/?format=json`;

  const initialBody = {
    col_dims: "bed_types",
    report_type: "matrix_report",
    metric: "number_of_facilities",
    row_comparison: "county",
    filters: {},
  };

  try {
    const response = await fetch(url, {
      headers: {
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
      console.error("Failed to fetch initial analytics data:", response.statusText);
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

export default withAuth(FacilityHome);
