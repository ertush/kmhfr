import { checkToken } from "../../../controllers/auth/public_auth"

export default async function fetchDashboardData(req, res) {


    const token = (await checkToken(req, res))?.token

    const data = {}

    const ownerTypes = [
        { moh: "6a833136-5f50-46d9-b1f9-5f961a42249f" },
        { faith_based: "ca268e6b-7e45-4264-97bf-43b6c68fb21e" },
        { private_facilities: "d9a0ce65-baeb-4f3b-81e3-083a24403e92" },
        { ngo: "ffad4810-0bfb-4434-84cb-d2ab9b911c41" },
        { chu_fully_functional: "50ef43f0-887c-44e2-9b09-cfa7a7090deb" },
        { chu_semi_functional: "fbc7fce5-3328-4dad-af70-0ec3d8f5ad80" },
        { chu_non_functional: "bac8ab50-1dad-4f96-ab96-a18a4e420871" },
        { chu_closed: "2943e6c1-a581-461e-85a4-b9f25a2674ab" },
        { facilities: "" },
        { chus: "" }
    ]

    if (token) {


        for (let [idx, type] of Object.entries([...Object.values(ownerTypes)])) {
            // console.log("id", idx, "type", type.moh)

            try {
                switch (idx) {
                    case '0':
                        const moh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?owner_type=${type.moh}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["moh"] = (await moh.json())?.count

                        break;

                    case '1':
                        const faith_based = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?owner_type=${type.faith_based}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["faith_based"] = (await faith_based.json())?.count

                        break;

                    case '2':
                        const private_facilities = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?owner_type=${type.private_facilities}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["private_facilities"] = (await private_facilities.json())?.count

                        break;

                    case '3':
                        const ngo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?owner_type=${type.ngo}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["ngo"] = (await ngo.json())?.count

                        break;

                    case '4':
                        const chu_fully_functional = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/?status=${type.chu_fully_functional}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["chu_fully_functional"] = (await chu_fully_functional.json())?.count

                        break;

                    case '5':
                        const chu_semi_functional = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/?status=${type.chu_semi_functional}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["chu_semi_functional"] = (await chu_semi_functional.json())?.count

                        break;

                    case '6':
                        const chu_non_functional = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/?status=${type.chu_non_functional}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["chu_non_functional"] = (await chu_non_functional.json())?.count

                        break;

                    case '7':
                        const chu_closed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/?status=${type.chu_closed}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["chu_closed"] = (await chu_closed.json())?.count

                        break;

                    case '8':
                        const facilities = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["facilities"] = (await facilities.json())?.count

                        break;

                    case '9':
                        const chus = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        data["chus"] = (await chus.json())?.count

                        break;
                }
            } catch (e) {
                console.error('Unable to fetch', e.message)

            }
        }


        res.status(200).json(
            !Object.values(data).includes(undefined) ?
                {

                    loggedIn: false,

                    offline: false,
                    data
                }
                :
                {
                    loggedIn: false,
                    offline: true,
                    data: {
                        moh: "-",
                        faith_based: "-",
                        private_facilities: "-",
                        ngo: "-",
                        chu_fully_functional: "-",
                        chu_semi_functional: "-",
                        chu_non_functional: "-",
                        chu_closed: "-",
                        facilities: "-",
                        chus: "-"
                    }
                }
        )

    }


}