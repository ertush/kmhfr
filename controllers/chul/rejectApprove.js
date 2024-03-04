import { checkToken } from '../auth/auth';


const approveRejectCHU = async (isApproved, setState, id) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/chul/updates/${id}/`;

  if (isApproved) {
    setState(true);

    return checkToken()
      .then((token) => {

        fetch(url, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },

        })
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

};

const approveCHUUpdates = async (e, id, status, router, token) => {
  e.preventDefault();
  let payload = ''
  if (status == true) {
    payload = { is_approved: true }
  } else {
    payload = { is_rejected: true }
  }
  let url = `${process.env.NEXT_PUBLIC_API_URL}/chul/updates/${id}/` //`/api/common/submit_form_data/?path=approve_chul_updates&latest_updates=${id}`
  
  try {
    await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`

      },
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
      .then(resp => resp.json())
      .then(res => {
        router.push({
          pathname: '/community-units',
          query: { has_edits: false, pending_approval: true }
        })

      })
      .catch(e => {
        setStatus({ status: 'error', message: e })
      })
  } catch (e) {

    setStatus({ status: 'error', message: e })
    console.error(e)
  }
}

const approveCHU = (e, id, comment, state, router, token) => {
  e.preventDefault();
  let payload = {}
  if (state == true) {
    payload = {
      approval_comment: comment,
      is_rejected: false,
      is_approved: true
    }
  } else {
    payload = {
      rejection_reason: comment,
      is_rejected: true,
      is_approved: false
    }
  }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/${id}/` // `/api/common/submit_form_data/?path=approve_chul&id=${id}`
  
  try {
    fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`

      },
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
      .then(resp => resp)
      .then(res => {
        router.push({
          pathname: '/community-units',
          query: {}
        })


      })
      .catch(e => {
        setStatus({ status: 'error', message: e })
      })
  } catch (e) {

    // setStatus({ status: 'error', message: e })
    console.error(e.message)
  }
}

export {
  approveRejectCHU,
  approveCHUUpdates,
  approveCHU,
  rejectCHU,
}