import React from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';


function CommunityUnitSideMenu({ _pathId, filters, qf }) {


	const router = useRouter()
	const [title, setTitle] = useState('Community Health Units')
	const [pathId, setPathId] = useState(_pathId || '')
	const [approvedCHUSelected, setApprovedCHUSelected] = useState(false);
	const [newCHUSelected, setNewCHUSelected] = useState(false);
	const [updatedCHUSelected, setUpdatedCHUSelected] = useState(false);
	const [rejectedCHUSelected, setRejectedCHUSelected] = useState(false);
	const [chuFeedBack, setCHUFeedBack] = useState([])
	const [allCHUSelected, setAllCHUSelected] = useState(false);
	const [currentQuickFilter, setCurrentQuickFilter] = useState(qf);




	const [chuPendingApproval, setCHUPendingApproval] = useState(false);



	const quickFilters = [
		{
			name: 'All Community Health Units',
			id: 'all',
			filters: Object.keys(filters),
		},
		{
			name: 'Approved Community Health Units',
			id: 'approved',
			filters: [{ id: 'is_approved', value: true }],
		},
		{
			name: 'New Community Health Units Pending Approval',
			id: 'new_pending_approval',
			filters: [
				{ id: 'has_edits', value: false },
				{ id: 'pending_approval', value: true },
			],
		},
		{
			name: 'Updated Community Health Units Pending Approval',
			id: 'updated_pending_approval',
			filters: [
				{ id: 'has_edits', value: true },
				{ id: 'is_approved', value: true },
			],
		},
		{
			name: 'Rejected Community Health Units',
			id: 'rejected',
			filters: [{ id: 'is_rejected', value: true }],
		},
	];


	const handleQuickFiltersClick = async (filter_id) => {

		let filter = {}
		if (filter_id !== 'feedback') {

			const qfilter = quickFilters.filter(({ id }) => id === filter_id).map(f => f.filters.map(({ id, value }) => ({ id, value })))

			qfilter[0].forEach(({ id, value }) => { filter[id] = value })


		}


		switch (filter_id) {
			case 'all':
				setCHUFeedBack([])
				router.push({ pathname: '/community-units', query: { qf: filter_id } })
				break;

			case 'feedback':

				try {
					const feedback = await fetch('/api/community_units/chu_filters/?path=chu_ratings&fields=comment,facility_id,facility_name,chu_name,created,rating&id=feedback')
					const feedbackFacilities = (await feedback.json()).results

					setCHUFeedBack(feedbackFacilities)

				}
				catch (err) {
					console.error(err.message);
				}

				break;
			default:
				setCHUFeedBack([])


				router.push({ pathname: '/community-units', query: { qf: filter_id, ...filter } })
				break;
		}


	}

	useEffect(() => {
		const url = window.history.state.as
		if (url.includes('qf=all')) { setPathId('all'); setAllCHUSelected(true) }
		if (url.includes('is_approved=true')) { setPathId('approved'); setApprovedCHUSelected(true) }
		if (url.includes('qf=new_pending_approval')) { setPathId('new_pending_approval'); setNewCHUSelected(true) }
		if (url.includes('has_edits=true')) { setPathId('has_edits'); setUpdatedCHUSelected(true) }
		if (url.includes('is_rejected=true')) { setPathId('rejected'); setRejectedCHUSelected(true) }


	}, [])

	return (
		<div className='col-span-1 flex flex-col gap-3 md:col-start-1 border bg-django-green md:mb-12 py-0 h-full border-green-600'>
			<List
				className='p-0 m-0'
				component="nav"
				aria-labelledby="nested-list-subheader"

			>
				{quickFilters.map((qf, i) => {
					return (

						<ListItemButton
							key={qf.id}
							sx={(() => {
								switch (qf.name) {
									case 'All Community Health Units':
										return { 
											backgroundColor: (allCHUSelected || pathId === 'all') && 'rgba(5, 150, 105,  1)',
											color: (allCHUSelected || pathId === 'all') && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										  }
										}
										
									case 'Approved Community Health Units':
										return { 
											backgroundColor: (approvedCHUSelected || pathId === 'approved') && 'rgba(5, 150, 105,  1)',
											color: (approvedCHUSelected || pathId === 'approved') && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										}}

									case 'New Community Health Units Pending Approval':
										return { 
											backgroundColor: (newCHUSelected || pathId === 'new_pending_approval') && 'rgba(5, 150, 105,  1)',
											color: (newCHUSelected || pathId === 'new_pending_approval') && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										 }}

									case 'Updated Community Health Units Pending Approval':
										return { 
											backgroundColor: (updatedCHUSelected || pathId === 'has_edits') && 'rgba(5, 150, 105,  1)',
											color: (updatedCHUSelected || pathId === 'has_edits') && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										 }
										
									}
									case 'Rejected Community Health Units':
										return { 
											backgroundColor: (rejectedCHUSelected || pathId === 'rejected') && 'rgba(5, 150, 105,  1)', 
											color: (rejectedCHUSelected || pathId === 'rejected') && '#ffff',
											borderBottom: 'solid 1px rgba(5, 150, 105, 1)', 
											"&:hover": {
											backgroundColor: "rgba(255, 251, 235, 1)",
											color: "rgba(17, 24, 39, 1)"
										 }
									}

								}
							})()}
							name="rt"
							onClick={(evt) => {
								switch (qf.name) {
									case 'All Community Health Units':
										setTitle('All Community Health Units')
										setPathId('all')
										setAllCHUSelected(true)
										setApprovedCHUSelected(false)
										setNewCHUSelected(false)
										setUpdatedCHUSelected(false)
										setCHUPendingApproval(false)
										setRejectedCHUSelected(false)


										handleQuickFiltersClick('all')
										break;
									case 'Approved Community Health Units':
										setTitle('Approved Community Health Units')
										setAllCHUSelected(false)
										setPathId('approved')
										setApprovedCHUSelected(true)
										setNewCHUSelected(false)
										setUpdatedCHUSelected(false)
										setCHUPendingApproval(false)
										setRejectedCHUSelected(false)


										handleQuickFiltersClick('approved')
										break;

									case 'New Community Health Units Pending Approval':
										setTitle('Community Health Units Pending Approval')
										setPathId('new_pending_approval')
										setAllCHUSelected(false)
										setApprovedCHUSelected(false)
										setNewCHUSelected(true)
										setUpdatedCHUSelected(false)
										setCHUPendingApproval(false)
										setRejectedCHUSelected(false)


										handleQuickFiltersClick('new_pending_approval')
										break;
									case 'Updated Community Health Units Pending Approval':
										setTitle(' Community Health Units Pending Approval')
										setPathId('updated_pending_approval')
										setAllCHUSelected(false)
										setApprovedCHUSelected(false)
										setNewCHUSelected(false)
										setUpdatedCHUSelected(true)
										setCHUPendingApproval(false)
										setRejectedCHUSelected(false)


										handleQuickFiltersClick('updated_pending_approval')
										break;
									case 'Rejected Community Health Units':
										setTitle('Rejected Community Health Units')
										setPathId('rejected')
										setAllCHUSelected(false)
										setApprovedCHUSelected(false)
										setNewCHUSelected(false)
										setUpdatedCHUSelected(false)
										setCHUPendingApproval(false)
										setRejectedCHUSelected(true)


										handleQuickFiltersClick('rejected')
										break;

								}

								setCurrentQuickFilter(qf.id);
								let robj = {
									pathname: '/community-units',
									query: {},
								};
								if (qf.id === 'all') {
									router.push(robj);
									return;
								}
								quickFilters.forEach((q_f) => {
									if (q_f.id === qf.id) {
										q_f.filters.map((sf) => {
											robj.query[sf.id] = sf.value;
										});
									}
								});

								router.push(robj);
							}}
						>
							<ListItemText primary={qf.name} />
						</ListItemButton>
					)
				})}


			</List>
		</div>
	)
}

export default CommunityUnitSideMenu