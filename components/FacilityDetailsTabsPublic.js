import React,{useContext,useEffect,useState} from 'react'
import * as Tabs from "@radix-ui/react-tabs";
import { UserContext } from '../providers/user';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import StarRatingComponent from "react-star-rating-component";
import { StarIcon } from "@heroicons/react/solid";

import { useAlert } from "react-alert";

function FacilityDetailsTabsPulic({ facility }) {

  const [user, setUser] = useState(null);

   //rating
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");

   const userCtx = useContext(UserContext);

   //alert
    const alert = useAlert();


  // const [isFormVisible, setIsFormVisible] = useState(false); 
  const [formVisibility, setFormVisibility] = useState(Array(facility.facility_services.length).fill(false) || []);   

   useEffect(() => {
    let user_id
    if(userCtx){
      let s_r=userCtx
      user_id=s_r.id
      setUser(s_r)
    }
  }, [userCtx])
  

  const handleServiceRating = async (event, serviceId) => {
    event.preventDefault();
    const commentString = Array.isArray(comment) ? comment.join(" ") : comment;
    const ratingInteger = Array.isArray(rating) ? rating[0] : rating;
  
    if (ratingInteger > 0) {
      const data = {
        rating: ratingInteger,
        comment: commentString,
        facility_service: serviceId,
      };
  
      const url = `/api/common/submit_form_data/?path=facility_service_ratings`;
  
      try {
        await fetch(url, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            let rating_val = [];
            rating_val[0] = data.rating;
            rating_val[1] = data.comment;
            alert.success("Review submitted successfully");
            window.localStorage.setItem("rating", JSON.stringify(rating_val));

            //clear
            setRating(0)
            setComment("")

            //clear the comment section and start rating
            const inputElement = document.querySelector('input[name="comment"]');
            if (inputElement) {
              inputElement.value = '';
            }
            
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert.error("Rating value must be greater than zero");
    }
  };
    
  return (
    <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
      <Tabs.Root
        orientation="horizontal"
        className="w-full flex flex-col tab-root"
        defaultValue="overview"
      >
        <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
          <Tabs.Tab
            id={1}
            value="overview"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            id={2}
            value="services"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Services
          </Tabs.Tab>
          <Tabs.Tab
            id={5}
            value="community_units"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Facility Units
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="overview"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
              <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                Status:
              </h3>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Type
                </label>
                <p className="text-black font-medium text-base flex">
                {facility?.facility_type_name || ""}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Open 24 hours
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.open_normal_day ? (
                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Regulated
                </label>
                <p className="col-span-2 text-black font-medium text-base flex">
                  {facility?.regulated ? (
                    <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Regulation status
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.regulatory_status_name || " - "}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Ownership:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Category
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.owner_type_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Owner
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.owner_name || " - "}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Location: 
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  County
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.county || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Sub-County
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.sub_county_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Constituency
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.constituency_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Ward
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.ward_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Town
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.town_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Description
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.location_desc || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Nearest landmark
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.nearest_landmark || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Plot number
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.plot_number || " - "}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Bed capacity:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Total In-patient beds 
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Cots
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_cots}
                </p>
              </div>
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Contacts:
              </h3>
              {facility?.facility_contacts &&
                facility?.facility_contacts.length > 0 &&
                facility?.facility_contacts.map((contact) => (
                  <div
                    key={contact.contact_id}
                    className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center"
                  >
                    <label className="col-span-1 text-gray-600 capitalize">
                      {contact.contact_type_name[0].toLocaleUpperCase() +
                        contact.contact_type_name
                          .slice(1)
                          .toLocaleLowerCase() || "Contact"}
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {contact.contact || " - "}
                    </p>
                  </div>
                ))}
              {facility?.officer_in_charge && (
                <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                  <label className="col-span-1 text-gray-600 capitalize">
                    {facility?.officer_in_charge.title_name ||
                      "Officer in charge"}
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {facility?.officer_in_charge.name || " - "}
                  </p>
                </div>
              )}
              {facility?.officer_in_charge &&
                facility?.officer_in_charge.contacts.length > 0 &&
                facility?.officer_in_charge.contacts.map((contact) => (
                  <div
                    key={contact.contact_id}
                    className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center"
                  >
                    <label className="col-span-1 text-gray-600 capitalize">
                      In charge{" "}
                      {contact.contact_type_name[0].toLocaleUpperCase() +
                        contact.contact_type_name
                          .slice(1)
                          .toLocaleLowerCase() || "Contact"}
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {contact.contact || " - "}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="services"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
            <div className="bg-white w-full p-4 rounded">
              <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                <span className="font-semibold">Services</span>
              </h3>
              <ul>
                  {facility?.facility_services &&
                  facility?.facility_services.length > 0 ? (
                    facility?.facility_services.map((service, index) => (
                      <li
                        key={service.service_id}
                        className="w-full grid grid-cols-1 gap-3 place-content-end my-2 p-3 border-b border-gray-300"
                      >
                        <div>
                          
                          <p className="text-gray-800 text-base">
                            {
                              index + 1 + "."
                            }
                            {service.service_name}
                          </p>
                          <small className="text-xs text-gray-500">
                          <span><b>Category: </b></span>{service.category_name || ""}
                          </small>
                          <label className="text-sm text-gray-600 flex gap-1 items-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            <span>Active</span>
                          </label>
                          <div class="flex justify-between">
                          <p class="text-left">
                            <span className="text-sm text-gray-600">
                             <b>Average Rating:</b> {service.average_rating.toFixed(2)}
                            </span>
                          </p>
                          <p class="text-left">
                            <span className="text-sm text-gray-600">
                             <b>Number of Rating:</b> {service.number_of_ratings}
                            </span>
                          </p>
                          </div>
                          <div>
                          </div>
                          <button
                            type="button"
                            className="bg-gray-200 rounded p-1 h-8 px-4"
                            onClick={() => {
                              const newFormVisibility = [...formVisibility];
                              newFormVisibility[index] = !newFormVisibility[index];
                              setFormVisibility(newFormVisibility);
                            }}
                          >
                          {formVisibility[index] ?  "Hide Rating" : "Rate Service"}  
                          </button>
                          {formVisibility[index] && (
                          <div className="flex flex-col gap-2">
                            <form
                              onSubmit={(e) =>
                                handleServiceRating(e, service.id)
                              }
                            >
                              <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label className="text-sm text-gray-600">
                                  Rate facility service (You may leave your contacts in the comment)
                                </label>
                                <input
                                  type="text"
                                  name="comment"
                                  className="border border-gray-300 rounded p-2"
                                  value={comment[index]}
                                  placeholder="Leave a comement"
                                  onChange={(e) =>
                                    setComment((prev) => {
                                      let newComment = [...prev];
                                      newComment[index] = e.target.value;
                                      return newComment;
                                    })
                                  }
                                />
                                 <p className='text-sm text-gray-600'>Stars Represent Level Of Satisfaction: 5 (Very Good), 4 (Good), 3 (Average), 2 (Poor), 1 (Very Poor)</p>
                                 <StarRatingComponent
                                  className="text-2xl"
                                  name="rate1"
                                  starCount={5}
                                  value={rating[index]}
                                  onStarClick={(e) =>
                                    setRating((prev) => {
                                      let newRating = Array.isArray(prev) ? [...prev] : [];
                                      newRating[index] = e; 
                                      return Array.isArray(newRating) ? newRating : [];
                                    })
                                  }
                                />
                                
                              </div>
                              <div>
                              <button
                                  type="submit"
                                  className="bg-green-500 text-white rounded p-1  h-8 px-4"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>

                          </div>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                      <p>No services listed for this facility?.</p>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="community_units"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
            <div className="bg-white w-full p-4 rounded">
              <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                <span className="font-semibold">Facility units</span>
                {/* {user && user?.id ? <a href={"/facility/edit/"+facility?.id+"#units"} className="text-base text-green-700 font-medium hover:text-black focus:text-black active:text-black">Edit facility units</a> : ""} */}
              </h3>
              <ul>
                {facility?.facility_units &&
                  facility?.facility_units.length > 0 ? (
                  facility?.facility_units.map((unit) => (
                    <li
                      key={unit.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                    >
                      <div>
                        <p className="text-gray-800 text-base">
                          {unit.unit_name}
                        </p>
                        <small className="text-xs text-gray-500">
                          {unit.regulating_body_name || ""}
                        </small>
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        <label className="text-sm text-gray-600">
                          Active
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <p>No units in this facility?.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}

export default FacilityDetailsTabsPulic