// import { DataTable } from "@carbon/react"
import MainLayout from '../../components/MainLayout'



export default function Reports () {

  

    return (
        <MainLayout className="p-4 grid place-content-center h-auto">
        {/* <DataTable
        className="w-full h-full"
        rows={{
            
        }}
        cols={Array(10).fill('*')}
        headers={["col1", "col2", "col3", "col4"]}
        
        /> */}
        </MainLayout>
    )
}

export async function getServerSideProps() {
    return {
        props: {}
    }
}   