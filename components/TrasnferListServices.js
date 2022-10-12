import React, {useMemo} from 'react';
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


function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function getCtgs(a, b) {
  return a.filter(({name}) => name == b);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TrasnferListServices({categories, setServices, setRefreshForm4, refreshForm4, selectedRight, setSelectedServiceRight}) {

  const [newSelected, setNewSelected] = React.useState([])
  const [checked, setChecked] = React.useState([]);
  const [checkBoxChecked, setCheckBoxChecked] = React.useState([]);
  const [left, setLeft] = React.useState((categories ? (() => categories.map(({name}) => name))() : []));
  const [right, setRight] = React.useState((selectedRight ? (() => {
    const result = []

    new Set(selectedRight.map(({name}) => name)).forEach(data => {
      result.push(data)
  })

  return result
  })() : []));
  
  const [checkAll, setCheckAll] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState({});

  let leftChecked = intersection(checked, left);
  let rightChecked = intersection(checked, right);
 


useMemo(() => {
     
    // console.log({selectedRight, right})

     setSelectedServiceRight(selectedRight)
     leftChecked = intersection(checked, left);
     rightChecked = intersection(checked, right);
    

  }, [left, right])

  const handleToggle = (value) => () => {
  
    const currentIndex = checked.indexOf(value);
   
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    

  };

  const handleCheckBoxToggle =  (service) => () => {
 
    const currentIndex = checkBoxChecked.indexOf(service.subctg);
  
    const crntIndex =  newSelected.indexOf(service)

    const newChecked = [...checkBoxChecked];
    
    let allSelected = newSelected 
    setNewSelected((() => {allSelected.push(service); return allSelected}))

    if (currentIndex === -1) {
     
      newChecked.push(service.subctg);
    } else {
      newChecked.splice(currentIndex, 1);
      let selected = newSelected
      selected.splice(crntIndex, 1)
      setNewSelected(selected)
    }

    setSelectedService(newSelected)
    setCheckBoxChecked(newChecked);
    
  }

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setCheckAll(true);

    setServices(selectedService)
 
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
   
    // console.log({selectedService})
    setRefreshForm4(!refreshForm4)
    setServices(selectedService)
    
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setServices(right)
    setSelectedServiceRight(right)
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);

    setNewSelected([])
    setServices([]);
  };

  Checkbox

  const accordion = (data, isRight) => {

      const [_data] = data

      const {name, subCategories, value} = _data ?? {name:'Loading...', subCategories:[], value:[]}

      return (
        <Accordion sx={{flex:100, backgroundColor:'#f1f1f1', boxShadow:'none'}} >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <ListItem  key={1} component="div">

                <div className='flex-col items-start justify-start'>
                {
                  subCategories.map((subctg, i) => (
                    
                    <div key={i} className='flex items-center space-x-2'>
                      {
                        !isRight ?
        
                        <>
                          {/* {(() => {console.log({checkBoxChecked})})()} */}
                          <Checkbox
                            checked={checkBoxChecked.indexOf(subctg) !== -1}
                            tabIndex={-1}
                            disableRipple
                            onChange={handleCheckBoxToggle({subctg, value:value[i]})}
                            inputProps={{
                              'aria-labelledby': 'options',
                            }}
                            />
                            <ListItemText  primary={`${subctg}`} sx={{borderBottom: '1px solid grey'}} />
                        </>
                    :
                    
                        <>
                          {
                            (selectedRight !== null ? (selectedRight.map(ctg => {ctg => ctg.subCategories[0]}).indexOf(subctg) !== -1 || checkAll) : checkBoxChecked.indexOf(subctg) !== -1 || checkAll) &&
                            <Checkbox
                            checked={checkAll ? true : selectedRight !== null ? (selectedRight.map(ctg => ctg.subCategories[0]).indexOf(subctg) !== -1) : (checkBoxChecked.indexOf(subctg) !== -1)}
                            tabIndex={-1}
                            disableRipple
                            onChange={handleCheckBoxToggle({subctg, value:value[i]})}
                            inputProps={{
                              'aria-labelledby': 'options',
                            }}
                          />
                          }
                          {/* {console.log({selectedRight: selectedRight.map(ctg => ctg.subCategories[0])})} */}
                          {
                            selectedRight !== null &&
                            (selectedRight.map(ctg => ctg.subCategories[0]).indexOf(subctg) !== -1 || checkAll) &&
                            <ListItemText  primary={`${subctg}`} sx={{borderBottom: '1px solid grey'}} />
                          }
                        </>
                      }
                        </div>
                      
                  ))
                }
              </div>
            
                        
              </ListItem>
          </AccordionDetails>
    
        </Accordion> 
     
      )
  }

  const customList = (items, _isRight) => (
    <Paper sx={{ width: 520, height: 300, overflow: 'auto', padding:1 }}>
        
      <List dense component="div" role="list">
        
        {
        items.map((_data, i) => {

          
          const labelId = `transfer-list-item-${_data}-label`;

          return (
            <ListItem
              key={i}
              role="listitem"
              button
              sx={{my:2}}
            >
              <ListItemIcon>
             
                <Checkbox

                  checked={
                    checked.indexOf(_data) !== -1
                   } 
                  tabIndex={-1}
                  disableRipple
                  onChange={handleToggle(_data)}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              
              </ListItemIcon>
             
              

              {accordion(getCtgs(categories, _data), _isRight)}

            </ListItem>
          );
        })
       

        }
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="evenly" alignItems="center"  sx={{flex: 100, boxShadow:'none', backgroundColor:'#f9fafb'}}>
      <Grid item> 
      <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Categories</h5>
        <Grid container direction="column" justifyContent="start" alignItems="start" gap={2} >
         
            {customList(left, false)}  
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
          <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Services</h5>
            {customList(right, true)}
          </Grid>
          </Grid>
    </Grid>
  );
}

