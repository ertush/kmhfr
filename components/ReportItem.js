// React imports
import React from 'react';


// MUI imports
import { ListItem, ListItemText } from '@mui/material';

// Heroicons imports
import { DownloadIcon } from '@heroicons/react/solid';


function ReportItem({ title, last_generated, info_snippet }) {
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
				<button className='bg-transparent hover:bg-green-800 rounded-md font-semibold hover:text-white py-2 
					px-4 border border-green-800 hover:border-transparent' onClick={()=>{downloadCSV()}}>
					Download
				</button>

			</ListItem>
		</span>
	);
}

function downloadCSV(){

	// var sum = 5 + 9;
	// return console.log(sum);

    //create CSV file data in an array  
    var csvFileData = [  
        ['KMHFL', '2018'],  
        ['KHIS', '2020'],  
        ['DHIS', '2016'],  
        ['PWS', '2019'],  
        ['EVL', '2017']  
    ];  
        
    //define the heading for each row of the data  
    var csv = 'Department,Year\n';  
    
    //merge the data with CSV  
    csvFileData.forEach(function(row) {  
        csv += row.join(',');  
        csv += "\n";  
    });
	
	//display the created CSV data on the web browser   //document.write(csv);         
	var hiddenElement = document.createElement('a');  
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
	hiddenElement.target = '_blank';  
		
	//provide the name for the CSV file to be downloaded  
	hiddenElement.download = 'Dummy Data.csv';  
	hiddenElement.click();   
}

export default ReportItem;
