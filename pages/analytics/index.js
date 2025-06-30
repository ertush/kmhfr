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
  const [analyticsData, setAnalyticsData] = useState(props?.data);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const [drillDown, setDrillDown] = useState({});

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [title, setTitle] = useState("Facilities Analysis");

  // quick filter themes
  const [khisSynched, setKhisSynched] = useState(false);
  const [facilityFeedBack, setFacilityFeedBack] = useState([]);
  const [pathId, setPathId] = useState(props?.path?.split("id=")[1] || "");
  const [allFctsSelected, setAllFctsSelected] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Function to transform selected filters to API body format
  const transformFiltersToAPIBody = (selectedFilters) => {
    const body = {
      col_dims: "bed_types",
      report_type: "matrix_report",
      metric: "number_of_facilities",
      row_comparison: "county",
      filters: {},
    };

    // Map level selections to row_comparison
    if (selectedFilters.national) {
      body.row_comparison = "national";
    } else if (selectedFilters.county) {
      body.row_comparison = "county";
    } else if (selectedFilters["sub-county"]) {
      body.row_comparison = "sub_county";
    } else if (selectedFilters.ward) {
      body.row_comparison = "ward";
    }

    // Mapping selected UUIDs back to their API filter categories.
    const filterIdToCategoryMap = {};
    for (const categoryKey in filters) {
      const categoryData = filters[categoryKey];
      if (categoryData && categoryData.results && Array.isArray(categoryData.results)) {
        categoryData.results.forEach(item => {
          filterIdToCategoryMap[item.id] = categoryKey;
        });
      }
    }

    for (const filterId in selectedFilters) {
      if (selectedFilters[filterId] === true) {
        // Skip static 'level' filters as they are handled by row_comparison
        if (['national', 'county', 'sub-county', 'ward', 'by-service-category', 'by-service-availability'].includes(filterId)) {
          continue;
        }

        const category = filterIdToCategoryMap[filterId];
        if (category) {
          let apiFilterKey = category;
          
          if (category === 'owner_types') {
            apiFilterKey = 'owners';
          } else if (category === 'regulating_bodies') {
            apiFilterKey = 'regulatory_bodies';
          } else if (category === 'facility_status') {
            apiFilterKey = 'operation_status';
          } else if (category === 'keph_level') {
            apiFilterKey = 'keph_levels';
          }

          if (!body.filters[apiFilterKey]) {
            body.filters[apiFilterKey] = [];
          }
          body.filters[apiFilterKey].push(filterId);
        } else {
          console.warn(`Selected filter ID ${filterId} not found in filterIdToCategoryMap. It might be a static filter or an unmapped dynamic filter.`);
        }
      }
    }

    return body;
  };

  // Function to fetch analytics data with current filters
  const fetchAnalyticsData = async (currentSelectedFilters = {}) => {
    setIsLoadingData(true);
    
    try {
      const body = transformFiltersToAPIBody(currentSelectedFilters);
      
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
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFiltersChange = (newFilters, filterKey, filterValue, nodeId) => {
    setAnalyticsFilters(newFilters);
    // Debounce the API call to avoid too many requests
    clearTimeout(window.analyticsFilterTimeout);
    window.analyticsFilterTimeout = setTimeout(() => {
      fetchAnalyticsData(newFilters);
    }, 500);
  };

  // Initial fetch of analytics data when component mounts and token is available
  useEffect(() => {
    if (authToken) {
      fetchAnalyticsData(analyticsFilters);
    }
  }, [authToken]);

  if (isClient) {
    return (
      <>
        <Head>
          <title>KMHFR | Facilities</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
          <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
            {/* Header Matters */}
            <div className="col-sapn-1 md:col-span-5 flex flex-col gap-3 ">
              {/* Buttons section */}

              <div className="flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between">
                <div className="flex w-full flex-wrap items-start md:items-center justify-between gap-2 text-sm md:text-base py-1">
                  {/* Bread Crumbs */}

                  <div
                    className={
                      "col-span-1 md:col-span-5 flex justify-between w-full bg-django-blue border drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-start md:items-center border-l-8 " +
                      (true ? "border-gray-700" : "border-red-600")
                    }
                  >
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 capitalize gap-2">
                      {title}
                    </h2>
                    <Menu as="div" className="relative">
                      <Menu.Items
                        as="ul"
                        className="absolute top-0 left-[100%] w-auto flex flex-col gap-y-1 items-center justify-start bg-white  shadow-lg border border-gray-200 p-1"
                      >
                        <Menu.Item
                          as="li"
                          className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
                        >
                          {({ active }) => (
                            <button
                              className={
                                "flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " +
                                (active ? "bg-gray-200" : "")
                              }
                              onClick={() => {
                                window.location.href = `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?&access_token=${props?.token}&format=csv&page_size=${props?.count}&page=1${orgUnitFilter}`;
                              }}
                            >
                              <DownloadIcon className="w-4 h-4 mr-1" />
                              <span className="text-base uppercase font-semibold">
                                CSV
                              </span>
                            </button>
                          )}
                        </Menu.Item>

                        <Menu.Item
                          as="li"
                          className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
                        >
                          {({ active }) => (
                            <button
                              className={
                                "flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " +
                                (active ? "bg-gray-200" : "")
                              }
                              onClick={() => {
                                window.location.href = orgUnitFilter
                                  ? `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?access_token=${props?.token}&format=excel&page_size=${props?.count}&page=1${orgUnitFilter}`
                                  : `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?access_token=${props?.token}&format=excel&page_size=${props?.count}&page=1`;
                              }}
                            >
                              <DownloadIcon className="w-4 h-4 mr-1" />
                              <span className="text-base uppercase font-semibold">
                                Excel
                              </span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Menu Filters Wide View port*/}
            <div className="hidden md:flex col-span-1">
              <AnalyticsSideFilters 
                filters={filters}
                authToken={authToken}
                onFiltersChange={handleFiltersChange} 
              />
            </div>

            <button
              className="md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Facility Menu
              {!isMenuOpen && (
                <KeyboardArrowRight className="w-8 aspect-square text-gray-800" />
              )}
              {isMenuOpen && (
                <KeyboardArrowDown className="w-8 aspect-square text-gray-800" />
              )}
              {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white z-10 shadow-lg">
                  <AnalyticsSideFilters
                    filters={filters}
                    authToken={authToken}
                    states={[
                      khisSynched,
                      facilityFeedBack,
                      pathId,
                      allFctsSelected,
                      title,
                    ]}
                    stateSetters={[
                      setKhisSynched,
                      setFacilityFeedBack,
                      setPathId,
                      setAllFctsSelected,
                      setTitle,
                    ]}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              )}
            </button>

            {/* Main Body */}
            {/* Data Indicator section */}
            <div className="p-4 w-full col-span-1 md:col-span-4 mr-24 md:col-start-2  md:h-auto bg-gray-50 shadow-md">
              {isLoadingData ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading analytics data...</span>
                </div>
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
    counties: "/common/counties/",
    sub_counties: "/common/sub_counties/",
    wards: "/common/wards/",
    facility_types: "/facilities/facility_types/",
    keph_level: "/facilities/keph/",
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
