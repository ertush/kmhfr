import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { InformationCircleIcon } from "@heroicons/react/solid";
import router from 'next/router';


function FacilityUpgradeModal({ subject, facilityId }) {

  const [open, setOpen] = useState(true)
  const handleClose = () => setOpen(false);



  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}

    >
      <Fade in={open}>
        <Box sx={
          {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'transparent',
            borderRadius: '6px',
            borderLeft: 'solid 10px #818cf8',
            boxShadow: 24,
            p: 4,
          }
        }>
          <span className="flex gap-2 items-center">
            <InformationCircleIcon className="w-24 h-24 text-blue-600" />
            <Typography id="transition-modal-title" variant="h6" >
              Would you like to upgrade/downgrade or save edited facility {subject}?
            </Typography>
          </span>
          <div className="flex-col items-start">
            <Typography id="transition-modal-title" variant='h7'>
              Changes to Facility {subject} successful.
            </Typography>

            <form className='my-3 flex-col gap-y-2'>
              <div className='flex justify-between gap-4 mt-4'>
                <button className="bg-blue-600 text-white font-semibold rounded p-2 text-center" type="button" onClick={() => router.push(`/facilities/upgrade/${facilityId}`)}>Upgrade Facility</button>
                <button className="bg-black text-white font-semibold rounded p-2 text-center" type="button" onClick={handleClose}>Save Facility {subject}{'(s)'}</button>
              </div>

            </form>
          </div>

        </Box>
      </Fade>
    </Modal>
  )
}

export default FacilityUpgradeModal