import * as React from 'react';
import { useMemo } from 'react'
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

export default function TransferListInfrastructure({categories, setState, setCount, setRefreshForm5, refreshForm5, selectTitle, selectedInfraRight, setSelectedInfraRight}) {

 
  const [checked, setChecked] = React.useState([]);
  const [newSelected, setNewSelected] = React.useState([])
  const [checkBoxChecked, setCheckBoxChecked] = React.useState([]);
  const [inputVal, setInputVal] = React.useState([])
  const [left, setLeft] = React.useState((categories ? (() => categories.map(({name}) => name))() : []));
  const [right, setRight] = React.useState((selectedInfraRight ? (() => {
  const result = []

    new Set(selectedInfraRight.map(({name}) => name)).forEach(data => {
        result.push(data)
    })

    return result
  })() : []));

  const [checkAll, setCheckAll] = React.useState(false);
  const [selectedInfrastructure, setSelectedInfrastructure] =  React.useState({});
 
  let leftChecked = intersection(checked, left);
  let rightChecked = intersection(checked, right);

  useMemo(() => {
      
      setSelectedInfraRight(selectedInfraRight)
      leftChecked = intersection(checked, left);
      rightChecked = intersection(checked, right);
    
    }, [left])

  const getUnique = a => a.filter((item, i, ar) => ar.indexOf(item) === i)

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

  const handleCheckBoxToggle =  (infrastructure) => () => {
    const currentIndex = checkBoxChecked.indexOf(infrastructure.subctg);

    const crntIndex =  newSelected.indexOf(infrastructure)
   
    const newChecked = [...checkBoxChecked];

    let allSelected = newSelected;
    
    setNewSelected((() => {allSelected.push(infrastructure); return allSelected}))

    if (currentIndex === -1) {
      newChecked.push(infrastructure.subctg);
    } else {
      newChecked.splice(currentIndex, 1);
      let selected = newSelected
      selected.splice(crntIndex, 1)
      setNewSelected(selected)
    }

    setSelectedInfrastructure(newSelected)
    setCheckBoxChecked(newChecked);

  }

  const handleInputChange = (value) => (ev) => {
    const currentIndex = inputVal.indexOf(value);
   
    const newChecked = [...inputVal];

    if (currentIndex === -1) {
      newChecked.push({name: value, val: ev.target.value});
    } else {
      newChecked.splice(currentIndex, 1);
    }

    const uniqueCheckedValues = (() => {
        const names = getUnique(newChecked.map(({name}) => name))
        const vals = getUnique(newChecked.map(({val}) => val))

        return Array.from(newChecked, (v, i) => {   
            return {name: names[i], val: vals[i]}
        })
    })()

    setInputVal(uniqueCheckedValues);

  }

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setCheckAll(true);

    setState(selectedInfrastructure)
 
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
   
    setCount(inputVal)

    setRefreshForm5(!refreshForm5)
    setState(selectedInfrastructure)
   
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));

    setState(right)

    setSelectedInfraRight(selectedInfraRight.splice(selectedInfraRight.indexOf(selectedInfraRight.filter(({name}) => name === rightChecked[0])[0]), 1))
    setRefreshForm5(!refreshForm5)
    // console.log({selectedInfraRight, rightChecked})
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);

    setNewSelected([])
    setState([]);
  };

  

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
      
                      <div key={i} className='w-full grid grid-cols-3 gap-x-2 place-content-center border-b-2 border-gray-300'>
                            <label htmlFor='item_exist_cnt' className='self-center'>{subctg}</label>
                            <div  id='item_exist_cnt' className={`flex items-center ${(name === "ROADS") ? 'justify-end' : ''}  space-x-1 h-auto`}>
                                <label htmlFor='item_exist'>Yes</label>

                                <Checkbox
                                    id={'item_exist'}
                                    checked={checkBoxChecked.indexOf(subctg) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={handleCheckBoxToggle({subctg, value:value[i]})}
                                    inputProps={{
                                        'aria-labelledby': 'options',
                                    }}
                            />
                            </div> 

                            {/*  debug {console.log({name})} */}

                                {
                                  !(name === "ROADS") &&
                                
                                <input
                                    
                                    id={`${subctg}-${i}`}
                                    onChange={handleInputChange(subctg)}
                                    type='number'
                                    name='facility_official_name'
                                    className='flex-none w-full h-8 self-center bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                />
                              } 
    
                      </div>
                  :               
                        <>
                            {
                                 (selectedInfraRight !== null ? (selectedInfraRight.map(ctg => {ctg => ctg.subCategories[0]}).indexOf(subctg) !== -1 || checkAll) : checkBoxChecked.indexOf(subctg) !== -1 || checkAll) &&
                                <Checkbox
                                key={i}
                                checked={checkAll ? true : selectedInfraRight !== null ? (selectedInfraRight.map(ctg => ctg.subCategories[0]).indexOf(subctg) !== -1) : (checkBoxChecked.indexOf(subctg) !== -1)}
                                tabIndex={-1}
                                disableRipple
                                onChange={handleCheckBoxToggle({subctg, value:value[i]})}
                                inputProps={{
                                    'aria-labelledby': 'options',
                                }}
                                />
                            }
                            {
                              selectedInfraRight !== null &&
                             (selectedInfraRight.map(ctg => ctg.subCategories[0]).indexOf(subctg) !== -1 || checkAll) &&
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

  const customList = (items, isRight) => (
    <Paper sx={{ width: 480, height: 300, overflow: 'auto', padding:1, margin:'auto' }}>
    

      <List dense component="div" role="list">
        {items.map((_data, i) => {

          
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
                  checked={checked.indexOf(_data) !== -1} 
                  tabIndex={-1}
                  disableRipple
                  onChange={handleToggle(_data)}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              
              </ListItemIcon>

              {_data !== '' && accordion(getCtgs(categories, _data), isRight)}

            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div className="flex items-center justify-start gap-6 w-full">
      <div className='flex-col items-start gap-2'>
        <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Categories</h5>
        {customList(left, false)}  
      </div>
      

        <div className='flex flex-col justify-center items-center gap-3'>
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
        </div>
      
        <div className='flex-col items-start gap-2'>
          <h5 className="text-md uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">{selectTitle}</h5>
          {customList(right, true)}
        </div>
    </div >
  );
}

