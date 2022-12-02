import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { PlusIcon } from '@heroicons/react/solid';




function EditListItem({ initialSelectedItems, itemsCategory, setUpdatedItem, item }) {

  const itemOptions = ((options) => {
    return options.map(({ name, subCategories, value }) => ({
      label: name,
      options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
    }))
  })(itemsCategory)


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


  const [currentItem, setCurrentItem] = useState(null)
  const [isRemoveItem, setIsRemoveItem] = useState(false)
  const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
    const result = []

    initialSelectedItems.map(({ subCategories, value }, i) => {

      result.push({ name: subCategories[0], id: value[0] })

    })



    return result

  })() : []))


  useEffect(() => {
    setUpdatedItem(selectedItems)
  }, [selectedItems, isRemoveItem])


  return (
    <form
      name="list_item_form"
      className="flex flex-col w-full items-start justify-start gap-3"
      onSubmit={ev => ev.preventDefault()}
    >
      {/* Transfer list Container */}
      <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
        Available Services
      </span>
      <div className="flex items-start gap-2 md:w-5/6 w-full h-auto">
        <Select
          options={itemOptions}
          formatGroupLabel={formatGroupLabel}
          onChange={(e) => {
            setCurrentItem({ id: e?.value, name: e?.label })
          }
          }
          name="item_drop_down"
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
      <br />


      <span className="text-md w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
        Assigned Services
      </span>{" "}
      <Table className="md:px-4">
        <TableBody>
          <TableRow>
            <TableCell>
              <p className='text-base font-semibold'>Service</p>
            </TableCell>
            <TableCell className='text-xl font-semibold'>
              <p className='text-base font-semibold'>Action</p>
            </TableCell>
          </TableRow>

          <>
            {selectedItems && selectedItems?.length > 0 ? (
              selectedItems?.map(({ id, name }, _id) => (
                <TableRow
                  key={_id}

                >
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        let items = selectedItems
                        items.splice(_id, 1)
                        setIsRemoveItem(!isRemoveItem)
                        setSelectedItems(
                          items
                        );
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
              <>
                <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                  <p>
                    {item?.name || item?.official_name} has not listed
                    the {'item'} it offers. Add some below.
                  </p>
                </li>
                <br />
              </>
            )}
          </>
        </TableBody>
      </Table>

    </form>
  )
}

export default EditListItem