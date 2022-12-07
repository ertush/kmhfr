import React, { useState} from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { PlusIcon } from '@heroicons/react/solid';
import { defer } from 'underscore';
import {Formik, Form, Field} from 'formik'

import { useAlert } from 'react-alert'

function EditListWithCount({ 
    initialSelectedItems, 
    itemsCategory, 
    itemsCategoryName, 
    itemId, 
    item, 
    handleItemsUpdate, 
    removeItemHandler, 
    setIsSavedChanges, 
    setItemsUpdateData}) {
  
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

    initialSelectedItems.map(({ subCategories, value, _id, count }) => {
      result.push({ name: subCategories[0], id: value[0], _id, count})

    })

    return result

  })() : []))



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
            initialValues={(() => {
                const _initValues = {}
                initialSelectedItems.forEach(({_id, count}) => {
                    _initValues[_id] = count
                })


                return _initValues
            })()}

            onSubmit={values => {

                // Update the list of values
                deletedItems.forEach(([{_id}]) => {
                    console.log({_id})
                    delete values[_id]
                })

                handleItemsUpdate([values, itemId], alert)
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
                                         console.error('Encountered error while fetching facility update data', e.message)
                                     }
                                 }
                             })
                             .catch(e => console.error('unable to fetch facility update data. Error:', e.message))                                
                         }
                       
                     })
                     .catch(e => console.error('unable to fetch facility data. Error:', e.message))
                
            }} 
            >

            <Form
                name="list_item_with_count_form"
                className="flex flex-col w-full items-start justify-start gap-3 md:mx-3"

            >
                {/* Item List Dropdown */}
                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                    <label
                        htmlFor='available_items'
                        className='capitalize text-md  leading-tight tracking-tight'>
                        Available {itemsCategoryName}
                    </label>

                    <div style={{maxWidth:'75%'}} className="flex items-start gap-2 w-full h-auto">

                        <Select
                            
                            options={itemOptions}
                            formatGroupLabel={formatGroupLabel}
                            onChange={(e) => { 
                                setCurrentItem({ id: e?.value, name: e?.label, count: 1 })
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
                                selectedItems?.map(({ name, _id, id}, __id) => (
                                    <TableRow
                                        key={_id ?? id}

                                    >
                                        <TableCell>{name}</TableCell>
                                        <TableCell>
                                            { 
                                            _id ?
                                            // Edit Count
                                            <Field
                                            type='number'
                                            name={_id}
                                            className="flex-none w-24 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            />
                                            :
                                            // Add Count
                                            <Field
                                            type='number'
                                            name={id}
                                         
                                            className="flex-none w-24 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            />

                                            }
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    let items = selectedItems
                                                    setDeletedItems([...deletedItems, items.splice(__id, 1)])
                                                    setSelectedItems(
                                                        items
                                                    );

                                                    // Delete facility service
                                                    removeItemHandler(e, id ?? _id, alert)

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

                <div style={{maxWidth:'85%' }} className="w-full flex justify-end h-auto mt-3">
                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save & finish</button>
                </div>

            </Form>
        </Formik>
        
     )
}

export default EditListWithCount