import * as React from 'react';
import { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useEffect } from 'react';

// import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';



function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({categories}) {

  // console.log({categories})

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState((categories ? (() => categories.map(({name}) => name))(categories) : []));
  const [right, setRight] = React.useState([]);

  let leftChecked = intersection(checked, left);
  let rightChecked = intersection(checked, right);

  useEffect(() => {
     leftChecked = intersection(checked, left);
     rightChecked = intersection(checked, right);

    //  console.log({leftChecked, rightChecked, left, right, checked})
  }, [])

  const handleToggle = (value) => () => {
  
    const currentIndex = checked.indexOf(value);
    // console.log({currentIndex})
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    // leftChecked = [ ...checked]


  };


  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const accordion = (data) => {

      // const {name, subCategories} = data
      
      return (
        <Accordion sx={{flex:100}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{data}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ListItem  key={1} component="div">
              <div className='flex-col items-start justify-start'>
                    {
                      <ListItemText  primary={`${data}`} sx={{borderBottom: '1px solid grey'}} />
                    }
              </div>

                    {/* <div className='space-x-2 flex items-center'>
                        <Checkbox
                        checked={true}  
                        tabIndex={-1}
                        disableRipple
                        id='yes_checkbox'
                        inputProps={{
                            'aria-labelledby': 'check-1',
                        }} />
                        <label htmlFor='yes_checkbox'>
                            Yes
                        </label>    
                    </div> */}
                                 
            </ListItem>
        </AccordionDetails>
      </Accordion>  
      )
  }

  const customList = (items) => (
    <Paper sx={{ width: 520, height: 300, overflow: 'auto', padding:1 }}>
        
      <List dense component="div" role="list">
        {items.map((_data, i) => {

          // let {name, subCategories} = _data
          // console.log(value)
          const labelId = `transfer-list-item-${_data}-label`;

          return (
            <ListItem
              key={i}
              role="listitem"
              button
              onClick={handleToggle(_data)}
              sx={{my:2}}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(_data) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              {/* <ListItemText id={labelId} primary={`List item ${value + 1}`} /> */}
              
              {accordion(_data)}
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="evenly" alignItems="center"  sx={{flex: 100}}>
      <Grid item> 
      <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Categories</h5>
        <Grid container direction="column"  justifyContent="start" alignItems="start" gap={2}>
            {/* Auto Complete */}   
        <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={left.map(({name}) => name)}
                sx={{ width: '100%'}}
                renderInput={(params) => <TextField {...params} label="" />}
            />   
            {customList(left)}  
        </Grid>
      
          </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>
          <Grid container direction="column"  justifyContent="start" alignItems="start">
          <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900 mb-20">Selected Services</h5>
            {customList(right)}
          </Grid>
          </Grid>
    </Grid>
  );
}

