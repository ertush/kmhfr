// React imports
import React, { useEffect, useState } from 'react';

// Next imports
import Head from 'next/head';
import { useRouter } from 'next/router';

// Component imports
import MainLayout from '../../components/MainLayout';
import ReportItem from '../../components/ReportItem';

// Controller imports
import { checkToken } from '../../controllers/auth/auth';

// MUI imports
import { List, ListItem, ListItemText } from '@mui/material';

// Heroicons imports
import { DownloadIcon } from '@heroicons/react/solid';

// Package imports
import Select from 'react-select';

const StaticReports = (props) => {
	const router = useRouter();
	let filters = props?.filters;
	let [drillDown, setDrillDown] = useState({});
	const [user, setUser] = useState(null);

	useEffect(() => {
		let mtd = true;
		if (mtd) {
			if (filters && Object.keys(filters).length > 0) {
				Object.keys(filters).map((ft) => {
					if (
						props?.query[ft] &&
						props?.query[ft] != null &&
						props?.query[ft].length > 0
					) {
						setDrillDown({ ...drillDown, [ft]: props?.query[ft] });
					}
				});
			}
			if (typeof window !== 'undefined') {
				let usr = window.sessionStorage.getItem('user');
				if (usr && usr.length > 0) {
					setUser(JSON.parse(usr));
				}
			}
		}
		return () => {
			mtd = false;
		};
	}, []);

	return (
		<div className=''>
			<Head>
				<title>KMHFL - Static Reports</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-4'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							<div className='flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1'>
								<a className='text-green-700' href='/'>
									Home
								</a>{' '}
								{'>'}
								<span className='text-gray-500'>Reports</span> {'>'}
								<span className='text-gray-500'>Static Reports</span>
							</div>
						</div>
					</div>
					<div className='col-span-5'>
						<List sx={{ width: '100%' }}>
							<ReportItem
								title='Health Infrastructure Norms and Standards 2020'
								last_generated='July 1, 2020'
								info_snippet='This is a report on the health infrastructure norms and standards between the time period of 2020.'
							/>
							<ReportItem
								title='Health Infrastructure Norms and Standards 2020'
								last_generated='July 1, 2020'
								info_snippet='This is a report on the health infrastructure norms and standards between the time period of 2020.'
							/>
						</List>
						<div className='flex-grow flex items-center justify-end w-full md:w-auto'>
							{/* --- */}
							{user && user?.is_national && (
								<div className='w-full flex flex-col items-end justify-end mb-3'>
									{filters &&
										Object.keys(filters).length > 0 &&
										Object.keys(filters).map((ft) => (
											<div
												key={ft}
												className='w-full max-w-xs flex flex-col items-start justify-start mb-3'>
												<label
													htmlFor={ft}
													className='text-gray-600 capitalize font-semibold text-sm ml-1'>
													{ft.split('_').join(' ')}:
												</label>
												<Select
													name={ft}
													defaultValue={drillDown[ft] || 'national'}
													id={ft}
													className='w-full max-w-xs p-1 rounded bg-gray-50'
													options={(() => {
														if (user && user?.is_national) {
															let opts = [
																{
																	value: 'national',
																	label: 'National summary',
																},
																...Array.from(filters[ft] || [], (fltopt) => {
																	if (
																		fltopt.id != null &&
																		fltopt.id.length > 0
																	) {
																		return {
																			value: fltopt.id,
																			label: fltopt.name + ' county',
																		};
																	}
																}),
															];
															return opts;
														} else {
															let opts = [
																...Array.from(filters[ft] || [], (fltopt) => {
																	if (
																		fltopt.id != null &&
																		fltopt.id.length > 0
																	) {
																		return {
																			value: fltopt.id,
																			label: fltopt.name + ' county',
																		};
																	}
																}),
															];
															return opts;
														}
													})()}
													placeholder={
														ft.split('_').join(' ')[0].toUpperCase() +
														ft.split('_').join(' ').slice(1)
													}
													onChange={(sl) => {
														let nf = {};
														if (
															sl &&
															sl !== null &&
															typeof sl === 'object' &&
															!Array.isArray(sl)
														) {
															nf[ft] = sl.value;
														} else {
															delete nf[ft];
															// let rr = drillDown.filter(d => d.key !== ft)
															// setDrilldown(rr)
														}
														setDrillDown({ ...drillDown, ...nf });
														let value = sl.value;
														if (value === 'national') {
															router.push('/reports/static_reports');
														} else {
															router.push(
																'/reports/static_reports?county=' + value
															);
														}
													}}
												/>
											</div>
										))}
									{/* ~~~F L T R S~~~ */}
								</div>
							)}
							{/* --- */}
						</div>
					</div>

					{/* (((((( Floating div at bottom right of page */}
					<div className='fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3'>
						<h5 className='text-sm font-bold'>
							<span className='text-gray-600 uppercase'>Limited results</span>
						</h5>
						<p className='text-sm text-gray-800'>
							For testing reasons, downloads are limited to the first 100
							results.
						</p>
					</div>
					{/* ))))))) */}
				</div>
			</MainLayout>
		</div>
	);
};

StaticReports.getInitialProps = async (ctx) => {
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	console.log('############################## ----------------- ' + API_URL);

	const fetchFilters = (token) => {
		// let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Csub_county'
		let filters_url = API_URL + '/common/filtering_summaries/?fields=county';
		return fetch(filters_url, {
			headers: {
				Authorization: 'Bearer ' + token,
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.then((jzon) => {
				return jzon;
			})
			.catch((err) => {
				console.log('Error fetching filters: ', err);
				return {
					error: true,
					err: err,
					filters: [],
					api_url: API_URL,
				};
			});
	};

	const fetchData = (token) => {
		let url = API_URL + '/facilities/reports/static_reports';

		let query = { searchTerm: '' };
		if (ctx?.query?.q) {
			query.searchTerm = ctx.query.q;
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`;
		}
		let other_posssible_filters = ['county'];

		other_posssible_filters.map((flt) => {
			if (ctx?.query[flt]) {
				query[flt] = ctx?.query[flt];
				if (url.includes('?')) {
					url += `&${flt}=${ctx?.query[flt]}`;
				} else {
					url += `?${flt}=${ctx?.query[flt]}`;
				}
			}
		});
		console.log('running fetchData(' + API_URL + ')');

		return fetch(url, {
			headers: {
				Authorization: 'Bearer ' + token,
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.then((json) => {
				return {
					data: json,
					query,
					path: ctx.asPath,
					//   || '/reports/static_reports',
					current_url: url,
					api_url: process.env.NEXT_PUBLIC_API_URL,
				};
			})
			.then((json) => {
				return fetchFilters(token).then((ft) => {
					return {
						data: json,
						query,
						filters: { ...ft },
						path: ctx.asPath || '/dashboard',
						current_url: url,
						api_url: API_URL,
					};
				});
			})
			.catch((err) => {
				console.log('Error fetching dynamic reports: ', err);
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					filters: {},
					path: ctx.asPath,
					//    || '/reports/static_reports',
					current_url: '',
					api_url: API_URL,
				};
			});
	};
	return checkToken(ctx.req, ctx.res)
		.then((t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				return fetchData(token).then((t) => t);
			}
		})
		.catch((err) => {
			console.log('Error checking token: ', err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				}
				//   else {
				//       window.location.href = '/reports/static_reports'
				//   }
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath,
					//   || '/reports/static_reports',
					current_url: '',
					api_url: API_URL,
				};
			}, 1000);
		});
};

export default StaticReports;
