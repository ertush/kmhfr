import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { margin } from '@mui/system';
import { createTheme } from '@mui/material';

export default function NativePickers({ onSelected }) {
    const [fromDate, setFromDate] = React.useState(new Date());
    const [toDate, setToDate] = React.useState(new Date());

//Date now string in form of yyyy-mm-dd
    const dateNow = '2022-06-28';
    const theme = createTheme({
      spacing: 4,
    });
    
  const handleDates = () => {
    onSelected(fromDate??dateNow, toDate??dateNow);
  }
  
  return (
    <Stack component="form" noValidate spacing={3}>
      <TextField
        id="date"
        label="From"
        type="date"
        size='small'
        defaultValue={ dateNow }
        sx={{ width: 240 }}
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
        defaultValue={ dateNow }
        margin='dense'
        sx={{
          width: 240
      
    
        
        }}
        onChange={(e) => {
          setToDate(e.target.value)
          handleDates()
        
        }}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: theme.spacing(5) }}
        
      />
      

    </Stack>
  );
}
