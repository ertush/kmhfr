import React, { useState } from 'react';
import { Button, IconButton, Popover } from '@material-ui/core';
import {FcDocument} from 'react-icons/fc';


const PrintBtn =(props) => { 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
    API_URL = 'http://localhost:8000/api'
  }

  const open = Boolean(anchorEl);
  const id = open ? 'print-popover' : undefined;
  const facility_details =`/facilities/facility_detail_report/${props.facility}/?access_token=${props.access_token}`
  const cover_letter = `/facilities/facility_cover_report/${props.facility}/?access_token=${props.access_token}`
  const correction_template = `/facilities/facility_correction_template/${props.facility}/?access_token=${props.access_token}`

  const handlePrint = (url) => () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`+ url
  };

  return (
    <>
      <Button className="p-2 text-center rounded-md font-semibold text-base  text-white bg-indigo-500" onClick={handleClick} aria-describedby={id}>Print</Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* The child component that handles the printing functionality */}

       <IconButton onClick={handlePrint(correction_template)}><FcDocument/>{`Facility Correction Template`}</IconButton>
       <IconButton onClick={handlePrint(facility_details)}><FcDocument/>{`Facility Detail Report`}</IconButton>
       <IconButton onClick={handlePrint(cover_letter)}><FcDocument/>{`Facility Cover Report`}</IconButton>
        
      </Popover>
    </>
  );
};


export default PrintBtn;

