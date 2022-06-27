import { CSVLink } from 'react-csv';

const Download =(props)=>{
            return (

                <a>
                    <CSVLink
                    headers={props?.csvHeaders}
                    filename={`${props?.filename}`+'_'+new Date().toLocaleDateString()+'.csv'}
                    data={props?.data || []}
                    ref={props?.csvLink}
                    target='_blank'>Download</CSVLink>
                </a>
            
            )
}
export default Download