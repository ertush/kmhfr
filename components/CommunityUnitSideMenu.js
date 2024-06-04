import React from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';


export default function CommunityUnitSideMenu({ _pathId, filters, qf }) {


	const router = useRouter()

	const searchParams = useSearchParams()


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



	return (
		<div className='col-span-1 flex rounded flex-col gap-3 md:col-start-1  md:mb-12 py-0 h-full bg-gray-50 shadow-md'>
			<List
				className='p-0 m-0'
				component="nav"
				aria-labelledby="nested-list-subheader"
				sx={{
                    paddingTop:0, 
                    paddingBottom:0
                }}

			>
				{quickFilters.map((qf, i) => {
					return (

						<ListItemButton
							key={qf.id}
							sx={(() => {
								switch (qf.name) {
									case 'All Community Health Units':
										return { 
											backgroundColor: (searchParams.get('filter') == 'all_chu') && '#1d4ed8',
											color: (searchParams.get('filter') == 'all_chu') && '#ffff',
											borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
											borderTopLeftRadius: '4px',
											borderTopRightRadius: '4px',
											"&:hover": {
											backgroundColor: "rgba(37, 99, 235, 1)",
											color: "white"
										  }
										}
										
									case 'Approved Community Health Units':
										return { 
											backgroundColor: (searchParams.get('filter') == 'approved_chu') && '#1d4ed8',
											color: (searchParams.get('filter') == 'approved_chu') && '#ffff',
											borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
											"&:hover": {
											backgroundColor: "rgba(37, 99, 235, 1)",
											color: "white"
										}}

									case 'New Community Health Units Pending Approval':
										return { 
											backgroundColor: (searchParams.get('filter') == 'new_pending_approval_chu') && '#1d4ed8',
											color: (searchParams.get('filter') == 'new_pending_approval_chu') && '#ffff',
											borderBottom: 'solid 1px  rgba(156, 163, 175, 1)',
											"&:hover": {
											backgroundColor: "rgba(37, 99, 235, 1)",
											color: "white"
										 }}

									case 'Updated Community Health Units Pending Approval':
										return { 
											backgroundColor: (searchParams.get('filter') == 'updated_pending_approval_chu') && '#1d4ed8',
											color: (searchParams.get('filter') == 'updated_pending_approval_chu') && '#ffff',
											borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
											"&:hover": {
											backgroundColor: "rgba(37, 99, 235, 1)",
											color: "white"
										 }
										
									}
									case 'Rejected Community Health Units':
										return { 
											backgroundColor: (searchParams.get('filter') == 'rejected_chu') && '#1d4ed8', 
											color: (searchParams.get('filter') == 'rejected_chu') && '#ffff',
											borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
											"&:hover": {
											backgroundColor: "rgba(37, 99, 235, 1)",
											color: "white"

										 }
									}

								}
							})()}
							name="rt"
							
							onClick={(e) => {
								e.preventDefault()
								switch (qf.name) {
									case 'All Community Health Units':
										
										router.push({
											pathname:'/community-units',
											query: {
												filter:'all_chu'
											}
										})


										break;
									case 'Approved Community Health Units':
										
										router.push({
											pathname:'/community-units',
											query: {
												filter:'approved_chu',
												is_approved: true
											}
										})

										break;

									case 'New Community Health Units Pending Approval':
										
										router.push({
											pathname:'/community-units',
											query: {
												filter:'new_pending_approval_chu',
												pending_approval: true,
												has_edits: false
											}
										})



										break;
									case 'Updated Community Health Units Pending Approval':
										

										router.push({
											pathname:'/community-units',
											query: {
												filter:'updated_pending_approval_chu',
												is_approved: true,
												has_edits: true
											}
										})



										break;
									case 'Rejected Community Health Units':
										
										router.push({
											pathname:'/community-units',
											query: {
												filter:'rejected_chu',
												is_rejected: true
											}
										})



										break;

								}

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

