import * as React from 'react';
import TextField from '@mui/material/TextField';


export default function NativePickers({ onSelected }) {
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());

  //Date now string in form of yyyy-mm-dd
  const dateNow = '2022-06-28';


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
        sx={{ width: '100%', marginTop: 3 }}
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
          marginTop: 1
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
