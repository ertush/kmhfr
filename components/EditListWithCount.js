import React, { useState} from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { defer } from 'underscore';
import {Formik, Form, Field} from 'formik'
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
    PlusIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert'

function EditListWithCount(
    { 
        initialSelectedItems, 
        itemsCategory, 
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
        previousItemCategory
    }
) {

 
  
  const alert = useAlert()


  const itemOptions = ((options) => {
    return options.map(({ name, subCategories, value }) => ({
      label: name,
      options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
    }))
  })(itemsCategory)


  const [currentItem, setCurrentItem] = useState(null)
  const [deletedItems, setDeletedItems] = useState([])
 

  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
  const result = []

    initialSelectedItems.map(({ subCategories, id, meta_id, count }) => {
      result.push({ name: subCategories[0], id, meta_id, count})

    })

    return result

  })() : []))

  const initialValues = (() => {
    const _initValues = {}
    initialSelectedItems.forEach(({id, count}) => {
        _initValues[id] = count
    })


    return _initValues
})()



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

    return (
       
        <Formik
            initialValues={initialValues}

            onSubmit={values => {

                if(item){

                // Update the list of values
                deletedItems.forEach(([{id}]) => {
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
                .then(({statusText}) => {
                    defer(() => setIsSavedChanges(true))
                     let update_id
                     if(statusText == 'OK'){

                             fetch(`/api/facility/get_facility/?path=facilities&id=${itemId}`).then(async resp => {

                                 const results = await resp.json()
                                 
                                 update_id = results?.latest_update
                                
                           
                                 if(update_id){
                                    
                                     try{
                                        const itemsUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                                         setItemsUpdateData(itemsUpdateData)                                                     
                                     }
                                     catch(e){
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

                    nextItemCategory === 'finish' ? handleItemsSubmit([values, setNextItemCategory], itemId, alert) :  handleItemsSubmit([values, setNextItemCategory, setSelectedItems], itemId)
                    .catch(e => console.error('unable to submit item data. Error:', e.message))
                }
                
            }} 
            >

            <Form
                name="list_item_with_count_form"
                className="flex flex-col w-full items-start justify-start gap-3 md:mx-3"

            >
                {/* Item List Dropdown */}
                <div className='w-full flex flex-col items-start justify-start gap-3 mb-3'>
                    <label
                        htmlFor='available_items'
                        className='capitalize text-md  leading-tight tracking-tight'>
                        Available {itemsCategoryName}
                    </label>

                    <div style={{maxWidth:'78%'}} className="flex items-start gap-2 w-full h-auto">
                     
                        <Select
                            
                            options={itemOptions}
                            formatGroupLabel={formatGroupLabel}
                            onChange={(e) => { 
                                setCurrentItem({ id: e?.value, name: e?.label, count: 1})
                             }
                            }
                            name="available_items"
                            className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none"
                        />
                        <button className="bg-green-700 rounded p-2 flex items-center justify-evenly gap-2"
                            onClick={e => {
                                e.preventDefault()

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
                <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                    Assigned {itemsCategoryName}
                </span>{" "}
                <Table className="md:px-4">
                    <TableBody>
                        <TableRow>
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
                            {selectedItems && selectedItems?.length > 0 ? (
                                selectedItems?.map(({ name, id, meta_id}, __id) => (
                                    <TableRow
                                        key={id}

                                    >
                                        <TableCell>{name}</TableCell>
                                        <TableCell>
                                          
                                            <Field
                                            as='input'
                                            type='number'
                                            name={id}
                                            className="flex-none w-24 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            />

                                        </TableCell>
                                        <TableCell>
                                          
                                            <button
                                                type="button"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    let _items = selectedItems
                                                    setDeletedItems([...deletedItems, _items.splice(__id, 1)])
                                                    setSelectedItems(
                                                        _items
                                                    );

                                                  
                                                    
                                                    removeItemHandler(e, meta_id, alert)

                                                }}
                                                className="flex items-center justify-center space-x-2 bg-red-400 rounded p-1 px-2"
                                            >
                                                <span className="text-medium font-semibold text-white">
                                                    Remove
                                                </span>
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                item !== null &&
                                <TableRow>
                                    <TableCell>
                                    <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                        <p>
                                            {item?.name || item?.official_name} has no listed {itemsCategoryName}. Add some below.
                                        </p>
                                    </li>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    </TableBody>
                </Table>
                
                {/* Hidden submit button */}
                {/* Save btn */}

                { 
                    selectedItems.length > 0 && item !== null &&

                   <div style={{maxWidth:'88%' }} className="w-full flex justify-end h-auto mt-3">
                       <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                   </div>
                }

                {
                    item === null &&

                    <div className='flex justify-between items-center w-full mt-4' style={{maxWidth:'90%'}}>
                        <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'>
                            <ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
                            <span className='text-medium font-semibold text-black '>{previousItemCategory}</span>
                        </button>
                        <button type="submit" className='flex items-center justify-start space-x-2 bg-indigo-500 rounded p-1 px-2'>
                            <span className='text-medium font-semibold text-white'>{nextItemCategory}</span>
                            <ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
                        </button>
                    </div>
                }

             

            </Form>
        </Formik>
        
     )
}


export default EditListWithCount