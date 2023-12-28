
import { useEffect, useState } from "react"
import { checkToken } from "../../../controllers/auth/auth"
import MainLayout from "../../../components/MainLayout"
import FacilitySideMenu from "../../../components/FacilitySideMenu"
import { useAlert } from "react-alert";
import { useRouter } from "next/router";
import FacilityUpdatesTable from "../../../components/FacilityUpdatesTable";

export default function FacilityChanges({ facility }) {

    const filters = [];
    const alert = useAlert()
    const router = useRouter()

    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState('')
    const [allFctsSelected, setAllFctsSelected] = useState(false);
    const [title, setTitle] = useState('');
    const [isClient, setIsClient] = useState(false);



    useEffect(() => {
        console.log({
            facility
        })

        setIsClient(true)
    }, [])


    if (isClient) {
        return (
            <MainLayout>
                <div className="w-full grid grid-cols-5 h-full my-24 gap-4">
                    {/* Facility Side Menu Filters */}
                    <div className="md:col-span-1 ">
                        <FacilitySideMenu
                            filters={filters}
                            states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                            stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
                    </div>

                    <div className="md:col-span-4 bg-blue-50 p-6 shadow-md flex flex-col items-center md:gap-3 gap-y-3">

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
                                            new Date(facility?.changes?.updated)
                                                .toLocaleString()
                                                .split(",")[0]
                                        }
                                    </span>
                                    {" "}
                                    by
                                    {" "}
                                    <span className="text-blue-900 font-semibold text-base ">
                                        {facility?.changes?.created_by_name}
                                    </span>
                                </p>

                                <p className="text-base font-normal flex gap-x-1 ">
                                    Facility :
                                    {" "}
                                    <span className="text-blue-900 font-semibold text-base ">
                                        {facility?.data?.name}
                                    </span>
                                </p>
                             
                                <p className="text-base font-normal flex gap-x-1 ">
                                    Facility Code:
                                    {" "}
                                    <span className="text-blue-900 font-semibold text-base ">
                                        {facility?.data?.code ?? '-'}
                                    </span>
                                </p>


                                <span className="flex space-x-2">
                                    <button
                                        className="flex justify-center text-base font-semibold text-white bg-blue-500  py-1 px-2"
                                        onClick={() => router.push(`/facilities/edit/${facility?.data?.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="flex justify-center text-base font-semibold text-white bg-blue-500  py-1 px-2"
                                        onClick={() => {

                                            alert.success("Facility updates saved successfully")
                                            router.push("/facilities")
                                        }}
                                    >
                                        Confirm Updates
                                    </button>
                                </span>
                            </div>

                            {/* Update Details */}

                            <FacilityUpdatesTable
                                facilityUpdatedJson={facility?.changes?.facility_updated_json}
                                originalData={facility?.data}
                            />
                        </div>
                    </div>
                </div>
            </MainLayout>
        )
    }
    else {
        return null
    }
}

export async function getServerSideProps(ctx) {


    const token = (await checkToken(ctx.req, ctx.res))?.token

    async function fetchFacility(facilityId) {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((facility) => facility)
            .catch(e => console.error('Unable to fetch Facility Latest Update Id Error:', e.message))
    }

    async function fetchFacilityChanges(updateId) {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${updateId}/`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((facilityChanges) => facilityChanges) // facility_updated_json
            .catch(e => console.error('Unable to fetch Facility Latest Update Id Error:', e.message))

    }

    const facility = await fetchFacility(ctx?.query?.id)


    return {
        props: {
            facility: {
                changes: await fetchFacilityChanges(facility?.latest_update) ?? {},
                oldValues: ctx?.query?.old_values ?? '',
                data: facility
            }
        }
    }
}