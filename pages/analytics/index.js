import Head from "next/head";
import MainLayout from "../../components/MainLayout";
import { DownloadIcon, PlusIcon } from "@heroicons/react/solid";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { getUserDetails } from "../../controllers/auth/auth";
import Select from "react-select";
import { FacilityMatrixTable } from "../../components/FacilityMatrixTable.js";

// @mui imports
import AnalyticsSideFilters from "../../components/AnalyticsSideFilters";
import { UserContext } from "../../providers/user";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import withAuth from "../../components/ProtectedRoute";

function FacilityHome(props) {
  const router = useRouter();

  // const facilities = props?.data?.results
  const filters = props?.filters;

  const fltrs = props?.filters;

  const userCtx = useContext(UserContext);

  const groupID = userCtx?.groups[0]?.id;

  const userCounty = userCtx?.user_counties[0]?.county;

  const userSubCounty = userCtx?.user_sub_counties[0]?.sub_county;

  const [searchTerm, setSearchTerm] = useState("");

  const [facilityStatus, setFacilityStatus] = useState("");

  // const qf = props?.query?.qf ?? null

  if (filters && typeof filters === "object") {
    filters["has_edits"] = [{ id: "has_edits", name: "Has edits" }];
    filters["is_approved"] = [{ id: "is_approved", name: "Is approved" }];
    filters["is_complete"] = [{ id: "is_complete", name: "Is complete" }];
    filters["number_of_beds"] = [
      { id: "number_of_beds", name: "Number of beds" },
    ];
    filters["number_of_cots"] = [
      { id: "number_of_cots", name: "Number of cots" },
    ];
    filters["open_whole_day"] = [
      { id: "open_whole_day", name: "Open whole day" },
    ];
    filters["open_weekends"] = [{ id: "open_weekends", name: "Open weekends" }];
    filters["open_public_holidays"] = [
      { id: "open_public_holidays", name: "Open public holidays" },
    ];
    delete fltrs.has_edits;
    delete fltrs.is_approved;
    delete fltrs.is_complete;
    delete fltrs.number_of_beds;
    delete fltrs.number_of_cots;
    delete fltrs.open_whole_day;
    delete fltrs.open_weekends;
    delete fltrs.open_public_holidays;
  }

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

  const [appliedFilters, setAppliedFilters] = useState({});

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

  // FilterOptions
  const countyFilterOptions = filters?.county?.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const [subCountyFilterOptions, setSubCountyFilterOptions] = useState(
    (prev) => {
      if (!prev) return [];
      return filters?.sub_county?.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
    }
  );

  const [wardFilterOptions, setWardFilterOptions] = useState(() =>
    filters?.ward?.map(({ id, name }) => ({ value: id, label: name }))
  );
  const [constituencyFilterOptions, setConstituencyFilterOptions] = useState(
    () =>
      filters?.constituency?.map(({ id, name }) => ({ value: id, label: name }))
  );
  const facilityTypeFilterOptions = filters?.facility_type?.map(
    ({ id, name }) => ({ value: id, label: name })
  );
  const facilityTypeDetailsFilterOptions = filters?.facility_type_details?.map(
    ({ id, name }) => ({ value: id, label: name })
  );
  const kephLevelFilterOptions = filters?.keph_level?.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const ownerTypeFilterOptions = filters?.owner_type?.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const ownerFilterOptions = filters?.owner?.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  // const serviceFilterOptions = filters['service']?.map(({ id, name }) => ({ value: id, label: name }))
  const operationStatusFilterOptions = filters?.operation_status?.map(
    ({ id, name }) => ({ value: id, label: name })
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
  }, []);

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
        // console.log({})
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

      // return (await filteredOrgUnits?.json())?.results
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
    // const params = Object.fromEntries(pageParams.entries())

    router.push({
      pathname: "/facilities",
      query: {
        next: Buffer.from(`${props?.next}`).toString("base64"),
        ...userOrgUnit,
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),

        //default: page_size=30

        // ...params
      },
    });
  }

  function handlePrevious() {
    // const params = Object.fromEntries(pageParams.entries())

    router.push({
      pathname: "/facilities",
      query: {
        previous: Buffer.from(`${props?.previous}`).toString("base64"),
        ...userOrgUnit,
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),

        //default: page_size=30
        //...params
      },
    });
  }

  function handlePageLoad(e) {
    const page = e.target.innerHTML;

    // const params = Object.fromEntries(pageParams.entries())

    router.push({
      pathname: "/facilities",
      query: {
        page,
        ...userOrgUnit(),
        ...(() => (searchTerm !== "" ? { q: searchTerm } : {}))(),

        // ...params
      },
    });
  }

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
              <AnalyticsSideFilters />
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
                <AnalyticsSideFilters
                  onApplyFilters={setAppliedFilters}
                  filters={filters}
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
                />
              )}
            </button>

            {/* Main Body */}
            {/* Data Indicator section */}
            <div className="p-4 w-full col-span-1 md:col-span-4 mr-24 md:col-start-2  md:h-auto bg-gray-50 shadow-md">
              {/* <pre>{JSON.stringify(props?.data, null, 2)}</pre> */}
              <FacilityMatrixTable
                data={props?.data}
                filters={appliedFilters}
                /* ...otherProps */
              />
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

  const countyId = ctx.req.county_id;

  const token = (await checkToken(ctx.req, ctx.res))?.token;

  let url = `${process.env.NEXT_PUBLIC_API_URL}/analytics/matrix-report/?format=json`;


  const body = {
    // col_dims: "keph_level__name,bed_types",
    col_dims: "bed_types",
    report_type: "matrix_report",
    metric: "number_of_facilities",
    row_comparison: "county",
    filters: {
      // period: { startdate: "2020-01-01", enddate: "2025-01-31" },
      counties: [
        "b6b5db70-609a-4194-888d-7841e02e9045",
        "95b08378-362e-4bf9-ad63-d685e1287db2",
        "3452caf6-ee29-4ac7-813e-49702fec8c41",
        "6c34a4b5-af53-44f9-9c1e-17fdf438dc1f",
        "bbc8803a-7d6f-411a-96f3-5f8472b40405",
        "6f256e8c-5d8f-4f07-89a0-81e245081030",
        "fdde0ed3-33a8-4525-950e-41af384defb9",
        "6c34a4b5-af53-44f9-9c1e-17fdf438dc1f",
        "bbc8803a-7d6f-411a-96f3-5f8472b40405",
        "6f256e8c-5d8f-4f07-89a0-81e245081030",
        "fdde0ed3-33a8-4525-950e-41af384defb9",
        "72366abd-2797-4144-8c74-c831810ec0a2",
        "6746a019-8f92-4883-ae6d-2e4fd83c7a4e",
        "44cce67d-c163-4229-ac4a-c0b418601246",
        "ac84672f-db61-41b8-83f8-dc484060c86a",
        "cea1878f-be8a-46f9-9b3b-b6089977892f",
        "7a116274-e48c-4015-b763-c6443b0cdad1",
        "359719c8-25f3-49b3-8549-bd5fbb99f2c1",
        "93b9ddc8-a4c2-4c15-8b0b-599aa10af865",
        "b6f366e9-3050-40ca-9643-ddc7c18ccd96",
        "6c336c99-969b-4e9f-ad6b-c66f761ac9d5",
        "7c942357-44a8-49c9-9ca6-8247ad903b57",
        "ea02a4fd-f70f-4b8b-aff2-ae7c26b136fa",
        "c9001ff3-e484-45e9-930b-7657196e0556",
        "1283e6ea-077d-4d32-8099-6d6acb428fd1",
        "916c0672-76d9-454e-9688-1ad83b576735",
        "0a629644-41eb-44b8-a004-e56f06b3c006",
        "06850fa7-fbef-47b8-abb2-4954a444e1f0",
        "bb728208-372a-4ed3-aa5f-c1fda14cd720",
      ],
      owners: [
        "ffad4810-0bfb-4434-84cb-d2ab9b911c41",
        "ca268e6b-7e45-4264-97bf-43b6c68fb21e",
      ],
      facility_types: [
        "8949eeb0-40b1-43d4-a38d-5d4933dc209f",
        "1f1e3389-f13f-44b5-a48e-c1d2b822e5b5",
      ],
      regulatory_bodies: [
        "baea1c8b-ce63-47b3-8b0b-eb8f9d2d6afb",
        "0c19f000-d9df-4ada-ba95-b4367dfb5296",
      ],
      infrastructure_categories: [
        "4fcdcbaa-99e6-4bcd-83df-4bff71e9fdde",
        "bcce5d62-656f-4ed6-ba1f-16eafb670816",
        "467a324b-ac2f-40c2-a1db-db1e17f8885c",
      ],
    },
  };

  try {
    data = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, max-age=0",
        "User-Agent": "node",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!!data) {
      data = await data.json();
      console.log(data);
    }
  } catch (e) {
    console.error("Error message:", e.message);
  }

  return {
    props: {
      data,
    },
  };
}

export default withAuth(FacilityHome);
