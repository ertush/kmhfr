import * as React from 'react';
import TextField from '@mui/material/TextField';


export default function NativePickers({ onSelected }) {
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());

  //Date now string in form of yyyy-mm-dd
  const dateNow = new Date();


  const handleDates = () => {
    onSelected(fromDate ?? dateNow, toDate ?? dateNow);
  }

  return (
    <>
      <TextField
        id="date"
        label="From"
        type="date"
        size='small'
        defaultValue={dateNow}
        className='border border-green-600'
        sx={{ width: '100%', marginTop: 3, borderRadius:'0px' }}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          setFromDate(e.target.value) 
          handleDates()
        }}
      />
      <TextField
        id="date"
        label="To"
        size='small'
        type="date"
        defaultValue={dateNow}

        sx={{
          width: '100%',
          marginTop: 1,
          borderRadius:'0px'
        }}
        onChange={(e) => {
          setToDate(e.target.value)
          handleDates()

        }}
        InputLabelProps={{
          shrink: true,
        }}


      />


    </>
  );
}
