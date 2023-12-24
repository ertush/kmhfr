import { EditForm } from "../../../components/Forms/EditForm"
import { checkToken } from "../../../controllers/auth/auth";
import MainLayout from '../../../components/MainLayout';
import Link from "next/link";
import Head from "next/head";
import FacilitySideMenu from "../../../components/FacilitySideMenu";
import React, { useState, useEffect, createContext } from 'react';
import { FormOptionsContext } from "../add";
import FacilityUpdatesTable from '../../../components/FacilityUpdatesTable'
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { all } from "underscore";
import { UserContext } from "../../../providers/user";


export const FacilityUpdatesContext = createContext(null)

export default function EditFacility(props) {
	const userCtx = React.useContext(UserContext);
	const [user, setUser] = useState(userCtx);

	const filters = [];
	const [khisSynched, setKhisSynched] = useState(false);
	const [facilityFeedBack, setFacilityFeedBack] = useState([])
	const [pathId, setPathId] = useState('')
	const [allFctsSelected, setAllFctsSelected] = useState(false);
	const [title, setTitle] = useState('');
	const [isClient, setIsClient] = useState(false)

	const [facilityUpdateData, setFacilityUpdateData] = useState(null);
	const [isSavedChanges, setIsSavedChanges] = useState(false);


	const router = useRouter();
	const alert = useAlert();

	const { facility_updated_json } = facilityUpdateData ?? {
		updated: new Date(),
		updated_by: "",
		facility_updated_json: [],
		created_by_name: "",
		code:null,
		facilityId:null
	  };




	useEffect(() => {

		// console.log({allOptions: props})

		setUser(userCtx)
		if(user.id === 6){
			router.push('/auth/login')
		}
		
		setIsClient(true)

	}, [])

	if (isClient) {
		return (
			<>
				<Head>
					<title>KMHFR - Edit Facility</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
					<div className="w-full grid grid-cols-5 h-full mb-12 gap-4">
						<div className="col-span-5 flex flex-col gap-3 md:gap-5 mb-4">
							<div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
								<div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
									<Link className="text-blue-800" href="/">Home</Link> {'/'}
									<Link className="text-blue-800" href="/facilities/">Facilities</Link> {'/'}
									<span className="text-gray-500">Edit Facility</span>
								</div>
							</div>

							<div className={"col-span-5 flex flex-col items-start w-full  border border-blue-600  text-black p-4 md:divide-x md:divide-gray-200z border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
								<h2  className='flex items-center text-xl font-bold text-black capitalize gap-2'>
									Editing <span className="cursor-pointer hover:text-blue-800" onClick={() => router.push(`/facilities/${props?.data?.id}`)}>{props?.data?.official_name}</span> 
								</h2>
								<h3 className='text-blue-900 font-semibold '>{props?.data?.facility_type_name ?? ''}</h3>
								<h4 className='text-gray-700'>{`# ${props?.data?.code ?? 'NO_CODE'}`}</h4>
							</div>

						</div>


						{/* Facility Side Menu Filters */}
						<div className="md:col-span-1">
							<FacilitySideMenu
								filters={filters}
								states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
								stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
						</div>




						{isSavedChanges && facilityUpdateData ? (
							// Display Changes to be updated
						<div className="md:col-span-4 bg-blue-50 p-3 shadow-md flex flex-col items-center md:gap-3 gap-y-3"> 

							<div className="flex flex-col justify-start w-full space-y-3">
								<h2 className="text-2xl font-bold justify-center items-center md:ml-0 ml-4">
									Updated details
								</h2>
								{/* Update Metadata */}
								<div className="grid grid-cols-1 gap-y-2 grid-rows-1 md:flex justify-between md:space-x-4 w-full md:mx-0 mx-4">
									<p className="text-base font-normal flex items-center gap-x-1">
										Updates were made on {" "}
										<span className="text-blue-900 font-semibold text-base ">
											{
												new Date(facilityUpdateData?.updated)
													.toLocaleString()
													.split(",")[0]
											}
										</span>
										{" "}
										by
										{" "}
										<span className="text-blue-900 font-semibold text-base ">
											{facilityUpdateData?.created_by_name}
										</span>
									</p>

								    {
										facilityUpdateData?.code &&
									<p className="text-base font-normal flex gap-x-1 ">
										Facility Code:
										{" "}
										<span className="text-blue-900 font-semibold text-base ">
											{facilityUpdateData?.code}
										</span>
									</p>
									}

									<span className="flex space-x-2">
										<button
											className="flex justify-center text-base font-semibold text-white bg-blue-500  py-1 px-2"
											onClick={() => router.push(`/facilities/edit/${facilityUpdateData?.id}`)}
										>
											Edit
										</button>
										<button
											className="flex justify-center text-base font-semibold text-white bg-blue-500  py-1 px-2"
											onClick={() => {
												if (isSavedChanges) {
													alert.success("Facility updates saved successfully")
												} else {
													alert.error("Unable to save facility updates")
												}
												router.push("/facilities")
											}}
										>
											Confirm Updates
										</button>
									</span>
								</div>

								{/* Update Details */}

								<FacilityUpdatesTable
									facilityUpdatedJson={facility_updated_json}
									originalData={props?.data}
								/>
							</div>
							</div>
						) : (

							<FacilityUpdatesContext.Provider value={{
								updatedSavedChanges:setIsSavedChanges,
								updateFacilityUpdateData:setFacilityUpdateData
							}} >
								<FormOptionsContext.Provider value={props}>
									<EditForm />
								</FormOptionsContext.Provider>
							</FacilityUpdatesContext.Provider>
						)
						}
					</div>
				</MainLayout >
			</>

		)
	}
	else {
		return null;
	}
}


EditFacility.getInitialProps = async (ctx) => {

	// const allOptions = []

	const options = [
		'facility_types',
		'facility_type_details',
		'owners',
		'owner_types',
		'keph',
		'facility_admission_status',
		'counties',
		'sub_counties',
		'constituencies',
		'wards',
		'job_titles',
		'contact_types',
		'facility_depts',
		'regulating_bodies',
		'regulation_status',
		'services',
		'infrastructure',
		'specialities',
		'collection_date',
		'facility_data'
	]

	const allOptions = {};

	return checkToken(ctx.req, ctx.res)
		.then(async (t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {

				let token = t.token;
				let url = '';

				for (let i = 0; i < options.length; i++) {
					const option = options[i]
					switch (option) {
						case 'facility_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_parent=true&page_size=10000`;

							try {

								const _facilityTypeData = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_facilityTypeData) throw Error('Unable facility type data')


								let facilityTypeData = (await _facilityTypeData.json())

								facilityTypeData = Array.from(facilityTypeData?.results, ({id, name}) => {
								return {
									label: name,
									value: id
								}
									
								})

							

								allOptions['facility_types'] = facilityTypeData;
								

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}

							break;
						case 'facility_type_details':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types/?is_parent=false&page_size=10000`;

							try {

								const _facilityTypeDetails = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})
								
								if (!_facilityTypeDetails) throw Error("Unable to fetch facility type details")


								const facilityTypeDetails = (await _facilityTypeDetails.json()).results.map(({ id, name }) => ({ value: id, label: name }))


								allOptions['facility_type_details'] = facilityTypeDetails;


							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'owners':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _owners = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_owners) throw new Error('Unable to fetch owners')

								const owners = (await _owners.json())?.results 

								allOptions['owners'] = owners

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}

							break;
						case 'owner_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _owner_types = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_owner_types) throw Error('Unable to fetch owner types')
								
								const owner_types = await _owner_types.json()


								allOptions["owner_types"] = (await owner_types).results.map(({ id, name }) => ({ value: id, label: name }))


							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}

							break;
						case 'keph':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {
								const _keph = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_keph) throw Error('Unable to fetch keph')

								const keph = (await _keph.json()).results.map(({ id, name }) => ({ value: id, label: name })) 


								allOptions["keph"] = keph

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
							
							}

							break;
						case 'facility_admission_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _facility_admission_status = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_facility_admission_status) throw Error('Unabe to fetch Faility type details')

								const facility_admission_status = (await _facility_admission_status.json()).results.map(({ id, name }) => ({ value: id, label: name }))


								allOptions["facility_admission_status"] =  facility_admission_status

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'job_titles':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;


							try {

								const _job_titles = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_job_titles) throw Error('Unable to fetch job titles')

								const job_titles = (await _job_titles.json()).results.map(({ id, name }) => ({ value: id, label: name })) 


								allOptions["job_titles"] = job_titles

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'contact_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=id,name`;


							try {

								const _contact_types = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_contact_types) Error("Unable to Contact Types")

								const contact_types = (await _contact_types.json()).results.map(({ id, name }) => ({ value: id, label: name })) 

								allOptions["contact_types"] = contact_types

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'facility_depts':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name,regulatory_body,regulatory_body_name`;


							try {

								const _faciilty_depts = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

							    if(!_faciilty_depts) throw Error("Unable to fetch facility Departments")

								const facility_depts = (await _faciilty_depts.json()).results.map(({ id, name, regulatory_body_name }) => ({ value: id, label: name, reg_body_name: regulatory_body_name }))

								allOptions["facility_depts"] = facility_depts

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'regulating_bodies':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;


							try {

								const _regulating_bodies = await fetch(url, {

									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_regulating_bodies) throw Error("Unable to fetch reguating bodies")

								const regulating_bodies = (await _regulating_bodies.json()).results.map(({ id, name }) => ({ value: id, label: name }))

								allOptions["regulating_bodies"] = regulating_bodies

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'regulation_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;


							try {

								const _regulation_status = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								if(!_regulation_status) throw Error("Unable to fetch Regulation Status")

								const regulation_status = (await _regulation_status.json()).results.map(({ id, name }) => ({ value: id, label: name }))

								allOptions["regulation_status"] = regulation_status

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case 'services':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&ordering=name`;

							try {

								const _services = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								if(!_services) throw Error("Unable to fetch services") 

								const services = (await _services.json()).results.map(({ id, name, category, category_name }) => ({ id, name, category, category_name }))

								allOptions["services"] = services

							}
							catch (err) {
								console.error(`Error fetching ${option}: `, err);
								
							}

							break;
						case 'infrastructure':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;

							try {

								const _infrastructure = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								if(!_infrastructure) throw Error("Unable to fetch infrstructure")

								const infrastructure = (await _infrastructure.json()).results.map(({ id, name, category_name, category }) => ({ id, name, category_name, category }))

								allOptions["infrastructure"] = infrastructure

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
							
							}

							break;
						case 'specialities':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=2000&ordering=name`;

							try {

								const _specialities = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								if(!_specialities) throw Error("Unable to fetch specialities")

								const specialities = (await _specialities.json()).results.map(({ id, name, category_name, category }) => ({ id, name, category_name, category }))

								allOptions["hr"] = specialities

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								
							}

							break;
						case "collection_date":
							try {
								const _collection_date = await fetch(
									`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates/?facility=${ctx.query.id}&format=json`,
									{
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										}
									}
								);


								const [_result] = (await _collection_date.json()).results;
								if(_result && _result["collection_date"]){
									allOptions["collection_date"] = _result["collection_date"];
								}else{
									allOptions["collection_date"] = null;
								}
								

							} catch (err) {
								console.log(`Error fetching ${option}: `, err);
								console.error(`Error fetching ${option}: `, err);
								
							}
							break;
						case "facility_data":
							try {
								const _facility_data = await fetch(
									`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${ctx.query.id}/`,
									{
										headers: {
											Authorization: 'Bearer ' + token,
											Accept: 'application/json',
										}
									}

								);
								
								const facilityData = await _facility_data.json()

								// console.log({facilityData: facilityData?.ward})
							

								if (facilityData) {

									allOptions['data'] = facilityData;

									try {



										const response = await fetch(
											`${process.env.NEXT_PUBLIC_API_URL}/common/wards/${facilityData?.ward}/?format=json`,
											{
												headers: {
													Authorization: 'Bearer ' + token,
													Accept: 'application/json',
												}
											}
										);

										const wardData = await response.json();
										
										if(wardData){

										const [lng, lat] =
										wardData?.ward_boundary.properties.center.coordinates;

										allOptions["geolocation"] = {
												geoJSON: JSON.parse(JSON.stringify(wardData?.ward_boundary)),
												centerCoordinates: JSON.parse(
													JSON.stringify([lat, lng])
												)
											}
										

									}

										
											try {
												const response = await fetch(
													`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_regulation_status/?facility=${facilityData?.id}/?format=json`,
													{
														headers: {
															Authorization: 'Bearer ' + token,
															Accept: 'application/json',
														}
													}
												);
												const regulationData = await response.json();
												
												if (regulationData) {
												allOptions['facility_regulation_status'] = (await regulationData).results
												
											}
											} catch (err) {
												console.log(`Error fetching ${option}: `, err);
											
											}
										
									} catch (err) {
										console.log(`Error fetching ${option}: `, err);
										
									}
								}
							} catch (err) {
								console.log(`Error fetching ${option}: `, err);
								
							}

							break;
						default:
							let fields = ''

							if (option === 'counties') fields = 'id,name&page_size=47'
							if (option === 'sub_counties') fields = 'id,name,county&page_size=312'
							if (option === 'wards') fields = 'id,name,sub_county,constituency&page_size=1453'
							if (option === 'constituencies') fields = 'id,name,county&page_size=290'


							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=${fields}`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions[option] = (await _data.json())?.results.map(({ id, name }) => ({ value: id, label: name }))
							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								
							}
							break;

					}
				}


				allOptions["token"] = token
		
				
				// console.log("allOptions Log", allOptions)
				return  allOptions


			}
		})
		.catch((err) => {
			console.log('Error checking token: ', err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				} else {
					window.location.href = '/facilities';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
				};
			}, 1000);
		});
}