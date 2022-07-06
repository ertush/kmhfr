const approveRejectFacility = (rejected, setState) => {
    console.log("pppppppppppppppppp ------------>>>> "+rejected);

    if (rejected) {
        setState(false)

    } else {
        setState(true)

    }

}

const rejectFacility = (e, ctx, state, comment) => {
    e.preventDefault();

    if(state){
        ctx.is_approved = false;
    }else {
        ctx.is_approved = true;
    }

    console.log({comment})
}

export {
    approveRejectFacility,
    rejectFacility
}