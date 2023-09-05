import React, { useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { useAlert } from 'react-alert'
import { Formik, Form } from 'formik'
import { defer } from 'underscore';
import { useLocalStorageState } from '../hooks/formHook';

import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  PlusIcon
} from '@heroicons/react/solid';



function  EditListItem({
  initialSelectedItems,
  setItems,
  categoryItems,
  itemsCategoryName,
  setUpdatedItem,
  itemId,
  nextItemCategoryId,
  item,
  removeItemHandler,
  handleItemsSubmit,
  handleItemsUpdate,
  setNextItemCategory,
  handleItemPrevious,
  nextItemCategory,
  previousItemCategory,
  options,
  setIsSavedChanges,
  setItemsUpdateData,
  setIsSaveAndFinish,
}) {

  const alert = useAlert()

  


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
          padding: '0.167em 0.5em',
          textAlign: 'center',
        }
      }>{data.options.length}</span>
    </div>
  );


  const [currentItem, setCurrentItem] = useState(null)
  const [isRemoveItem, setIsRemoveItem] = useState(false)
  const [itemOptions, setItemOptions] = useState([])
  const [deletedItems, setDeletedItems] = useState([])
  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
  const result = []

  initialSelectedItems.map(({ subCategories, value, facility_service_id: item_id }) => {

    result.push({ name: subCategories[0], id: value[0], item_id })

  })
    return result

  })() : []))

  const [savedItems, saveSelectedItems] = useLocalStorageState({
    key: 'services_form',
    value: []
  }).actions.use();

 
  const items = typeof savedItems === 'string' && savedItems.length > 0 ? JSON.parse(savedItems) : savedItems;

// Effects

  useEffect(() => {
    setUpdatedItem(selectedItems)
  }, [selectedItems, isRemoveItem])


  useEffect(() => {
    //store service when service is added
    if(selectedItems.length !== 0){
      saveSelectedItems(
        JSON.stringify(selectedItems)
      );
    }
  }, [selectedItems])


  return (
    <Formik
      initialValues={{}}
      initialErrors={false}
      onSubmit={(values) => {

        setIsSaveAndFinish(true)

        if (item) {
          handleItemsUpdate([selectedItems, itemId], alert)
            .then(({ statusText }) => {
              defer(() => setIsSavedChanges(true))
              let update_id
              if (statusText == 'OK') {

                fetch(`/api/facility/get_facility/?path=facilities&id=${itemId}`).then(async resp => {

                  const results = await resp.json()

                  update_id = results?.latest_update

                  if (update_id) {

                    try {
                      const _facilityUpdateData = await (await fetch(`/api/facility/get_facility/?path=facility_updates&id=${update_id}`)).json()
                      setItemsUpdateData(_facilityUpdateData)
                    }
                    catch (e) {
                      console.error('Encountered error while fetching facility update data', e.message)
                    }
                  }
                })
                  .catch(e => console.error('unable to fetch facility update data. Error:', e.message))
              }

            })
            .catch(e => console.error('unable to update facility data. Error:', e.message))
        }

        else {

          handleItemsSubmit([savedItems, nextItemCategoryId, setNextItemCategory], itemId)
            .catch(e => console.error('unable to submit item data. Error:', e.message))
        }

      }
      } 
    >
      <Form
        name="list_item_form"
        className="flex flex-col w-full items-start justify-start gap-3"

      >
        {/* Item List Dropdown */}
        <div className='w-full flex flex-col items-start bg-blue-50 shadow-md p-4 justify-start gap-1 mb-3'>
          {/* Iten Category Dropdown */}
          {
          itemsCategoryName !== 'CHU Services' &&
          <>
          <label
            htmlFor='category_item_drop_down_edit_list'
            className='capitalize text-md font-semibold leading-tight tracking-tight'>
            Category {itemsCategoryName}
          </label>
          <div className="flex items-start gap-y-2 w-full h-auto">
            <Select
              options={categoryItems}
              formatGroupLabel={formatGroupLabel}
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
                  width:'100%'
                }),

              }}
              className='flex w-full placeholder-gray-500 border border-blue-600 outline-none'
              onChange={(e) => {

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
               
                  const filters =_options.filter(({categoryId}) => (categoryId === e.value))[0]
                 
                  const item_options = filters.itemLabels.map((label, i) => ({label, value: filters.itemIds[i]}))
                
             

                setItemOptions(item_options)
        
              }}
              name="category_item_drop_down_edit_list"
             
            />

            <div name="hidden_btn" className="bg-transparent w-20 p-2 flex items-center justify-evenly gap-2"
             ></div>
             
          </div>
          </>
          }
          
          {/* Item Dropdown */}
          <label
            htmlFor='item_drop_down_edit_list'
            className='capitalize mt-4 text-md font-semibold leading-tight tracking-tight'>
             {itemsCategoryName}
          </label>
          <div className="flex items-start gap-2  w-full h-auto">
            {/* {console.log({itemOptions})} */}
            <Select
              options={itemsCategoryName !== 'CHU Services' ? itemOptions : null}
              formatGroupLabel={formatGroupLabel}
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
                  width:'100%'
                }),

              }}
              className='flex w-full placeholder-gray-500 border border-blue-600 outline-none'
              onChange={(e) => {
                setCurrentItem({ id: e?.value, name: e?.label })
              }
              }
              name="item_drop_down_edit_list"
             
            />

            {/* Add Item Button */}
            <button name="add_item_btn" className="bg-blue-700  p-2 flex items-center justify-evenly gap-2"
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
       
        <Table className="card bg-blue-50 border-b shadow-md" >
          <TableBody >
            <TableRow >
              <TableCell className='bg-transparent text-blue-700 border-b border-blue-600'>
              <span className="text-md w-full flex flex-wrap  font-bold justify-between items-center leading-tight tracking-tight">
              Assigned {itemsCategoryName}
            </span>{" "}
              </TableCell>
              <TableCell className='bg-transparent text-blue-700 border-b border-blue-600'>

              </TableCell>
            
            </TableRow>
            <TableRow>
              <TableCell>
                <p className='text-base font-semibold'>{itemsCategoryName}</p>
              </TableCell>
              <TableCell className='text-xl font-semibold'>
                <p className='text-base font-semibold'>Action</p>
              </TableCell>
            </TableRow>

            <>
              {/* {console.log({items})} */}
              {
                typeof items === 'object' && 
                items.map(({ name, id, item_id }, __id) => (
                  <TableRow
                    key={id}
                    className='border-t border-blue-600'
                  >
                    {/* {
                  items !== null &&
                  <>
                    <li className="w-full m-3 bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                      <p>
                        {item?.name || item?.official_name} has not listed
                        the {'item'} it offers. Add some below.
                      </p>
                    </li>
                    <br />
                  </>
                  } */}
                    <TableCell className='px-3'>{name}</TableCell>

                    <TableCell>
                      <button
                        type="button"
                        name="remove_item_btn"
                        onClick={async (e) => {
                          e.preventDefault()
                          let _items = items 
                          setDeletedItems([...deletedItems, _items.splice(__id, 1)])
                        
                          setSelectedItems(_items);
                          saveSelectedItems(_items);


                          // Delete facility service
                          removeItemHandler(e, item_id, alert)

                        }}
                        className="flex items-center justify-center space-x-2 bg-red-400  p-1 px-2"
                      >
                        <span className="text-medium font-semibold text-white">
                          Remove
                        </span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
             }
            </>
          </TableBody>
        </Table>

        {/* Save btn */}

        {
          selectedItems.length > 0 && item !== null &&

          <div className=" w-full flex justify-end h-auto mr-3">
            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save & finish</button>
          </div>
        }

        {
          item === null &&

          <div className='flex justify-between items-center w-full mt-4' >
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
    </Formik>
  )
}

export default EditListItem