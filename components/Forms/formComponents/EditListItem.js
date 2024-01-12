import React, { useEffect, useState } from 'react'
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
  handleItemPrevious,
  token,
  options
  
}) {


  const alert = useAlert()
  const router = useRouter()


  const [allServices, setallServices] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showItemCategory, setShowItemCategory] = useState(false)



   const [formError, setFormError] = useState(null)


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
  
    if(Array.isArray(itemData)) {
      const result = []

      setSelectedItems(() => {

      if(itemName == 'facility_services'){

        itemData?.map((service) => {
            result.push({ sname: service.service_name, rowid: service.service_id, category_id: service.category_id, category_name: service.category_name })
        })

      return result

       }
    else {
      return itemData
    }
      })
    }

  }, [])

  function handleSearchItemFocus (e) {
    e.preventDefault()

    if(!showItemCategory) {
      setShowItemCategory(true)
    }
  }

  function handleSubmit(e) {

    e.preventDefault()

    setSubmitting(true)

    if (itemData) {

      const newSelectedItems = selectedItems.filter(({rowId}, i) => rowId == itemData[i]?.service_id) 

      if(itemName == 'facility_services') {     
        handleItemsUpdate(token, [newSelectedItems, itemId])
          .then(resp => {
            if (resp.status == 200 || resp.status == 204) {
              setSubmitting(false)
              alert.success('Updated facility services successfully');

              router.push({
                pathname: '/facilities/facility_changes/[facility_id]',
                query: {
                  facility_id: itemId
                }
              })
            } else {
              setSubmitting(false)
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
          .catch(e => console.error('unable to update facility services. Error:', e.message))
      } else {
        handleItemsUpdate(newSelectedItems, itemId)
        .then(resp => {
          if (resp.status == 200 || resp.status == 204) {
            setSubmitting(false)
            alert.success('Updated Community Health Unit Services successfully');

            // router.push({
            //   pathname: '/facilities/facility_changes/[facility_id]',
            //   query: {
            //     facility_id: itemId
            //   }
            // })
          } else {
            setSubmitting(false)
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
        .catch(e => console.error('unable to update CHU servics update. Error:', e.message))
      }
    }
    else {
      if (itemName == "facility_services") {
        handleItemsSubmit(token, selectedItems, itemId)
          .then((resp) => {
            if (resp.status == 204 || resp.status == 200) {
              if(itemName == "facility_services") {
              setSubmitting(false)
              alert.success('Facility services saved successfully');

              const services = typeof selectedItems == 'string' ? JSON.parse(selectedItems).map(({ rowid }) => ({ service: rowid })) : selectedItems.map(({ rowid }) => ({ service: rowid }))
              const payload = JSON.stringify(services)

              const base64EncParams = Buffer.from(payload).toString('base64')

            //   router.push({
            //     pathname: `${window.location.origin}/facilities/add`,
            //     query: { 
            //       formData: base64EncParams,
            //       formId: 5,
            //       facility_id: itemId,
            //       from: 'submission'

            //     }
            // })

              const url = new URL(`${window.location.origin}/facilities/add?formData=${base64EncParams}`)

              url.searchParams.set('formId', '5')

              url.searchParams.set('facilityId', `${itemId}`)

              url.searchParams.set('from', 'submission')

              window.location.href = url
              
              } else {
                setSubmitting(false)

                router.push({
                  pathname:'/community-units/[chulId]',
                  query:{
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
      } else {
        handleItemsSubmit(selectedItems, itemId)
          .then(resp => {
            if (resp.status == 204 || resp.status == 200) {
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


  return (

    <form
      name="list_item_form"
      className="flex flex-col w-full items-start justify-start gap-3"
      onSubmit={handleSubmit}

    >

      {formError && <Alert severity='error' className={'w-full'}>{formError}</Alert>}
     
     <div className='w-full grid grid-cols-12 gap-4'>
        <div className={`${itemName == "chul_services" ? 'col-span-12' : 'col-span-5'}`} >
          <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">{itemName == 'chul_services' ? 'Services' : 'Categories'}</h4>
          <input name="searchItem" type="text" onFocus={handleSearchItemFocus} onChange={(e) => onSearch(e, true, false)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
          {!showItemCategory && <div className="text-center border-l border-blue-500 border-r border-b w-full">Search for services</div>}

          <br />
          {
            showItemCategory &&
          <ul className='max-h-96 overflow-auto border-r border-l border-b border-blue-500'>

            {
              categoryOptions.map(({ label, value }, i) => (
                <>
                  <div key={i}
                    className='card bg-blue-50 shadow-md p-2 group hover:bg-blue-500 hover:text-gray-50 hover:cursor-pointer'

                  >
                    <li
                      className="flex items-center justify-start cursor-pointer space-x-2 p-1 px-2"
                      onClick={() => {
                        filterSpecialities(value)
                      }}
                    >{label}</li>
                    <hr className='border-xs boredr-gray-200 group-hover:border-blue-500'></hr>
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
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">{itemName == 'chul_services' ? 'Selected Services' : 'Services'}</h4>
            <input type="text" onChange={(e) => onSearch(e, false, true)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
            <br />
            <div className='max-h-96 overflow-auto border-r border-l border-b border-blue-500'>

              <table className="table-auto w-full">
                <thead>
                  <tr>

                  </tr>
                </thead>
                <tbody className='bg-blue-50 shadow-md'>
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
            <tbody className='bg-blue-50 shadow-md'>
              
          
              {Array.isArray(selectedItems) && selectedItems.length === 0 && <tr><td colSpan={3} className="text-center">No services found</td></tr>}
              
              
              {
                itemName == "facility_services" ?  
                selectedItems?.map((row, i) => (
                    <tr key={i}>
                      
                      <td className="border border-gray-300 px-1 py-1">{row.sname}</td>
                      <td className="border border-gray-300 px-1 py-1">
                        Yes
                      </td>
                    </tr>
                  ))
                 :
                  selectedItems?.map(({ label, value}) => (
                    <tr key={value}>
                      <td className="border border-gray-300 px-1 py-1">{label}</td>
                      <td className="border border-gray-300 px-1 flex place-content-center py-1">
                      <button className='bg-transparent mx-auto flex place-content-center group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent' onClick={e => { 
                        e.preventDefault()
                        setSelectedItems(prev => {
                            return prev.filter(({value: itemId}) => itemId !== value)
                        })}}>
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

      {/* Save btn */}

      {
        Array.isArray(itemData)  &&

        <div className=" w-full flex justify-end h-auto mr-3">
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

        <div className={`flex ${itemName == "facility_services" ? 'justify-between' : 'justify-end'} items-center w-full mt-4`} >
          {
            itemName == "facility_services" && 
          <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
            <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
            <span className='text-medium font-semibold text-blue-900 '>
              Regulation
            </span>
          </button>

          }
          {
            itemName == "facility_services" && 
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
          }

          {
            itemName == "chul_services" &&

            <button
            type="submit"
            className="flex items-center justify-end space-x-2 bg-blue-600  p-1 px-2"
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
      }


    </form>

  )
}

export default EditListItem