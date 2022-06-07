const approveRejectFacility = (isApproved, setState) => {
    console.log("pppppppppppppppppp ------------>>>> "+isApproved);

    if (isApproved == null) {
        setState(true)

    } else {
        setState(false)

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