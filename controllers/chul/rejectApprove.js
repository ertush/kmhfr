import { checkToken } from '../auth/auth';
// import { checkToken, getToken } from "./auth/auth";

const approveRejectCHU = async (isApproved, setState, id) => {
    let url = `http://api.kmhfltest.health.go.ke/api/chul/updates/${id}/`;
  
    if (isApproved) {
      setState(true);
  
      return checkToken()
        .then((token) => {
          console.log({ token });
          fetch(url, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
  
              Authorization: "Bearer " + token,
            },
      
          }).then((res) => console.log(res.json()));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setState(false);
    }
};

const rejectCHU = (e, ctx, state, comment) => {
    e.preventDefault();
  
    if (state) {
      ctx.is_approved = false;
    } else {
      ctx.is_approved = true;
    }
  
    console.log({ comment });
};

const approveCHUUpdates= async (e,id, router)=>{
  e.preventDefault();
  let url=`/api/common/submit_form_data/?path=approve_chul_updates&latest_updates=${id}`
  try{
       await fetch(url, {
          headers:{
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8'
              
          },
          method: 'PATCH',
          body: JSON.stringify({is_approved:true})
      })
      .then(resp =>resp.json())
      .then(res =>{ 
          router.push({
            pathname: '/community-units',
            query: {has_edits: false, pending_approval: true}
          })
          console.log(res)
      })
      .catch(e=>{
        setStatus({status:'error', message: e})
      })
  }catch (e){
      
        setStatus({status:'error', message: e})
        console.error(e)
  }
}
const approveCHU = (e, id, comment) => {
    e.preventDefault();

    const payload ={
        approval_comment: comment,
        is_rejected: false, 
        is_approved: true
    }
    console.log(JSON.stringify(payload))
    let url=`/api/common/submit_form_data/?path=approve_chul&id=${id}`
    try{
         fetch(url, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })
        .then(resp =>resp)
        .then(res =>{ 
            
            console.log(res)
        })
        .catch(e=>{
          setStatus({status:'error', message: e})
        })
    }catch (e){

        setStatus({status:'error', message: e})
        console.error(e)
    }
    console.log({comment})
}

const rejectChul = (e, id, comment) => {
    e.preventDefault();

    const payload ={
        rejection_reason: comment,
        is_rejected: true, 
        is_approved: false
    }
    let url=`/api/common/submit_form_data/?path=approve_chul&id=${id}`
    try{
         fetch(url, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'PATCH',
            body: JSON.stringify(payload)
        })
        .then(resp =>resp)
        .then(res =>{ 
            
            console.log(res)
        })
        .catch(e=>{
          setStatus({status:'error', message: e})
        })
    }catch (e){

        setStatus({status:'error', message: e})
        console.error(e)
    }
}

export {
    approveRejectCHU,
    approveCHUUpdates,
    approveCHU,
    rejectCHU,
    rejectChul
}