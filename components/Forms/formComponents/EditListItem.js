import React, { useEffect, useState, useRef} from 'react'
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
import dynamic from 'next/dynamic';
import 'react-dual-listbox/lib/react-dual-listbox.css';

const DualListBox = dynamic(
  () => import("react-dual-listbox"), // replace '@components/map' with your component's location
  {
    loading: () => (
      <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
        Loading&hellip;
      </div>
    ),
    ssr: false, // This line is important. It's what prevents server-side render
  } 
);


function  EditListItem({
  initialSelectedItems,
  // setItems,
  categoryItems,
  itemsCategoryName,
  //   setUpdatedItem,
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
  token,
  options,
  setItemsUpdateData,
  setIsSaveAndFinish,
  servicesData
}) {
  
  const [selected_services, setSelectedServices] = useState([])
  // const current_services = useRef(new Array())
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
//   const [isRemoveItem, setIsRemoveItem] = useState(false)
  const [itemOptions, setItemOptions] = useState([])
  const [deletedItems, setDeletedItems] = useState([])
  const [allServices, setallServices] = useState([])
  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
  const result = []

  initialSelectedItems.map((service) => {

    result.push({ sname: service.service_name, rowid: service.service_id, category_id:service.category_id,category_name:service.category_name })

  })
    return result

  })() : []))
  console.log({categoryItems, options})

  const editService = servicesData?.map(({service_name:name,  service_id, id}) => ({id, service_id, name}));

  const [savedItems, saveSelectedItems] = useLocalStorageState({
    key: servicesData ? 'services_edit_form' : 'services_form',
    value:  servicesData ? editService : []
  }).actions.use();

  const items =  typeof savedItems === 'string' && savedItems.length > 0 ? JSON.parse(savedItems) : savedItems;

  // Refs

  const itemRef = useRef(null);

  const [categoryOptions, setCategoryItems] = useState(()=> {

    let newarray=[];
    categoryItems.forEach(element => {
        let customitem ={}
        customitem={value:element.value, label:element.label}
        newarray.push(customitem);
    });
    return newarray;
  });

  const filterSpecialities = (ctg) => {
    const filteredOptions = options.filter((option) => option.category === ctg );
    setallServices(filteredOptions)
}

  const handleCheckboxChange = (id, name,category, category_name) => {
      setSelectedItems((prevSelectedRows) => { 
      if (prevSelectedRows.filter((row) => row.rowid == id).length>0) {
        return prevSelectedRows.filter((row) => row.rowid !== id);
      } else {
        let customitem = {}
        customitem={rowid:id, sname:name, category_id:category,category_name:category_name}
        return [...prevSelectedRows, customitem];
      }
      });  
  };

  const onSearch = ((event, issearchcategory,issearchservice)=>{

    const _query=event.target.value;
    if(_query.length > 3){
        if(issearchcategory){
            let subset = categoryItems.filter((e)=>e.label.toLowerCase().includes(_query.toLowerCase()))
            setCategoryItems(subset);
        }else if(issearchservice ){
            let _specialities = allServices.filter((e)=>e.name.toLowerCase().includes(_query.toLowerCase()))
            setallServices(_specialities);
        }
    }
    else{
        if(issearchservice){
            filterSpecialities(allServices[0].category)
        }
        setCategoryItems(categoryItems);
    }
}); 
  

  useEffect(() => {
    //store service when service is added
    if(selectedItems.length !== 0){
      let x = selectedItems;

    //   if(editService && editService.length > 1) {
    //     if(editService[0]?.id === items[0]?.id) x = [...x,...editService]
    //   }

      // setSelectedItems(x)

      saveSelectedItems(
        JSON.stringify(x)
      );

      return () => {
        localStorage.setItem('services_edit_form', '[]')
      }
    }
  }, [selectedItems])


  return (
    <Formik
      initialValues={{}}
      initialErrors={false}
      onSubmit={(values) => {

        // setIsSaveAndFinish(true)

        if (item) {

          // console.log({savedItems, values})

          handleItemsUpdate(token, [savedItems, itemId])
            .then(resp => {
              defer(() => setIsSaveAndFinish(true));
              let update_id
              if (resp.ok) {

                alert.success('Updated Facility services successfully')

                fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${itemId}/`,
                  {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8'
                       }
                 }
                  ).then(async resp => {

                  const results = await resp.json()

                  update_id = results?.latest_update

                  if (update_id) {

                    try {
                      const _facilityUpdateData = await (await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${update_id}/`,
                        {
                          headers: {
                              'Authorization': 'Bearer ' + token,
                              'Accept': 'application/json, text/plain, */*',
                              'Content-Type': 'application/json;charset=utf-8'
                             }
                       }
                        )).json()
                      setItemsUpdateData(_facilityUpdateData)
                    }
                    catch (e) {
                      console.error('Encountered error while fetching facility update data', e.message)
                    }
                  }
                })
                  .catch(e => console.error('unable to fetch facility update data. Error:', e.message))
              }
              else {
                alert.error('Unable to update facility services');

              }

            })
            .catch(e => console.error('unable to update facility data. Error:', e.message))
        }

        else {

          handleItemsSubmit(token, [savedItems, nextItemCategoryId, setNextItemCategory], itemId)
             .then((resp) => {
              if(resp.ok){
                alert.success('Facility services saved successfully');
              }
              else {
                alert.error('Unable to save facility services');

              }
             })
            .catch(e => console.error('unable to submit item data. Error:', e.message))
        }

      }
      } 
    >
      <Form
        name="list_item_form"
        className="flex flex-col w-full items-start justify-start gap-3"

      >
        
        <div className='w-full grid grid-cols-12 gap-4'>
              <div className="col-span-5" >
                <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Categories</h4>
                <input type="text" onChange={(e)=>onSearch(e,true,false)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                <br/>
                <ul className='max-h-96 overflow-auto'>
                    {categoryOptions.map(({label, value}) => (
                        <>

                            <div key={value} 
                            className={`card bg-blue-50 shadow-md p-2 hover:bg-blue-500`}

                            >
                                <li 
                                className="flex items-center justify-start space-x-2 p-1 px-2"
                                onClick={()=>{
                                    filterSpecialities(value)
                                }} 
                                    key ={value}>{label}</li>
                                <hr></hr>
                            </div>
                        </>
                    ))}
                </ul>
              </div>
              <div className="col-span-7" >
                    <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Services</h4>
                    <input type="text" onChange={(e)=>onSearch(e,false,true)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                    <br/>
                    <div className='max-h-96 overflow-auto'>

                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                            
                                </tr>
                            </thead>
                            <tbody className='bg-blue-50 shadow-md'>
                                {allServices.length === 0 && <tr><td colSpan={3} className="text-center">No services found</td></tr>}
                                
                                {allServices.map((row) => (
                                    
                                <tr key={row.id}> 
                                    <td className="border px-1 py-1">
                                    <label  className="w-full p-2" >{row.name}</label>
                                    </td>
                                    <td className="border px-1 py-1">
                                    <input
                                        type="checkbox"
                                        className="p-1 w-5 h-5"
                                        checked={selectedItems.some(item=>item.rowid.includes(row.id))}
                                        onChange={(e) => handleCheckboxChange(
                                            row.id,
                                            row.name,
                                            row.category, 
                                            row.category_name,
                                        )}
                                    /> Yes
                                    </td>
                                    {/* <td className="border px-1 py-1">
                                    <Field
                                        as="input"
                                        type="number"
                                        className="p-1" 
                                        min={0}
                                        name={row.id}
                                        // defaultValue={selectedRows.filter(k=>k.rowid==row.id).length>0?Number(selectedRows.filter(k=>k.rowid==row.id)[0].count):0}
                                        // onChange={(e) => handleInputChange(row.id, e.target.value)}
                                        onChange ={(e)=>{
                                            handleChange(e)
                                            let cid=row.id
                                            handleInputChange(cid, e.target.value)
                                        
                                        }}
                                        hidden={!selectedRows.some(item=>item["count"])}
                                        disabled={!selectedRows.some(item=>item.rowid.includes(row.id))}  
                                    />
                                    </td> */}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    

              </div>

              <div className="col-span-12 max-h-96 overflow-auto" >

                <table className="table-auto w-full">
                            <thead>
                                <tr>
                                
                                    <th className="border px-1 py-1" key={'services'}>Services</th>
                                    <th className="border px-1 py-1" key={'services'}>Present</th>
                              
                                </tr>
                            </thead>
                            <tbody className='bg-blue-50 shadow-md'>
                                {selectedItems.length === 0 && <tr><td colSpan={3} className="text-center">No services found</td></tr>}
                                {selectedItems.map((row) => (
                                  <tr>
                                      <td className="border px-1 py-1">{row.sname}</td>
                                      <td className="border px-1 py-1">Yes</td>
                                  </tr>
                                ))}

                            </tbody>
                </table>
              </div>
        </div>

        {/* Save btn */}

        {
          savedItems.length > 0 && item !== null &&

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

        {/* Item List Dropdown */}
        {/* <div className='w-full flex flex-col items-start bg-blue-50 shadow-md p-4 justify-start gap-1 mb-3'>
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

                // Reset Ref
                if(itemRef.current !== null){
                    itemRef.current?.clearValue()
                }


                const _options = []
                let _values = []
                let _subCtgs = []

                if (options.length > 0) {
                	options.forEach(({ category_name: ctg, category }) => {

                		let allOccurences = options.filter(({ category_name }) => category_name === ctg)

                		allOccurences.forEach(({ id, name }) => { // id
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
          
          <label
            htmlFor='item_drop_down_edit_list'
            className='capitalize mt-4 text-md font-semibold leading-tight tracking-tight'>
             {itemsCategoryName}
          </label>
          <div className="flex items-start gap-2  w-full h-auto">
            {/* {console.log({itemOptions})} */}
            {/* <Select
              options={itemsCategoryName !== 'CHU Services' ? itemOptions : null}
              formatGroupLabel={formatGroupLabel}
              ref={itemRef}
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
             
            /> */}

            {/* <DualListBox
              canFilter
              options={categoryItems}
              selected={selected_services}
              
              onChange={(selected) => {
                // handleSelectChangeChu(selected)
                setSelectedServices(selected)
                // current_services.current.push(selected)
                console.log('selected', selected)
              }}
            /> */}

            {/* Add Item Button */}
            {/* <button name="add_item_btn" className="bg-blue-700  p-2 flex items-center justify-evenly gap-2"
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
            </button>   */}
            {/* </div>  
        </div> */}


        {/* Item Selected Table */}
       
        {/* <Table className="card bg-blue-50 border-b shadow-md" >
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
              {console.log({items})}
              {
                typeof items === 'object' && 
                items.map(({ name, id }, __id) => (
                  <TableRow
                    key={__id}
                    className='border-t border-blue-600'
                  >
                    {
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
                  }
                    <TableCell className='px-3'>{name}</TableCell>

                    <TableCell>
                      <button
                        type="button"
                        name="remove_item_btn"
                        disabled={(items.length - 1) == __id ? false : true }
                        onClick={async (e) => {
                        
                          if((items.length - 1) == __id) {
                          e.preventDefault()
                          let _items = items 

                        

                          setDeletedItems([...deletedItems, _items.splice(__id, 1)])
                        
                          setSelectedItems(_items);
                        //   saveSelectedItems(_items);


                          // Delete facility service
                          removeItemHandler(token, e, id)
                          .then(resp => {
                            if(resp.ok){
                                alert.success('Deleted service successfully ');
                            } else {
                                alert.error('Unable to delete service')
                            }
                          })
                          }

                        }}
                        className= {`flex ${(items.length - 1) == __id ? 'cursor-pointer' : 'cursor-not-allowed'}  items-center justify-center space-x-2 bg-red-400  p-1 px-2`}
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
        </Table> */}

      </Form>
    </Formik>
  )
}

export default EditListItem