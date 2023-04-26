// This is a component that opens a popover containing 3 clickable document icons
// It contains a child component (UrlPrinter)that handles the printing functionality
// The component fetches the urls to be printed in the UrlPrinter throught the getInitial props

import React, { useState } from 'react';
import { Button, IconButton, Popover } from '@material-ui/core';
import UrlPrinter from './UrlPrinter';
import { checkToken } from '../controllers/auth/auth';


const PrintBtn =(props) => { 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'print-popover' : undefined;



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
        {/* The child component that hanles the printing functionality */}

       <UrlPrinter url_to_print={props.facilityCorrectionTemplate} name="Facility Correction Template"/>
       <UrlPrinter url_to_print={props.facilityDetailReport} name="Facility Detail Report"/>
       <UrlPrinter url_to_print={props.facilityCoverReport} name="Facility Cover Report"/>
        
      </Popover>
    </>
  );
};

//fetch the urls here and return them as props
PrintBtn.getInitialProps = async (ctx) => {


  try {
    // Check token
    const tokenResult = await checkToken(ctx.req, ctx.res);
    if (tokenResult.error) {
      throw new Error("Error checking token");
    }
    else{
            const token = tokenResult.token;
          
            // Get facility ID
            const facilityId = ctx.query.facilityId;
        
            
            // Fetch facility_correction_template
            try {
                    const facilityCorrectionTemplate = await (await fetch(`api/facility/get_facility/?path=facility_correction_template/${facilityId}/?access_token=${token}`, {
                      headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                      },
                    })).json();
              
            } catch (e) {
              console.error('Encountered error while fetching facility_correction_template', e.message);
            }
        
        
            // Fetch facility_detail_report
            try {
                    const facilityDetailReport = await (await fetch(`api/facility/get_facility/?path=facility_detail_report/${facilityId}/?access_token=${token}`, {
                      headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                      },
                    })).json();     
            }
            catch (e) {
                  console.error('Encountered error while fetching facility_detail_report', e.message);
            }
        
        
            // Fetch facility_cover_report
            try {
                  const facilityCoverReport = await (await fetch(`api/facility/get_facility/?path=facility_cover_report/${facilityId}/?access_token=${token}`, {
                    headers: {
                      Authorization: "Bearer " + token,
                      Accept: "application/json",
                    },
                  })).json();
      } 
      catch (e) {
  
            console.error('Encountered error while fetching facility_cover_report', e.message);
      }
  
      return {
        facilityCorrectionTemplate: facilityCorrectionTemplate,
        facilityDetailReport:facilityDetailReport,
        facilityCoverReport: facilityCoverReport,
        facilityId:facilityId,
        token: token,
      };



    }
    
  } catch (err) 
  {
    console.log("Error fetching facilities report: ", err);
    
  }
};

export default PrintBtn;

