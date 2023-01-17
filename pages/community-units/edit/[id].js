import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import MainLayout from "../../../components/MainLayout";
import { checkToken } from "../../../controllers/auth/auth";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Select from "react-select";
import { UserContext } from "../../../providers/user";
import { useRouter } from 'next/router'
import { useAlert } from "react-alert";
import CommunityUnitSideMenu from "../../../components/CommunityUnitSideMenu";
import Link from 'next/link';


const CommUnit = (props) => {
  const facilities = props.facility_data.results;
  const router = useRouter()
  const alert = useAlert()

  let cu = props.data;
  let _id = cu.id;

  // State of the different tabs
  const [chulId, setchulId] = useState("");
  const [formData, setFormData] = useState({});
  const [contactCHEW, setContactCHEW] = useState([...cu.health_unit_workers]);
  const [contactList, setContactList] = useState([...cu.contacts]);
  const contact_type = props.contact_type;
  const [countyValue, setCountyValue] = useState('');
  const [subCountyValue, setSubCountyValue] = useState('');
  const [constituencyValue, setConstituencyValue] = useState('');
  const [wardValue, setWardValue] = useState('');

  // Services states
  const [selectedServices, setSelectedServices] = useState(cu.services);

  const [user, setUser] = useState(null);

  const userCtx = useContext(UserContext);
  let operation_status = [
    {
      value: "2943e6c1-a581-461e-85a4-b9f25a2674ab",
      label: "Closed",
    },
    {
      value: "bac8ab50-1dad-4f96-ab96-a18a4e420871",
      label: "Non-functional",
    },
    {
      value: "fbc7fce5-3328-4dad-af70-0ec3d8f5ad80",
      label: "Semi-functional",
    },
    {
      value: "50ef43f0-887c-44e2-9b09-cfa7a7090deb",
      label: "Fully-functional",
    },
  ]

  useEffect(() => {
    if (userCtx) setUser(userCtx);
  }, [cu]);

  const handleChange = (e) => {
    const newObj = {};
    if (
      e.target.name === "first_name" ||
      e.target.name === "last_name" ||
      e.target.name === "is_incharge"
    ) {
      let data = [...contactCHEW];
      newObj["health_unit_workers"] = {};
      e.target.type == "checkbox"
        ? (data[e.target.id][e.target.name] = e.target.checked)
        : (data[e.target.id][e.target.name] = e.target.value);
      newObj["health_unit_workers"] = data.map((hu_w) => {
        return {
          ...hu_w,
          first_name: hu_w.first_name,
          last_name: hu_w.last_name,
          is_incharge: hu_w.is_incharge
        };
      }
      );
      setFormData({ ...formData, ...newObj });
    } else if (e.target.name == 'contact_type' || e.target.name == 'contact') {
      let data = [...contactList];
      newObj['contacts'] = {}
      data[e.target.id][e.target.name] = e.target.value
      newObj['contacts'] = data.map((s) => { return { ...s, contact_type: s.contact_type, contact: s.contact } })
      setFormData({ ...formData, ...newObj });
    } else {
      newObj[e.target.name] = {};
      newObj[e.target.name] = e.target.name;
      newObj[e.target.name] = e.target.value;
      setFormData({ ...formData, ...newObj });
    }
  };

  const handleContactAdd = (e) => {
    e.preventDefault();
    setContactList((s) => {
      return [...s, { contact_type: "", contact: "" }];
    });
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    setContactCHEW((s) => {
      return [...s, { first_name: "", last_name: "", is_incharge: false }];
    });
  };

  const remove = (e, index, id) => {
    e.preventDefault();
    if (id !== undefined) {
      try {
        fetch(`/api/chus/path=del_worker&id=${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      const l = formData.health_unit_workers.splice(index, 1)
      setContactCHEW((current) => current.filter((item, ind) => ind !== index));
    }
  };

  const handleBasicDetails = (event) => {
    event.preventDefault();
    let payload = { basic: formData, ...formData };

    try {
      fetch(`/api/common/submit_form_data/?path=chul_data&id=${_id}`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
        },
        method: "PATCH",
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.details) {
            alert.danger('Failed to update Community Unit')
          } else {
            alert.success('Community Unit Updated successfully ')
          }
        });
    } catch (e) {
      alert.danger("Unable to update CHU edit details".e.message)
    }
  };

  const handleCHEWs = (event) => {
    event.preventDefault();
    try {
      fetch(`/api/common/submit_form_data/?path=edit_chul&id=${_id}`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
        },
        method: "PATCH",
        body: JSON.stringify({ ...formData }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.details) {
            alert.danger('Failed to update Community Unit')
          } else {
            alert.success('Community Unit Updated successfully ')
          }
        });
    } catch (e) {
      alert.danger("Unable to update CHU Chew details".e.message)
    }
  };

  const handleServices = async (event) => {
    event.preventDefault();

    const _payload = selectedServices.map((s) => ({ health_unit: s.health_unit, service: s.service }));

    try {
      fetch(`/api/common/submit_form_data/?path=edit_chul&id=${cu?.id}`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
        },
        method: 'PATCH',
        body: JSON.stringify({ services: _payload }),
      }).then(res => res.json()).then((res) => {
        if (res.details) {
          alert.danger('Failed to update Community Unit')
        } else {
          alert.success('Community Unit Updated successfully ')
        }
        router.push('/community-units')
      })
    } catch (e) {
      alert.danger("Unable to update CHU edit service details".e.message)
    }

    window.sessionStorage.setItem("formId", 1);
    // setFormId(window.sessionStorage.getItem('formId'))
    // setSeleServices([]);
  };

  return (
    <>
      <Head>
        <title>KHMFL - {cu?.name || cu?.official_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/leaflet.css" />
      </Head>

      <MainLayout>
        <div className="w-full grid grid-cols-1 md:grid-cols-7 place-content-center md:grid-cols-4 gap-4 md:p-2 my-6">
          <div className="md:col-span-7 flex flex-col items-start px-4 justify-start gap-3">
            {/* Breadcrumb */}
            <div className="flex flex-row gap-2 text-sm md:text-base">
              <Link className="text-green-700" href="/">
                Home
              </Link>
              {"  >  "}
              <Link className="text-green-700" href="/community-units">
                Community units
              </Link>
              {"  >  "}
              <span className="text-gray-500">
                {cu.name} ( #
                <i className="text-black">{cu.code || "NO_CODE"}</i> )
              </span>
            </div>

            {/* Header snippet */}
            <div
              className={
                "md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                (cu.active ? "border-green-600" : "border-red-600")
              }
            >
              <div className="col-span-6 md:col-span-3">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {cu.name}
                </h1>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (cu.code ? "text-green-900" : "text-gray-400")
                    }
                  >
                    #{cu.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {cu.keph_level_name && "KEPH " + cu.keph_level_name}
                  </p>
                </div>
              </div>

              {/* Info snippet */}
              <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                  {cu.is_approved ? (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Approved
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      Not approved
                    </span>
                  )}
                  {cu.is_closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      CHU Closed
                    </span>
                  )}
                  {cu.deleted && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      CHU Deleted
                    </span>
                  )}
                  {cu.active && (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Active
                    </span>
                  )}
                  {cu.has_fffedits && (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <InformationCircleIcon className="h-4 w-4" />
                      Has changes
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
                { }
              </div>
            </div>
          </div>

          {/* Community Unit Side Menu */}
          <div className="hidden md:col-span-1 md:flex md:mt-8">
            <CommunityUnitSideMenu
              qf={'all'}
              filters={[]}
              _pathId={''}
            />
          </div>

          {/* Form */}
          <div className="col-span-1 md:col-span-6 flex flex-col md:gap-3 mt-4">
            <Tabs.Root
              orientation="horizontal"
              className="w-full flex flex-col tab-root"
              defaultValue="basic_details"
            >
              {/* Tabs List */}
              <Tabs.List className="list-none md:grid md:grid-cols-3 flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                <Tabs.Tab
                  value="basic_details"
                  className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  Basic Details
                </Tabs.Tab>
                <Tabs.Tab
                  value="chews"
                  className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  CHEWs
                </Tabs.Tab>
                <Tabs.Tab
                  value="services"
                  className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  Services
                </Tabs.Tab>
              </Tabs.List>

              {/* Panel List */}

              {/* Basic Details Panel */}
              <Tabs.Panel
                value="basic_details"
                className="grow-1 py-3 px-4 tab-panel"
              >
                <>
                  <form
                    className="flex flex-col w-full items-start justify-start gap-3"
                    onSubmit={(ev) => handleBasicDetails(ev)}
                  >
                    {/* CHU Name */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="name"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Community Health Unit Official Name
                        <span className="text-medium leading-12 font-semibold">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={cu.name}
                        onChange={(ev) => handleChange(ev)}
                        className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                      />
                    </div>

                    {/* CHU Linked Facility */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="facility_name"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Community Health Unit Linked Facility{" "}
                        <span className="text-medium leading-12 font-semibold">
                          {" "}
                          *
                        </span>
                      </label>
                      <Select
                        onChange={(value) => {
                          handleChange({
                            target: { name: "facility", value: value.value },
                          });
                          facilities.map((facility) => {
                            if (facility.id === value.value) {
                              setCountyValue(facility.county);
                              setSubCountyValue(facility.sub_county_name);
                              setConstituencyValue(facility.constituency);
                              setWardValue(facility.ward_name);
                            }
                          }
                          );
                        }}
                        options={facilities.map((facility) => {
                          return {
                            value: facility.id,
                            label: facility.name,
                          };
                        })}
                        value={{
                          value: formData?.facility !== undefined ? formData.facility : cu.facility || "",
                          label: formData?.facility !== undefined ? facilities.find(fc => fc.id == formData.facility).name : cu.facility_name || "",
                        }}
                        name="facility"
                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                      />
                    </div>

                    {/* CHU Operational Status */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="status_name"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Operation Status
                        <span className="text-medium leading-12 font-semibold">
                          {" "}
                          *
                        </span>
                      </label>
                      <Select
                        options={operation_status}
                        value={{
                          value: formData?.status !== undefined ? formData.status : cu.status || "",
                          label: formData?.status !== undefined ? operation_status.find(op => op.value == formData.status).label : cu.status_name || "",
                        }}
                        onChange={(value) =>
                          handleChange({
                            target: { name: "status", value: value.value },
                          })
                        }
                        name="status"
                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                      />
                    </div>

                    {/* CHU Dates - Established and Operational */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <div className="grid grid-cols-2 place-content-start gap-3 w-full">
                        {/* Date Established  */}
                        <div className="col-start-1 col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="date_established"
                              className="text-gray-600 capitalize text-sm"
                            >
                              Date Established
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              type="date"
                              name="date_established"
                              defaultValue={cu.date_established}
                              onChange={(ev) => handleChange(ev)}
                              placeholder={cu.date_established}
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>

                        {/* Date Operational  */}
                        <div className="col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="date_operational"
                              className="text-gray-600 capitalize text-sm"
                            >
                              Date Operational
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              type="date"
                              name="date_operational"
                              defaultValue={cu.date_operational}
                              onChange={(ev) => handleChange(ev)}
                              placeholder={cu.date_operational}
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CHU Number of Monitored Households */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="households_monitored"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Number of monitored households
                        <span className="text-medium leading-12 font-semibold">
                          {" "}
                          *
                        </span>
                      </label>
                      <input
                        type="number"
                        name="households_monitored"
                        defaultValue={cu.households_monitored}
                        onChange={(ev) => handleChange(ev)}
                        min={0}
                        className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                      />
                    </div>

                    {/* CHU Number of CHVs */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="number_of_chvs"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Number of CHVs
                        <span className="text-medium leading-12 font-semibold">
                          {" "}
                          *
                        </span>
                      </label>
                      <input
                        type="number"
                        name="number_of_chvs"
                        defaultValue={cu.number_of_chvs || 0}
                        onChange={(ev) => handleChange(ev)}
                        min={0}
                        className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                      />
                    </div>

                    {/* CHU, Linked Facility Location */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <div className="grid grid-cols-4 place-content-start gap-3 w-full">
                        {/* County  */}
                        <div className="col-start-1 col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="facility_county"
                              className="text-gray-600 capitalize text-sm"
                            >
                              County
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              readOnly
                              value={countyValue || cu.facility_county}
                              type="text"
                              name="facility_county"
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>

                        {/* Sub-county */}
                        <div className="col-start-2 col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="facility_subcounty"
                              className="text-gray-600 capitalize text-sm"
                            >
                              Sub-county
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              readOnly
                              value={subCountyValue || cu.facility_subcounty}
                              type="text"
                              name="facility_subcounty"
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>

                        {/* Constituency */}
                        <div className="col-start-3 col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="facility_constituency"
                              className="text-gray-600 capitalize text-sm"
                            >
                              Constituency
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              readOnly
                              value={constituencyValue || cu.facility_constituency}
                              type="text"
                              name="facility_constituency"
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>

                        {/* Ward */}
                        <div className="col-start-4 col-span-1">
                          <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                            <label
                              htmlFor="facility_ward"
                              className="text-gray-600 capitalize text-sm"
                            >
                              Ward
                              <span className="text-medium leading-12 font-semibold">
                                {" "}
                                *
                              </span>
                            </label>
                            <input
                              readOnly
                              value={wardValue || cu.facility_ward}
                              type="text"
                              name="facility_ward"
                              className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Area of Coverage */}
                      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                        <label
                          htmlFor="area_of_coverage"
                          className="text-gray-600 capitalize text-sm"
                        >
                          Area of coverage
                        </label>
                        <input
                          required
                          type="number"
                          name="location"
                          id="location"
                          placeholder="Description of the area of coverage"
                          defaultValue={cu.location}
                          min={0}
                          className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                        />
                      </div>

                      <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50 h-auto">
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">
                          Community Health Unit Contacts
                        </h4>

                        {contactList.map((x, i) => {
                          return (
                            <div
                              className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3"
                              key={i}
                            >
                              <div
                                className="w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3"
                                key={i}
                              >
                                <label
                                  htmlFor="contact"
                                  className="text-gray-600 capitalize text-sm"
                                >
                                  Contact Type
                                  <span className="text-medium leading-12 font-semibold">
                                    {" "}
                                    *
                                  </span>
                                </label>
                                <select
                                  required
                                  key={i}
                                  id={`${i}`}
                                  name="contact_type"
                                  onChange={(e) => { handleChange(e) }}
                                  defaultValue={
                                    cu.contacts[i]?.contact_type || ""
                                  }
                                  className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                >
                                  {contact_type.map((ct, i) => (
                                    <option value={ct.id} key={i}>
                                      {ct.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div
                                className="w-full flex flex-col items-left px-2 justify-  gap-1 gap-x-3 mb-3"
                                key={i}
                              >
                                <label
                                  htmlFor="contact_text"
                                  className="text-gray-600 capitalize text-sm"
                                >
                                  Contact Details
                                  <span className="text-medium leading-12 font-semibold">
                                    {" "}
                                    *
                                  </span>
                                </label>
                                <input
                                  required
                                  type="text"
                                  name="contact"
                                  id={i}
                                  defaultValue={cu.contacts[i]?.contact || ""}
                                  onChange={(e) => { handleChange(e) }}
                                  className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div class="sticky top-0 right-10 w-full flex justify-end">
                        <button
                          className="rounded bg-green-600 p-2 text-white flex text-md font-semibold mt-3"
                          onClick={handleContactAdd}
                        >
                          {`Add Contact`}
                        </button>
                      </div>

                      {/* Cancel and Save Changes */}

                      <div className="flex items-center w-full">
                        <button className="flex items-center justify-start space-x-2 p-1 bg-red-500 rounded px-2">
                          <ChevronDoubleLeftIcon className="w-4 h-4 text-white" />
                          <span className="text-medium font-semibold text-white ">
                            Cancel
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center w-full justify-end">

                        <button
                          type="submit"
                          className="flex items-right justify-end space-x-2 bg-blue-500 rounded p-1 px-2"
                          onClick={() => {
                            router.push('/community-units')
                          }}
                        >
                          <span className="text-medium font-semibold text-white">
                            Finish
                          </span>
                        </button>
                        &nbsp;

                        <button
                          type="submit"
                          className="flex items-center justify-end space-x-2 bg-green-500 rounded p-1 px-2"
                        >
                          <span className="text-medium font-semibold text-white">
                            Save & Continue
                          </span>
                          <ChevronDoubleRightIcon className="w-4 h-4 text-white" />
                        </button>

                      </div>



                    </div>
                  </form>
                </>
              </Tabs.Panel>

              {/* Chews Panel */}
              <Tabs.Panel value="chews" className="grow-1 py-3 px-4 tab-panel">
                <>
                  <form
                    name="chews_form"
                    className="flex flex-col w-full items-start justify-start gap-3"
                    onSubmit={handleCHEWs}
                  >
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      {contactCHEW && contactCHEW.length > 0 ? (
                        contactCHEW.map((contact, index) => {
                          return (
                            <div
                              className="flex flex-row items-center justify-between md:mx-1 gap-4 w-full"
                              key={`${contact}~${index}`}
                            >
                              {/* First Name */}
                              <div className="flex-col gap-2">
                                <label
                                  htmlFor="first_name"
                                  start
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  First Name
                                </label>
                                <input
                                  required
                                  type="text"
                                  id={index}
                                  name="first_name"
                                  onChange={(e) => handleChange(e)}
                                  value={formData.health_unit_workers !== undefined ? formData?.health_unit_workers[index]?.first_name : cu.health_unit_workers[index]?.first_name || ""}
                                  className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                />
                              </div>
                              {/* Second Name */}
                              <div className="flex-col gap-2">
                                <label
                                  htmlFor="last_name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Second Name
                                </label>
                                <input
                                  required
                                  type="text"
                                  id={index}
                                  name="last_name"
                                  onChange={(e) => handleChange(e)}
                                  value={formData.health_unit_workers !== undefined ? formData?.health_unit_workers[index]?.last_name : cu.health_unit_workers[index]?.last_name || ""}
                                  className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                />
                              </div>
                              {/* In charge */}
                              <div className="flex-col gap-2">
                                <label
                                  htmlFor="is_incharge"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  In Charge
                                </label>
                                <input
                                  name="is_incharge"
                                  id={index}
                                  type="checkbox"
                                  onChange={(e) => handleChange(e)}
                                  checked={formData.health_unit_workers !== undefined ? formData?.health_unit_workers[index]?.is_incharge : cu.health_unit_workers[index]?.is_incharge || false}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />
                              </div>

                              {/* Delete CHEW */}

                              <div className="flex-col gap-2">
                                <div className="flex items-center">
                                  {/* insert red button for deleting */}
                                  <button
                                    type="button"
                                    name="delete"
                                    onClick={(e) => {
                                      remove(e, index, contact.id);
                                    }}
                                    className="flex items-center justify-start space-x-2 bg-red-600 rounded p-1 px-2"
                                  >
                                    <span className="text-medium font-semibold text-white">
                                      Remove
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <>
                          <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                            <p>No HR data listed for this cu.</p>
                          </li>
                        </>
                      )}

                      <div class="sticky top-0 right-10 w-full flex justify-end">
                        <button
                          className="rounded bg-green-600 p-2 text-white flex text-md font-semibold "
                          onClick={handleAddClick}
                        >
                          {`Add`}
                          {/* <PlusIcon className='text-white ml-2 h-5 w-5'/> */}
                        </button>
                      </div>
                    </div>

                    {/* Save Changes */}
                    <div className="flex justify-between items-center w-full">
                      <button
                        type="submit"
                        className="flex items-center justify-start space-x-2 bg-red-500 rounded p-1 px-2"
                      >
                        <ChevronDoubleLeftIcon className="w-4 h-4 text-white" />
                        <span className="text-medium font-semibold text-white">
                          Basic Details
                        </span>
                      </button>
                      <button
                        type="submit"
                        className="flex items-center justify-end space-x-2 bg-green-500 rounded p-1 px-2"
                      >
                        <span className="text-medium font-semibold text-white">
                          Save Changes
                        </span>
                        <ChevronDoubleRightIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </form>
                </>
              </Tabs.Panel>

              {/* Services Panel */}
              <Tabs.Panel
                value="services"
                className="grow-1 py-3 px-4 tab-panel"
              >
                <>
                  <form
                    name="chu_services_form"
                    className="flex flex-col w-full items-center justify-start gap-3"
                    onSubmit={(ev) => handleServices(ev)}
                  >
                    {/* Transfer list Container */}
                    <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      Available Services
                    </span>
                    <div className="flex items-center w-full h-auto">
                      <Select
                        options={props.service_categories.results.map(
                          (service) => {
                            return {
                              value: service.id,
                              label: service.name,
                            };
                          }
                        )}
                        onChange={(e) =>
                          setSelectedServices([
                            ...selectedServices,
                            { health_unit: cu?.id, service: e.value, name: e.label },
                          ])
                        }
                        name="services"
                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                      />
                    </div>
                    <br />
                    {/* Service Category Table */}
                    <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      Assigned Services
                    </span>{" "}
                    <table className="w-full  h-auto my-4">
                      <thead className="w-full">
                        <tr className="grid grid-cols-2 place-content-end border-b-4 border-gray-300">
                          <td className="text-lg font-semibold text-indigo-900 ">
                            Service
                          </td>
                          <td className="text-lg font-semibold text-indigo-900 ml-12">
                            Action
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedServices && selectedServices?.length > 0 ? (
                          selectedServices?.map(({ id, name }) => (
                            <tr
                              key={id}
                              className="grid grid-cols-2 place-content-end border-b-2 border-gray-300"
                            >
                              <td>{name}</td>
                              <td className="ml-12 text-base">
                                <button
                                  type="button"
                                  onClick={() => {
                                    selectedServices.splice(id, 1)
                                    setSelectedServices(
                                      selectedServices.filter(
                                        (service) => service.id !== id
                                      )
                                    );
                                  }}
                                  className="flex items-center justify-start space-x-2 bg-red-600 rounded p-1 px-2"
                                >
                                  <span className="text-medium font-semibold text-white">
                                    Remove
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <>
                            <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                              <p>
                                {cu?.name || cu?.official_name} has not listed
                                the services it offers. Add some below.
                              </p>
                            </li>
                            <br />
                          </>
                        )}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center w-full">
                      <button
                        type="submit"
                        className="flex items-center justify-start space-x-2 bg-red-500 rounded p-1 px-2"
                      >
                        <ChevronDoubleLeftIcon className="w-4 h-4 text-white" />
                        <span className="text-medium font-semibold text-white">
                          CHEWS
                        </span>
                      </button>
                      <button
                        type="submit"
                        className="flex items-center justify-end space-x-2 bg-green-500 rounded p-1 px-2"
                      >
                        <span className="text-medium font-semibold text-white">
                          Save & Finish
                        </span>
                        <ChevronDoubleRightIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </form>
                </>
              </Tabs.Panel>
            </Tabs.Root>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

CommUnit.getInitialProps = async (ctx) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (ctx.query.q) {
    const query = ctx.query.q;

    if (typeof window !== "undefined" && query.length > 2) {
      window.location.href = `/community-units?q=${query}`;
    } else {
      if (ctx.res) {
        ctx.res.writeHead(301, {
          Location: "/community-units?q=" + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }

  return checkToken(ctx.req, ctx.res)
    .then(async (t) => {
      if (t.error) {
        throw new Error("Error checking token");
      } else {
        // Fetching the required token
        let token = t.token;

        // Prefetch the facility data details
        let facility_url = `${API_URL}/facilities/facilities/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;

        const response = await fetch(facility_url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        });

        let facility_data = await response.json();
        if (facility_data.error) {
          throw new Error("Error fetching facility data");
        }

        // Fetch the service options
        let service_url = `${API_URL}/chul/services/?page_size=100&ordering=name`;

        const service_response = await fetch(service_url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        });

        let service_categories = await service_response.json();


        if (service_categories.error) {
          throw new Error("Error fetching the service categories");
        }

        let contact_url = `${API_URL}/common/contact_types/?fields=id,name`;
        const _data = await fetch(contact_url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        });

        // let contact_res = (await _data.json()).results.map(({id, name }) => {return {value:id, label:name}})
        const defaultSelected = {
          id: "0",
          name: "Select contact type",
          disabled: true,
        };

        let contact_res = (await _data.json()).results;
        contact_res.unshift(defaultSelected);

        if (contact_res.error) {
          throw new Error("Error fetching the contact types");
        }

        // Fetching the details of the quieried chu
        let url = API_URL + "/chul/units/" + ctx.query.id + "/";

        return fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        })
          .then((r) => r.json())
          .then((json) => {
            return {
              token: token,
              service_categories: service_categories,
              facility_data: facility_data,
              data: json,
              contact_type: contact_res,
            };
          })
          .catch((err) => {
            console.log("Error fetching facilities: ", err);
            return {
              error: true,
              err: err,
              data: [],
            };
          });
      }
    })
    .catch((err) => {
      console.log("Error checking token: ", err);
      if (typeof window !== "undefined" && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        } else {
          let token = t.token;
          let url = API_URL + "/chul/units/" + ctx.query.id + "/";
          return fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
          })
            .then((r) => r.json())
            .then((json) => {
              return {
                data: json,
              };
            })
            .catch((err) => {
              console.log("Error fetching facilities: ", err);
              return {
                error: true,
                err: err,
                data: [],
              };
            });
        }
      }
      console.log("My Error:" + err);

      return {
        error: true,
        err: err,
        data: [],
      };
    });
};

export default CommUnit;
