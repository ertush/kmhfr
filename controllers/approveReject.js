const approveRejectCHU = (comment = '', isApproved, setState) => {

    if (isApproved) {
        setState(true)

    } else {
        setState(false)

    }

}

export {
    approveRejectCHU
}