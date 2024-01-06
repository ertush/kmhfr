import React, { useEffect, useState, useRef} from 'react'
import { useAlert } from 'react-alert'
import Spinner from '../../Spinner';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  // PlusIcon
} from '@heroicons/react/solid';
import dynamic from 'next/dynamic';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useRouter } from 'next/router';




function  EditListItem({
  initialSelectedItems,
  categoryItems,
  itemId,
  item,
  handleItemsSubmit,
  handleItemsUpdate,
  setSubmitting,
  submitting,
  handleItemPrevious,
  token,
  options,
 
  servicesData
}) {

  const alert = useAlert()
  const router = useRouter()



 
  const [allServices, setallServices] = useState([])
  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
  const result = []

  initialSelectedItems.map((service) => {

    result.push({ sname: service.service_name, rowid: service.service_id, category_id:service.category_id,category_name:service.category_name })

  })
    return result

  })() : []))


  const editService = servicesData?.map(({service_name:name,  service_id, id}) => ({id, service_id, name}));

  const [savedItems, saveSelectedItems] = useState(servicesData ? editService : [])

  
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
            let subset = categoryItems.filter((e)=>e?.label?.toLowerCase()?.includes(_query?.toLowerCase()))
            setCategoryItems(subset);
        }else if(issearchservice ){
            let _specialities = allServices.filter((e)=>e.name.toLowerCase().includes(_query.toLowerCase()))
            setallServices(_specialities);
        }
    }
    else{
        if(issearchservice && Array.isArray(allServices)){
            filterSpecialities(allServices[0]?.category)
        }
        setCategoryItems(categoryItems);
    }
}); 
  

  useEffect(() => {
    //store service when service is added
    if(selectedItems.length !== 0){
      let x = selectedItems;


      saveSelectedItems(
        JSON.stringify(x)
      );

      return () => {
        localStorage.setItem('services_edit_form', '[]')
      }
    }
  }, [selectedItems])

  function handleSubmit(e) {
  
      e.preventDefault()

      setSubmitting(true)



      
    if(item) {
 
        handleItemsUpdate(token, [selectedItems, itemId])
          .then(resp => {
                  if(resp.status == 200 || resp.status == 204) {
                    setSubmitting(false)
                    alert.success('Updated facility services successfully');

                    router.push({
                      pathname: '/facilities/facility_changes/[facility_id]',
                      query:{
                          facility_id: itemId
                      }
                  })
                  }              
              })
              .catch(e => console.error('unable to fetch facility update data. Error:', e.message))
        }     
       else
        {
          
        handleItemsSubmit(token, selectedItems, itemId)
           .then((resp) => {
            if(resp.status == 204 || resp.status == 200){
              setSubmitting(false)
              alert.success('Facility services saved successfully');

              const services = typeof selectedItems == 'string' ? JSON.parse(selectedItems).map(({ rowid }) => ({ service: rowid })) : selectedItems.map(({ rowid }) => ({ service: rowid }))
              const payload = JSON.stringify(services)

              const base64EncParams = Buffer.from(payload).toString('base64')
      
              const url = new URL(`${window.location.origin}/facilities/add?formData=${base64EncParams}`)
              
              url.searchParams.set('formId', '5')
      
              url.searchParams.set('facilityId', `${itemId}`)

              url.searchParams.set('from', 'submission')
              
              window.location.href = url
            }
            else {
              setSubmitting(false)
              alert.error('Unable to save facility services');              

            }
           })
          .catch(e => console.error('unable to submit item data. Error:', e.message))
      }

    
  }


  return (
  
      <form
        name="list_item_form"
        className="flex flex-col w-full items-start justify-start gap-3"
        onSubmit={handleSubmit}

      >
        
        <div className='w-full grid grid-cols-12 gap-4'>
              <div className="col-span-5 " >
                <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Categories</h4>
                <input type="text" onChange={(e)=>onSearch(e,true,false)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                <br/>
                <ul className='max-h-96 overflow-auto border-r border-l border-b border-blue-500'>
                    {categoryOptions.map(({label, value}) => (
                        <>

                            <div key={value} 
                            className='card bg-blue-50 shadow-md p-2 group hover:bg-blue-500 hover:text-gray-50 hover:cursor-pointer'

                            >
                                <li 
                                className="flex items-center justify-start cursor-pointer space-x-2 p-1 px-2"
                                onClick={()=>{
                                    filterSpecialities(value)
                                }} 
                                    key ={value}>{label}</li>
                                <hr className='border-xs boredr-gray-200 group-hover:border-blue-500'></hr>
                            </div>
                        </>
                    ))}
                </ul>
              </div>
              <div className="col-span-7" >
                    <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Services</h4>
                    <input type="text" onChange={(e)=>onSearch(e,false,true)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none w-full" placeholder="Search" />
                    <br/>
                    <div className='max-h-96 overflow-auto border-r border-l border-b border-blue-500'>

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
                                 
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    

              </div>

              <div className="col-span-12 h-full overflow-auto" >

                <table className="table-auto w-full">
                            <thead>
                                <tr>
                                
                                    <th className="border border-gray-300 px-1 py-1" key={'services'}>Services</th>
                                    <th className="border border-gray-300 px-1 py-1" key={'services'}>Present</th>
                              
                                </tr>
                            </thead>
                            <tbody className='bg-blue-50 shadow-md'>
                                {selectedItems.length === 0 && <tr><td colSpan={3} className="text-center">No services found</td></tr>}
                                {selectedItems.map((row) => (
                                  <tr>
                                      <td className="border border-gray-300 px-1 py-1">{row.sname}</td>
                                      <td className="border border-gray-300 px-1 py-1">Yes</td>
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
          item === null &&

          <div className='flex justify-between items-center w-full mt-4' >
              <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
                <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
                <span className='text-medium font-semibold text-blue-900 '>
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
           
          </div>
        }

       
      </form>
   
  )
}

export default EditListItem