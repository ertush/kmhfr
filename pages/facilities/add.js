import { Form } from "../../components/Forms/Form"
import { checkToken } from "../../controllers/auth/auth";
import MainLayout from '../../components/MainLayout';
import Link from "next/link";
import Head from "next/head";
import FacilitySideMenu from "../../components/FacilitySideMenu";
import {useState, useEffect, createContext} from 'react';


export const FormOptionsContext = createContext({});

export default function AddFacility(props) {

	const filters = [];
	const [khisSynched, setKhisSynched] = useState(false);
	const [facilityFeedBack, setFacilityFeedBack] = useState([])
	const [pathId, setPathId] = useState('')
	const [allFctsSelected, setAllFctsSelected] = useState(false);
	const [title, setTitle] = useState('');
	const [isClient, setIsClient] = useState(false)
 
	useEffect(() => {
	  setIsClient(true)
	}, [])

	if(isClient) {
		return (
			<>
				<Head>
					<title>KMHFR - Add Facility</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
					<div className="w-full grid grid-cols-5 h-full mb-12 gap-4">
						<div className="col-span-5 flex flex-col gap-3 md:gap-5 mb-4">
							<div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
								<div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
									<Link className="text-blue-800" href="/">Home</Link> {'/'}
									<Link className="text-blue-800" href="/facilities/">Facilities</Link> {'/'}
									<span className="text-gray-500">Add Facility</span>
								</div>
							</div>

							<div className={"col-span-5 flex justify-between w-full  border border-blue-600  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
								<h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
									{'New Facility'}
								</h2>
							</div>

						</div>


						{/* Facility Side Menu Filters */}
						<div className="md:col-span-1">
							<FacilitySideMenu
								filters={filters}
								states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
								stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
						</div>


						<FormOptionsContext.Provider value={props}>
							<Form />
						</FormOptionsContext.Provider>
					</div>
				</MainLayout >
			</>

		)
	}
	else {
		return null;
	}
}


AddFacility.getInitialProps = async (ctx) => {

	const allOptions = []

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
		'specialities'
	]



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
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								// let results = (await _data.json()).results.map(({id, sub_division, name }) => sub_division ? {value:id, label:sub_division} : {value:id, label:name})


								allOptions.push({ facility_types: (await _data.json()).results })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_types: [],
								});
							}

							break;
						case 'facility_type_details':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types/?is_active=true&page_size=10000`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								let _results = (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name }))

								allOptions.push({ facility_type_details: _results })


							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_types: [],
								});
							}
							break;
						case 'owners':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ owners: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									owners: [],
								});
							}

							break;
						case 'owner_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ owner_types: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									owner_types: [],
								})
							}

							break;
						case 'keph':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ keph: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									keph: [],
								})
							}

							break;
						case 'facility_admission_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?is_active=true&page_size=10000`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ facility_admission_status: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;

						case 'job_titles':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ job_titles: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;

						case 'contact_types':
							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=id,name`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ contact_types: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_admission_status: [],
								})
							}
							break;


						case 'facility_depts':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name,regulatory_body,regulatory_body_name`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ facility_depts: (await _data.json()).results.map(({ id, name, regulatory_body_name }) => ({ value: id, label: name, reg_body_name: regulatory_body_name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									facility_depts: [],
								})
							}
							break;

						case 'regulating_bodies':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?fields=id,name`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ regulating_bodies: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									regulating_bodies: [],
								})
							}
							break;

						case 'regulation_status':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								allOptions.push({ regulation_status: (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									regulation_status: [],
								})
							}
							break;

						case 'services':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&ordering=name`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({ service: (await _data.json()).results.map(({ id, name, category, category_name }) => ({ id, name, category, category_name })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									service: [],
								})
							}

							break;

						case 'infrastructure':

							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=100&page=1`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({ infrastructure: (await _data.json()).results.map(({ id, name, category_name, category }) => ({ id, name, category_name, category })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									service: [],
								})
							}

							break;

						case 'specialities':
							url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/${option}/?page_size=2000&ordering=name`;

							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									}
								})

								allOptions.push({ hr: (await _data.json()).results.map(({ id, name, category_name, category }) => ({ id, name, category_name, category })) })

							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									service: [],
								})
							}


							break;

						default:
							let fields = ''
							let _obj = {}

							if (option === 'counties') fields = 'id,name&page_size=47'
							if (option === 'sub_counties') fields = 'id,name,county'
							if (option === 'wards') fields = 'id,name,sub_county,constituency'
							if (option === 'constituencies') fields = 'id,name,county'


							url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=${fields}`;


							try {

								const _data = await fetch(url, {
									headers: {
										Authorization: 'Bearer ' + token,
										Accept: 'application/json',
									},
								})

								_obj[option] = (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name }))


								allOptions.push(_obj)


							}
							catch (err) {
								console.log(`Error fetching ${option}: `, err);
								allOptions.push({
									error: true,
									err: err,
									data: []
								});
							}
							break;

					}
				}



				return allOptions


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