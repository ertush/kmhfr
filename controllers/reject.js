const approveRejectCHU = (isApproved, setState) => {

    if (isApproved) {
        setState(true)

    } else {
        setState(false)

    }

}

const rejectCHU = (e, ctx, state, comment) => {
    e.preventDefault();

    if(state){
        ctx.is_approved = false;
    }else {
        ctx.is_approved = true;
    }

    console.log({comment})
}

export {
    approveRejectCHU,
    rejectCHU
}