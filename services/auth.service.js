import axios from "axios";
require('dotenv').config()

// console.log(process.env)
let API_URL = "";
let HOST_URL="";
if(process.env.REACT_APP_ENV == 'test'){
  API_URL = "https://vcscdev.doordrishti.ai/api/web/"; 
  HOST_URL="https://vcscdev.doordrishti.ai/";
 
}
else if(process.env.REACT_APP_ENV == 'prod'){
  API_URL = "https://vcsc.doordrishti.ai/api/web/";
  HOST_URL="https://vcsc.doordrishti.ai/";

}
else if(process.env.REACT_APP_ENV == 'testing'){
  API_URL = "https://vcsc.testing.doordrishti.ai/api/web/";
  HOST_URL="https://vcsc.testing.doordrishti.ai/";

}
else{
  API_URL = "http://127.0.0.1:8000/api/web/";
  HOST_URL="http://127.0.0.1:8000/";
  // API_URL = "https://vcscdev.doordrishti.ai/api/web/";
  // HOST_URL="https://vcscdev.doordrishti.ai/";

}
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "vclogin", {
        phone: username,
        password: password,
        type: "web",
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("fpoId", response.data.user_id)
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("landholding");
    localStorage.removeItem("sites_wkt");
    localStorage.removeItem("fpoId");
    localStorage.removeItem("fpoName");
    localStorage.removeItem("activeCardId");
    localStorage.removeItem("productFarmerData");
    localStorage.removeItem("ProductAccordionData");
    localStorage.removeItem("filterItemData");
    localStorage.removeItem("BoParentfilterItem");
    localStorage.removeItem("BoParentProductAccordion");





  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
