import { checkToken } from "./auth/auth";

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

export { approveRejectCHU, rejectCHU };



