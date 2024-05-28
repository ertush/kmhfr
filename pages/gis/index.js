// React imports
import React, { useState, useRef, useEffect, useMemo, useContext } from "react";

// Next imports
import Head from "next/head";
import Link from 'next/link'
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Controller imports
import { checkToken } from "../../controllers/auth/auth";

// Package imports
import * as Tabs from "@radix-ui/react-tabs";

import Select from "react-select";

// Components imports
import MainLayout from "../../components/MainLayout";

import { hasPermission } from "../../utils/checkPermissions";
import { PermissionContext } from "../../providers/permissions";
import { XCircleIcon } from "@heroicons/react/solid";
import { FlagTwoTone } from "@mui/icons-material";

const Gis = (props) => { 

 
  const router = useRouter();

  const userPermissions = useContext(PermissionContext)

  // Temporary fix faulty Kirinyaga id
  const filters = (() => {
    let _filters = props?.filters;
    // filters.county[0].id = 'ecbf61a6-cd6d-4806-99d8-9340572c0015' // correct Kirinyaga county id

    return _filters;
  })();

  let fltrs = filters;

  // console.log({filters: fltrs})

  const formRef = useRef(null);
  // const servicesRef = useRef(null)

  const [isServiceOptionsUpdate, setIsServiceOptionUpdate] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);

  const [isSubCountyOptionsUpdate, setIsSubCountyOptionsUpdate] =
    useState(false);
  const [subCountyOptions, setSubCountyOptions] = useState([]);

  const [isConstituencyOptionsUpdate, setIsConstituencyOptionsUpdate] =
    useState(false);
  const [constituencyOptions, setConstituencyOptions] = useState([]);

  const [isWardOptionsUpdate, setIsWardOptionsUpdate] = useState(false);
  const [wardOptions, setWardOptions] = useState([]);

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

if(filters){

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

  let qf = props?.query?.qf || "all";
  // let [currentQuickFilter, setCurrentQuickFilter] = useState(qf)
  const [drillDown, setDrillDown] = useState({});
  const multiFilters = [
    "service_category",
    "service",
    "county",
    "subcounty",
    "ward",
    "constituency",
  ];

  const headers = [
    "code",
    "official_name",
    "operation_status_name",
    "approved",
    "keph_level_name",
    "facility_type_name",
    "facility_type_parent",
    "owner_name",
    "owner_type_name",
    "regulatory_body_name",
    "number_of_beds",
    "number_of_cots",
    "county_name",
    "constituency_name",
    "sub_county_name",
    "ward_name",
    "admission_status",
    "facility_services",
    "created",
    "closed",
  ];

  const scoped_filters = [
    { name: "keph_level_name", options: [] },
    { name: "facility_type_name", options: [] },
    { name: "facility_type_category", options: [] },
    { name: "owner_name", options: [] },
    { name: "owner_type_name", options: [] },
    { name: "regulatory_body_name", options: [] },
    { name: "county_name", options: [] },
    { name: "constituency_name", options: [] },
    { name: "sub_county_name", options: [] },
    { name: "ward_name", options: [] },
    { name: "operation_status_name", options: [] },
    { name: "admission_status_name", options: [] },
    { name: "open_whole_day", options: [] },
    { name: "open_public_holidays", options: [] },
    { name: "open_weekends", options: [] },
    { name: "open_late_night", options: [] },
    { name: "service_names", options: [] },
    { name: "approved", options: [] },
    { name: "is_public_visible", options: [] },
    { name: "closed", options: [] },
    { name: "is_published", options: [] },
  ];

  if (props?.data?.results?.length > 0) {
    scoped_filters.forEach((filter) => {
      let options = [];
      props.data.results.forEach((r_) => {
        if (
          !options.includes(r_[filter.name]) &&
          r_[filter.name] !== null &&
          r_[filter.name] !== undefined
        ) {
          options.push(r_[filter.name]);
        }
      });
      filter.options = options;
    });
  }
  // console.log('scoped_filters: ',scoped_filters)

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [linelist, setlinelist] = useState(null);
  const [linelist2, setlinelist2] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const onGridReady = (params) => {
  
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => params.api.setRowData(data);

    const lnlst = Array.from(props?.data?.results, (row) => {
      let dtpnt = {};
      headers.forEach((col) => {
        dtpnt[col] = row[col];
      });
      return dtpnt;
    });
    setlinelist(lnlst);
    updateData(lnlst);
  };

  useEffect(() => {

    if(!hasPermission(/^mfl_gis.view_.*$/, userPermissions)){
      router.push('/unauthorized')
  }

    if (fromDate !== "" && toDate !== "") {
      const results = linelist2
        ?.filter(
          (data) =>
            new Date(moment(data.created).format("YYYY/MM/DD")).getTime() >=
              new Date(moment(fromDate).format("YYYY/MM/DD")).getTime() &&
            new Date(moment(data.created).format("YYYY/MM/DD")).getTime() <=
              new Date(moment(toDate).format("YYYY/MM/DD")).getTime()
        )
        .map((r) => {
          return r;
        });
      setlinelist(results);
    } else {
      setlinelist(linelist2);
    }
  }, [fromDate, toDate]);

  const handleAccordionExpand = (ev) => {
    if (isAccordionExpanded) {
      setIsAccordionExpanded(false);
    } else {
      setIsAccordionExpanded(true);
    }
  };

  const Mapp = dynamic(
    () => import("../../components/GISMap"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false,
    } // This line is important. It's what prevents server-side render
  );

  const Map = React.memo(Mapp);

  useEffect(() => {
    // setIsAccordionExpanded(true)
  }, [
    isServiceOptionsUpdate,
    isSubCountyOptionsUpdate,
    isConstituencyOptionsUpdate,
    isWardOptionsUpdate,
    linelist,
    isLoading,
  ]);

  return (
    <>
      <Head>
        <title>KMHFR | GIS Explorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout isLoading={false} isFullWidth={true}>
        <>
          {/* Check for errors and show them */}
          {props?.error ? (
            <div className="w-full flex flex-col gap-5 px-1 md:px-4 p-4 my-4 mx-auto bg-transparent min-h-screen items-center">
              <div className="flex flex-col items-center justify-center bg-red-100  border border-red-300 shadow w-full max-w-screen-sm">
                <h1 className="text-red-700 text-3xl flex items-center gap-x-2">
                  <XCircleIcon className="text-red-500 h-4 w-4 text-5xl" />
                  <span>Error</span>
                </h1>
                <p className="text-red-800 text-lg">
                  {JSON.stringify(props?.err)}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="col-span-5 flex flex-wrap gap-3 md:gap-5 px-4 pt-2 justify-between items-center w-full bg-transparent">
                {/* BREADCRUMB */}
                <div className="flex flex-row items-center justify-between gap-2 md:ml-6 text-sm md:text-base py-3">
                  <Link className="text-gray-700" href="/">
                    Home
                  </Link>
                  {"/"}
                  <span className="text-gray-500">GIS Explorer</span>
                </div>

                {/* TODO: Check the viability of the export button */}

                {/* Aside with filters */}
                <div className="w-full grid grid-cols-6 gap-5 px-1 md:px-4 p-4 mx-auto bg-transparent min-h-screen">
                  {/* Actual Aside */}
                  <aside className="col-span-6 bg-gray-50 md:col-span-3 lg:col-span-2 xl:col-span-1 p-1 md:p-2 flex flex-col lg:gap-3 items-center justify-start shadow-md">
                    {/* Tabs */}
                    <Tabs.Root
                      orientation="horizontal"
                      className="w-full flex flex-col tab-root flex-grow"
                      // TODO: Check the isItUnits thing
                      // defaultValue={isItUnits ? "cunits" : "facilities"}
                      defaultValue={"facilities"}
                      onValueChange={(ev) => {
                        let link2push = `/gis`;
                        if (ev === "facilities") {
                          link2push = `?units=0`;
                        } else if (ev === "cunits") {
                          link2push = `?units=1`;
                        }
                        if (
                          props?.query?.searchTerm &&
                          props?.query?.searchTerm != null &&
                          props?.query?.searchTerm != "" &&
                          props?.query?.searchTerm != undefined
                        ) {
                          link2push += `&searchTerm=${props?.query?.searchTerm}`;
                        }
                        router.push(link2push);
                      }}
                    >
                      <Tabs.List className="list-none flex flex-wrap gap-x-2 px-1 uppercase leading-none tab-list font-semibold border-b items-center">
                        <Tabs.Tab
                          value="facilities"
                          className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-xs sm:text-sm md:text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                        >
                          Facilities
                        </Tabs.Tab>
                        <Tabs.Tab
                          value="cunits"
                          className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-xs sm:text-sm md:text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                        >
                          Community Units
                        </Tabs.Tab>
                      </Tabs.List>

                      {/* Facilities Panel */}
                      <Tabs.Panel
                        value="facilities"
                        className="grow-1 py-1 px-2 tab-panel"
                      >
                        <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                          {/* Result count */}
                          <div className="bg-white w-full p-3 ">
                            {props?.data && props?.data?.results && (
                              <h4 className="text-base md:text-xl tracking-tight font-bold leading-tight">
                                {props?.data?.results?.length}{" "}
                                {props?.data?.results?.length > 1
                                  ? `facilities`
                                  : `facility`}{" "}
                                found.
                              </h4>
                            )}
                          </div>
                          <hr className="my-2" />

                          {/* Filters */}
                          <details
                            className=" bg-transparent py-1 flex flex-col w-full md:stickyz"
                            open
                          >
                            <summary className="flex cursor-pointer w-fulp-0">
                              <h5 className="text-xl font-semibold">Filters</h5>
                            </summary>

                            <div className="flex flex-row items-center justify-start w-full gap-2">
                              {filters && filters?.error ? (
                                <div className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                  <p>No filters.</p>
                                </div>
                              ) : (
                                <>
                                  <form
                                    action="/gis"
                                    className="gap-2 w-full m-1"
                                    ref={formRef}
                                    onSubmit={async (ev) => {
                                      ev.preventDefault();
                                      setIsLoading(true);

                                      const fields =
                                        "code,official_name,operation_status,approved,keph_level,facility_type_name,facility_type_parent,owner,owner_type,regulation_body,number_of_beds,number_of_cots,county,constituency,sub_county,ward,admission_status,facility_services,created,closed";
                                      if (Object.keys(drillDown).length > 0) {
                                        let qry = Object.keys(drillDown)
                                          .map(function (key) {
                                            let er = "";
                                            if (
                                              props.path &&
                                              !props.path.includes(key + "=")
                                            ) {
                                              er =
                                                encodeURIComponent(key) +
                                                "=" +
                                                encodeURIComponent(
                                                  drillDown[key]
                                                );
                                            }
                                            return er;
                                          })
                                          .join("&");
                                        let op = "?";
                                        if (
                                          props.path &&
                                          props.path.includes("?") &&
                                          props.path.includes("=")
                                        ) {
                                          op = "&";
                                        }

                                        setDrillDown({});
                                        if (
                                          router ||
                                          typeof window == "undefined"
                                        ) {
                                          const filterQuery = `${op}${qry}&fields=${fields}`;

                                          try {
                                            const data = await fetch(
                                              `/api/filters/filter/?filter_query=${filterQuery}`
                                            );
                                            data.json().then((r) => {
                                              const _lnlst = Array.from(
                                                r?.results,
                                                (row) => {
                                                  let dtpnt = {};
                                                  headers.forEach((col) => {
                                                    if (
                                                      col == "facility_services"
                                                    ) {
                                                      if (row[col].length > 0) {
                                                        row[col].forEach(
                                                          (service) => {
                                                            dtpnt[col] =
                                                              service.service_name;
                                                          }
                                                        );
                                                      }
                                                    } else {
                                                      dtpnt[col] = row[col];
                                                    }
                                                  });
                                                  return dtpnt;
                                                }
                                              );

                                              setlinelist(_lnlst);
                                            });

                                            //    Close Accordion

                                            setIsLoading(false);
                                            setIsAccordionExpanded(false);
                                          } catch (e) {
                                            console.error(e.message);
                                          }

                                          // router.push(props.path + op + qry)
                                        } else {
                                          if (
                                            typeof window !== "undefined" &&
                                            window
                                          ) {
                                            window.location.href =
                                              props.path + op + qry;
                                          }
                                        }
                                      }
                                    }}
                                  >
                                    {filters &&
                                      Object.keys(filters).length > 0 &&
                                      (() => {
                                        const sorted =
                                          Object.keys(fltrs).sort();

                                        const sortOrder = [
                                          1, 9, 10, 2, 3, 4, 5, 6, 8, 7, 0
                                        ];

                                        return sortOrder.map((v, i) =>
                                          sorted.indexOf(sorted[i]) === v
                                            ? sorted[i]
                                            : sorted[v]
                                        );
                                      })(fltrs).map((ft) => (
                                        <div
                                          key={ft}
                                          className="w-full flex flex-col items-start justify-start gap-1 mb-3"
                                        >
                                          {console.log({ft})}
                                          {
                                            ft && !ft.includes("constituency") &&
                                          <label
                                            htmlFor={ft}
                                            className="text-gray-600 capitalize text-sm"
                                          >
                                            {ft.split("_").join(" ")}
                                          </label>
                                          }

                                          {(() => {
                                            // let serviceOptions = [];
                                            switch (ft) {
                                              case "service_category":
                                                const handleServiceCategoryChange =
                                                  async (ev) => {
                                                    try {
                                                      const data = await fetch(
                                                        `/api/filters/services/?category=${ev.value}`
                                                      );
                                                      data.json().then((r) => {
                                                        const options = [];
                                                        r.results.forEach(
                                                          ({ id, name }) => {
                                                            options.push({
                                                              value: id,
                                                              label: name,
                                                            });
                                                          }
                                                        );

                                                        setServiceOptions(
                                                          options
                                                        );
                                                        setIsServiceOptionUpdate(
                                                          !isServiceOptionsUpdate
                                                        );
                                                      });

                                                      let nf = {};
                                                      if (Array.isArray(ev)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            ev,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        ev &&
                                                        ev !== null &&
                                                        typeof ev ===
                                                          "object" &&
                                                        !Array.isArray(ev)
                                                      ) {
                                                        nf[ft] = ev.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    } catch (e) {
                                                      console.log(e.message);
                                                    }
                                                  };

                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  backgroundColor: 'transparent',
                                  outLine: 'none',
                                  border: 'none',
                                  outLine: 'none',
                                  textColor: 'transparent',
                                  padding: 0,
                                  height: '4px',
                                  width: '100%'
                                }),
                
                              }}
                              
                              className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={
                                                      handleServiceCategoryChange
                                                    }
                                                  />
                                                );

                                              case "service":
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={serviceOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                                );

                                              case "county":
                                                const handleCountyCategoryChange =
                                                  async (ev) => {
                                                    try {
                                                      const dataSubCounties =
                                                        await fetch(
                                                          `/api/filters/subcounty/?county=${ev.value}`
                                                        );
                                                      dataSubCounties
                                                        .json()
                                                        .then((r) => {
                                                          const optionsSubCounty =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsSubCounty.push(
                                                                {
                                                                  value: id,
                                                                  label: name,
                                                                }
                                                              );
                                                            }
                                                          );

                                                          // sub county

                                                          setSubCountyOptions(
                                                            optionsSubCounty
                                                          );
                                                          setIsSubCountyOptionsUpdate(
                                                            !isSubCountyOptionsUpdate
                                                          );
                                                        });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }

                                                    try {
                                                      const dataConstituencies =
                                                        await fetch(
                                                          `/api/filters/subcounty/?county=${ev.value}`
                                                        );
                                                      dataConstituencies
                                                        .json()
                                                        .then((r) => {
                                                          const optionsConstituency =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsConstituency.push(
                                                                {
                                                                  value: id,
                                                                  label: name,
                                                                }
                                                              );
                                                            }
                                                          );

                                                          // set constituencies

                                                          setConstituencyOptions(
                                                            optionsConstituency
                                                          );
                                                          setIsConstituencyOptionsUpdate(
                                                            !isConstituencyOptionsUpdate
                                                          );
                                                        });

                                                      let nf = {};
                                                      if (Array.isArray(ev)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            ev,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        ev &&
                                                        ev !== null &&
                                                        typeof ev ===
                                                          "object" &&
                                                        !Array.isArray(ev)
                                                      ) {
                                                        nf[ft] = ev.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }
                                                  };

                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={
                                                      handleCountyCategoryChange
                                                    }
                                                  />
                                                );

                                              case "sub_county":
                                                const handleConstituencyChange =
                                                  async (ev) => {
                                                    try {
                                                      const dataConstituencies =
                                                        await fetch(
                                                          `/api/filters/ward/?sub_county=${ev.value}`
                                                        );
                                                      dataConstituencies
                                                        .json()
                                                        .then((r) => {
                                                          const optionsWard =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsWard.push({
                                                                value: id,
                                                                label: name,
                                                              });
                                                            }
                                                          );

                                                          // sub county

                                                          setWardOptions(
                                                            optionsWard
                                                          );
                                                          setIsWardOptionsUpdate(
                                                            !isWardOptionsUpdate
                                                          );

                                                          let nf = {};
                                                          if (
                                                            Array.isArray(ev)
                                                          ) {
                                                            nf[ft] =
                                                              (drillDown[ft]
                                                                ? drillDown[
                                                                    ft
                                                                  ] + ","
                                                                : "") +
                                                              Array.from(
                                                                ev,
                                                                (l_) => l_.value
                                                              ).join(",");
                                                          } else if (
                                                            ev &&
                                                            ev !== null &&
                                                            typeof ev ===
                                                              "object" &&
                                                            !Array.isArray(ev)
                                                          ) {
                                                            nf[ft] = ev.value;
                                                          } else {
                                                            delete nf[ft];
                                                          }
                                                          setDrillDown({
                                                            ...drillDown,
                                                            ...nf,
                                                          });
                                                        });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }
                                                  };
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={subCountyOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={handleConstituencyChange}
                                                  />
                                                );

                                  

                                              case "ward":
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={wardOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                                );

                                              default:
                                                return (
                                                  <>
                                                  {
                                                   ft && !ft.includes("constituency") &&
                                                  <Select
                                                    isMulti={multiFilters.includes(
                                                      ft
                                                    )}
                                                    name={ft}
                                                    defaultValue={
                                                      drillDown[ft] || ""
                                                    }
                                                    id={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                                 }
                                                  </>
                                                );
                                            }
                                          })(ft)}
                                        </div>
                                      ))}

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has edits
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_edits"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Approved
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="approved"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Complete
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="complete"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has beds
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_beds"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has cots
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_cots"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open 24 hours
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_24_hrs"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open weekends
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_weekends"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open holidays
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_holidays"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <button
                                      onClick={(ev) => {
                                        router.push({
                                          pathname: "/gis",
                                          query: {
                                            units: "0",
                                            // ...props?.query,
                                            ...drillDown,
                                          },
                                        });
                                      }}
                                      className="bg-black border-2 border-black text-white hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 font-semibold px-5 py-1 text-lg  w-full whitespace-nowrap text-center uppercase"
                                    >
                                      Apply Filters
                                    </button>
                                    <div className="w-full flex items-center py-2 justify-center">
                                      <button
                                        className="cursor-pointer text-sm bg-transparent text-gray-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline"
                                        onClick={(ev) => {
                                          router.push("/gis");
                                        }}
                                      >
                                        Clear filters
                                      </button>
                                    </div>
                                  </form>
                                </>
                              )}
                            </div>
                          </details>
                        </div>
                      </Tabs.Panel>

                      {/* Community Units Panel */}
                      <Tabs.Panel
                        value="cunits"
                        className="grow-1 py-1 px-2 tab-panel"
                      >
                        <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                          {/* Result count */}
                          <div className="bg-white w-full p-3 ">
                            {props?.data && props?.data?.results && (
                              <h4 className="text-base md:text-xl tracking-tight font-bold leading-tight">
                                {props?.data?.results?.length}{" "}
                                {props?.data?.results?.length > 1
                                  ? `community units`
                                  : `community unit`}{" "}
                                found.
                              </h4>
                            )}
                          </div>
                          <hr className="my-2" />

                          {/* Filters */}
                          <details
                            className=" bg-transparent py-1 flex flex-col w-full md:stickyz"
                            open
                          >
                            <summary className="flex cursor-pointer w-full bg-white p-0">
                              <h5 className="text-xl font-semibold">Filters</h5>
                            </summary>

                            <div className="flex flex-row items-center justify-start w-full gap-2">
                              {filters && filters?.error ? (
                                <div className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                  <p>No filters.</p>
                                </div>
                              ) : (
                                <>
                                  <form
                                    action="/gis"
                                    className="gap-2 w-full m-1"
                                    ref={formRef}
                                    onSubmit={async (ev) => {
                                      ev.preventDefault();
                                      setIsLoading(true);

                                      const fields =
                                        "code,official_name,operation_status,approved,keph_level,facility_type_name,facility_type_parent,owner,owner_type,regulation_body,number_of_beds,number_of_cots,county,constituency,sub_county,ward,admission_status,facility_services,created,closed";
                                      if (Object.keys(drillDown).length > 0) {
                                        let qry = Object.keys(drillDown)
                                          .map(function (key) {
                                            let er = "";
                                            if (
                                              props.path &&
                                              !props.path.includes(key + "=")
                                            ) {
                                              er =
                                                encodeURIComponent(key) +
                                                "=" +
                                                encodeURIComponent(
                                                  drillDown[key]
                                                );
                                            }
                                            return er;
                                          })
                                          .join("&");
                                        let op = "?";
                                        if (
                                          props.path &&
                                          props.path.includes("?") &&
                                          props.path.includes("=")
                                        ) {
                                          op = "&";
                                        }

                                        // setDrillDown({})
                                        if (
                                          router ||
                                          typeof window == "undefined"
                                        ) {
                                          const filterQuery = `${op}${qry}&fields=${fields}`;

                                          try {
                                            const data = await fetch(
                                              `/api/filters/filter/?filter_query=${filterQuery}`
                                            );
                                            data.json().then((r) => {
                                              const _lnlst = Array.from(
                                                r?.results,
                                                (row) => {
                                                  let dtpnt = {};
                                                  headers.forEach((col) => {
                                                    if (
                                                      col == "facility_services"
                                                    ) {
                                                      if (row[col].length > 0) {
                                                        row[col].forEach(
                                                          (service) => {
                                                            dtpnt[col] =
                                                              service.service_name;
                                                          }
                                                        );
                                                      }
                                                    } else {
                                                      dtpnt[col] = row[col];
                                                    }
                                                  });
                                                  return dtpnt;
                                                }
                                              );

                                              setlinelist(_lnlst);
                                            });

                                            //    Close Accordion

                                            setIsLoading(false);
                                            setIsAccordionExpanded(false);
                                          } catch (e) {
                                            console.error(e.message);
                                          }

                                          // router.push(props.path + op + qry)
                                        } else {
                                          if (
                                            typeof window !== "undefined" &&
                                            window
                                          ) {
                                            window.location.href =
                                              props.path + op + qry;
                                          }
                                        }
                                      }
                                    }}
                                  >
                                    {filters &&
                                      Object.keys(filters).length > 0 &&
                                      (() => {
                                        const sorted =
                                          Object.keys(fltrs).sort();

                                        const sortOrder = [
                                          1, 9, 0, 10, 2, 3, 4, 5, 6, 8, 7,
                                        ];

                                        return sortOrder.map((v, i) =>
                                          sorted.indexOf(sorted[i]) === v
                                            ? sorted[i]
                                            : sorted[v]
                                        );
                                      })(fltrs).map((ft) => (
                                        <div
                                          key={ft}
                                          className="w-full flex flex-col items-start justify-start gap-1 mb-3"
                                        >
                                          
                                          {
                                            ft && !ft.includes("constituency") &&
                                          <label
                                            htmlFor={ft}
                                            className="text-gray-600 capitalize text-sm"
                                          >
                                            {ft.split("_").join(" ")}
                                          </label>
                                            }

                                          {(() => {
                                            // let serviceOptions = [];
                                            switch (ft) {
                                              case "service_category":
                                                const handleServiceCategoryChange =
                                                  async (ev) => {
                                                    try {
                                                      const data = await fetch(
                                                        `/api/filters/services/?category=${ev.value}`
                                                      );
                                                      data.json().then((r) => {
                                                        const options = [];
                                                        r.results.forEach(
                                                          ({ id, name }) => {
                                                            options.push({
                                                              value: id,
                                                              label: name,
                                                            });
                                                          }
                                                        );

                                                        setServiceOptions(
                                                          options
                                                        );
                                                        setIsServiceOptionUpdate(
                                                          !isServiceOptionsUpdate
                                                        );
                                                      });

                                                      let nf = {};
                                                      if (Array.isArray(ev)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            ev,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        ev &&
                                                        ev !== null &&
                                                        typeof ev ===
                                                          "object" &&
                                                        !Array.isArray(ev)
                                                      ) {
                                                        nf[ft] = ev.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    } catch (e) {
                                                      console.log(e.message);
                                                    }
                                                  };

                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={
                                                      handleServiceCategoryChange
                                                    }
                                                  />
                                                );

                                              case "service":
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={serviceOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                                );

                                              case "county":
                                                const handleCountyCategoryChange =
                                                  async (ev) => {
                                                    try {
                                                      const dataSubCounties =
                                                        await fetch(
                                                          `/api/filters/subcounty/?county=${ev.value}`
                                                        );
                                                      dataSubCounties
                                                        .json()
                                                        .then((r) => {
                                                          const optionsSubCounty =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsSubCounty.push(
                                                                {
                                                                  value: id,
                                                                  label: name,
                                                                }
                                                              );
                                                            }
                                                          );

                                                          // sub county

                                                          setSubCountyOptions(
                                                            optionsSubCounty
                                                          );
                                                          setIsSubCountyOptionsUpdate(
                                                            !isSubCountyOptionsUpdate
                                                          );
                                                        });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }

                                                    try {
                                                      const dataConstituencies =
                                                        await fetch(
                                                          `/api/filters/constituency/?county=${ev.value}`
                                                        );
                                                      dataConstituencies
                                                        .json()
                                                        .then((r) => {
                                                          const optionsConstituency =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsConstituency.push(
                                                                {
                                                                  value: id,
                                                                  label: name,
                                                                }
                                                              );
                                                            }
                                                          );

                                                          // set constituencies

                                                          setConstituencyOptions(
                                                            optionsConstituency
                                                          );
                                                          setIsConstituencyOptionsUpdate(
                                                            !isConstituencyOptionsUpdate
                                                          );
                                                        });

                                                      let nf = {};
                                                      if (Array.isArray(ev)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            ev,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        ev &&
                                                        ev !== null &&
                                                        typeof ev ===
                                                          "object" &&
                                                        !Array.isArray(ev)
                                                      ) {
                                                        nf[ft] = ev.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }
                                                  };

                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={
                                                      handleCountyCategoryChange
                                                    }
                                                  />
                                                );

                                              case "sub_county":
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={subCountyOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(ev) => {
                                                      if (
                                                        subCountyOptions?.length !== 0
                                                      ) {
                                                        let nf = {};
                                                        if (Array.isArray(ev)) {
                                                          nf[ft] =
                                                            (drillDown[ft]
                                                              ? drillDown[ft] +
                                                                ","
                                                              : "") +
                                                            Array.from(
                                                              ev,
                                                              (l_) => l_.value
                                                            ).join(",");
                                                        } else if (
                                                          ev &&
                                                          ev !== null &&
                                                          typeof ev ===
                                                            "object" &&
                                                          !Array.isArray(ev)
                                                        ) {
                                                          nf[ft] = ev.value;
                                                        } else {
                                                          delete nf[ft];
                                                        }
                                                        setDrillDown({
                                                          ...drillDown,
                                                          ...nf,
                                                        });
                                                      }
                                                    }}
                                                  />
                                                );
                                              /* case "constituency":
                                                const handleConstituencyChange =
                                                  async (ev) => {
                                                    try {
                                                      const dataConstituencies =
                                                        await fetch(
                                                          `/api/filters/ward/?constituency=${ev.value}`
                                                        );
                                                      dataConstituencies
                                                        .json()
                                                        .then((r) => {
                                                          const optionsWard =
                                                            [];

                                                          r.results.forEach(
                                                            ({ id, name }) => {
                                                              optionsWard.push({
                                                                value: id,
                                                                label: name,
                                                              });
                                                            }
                                                          );

                                                          // sub county

                                                          setWardOptions(
                                                            optionsWard
                                                          );
                                                          setIsWardOptionsUpdate(
                                                            !isWardOptionsUpdate
                                                          );

                                                          let nf = {};
                                                          if (
                                                            Array.isArray(ev)
                                                          ) {
                                                            nf[ft] =
                                                              (drillDown[ft]
                                                                ? drillDown[
                                                                    ft
                                                                  ] + ","
                                                                : "") +
                                                              Array.from(
                                                                ev,
                                                                (l_) => l_.value
                                                              ).join(",");
                                                          } else if (
                                                            ev &&
                                                            ev !== null &&
                                                            typeof ev ===
                                                              "object" &&
                                                            !Array.isArray(ev)
                                                          ) {
                                                            nf[ft] = ev.value;
                                                          } else {
                                                            delete nf[ft];
                                                          }
                                                          setDrillDown({
                                                            ...drillDown,
                                                            ...nf,
                                                          });
                                                        });
                                                    } catch (e) {
                                                      console.error(e.message);
                                                    }
                                                  };

                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    className="w-full p-1  bg-gray-50 col-start-1"
                                                    options={
                                                      constituencyOptions
                                                    }
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={
                                                      handleConstituencyChange
                                                    }
                                                  />
                                                );*/

                                              case "ward":
                                                return (
                                                  <Select
                                                    id={ft}
                                                    name={ft}
                                                    styles={{
                                                      control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        backgroundColor: 'transparent',
                                                        outLine: 'none',
                                                        border: 'none',
                                                        outLine: 'none',
                                                        textColor: 'transparent',
                                                        padding: 0,
                                                        height: '4px',
                                                        width: '100%'
                                                      }),
                                      
                                                    }}
                                                    
                                                    className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={wardOptions}
                                                    placeholder={
                                                      ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                      ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl)) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                                );

                                              default:
                                                
                                                return (
                                                  <>
                                                  {
                                                    ft !== "constituency" &&
                                                  <Select
                                                    isMulti={multiFilters.includes(
                                                      ft
                                                    )}
                                                    name={ft}
                                                    defaultValue={
                                                      drillDown[ft] || ""
                                                    }
                                                    id={ft}
                                                    styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  backgroundColor: 'transparent',
                                  outLine: 'none',
                                  border: 'none',
                                  outLine: 'none',
                                  textColor: 'transparent',
                                  padding: 0,
                                  height: '4px',
                                  width: '100%'
                                }),
                
                              }}
                              
                              className='flex w-full   placeholder-gray-500 border border-gray-600 outline-none'
                                                    options={Array.from(
                                                      filters[ft] || [],
                                                      (fltopt) => {
                                                        return {
                                                          value: fltopt.id,
                                                          label: fltopt.name,
                                                        };
                                                      }
                                                    )}
                                                    placeholder={
                                                     ft && ft
                                                        .split("_")
                                                        .join(" ")[0]
                                                        .toUpperCase() +
                                                     ft && ft
                                                        .split("_")
                                                        .join(" ")
                                                        .slice(1)
                                                    }
                                                    onChange={(sl) => {
                                                      let nf = {};
                                                      if (Array.isArray(sl) && ft) {
                                                        nf[ft] =
                                                          (drillDown[ft]
                                                            ? drillDown[ft] +
                                                              ","
                                                            : "") +
                                                          Array.from(
                                                            sl,
                                                            (l_) => l_.value
                                                          ).join(",");
                                                      } else if (
                                                        sl &&
                                                        sl !== null &&
                                                        typeof sl ===
                                                          "object" &&
                                                        !Array.isArray(sl)
                                                      ) {
                                                        nf[ft] = sl.value;
                                                      } else {
                                                        delete nf[ft];
                                                      }
                                                      setDrillDown({
                                                        ...drillDown,
                                                        ...nf,
                                                      });
                                                    }}
                                                  />
                                            }
                                            </>
                                                );
                                            }
                                          })(ft)}
                                        </div>
                                      ))}

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has edits
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_edits"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Approved
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="approved"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Complete
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="complete"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has beds
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_beds"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Has cots
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="has_cots"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open 24 hours
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_24_hrs"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open weekends
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_weekends"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="w-auto flex flex-row items-center px-2 justify-start mb-3">
                                      <label
                                        htmlFor="has_edits"
                                        className="text-gray-700 capitalize text-sm flex-grow"
                                      >
                                        Open holidays
                                      </label>
                                      <input
                                        type="checkbox"
                                        value={true}
                                        defaultChecked={
                                          props?.query?.has_edits === "true"
                                        }
                                        name="has_edits"
                                        id="open_holidays"
                                        onChange={(ev) => {
                                          setDrillDown({
                                            ...drillDown,
                                            has_edits: true,
                                          });
                                        }}
                                      />
                                    </div>

                                    <button
                                      onClick={(ev) => {
                                        router.push({
                                          pathname: "/gis",
                                          query: {
                                            units: "0",
                                            // ...props?.query,
                                            ...drillDown,
                                          },
                                        });
                                      }}
                                      className="bg-black border border-black text-white hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 font-semibold px-5 py-1 text-lg  w-full whitespace-nowrap text-center uppercase"
                                    >
                                      Apply Filters
                                    </button>
                                    <div className="w-full flex items-center py-2 justify-center">
                                      <button
                                        className="cursor-pointer text-sm bg-transparent text-black hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline"
                                        onClick={(ev) => {
                                          router.push("/gis");
                                        }}
                                      >
                                        Clear filters
                                      </button>
                                    </div>
                                  </form>
                                </>
                              )}
                            </div>
                          </details>
                        </div>
                      </Tabs.Panel>
                    </Tabs.Root>
                  </aside>

                  {/* Map the results */}
                  <div
                    className="col-span-6 md:col-span-3 lg:col-span-4 xl:col-span-5 flex flex-col gap-4 items-center justify-center bg-blue-100 shadow-lg border border-gray-300"
                    style={{ minHeight: "650px" }}
                  >
                    {/* <pre>{JSON.stringify(props?.data?.results, null, 2)}</pre> */}
                    <Map data={props?.data?.results || []} />
                  </div>
                </div>
              </div>
            </>
          )}
        </>

        {/* Floating div at bottom right of page */}
        {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-gray-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
          <h5 className="text-sm font-bold">
            <span className="text-gray-600 uppercase">Limited results</span>
          </h5>
          <p className="text-sm text-gray-800">
            For testing reasons, downloads are limited to the first 1000
            results.
          </p>
        </div> */}
      
      </MainLayout>
    </>
  );
};

Gis.getInitialProps = async (ctx) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL
  let host = ctx.req ? ctx.req.headers.host : window.location.hostname;
  let yesItIsUnits =
    (ctx?.query &&
      (ctx?.query?.units === "true" || ctx?.query?.units === "1")) ||
    false;

  let all_facilities = [];

  const fetchFilters = (token) => {
    let filters_url =
      API_URL +
      "/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county%2Cward";
    if (
      ctx?.query &&
      ctx?.query?.units &&
      (ctx?.query?.units === "true" || ctx?.query?.units === "1")
    ) {
      filters_url =
        API_URL +
        "/common/filtering_summaries/?fields=county,constituency,ward,chu_status,sub_county,ward";
    }

    return fetch(filters_url, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        return json;
      })
      .catch((err) => {
        console.log("Error fetching filters: ", err);
        return {
          error: true,
          err: err,
          filters: [],
          isUnits: yesItIsUnits,
        };
      });
  };

  const getMorePagedData = async (next_url, token) => {
    return fetch(next_url, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          all_facilities.push(...data.results);
        } else {
          console.log("getData: no results from ", next_url);
        }
        if (data.next) {
          console.log(
            "::::::::::: even more data to be fetched seemingly. ",
            data.next
          );
          return getMorePagedData(data.next, token);
        } else {
          return {
            data: { results: all_facilities },
            query,
            filters: { ...ft },
            path: ctx.asPath || "/gis",
            isUnits: yesItIsUnits,
          };
        }
      });
  };

  const fetchData = (token) => {
    let url =
      API_URL +
      "/facilities/facilities/?fields=id,code,official_name,county,sub_county_name,facility_type_name,owner_name,operation_status_name,name,is_complete,approved_national_level,has_edits,approved,rejected,keph_level,lat_long&page_size=600";
    let query = { searchTerm: "" };
    let other_posssible_filters = [
      "owner_type",
      "service",
      "facility_type",
      "county",
      "service_category",
      "sub_county",
      "keph_level",
      "owner",
      "operation_status",
      "ward",
      "has_edits",
      "is_approved",
      "is_complete",
      "number_of_beds",
      "number_of_cots",
      "open_whole_day",
      "open_weekends",
      "county",
      "sub_county_name",
      "open_public_holidays",
    ];
    if (
      ctx?.query &&
      ctx?.query?.units &&
      (ctx?.query?.units === "true" || ctx?.query?.units === "1")
    ) {
      url =
        API_URL +
        "/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency,lat_long&page_size=600";
      other_posssible_filters = [
        "owner_type",
        "service",
        "facility_type",
        "county",
        "service_category",
        "sub_county",
        "keph_level",
        "owner",
        "operation_status",
        "ward",
        "has_edits",
        "is_approved",
        "is_complete",
        "number_of_beds",
        "number_of_cots",
        "open_whole_day",
        "open_weekends",
        "open_public_holidays",
      ];
    }
    if (ctx?.query?.q) {
      query.searchTerm = ctx.query.q;
      url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`;
    }
    other_posssible_filters.map((flt) => {
      if (ctx?.query[flt]) {
        query[flt] = ctx?.query[flt];
        url += "&" + flt + "=" + ctx?.query[flt];
      }
    });

    if (ctx?.query?.page) {
      url = `${url}&page=${ctx.query.page}`;
    }
    console.log("running fetchData(" + url + ")");
    return fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((json) => {
        return fetchFilters(token).then((ft) => {
          ///////
          // console.log('JSON:::: ', Object.keys(json))
          all_facilities.push(...json.results);
          if (json.next) {
            if (!host.includes("productiondomainname")) {
              // limiting to 600 for now globally. Replace with prod domain name when going live to delimit
              return {
                data: { results: all_facilities },
                query,
                filters: { ...ft },
                path: ctx.asPath || "/gis",
                isUnits: yesItIsUnits,
              };
            }
            return getMorePagedData(json.next, token).then((data) => {
              console.log("multi pages, pulling from: ", json.next);
              return data;
            });
          } else {
            return {
              data: { results: all_facilities },
              query,
              filters: { ...ft },
              path: ctx.asPath || "/gis",
              isUnits: yesItIsUnits,
            };
          }
          ///////
        });
      })
      .catch((err) => {
        console.log("Error fetching facilities: ", err);
        return {
          error: true,
          err: err,
          data: [],
          query: {},
          path: ctx.asPath || "/gis",
          current_url: "",
        };
      });
  };

  return checkToken(ctx.req, ctx.res)
    .then((t) => {
      if (t.error) {
        throw new Error("Error checking token");
      } else {
        let token = t.token;
        return fetchData(token).then((t) => t);
      }
    })
    .catch((err) => {
      console.log("Error checking token: ", err);
      if (typeof window !== "undefined" && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        } else {
          window.location.href = "/gis";
        }
      }
      setTimeout(() => {
        return {
          error: true,
          err: err,
          data: [],
          query: {},
          path: ctx.asPath || "/gis",
          current_url: "",
          isUnits: yesItIsUnits,
        };
      }, 100);
    });
};

export default Gis;

//     http://localhost:8061/api/gis/drilldown/facility/?format=json returns [ 'name', 'lat', 'lng', 'county', 'constituency', 'ward', ]