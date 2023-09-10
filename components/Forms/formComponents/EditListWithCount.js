import { useState, useEffect, useRef } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { defer } from 'underscore';
import { Formik, Form, Field } from 'formik'
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
    PlusIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert'
import { useLocalStorageState } from '../hooks/formHook';


function EditListWithCount(
    {
        initialSelectedItems,
        itemsCategory,
        nextItemCategoryId,
        otherItemsCategory,
        itemsCategoryName,
        itemId,
        item,
        handleItemsSubmit,
        handleItemsUpdate,
        removeItemHandler,
        setIsSavedChanges,
        setItemsUpdateData,
        handleItemPrevious,
        setNextItemCategory,
        nextItemCategory,
        previousItemCategory,
        setIsSaveAndFinish,
        categoryItems,
        options,
        itemData
    }
) {

    const alert = useAlert()

    const [isFormSubmit, setIsFormSubmit] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)
    const [deletedItems, setDeletedItems] = useState([])
    const [itemOptions, setItemOptions] = useState([])


    const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
        const result = []

        if (initialSelectedItems.length > 0) {
            initialSelectedItems.map(({ subCategories, id, meta_id, count }) => {
                        
                result.push({ name: subCategories[0], id, meta_id, count })

            })
        }

        return result

    })() : []))

    const editItem = itemsCategoryName.includes('human resource') ? itemData?.map(({name, id, count}) => ({id, name, count})) : itemData?.map(({infrastructure_name:name,  infrastructure:id, count}) => ({id, name, count}));

    const [savedItems, saveSelectedItems] = useLocalStorageState({
        key: itemData ? `${itemsCategoryName}_edit_form` :  `${itemsCategoryName}_form`,
        value: itemData ? editItem : []
      }).actions.use();

    const items = typeof savedItems === 'string' && savedItems.length > 0 ? JSON.parse(savedItems) : savedItems;


    // Reset local storage if HR form
    // const resetForms = useLocalStorageState({
    //     key: `${itemsCategoryName}_form`,
    //     value: []
    // }).actions.reset()



    // Refs

    const itemRef = useRef(null);
    


    //Effects 
    useEffect(() => {
        //store service when service is added
        if(selectedItems.length !== 0){
            // console.log(selectedItems)

            const x = selectedItems;

            if(editItem && editItem.length > 1){
                if(editItem[0]?.id === items[0]?.id) x.push(editItem[0]);
            }

          saveSelectedItems(
            JSON.stringify(x)
          );
        }
      }, [selectedItems]);


    const initialValues = (() => {
        const _initValues = {}
        initialSelectedItems.forEach(({ id, count }) => {
            _initValues[id] = count
        })


        return _initValues
    })()

    function validateCount(value) {

        let error;
        if (value == null || value == undefined || value == '') {
            error = 'This field is required'
        } else {

            if (value) {
                if (value.toString().match(/^-\d+$/) !== null) {
                    error = 'This field must be at least 1'
                }
            }
        }

        return error;

    }


    const formatGroupLabel = (data) => (
        <div style={
            {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }
        }>
            <span>{data.label}</span>
            <span style={
                {
                    backgroundColor: '#EBECF0',
                    borderRadius: '2em',
                    color: '#172B4D',
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 'normal',
                    lineHeight: '1',
                    minWidth: 1,
                    padding: '0.16666666666667em 0.5em',
                    textAlign: 'center',
                }
            }>{data.options.length}</span>
        </div>
    );

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


    // console.log({ options, categoryItems })

    return (

        <Formik
            initialValues={initialValues}
            initialErrors={false}
            onSubmit={(values) => { 

                setIsSaveAndFinish(true)
                // console.log({values})

                if (item) {

                    // Update the list of values
                    deletedItems.forEach(([{ id }]) => {
                        delete values[id]
                    })

                    // Filter Edited fields only
                    const valueKeys = []
                    const disjointValues = {}

                    Object.values(values).filter((v, i) => {
                        if (v !== Object.values(initialValues)[i]) valueKeys.push(Object.keys(values)[i]);
                        return v !== Object.values(initialValues)[i]
                    })[0];

                    for (let key in valueKeys) disjointValues[valueKeys[key]] = values[valueKeys[key]];

                    handleItemsUpdate([disjointValues, itemId], alert)
                        .then(({ statusText }) => {
                            defer(() => setIsSavedChanges(true))
                            let update_id
                            if (statusText == 'OK') {

                                fetch(`/api/facility/get_facility/?path=facilities&id=${itemId}`).then(async resp => {

                                    const results = await resp.json()

                                    update_id = results?.latest_update


                                    if (update_id) {

                                        try {
                                            const itemsUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                            setItemsUpdateData(itemsUpdateData)
                                        }
                                        catch (e) {
                                            console.error('Encountered error while fetching item update data', e.message)
                                        }
                                    }
                                })
                                    .catch(e => console.error('unable to fetch item update data. Error:', e.message))
                            }

                        })
                        .catch(e => console.error('unable to fetch item data. Error:', e.message))
                }

                else {
                    nextItemCategory === 'finish' ? /* Human Resource */ handleItemsSubmit([savedItems, values], itemId, alert) : console.log({ handleItemsSubmit }); /* Infrastructure */ handleItemsSubmit([savedItems, values, nextItemCategoryId, setNextItemCategory], itemId)
                        .catch(e => console.error('unable to submit item data. Error:', e.message))
                }

            }}
        >
            {({ errors }) => (

                <Form
                    name="list_item_with_count_form"
                    className="flex flex-col w-full items-start justify-start gap-3 "
               
                >

                    {/* Item List Dropdown */}
                    <div className='w-full flex flex-col p-3 bg-blue-50 shadow-md items-start justify-start gap-3 mb-3'>
                        {/* category */}

                        <label
                            htmlFor='available_items_with_count'
                            className='capitalize text-md font-semibold leading-tight tracking-tight'>
                            Category {itemsCategoryName}
                        </label>

                        <div className="flex items-start gap-2 w-full h-auto">
                   
                            <Select

                                options={categoryItems}
                                formatGroupLabel={formatGroupLabel}
                                onChange={(e) => {


                                    // Reset item category
                                    if(itemRef.current !== null){
                                        itemRef.current?.clearValue()
                                    }

                                    const _options = []
                                    let _values = []
                                    let _subCtgs = []

                                    if (options.length > 0) {
                                        options.forEach(({ category_name: ctg, category }) => {
                                            let allOccurences = options.filter(({ category_name }) => category_name === ctg)

                                            allOccurences.forEach(({ id, name }) => {
                                                _subCtgs.push(name)
                                                _values.push(id)
                                            })

                                            if (_options.map(({ name }) => name).indexOf(ctg) === -1) {

                                                _options.push({
                                                    category: ctg,
                                                    categoryId: category,
                                                    itemLabels: _subCtgs,
                                                    itemIds: _values
                                                })
                                            }

                                            _values = []
                                            _subCtgs = []

                                        })
                                    }

                                    const filters = _options.filter(({ categoryId }) => (categoryId === e.value))[0]

                                    const item_options = filters.itemLabels.map((label, i) => ({ label, value: filters.itemIds[i] }))



                                    setItemOptions(item_options)
                                }
                                }
                                name="category_items_with_count"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: 'transparent',
                                        outLine: 'none',
                                        border: 'none',
                                        outLine: 'none',
                                        textColor: 'transparent',
                                        padding: 0,
                                        height: '4px',
                                        width: '100%'
                                    }),

                                }}

                                className='flex w-full   placeholder-gray-500 border border-blue-600 outline-none'
                            />

                            <div name="hidden_btn" className="bg-transparent w-20 p-2 flex items-center justify-evenly gap-2"
                            ></div>
                        </div>


                        <label
                            htmlFor='available_items_with_count'
                            className='capitalize text-md font-semibold leading-tight tracking-tight'>
                            {itemsCategoryName}
                        </label>

                        <div className="flex items-start gap-2 w-full h-auto">

                            <Select

                                options={itemOptions}
                                ref={itemRef}
                                formatGroupLabel={formatGroupLabel}
                                onChange={(e) => {
                                    setCurrentItem({ id: e?.value, name: e?.label, count: 1 })
                                }
                                }
                                name="available_items_with_count"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: 'transparent',
                                        outLine: 'none',
                                        border: 'none',
                                        outLine: 'none',
                                        textColor: 'transparent',
                                        padding: 0,
                                        height: '4px',
                                        width: '100%'
                                    }),

                                }}
                                className='flex w-full   placeholder-gray-500 border border-blue-600 outline-none'
                            />
                            <button className="bg-blue-700  p-2 flex items-center justify-evenly gap-2"
                                onClick={e => {
                                    e.preventDefault()
                               
                                    // console.log({items})

                                    if (currentItem)
                                        setSelectedItems([
                                            currentItem,
                                            ...selectedItems,
                                        ])

                                }}>
                                <p className='text-white font-semibold'>Add</p>
                                <PlusIcon className='w-4 h-4 text-white' />
                            </button>


                        </div>
                    </div>


                    {/* Item Selected Table */}

                    <Table className="card bg-blue-50 shadow-md">
                        <TableBody>

                            <TableRow>
                                <TableCell className='bg-blue-50 text-black border-b border-blue-600'>
                                    <p className="text-md w-full flex flex-wrap font-bold justify-between items-center leading-tight tracking-tight">
                                        Assigned {itemsCategoryName}
                                    </p>{" "}
                                </TableCell>
                                <TableCell className='bg-blue-50 text-blue-700 border-b border-blue-600'>

                                </TableCell>
                                <TableCell className='bg-blue-50 text-blue-700 border-b border-blue-600'>

                                </TableCell>
                            </TableRow>
                            <TableRow className="border-b border-blue-600">
                                <TableCell>
                                    <p className='capitalize text-base font-semibold'>{itemsCategoryName}</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-base font-semibold'>Number</p>
                                </TableCell>
                                <TableCell className='text-xl font-semibold'>
                                    <p className='text-base font-semibold'>Action</p>
                                </TableCell>
                            </TableRow>

                            <>
                                {typeof items === 'object' &&
                                    items?.map(({ name, id, meta_id, count }, __id) => (
                                        <TableRow
                                            key={id}
                                        >
                                            <TableCell>{name}</TableCell>
                                            {/* {console.log({ selectedItems })} */}
                                            <TableCell>
                                                {
                                                    !(
                                                        // Exclude the Number input if   
                                                        // POWER SOURCE  
                                                        name.includes("Main Grid") ||
                                                        name.includes("Gas") ||
                                                        name.includes("Bio-Gas") ||
                                                        // WATER SOURCE
                                                        name.includes("Roof Harvested Water") ||
                                                        name.includes("River / Dam / Lake") ||
                                                        name.includes("Donkey Cart / Vendor") ||
                                                        name.includes("Piped Water") ||
                                                        // MEDICAL WASTE MANAGEMENT
                                                        name.includes("Sewer systems") ||
                                                        name.includes("Dump without burning") ||
                                                        name.includes("Open burning") ||
                                                        name.includes("Remove offsite") ||
                                                        // ACCESS ROADS
                                                        name.includes("Tarmac") ||
                                                        name.includes("Earthen Road") ||
                                                        name.includes("Graded ( Murrum )") ||
                                                        name.includes("Gravel")
                                                    ) &&
                                                    <Field
                                                        as='input'
                                                        type='number'
                                                        min={1}
                                                        name={id}
                                                        defaultValue={itemData ? count : 0}
                                                        validate={validateCount}
                                                        className="flex-none w-24 bg-transparent border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none"
                                                    />
                                                }
                                                {errors[id] && <div><span className='text-red-600 mt-1'>{errors[id]}</span></div>}
                                            </TableCell>
                                            <TableCell>

                                                <button
                                                    type="button"
                                                    disable={(items.length - 1) == __id ? false : true}

                                                    onClick={async (e) => {
                                                     if((items.length - 1) == __id) {

                                                        e.preventDefault()
                                                        let _items = items
                                                        setDeletedItems([...deletedItems, _items.splice(__id, 1)])
                                                        
                                                        setSelectedItems(_items);
                                                        saveSelectedItems(_items);
                                                        removeItemHandler(e, meta_id, alert)
                                                     }

                                                    }}
                                                    className={`flex ${(items.length - 1) == __id ? 'cursor-pointer' : 'cursor-not-allowed'}  items-center justify-center space-x-2 bg-red-400  p-1 px-2`}
                                                >
                                                    <span className="text-medium font-semibold text-white">
                                                        Remove
                                                    </span>
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                // ) : (
                                //     item !== null &&
                                //     <TableRow>
                                //         <TableCell>
                                //             <li className="w-full bg-blue-50 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                //                 <p>
                                //                     {item?.name || item?.official_name} has no listed {itemsCategoryName}. Add some below.
                                //                 </p>
                                //             </li>
                                //         </TableCell>
                                //     </TableRow>
                                //)
                                }
                            </>
                        </TableBody>
                    </Table>


                    {/* Save btn */}

                    {
                        selectedItems.length > 0 && item !== null &&

                        <div style={{ maxWidth: '88%' }} className="w-full flex justify-end h-auto mt-3">
                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save & finish</button>
                        </div>
                    }

                    {
                        item === null &&

                        <div className='flex justify-between items-center w-full mt-4'>
                            <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
                                <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
                                <span className='text-medium font-semibold text-blue-900 '>
                                    {previousItemCategory}
                                </span>
                            </button>
                            <button
                                type='submit'
                                className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                                <span className='text-medium font-semibold text-white'>
                                    {nextItemCategory}
                                </span>
                                <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                            </button>
                        </div>
                    }



                </Form>
            )}
        </Formik>


    )
}


export default EditListWithCount