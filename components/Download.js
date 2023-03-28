import { CSVLink } from 'react-csv';

const Download =(props)=>{
            return (

                <span className='cursor-pointer'>
                    <CSVLink
                    headers={props?.csvHeaders}
                    filename={`${props?.filename}_${new Date().toLocaleDateString()}.csv`}
                    data={props?.data || []}
                    ref={props?.csvLink}
                    target='_blank'>Download</CSVLink>
                </span>
            
            )
}
export default Download