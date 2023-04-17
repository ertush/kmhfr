import axios from "axios";

axios
  .get("https://example.com/api/data")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    if (error.response && error.response.status === 404) {
      console.log("The resource could not be found.");
    } else {
      console.log("An error occurred:", error.message);
    }
  });
