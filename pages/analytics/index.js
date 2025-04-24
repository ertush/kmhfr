import Head from "next/head";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { DownloadIcon, PlusIcon } from "@heroicons/react/solid";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import {
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { Select as CustomSelect } from "../../components/Forms/formComponents/Select";
import { getUserDetails } from "../../controllers/auth/auth";
import Select from "react-select";

// @mui imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import AnalyticsSideFilters from "../../components/AnalyticsSideFilters";
import { UserContext } from "../../providers/user";
import { Formik, Form, Field } from "formik";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import withAuth from "../../components/ProtectedRoute";
import { v4 as uuid } from "uuid";

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
  const [title, setTitle] = useState(
    "Facilities Analysis By Level Type County"
  );

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

  const handleFiltersSubmit = useCallback((event) => {
    event.preventDefault();

    const formDataEntries = new FormData(event.target);

    const formData = {};

    for (let [k, v] of formDataEntries.entries()) {
      if (v !== "") {
        if (k == "facility_type_category") {
          formData["facility_type"] = v;
        } else {
          formData[k] = v;
        }
      }
    }

    // const formData = Object.fromEntries(formDataEntries)

    // console.log({formData})

    // return

    router.push({
      pathname: "/facilities",
      query: formData,
    });
  }, []);

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
                    {/* dropdown options to download data */}
                    {props?.current_url && props?.current_url.length > 5 && (
                      <Menu as="div" className="relative">
                        {/* Button group */}

                        {/* Display add facility button if  user belong to SCHRIO group */}
                        {/* <div className="flex flex-col z-40 gap-5 md:flex-row md:items-center md:space-x-6 w-auto">

                          {
                          (userCtx?.groups[0]?.id == 2 ||
                            userCtx?.groups[0]?.id == 7) && ( /

                            <Menu.Item
                              as="div"
                              className="px-3 py-2 bg-gray-600 rounded text-white text-md tracking-tighter font-semibold whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase"
                            >
                              <button
                                onClick={() => {
                                  router.push("/facilities/add?formId=0");
                                }}
                                className="flex items-center justify-center"
                              >
                                <span className="text-base uppercase font-semibold">
                                  Add Facility
                                </span>
                                <PlusIcon className="w-4 h-4 ml-2" />
                              </button>
                            </Menu.Item>
                          )}

                          <Menu.Button
                            as="button"
                            className="px-3 py-2 bg-gray-600 rounded text-white text-md tracking-tighter font-semibold flex items-center justify-center whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase"
                          >
                            <DownloadIcon className="w-5 h-5 mr-1" />
                            <span className="text-base uppercase font-semibold">
                              Export
                            </span>
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                          </Menu.Button>
                        </div> */}

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
                    )}
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
            <div className="w-full col-span-1 md:col-span-4 mr-24 md:col-start-2  md:h-auto bg-gray-50 shadow-md">
              {/* Data Indicator section */}
              <div className="w-full p-2 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-400">
                {/* search input */}
                <div className="flex max-w-max gap-2  items-end">
                  {pageParams.get("filter") ===
                    "updated_pending_validation_facilities" && (
                    <Select
                      className="flex-grow min-w-max h-full"
                      options={[
                        {
                          label: "Approved National",
                          value: "approved_national_level:true",
                        },
                        {
                          label: "Pending Validation",
                          value: "approved:false",
                        },
                      ]}
                      placeholder="Select Facility Status"
                      onChange={handleApprovalStatus}
                      defaultValue={""}
                      name="approval_status"
                    />
                  )}
                </div>
              </div>
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        County
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Facility Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ownership
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        rowSpan="36"
                      >
                        Baringo
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Dispensary
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Public
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        89
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        rowSpan="36"
                      >
                        256
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Dispensary
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Private
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        45
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Dispensary
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        FBO
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        14
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Dispensary
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        NGO
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Medical Clinic
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Public
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Medical Clinic
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Private
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        15
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                        Kenya
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold"
                        colSpan="2"
                      >
                        Total Facilities
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                        12,460
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
  ctx?.res?.setHeader("Cache-Control", "no-cache, no-store, max-age=0");

  async function fetchFilters(token) {
    // const filtersURL = `${process.env.NEXT_PUBLIC_API_URL}/common/filtering_summaries/?fields=county,facility_type,facility_type_details,constituency,ward,operation_status,service_category,owner_type,owner,service,keph_level,sub_county`

    let result = {};

    const fetchResource = async (endpoint, resource = null) => {
      if (
        resource === "facility_type" ||
        resource === "facility_type_details" ||
        resource === "keph_level"
      ) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return (await response.json())?.results;
        } catch (e) {
          if (e instanceof TypeError) {
            console.error("Error: ", e.message);
          }
          return undefined;
        }
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return await response.json();
        } catch (e) {
          if (e instanceof TypeError) {
            console.error("Error: ", e.message);
          }
        }
      }
    };

    result["facility_type"] = await fetchResource(
      "/facilities/facility_types/?is_parent=true&fields=id,name",
      "facility_type"
    );
    result["facility_type_details"] = await fetchResource(
      "/facilities/facility_types/?is_parent=false&fields=id,name",
      "facility_type_details"
    );
    result["keph_level"] = await fetchResource(
      "/facilities/keph/?is_active=true&fields=id,name",
      "keph_level"
    );
    result = {
      ...result,
      ...(await fetchResource(
        "/common/filtering_summaries/?fields=county,sub_county,constituency,ward,owner,owner_type,operation_status"
      )),
    };

    return result;
  }

  const token = (await checkToken(ctx.req, ctx.res))?.token;

  const nextURL = ctx?.query?.next
    ? Buffer.from(ctx?.query?.next, "base64").toString()
    : null;

  const page = ctx?.query?.page;

  const { response: user } = await getUserDetails(
    token,
    `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`
  );

  const userGroup = user?.groups[0]?.id;

  // const nextURL = ctx?.query?.next

  const previousURL = ctx?.query?.previous
    ? Buffer.from(ctx?.query?.previous, "base64").toString()
    : null;

  // const previousURL = ctx?.query?.previous

  const defaultURL = ctx?.query?.q
    ? `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`
    : `${
        `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/` +
        `${page ? "?page=" + page + "&" : "?"}` /*+ 'page_size=30'*/
      }`;

  let url = nextURL ?? previousURL ?? defaultURL;

  const filters = await fetchFilters(token);

  // console.log({filters})

  let facilities;

  let query = { searchTerm: "" };

  if (ctx?.query?.qf) {
    query.qf = ctx.query.qf;
  }

  for (let [k, v] of Object.entries(ctx.query)) {
    if (k !== "filter") {
      url = `${url}&${k}=${v}`;
    } else {
      if (v === "feed_back_facilities") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_service_ratings/`;
      }
    }

    if (k == "mfl_code_null") {
      url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/regulator_sync/?${k}=${v}&page_size=10`;
    }
  }

  let current_url = url + "&page_size=100";
  if (ctx?.query?.page) {
    url = `${url}&page=${ctx.query.page}`;
  }

  try {
    if (user?.user_sub_counties.length == 2 && userGroup === 2) {
      url = `${url}&sub_county=${user?.user_sub_counties[0]?.sub_county},${user?.user_sub_counties[1]?.sub_county}`;
    } else {
      if (userGroup === 1) {
        // CHRIO

        if (!url.includes("&county")) {
          const userCountyID = user?.county;
          url = `${url}&county=${userCountyID}`;
        }
      } else if (userGroup === 2) {
        // SCHRIO

        if (!url.includes("&sub_county")) {
          const userSubCountyIDs =
            user?.user_sub_counties.length > 1
              ? user?.user_sub_counties
                  .map(({ sub_county }) => sub_county)
                  ?.join(",")
              : user?.user_sub_counties[0]?.sub_county;
          url = `${url}&sub_county=${userSubCountyIDs}`;
        }
      }
    }

    const requestURL = new URL(url);

    requestURL.searchParams.delete("filter", "non_operational_facilities");

    url = requestURL.href;

    console.log({ url });

    facilities = await (
      await fetch(url, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache, no-store, max-age=0",
          Connection: "keep-alive",
          "User-Agent": "node",
          Connection: "Keep-alive",
          Cookie:
            "csrftoken=TWwwgEp9niKNTM6aEefeZXahYkVNFCTd5tA9quiwwZOnaFh1v0uw0qrvAJpGQ3pp; sessionid=kxu16hggcmqxte06cqpv01ao4h230nv7",
          Host: "api.kmhfltest.health.go.ke",
          Priority: "u=0, i",
        },
      })
    ).json();

    console.log({ facilities });
  } catch (e) {
    console.error("Error message:", e.message);
  }

  if (
    facilities?.results &&
    Array.isArray(facilities?.results) &&
    facilities?.results.length > 0
  ) {
    // console.log({facilities})
    return {
      props: {
        facilities: facilities?.results ?? null,
        next: facilities?.next ?? null,
        previous: facilities?.previous ?? null,
        filters,
        path: ctx.asPath || "/facilities",
        current_url,
        current_page: facilities?.current_page ?? null,
        total_pages: facilities?.total_pages ?? null,
        count: facilities?.count ?? null,
        page_size: facilities?.page_size ?? null,
        query,
        token,
      },
    };
  }

  return {
    props: {
      facilities: [],
      next: null,
      previous: null,
      filters: null,
      path: ctx.asPath || "/facilities",
      current_url,
      current_page: 0,
      total_pages: 0,
      count: 0,
      page_size: 0,
      query,
      token: null,
    },
  };
}

export default withAuth(FacilityHome);
