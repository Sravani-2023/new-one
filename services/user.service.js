import axios from "axios";
import authHeader from "./auth-header";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
require('dotenv').config()
// console.log(process.env)

let API = ""
let API_URL = ""
let FORCAST_URL = ""
let HOST_URL=""
let COMM_URL=""


if(process.env.REACT_APP_ENV == 'test'){
  API = "https://vcscdev.doordrishti.ai/api/";
  API_URL = "https://vcscdev.doordrishti.ai/api/web/";
  FORCAST_URL = "https://utildev.doordrishti.ai/vcinfo/";
  HOST_URL="https://vcscdev.doordrishti.ai/";
  COMM_URL = "https://utildev.doordrishti.ai/"
}
else if(process.env.REACT_APP_ENV == 'prod'){
  API = "https://vcsc.doordrishti.ai/api/";
  API_URL = "https://vcsc.doordrishti.ai/api/web/";
  FORCAST_URL = "https://utility.doordrishti.ai/vcinfo/";
  HOST_URL="https://vcsc.doordrishti.ai/";
  COMM_URL = "https://utility.doordrishti.ai/"

}
else if(process.env.REACT_APP_ENV == 'testing'){
  API = "https://vcsc.testing.doordrishti.ai/api/";
  API_URL = "https://vcsc.testing.doordrishti.ai/api/web/";
  FORCAST_URL = "https://utility.testing.doordrishti.ai/vcinfo/";
  HOST_URL="https://vcsc.testing.doordrishti.ai/";
  COMM_URL = "https://utility.testing.doordrishti.ai/";
}
else{
  // API = 'http://127.0.0.1:8000/api/';
  // API_URL = 'http://127.0.0.1:8000/api/web/';
  // HOST_URL="http://127.0.0.1:8000/";
  HOST_URL="https://vcscdev.doordrishti.ai/";
  API = "https://vcscdev.doordrishti.ai/api/";
  API_URL = "https://vcscdev.doordrishti.ai/api/web/";
  FORCAST_URL = "https://utildev.doordrishti.ai/vcinfo/";
  COMM_URL = "https://utildev.doordrishti.ai/"
  
}
console.log(API_URL)

// const FORCAST_URL = "https://fpo.doordrishti.ai/blockforecast";

class UserService {
  getFpoList() {
    return axios.get(API_URL + "fpohomedata/fpo", { headers: authHeader() });
  }

  getDashboard() {
    return axios.get(API_URL + "homedetails", { headers: authHeader() });
  }

  getOrgData() {
    return axios.get(API_URL + "fpohomedata/", { headers: authHeader() });
  }

  getFpoFarmersCount() {
    return axios.get(API_URL + "fpohomedata/farmers", {
      headers: authHeader(),
    });
  }

  getFpoLandholdingsCount() {
    return axios.get(API_URL + "fpohomedata/landholding", {
      headers: authHeader(),
    });
  }

  getFpoCropsCount(range, season) {
    return axios.get(
      API_URL + "fpohomedata/crops?range=" + range + "&season=" + season,
      { headers: authHeader() }
    );
  }

  getFpoInputsCount() {
    return axios.get(API_URL + "fpohomedata/inputs", { headers: authHeader() });
  }

  getFpoProcsCount(month, year) {
    return axios.get(
      API_URL + "fpohomedata/procs?year=" + year + "&month=" + month,
      { headers: authHeader() }
    );
  }

  getFpoOrdersCount() {
    return axios.get(API_URL + "fpohomedata/orders", { headers: authHeader() });
  }

  getFpoWspsCount() {
    return axios.get(API_URL + "fpohomedata/wsp", { headers: authHeader() });
  }

  getFpoFIsCount(range, season) {
    return axios.get(
      API_URL + "fpohomedata/fi?year=" + range + "&season=" + season,
      { headers: authHeader() }
    );
  }

 
  getFrList(sub_fpo_id) {
    return axios.get(API_URL + "frs?sub_fpo_id="+ sub_fpo_id, { headers: authHeader() });
  }

  getStateList(sub_fpo_id) {
    return axios.get(API_URL + "farmersstates?sub_fpo_id="+ sub_fpo_id, { headers: authHeader() });
  }

  getDistList(distId,sub_fpo_id) {
    // console.log("sub fpo district id",sub_fpo_id)
    return axios.get(API_URL + "farmersdistricts/" + distId +"?sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
  }

  
  getAdvanceFilter(sub_fpo_id) {
    return axios.get(API_URL + "farmer-filters?sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
  }

  getAlliedActivities() {
    return axios.get(API + "allied_activities", {
      headers: authHeader(),
    });
  }
 
  getCommonFilter(sub_fpo_id) {
    return axios.get(API_URL + "farmer-common-filters?sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
  }
  getCropExportData(season, year, isVerified, cropId){
    // return axios.post(API_URL + "export_crop_component_data/",staticResponse ,{
    
    return axios.get(API_URL + "export_farmer_component_data/"+ season + "/" + 
      year + "/" + isVerified + "/" + cropId + "/", {
      headers: authHeader(),
      responseType: "blob",
    });
  }
  getInterestedFarmerExport(){
    
    return axios.get(API_URL + "export-farmer-data/?export_int_farmer_data=1", 
    // return axios.get(API_URL + "get_interested_farmers/FPO/?export_int_farmer_data=1",
      {
      headers: authHeader(),
      responseType: "blob",
    });
  }
  getLandholdingExportData(staticResponse){
   
  return axios.post(API_URL + "export_landholding_data/" ,staticResponse ,{
    headers: authHeader(),
    responseType: "blob",
  });
  }
  getProductExportData(staticResponse){
    // return axios.post(API_URL + "export_product_component_data/" ,staticResponse ,{

    return axios.post(API_URL + "export_product_component_data/" ,staticResponse ,{
      headers: authHeader(),
      responseType: "blob",
    });
  }
 
  getFarmerList(Id, filter = "-1,-1" , sub_fpo_id) {
    // console.log(
    //   "api2::",
    //   API_URL + "farmerslist/FR/" + Id + "?filters=" + filter + "&sub_fpo_id="+ sub_fpo_id ,
    // );
    return axios.get(API_URL + "farmerslist/FR/" + Id + "?filters=" + filter + "&sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
    // && "subfpo_Id="+ subfpo_Id
  }
  getInterestedFarmers() {
    return axios.get(API_URL + "get_interested_farmers/FPO/" , {
      headers: authHeader(),
    });
  }

  getFarmerListByDist(Id, filter = "-1,-1" , sub_fpo_id) {
    // console.log(
    //   "getFarmerList::",
    //   API_URL + "farmerslist/Location/" + Id + "?filters=" + filter
    // );

    return axios.get(
      API_URL + "farmerslist/Location/" + Id + "?filters=" + filter+ "&sub_fpo_id="+ sub_fpo_id,
      {
        headers: authHeader(),
      }
    );
  }

  getFarmerListByFilter(Id, filter = "-1,-1",sub_fpo_id) {
    // console.log(
    //   "getFarmerList::",
    //   API_URL + "farmerslist/Filter/" + Id + "?filters=" + filter
    // );

    return axios.get(
      API_URL + "farmerslist/Filter/" + Id + "?filters=" + filter+"&sub_fpo_id="+ sub_fpo_id,
      {
        headers: authHeader(),
      }
    );
  }

  getSiteList(Id) {
    return axios.get(API_URL + "getsiteswkt/FR/" + Id, {
      headers: authHeader(),
    });
  }

  getSiteListByDist(Id) {
    return axios.get(API_URL + "getsiteswkt/Location/" + Id, {
      headers: authHeader(),
    });
  }

  getSiteListByFilter(Id) {
    return axios.get(API_URL + "getsiteswkt/Filter/" + Id, {
      headers: authHeader(),
    });
  }
  getSiteListByFrId(Id) {
    return axios.get(API_URL + "getsiteswkt/farmer/" + Id, {
      headers: authHeader(),
    });
  }

  farmerUpdate(id, data) {
    // console.log(data);
    return axios.post(API_URL + "editfarmer/" + id, data, {
      headers: authHeader(),
    });
  }
 
  getInputList(subfpo_Id) {
    return axios.get(API_URL + "ip-product-list/?sub_fpo_id="+ subfpo_Id, { headers: authHeader() });
  }

  getInputComponents(season, year, isVerified, cropId, fpoId) {
    console.log( API_URL +
      "crop_components/" +
      season +
      "/" +
      year +
      "/" +
      isVerified +
      "?sub_fpo_id=" +
      fpoId + 
      "&crop_master_id="+
      cropId + 
      "&aggregation_level=crop",)
    return axios.get(
      // API_URL +
      //   "crop_components/" +
      //   season +
      //   "/" +
      //   year +
      //   "/" +
      //   isVerified +
      //   "/" +
      //   cropId +
      //   "?sub_fpo_id=" +
      //   fpoId,
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        isVerified +
        "?sub_fpo_id=" +
        fpoId+
        "&crop_master_id=" +
        cropId + 
        "&aggregation_level=crop",
      { headers: authHeader() }
    );
  }
  getProductInputComponents(season, year, isVerified,sub_fpo_id) {
    return axios.get(
     
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        isVerified +
        "?aggregation_level=component" +
        "&sub_fpo_id="+ sub_fpo_id
        ,
      { headers: authHeader() }
    );
  }

  // getComponentFarmers(data) {
  //   return axios.post(API_URL + "component_farmers", data, {
  //     headers: authHeader(),
  //   });
  // }
  
  getComponentFarmers(season,year,verifiedSend,fpoId,cropId,categoryId,productId,brandId,sendMonth,sendYear) {
    return axios.get(
     
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        verifiedSend +
        "?sub_fpo_id=" +
        fpoId+
        "&crop_master_id=" +
        cropId + 
        "&aggregation_level=farmer_list_crop" +
        "&category_id="+ categoryId +
            "&product_id="+ productId +
            "&brand_id="+ brandId +
            "&required_month="+ sendMonth +
            "&required_year="+ sendYear
        ,
      { headers: authHeader() }
    );
  }
  BoParentVillageComponent(season,year,verifiedSend,categoryId,productId,brandId,sendMonth,sendYear) {
    return axios.get(
     
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        verifiedSend +
        
       
        "?aggregation_level=sub_fpo_component" +
        "&category_id="+ categoryId +
            "&product_id="+ productId +
            "&brand_id="+ brandId +
            "&required_month="+ sendMonth +
            "&required_year="+ sendYear
        ,
      { headers: authHeader() }
    );
  }
  getProductFarmersComponent(season,year,verifiedSend,fpoId,categoryId,productId,brandId,sendMonth,sendYear) {
    return axios.get(
     
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        verifiedSend +
        "?sub_fpo_id=" +
        fpoId+
       
        "&aggregation_level=farmer_list" +
        "&category_id="+ categoryId +
            "&product_id="+ productId +
            "&brand_id="+ brandId +
            "&required_month="+ sendMonth +
            "&required_year="+ sendYear
        ,
      { headers: authHeader() }
    );
  }
  getProductVillageComponent(season,year,verifiedSend,fpoId,farmerId,categoryId,productId,brandId,sendMonth,sendYear) {
    return axios.get(
     
      API_URL +
        "crop_components/" +
        season +
        "/" +
        year +
        "/" +
        verifiedSend +
        "?sub_fpo_id=" +
        fpoId+
       
        "&aggregation_level=farmer" +
        "&farmer_id="+ farmerId +
        "&category_id="+ categoryId +
            "&product_id="+ productId +
            "&brand_id="+ brandId +
            "&required_month="+ sendMonth +
            "&required_year="+ sendYear
        ,
      { headers: authHeader() }
    );
  }
  // getWeatherWarning(getStateId, getDistId) {
  //   return axios.get(
  //     "https://fpo.doordrishti.ai/alert?stateid=" +
  //       getStateId +
  //       "&distid=" +
  //       getDistId
  //   );
  // }
  getWeatherForecast(getStateId, getDistId, getBlockId) {
    return axios.get(
      FORCAST_URL + "blockforecast/" +
        "?stateid=" +
        getStateId +
        "&distid=" +
        getDistId +
        "&blockid=" +
        getBlockId
    );
  }
  getFuturePrice() {
    return axios.get(FORCAST_URL+"bhavcopy_new?current");
    // return axios.get("https://fpo.doordrishti.ai/bhavcopy_new/");##need to uncomment once vcinfo server is updated
  }
  getSpotPrice(getStateId, getDistId) {
    return axios.get(
      FORCAST_URL+"spot?stateid=" +
        getStateId +
        "&distid=" +
        getDistId
    );
  }
  getSpotPriceModalData(getStateId, getDistId,getmarket,getcategory){
    return axios.get(
      FORCAST_URL +
         "spotprices?stateid=" +
         getStateId +
         "&distid=" +
         getDistId +
         "&market=" +
         getmarket +
         "&category=" +
         getcategory,
       { headers: authHeader() }
     );
  




  }
  getLandholding(getSelection, fpo_id) {
    return axios.get(API_URL + "landholding/" + getSelection + "/web?sub_fpo_id=" + fpo_id, {
      // return axios.get ('https://bf03-103-83-128-15.ngrok.io/api/web/landholding/irrigated/web',{
      headers: authHeader(),
    });
  }

  getSiteListByFarmer(farmerId) {
    return axios.get(API_URL + "sites/" + farmerId, { headers: authHeader() });
  }

 
  getCropsList(sub_fpo_id) {
    return axios.get(API_URL + "cropslist"+ "?sub_fpo_id="+ sub_fpo_id, { headers: authHeader() });
  }
  getCropsListByFarmer(cropId, season, year, isVerified,sub_fpo_id) {
    // console.log(
    //   API_URL +
    //     "cropsfarmers/" +
    //     cropId +
    //     "/'" +
    //     season +
    //     "'/" +
    //     year +
    //     "/" +
    //     isVerified
    // );
    return axios.get(
      API_URL +
        "cropsfarmers?crop_id=" +
        cropId +
        "&season=" +
        season +
        "&date_range=" +
        year +
        "&is_verified=" +
        isVerified + "&sub_fpo_id=" +sub_fpo_id,
      { headers: authHeader() }
    );
  }

  getWareHouseList(subfpo_Id) {
    return axios.get(API_URL + "get-wsp-list/?sub_fpo_id="+ subfpo_Id, { headers: authHeader() });
  }
  WspCreate(data) {
    return axios.post(API_URL + "create-wsp/", data, { headers: authHeader() });
  }
  WspUpdate(id, data) {
    return axios.post(API_URL + "update-wsp/" + id + "/", data, {
      headers: authHeader(),
    });
  }

  getAgroMasterActivityList(cropId) {
    return axios.get(API_URL + "getwebactivitystatus/" + cropId, {
      headers: authHeader(),
    });
  }
  getYearRanges(){
    return axios.get(API + "master", {
      headers: authHeader(),
    });
  }

  getSelActivityInfo(getSelActivityId, getSelCropId) {
    let finalFetchUrl = API_URL;
    // console.log("Selected Act: ", getSelActivityId, " / Crop: ", getSelCropId);
    switch (getSelActivityId) {
      case 1: {
        finalFetchUrl = finalFetchUrl + "getinsectpestmgnt/" + getSelCropId;
        break;
      }
      case 2: {
        finalFetchUrl = finalFetchUrl + "getnutrientmgnt/" + getSelCropId;
        break;
      }
      case 3: {
        finalFetchUrl =
          finalFetchUrl +
          "getlandpreparationmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 4: {
        finalFetchUrl =
          finalFetchUrl +
          "getlandpreparationmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 5: {
        finalFetchUrl =
          finalFetchUrl + "getwatermanagementmgnt/" + getSelCropId;
        break;
      }
      case 6: {
        finalFetchUrl =
          finalFetchUrl +
          "getsowingmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 7: {
        finalFetchUrl =
          finalFetchUrl +
          "getsowingmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 8: {
        finalFetchUrl =
          finalFetchUrl +
          "getsowingmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 9: {
        finalFetchUrl =
          finalFetchUrl +
          "getcropissuesmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 10: {
        finalFetchUrl =
          finalFetchUrl +
          "getcropissuesmgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 11: {
        finalFetchUrl = finalFetchUrl + "getplantdensitymgnt/" + getSelCropId;
        break;
      }
      case 12: {
        finalFetchUrl = finalFetchUrl + "getweedmanagementmgnt/" + getSelCropId;
        break;
      }
      case 13: {
        finalFetchUrl =
          finalFetchUrl + "getdiseasemanagementmgnt/" + getSelCropId;
        break;
      }
      case 14: {
        finalFetchUrl =
          finalFetchUrl +
          "getreprodphasemgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 15: {
        finalFetchUrl =
          finalFetchUrl +
          "getreprodphasemgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 16: {
        finalFetchUrl =
          finalFetchUrl +
          "getreprodphasemgnt/" +
          getSelCropId +
          "/" +
          getSelActivityId;
        break;
      }
      case 17: {
        finalFetchUrl =
          finalFetchUrl + "getharvestingstagemgnt/" + getSelCropId;
        break;
      }
      case 18: {
        finalFetchUrl = finalFetchUrl + "getpostharvestingmgnt/" + getSelCropId;
        break;
      }
      case 19: {
        finalFetchUrl =
          finalFetchUrl + "getstandardizationmgnt/" + getSelCropId;
        break;
      }
      case 20: {
        finalFetchUrl = finalFetchUrl + "getotheractivitymgnt/" + getSelCropId;
        break;
      }
      default: {
        break;
      }
    }
    // console.log(finalFetchUrl);
    return axios.get(finalFetchUrl, { headers: authHeader() });
  }

  updateActivitiesTabData(newData, cropStageId, actID, fieldCropID) {
    // console.log(newData, "_TOSEND___ID__", cropStageId);
    let finalActivitiesPutURL = API_URL;
    if (actID === 1) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updateinsect/";
    } else if (actID === 2) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatenutrient/";
    } else if (actID === 3 || actID === 4) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatelandpreparation/";
    } else if (actID === 5) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatewatermanagement/";
    } else if (actID === 6 || actID === 7 || actID === 8) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatesowing/";
    } else if (actID === 9 || actID === 10) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatecropissues/";
    } else if (actID === 11) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updateplantdensity/";
    } else if (actID === 12) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updateweedmanagement/";
    } else if (actID === 13) {
      finalActivitiesPutURL =
        finalActivitiesPutURL + "updatediseasemanagement/";
    } else if (actID === 14 || actID === 15 || actID === 16) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatereprodphase/";
    } else if (actID === 17) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updateharvestingstage/";
    } else if (actID === 18) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatepostharvestin/";
    } else if (actID === 19) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updatestandardization/";
    } else if (actID === 20) {
      finalActivitiesPutURL = finalActivitiesPutURL + "updateotheractivity/";
    }
    // console.log(finalActivitiesPutURL + cropStageId + "__data", newData);
    return axios.put(finalActivitiesPutURL + cropStageId, newData, {
      headers: authHeader(),
    });
  }

  uploadFarmersList(getStateId, getDistId, getBlockId, data) {
    // console.log(
    //   API_URL +
    //     "uploadfarmer/" +
    //     getStateId +
    //     "/" +
    //     getDistId +
    //     "/" +
    //     getBlockId,
    //   data
    // );
    return axios.post(
      API_URL +
        "uploadfarmer/" +
        getStateId +
        "/" +
        getDistId +
        "/" +
        getBlockId,
      data,
      { headers: authHeader() }
    );
  }
  getAllIndiaStatesList() {
    // console.log("All India State list get URL : ", API_URL + "states");
    return axios.get(API_URL + "states", { headers: authHeader() });
  }
  getSelStatesDistList(selStateID) {
    // console.log(
    //   "All India Sel State's Dist list get URL : ",
    //   API_URL + "districts"
    // );
    return axios.get(API_URL + "districts/" + selStateID, {
      headers: authHeader(),
    });
  }
  getSelStatesDistBlockList(selStateID, selDistId) {
    // console.log(
    //   "All India Sel State's Dist list get URL : ",
    //   API_URL + "blocks"
    // );
    return axios.get(API_URL + "blocks/" + selStateID + "/" + selDistId, {
      headers: authHeader(),
    });
  }
  getSelSubCtgrList(selCtgr) {
    // console.log(
    //   "Sel Category's SubCategory list get URL : ",
    //   API_URL + "subcategory"
    // );
    return axios.get(API_URL + "ip-subcategory-list/" + selCtgr, {
      headers: authHeader(),
    });
  }

  getCategoryList(categorytype) {
    // console.log("Category list get URL : ", API_URL + "category");
    return axios.get(
      API_URL + "ipcategory-list/?categorytype=" + categorytype,
      { headers: authHeader() }
    );
  }

  getUnitList(categorytype) {
    // console.log("Unit list data get URL : ", API_URL + "category");
    return axios.get(API_URL + "ipunit-list/?categorytype=" + categorytype, {
      headers: authHeader(),
    });
  }
  getSellingCropList(){
    return axios.get(HOST_URL + "farmersapi/get_crop_list/" , {
      headers: authHeader(),
    });
  }
  getCommodityCategoryNameDropdown(cropId){
    return axios.get(HOST_URL + "farmersapi/get_crop_list/?category_id=" +cropId , {
      headers: authHeader(),
    });
  }
  inputProductCreate(data) {
    // console.log("API call", data);
    return axios.post(API_URL + "ip-product-create/", data, {
      headers: authHeader(),
    });
  }

  inputProductEdit(productId, data) {
    // console.log("inputProductEdit API call", data);
    return axios.post(API_URL + "ip-product-update/" + productId + "/", data, {
      headers: authHeader(),
    });
  }
  updateNewPassword(userID, newPassword, oldPassword) {
    // console.log(
    //   API_URL + "updatepassword/" + userID,
    //   "____",
    //   oldPassword,
    //   "__",
    //   newPassword
    // );
    //return axios.put(API_URL+"updatepassword/"+userID, test, { headers:authHeader() });
    return axios.put(
      API_URL + "updatepassword/" + userID + "",
      JSON.stringify({
        old_password: oldPassword,
        password: newPassword,
      }),
      { headers: authHeader() }
    );
  }

  getCropAnalytics(value) {
    let getCropAnalyticsAPIUrl =
      "http://vcseed.doordrishti.ai/api/getanlytics?type=crop&value=" +
      value +
      "";
    // console.log(getCropAnalyticsAPIUrl);
    return axios.get(getCropAnalyticsAPIUrl, { headers: authHeader() });
  }

  getInputsList() {
    return axios.get(API_URL + "ip-product-list/", { headers: authHeader() });
  }


  getInputOrdersList(subfpo_Id) {
    return axios.get(API_URL + "order-list/?sub_fpo_id="+ subfpo_Id, { headers: authHeader() });
  }
  getBuyingOrderData() {
    // return axios.get("http://10.91.20.117:8000/api/web/"+ "get_farmer_buying_list/fpo/", { headers: authHeader() });
    return axios.get(API_URL+ "farmer_buying_input_list/fpo/", { headers: authHeader() });

  }
  getNotificationAndReminderCount(){
    return axios.get(API_URL + "get_notification_count/" , { headers: authHeader()} );
  }
  getNotificationList(){
    return axios.get(API_URL + "get_notification_list/?notificationtype=notifications" , { headers: authHeader()} );
  }
  getReminderList(){
    return axios.get(API_URL + "get_notification_list/?notificationtype=reminder" , { headers: authHeader()} );
  }
  getChangeReadStatus(id){
    return axios.get(API_URL + "change_read_status/" + id + "/", { headers: authHeader()} );
  }
  getAllCategoryCount(){
    return axios.get(API_URL + "get_all_category_notification_count/" , { headers: authHeader()} );
  }
  getFarmerNotificationList(data,SplitqueryParamTabValue) {
    return axios.post(API_URL + "get_all_category_notification_list/?category="+SplitqueryParamTabValue, data, {
      headers: authHeader(),
    });
  } 
  getInputBuyOrderNotificationList(data) {
    return axios.post(API_URL + "get_all_category_notification_list/?category=input_orders", data, {
      headers: authHeader(),
    });
  } 
  getCommoditySellOrderNotificationList(data) {
    return axios.post(API_URL + "get_all_category_notification_list/?category=commodity_sell_orders", data, {
      headers: authHeader(),
    });
  }
  getNewUpdateNotificationList(data) {
    return axios.post(API_URL + "get_all_category_notification_list/?category=new_update", data, {
      headers: authHeader(),
    });
  }
  getRemindersList(startDate,endDate){
    return axios.get(API_URL + "get_all_reminders_list/?start_date=" + startDate + "&end_date="+ endDate ,{
      headers: authHeader(),
    });
  }
  
  getAllMonths(){
    return axios.get(API_URL + "get_all_months/" , { headers: authHeader()} );
  }
  // Procurment API's

  getProcurementList(subfpo_Id) {
    return axios.get(API_URL + "procurement-list/?sub_fpo_id="+ subfpo_Id, { headers: authHeader() });
  }
  getCommoditySellingList() {
    return axios.get(API_URL + "farmer_selling_commodity_list/fpo/", { headers: authHeader() });
  }
  getCommodityCategoryList() {
    return axios.get(HOST_URL + "farmersapi/get_cropcategory_list/", { headers: authHeader() });
  }
  createProcurement(data) {
    return axios.post(API_URL + "create-proc/", data, {
      headers: authHeader(),
    });
  }

  procurementEdit(id, data) {
    return axios.post(API_URL + "update-proc/" + id, data, {
      headers: authHeader(),
    });
  }
  UpdateInputOrder(id, data) {
    return axios.post(API_URL + "update-input-order/" + id, data, {
      headers: authHeader(),
    });
  }
  EditSellingOrders( data) {
    return axios.post(HOST_URL + "farmersapi/farmer_buying_input_create/fpo/" , data, {
      headers: authHeader(),
    });
  }
  CreateSellingCommodity( data) {
    return axios.post(HOST_URL + "farmersapi/selling_commodity_create/fpo/" , data, {
      headers: authHeader(),
    });
  }
  UpdatedInterestedFarmers( data,Id) {
    return axios.post(API_URL + "update_interested_farmer/" +Id + "/" , data, {
      headers: authHeader(),
    });
  }

  getProcurementDelete(proc_id, data) {
    return axios.post(API_URL + "update-proc/" + proc_id, data, {
      headers: authHeader(),
    });
  }

  getProcOrderUpdate(id, data) {
    return axios.post(API_URL + "update-proc-order/" + id, data, {
      headers: authHeader(),
    });
  }

  accountingLoginService(data) {
    let accountingPageUrl = "https://api.giddh.com/v2/login-with-password";
    // console.log("urlofaccounting", accountingPageUrl, "____", data);

    return axios.post(accountingPageUrl, data, {
      ContentType: "text/JSON",
    });
  }

  /** Landholding sites editing api call starts */
  doSiteEdit(siteID, payload) {
    return axios.post(API_URL + "editsite/" + siteID + "", payload, {
      headers: authHeader(),
    });
  }
  getIrrigationSource(){
    return axios.get( HOST_URL  + "api/get_irrigation_source_list/", {
      headers: authHeader(),
    });
  }
  getIrrigationTypeList(){
    return axios.get(HOST_URL + "api/get_irrigation_type_list/", {
      headers: authHeader(),
    });
  }
  /** Landholding sites editing api call ends */
  SchedulingCustomizedSMS(data) {
    return axios.post(API_URL + "cusomized-sms", data, {
      headers: authHeader(),
    });
  }

  getMessageHistoryList() {
    return axios.get(API_URL + "custom-message-list/", {
      headers: authHeader(),
    });
  }
 
  getDownloadFarmerTemplate() {
    let headers = authHeader();
    Object.assign(headers, { "Content-Type": "application/xlsx" });
    // console.log(headers);
    return axios.get(API_URL + "download-farmertemplate", {
      headers: headers,
      responseType: "blob",
    });
  }
  ExportFarmerData(data) {
    let headers = authHeader();
    Object.assign(headers, { "Content-Type": "application/xlsx" });
    return axios.post(API_URL + "export-farmer-data/", data, {
      headers: headers,
      responseType: "blob",
    });
  }
  ExportAgronomicActivitiesData(sitedata) {
    let headers = authHeader();
    Object.assign(headers, { "Content-Type": "application/xlsx" });
    return axios.get(API_URL + "export_farmer_crop_activity/?sitecropids=" + sitedata, {
      headers: headers,
      responseType: "blob",
    });
  }
  getCropsListExportData(cropidlist){
    let headers = authHeader();
    Object.assign(headers, { "Content-Type": "application/xlsx" });
    return axios.get(API_URL + "export_farmer_crop_activity/?sitecropids=" + cropidlist, {
      headers: headers,
      responseType: "blob",
    });
  }
  getFPOProfileDetails() {
    return axios.get(API_URL + "fpoprofiledetails/", {
      headers: authHeader(),
    });
  }
  getSpecialServices() {
    return axios.get(HOST_URL + "api/get-special-services-list/?is_fpo=true", {
      headers: authHeader(),
    });
  }
  UpdateCeoDetails(data) {
    return axios.post(API_URL + "update-fpo-profile-details/", data, {
      headers: authHeader(),
    });
  }
  UpdateDirectorDetails(data, id) {
    return axios.post(API_URL + "update-director/" + id + "/", data, {
      headers: authHeader(),
    });
  }
  UpdateBankDetails(data, id) {
    return axios.post(API_URL + "update-bankdetails/" + id + "/", data, {
      headers: authHeader(),
    });
  }
  UpdateContactDetails(data, id) {
    return axios.post(API_URL + "update-contacts/" + id + "/", data, {
      headers: authHeader(),
    });
  }
  AddDirectorDetails(data) {
    return axios.post(API_URL + "create-director/", data, {
      headers: authHeader(),
    });
  }
  UpdateComplianceDetails(data, id) {
    return axios.post(API_URL + "update-compliancescheduler/" + id + "/", data, {
      headers: authHeader(),
    });
  }
  CreateComplainsDetails(data) {
    return axios.post(API_URL + "create-compliancescheduler/", data, {
      headers: authHeader(),
    });
  }
  UpdateBusinessDetails(data, id) {
    return axios.post(API_URL + "update-business/" + id + "/", data, {
      headers: authHeader(),
    });
  }
  CreateBankDetails(data) {
    return axios.post(API_URL + "create-bankdetails/", data, {
      headers: authHeader(),
    });
  }
  CreateBusinessDetails(data) {
    return axios.post(API_URL + "create-business/", data, {
      headers: authHeader(),
    });
  }
  CreateContactDetails(data) {
    return axios.post(API_URL + "create-contacts/", data, {
      headers: authHeader(),
    });
  }

  getComplianceHistoryList() {
    return axios.get(API_URL + "get_compliancehistory/", {
      headers: authHeader(),
    });
  }
  CreateComplianceTicket(data) {
    return axios.post(API_URL + "create-complianceticket/", data, {
      headers: authHeader(),
    });
  }
  
  celeryStatus(jobId) {
    return axios.get(API_URL + "get-celery-status?jobId="+jobId, {
      headers: authHeader(),
    });
  }

  getFpoFeedData(viewType,sub_fpo_id) {
    return axios.get(API_URL + "cattlefeedview/"+viewType + "?sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
  }
  getTentitaveOutputList(viewType,sub_fpo_id) {
    return axios.get(API_URL + "tentativeoutput/"+viewType + "?sub_fpo_id="+ sub_fpo_id, {
      headers: authHeader(),
    });
  }
  
  getVillageFeedData(viewType, cattleType, product, brand,subfpoId) {
    return axios.get(API_URL + "cattlefeedview/"+viewType + "?cattleType="+ cattleType + 
      "&productName="+ product + "&brandName=" + brand + "&sub_fpo_id=" +subfpoId, {
      headers: authHeader(),
    });
  }
  getTentativeVillageFeedData(viewType, villageDate, villageTentId, villageTentSeason,villageTentVerified,subfpoId) {
    return axios.get(API_URL + "tentativeoutput/"+viewType + "?date_range="+ villageDate + 
      "&crop_id="+ villageTentId + "&season=" + villageTentSeason +  "&is_verified="+ villageTentVerified + "&sub_fpo_id=" +subfpoId, {
      headers: authHeader(),
    });
  }

  getTentativeFarmerFeedData(viewType,FrmrDate, FrmrId, 
    FrmrSeason, FrmrVeri,FrVillage,subfpoId) {
    return axios.get(API_URL + "tentativeoutput/"+viewType + "?date_range="+ FrmrDate + 
      "&crop_id="+ FrmrId + "&season=" + FrmrSeason +  "&is_verified="+ FrmrVeri +"&village="+ FrVillage +"&sub_fpo_id=" +subfpoId, {
      headers: authHeader(),
    });
  }




  
  getVillageFarmerFeedData(viewType, cattleType, product, brand, village,subfpoId) {
    // console.log(API_URL + "cattlefeedview/"+viewType + "?village="+village +"&cattleType="+ cattleType + 
    // "&productName="+ product + "&brandName=" + brand)
    return axios.get(API_URL + "cattlefeedview/"+viewType + "?village="+village +"&cattleType="+ cattleType + 
      "&productName="+ product + "&brandName=" + brand +"&sub_fpo_id=" +subfpoId, {
      headers: authHeader(),
    });
  }
  
  getParentBoInputCropComponent(season, year, isVerified, month) {
    return axios.get(
    
      API_URL +
        "parent_crop_components/" +
        season +
        "/" +
        year +
        "/" +
        isVerified +
        "?aggregation_level=month_components" +
       
        "&required_month=" +month
        ,
      { headers: authHeader() }
    );
  }

  VerifyMobileNumber(data) {
    // console.log("data",data)
      // return axios.post("https://utildev.doordrishti.ai/send-otp/",data, {
        return axios.post(API_URL + "check_mobile_exist/" ,data ,{
          headers: authHeader(),
        });
  }
  VerifyOtpNumber(data) {
    // console.log("data",data)
      return axios.post( COMM_URL + "verify-otp/",data, {

      headers: authHeader(),
    });
  }


  destroyGiddhSession(data) {
      return axios.get( API_URL + "destroy_giddh_session_token/?giddhtoken="+data, {
      headers: authHeader(),
    });
  }

  MarkAsAllRead(SplitqueryParamTabValue){
    return axios.get( API_URL + "mark_all_as_read/?category="+SplitqueryParamTabValue, {
      headers: authHeader(),
    });
  }

  MarkHomeNotificationsAsAllRead(SplitqueryParamTabValue,homenotification){
    return axios.get( API_URL + "mark_all_as_read/?category="+SplitqueryParamTabValue+"&home="+homenotification, {
      headers: authHeader(),
    });
  }
  getFarmerDetail(farmerId){
    return axios.get( API_URL + "get-farmer-details/" + farmerId + "/", {
      headers: authHeader(),
    });
  }

  
  getFPOsServices(){
    return axios.get( API+ "get-special-services-list/?is_fpo=true", {
      headers: authHeader(),
    });
  }

  AddFIGDetails(data) {
    return axios.post(API_URL + "create-fig/", data, {
      headers: authHeader(),
    });
  }
  UpdateFIGDetails(data, id) {
    return axios.post(API_URL + "update-fig/" + id + "/", data, {
      headers: authHeader(),
    });
  }

  getCategory() {
    return axios.get(API + "get-caste-fig-list/", {
      headers: authHeader(),
    });
  }



}

export default new UserService();
