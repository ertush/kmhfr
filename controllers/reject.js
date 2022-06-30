import { checkToken, getToken } from "./auth/auth";

const approveRejectCHU = async (isApproved, setState, id) => {
  //   let url = `http://api.kmhfltest.health.go.ke/api/chul/units/?is_rejected=true&fields=${cu.id},${cu.code},${cu.name},${cu.status_name},${cu.facility_name},${cu.facility_county},${cu.facility_subcounty},${cu.facility_ward},${cu.date_established}/`;
  let url = `http://api.kmhfltest.health.go.ke/api/chul/updates/${id}/`;

  if (isApproved) {
    setState(true);

    return checkToken()
      .then((token) => {
        console.log({ token });
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          //   body: JSON.stringify({
          //     is_approved: false,
          //   }),
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

export { approveRejectCHU, rejectCHU };
