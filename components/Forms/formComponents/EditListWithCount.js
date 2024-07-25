import { useState, useEffect, useRef, useContext } from 'react'
// import { defer } from 'underscore';
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
    // PlusIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert'
import Spinner from '../../Spinner'
import { useRouter } from 'next/router'
import { Alert } from '@mui/lab'
import { SubmitTypeCtxInfra } from '../InfrastructureForm';
import { SubmitTypeCtxHr } from '../HumanResourceForm'

function EditListWithCount(
    {
        otherItemsCategory,
        itemsCategoryName,
        itemId,
        handleItemsSubmit,
        handleItemsUpdate,
        handleItemPrevious,
        nextItemCategory,
        previousItemCategory,
        setSubmitting,
        submitting,
        categoryItems,
        options,
        token,
        itemData,
        title,
        setFormId,
        from
    }
) {

    const alert = useAlert()

    const router = useRouter()

    const [isFormSubmit, setIsFormSubmit] = useState(false)
    const [itemOptions, setItemOptions] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [query, setQuery] = useState('')
    const [isActive, setIsActive] = useState(null);
    const [formError, setFormError] = useState(null)
    

    const submitType = itemsCategoryName.includes('infrastructure') ? useContext(SubmitTypeCtxInfra) : useContext(SubmitTypeCtxHr)

    //console.log(options)
    const [selectedRows, setSelectedRows] = useState((itemData ? (() => {

        const result = []

        if (itemData.length > 0 && from !== "previous") {
            itemData.forEach((element) => {
                if (itemsCategoryName.includes('human resource')) {
                    const cat = options?.filter((e) => e.id == element.speciality)[0].category
                    result.push({
                        rowid: element.speciality,
                        sname: element.speciality_name,
                        count: element.count,
                        category_id: cat,
                        category_name: options.filter((e) => e.id == element.speciality)[0].category_name,
                        iscategoryvisible: false
                    })

                }
                else if (itemsCategoryName.includes('infrastructure')) {

                    result.push({
                        rowid: element?.infrastructure,
                        sname: element?.infrastructure_name,
                        count: element?.count,
                        category_id: options.filter((e) => e.id == element.infrastructure)[0]?.category,
                        category_name: options.filter((e) => e.id == element.infrastructure)[0]?.category_name,
                        iscategoryvisible: true
                    })

                }
            });

            return result


        } else {
            return itemData
        }


    })() : []))


    const selectedCountByNames = selectedRows.reduce((acc, sc) => {
        const { category_id, count } = sc;
        const counter = 0
        if (category_id && count) acc[category_id] = counter + 1
        return acc;
    }, {})



    const [categoryOptions, setCategoryItems] = useState(() => {

        let newarray = [];
        categoryItems.forEach(element => {
            newarray.push({
                value: element.value,
                label: element.label,
                catcount: selectedCountByNames[element.value] ?? 0
            });
        });
        return newarray;
    });




    const editItem = itemsCategoryName.includes('human resource') ? itemData?.map((it) => { return { id: it.id, name: it.speciality_name, count: it.count } }) : itemData?.map(({ infrastructure_name: name, infrastructure: id, count }) => ({ id, name, count }));

    const [savedItems] = useState(itemData ? editItem : [])

    const [showItemCategory, setShowItemCategory] = useState(false)


    function countCategoryTotalSpecialities(newValue, category) {
        let total = 1;

        categoryOptions.forEach(item => {
            if (item.value == category) {
                selectedRows.filter(k => k.category_id == category).forEach(element => {
                    if (newValue) {
                        total += 1
                    } else {
                        console.log({ total })
                        total = item.catcount - 1
                    }
                    //parseInt(element.count);
                });
            }
        });


        if (categoryOptions.some(item => item.value == category)) {
            console.log({ total })
            setCategoryItems(prevArray =>
                prevArray.map(item =>
                    item.value === category ? { ...item, catcount: Number(total) } : item
                )
            );
        }
    }



    useEffect(() => {

        // reset itemOptions
        if (isFormSubmit && otherItemsCategory) setItemOptions(((options) => {
            return options?.map(({ name, subCategories, value }) => ({
                label: name,
                options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
            }))
        })(otherItemsCategory))

        return () => {
            setIsFormSubmit(false)

        }

    }, [isFormSubmit])

    const filterSpecialities = (ctg) => {


        const filteredOptions = options.filter((option) => option.category === ctg);
        setSpecialities(filteredOptions)
        setIsActive(ctg)
    }

    function handleSearchItemFocus(e) {
        e.preventDefault()

        if (!showItemCategory) {
            setShowItemCategory(true)
        }
    }

    function handleCheckboxChange(id, name, category, category_name, checked) {

        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows?.filter((row) => row?.rowid == id).length > 0) {
                return prevSelectedRows?.filter((row) => row?.rowid !== id);
            } else {
                let customitem = {}
                itemsCategoryName.includes('human resource') ? customitem = { rowid: id, sname: name, count: 0, category_id: category, category_name: category_name, iscategoryvisible: false } : itemsCategoryName.includes('infrastructure') ? customitem = { rowid: id, sname: name, category: category_name, count: 0, category_id: category, category_name: category_name, iscategoryvisible: true } : {}
                return [...prevSelectedRows, customitem];
            }
        });

        countCategoryTotalSpecialities(checked, category)

    };


    function handleInputChange(rowvalue, targetvalue) {
        // Update the selected rows values

        if (selectedRows.some(item => item.rowid == rowvalue)) {
            setSelectedRows(prevArray =>
                prevArray.map(item =>
                    item.rowid === rowvalue ? { ...item, count: targetvalue } : item
                )
            );

        }

    };


    function handleSubmit(e) {

        e.preventDefault();

        setSubmitting(true)



        if (itemData) {

            const newSelectedRows = selectedRows.filter(({ rowId }, i) => rowId == itemData[i]?.id)



            handleItemsUpdate(token, [newSelectedRows, itemId])
                .then(resp => {
                    if (resp.ok) {
                        setSubmitting(false)
                        alert.success(`Facility ${e.target.name.includes("infrastructure") ? 'Infrastructure' : 'Human resource'} form updated successfully`)

                        if(submitType.current == null) {
                            router.push({
                                pathname: '/facilities/facility_changes/[facility_id]',
                                query: {
                                    facility_id: itemId
                                }
                            })
                        }
                      


                    } else {
                        setSubmitting(false)
                        alert.error(`Unable to update facility ${e.target.name.includes("infrastructure") ? 'Infrastructure' : 'Human resource'}`)

                        resp.json()
                            .then(resp => {
                                const formResponse = []
                                setFormError(() => {
                                    if (typeof resp == 'object') {
                                        const respEntry = Object.entries(resp)

                                        for (let [k, v] of respEntry) {
                                            formResponse.push(`${k}:['${v}']`)
                                        }

                                        return `Error: ${formResponse.join("\n  ")}`
                                    }
                                })
                            })

                    }
                })
        }
        else {
            nextItemCategory === 'finish' ? /* Human Resource */ (() => {

                handleItemsSubmit(token, selectedRows, itemId)
                    .then(resp => {
                        if (resp.ok) {

                            setSubmitting(false)
                            alert.success('Facility humanresource saved successfully')


                            router.push(`/facilities/${itemId}`)

                        } else {
                            setSubmitting(false)
                            alert.error('Unable to save facility humanresource')
                            resp.json()
                                .then(resp => {
                                    const formResponse = []
                                    setFormError(() => {
                                        if (typeof resp == 'object') {
                                            const respEntry = Object.entries(resp)

                                            for (let [_, v] of respEntry) {
                                                formResponse.push(v)
                                            }

                                            return `Error: ${formResponse.join(" ")}`
                                        }
                                    })
                                })
                        }

                    })

            })() :  /* Infrastructure */ handleItemsSubmit(token, selectedRows, itemId)
                .then(resp => {
                    if (resp.ok) {
                        setSubmitting(false)
                        alert.success('Facility Infrastructure saved successfully')

                        const infrastructure = selectedRows.map(({ rowid }) => ({ infrastructure: rowid }))

                        const payload = JSON.stringify(infrastructure)

                        const base64EncPayload = Buffer.from(payload).toString('base64')


                        if (window) {
                            window.localStorage.setItem('infrastructure', base64EncPayload)
                        }

                        router.push({
                            pathname: `${window.location.origin}/facilities/add`,
                            query: {
                                //   formData: base64EncPayload,
                                formId: 6,
                                facilityId: itemId,
                                from: 'submission'

                            }
                        })
                            .then((navigated) => {
                                if (navigated) setFormId(6)
                            })




                    } else {

                        setSubmitting(false)
                        alert.error('Unable to save facility infrastructure')
                        resp.json()
                            .then(resp => {
                                const formResponse = []
                                setFormError(() => {
                                    if (typeof resp == 'object') {
                                        const respEntry = Object.entries(resp)

                                        for (let [_, v] of respEntry) {
                                            formResponse.push(v)
                                        }

                                        return `Error: ${formResponse.join(" ")}`
                                    }
                                })
                            })

                    }

                })
                .catch(e => console.error('unable to submit item data. Error:', e.message))
        }
    }



    function onSearch(event, issearchcategory, issearchspeciality) {


        const _query = event.target.value;
        setQuery(_query);
        if (_query.length > 3) {
            if (issearchcategory) {
                let subset = categoryItems.filter((e) => e.label.toLowerCase().includes(_query.toLowerCase()))
                setCategoryItems(subset);
            } else if (issearchspeciality) {
                let _specialities = specialities.filter((e) => e.name.toLowerCase().includes(_query.toLowerCase()))
                setSpecialities(_specialities);
            }
        }
        else {
            if (issearchspeciality) {
                filterSpecialities(specialities[0].category)
            }
            setCategoryItems(categoryItems);
        }
    }




    return (

        <form
            name={`${itemsCategoryName}_form`}

            className="flex flex-col w-full items-start justify-start gap-3"
            onSubmit={handleSubmit}
        >

            {formError && <Alert severity='error' className={'w-full text-wrap'}><code>{formError}</code></Alert>}

            <div className='w-full grid grid-cols-12 gap-4'>


                {/* summary table */}
                <div className="col-span-12 max-h-96 overflow-auto" >

                    <table className="table-auto border border-gray-300 w-full">
                        <thead>
                            <tr>
                                {title.map((t, i) => (
                                    <th className="border border-gray-300 px-1 py-1" key={i}>{t}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className='bg-gray-50 shadow-md'>
                            {selectedRows.length === 0 && <tr><td colSpan={3} className="text-center">No specialities found</td></tr>}
                            {selectedRows.map((row, i) => {
                                return (<tr key={i}>
                                    <td className="border border-gray-300 px-1 py-1">{row?.sname}</td>
                                    {row?.iscategoryvisible ? <td className="border border-gray-300 px-1 py-1">{row?.category_name}</td> : null}
                                    <td className="border border-gray-300 px-1 py-1">Yes</td>
                                    <td className="border border-gray-300 px-1 py-1">{row?.count ? Number(row?.count) : null}</td>
                                </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>


                {/* Category Input Section */}
                <div className="col-span-5" >
                    <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-blue-900">Categories</h4>
                    <input type="text" onFocus={handleSearchItemFocus} onChange={(e) => onSearch(e, true, false)} className="col-span-12 border border-gray-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                    {!showItemCategory && <div className="text-center border-l border-gray-500 border-r border-b w-full">{`Search for ${itemsCategoryName.includes('infrastructure') ? 'infrastructure' : 'a speciality'}`}</div>}

                    <br />
                    {
                        showItemCategory &&
                        <ul className='max-h-96 overflow-auto border-r border-l border-b border-gray-500'>
                            {categoryOptions.map(({ label, value, catcount }) => (
                                <div key={value}
                                    className='card bg-gray-50 shadow-md p-2 group hover:bg-gray-500 hover:text-gray-50 hover:cursor-pointer'
                                >
                                    <li
                                        className="flex items-center justify-start w-full cursor-pointer space-x-2 p-1 px-2"
                                        onClick={() => {
                                            filterSpecialities(value)
                                        }}
                                        key={value}>{label}</li>
                                    <span>({`${catcount}` == 'NaN' ? 0 : catcount} selected)</span>
                                    <hr className='border-xs boredr-gray-200 group-hover:border-gray-500'></hr>
                                </div>

                            ))}
                        </ul>
                    }
                </div>

                {/* Category Display Section */}
                <div className="col-span-7" >
                    <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-blue-900">{itemsCategoryName.includes('human resource') ? 'Specialities' : itemsCategoryName.includes('infrastructure') ? 'Infrastructure' : null}</h4>
                    <input type="text" onChange={(e) => onSearch(e, false, true)} className="col-span-12 border border-gray-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                    <br />
                    <div className='max-h-96 overflow-auto border-r border-l border-b border-gray-500'>

                        <table className="table-auto w-full">
                            <thead>
                                <tr>

                                </tr>
                            </thead>
                            <tbody className='bg-gray-50 shadow-md'>
                                {specialities.length === 0 && <tr><td colSpan={3} className="text-center">{`No ${itemsCategoryName.includes('infrastructure') ? 'infrastructure' : 'specialities'} found`}</td></tr>}

                                {specialities.map((row) => (

                                    <tr key={row?.id} >
                                        <td className="border px-1 py-1">
                                            <label className="w-full p-2" >{row?.name}</label>
                                        </td>
                                        <td className="border px-1 py-1">
                                            <input
                                                type="checkbox"
                                                name="itemCheckBox"
                                                className="p-1 w-5 h-5"
                                                checked={selectedRows.some(item => item?.rowid?.includes(row?.id))}
                                                onChange={(e) => handleCheckboxChange(
                                                    row?.id,
                                                    row?.name,
                                                    row?.category,
                                                    row?.category_name,
                                                    e.target.checked)
                                                }
                                            /> Yes
                                        </td>
                                        <td className="border px-1 py-1">

                                            {
                                                (
                                                    !row?.name?.includes("Main Grid") &&
                                                    !row?.name?.includes("Gas") &&
                                                    !row?.name?.includes("Bio-Gas") &&
                                                    !row?.name?.includes("Solar") &&
                                                    !row?.name?.includes("Bio-Gas") &&
                                                    !row?.name?.includes("Generator") &&
                                                    !row?.name?.includes("Battery Backups") &&


                                                    // WATER SOURCE
                                                    !row?.name?.includes("Roof Harvested Water") &&
                                                    !row?.name?.includes("River / Dam / Lake") &&
                                                    !row?.name?.includes("Donkey Cart / Vendor") &&
                                                    !row?.name?.includes("Piped Water") &&
                                                    !row?.name?.includes("Protected Wells / Springs") &&
                                                    !row?.name?.includes("Bore Hole") &&

                                                    // MEDICAL WASTE MANAGEMENT
                                                    !row?.name?.includes("Sewer systems") &&
                                                    !row?.name?.includes("Dump without burning") &&
                                                    !row?.name?.includes("Open burning") &&
                                                    !row?.name?.includes("Remove offsite") &&
                                                    !row?.name?.includes("Septic Tank") &&
                                                    !row?.name?.includes("Composite Pit") &&
                                                    !row?.name?.includes("Placenta Pit") &&
                                                    !row?.name?.includes("Burning incenerator") &&
                                                    !row?.name?.includes("Burning Chamber") &&
                                                    !row?.name?.includes("Incinerator") &&
                                                    !row?.name?.includes("Public Sewer system") &&
                                                    !row?.name?.includes("Biodigester") &&
                                                    !row?.name?.includes("Microwave") &&
                                                    !row?.name?.includes("Macerator") &&

                                                    // ACCESS ROADS
                                                    !row?.name?.includes("Tarmac") &&
                                                    !row?.name?.includes("Earthen Road") &&
                                                    !row?.name?.includes("Graded ( Murrum )") &&
                                                    !row?.name?.includes("Gravel") &&

                                                    // CSSD Infrastructure
                                                    !row?.name?.includes("Central Sterile Service") &&
                                                    !row?.name?.includes("Storage room for sterile supplies") &&
                                                    !row?.name?.includes("Sluice room") &&
                                                    !row?.name?.includes("Autoclave")


                                                )
                                                &&
                                                <input
                                                    required
                                                    type="number"
                                                    className="p-1"
                                                    min={0}
                                                    name={row?.id}
                                                    onChange={(e) => {
                                                        e.preventDefault()
                                                        handleInputChange(row?.id, e.target.value)
                                                    }}
                                                    disabled={!selectedRows.some(item => item?.rowid?.includes(row?.id))}
                                                />
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>




            </div>
            {/* Save btn */}

            {
                itemData !== null &&

                <div className="w-full flex justify-end gap-3 h-auto mt-3">
                     <button 
                     type='submit'  
                     disabled={submitting && submitType.current == 'continue'}
                     onClick={() => {submitType.current = 'continue'}} 
                     className='p-2 text-white bg-blue-600  font-semibold'>
                        <span className='text-medium font-semibold text-white'>
                            {
                                submitting && submitType.current == 'continue' ?
                                    <div className='flex items-center gap-2'>
                                        <span className='text-white'>Saving </span>
                                        <Spinner />
                                    </div>
                                    :
                                    'Save and Continue'
                            }
                        </span>
                    </button>
                    <button 
                    disabled={submitting && submitType.current == null}
                    type='submit' className='p-2 text-white bg-blue-600  font-semibold'>
                        <span className='text-medium font-semibold text-white'>
                            {
                                submitting && submitType.current == null ?
                                    <div className='flex items-center gap-2'>
                                        <span className='text-white'>Saving </span>
                                        <Spinner />
                                    </div>
                                    :
                                    'Save and Finish'
                            }
                        </span>
                    </button>
                </div>
            }

            {
                itemData === null &&

                <div className='flex justify-between items-center w-full mt-4'>
                    <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-gray-900  px-2'>
                        <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
                        <span className='text-medium font-semibold text-gray-900 '>
                            {previousItemCategory}
                        </span>
                    </button>
                    <button
                        type='submit'
                        className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>

                        <span className='text-medium font-semibold text-white'>
                            {
                                submitting ?
                                    <Spinner />
                                    :
                                    nextItemCategory

                            }
                        </span>
                        {
                            submitting ?
                                <span className='text-white'>Saving </span>
                                :
                                <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

                        }
                    </button>
                </div>
            }





        </form>
    )
}


export default EditListWithCount