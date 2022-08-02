// React imports
import React from 'react';

// Next imports

// MUI imports
import { ListItem, ListItemText } from '@mui/material';

// Heroicons imports
import { DownloadIcon } from '@heroicons/react/solid';

function ReportItem({ title, last_generated, info_snippet })
{
	return (
		<span
			className='text-green-700'>
			<ListItem
				sx={{
					width: 'auto',
					display: 'flex',
					py: 3,
					flexDirection: 'row',
					justifyContent: 'between',
					alignItems: 'center',
					borderBottom: 1,
					borderBottomColor: 'Grey',
				}}>
				<DownloadIcon className='w-8 h-8 text-green-800' />
				<ListItemText
					className='ml-3'
					primary={title}
					secondary={info_snippet}
				/>
				<ListItemText secondary={'Last generated on ' + last_generated} />
				<a href={`/static_reports/download?title=${ title }`}>
					<button className='bg-transparent hover:bg-green-800 rounded-md font-semibold hover:text-white py-2 px-4 border border-green-800 hover:border-transparent'>
						Download
					</button>
				</a>
			</ListItem>
		</span>
	);
}

export default ReportItem;
