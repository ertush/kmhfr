import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import Spinner from '../../Spinner';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/solid';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useRouter } from 'next/router';
import { TrashIcon } from '@heroicons/react/solid'
import { Alert } from '@mui/lab'



function EditListItem({
  itemData,
  categoryItems,
  itemId,
  itemName,
  handleItemsSubmit,
  handleItemsUpdate,
  setSubmitting,
  submitting,
  editMode,
  handleItemPrevious,
  token,
  options,
  setFormId

}) {


  const alert = useAlert()
  const router = useRouter()


  const [allServices, setallServices] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showItemCategory, setShowItemCategory] = useState(false)

  const [formError, setFormError] = useState(null)
  const [from, setFrom] = useState("submission")

  // Refs
  const [categoryOptions, setCategoryItems] = useState(() => {

    let newarray = [];
    categoryItems.forEach(element => {
      let customitem = {}
      customitem = { value: element.value, label: element.label }
      newarray.push(customitem);
    });
    return newarray;
  });

  const filterSpecialities = (ctg) => {

    const filteredOptions = options.filter((option) => option.category === ctg);
    if (itemName == "facility_services") {

      setallServices(filteredOptions)
    } else {

      const _selectedItems = categoryItems.find(({ value }) => value == ctg)
      setallServices(_selectedItems)

      setSelectedItems(prev => {
        return [...new Set([...prev, _selectedItems]).values()]
      })


    }

  }

  const handleCheckboxChange = (id, name, category, category_name) => {
    
    setFrom("submission")

    setSelectedItems((prevSelectedRows) => {
      if (prevSelectedRows?.filter((row) => row.rowid == id).length > 0) {
        return prevSelectedRows?.filter((row) => row.rowid !== id);
      } else {
        let customitem = {}
        customitem = { rowid: id, sname: name, category_id: category, category_name: category_name }
        return [...prevSelectedRows, customitem];
      }
    });
  };

  const onSearch = ((event, issearchcategory, issearchservice) => {

    const _query = event.target.value;
    let subset

    if (_query.length > 3) {

      if (issearchcategory) {


        subset = categoryItems.filter((e) => e.label.toLowerCase().includes(_query.toLowerCase()))


        setCategoryItems(subset);
      } else if (issearchservice) {
        let _specialities = allServices.filter((e) => e.name.toLowerCase().includes(_query.toLowerCase()))
        setallServices(_specialities);
      }
    }
    else {
      if (issearchservice && Array.isArray(allServices)) {
        filterSpecialities(allServices[0]?.category)
      }
      setCategoryItems(categoryItems);
    }
  });


  useEffect(() => {

    // setallServices(itemData)

    const currentUrl = new URL(window.document.location.href)

    // console.log({itemName, from: })

    const fromParam = currentUrl.searchParams.get("from")
    
    setFrom(fromParam)


    if (Array.isArray(itemData)) {
      const result = []

      setSelectedItems(() => {


        if (itemName == 'facility_services' && currentUrl.searchParams.get("from") !== "previous") {

          // console.log("setting selectedItems")
          itemData?.map((service) => {
            result.push({ sname: service.service_name , rowid: service.service_id , category_id: service.category_id , category_name: service.category_name })
          })

          return result

        }
        else {
          return itemData
        }
      })
    }

  }, [])


  function handleSearchItemFocus(e) {
    e.preventDefault()

    if (!showItemCategory) {
      setShowItemCategory(true)
    }
  }


  function handleSubmit(e) {

    e.preventDefault()

    setSubmitting(true)

    if (itemData) {

      const newSelectedItems = selectedItems.filter(({ rowId }, i) => rowId == itemData[i]?.service_id)

      // console.log({selectedItems})
      
      if (itemName == 'facility_services') {
        handleItemsUpdate(token, [newSelectedItems, itemId])
          .then(resp => {
            if (resp.status == 200 || resp.status == 204) {
              setSubmitting(false)
              alert.success('Updated facility services successfully');

              router.push({
                pathname: '/facilities/facility_changes/[facilityId]',
                query: {
                  facilityId: itemId
                }
              })
            } else {
              setSubmitting(false)
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
          .catch(e => console.error('unable to update facility services. Error:', e.message))
      } else {
        
        
        handleItemsUpdate(newSelectedItems, itemId)
          .then(resp => {
            if (resp.status == 200 || resp.status == 204 || resp.status == 201) {
              setSubmitting(false)
              alert.success('Updated Community Health Unit Services successfully', {
                timeout: 10000
              });
            } else {
              setSubmitting(false)
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
          .catch(e => console.error('unable to update CHU servics update. Error:', e.message))
      }
    }
    else {
      if (itemName == "facility_services") {
        handleItemsSubmit(token, selectedItems, itemId)
          .then((resp) => {
            if (resp.ok) {
              if (itemName == "facility_services") {
                setSubmitting(false)
                alert.success('Facility services saved successfully');

                const services = typeof selectedItems == 'string' ? JSON.parse(selectedItems).map(({ rowid }) => ({ service: rowid })) : selectedItems.map(({ rowid }) => ({ service: rowid }))
                const payload = JSON.stringify(services)

                const base64EncPayload = Buffer.from(payload).toString('base64')
                
                if(window){
                    window.localStorage.setItem('services', base64EncPayload)
                }

                router.push({
                  pathname: `${window.location.origin}/facilities/add`,
                  query: { 
                    // formData: base64EncPayload,
                    formId: 5,
                    facilityId: itemId,
                    from: 'submission'

                  }
              })
              .then((navigated) => {
                if(navigated) setFormId(5)
              })

              } else {
                setSubmitting(false)

                router.push({
                  pathname: '/community-units/[chulId]',
                  query: {
                    chuilId: itemId
                  }
                })

                alert.success('Community Health Unit services Updated successfully', {
                  containerStyle: {
                    backgroundColor: "green",
                    color: "#fff"
                  }
                })
              }
            }
            else {
              setSubmitting(false)
              alert.error('Unable to save facility services');

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
      } else {
        
        // console.log({selectedItems})

        handleItemsSubmit(selectedItems, itemId)
          .then(resp => {
            if (resp.status == 200 || resp.status == 201) {
              setSubmitting(false)
              alert.success('Community health unit services saved successfully');
              console.log('  Navigating to CHU Details page ... ')

              router.push({
                pathname: '/community-units/[chul_id]',
                query: {
                  chul_id: itemId
                }
              })

            }
            else {
              setSubmitting(false)
              alert.error('Unable to save Community Health Unit Services');

            }
          })
          .catch(console.error)
      }
    }


  }

// return (
//   <pre>
//     {
//       JSON.stringify({selectedItems , itemData}, null, 2)
//     }
//   </pre>
// )

  return (

    <form
      name="list_item_form"
      className="flex flex-col w-full items-start justify-start gap-3"
      onSubmit={handleSubmit}

    >

      {formError && <Alert severity='error' className={'w-full'}>{formError}</Alert>}

      <div className='w-full grid grid-cols-12 gap-4'>
        <div className={`${itemName == "chul_services" ? 'col-span-12' : 'col-span-5'}`} >
          <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900">{itemName == 'chul_services' ? 'Services' : 'Categories'}</h4>
          <input name="searchItem" type="text" onFocus={handleSearchItemFocus} onChange={(e) => onSearch(e, true, false)} className="col-span-12 border border-gray-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
          {!showItemCategory && <div className="text-center border-l border-gray-500 border-r border-b w-full">Search for services</div>}

          <br />
          {
            showItemCategory &&
            <ul className='max-h-96 overflow-auto border-r border-l border-b border-gray-500'>

              {
                categoryOptions.map(({ label, value }, i) => (
                  <>
                    <div key={i}
                      className='card bg-gray-50 shadow-md p-2 group hover:bg-gray-500 hover:text-gray-50 hover:cursor-pointer'

                    >
                      <li
                        className="flex items-center justify-start cursor-pointer space-x-2 p-1 px-2"
                        onClick={() => {
                          filterSpecialities(value)
                        }}
                      >{label}</li>
                      <hr className='border-xs boredr-gray-200 group-hover:border-gray-500'></hr>
                    </div>
                  </>
                ))
              }

            </ul>
          }
        </div>
        {
          itemName == "facility_services" &&
          <div className="col-span-7" >
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-600 w-full mb-4 font-semibold text-gray-900">{itemName == 'chul_services' ? 'Selected Services' : 'Services'}</h4>
            <input type="text" onChange={(e) => onSearch(e, false, true)} className="col-span-12 border border-gray-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
            <br />
            <div className='max-h-96 overflow-auto border-r border-l border-b border-gray-500'>

              <table className="table-auto w-full">
                <thead>
                  <tr>

                  </tr>
                </thead>
                <tbody className='bg-gray-50 shadow-md'>
                  {Array.isArray(allServices) && allServices.length === 0 && <tr><td colSpan={3} className="text-center">No services found</td></tr>}
                  {
                    itemName !== "chul_services" ?
                      <>
                        {allServices?.map((row, i) => (
                          <tr key={i}>
                            <td className="border px-1 py-1">
                              <label className="w-full p-2" >{row.name}</label>
                            </td>
                            <td className="border px-1 py-1">
                              <input
                                type="checkbox"
                                className="p-1 w-5 h-5"
                                checked={selectedItems?.some(item => item?.rowid?.includes(row?.id))}
                                onChange={(e) => handleCheckboxChange(
                                  row?.id,
                                  row?.name,
                                  row?.category,
                                  row?.category_name,
                                )}
                              /> Yes
                            </td>

                          </tr>
                        ))}
                      </>
                      :
                      <>
                        {allServices?.map(({ label, value }, i) => (
                          <tr key={i}>
                            <td className="border px-1 py-1">
                              <label className="w-full p-2" >{label}</label>
                            </td>
                            <td className="border px-1 py-1">

                              <input
                                type="checkbox"
                                className="p-1 w-5 h-5"
                                checked={selectedItems.some(item => item.value.includes(value))}
                                onChange={(e) => handleCheckboxChange(
                                  row.id,
                                  row.name,
                                  row.category,
                                  row.category_name,
                                )}
                              /> Yes
                            </td>

                          </tr>
                        ))}
                      </>

                  }



                </tbody>
              </table>
            </div>



          </div>
        }

        <div className="col-span-12 h-full overflow-auto" >

          <table className="table-auto w-full">
            <thead>
              <tr>

                <th className="border border-gray-300 px-1 py-1">Services</th>
                <th className="border border-gray-300 px-1 py-1">{itemName == "chul_services" ? 'Action' : 'Present'}</th>

              </tr>
            </thead>
            <tbody className='bg-gray-50 shadow-md'>


              {Array.isArray(selectedItems) && selectedItems.length === 0 && from !== "previous" && <tr><td colSpan={3} className="text-center">No services found</td></tr>}


              {
                Array.isArray(itemData) && itemData.length > 0 && from == "previous" ?
                  itemData?.map((row, i) => (
                    <tr key={i}>

                      <td className="border border-gray-300 px-1 py-1">{row.sname}</td>
                      <td className="border border-gray-300 px-1 py-1">
                        Yes
                      </td>
                    </tr>
                  ))
                  :
                  itemName == 'facility_services' ?
                  selectedItems?.map((row, i) => (
                    <tr key={i}>

                      <td className="border border-gray-300 px-1 py-1">{row.sname}</td>
                      <td className="border border-gray-300 px-1 py-1">
                        Yes
                      </td>
                    </tr>
                  ))
                  :
                  selectedItems?.map(({ label, value }) => (
                    <tr key={value}>
                      <td className="border border-gray-300 px-1 py-1">{label}</td>
                      <td className="border border-gray-300 px-1 flex place-content-center py-1">
                        <button className='bg-transparent mx-auto flex place-content-center group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent' onClick={e => {
                          e.preventDefault()
                          setSelectedItems(prev => {
                            return prev.filter(({ value: itemId }) => itemId !== value)
                          })
                        }}>
                          <TrashIcon className="w-4 h-4 text-red-500 group-hover:text-white" />

                        </button>
                      </td>
                    </tr>
                  ))
              }


            </tbody>
          </table>
        </div>
      </div>



      <div className={`flex ${!editMode ? 'justify-between' : 'justify-end'} items-center w-full mt-4`} >

        {/* Facility Service Add & Edit Submit Buttons */}
        {
          // Add
          itemName == "facility_services" && !editMode &&
          <Fragment>
            <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-gray-900  px-2'>
              <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
              <span className='text-medium font-semibold text-gray-900 '>
                Regulation
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
                    'Infrastructure'

                }
              </span>
              {
                submitting ?
                  <span className='text-white'>Saving </span>
                  :
                  <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

              }
            </button>
          </Fragment>
        }
    

        {
          // Edit
          itemName == "facility_services" && editMode &&
          <button
            type="submit"
            className="flex items-center justify-end space-x-2 bg-blue-500   p-1 px-2"
          >
            <span className="text-medium font-semibold text-white">
              {
                submitting ?
                  <Spinner />
                  :
                  'Save and Finish'

              }
            </span>
            {
              submitting &&
              <span className='text-white'>Saving </span>
            }

          </button>

        }

        {/* CHUL Services Add & Edit Submit Buttons */}
        {
          // Add 
          itemName == "chul_services" && !editMode &&
          <Fragment>
            <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-gray-900  px-2'>
              <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
              <span className='text-medium font-semibold text-gray-900 '>
                CHEWS
              </span>
            </button>

            <button
              type='submit'
              className='flex items-center justify-start space-x-2 bg-blue-500  p-1 px-2'>
              <span className='text-medium font-semibold text-white'>
                {
                  submitting ?
                    <Spinner />
                    :
                    'Finish'

                }
              </span>
              {
                submitting ?
                  <span className='text-white'>Saving </span>
                  :
                  <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

              }
            </button>
          </Fragment>
        }
        {

          // Edit
          itemName == "chul_services" && editMode &&
          <button
            type="submit"
            className="flex items-center justify-end space-x-2 bg-blue-500  p-1 px-2"
          >
            <span className="text-medium font-semibold text-white">
              {
                submitting ?
                  <Spinner />
                  :
                  'Save and Finish'

              }
            </span>
            {
              submitting &&
              <span className='text-white'>Saving </span>
            }

          </button>

        }
      </div>



    </form>

  )
}

export default EditListItem