import { useState, useEffect, useRef } from 'react'
// import { defer } from 'underscore';
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
    // PlusIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert'
import Spinner from '../../Spinner'
import { useRouter } from 'next/router'
import {Alert} from '@mui/lab'


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


    function countCategoryTotalSpecialities(specialityid, newvalue, category) {
        let total = 0;
        categoryOptions.forEach(item => {
            if (item.value == category) {
                selectedRows.filter(k => k.category_id == category).forEach(element => {
                    if (element.rowid == specialityid) {
                        element.count = newvalue;
                    }
                    total = total + parseInt(element.count);
                });
            }
        });
        if (categoryOptions.some(item => item.value == category)) {
            setCategoryItems(prevArray =>
                prevArray.map(item =>
                    item.value === category ? { ...item, catcount: Number(total) } : item
                )
            );
        }
    }


    //console.log(options)
    const [selectedRows, setSelectedRows] = useState((itemData ? (() => {
        
        const result = []

        if (itemData.length > 0 && from !== "previous") {
            itemData.forEach((element) => {
                if (itemsCategoryName.includes('human resource')) {
                    const cat = options.filter((e) => e.id == element.speciality)[0].category
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
        acc[category_id] = (acc[category_id] && 0) + count;
        return acc;
    }, {})

    const [categoryOptions, setCategoryItems] = useState(() => {

        let newarray = [];
        categoryItems.forEach(element => {
            let customitem = {}
            if (selectedCountByNames.hasOwnProperty(element.value)) {
                customitem = { value: element.value, label: element.label, catcount: selectedCountByNames[element.value] }
            } else {
                customitem = { value: element.value, label: element.label, catcount: 0 }
            }

            newarray.push(customitem);
        });
        return newarray;
    });

    const editItem = itemsCategoryName.includes('human resource') ? itemData?.map((it) => { return { id: it.id, name: it.speciality_name, count: it.count } }) : itemData?.map(({ infrastructure_name: name, infrastructure: id, count }) => ({ id, name, count }));

    const [savedItems, saveSelectedItems] = useState(itemData ? editItem : [])

    const [showItemCategory, setShowItemCategory] = useState(false)
  
    const [items, setItems] = useState(typeof savedItems === 'string' && savedItems.length > 0 ? JSON.parse(savedItems) : savedItems)

    // Refs


    //Effects 
    useEffect(() => {
        //store service when service is added

        if (selectedRows.length !== 0) {

            const x = selectedRows;

            if (editItem && editItem.length > 1) {
                if (editItem[0]?.id === items[0]?.id) x.push(editItem[0]);
            }

            //Check if infrastructure has count

            x.forEach(obj => {
                if (
                    obj?.sname?.includes("Main Grid") &&
                    obj?.sname?.includes("Gas") &&
                    obj?.sname?.includes("Bio-Gas") &&
                    // WATER SOURCE
                    obj?.sname?.includes("Roof Harvested Water") &&
                    obj?.sname?.includes("River / Dam / Lake") &&
                    obj?.sname?.includes("Donkey Cart / Vendor") &&
                    obj?.sname?.includes("Piped Water") &&
                    // MEDICAL WASTE MANAGEMENT
                    obj?.sname?.includes("Sewer systems") &&
                    obj?.sname?.includes("Dump without burning") &&
                    obj?.sname?.includes("Open burning") &&
                    obj?.sname?.includes("Remove offsite") &&
                    // ACCESS ROADS
                    obj?.sname?.includes("Tarmac") &&
                    obj?.sname?.includes("Earthen Road") &&
                    obj?.sname?.includes("Graded ( Murrum )") &&
                    obj?.sname?.includes("Gravel")
                ) {
                    delete obj['count']
                }
            })


            saveSelectedItems(
                JSON.stringify(x)
            );
            setSelectedRows(x)



        }

        if(itemData) selectedRows.pop()


    }, [selectedRows]);



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
        // function getCheckedCheckBoxCount() {
        //     const checkboxes = document.querySelectorAll('input[name=itemCheckBox]')

        //     console.log(checkboxes)
        // }

        // getCheckedCheckBoxCount()

        const filteredOptions = options.filter((option) => option.category === ctg);
        setSpecialities(filteredOptions)
        setIsActive(ctg)
    }

    function handleSearchItemFocus (e) {
        e.preventDefault()
    
        if(!showItemCategory) {
          setShowItemCategory(true)
        }
      }

    const handleCheckboxChange = (id, name, category, category_name) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows?.filter((row) => row?.rowid == id).length > 0) {
                return prevSelectedRows?.filter((row) => row?.rowid !== id);
            } else {
                let customitem = {}
                itemsCategoryName.includes('human resource') ? customitem = { rowid: id, sname: name, count: 0, category_id: category, category_name: category_name, iscategoryvisible: false } : itemsCategoryName.includes('infrastructure') ? customitem = { rowid: id, sname: name, category: category_name, count: 0, category_id: category, category_name: category_name, iscategoryvisible: true } : {}
                return [...prevSelectedRows, customitem];
            }
        });
    };


    const handleInputChange = (rowvalue, targetvalue) => {
        // Update the selected rows values
        let category = selectedRows.filter(k => k.rowid == rowvalue)[0]
        if (selectedRows.some(item => item.rowid == rowvalue)) {
            setSelectedRows(prevArray =>
                prevArray.map(item =>
                    item.rowid === rowvalue ? { ...item, count: targetvalue } : item
                )
            );

        }
        countCategoryTotalSpecialities(rowvalue, targetvalue, category.category_id)
    };


    function handleSubmit(e) {

        e.preventDefault();

        setSubmitting(true)

        if (itemData) {

            const newSelectedRows = selectedRows.filter(({rowId}, i) => rowId == itemData[i]?.id) 


            handleItemsUpdate(token, [newSelectedRows, itemId])
                .then(resp => {
                    if (resp.ok) {
                        setSubmitting(false)
                        alert.success(`Facility ${e.target.name.includes("infrastructure") ? 'Infrastructure' : 'Human resource'} form updated successfully`)

                        router.push({
                            pathname: '/facilities/facility_changes/[facility_id]',
                            query:{
                                facility_id: itemId
                            }
                        })


                    } else {
                        setSubmitting(false)
                        alert.error(`Unable to update facility ${e.target.name.includes("infrastructure") ? 'Infrastructure' : 'Human resource'}`)
                        
                        resp.json()
                        .then(resp => {
                            const formResponse = []
                            setFormError(() => {
                            if(typeof resp == 'object') {
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
        }
        else
         {
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
                                if(typeof resp == 'object') {
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

                        
                        if(window) {
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
							if(navigated) setFormId(6)
						})

                      


                    } else {

                        setSubmitting(false)
                        alert.error('Unable to save facility infrastructure')
                        resp.json()
                        .then(resp => {
                            const formResponse = []
                            setFormError(() => {
                            if(typeof resp == 'object') {
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



    const onSearch = ((event, issearchcategory, issearchspeciality) => {

        
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
    });


    return (

        <form
            name={`${itemsCategoryName}_form`}

            className="flex flex-col w-full items-start justify-start gap-3"
            onSubmit={handleSubmit}
        >

            {formError && <Alert severity='error' className={'w-full'}>{formError}</Alert>}

            <div className='w-full grid grid-cols-12 gap-4'>
                <div className="col-span-5" >
                    <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-blue-900">Categories</h4>
                    <input type="text" onFocus={handleSearchItemFocus} onChange={(e) => onSearch(e, true, false)} className="col-span-12 border border-gray-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                    {!showItemCategory && <div className="text-center border-l border-gray-500 border-r border-b w-full">{`Search for ${itemsCategoryName.includes('infrastructure') ? 'infrastructure' : 'a speciality' }`}</div>}

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
                                <span>({catcount} selected)</span>
                                <hr className='border-xs boredr-gray-200 group-hover:border-gray-500'></hr>
                            </div>

                        ))}
                    </ul>
                    }
                </div>

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
                                                    itemsCategoryName?.includes('human resource') ? row?.id : itemsCategoryName.includes('infrastructure') ? row?.id : "",
                                                    row?.name,
                                                    row?.category,
                                                    row?.category_name,
                                                    row?.count ? row?.count : 0,
                                                    e.target.checked)
                                                }
                                            /> Yes
                                        </td>
                                        <td className="border px-1 py-1">
                                            {/* <pre>
                                                {
                                                    JSON.stringify(!row?.name?.includes("Main Grid"), null, 2)
                                                }
                                            </pre> */}
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


                                               ) && 
                                            <input
                                                type="number"
                                                className="p-1"
                                                 min={0}
                                                name={row?.id}
                                                onChange={(e) => {
                                                    let cid = row?.id
                                                    handleInputChange(cid, e.target.value)

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
                            {/* {selectedRows.pop()} */}
                            {selectedRows.map((row) => {
                                // if(row.name !== "Vaccine Carriers" && row.name !== "Public Health Technician"){
                                return ( <tr>
                                        <td className="border border-gray-300 px-1 py-1">{row?.sname}</td>
                                       {row?.iscategoryvisible ? <td className="border border-gray-300 px-1 py-1">{row?.category_name}</td> :null }
                                        <td className="border border-gray-300 px-1 py-1">Yes</td>
                                        <td className="border border-gray-300 px-1 py-1">{row?.count ? Number(row?.count) : null}</td>
                                    </tr>
                                )
                                // }
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            {/* Save btn */}

            {
                savedItems.length > 0 && itemData !== null &&

                <div className="w-full flex justify-end h-auto mt-3">
                    <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>
                        <span className='text-medium font-semibold text-white'>
                            {
                                submitting ?
                                    <div className='flex items-center gap-2'>
                                        <span className='text-white'>Saving </span>
                                        <Spinner />
                                    </div>
                                    :
                                    'Save & Finish'
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