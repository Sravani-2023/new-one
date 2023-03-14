import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/landholding.css";
import "../assets/css/inputproducts.css";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { Row, Col, Modal, Table, Button, Form, Container,Tooltip, OverlayTrigger,Carousel} from "react-bootstrap";
import ImageNotAvailable from "../assets/img/ImageNotAvailable.png";
import axios from 'axios';
import NestedTable from './nestedTable.component';
import { TriggerAlert,AlertMessage } from './dryfunctions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

import {
  faMap,

  faHome,
  faCaretRight,
  faSave,faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { Select } from "@material-ui/core";
import tractor_moving from "../assets/img/tractor_moving.gif";
import noImageFpo from "../assets/img/noImageFpo.jpg";

import AuthService from "../services/auth.service";

// get executed on adding new commodity and editing any commodity inside a Popup . 
// To make modal Complete dynamic looping over an array and passing the specific parameters.
function initTradeParamsCreation(){
    
    let initParams = ["Commodity *", "Procurement Start Date*","Procurement End Date*", "Price (₹/ Quintal) *", "Mode of Payment", 
    "Date of Payment", "Delivery Location", "Bag Size", "Bag Weight", "Minimum Traded Quantity"]
    let initParamObjs = []
    var i;
    for(i = 0; i < initParams.length; i++){
        let item = {"parameters":"", "specifications": "", "remarks": "", "active": true}
        item.parameters = initParams[i]
        initParamObjs.push(item)
    }
    return initParamObjs
}
// get executed on adding new commodity and editing any commodity inside a Popup . 
// To make modal Complete dynamic looping over an array and passing the specific parameters.

function initQualityParamsCreation(){
    
    let initParams = ["Moisture", "Foreign Matter", "Discoloured, Damaged, Broken, Shrivelled seed%", 
        "Oil Content", "Seed weight", "Other edible seeds"]
    let initParamObjs = []
    var i;
    for(i = 0; i < initParams.length; i++){
        let item = {"parameters":"", "specifications": "", "remarks": "", "active": true}
        item.parameters = initParams[i]
        initParamObjs.push(item)
    }
    return initParamObjs
}
  // On clicking on Save Button inside a popup before posting form data it will check Date Validation .Have used regix to check valid date 
  // will return true if date is valid and proceed else will stop the procedure.
  // Required format is YYYY-MM-DD
function isValidDateFormatOrNot(date){

  let validDateRegEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
 
  if (validDateRegEx.test(date)) {
    return true;
  } else {
    return false;
  }
};
// On clicking on Save Button inside a popup before posting form Price it will check Price Validation .Have used regix to check valid Price 
  // will return true if date is valid and proceed else will stop the procedure.
  // Required format is numeric Value.
function isValidPriceFormatOrNot(price){

  let validDateRegEx = /^[0-9]*$/;
 
  if (validDateRegEx.test(price)) {
    return true;
  } else {
    return false;
  }
};

export default class ProcurementList extends Component {
  constructor(props) {
    super(props);
    // binding all the function with this
    this.checkboxChange = this.checkboxChange.bind(this);
    this.changeParameter = this.changeParameter.bind(this);
    this.changeSpecification = this.changeSpecification.bind(this);
    this.changeRemarks = this.changeRemarks.bind(this);
    // this.enableEdit = this.enableEdit.bind(this)
    this.savingProc = this.savingProc.bind(this);
    this.otherParams = this.otherParams.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.saveUpdates = this.saveUpdates.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeRemarks = this.onChangeRemarks.bind(this);
    this.setActionMessageWindowStatus =
      this.setActionMessageWindowStatus.bind(this);
    this.wrapper = React.forwardRef();

    this.fileUploadProcessMessage = {
      message: "",
      messageType: "",
    };
  // in state have defined all the variables which r used in a this.component.
    this.state = {
      procurementlist: [],
      loading: false,
      modalIsOpen: false,
      selectedProcDetails: [],
      selectedQualityDetails: [],
      isProcEdit: false,
      isProcCreating: false,
      selectednameSpec: "",
      selecteddateSpec: "",
      selectedpriceSpec: "",
      selectedProcId: -1,
      isProcEditing: false,
      uploadedFileMessage: this.fileUploadProcessMessage,
      selectedInputImg: null,
      isFileFormatValid: true,
      ImgUploadedStatus: false,
      otherParamObjs: [],
      otherQualityObjs: [],
      createmodalIsOpen: false,
      initParamsList: initTradeParamsCreation(),
      initQualityList: initQualityParamsCreation(),
      showloader: true,
      isNameerror: false,
      isSpecerror: false,
      selectedEnddateSpec: "",
      showendError: "",
      isProcEnderror: false,
    

      isDateerror: false,
      dateError: "",
      PriceError: "",
      triggeredActive: false,
      updateModalshow: false,
      updateModalClose: true,
      selectedOrderStatus: "",
      selectedOrderRemarks: "",
      selectedOrderchooseDate: "",
      selectedfarmerName: "",
      selectedfarmerPhone: "",
      selectedfarmerVillage: "",
      selectedOrderId: "",
      remarks: "",
      isOrderEdit: false,
      isOrderUpdating: false,
      floatingAlertWindowStatus: false,
      initialOrderStatus: "",
      initialOrderRemarks: "",
      initialOrderExecDate: "",
      updateremarksclass: "",
      UpdateState:[],
      updatedateclass:"",
      isDisableEdit:true,
     
      logged_supervisor:"",
      accessed_supervisor:"",
      isParentLogged: false,
      currentFpo:"",
      activeTabCommodity:"Fpo Listed",
      commoditySellingList:[],
      commoditySellingListDuplicate:[],

      fullImageOpen:false,
      sellingImageOne:"",
      sellingImageTwo:"",
      commoditiesSellingEditOpen:false,
      selectedCommodityYear:"",
      selectedCommoditystatus:"all",
      commoditySellingFrmer:"",
      commoditySellingPhone:"",
      commoditySellingVillage:"",
      getCommodityCategoryList:[],
      CommodityCategoryListDropdownValue:"",
      getCommodityNameDropdownList:[],
      CommodityCategoryNameDropdownValue:"",
      CommoditysellingOfferedPrice:"",CommoditysellingOfferedPriceClass:"",
      CommoditysellingExeDateClass:"",CommoditysellingExeDate:"",
      CommoditysellingLocationclass:"",CommoditysellingLocation:"",
      CommoditysellingStatusClass:"",CommoditysellingStatus:"",
      CommoditysellingRemarksClass:"",CommoditysellingRemarks:"",
      DisableFieldsCommoditysellingStatus:"",selectedunitvalueSelling:"",
      selectedunitvalueclass:"UnitClass",offeredQuantityclass:"startOfferedQuantityClass",unitlist:[],
      tabSearchValue:"",
      tabNameFilter:"",
      dateRanges : []


      // startDate: moment().format("YYYY-MM-DD")
    };
  }
  setActionMessageWindowStatus = (currStatus) => {
    this.setState({
      floatingAlertWindowStatus: currStatus,
    });
  };
  handleUnitChangeSelling = (e) => {
    this.setState({
      selectedunitvalueSelling: e.target.value,
      selectedunitvalueclass:"UnitClass"
    });
  };
  showUnitList = (unitlist) =>
    unitlist.length
    ? unitlist.map((data) => (
        <option key={data.id} name={data.unit_name} value={data.id}>
          {data.unit_name}
        </option>
      ))
    : "";
  appendMessageData(msg, type) {
    this.fileUploadProcessMessage.message = "";
    this.fileUploadProcessMessage.messageType = "";
    this.fileUploadProcessMessage.message = { msg };
    this.fileUploadProcessMessage.messageType = { type };
    this.setState({
      uploadedFileMessage: this.fileUploadProcessMessage,
      isCropCreating: false,
    });
  }
  navigateMainBoard = () => {
    const {isParentLogged} = this.state
    // console.log("in navigateMainBoard------isParentLogged", isParentLogged)
    if(isParentLogged){
      this.props.history.push("/fpohomeData");
    }
    else{
      this.props.history.push("/dashboard");
    }
  }
  // after loading d page ComponentDidMount is called.Here used UserService to get the api data.While taking response we r checking condition also
  // if data coming from api is 0 then will display message else will show the required data.
  componentDidMount() {
    var flag = false;
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({ isParentLogged:true ,currentFpo: this.props.match.params.fpoName })
    }
    this.setState({
      accessed_supervisor:fpoId,
      logged_supervisor: user.user_id
    })
    if( this.props.location.search!="")
    {
      let queryParam= this.props.location.search;
      console.log("web params22", queryParam);
      let SplitqueryParam= queryParam.split("&");
      console.log("web params34", SplitqueryParam);
      let SplitqueryParamTabValue= SplitqueryParam[1];
     

        let SplitqueryParamSearchValue= SplitqueryParam[2];

     
      let SplitqueryParamEndValue= SplitqueryParamSearchValue.split("=")[1];
      let SplitqueryTabValue= SplitqueryParamTabValue.split("=")[1];

      console.log("web params67", SplitqueryParamEndValue,"  ",SplitqueryTabValue);
      this.setState({
        tabSearchValue:SplitqueryParamEndValue,
        tabNameFilter:SplitqueryTabValue,
      })
      
    }
   
    UserService.getProcurementList(fpoId).then(
      (response) => {
        flag = true;
        // console.log("getProcurementList", response);
        if (response.data.success) {
          if (response.data.data.length == 0) {
            this.setState({ showloader: false ,
          });
          } else if (response.data.data.length > 0) {
            let filteredData=[];
            if(((this.props.location.search!="")&&( this.state.tabNameFilter==="fpo-listed-commodity")))
            { 
              console.log("enter100")
              //  filteredData=response.data.data.proc_order_details.filter((item)=> item.transaction_id===this.state.tabSearchValue)
             
              //  this.state.tabSearchValue)
              var result = [];
              response.data.data.forEach((item)=>{
              const comp={...item}
              console.log("component",comp)
             
             if(Array.isArray(comp.proc_order_details)) {
              comp.proc_order_details = comp.proc_order_details.filter((subMenu)=> {
              return subMenu.transaction_id === this.state.tabSearchValue ;
            });
      
            if( comp.proc_order_details.length > 0) {
              result.push(comp);
              console.log("result",result)
              filteredData=result
            }
            }







          })



              console.log("enter99",filteredData)
              this.setState({
                activeTabCommodity: "Fpo Listed"
              })
              
            }
            else{
              filteredData=response.data.data
            }
            this.setState({
              procurementlist: filteredData,
              showloader: false,
             
            });
          }
        }
      },
      // if api is returning error We r displaying error message.
      (error) => {
        flag = true;
        this.setState({
          showloader: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert("Error", error.response.data.message, "error");
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      },
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.navigateMainBoard()
        }
      }, 30000)
    );
    UserService.getCommoditySellingList(fpoId).then(
      (response) => {
        flag = true;
        console.log("getCommodityList", response);
        if (response.data.success) {
          if (response.data.data.length == 0) {
            this.setState({ showloader: false ,
          });
       
          } else if (response.data.data.length > 0) {
            let filteredData=[];
            if(((this.props.location.search!="")&&( this.state.tabNameFilter==="commodity-selling-interest")))
            { 
              console.log("enter1",this.state.tabSearchValue)
               filteredData=response.data.data.filter((item)=>item.ticketid===this.state.tabSearchValue)
              //  this.state.tabSearchValue)
              console.log("enter3",filteredData)
              this.setState({
                activeTabCommodity: "Commodity Selling"
              })
            }
            else{
              filteredData=response.data.data
            }
            this.setState({
              // commoditySellingList: response.data.data,
              // commoditySellingListDuplicate:response.data.data,
              commoditySellingList: filteredData,
              commoditySellingListDuplicate:response.data.data,
              showloader: false,
             
            },()=>this.FiltersHandlingCommoditySelling(filteredData,"all","all"));
          }
        }
      },
      (error) => {
        flag = true;
        this.setState({
          // showloader: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert("Error", error.response.data.message, "error");
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      },
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.navigateMainBoard()
        }
      }, 30000)
    );
    UserService.getCommodityCategoryList().then(
      (response) => {
        flag = true;
        console.log("getCommodityCategoryList", response);
        if (response.data.success) {
         
       
      
            this.setState({
              getCommodityCategoryList: response.data.data,
             
             
            });
          }
        },
      
      (error) => {
        flag = true;
        this.setState({
          // showloader: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert("Error", error.response.data.message, "error");
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      },
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.navigateMainBoard()
        }
      }, 30000)
    );
    UserService.getYearRanges().then(
      (response) => {
          flag = true;
          console.log("res",response.data.date_ranges)
        
          this.setState({
              
              dateRanges: response.data.date_ranges,
              showloader: false,
          });
         console.log("dateRanges",this.state.dateRanges)
      },
      (error) => {
          flag = true;
          this.setState({
              // showloader: false,
              content:
                  (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                  error.message ||
                  error.toString(),
          });
          if (error.response) {
              TriggerAlert("Error", error.response.data.message, "error");
          } else {
              TriggerAlert(
                  "Error",
                  "Server closed unexpectedly, Please try again",
                  "error"
              );
          }
      },
      setTimeout(() => {
          if (flag == false) {
              this.setState({
                  showloader: false,
              });
              TriggerAlert("Error", "Response Timed out, Please try again", "info");
              this.navigateMainBoard()
          }
      }, 30000)
  );

  }
  FiltersHandlingCommoditySelling=(IterateList,CommodityYear,Commoditystatus)=>{
    // console.log("CommodityYear ",CommodityYear,"Commoditystatus ",Commoditystatus)
    let filterListYear=IterateList;
    if(CommodityYear!="all"){
    let compareYear=CommodityYear.split('-');
     filterListYear=IterateList.filter((product)=>{
        let createdDate=product.created_at.slice(0, 4)
        return createdDate==compareYear[0]
    })
  }
    let filterListStatus=filterListYear.filter((product)=>{
       if(Commoditystatus==="all")
       return product
       else
      return product.order_status==Commoditystatus
  })
  this.setState({
    commoditySellingList:filterListStatus,
    selectedCommodityYear:CommodityYear,
    selectedCommoditystatus:Commoditystatus

  })
 

  }
// this function is basically used for Updating the status.Here we r sending data to the backened regarding the status.
// On click on IS Active icon this function will get triggered
  procurementStatusUpdate(Id, status) {
    this.setState({ triggeredActive: true });
    // console.log(Id, status);
    let value = "";
    if (status === "De-Activate") {
      value = false;
    } else {
      value = true;
    }
    const data = new FormData();
    data.append("is_available", value);
    UserService.procurementEdit(Id, data).then((response) => {
      // console.log(response);
      if (response.data.success) {
        this.setState((prevState) => ({
          procurementlist: prevState.procurementlist.filter(
            (el) => el.id != response.data.data[0].id
          ),
        }));
        var procList = this.state.procurementlist;
        procList.unshift(response.data.data[0]);
        this.setState({
          procurementlist: procList,
          triggeredActive: false,
        });
      }
    });
  }
  // On click on dustbin icon this function will get triggered .Sending data to backend using UserService.
  ProcurementDelete(e) {
    const data = new FormData();
    data.append("is_archived", "true");
    UserService.getProcurementDelete(e, data).then(
      this.setState((prevState) => ({
        procurementlist: prevState.procurementlist.filter((el) => el.id != e),
      }))
    );
  }
  //on click on edit button inside popup this function is triggered.this will allow user to edit the things in a popup.
  enableEdit(value) {
    // console.log("coming")
    this.setState({
      isProcEdit: !value,
      isDisableEdit:!this.state.isDisableEdit,
    });
  }
  changeParameter = (i, detail, e, _type) => {
    detail.parameters = e.currentTarget.textContent;
    let stateEntity = "selectedProcDetails";
    if (_type === "trade") {
      stateEntity = "selectedProcDetails";
    } else if (_type === "quality") {
      stateEntity = "selectedQualityDetails";
    } else if (_type === "tradeOthers") {
      stateEntity = "otherParamObjs";
    } else if (_type === "qualityOthers") {
      stateEntity = "otherQualityObjs";
    }
    let selectedStateEntityObjs = [...this.state[stateEntity]]; // create the copy of state array
    selectedStateEntityObjs[i] = detail; //new value
    this.setState({ [stateEntity]: selectedStateEntityObjs });
  };
  // this function is not allowing user to edit anything in a popup until click on Edit button.
  disableEditing=(data)=>{
    // console.log("ISdISABLE",this.state.isDisableEdit)
    // console.log("data",data)
     if(this.state.isDisableEdit==true)
     {
      //  console.log("a")
       return false;
     }
     else{
       if(data==true)
       {
        // console.log("b")
         return true;
       }
       else {
        // console.log("c")
       return false;
       }
     }
  }
  // this function is not allowing user to edit parameters in popup.
  disableEditingParams=()=>{
    // console.log("new",this.state.isDisableEdit)
    // console.log("data",data)
     if(this.state.isDisableEdit==true)
     {
      //  console.log("new2",this.state.isDisableEdit)
       return true;
     }
     else{

    return false
  }
  }
  //here we are iterating over specification column and according to the parameters value we are checking the conditions.
  // we are giving validations also in this .
  changeSpecification = (i, detail, e, _type) => {
    if(detail.parameters==="Procurement Date*" || detail.parameters==="Procurement End Date*"|| detail.parameters==="Procurement Start Date*")
    {
      detail.specifications = e.target.value;
      // console.log("e",e.target.value)

    }
  
    else{
    detail.specifications = e.currentTarget.textContent;
    }
    let stateEntity = "selectedProcDetails";

    if (_type === "trade") {
      stateEntity = "selectedProcDetails";
      if (detail.parameters === "Commodity *") {
        this.setState({
          selectednameSpec: e.currentTarget.textContent.trim(),
          isNameerror: false,
        });
      } else if (detail.parameters === "Procurement Date*" || detail.parameters === "Procurement Start Date*") {
        if (isValidDateFormatOrNot(e.target.value)) {

          this.setState({
            selecteddateSpec: e.target.value,
            isSpecerror: false,
            dateError: "",
          });
        } else {
          this.setState({
            selecteddateSpec: "",
            isSpecerror: true,
            dateError: "Enter date ",

            // dateError: "Enter date in valid format YYYY-MM-DD",
          });
        }
      } 
      else if (detail.parameters === "Procurement End Date*") {
        if (isValidDateFormatOrNot(e.target.value)) {

          this.setState({
            selectedEnddateSpec: e.target.value,
            isProcEnderror: false,
            showendError: "",
          });
        } else {
          this.setState({
            selectedEnddateSpec: "",
            isProcEnderror: true,
            showendError: "Enter End date ",

            // dateError: "Enter date in valid format YYYY-MM-DD",
          });
        }
      } 

    








    
      
      
      
      else if (detail.parameters === "Price (₹/ Quintal) *") {
        if (isValidPriceFormatOrNot(e.currentTarget.textContent)) {
          this.setState({
            selectedpriceSpec: e.currentTarget.textContent,
            isDateerror: false,
            PriceError: "",
          });
        } else {
          this.setState({
            selectedpriceSpec: "",
            isDateerror: true,
            PriceError: "Enter Numeric Value Only",
          });
        }
      }
      else if (detail.parameters === "Bag Size" || detail.parameters === "Bag Weight" || detail.parameters === "Minimum Traded Quantity") {
        if (isValidPriceFormatOrNot(e.currentTarget.textContent)) {
          this.setState({
            selectedpriceSpec: e.currentTarget.textContent,
            isDateerror: false,
            PriceError: "",
          });
        } else {
          this.setState({
            selectedpriceSpec: "",
            isDateerror: true,
            PriceError: "Enter Numeric Value Only",
          });
        }
      }
    } else if (_type === "quality") {
      stateEntity = "selectedQualityDetails";
    } else if (_type === "tradeOthers") {
      stateEntity = "otherParamObjs";
    } else if (_type === "qualityOthers") {
      stateEntity = "otherQualityObjs";
    }
    let selectedStateEntityObjs = [...this.state[stateEntity]]; // create the copy of state array
    selectedStateEntityObjs[i] = detail; //new value
    this.setState({ [stateEntity]: selectedStateEntityObjs });
  };
 // here we are iterating over the remarks column in a popup and accordinly we are setting the values.
  changeRemarks = (i, detail, e, _type) => {
    let stateEntity = "selectedProcDetails";

    detail.remarks = e.currentTarget.textContent;
    if (_type === "trade") {
      stateEntity = "selectedProcDetails";
    } else if (_type === "quality") {
      stateEntity = "selectedQualityDetails";
    } else if (_type === "tradeOthers") {
      stateEntity = "otherParamObjs";
    } else if (_type === "qualityOthers") {
      stateEntity = "otherQualityObjs";
    }
    let selectedStateEntityObjs = [...this.state[stateEntity]]; // create the copy of state array
    selectedStateEntityObjs[i] = detail; //new value
    this.setState({ [stateEntity]: selectedStateEntityObjs });
  };
  // this checkbox field is for enabling and disabling the checkbox column in a popup.
  checkboxChange = (i, detail, e, _type) => {
    let stateEntity = "otherQualityObjs";

    detail.active = e.target.checked;
    if (_type === "trade") {
      stateEntity = "selectedProcDetails";
    } else if (_type === "quality") {
      stateEntity = "selectedQualityDetails";
    } else if (_type === "tradeOthers") {
      stateEntity = "otherParamObjs";
    } else if (_type === "qualityOthers") {
      stateEntity = "otherQualityObjs";
    }
    let selectedStateEntityObjs = [...this.state[stateEntity]]; // create the copy of state array
    selectedStateEntityObjs[i] = detail; //new value
    this.setState({ [stateEntity]: selectedStateEntityObjs });
  };
  // here we are checking validation of file uploaded as it will take only .jpg or .png file.
  validateFileUploaded = (event) => {
    let file = event.target.files[0];
    let size = 0;
    // let allowedFormat = "image"
    let err = "";
    if (file.size === size) {
      err = file.type + "is empty, please upload a file with data\n";
      return {
        status: false,
        msg: err,
        msgType: "error",
      };
      //toast.error(err);
    }
    if (!file["type"].includes("image")) {
      err =
        file.name +
        " is not the Image, please upload only '.jpg or .png' files\n";
      this.setState({
        isFileFormatValid: false,
      });
      return {
        status: false,
        msg: err,
        msgType: "error",
      };
    } else {
      this.setState({
        isFileFormatValid: true,
      });
      return {
        status: true,
        msg: "File is in right format!",
        msgType: "success",
      };
    }
  };
  //here we r appending file upload .
  setSelectedImgToState = (event) => {
    var file = event.target.files[0];
    let fileValidateResults = this.validateFileUploaded(event);
    let fileValidateResultStatus = fileValidateResults.status;
    let fileValidateResultMsg = fileValidateResults.msg;
    let fileValidateResultMsgType = fileValidateResults.msgType;
    if (fileValidateResultStatus) {
      // if return true allow to setState
      this.appendMessageData(fileValidateResultMsg, fileValidateResultMsgType);
      this.setState({
        selectedInputImg: file,
        ImgUploadedStatus: true,
      });
    } else {
      this.appendMessageData(fileValidateResultMsg, fileValidateResultMsgType);
      this.setState({
        ImgUploadedStatus: false,
      });
    }
  };
// here we r creating a dynamic rows in a popup on click on ADD new parameters.
  otherParams = (_type) => {
    let item = {
      parameters: "",
      specifications: "",
      remarks: "",
      active: true,
    };
    let stateEntity = "otherParamObjs";
    if (_type === "trade") {
      stateEntity = "otherParamObjs";
    } else {
      stateEntity = "otherQualityObjs";
    }
    this.setState({
      [stateEntity]: [...this.state[stateEntity], item],
    });
  };
// here we r deleting the dynamic created rows by the user.
  handleErase = (i, _type) => {
    if (_type === "tradeOthers") {
      let { otherParamObjs } = this.state;
      otherParamObjs.splice(i, 1);
      this.setState({ otherParamObjs: otherParamObjs });
    } else if (_type === "qualityOthers") {
      let { otherQualityObjs } = this.state;
      otherQualityObjs.splice(i, 1);
      this.setState({ otherQualityObjs: otherQualityObjs });
    }
  };
  // on click on save button inside a popup this function is called and we r checking validations and the mandatory fields conditions and
  // accordinly displaying an alert message and then sendian a data to the backend.
  savingProc = () => {
    this.setState({
      isProcEditing: true,
      isProcCreating: true,
    });

    const {
      otherParamObjs,
      selectedProcDetails,
      selectedQualityDetails,
      otherQualityObjs,
      selectednameSpec,
      selecteddateSpec,
      selectedpriceSpec,
      isNameerror,
      isSpecerror,
      isDateerror,
      PriceError,
      isProcEnderror,
      selectedEnddateSpec
    } = this.state;
    let error = false;
    console.log("selectedEnddateSpec",selectedEnddateSpec,"selecteddateSpec",selecteddateSpec)
    
    if (!selectednameSpec) {
      error = true;
      this.setState({ isNameerror: true });
    }

    if (!selecteddateSpec) {
      error = true;
      this.setState({ isSpecerror: true });
    }
    console.log("check4",isSpecerror)


    if (!selectedpriceSpec) {
      error = true;
      this.setState({ isDateerror: true });
    }
    if (!selectedEnddateSpec) {
      error = true;
      this.setState({ isProcEnderror: true });
    }
    if (selectedpriceSpec == 0) {
      error = true;
      this.setState({ isDateerror: true ,PriceError: "Must be greater than 0"});
    }

    if (error) {
      // alert(
      //   "Mendatory Fields should not be Empty & should be in correct format"
      // );
      AlertMessage("Mendatory Fields should not be Empty & should be in correct format","warning");

      this.setState({
        isProcEditing: false,
        isProcCreating: false,
      });
      return null;
    }
    const trimdObjs = otherParamObjs.filter(function (othobj) {
      return othobj.parameters !== "";
    });
    const trimdtradeObjs = selectedProcDetails.filter(function (othobj) {
      return othobj.parameters && othobj.parameters !== "";
    });

    const trimdqualObjs = otherQualityObjs.filter(function (othobj) {
      return othobj.parameters !== "";
    });
    const trimdqualityObjs = selectedQualityDetails.filter(function (othobj) {
      return othobj.parameters && othobj.parameters !== "";
    });

    const finaltradeParams = [...trimdtradeObjs, ...trimdObjs];
    const finalqualityParams = [...trimdqualityObjs, ...trimdqualObjs];
    const data = new FormData();
    data.append("namespec", selectednameSpec);
    data.append("datespec", selecteddateSpec);
    data.append("end_datespec", selectedEnddateSpec);

    data.append("pricespec", selectedpriceSpec);
    data.append("details", JSON.stringify(finaltradeParams));
    data.append("qualityDetails", JSON.stringify(finalqualityParams));
    const currFileTypeStatus = this.state.isFileFormatValid;
    const currFileSelectionStatus = this.state.ImgUploadedStatus;
    if (this.state.selectedProcId > 0 && this.state.isProcEdit) {
      if (this.state.selectedInputImg) {
        data.append("proc_Image", this.state.selectedInputImg);
      }
      var flag = false;
      UserService.procurementEdit(this.state.selectedProcId, data).then(
        (response) => {
          flag = true;
          if (response.data.success) {
            this.setState((prevState) => ({
              procurementlist: prevState.procurementlist.filter(
                (el) => el.id != response.data.data[0].id
              ),
            }));
            var procList = this.state.procurementlist;
            procList.unshift(response.data.data[0]);
            this.setState({
              procurementlist: procList,
              modalIsOpen: false,
              isDisableEdit:true,
              isProcEdit: false,
              isProcEditing: false,
              isProcCreating: false,
              otherParamObjs: [],
              otherQualityObjs: [],
              selectednameSpec:"",
              selecteddateSpec:"",
              selectedpriceSpec:"",
              selectedEnddateSpec:"",
              isProcEnderror:false
            });
          }
        },
        (error) => {
          flag = true;
          this.setState({
            modalIsOpen: false,
            isProcEdit: false,
            isProcEditing: false,
            isProcCreating: false,
            isProcEnderror:false,

            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
          if (error.response) {
            TriggerAlert("Error", error.response.data.message, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.navigateMainBoard()
          }
        }, 30000)
      );
    } else {
      data.append("is_available", true);
      if (this.state.selectedInputImg) {
        data.append("proc_Image", this.state.selectedInputImg);
      }
      flag = false;
      UserService.createProcurement(data).then(
        (response) => {
          flag = true;
          // console.log(response);
          var procList = this.state.procurementlist;
          procList.unshift(response.data.data[0]);
          this.setState({
            procurementlist: procList,
            createmodalIsOpen: false,
            isProcEdit: false,
            isProcEditing: false,
            isProcCreating: false,
            otherParamObjs: [],
            otherQualityObjs: [],
            initParamsList: initTradeParamsCreation(),
            initQualityList: initQualityParamsCreation(),
            selectednameSpec:"",
            selecteddateSpec:"",
            selectedpriceSpec:"",
            selectedEnddateSpec:"",
            isProcEnderror:false

          });
          this.appendMessageData("", "");
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.message, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            createmodalIsOpen: false,
          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.navigateMainBoard()
          }
        }, 30000)
      );
    }
  };
  // this function is taking to different component on click.
 
  // in nested table we r setting status value .i.e on click on a row we will find nested materail table and on click on update status button 
  // a popup will be displayed there we r setting status.
  onChangeStatus = (e) => {
    this.setState({ selectedOrderStatus: e.target.value });
  };
   // in nested table we r setting date value .i.e on click on a row we will find nested materail table and on click on update status button 
  // a popup will be displayed there we r setting date.
  onChangeDate = (e) => {
    this.setState({ selectedOrderchooseDate: e.target.value,updatedateclass:"" });
  };
   // in nested table we r setting remarks value .i.e on click on a row we will find nested materail table and on click on update status button 
  // a popup will be displayed there we r setting remarks and remarks are only mandatory when we have choosed rejected or failed to delivery.
  onChangeRemarks = (e) => {
    // var remarks = this.state.selectedOrderRemarks
    // remarks = remarks + "\n" + e.target.value
    this.setState({
      remarks: e.target.value,
      updateremarksclass: "",
    });
  };
  //  handleOption1 function reflect data in a dropdown based on value coming from backend.This function will get triggered
  //  inside a Update Status popup.On click on UpdateStatus pop will be displayed and in a dropdown option values will come accordingly.
  handleOption1 = (data) => {
    if (data === "Pending") {
      return ["Pending","Accepted", "Rejected"];
    } else if (data === "Accepted") {
      return ["Accepted","Completed", "Failed to Delivery"];
    }
     else if (data === "Completed") {
        return [ "Completed"];
    }
     else if (data === "Rejected") {
       return [ "Rejected"];
    }
     else if(data=="Failed to Delivery")  {
      return ["Failed to Delivery"];
     }
     else{
        return ["NA"];
     }
  };
    // addValidation is basically checking Validation of UpdateStatus popup.On click on Save changes inside popup this function will
    //   get triggered .
  
  // Have used setTimeout function to reflect the mandatory boxes color for a period of Time.
    
  addValidation = () => {
    let errors = false;
    
    if (this.state.selectedOrderStatus ==="Rejected"||this.state.selectedOrderStatus ==="Failed to Delivery") {
    
      if (this.state.remarks == "") {
        errors = true;
        this.setState({
          updateremarksclass: "requiredinputfields",
        });
            setTimeout(() => {
    this.setState({
          updateremarksclass: "",
        });
}, 5000)


        
      }
    }
   if(this.state.selectedOrderStatus==="Accepted")
   { 
    
      if (this.state.selectedOrderchooseDate ==null) {
        
        
        errors = true;
        this.setState({
          updatedateclass: "requiredinputfields",
        });
         setTimeout(() => {
    this.setState({
          updatedateclass: "",
        });
}, 5000)

      }
   }
    if (errors == false) {
      this.setState({ errorremarksmessage: "" });
      return true;
    } else {
     
      this.setState({
        errorremarksmessage: "Required fields must be filled",
      });
      return false;
    }
  };
  // On click on Save Changes inside a popup saveUpdates is called.Inside it we r checking validations and if condition is true sending
  // data else it will display an error message.
  saveUpdates = () => {
   
    const {
      selectedOrderStatus,
      selectedOrderRemarks,
      selectedOrderchooseDate,
      selectedfarmerName,
      selectedfarmerPhone,
      selectedfarmerVillage,
      selectedOrderId,
      remarks,
      initialOrderStatus,
      initialOrderRemarks,
      initialOrderExecDate,
    } = this.state;
  

    var dataRemarks = remarks;
  

     if (
      initialOrderStatus === selectedOrderStatus &&
      initialOrderRemarks === selectedOrderRemarks &&
      // initialOrderRemarks === this.state.remarks &&
      initialOrderExecDate === selectedOrderchooseDate
    ) 
    {
      // alert("No Changes Applied.");
      AlertMessage("No Changes Applied.","warning");

      return false;
    }
   
    if (selectedOrderRemarks != null) {
      dataRemarks = remarks + "\n " + selectedOrderRemarks;
    }
   
    var success = this.addValidation();
    if (success == true) {
      this.setState({
        isOrderEdit: true,
        isOrderUpdating: true,
      });
      const data = {
        order_status: selectedOrderStatus,
        execution_date: selectedOrderchooseDate,
        remarks: dataRemarks,
      };
      var flag = false;
     
      UserService.getProcOrderUpdate(selectedOrderId, data).then(
        (response) => {
          
          flag = true;
          // console.log(response);
          if (response.data.success) {
            var currentProclist = this.state.procurementlist;
            // console.log("Curr proc list ", this.state.procurementlist);
            var responseOrderData = response.data.data;
            let indexOfEditedOrder = -1;
            let procurementListIndex = -1;
            currentProclist.map((procurement, procindex) => {
              let currentProcurementOrderlist = procurement.proc_order_details;
            
              currentProcurementOrderlist.filter((item, orderIndex) => {              
               
               
               
               
                if (item.id === selectedOrderId) {
                   
                  indexOfEditedOrder = orderIndex;
                  procurementListIndex = procindex;
                  // item.order_status = selectedOrderStatus;
                  // item.execution_date__date = selectedOrderchooseDate;
                 
               
                }
               

               
               
              });
            });
            // console.log(" before replacimg proc", currentProclist);
            let oldProcList = JSON.parse(JSON.stringify(currentProclist));
            oldProcList[procurementListIndex].proc_order_details[
              indexOfEditedOrder
            ] = responseOrderData;
            let dataOfproclist = oldProcList;
            // console.log("after replacing", dataOfproclist);

            this.setState(
              {
                updateMessage: response.data.message,
                procurementlist: dataOfproclist,
                // updateModalClose: false,
               
                updateModalshow: true,
                selectedOrderId: "",
                isOrderEdit: false,
                isOrderUpdating: false,
              }
            
            );
            setTimeout(() => {
              this.setState({
                updateModalshow: false,
                  });
          }, 1000)
          
          
         
          }
          //  if (response.data.success || "id" in response.data.data) {
          //    this.setState({
          //      showloader: false,
          //      updateModalshow: false,
          //      isOrderUpdating: false,
          //    });
          //    UserService.getProcurementList().then((response) => {
          //      this.setState({
          //        procurementlist: response.data.data,
          //        showloader: false,
                 
          //      });
          //    });
          //  }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.message, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            updateModalshow: false,
            selectedOrderId: "",
            isOrderEdit: false,
            isOrderUpdating: false,
          });
        }
      );
    } else {
      console.log("error");
    }
  };
  CheckUserParent=(buttonstatus)=>{
    const{accessed_supervisor,logged_supervisor}=this.state;
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return true;
    }
    if(buttonstatus===null)
    {
      return true;
    }
  return false;
  }
  CheckHideButton=()=>{
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "hidingButton";
    }
    return "add-proc";
  }
  // CheckUserParent2=(rowData)=>{
  //   const{accessed_supervisor,logged_supervisor}=this.state;
  //    if (rowData.proc_order_details.length > 0)
  //    {
  //      return true
  //    }
  

  //    if(check_ParentFpo===check_ParentSupervisor)
  //    {
  //      console.log("c")
    
  //     return false;

  //    }
  //    else{
  //     return true;

  //    }

  //    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
  //    {
  //      return true;
  //    }
  //  return false;
   
  // }
  addingExtraObject=(initialData)=>{
      console.log("initial",initialData)
      let newCreatedObj=initialData;
      const foundObj=initialData.find((item)=>item.parameters==='Procurement End Date*')
      console.log("foundObj",foundObj)
      if(foundObj)
        return initialData
        else{
         let addingObj= {
            "parameters": "Procurement End Date*",
            "specifications": "",
            "remarks": "",
            "active": true
        }
        newCreatedObj.splice( 2, 0, addingObj );
           return newCreatedObj


        }

  }
  showDataCommodity(cardId) {
    this.setState({
        // isLandHoldingTabLoading: true,
        activeTabCommodity: cardId
    })
}
CommodityCategoryListDropdown = (getCommodityCategoryList) =>
getCommodityCategoryList.length
  ? getCommodityCategoryList.map((data) => (
      <option key={data.id} name={data.name} value={data.id}>
        {data.name}
      </option>
    ))
  : "";
  handleCommodityCategoryListDropdown=(e)=>{
   this.setState({
    CommodityCategoryListDropdownValue:e.target.value,
    CommodityCategoryListDropdownValueclass:"",
    CommodityCategoryNameDropdownValue:""

   },()=>this.handleCommodityCategoryNameDropdown(this.state.CommodityCategoryListDropdownValue))
  }
  
  CommodityCategoryNameDropdown = (list) =>
  list.length
  ? list.map((data) => (
      <option key={data.id} name={data.crop_name} value={data.id}>
        {data.crop_name}
      </option>
    ))
  : "";
  onChnageCommodityCategoryNameDropdown=(val)=>{
    this.setState({
      CommodityCategoryNameDropdownValue:val,
      CommodityCategoryNameDropdownValueclass:""
    })
   }
  handleCommodityCategoryNameDropdown=(value)=>{
    console.log("happy birthday",value)
    var flag=false;
    UserService.getCommodityCategoryNameDropdown(value).then(
      (response) => {
        flag = true;
        console.log("getCommodityCategoryNameDropdown", response);
        if (response.data.success) {
         
       
      
            this.setState({
              getCommodityNameDropdownList: response.data.data,
             
             
            });
          }
        },
      
      (error) => {
        flag = true;
        this.setState({
          // showloader: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert("Error", error.response.data.message, "error");
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      },
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.navigateMainBoard()
        }
      }, 30000)
    );
  }
  handleCommoditysellingOfferedPrice=(e)=>{
  //  this.setState({
  //   CommoditysellingOfferedPrice:e.target.value,
  //   offeredQuantityclass:"startOfferedQuantityClass"
  // })
  //  let validDateRegEx =/^[\d]*$/;
   let validDateRegEx=/^(\d+)?([.]?\d{0,4})?$/

  

   if (validDateRegEx.test( e.target.value)) {
     this.setState({
      CommoditysellingOfferedPrice:e.target.value,
      offeredQuantityclass:"startOfferedQuantityClass",
      sellingPriceMessage:""
     });
   } else {
     this.setState({
       sellingPriceMessage:"Size value must be a number",
         });
   }
  }
  CurrentDateMaximum=()=>{
    let currentDate=new Date().toISOString().split("T")[0]
    let copyFuture= new Date(currentDate);
    let futureDate = copyFuture.setDate(copyFuture.getDate() + 60); 
    let exa = new Date(futureDate).toISOString().split("T")[0]
    // console.log("futureDate", exa)
    return exa
  }
  handleCommoditysellingExeDate=(e)=>{
    this.setState({
      CommoditysellingExeDate:e.target.value,
      CommoditysellingExeDateClass:""
    })
   }
   handleCommoditysellingLocation=(e)=>{
    this.setState({
      CommoditysellingLocation:e.target.value,
      CommoditysellingLocationclass:""
    })
   }
   handleCommoditysellingStatus=(e)=>{
    this.setState({
      CommoditysellingStatus:e.target.value,
      CommoditysellingStatusClass:""
    })
   }
   handleCommoditysellingRemarks=(e)=>{
    this.setState({
      CommoditysellingRemarks:e.target.value,
      CommoditysellingRemarksClass:""
    })
   }
   CommoditySellingValidation = () => {
    let errors = false;
   
    if (this.state.CommoditysellingRemarks == "" ) {
      errors = true;

      this.setState({ CommoditysellingRemarksClass: "requiredOfferedQuantityClass" });
    }
    if (this.state.CommoditysellingStatus == "") {
      errors = true;
     

      this.setState({ CommoditysellingStatusClass: "requiredUnitClass" });
    }

    if (this.state.CommoditysellingLocation == "") {
      errors = true;
      
      this.setState({ CommoditysellingLocationclass: "requiredinputfields" });
    }
    if (this.state.CommoditysellingExeDate == "") {
      errors = true;

      this.setState({ CommoditysellingExeDateClass: "requiredinputfields" });
    }
    if (this.state.CommoditysellingOfferedPrice == "") {
      errors = true;
    

      this.setState({ offeredQuantityclass: "requiredOfferedQuantityClass" });
    }
    // if(this.state.selectedunitvalueSelling=="")
    // {
    //   errors=true;
    //   this.setState({ selectedunitvalueclass: "requiredUnitClass" });

    // }
    if (this.state.CommodityCategoryNameDropdownValue == "") {
      errors = true;
     

      this.setState({ CommodityCategoryNameDropdownValueclass: "requiredinputfields" });
    }
    if (this.state.CommodityCategoryListDropdownValue == "") {
      errors = true;

      this.setState({ CommodityCategoryListDropdownValueclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ InterestMessage: "" });
      return true;
    } else {
      this.setState({ InterestMessage: "Required fields must be filled" });
      return false;
    }
  };
  handlesellingStatusDisabled=()=>{
    const {DisableFieldsCommoditysellingStatus}=this.state;
    if(DisableFieldsCommoditysellingStatus==="Completed"|| DisableFieldsCommoditysellingStatus==="Cancelled"|| DisableFieldsCommoditysellingStatus==="Rejected")

    {
      console.log("DisableFieldsCommoditysellingStatus",DisableFieldsCommoditysellingStatus)
    return true
    }
    // if(sellingOrderUpdating)
    //   return true
  
       
    return false
  }
   SaveCommodityInterest=()=>{
    const{CommodityCategoryListDropdownValue,CommodityCategoryNameDropdownValue,CommoditySellingId,
      CommoditysellingLocation,CommoditysellingOfferedPrice,CommoditysellingExeDate,CommoditysellingStatus,CommoditysellingRemarks,
      selectedunitvalueSelling}=this.state;
    var success = this.CommoditySellingValidation();
    if(success==true)
    {  

        //  let sendindData={
        //   "id":parseInt (CommoditySellingId),
        //   "crop_category": parseInt(CommodityCategoryListDropdownValue),
        //   "commodity":parseInt(CommodityCategoryNameDropdownValue),
        //   "execution_date":CommoditysellingExeDate,
        //   "fpo_quoted_price":parseInt( CommoditysellingOfferedPrice),
        //   "location_alloted_for_delivery":CommoditysellingLocation,
        //   "order_status": CommoditysellingStatus,
        //   "fpo_remarks":CommoditysellingRemarks
        
        // }
        // console.log("send",sendindData)

      const data = new FormData();

      data.append("id",parseInt (CommoditySellingId));
      data.append("crop_category", parseInt(CommodityCategoryListDropdownValue));
      data.append("commodity", parseInt(CommodityCategoryNameDropdownValue));
      data.append("execution_date", CommoditysellingExeDate);

      data.append("fpo_quoted_price", parseInt(CommoditysellingOfferedPrice));
      data.append("location_alloted_for_delivery", CommoditysellingLocation);
      data.append("order_status", CommoditysellingStatus);
      data.append("fpo_remarks", CommoditysellingRemarks);
      // data.append("fpo_units_id", selectedunitvalueSelling);

       var flag=true;
       UserService.CreateSellingCommodity(data).then(
        (response) => {
          flag = true;
          console.log("CreateSellingCommodity", response);
          if (response.data.success) {
            UserService.getCommoditySellingList().then(
              (response) => {
                flag = true;
                console.log("getCommodityList", response);
                if (response.data.success) {
                  if (response.data.data.length == 0) {
                    this.setState({ showloader: false ,
                  });
               
                  } else if (response.data.data.length > 0) {
                    this.setState({
                      commoditySellingList: response.data.data,
                      commoditySellingListDuplicate:response.data.data,
                      showloader: false,
                      commoditiesSellingEditOpen:false,

                     
                    },()=>this.FiltersHandlingCommoditySelling(response.data.data,this.state.selectedCommodityYear,this.state.selectedCommoditystatus));
                  }
                }
              },
              (error) => {
                flag = true;
                this.setState({
                  // showloader: false,
                  content:
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString(),
                });
                if (error.response) {
                  TriggerAlert("Error", error.response.data.message, "error");
                } else {
                  TriggerAlert(
                    "Error",
                    "Server closed unexpectedly, Please try again",
                    "error"
                  );
                }
              },
              setTimeout(() => {
                if (flag == false) {
                  this.setState({
                    showloader: false,
                  });
                  TriggerAlert("Error", "Response Timed out, Please try again", "info");
                  this.navigateMainBoard()
                }
              }, 30000)
            );

              // this.setState({
              //   commoditiesSellingEditOpen:false,
              // })

          }
        },
        (error) => {
          flag = true;
          this.setState({
            showloader: false,
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
          if (error.response) {
            TriggerAlert("Error", error.response.data.message, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert("Error", "Response Timed out, Please try again", "info");
            this.navigateMainBoard()
          }
        }, 30000)
      );
    }
 }

  YearOptions = (yearList) => {
      // console.log("yearList",yearList)
      if(yearList.length!==null){
        return yearList.map((year, index) =>
      (
          <option key={index} name={year} value={year}>
              {year}
          </option>
      ))
      }
    
  }



 
  render() {
    const {
      commoditiesSellingEditOpen,
      commoditySellingFrmer,
        commoditySellingPhone,
        commoditySellingVillage,
        getCommodityCategoryList,
        CommodityCategoryListDropdownValue,
        getCommodityNameDropdownList,
        CommodityCategoryNameDropdownValue,
        unitlist,

      activeTabCommodity,
      currentFpo,
      procurementlist,
      modalIsOpen,
      isProcEdit,
      isProcCreating,
      isProcEditing,
      uploadedFileMessage,
      otherParamObjs,
      selectedProcDetails,
      selectedQualityDetails,
      createmodalIsOpen,
      initParamsList,
      initQualityList,
      showloader,
      isNameerror,
      isSpecerror,
      isDateerror,
      triggeredActive,
      updateModalshow,
      updateModalClose,
      floatingAlertWindowStatus,
      UpdateState,
      isDisableEdit,
      isProcEnderror,
    

      showendError,
      dateError,
      commoditySellingList,
      fullImageOpen,selectedunitvalueSelling,
      dateRanges
    } = this.state;
    function getMonthName(date) {
      const specdate = new Date(date);
      const month = specdate.toLocaleString("default", { month: "short" });
      const result =
        specdate.getDate().toString().padStart(2, "0") +
        "-" +
        month +
        "-" +
        specdate.getFullYear();
      return result;
    }
    const showFullImage=(rowData)=>{
      console.log("full image is open")
       this.setState({
        fullImageOpen:true,
        sellingImageOne:rowData.photo1_presigned_url,
        sellingImageTwo:rowData.photo2_presigned_url
       })

    }
    const hideFullImage=()=>{
      this.setState({
        fullImageOpen:false
      })

    }
    const CommoditiesSellingModal=(rowData)=>{
      console.log("rowData.crop_category__id",rowData.crop_category__id)
      if(rowData.crop_category__id!==null)
      {
      this.handleCommodityCategoryNameDropdown(rowData.crop_category__id)
      }
      UserService.getUnitList("product").then(

        (response) => {

         
          this.setState({
            unitlist: response.data.data,
          });
        },
        (error) => {
          this.setState({
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
        }
      );
      this.setState({
        commoditiesSellingEditOpen:true,
        offeredQuantityclass:"startOfferedQuantityClass",
        selectedunitvalueclass:"UnitClass",
        commoditySellingFrmer:rowData.farmer_name,
        commoditySellingPhone:rowData.farmer_phone, 
        commoditySellingVillage:rowData.farmer_village,
        CommoditySellingId:rowData.id,
        CommoditysellingRemarks:rowData.fpo_remarks,
        CommoditysellingStatus:rowData.order_status,
        DisableFieldsCommoditysellingStatus:rowData.order_status,

        CommoditysellingLocation:rowData.location_alloted_for_delivery,
        CommoditysellingOfferedPrice:rowData.fpo_quoted_price,
        CommoditysellingExeDate:rowData.execution_date,
        // CommoditysellingExeDateDisable:rowData.created_at.slice(0,10),

        // CommoditysellingExeDateDisable:rowData.execution_date,
        // CommoditysellingExeDateDisable:rowData.execution_date,



        CommodityCategoryListDropdownValue:rowData.crop_category__id,
        CommodityCategoryNameDropdownValue:rowData.commodity_id
      })
     
    }

    const CommoditiesSellingModalClose = () => {
      this.setState({
        commoditiesSellingEditOpen:false,
        InterestMessage:"",
        CommodityCategoryListDropdownValueclass:"",
        CommodityCategoryNameDropdownValueclass:"",
        CommoditysellingOfferedPriceClass:"",
        CommoditysellingExeDateClass:"",
        CommoditysellingLocationclass:"",
        CommoditysellingStatusClass:"",
        CommoditysellingRemarksClass:"",
        sellingPriceMessage:"",
        offeredQuantityclass:"startOfferedQuantityClass",
        selectedunitvalueclass:"UnitClass"
      });
    };
    // const onChangeRemarks = (e)=> {
    //   console.log(e.target.value)
    //   // var remarks = this.state.selectedOrderRemarks
    //   // remarks = remarks + "\n" + e.target.value
    //   this.setState({remarks: e.target.value})
    // }

     // showModal function will get triggered on click on a Modal Popup.
    // Inside this we r setting all the variables which r used in a popup.
    // Initially we r setting all the values to empty and then in the nxt setState we are assigning values .
    const showModal = (val, selecteddata = null, action = null) => {
      // console.log(selecteddata);
      if (action === "Create") {
        this.setState({
          createmodalIsOpen: true,
          selectedProcDetails: initParamsList,
          selectedQualityDetails: initQualityList,
        });
      } else {
        this.setState({
          isProcEdit: false,
          modalIsOpen: true,
        });
      }
      if (selecteddata) {
        console.log("selecteddata",selecteddata)
        this.setState({
          selectedProcDetails: selecteddata.details,
          frontendselectedProcDetails:this.addingExtraObject( selecteddata.details),

          selectedQualityDetails: selecteddata.qualityDetails,
          selectednameSpec: selecteddata.namespec,
          selecteddateSpec: selecteddata.datespec,
          selectedEnddateSpec:selecteddata.end_datespec,
          selectedpriceSpec: selecteddata.pricespec,
          selectedProcId: selecteddata.id,
        });
      }
    };
      // hideModal function will get triggered on click on a  close button inside Modal Popup.
    // Inside this we r setting all the variables to empty which r used in a popup .
    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
        isProcEdit: false,
        selectedProcId: "",
        createmodalIsOpen: false,
        isNameerror: false,
        isSpecerror: false,
        isDateerror: false,
        isProcEnderror:false,
        selectednameSpec: "",
        selecteddateSpec: "",
        selectedpriceSpec: "",
        dateError: "",
        PriceError: "",
        initParamsList: initTradeParamsCreation(),
        initQualityList: initQualityParamsCreation(),
        selectedProcDetails: [],
        selectedQualityDetails: [],
        isDisableEdit:true,
      });
    };
    // showModal function will get triggered on click on a Modal Popup.
  
    // Initially we r assigning all the values in the setState.
       // this is triggered in nested material table on click on Update changes button.
    const showUpdateModal = (selectdRow) => {
      this.setState({
        updateModalshow: true,
        updateModalClose: false,
        selectedOrderStatus: selectdRow.order_status,
        selectedOrderRemarks: selectdRow.remarks,
        selectedOrderchooseDate: selectdRow.execution_date__date,
        selectedfarmerName: selectdRow.farmer_name,
        selectedfarmerPhone: selectdRow.farmer_phone,
        selectedfarmerVillage: selectdRow.farmer_village,
        selectedOrderId: selectdRow.id,
        updateMessage: "",
        remarks: selectdRow.remarks,
        initialOrderStatus: selectdRow.order_status,
        initialOrderRemarks: selectdRow.remarks,
        initialOrderExecDate: selectdRow.execution_date__date,
        updateremarksclass: "",
        errorremarksmessage: "",
        updatedateclass:"",
        UpdateState:this.handleOption1(selectdRow.order_status),
      });
    };
     // UpdatehideModal function will get triggered on click on a  close button inside  Modal Popup.
    // Inside this we r setting all the variables to empty which r used in a popup .
    // this is triggered in nested material table on click on Update changes button.
    const updatehandleClose = () => {
      this.setState({
        updateModalshow: false,
        updateModalClose: true,
        isOrderUpdating: false,
      });
    };
    // here these three fields checkboxes we are keeping disabled. User cannot change them.
    const checkDisable = (detail) => {
      if (
        detail.parameters === "Commodity *" ||
        detail.parameters === "Procurement Date*" ||
        detail.parameters === "Procurement Start Date*" ||
        detail.parameters === "Price (₹/ Quintal) *" ||
        detail.parameters === "Procurement End Date*" )
       {
        return "disabled";
      } else {
        return "";
      }
    };
// here we r checking mandatory fields.
    const checkMendatory = (detail) => {
      // if (
      //   detail.parameters === "Commodity *" ||
      //   detail.parameters === "Procurement Date*" ||
      //   detail.parameters === "Price (₹/ Quintal) *"
      // ) {
      //   return "false";
      // } else {
        return "false";
      // }
    };

    // nestedColumn has data to nested material table which will be displayed on click of a row.
    const nestedColumns = [
      /* { title: "Site Id", field: "id"}, */
      { title: "Ordered Date", field: "created_at__date" },
      { title: "Farmer Name", field: "farmer_name" },
      { title: "Village", field: "farmer_village" },
      { title: "Phone Number", field: "farmer_phone" },
      // {
      //   title: "Quoted Price(₹)",
      //   field: "actual_price",
      //   export:false,
      //   render: (rowData) => {
      //     return parseInt(rowData.actual_price);
      //   },
      // },
      {
        title: "Quoted Price (₹)",
        field: "actual_price",
        export:true,
        // hidden:true,
      
      },
      { title: "Total Quantity", field: "quantity_ordered" },
      // {
      //   title: "Tentative Value (₹)",
      //   field: "tot_price",
      //   export:false,
      //   render: (rowData) => {
      //     return parseInt(rowData.tot_price);
      //   },
      // },
      {
        title: "Tentative Value",
        field: "tot_price",
        export:true,
        //  hidden:true,
      },
      { title: "Order Placed By", field: "order_placed_by" },
      {
        title: "Execution Date",
        field: "execution_date__date",
        render: (rowData) => {
          return rowData.execution_date__date
            ? getMonthName(rowData.execution_date__date)
            : "NA";
          // getMonthName(rowData.created_at__date);
        },
      },
      {
        title: "Order Status",
        field: "order_status",
        render: (rowData) => {
          return rowData.order_status ? rowData.order_status : "NA";
        },
      },
      {
        title: "Status Change",
        field: "",
        width: "10%",
        render: (rowData) => {
          return (
            // <Button
            //   disabled={this.CheckUserParent()}

            //   onClick={() => showUpdateModal(rowData)}
            //   type="button"
            //   name="button"
            //   align="center"
            // >
            //   Update
            // </Button>
            // <div>
            this.CheckUserParent(rowData.order_status)?
              (<OverlayTrigger key="left" placement="left"
            
              overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
         
             
         <Button
          
          style={{opacity:"0.3",cursor:"not-allowed"}}
             type="button"
            
             align="center"
           >
             Update
           </Button>
             
            </OverlayTrigger>)
           
           
           : (<Button
            

             onClick={() => showUpdateModal(rowData)}
             type="button"
             name="button"
             align="center"
           >
             Update
           </Button>)
           
             
              // </div>
          );
        },
      },
    ];
// column has data of parent material table.
    const columns = [
      {
        title: "Image",
        field: "presigned_url",
        filtering: false,
        export: false,
        render: (rowData) => {
          // return <img src={rowData.presigned_url}></img>;
          return (
            <div>
              {rowData.presigned_url === null ? (
                <img src={ImageNotAvailable}></img>
              ) : (
                <img src={rowData.presigned_url}></img>
              )}
            </div>
          );
        },
      },

      {
        title: "Commodity",
        field: "namespec",
        filtering: false,
       
      },

      {
        title: "Procurement Start Date",
        field: "datespec",
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Procurement End Date",
        field: "end_datespec",
        filtering: false,
        render: (rowData) => {
          return (
            <div>
            {rowData.end_datespec?rowData.end_datespec:"NA"}
            </div>
          );
        },
        cellStyle: {
          width: "15%",
        },
      },

      {
        // title: "Quoted Price (₹ / Qunital):",
        title: "Quoted Price (₹)",
        field: "pricespec",
        export:false,
        customSort: (a, b) => a.pricespec - b.pricespec,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
        
      },
      {
        title: "Quoted Price",

        field: "pricespec",

        hidden: true,
        export: true,
        searchable: true,
      },

      {
        title: "Total Quantity offered (Quintal):",
        field: "total_quantity",
        filtering: false,
        customSort: (a, b) => a.total_quantity - b.total_quantity,
        cellStyle: {
          width: "15%",
        },
      },
      {
        // title: "Tentative Value ( ₹ ):",
        title: "Tentative Value (₹)",
        field: "total_price",
        export:false,
        filtering: false,
        customSort: (a, b) => a.total_price - b.total_price,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Tentative Value",

        field: "total_price",

        hidden: true,
        export: true,
        searchable: true,
      },
      {
        title: "No Of Selling Intentions:",
        field: "count",
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Is Active",
        field: "is_available",
        filtering: false,
        render: (rowData) => {
          return (
            <div>
              {triggeredActive ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : rowData.is_available ? (
                "YES"
              ) : (
                "NO"
              )}
            </div>
          );
        },
        cellStyle: {
          width: "15%",
        },
      },
    ];
   
    const CommoditySellingColumn = [
      {
        title: "Order Date",
        field:"created_at",
        width:"10%",

        filtering: false,
        render:(rowData)=>{
          return(
            //  <div style={{fontSize:"11px"}}>{rowData.created_at.slice(0,10)}</div>
              <div>{moment(rowData.created_at).format("DD/MM/YYYY")}</div>

          )
        },
       
      },
      {
        title: "Farmer Details",
        filtering: false,
        width:"20%",
        cellStyle: {
        // position: 'sticky',
        // background: '#f1f1f1',
        left: 0,
        zIndex: 1,
        minWidth: 200,
        maxWidth: 200
        },
        export:false,
        render:(rowData)=>{
          return(
             <div>
              <p>Name : <span className="darkGreenText" style={{fontWeight:"700"}}>{rowData.farmer_name}</span></p>
              <p>Phone No :<span className="darkGreenText" style={{fontWeight:"700"}}> {rowData.farmer_phone}</span></p>
              <p>Village : <span className="darkGreenText" style={{fontWeight:"700"}}>{rowData.farmer_village}</span></p>


              </div>
          )
        },
       
      },
     
      {
        title: "Farmer Name",
        field: "farmer_name",
        hidden:true,
        export:true,
        filtering: false,
       
      }, {
        title: "Phone",
        field: "farmer_phone",
        hidden:true,
        export:true,
        filtering: false,
       
      }, {
        title: "Village ",
        field: "farmer_village",
        hidden:true,
        export:true,
        filtering: false,
       
      },

     
    
      {
        title: "Commodity Name",
        field: "commoditiy_name",
        width:"10%",

        filtering: false,
        render:(rowData)=>{
          return(<div><div> Farmer : <span className='darkGreenText'>{rowData.commoditiy_name}</span></div>
        {rowData.commodity__crop_name?<div> FPO: <span className='darkGreenText'>{rowData.commodity__crop_name}</span></div>:""}

          </div>)
        },
       
      },
       
      {
        title: "Image",
        field:"",
        width:"5%",
        export:false,
        filtering: false,
        render:(rowData)=>{
           return (
         
              <div style={{cursor:"pointer"}}>
                {
                (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url===null)?
                <img src={noImageFpo} alt="image1"className="" height="50px" onClick={()=>showFullImage(rowData)} ></img>

                : 
                (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url!==null)?
                <img src={rowData.photo2_presigned_url} alt="image1"className="" height="50px" width="50px" onClick={()=>showFullImage(rowData)} ></img>
         :
         <img src={rowData.photo1_presigned_url} alt="image1"className="" height="50px" width="50px" onClick={()=>showFullImage(rowData)} ></img>
        }
            
             </div>
           )
        },
        cellStyle: {
            width: "15%",
        },
    },
       
      {
        title: "Harvesting Date",
        field: "harvesting_date",
        width:"10%",

        filtering: false,
        render:(rowData)=>{
          return(<div style={{fontSize:"11px"}}>{moment(rowData.harvesting_date).format("DD/MM/YYYY")}</div>)
        },
       
      },
       
      {
        title: "Commodity Details (Farmer)",
        export:false,
        width:"10%",

        // field: "count",
        cellStyle: {
        position: 'sticky',
        background: '#f1f1f1',
        left: 0,
        zIndex: 1,
        minWidth: 200,
        maxWidth: 200
        },
        render:(rowData)=>{
         return(
          <div>
          <p>Offered Quantity :<span className="darkGreenText" style={{fontWeight:"700"}}>{rowData.offered_quantity}&nbsp; {rowData.units__unit_name}</span></p>
          <p>Offered Quality : <span className="darkGreenText" style={{fontWeight:"700"}}>{rowData.quality_of_commodity}</span></p>
          </div>
         )
        },
        filtering: false,
       
      },
      {
        title: "Offered Quantity ",
        field: "offered_quantity",
        hidden:true,
        export:true,
        filtering: false,
       
      },
      {
        title: "Offered Quality ",
        field: "quality_of_commodity",
        hidden:true,
        export:true,
        filtering: false,
       
      },
      {
        title: "Price (Farmer) ",
        field: "expected_price",
        hidden:true,
        export:true,
        filtering: false,
       
      },
      {
        title: "Price (FPO) ",
        field: "fpo_quoted_price",
        hidden:true,
        export:true,
        filtering: false,
       
      },
       
      {
        title: "Expected Price (Quintals)",
        filtering: false,
        width:"10%",

        export:false,
        render:(rowData)=>{
          return(
           <div>
           <p>Farmer Demand : <span className="darkGreenText" style={{fontWeight:"700"}}> ₹ {rowData.expected_price}</span></p>
           {rowData.fpo_quoted_price?<p>FPO Price : <span className="darkGreenText"style={{fontWeight:"700"}}> ₹ {rowData.fpo_quoted_price}</span></p>:""} 
           </div>
          )
         },
       
      },
      {
        title: "Selling Date (Farmer) ",
        field: "expected_procurement_date",
        hidden:true,
        export:true,
        filtering: false,
       
      },
      {
        title: "Execution Date (FPO) ",
        field: "execution_date",
        hidden:true,
        export:true,
        filtering: false,
       
      },
      {
        title: "Expected Date",
        filtering: false,
        width:"10%",
        // cellStyle: {
        //   position: 'sticky',
        //   background: '#f1f1f1',
        //   left: 0,
        //   zIndex: 1,
        //   minWidth: 150,
        //   maxWidth:150
        //   },
        export:false,
        render:(rowData)=>{
          return(
           <div>
           <p>Selling Date (Farmer):<br/><span className="darkGreenText" style={{fontWeight:"700"}}>{moment(rowData.expected_procurement_date).format("DD/MM/YYYY")}</span> </p>
           {rowData.execution_date?<p>Execution Date (Fpo):<br/><span className="darkGreenText" style={{fontWeight:"700"}}>{moment(rowData.execution_date).format("DD/MM/YYYY")}</span></p>:""}
           </div>
          )
         },
       
      },
       
      {
        title: "Remarks (Farmer)",
        field: "remarks",
        width:"5%",

        filtering: false,
       
      },
       
      {
        title: "Order Status",
        field: "order_status",
        width:"5%",

        filtering: false,
       
      },
       
      {
        title: "Change Status" ,
        field: "",
        width: "5%",
        render: (rowData) => {
          return (
           
            this.CheckUserParent(rowData.order_status)?
              (<OverlayTrigger key="left" placement="left"
            
              overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
         
             
         <Button
             style={{opacity:"0.3",cursor:"not-allowed"}}
             type="button"
            
             align="center"
           >
             Update
           </Button>
            </OverlayTrigger>)
           : (<Button
             type="button"
             name="button"
             align="center"
             className="buttonBackgroundColor"
             onClick={() => CommoditiesSellingModal(rowData)}

           >
             Update
           </Button>)
          );
        },
      },
    
    ];
    // here we r checking madatory params and accordinly displaying an error.
    const mandateParams = (data) => {
      // console.log("mandatory",data)
      let paramsDiv = <td>{data.parameters}</td>;
      if (data.parameters === "Commodity *") {
        paramsDiv = (
          <td className={isNameerror ? "nameError" : ""}>{data.parameters}</td>
        );
      } else if (data.parameters === "Procurement Date*") {
        // console.log("first",this.state.isSpecerror)
        paramsDiv = (
          <td className={isSpecerror ? "specError" : ""}>{data.parameters}</td>
        );
      } 
      else if (data.parameters === "Procurement Start Date*") {
        // console.log("second",this.state.isSpecerror)

        paramsDiv = (
          <td className={isSpecerror ? "specError2" : ""}>{data.parameters}</td>
        );
      }
      
      else if (data.parameters === "Procurement End Date*"){
        paramsDiv = (
          <td className={isProcEnderror ? "specError" : ""}>{data.parameters}</td>
        );
      }
      
      else if (data.parameters === "Price (₹/ Quintal) *") {
        paramsDiv = (
          <td className={isDateerror ? "dateError" : ""}>{data.parameters}</td>
        );
      }
      else if (data.parameters === "Bag Size") {
        paramsDiv = (
          <td className={isDateerror ? "dateError" : ""}>{data.parameters}</td>
        );
      } 
      else if (data.parameters === "Bag Weight") {
        paramsDiv = (
          <td className={isDateerror ? "dateError" : ""}>{data.parameters}</td>
        );
      } else if (data.parameters === "Minimum Traded Quantity") {
        paramsDiv = (
          <td className={isDateerror ? "dateError" : ""}>{data.parameters}</td>
        );
      } 
      return paramsDiv;
    };
    if (procurementlist) {
      return (
        <section className="mainWebContentSection">
          <Fragment>
            <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap">
              <a
                href="#"
                className="breadcrumb-item pageBreadCrumbItem"
                onClick={() => this.navigateMainBoard()}
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                  style={{ fontSize: "0.7rem" }}
                />
                &nbsp;Dashboard
              </a>
            </div>
            <Row>
                        <Col md="3"></Col>
                            
                            <Col md="3">
                            <div id="registered" className={`card-counter landHoldingMainCards  ${this.state.activeTabCommodity === "Fpo Listed" ? "active" : ""}`}
                             onClick={this.showDataCommodity.bind(this, "Fpo Listed")}
                            >
                                <span className="landHoldingMainCardsIcon CommodityTabIcon1" style={{left:"33px"}}></span>
                                <span className="count-name" style={{fontSize:"17px",color:"rgba(114, 49, 12, 1)",fontWeight:"700"}}>FPO Listed Commodity</span>

                            </div>
                            </Col>
                            <Col md="3">
                            <div id="total_area" className={`card-counter landHoldingMainCards  ${this.state.activeTabCommodity === "Commodity Selling" ? "active" : ""}`}
                           onClick={this.showDataCommodity.bind(this, "Commodity Selling")}
                            >
                                <span className="landHoldingMainCardsIcon CommodityTabIcon2" style={{left:"33px"}}></span>
                                <span className="count-name"style={{fontSize:"17px",color:"rgba(114, 49, 12, 1)",fontWeight:"700"}}>Commodity Selling Interest </span>
                            </div>
                            </Col>
                            <Col md="3"></Col>

                         
                        </Row>
            {this.state.isParentLogged? 
                   <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
                   <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
                  </div>
                   : ""}
                   {activeTabCommodity==="Fpo Listed"?
            <div className="landholdingHeader wrap">
              <Button
                // className="add-proc"
                className={ this.CheckHideButton()}
                // disabled={this.CheckUserParent()}

                onClick={() => showModal(true, null, "Create")}
                type="button"
                name="button"
                align="right"
              >
                <span className="fa fa-plus"></span> Add New Commodity
              </Button>
              <Row>
                <Col lg="12" md="12" sm="12" className="noPadding">
                  <div className="PageHeading padding15">
                    <Row>
                      <Col md={12}>
                        <h4
                          className="procurementListHeading dvaraBrownText"
                          style={{ marginLeft: "25px", fontSize: "28px" }}
                        >
                          Procurement List Data
                        </h4>
                      </Col>
                    </Row>
                  </div>
                  {showloader ? (
                    <div className="mainCropsFarmerLoaderWrap">
                       <img src={tractor_moving} height="100px"width="200px" style={{position:"relative",top:"200px",left:"45%"}}/> 

                      {/* <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span> */}
                    </div>
                  ) : (
                    <MaterialTable
                      icons={tableIcons}
                      title=""
                      style={{ marginLeft: "25px" }}
                      ref={this.wrapper}
                      data={procurementlist}
                      columns={columns}
                      actions={[
                        {
                          icon: EventAvailableIcon,
                          disabled:this.CheckUserParent(),

                          tooltip: "Active/Inactive",
                          onClick: (event, rowData) => {
                            let status = rowData.is_available
                              ? "De-Activate"
                              : "Activate";
                            if (
                              window.confirm(
                                "Are you sure to " +
                                  status +
                                  " this " +
                                  rowData.namespec +
                                  " Procurement?"
                              )
                            ) {
                              this.procurementStatusUpdate(rowData.id, status);
                            }
                          },
                        },
                        // {
                        //   icon: VisibilityIcon,
                        //   tooltip: "View / Edit",
                        //   onClick: (event, rowData) =>
                        //     showModal(true, rowData, "Edit"),
                        // },
                        //  checkParent2=(rowData)=>{
                        //   if(rowData.is_available === false)
                        //   {
                        //     return false;
                        //   }

                        //  }
                        (rowData) => ({
                          // disabled: rowData.is_available === false,
                          disabled: rowData.is_available === false || parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor),

                          icon: VisibilityIcon,
                          tooltip:parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)?"Dont have access":"View/Edit",

                          onClick: (event, rowData) =>
                            showModal(true, rowData, "Edit"),
                        }),

                        (rowData) => ({
                          // disabled: rowData.proc_order_details.length > 0,
                          disabled:rowData.proc_order_details.length > 0 || parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor),

                          icon: tableIcons.Delete,
                          tooltip:parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)?"Dont have access":"Delete",
                          isFreeAction: true,
                          onClick: (event, rowData) => {
                            if (
                              window.confirm(
                                'Are you sure to delete this "' +
                                  rowData.namespec +
                                  '" record?'
                              )
                            ) {
                              this.ProcurementDelete(rowData.id);
                              // will delete the procurement.
                            }
                          },
                        }),
                      ]}
                      options={{
                        maxBodyHeight:600,

                        actionsColumnIndex: -1,
                        doubleHorizontalScroll: true,
                        detailPanelType: "single",
                        pageSize: 10,
                        pageSizeOptions: [
                          10,
                          20,
                          50,
                          100,
                          { value: procurementlist.length, label: "All" },
                        ],
                        exportButton: true,

                        headerStyle: {
                          backgroundColor: "#A3C614",
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontFamily: "barlow_reg",
                          fontWeight: "bold",
                        },

                        rowStyle: {
                          backgroundColor: "#f1f1f1",
                          borderBottom: "2px solid #e2e2e2",
                          fontSize: "0.9rem",
                        },
                        filtering: true,
                      }}
                      //in detailPanel we have defined the properties of nested Material Table.
                      detailPanel={[
                        {
                          tooltip: "Show Orders",
                          render: (rowData) => {
                            return (
                              <div className="wrap" style={{width:"96%"}}>
                                <div className="verticalSpacer10"></div>
                                <div className="landHoldingSiteListWrap">
                                  <MaterialTable
                                    icons={tableIcons}
                                    title=""
                                    columns={nestedColumns}
                                    // icons={tableIcons}
                                    data={rowData.proc_order_details}
                                    compType="procOrder"
                                    options={{
                                      maxBodyHeight:300,
                                        exportButton: true,
                                        exportAllData: true,
                                        doubleHorizontalScroll: true,
                                        detailPanelType: "single",
                                        headerStyle: {
                                            backgroundColor: '#A3C614',
                                            color: '#fff',
                                            fontSize: '1.2rem',
                                            fontFamily: 'barlow_reg',
                                            fontWeight: 'bold',
                                            zIndex:1
                                        },
                                        rowStyle: {
                                            backgroundColor: '#f1f1f1',
                                            borderBottom: '2px solid #e2e2e2',
                                            fontSize: '0.9rem'
                                        },
                                        filtering: false,
                                        pageSize: 10,
                                        pageSizeOptions: [
                                         
                                          10,
                                          20,
                                          50,
                                          100,
                                        ],
                                    }}
                                    // options={{
                                 
                                    //   maxBodyHeight:300,
                                    //   doubleHorizontalScroll: true,
                                    //   detailPanelColumnAlignment: "left",
                                    //   detailPanelType: "single",
                                    //   exportAllData: true,
                                   
                                    //   headerStyle: {
                                    //     backgroundColor: "#A3C614",
                                    //     color: "#fff",
                                    //     fontSize: "1.2rem",
                                    //     fontFamily: "barlow_reg",
                                    //     fontWeight: "bold",
                                    //     zIndez:-1
                                    //   },
                                    
                                    //   filtering: false,
                                    //   pageSize: 10,
                                    //   tableLayout: "auto",
                                    //   exportButton: true,
                                    // }}




















                                  />
                                </div>
                                <div className="verticalSpacer20"></div>
                              </div>
                            );
                          },
                        },
                      ]}
                     
                    />
                  )}
                </Col>
              </Row>
            </div>
            // <div className="verticalSpacer20"></div>
                    :activeTabCommodity==="Commodity Selling"? 
                    // <p>New Requirement</p>:
                    <div>
                        <Row style={{marginLeft:"75px",marginTop:"20px"}}>
                        <Col md={2} ></Col>
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={3} className="dvaraBrownText">Year: </Form.Label>
                                                 <Col sm={5}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.selectedCommodityYear}
                                                        onChange={(e)=>this.FiltersHandlingCommoditySelling(this.state.commoditySellingListDuplicate,e.target.value,this.state.selectedCommoditystatus)}
                                                     >
                                                         {/* <option value="2022-2023" selected>2022-2023</option>
                                                         <option value="2021-2022" >2021-2022</option>
                                                         <option value="2020-2021">2020-2021</option>
                                                         <option value="2019-2020">2019-2020</option> */}
                                                         {this.YearOptions(dateRanges)}

                                                         
                                                     </Form.Control>
                                                 </Col>
                                               
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                   
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={4} className="dvaraBrownText">Order Status: </Form.Label>
                                                 <Col sm={5}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.selectedCommoditystatus}
                                                         onChange={(e)=>this.FiltersHandlingCommoditySelling(this.state.commoditySellingListDuplicate,this.state.selectedCommodityYear,e.target.value)}
>
                                                         <option value="all">All</option>

                                                         <option value="Raised">Raised</option>
                                                         <option value="Accepted" >Accepted</option>
                                                         <option value="Completed">Completed</option>
                                                         <option value="Failed">Failed</option>
                                                         <option value="Rejected">Rejected</option>
                                                         <option value="Cancelled">Cancelled</option>



                                                         
                                                     </Form.Control>
                                                 </Col>
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                 </Row>
                    <MaterialTable
                    icons={tableIcons}
                    style={{ marginLeft: "50px" }}
                    title=""
                    data={commoditySellingList}
                    columns={CommoditySellingColumn}
                    options={{
                        exportButton: true,
                        exportAllData: true,
                        maxBodyHeight:600,
                        actionsColumnIndex: -1,
                        doubleHorizontalScroll: true,
                        pageSize: 10,
                        pageSizeOptions: [             
                            10,
                            20,
                            50,
                            100,
                          ],
                        headerStyle: {
                            backgroundColor: "#A3C614",
                            color: "#fff",
                            fontSize: "1.2rem",
                            fontFamily: "barlow_reg",
                            fontWeight: "bold",
                        },
                        rowStyle: {
                            backgroundColor: "#f1f1f1",
                            borderBottom: "2px solid #e2e2e2",
                            fontSize: "12px",
                        },
                        filtering: true,
                        
                    }}
                />
                </div>
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    :""}
           {/* modal for creation and updation of procurements */}
            <Modal
              show={modalIsOpen}
              onHide={hideModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered /* onEntered={modalLoaded} */
              className="modal-adjust"
            >
              <Modal.Header>
                <Modal.Title>
                  &nbsp;&nbsp;
                  <span className="dvaraBrownText">Procurement</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="farmersUploadWrap">
                  
                  <Table bordered hover size="sm">
                    <thead>
                      <tr className="dvaraGreenBG">
                        <th colSpan={isProcEdit ? 5 : 4} className="headerComp">
                          Trade Parameters
                        </th>
                      </tr>
                      <tr className="dvaraGreenBG">
                        <th>Parameters</th>
                        <th>Specifications</th>
                        <th>Remarks</th>
                        {isProcEdit ? <th>Active</th> : ""}
                        {isProcEdit ? <th>Action</th> : ""}
                      </tr>
                    </thead>
                    <tbody>
                    {/* {console.log("selectedProcDetails",selectedProcDetails)}
                    {console.log("check2",isSpecerror)} */}

                      {selectedProcDetails.map((detail, index) => (
                        <tr className="procDetail" key={index}>
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeParameter(index, detail, e, "trade")
                            }
                            contentEditable={checkMendatory(detail)}
                            className={
                              isSpecerror &&
                              (detail.parameters === "Procurement Date*" || detail.parameters === "Procurement Start Date*")
                                ? "specError"
                                : "" ||
                                  (isDateerror &&
                                    detail.parameters ===
                                      "Price (₹/ Quintal) *")
                                ? "dateError"
                                : "" ||
                                  (isNameerror &&
                                    detail.parameters === "Commodity *")
                                ? "nameError"
                                : "" || 
                                (isProcEnderror &&
                                  detail.parameters === "Procurement End Date*")
                                ? "specError"
                                : "" ||
                                (isDateerror &&
                                  detail.parameters === "Bag Size*" )
                                ? "dateError"
                                : "" ||
                                (isDateerror &&                            
                                    detail.parameters === "Bag Weight")
                                ? "dateError"
                                : "" ||
                                (isDateerror &&                           
                                  detail.parameters === "Minimum Traded Quantity")
                                ? "dateError"
                                : ""
                            }
                          >  
                          {detail.parameters==="Procurement Date*"?"Procurement Start Date*":detail.parameters}
                              {/* {detail.parameters} */}
                          </td>
                         
                          {/* <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "trade"
                              )
                            }
                            contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.specifications}
                          </td> */}
                            {detail.parameters=="Procurement Date*" || detail.parameters === "Procurement Start Date*" || detail.parameters=="Procurement End Date*"?
                          <td
                         
                          
                        >
                          <input type="date" 
                            suppressContentEditableWarning={true}
                              style={{border:"1px solid transparent",font:"70%",fontSize:"85%",width:"100%"}}
                              value={detail.specifications}
                            onChange={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "trade"
                              )
                            }
                            disabled={this.disableEditingParams()}> 

                            {/* // contentEditable={detail.active ? "true" : "false"}> */}
                          </input>
                          
                        </td>



                           : 
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "trade"
                              )
                            }
                            contentEditable={this.disableEditing(detail.active )}

                            // contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.specifications}
                          </td>
                           } 
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeRemarks(index, detail, e, "trade")
                            }
                            contentEditable={this.disableEditing(detail.active )}
                            // contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.remarks}
                          </td>
                          {isProcEdit ? (
                            <td className="td-checkbox">
                              <input
                                onChange={(e) =>
                                  this.checkboxChange(index, detail, e, "trade")
                                }
                                type="checkbox"
                                checked={detail.active ? "checked" : ""}
                                disabled={checkDisable(detail)}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                          {/* {isSpecerror &&
                          detail.parameters === "Procurement Date*" || detail.parameters === "Procurement Start Date*" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.dateError}
                            </td>
                          ) : (
                            ""
                          )} */}
                          {isDateerror &&
                          detail.parameters === "Price (₹/ Quintal) *" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                          {isDateerror &&
                          detail.parameters === "Bag Size" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                          {isDateerror &&
                          detail.parameters === "Bag Weight"? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                          {isDateerror &&
                          detail.parameters === "Minimum Traded Quantity"? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                            {/* {isProcEnderror &&
                          detail.parameters === "Procurement End Date*" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.showendError}
                            </td>
                          ) : (
                            ""
                          )} */}
                        </tr>
                      ))}
                      {isProcEdit ? (
                        <tr>
                          Add Image:{" "}
                          <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={this.setSelectedImgToState}
                          />
                          {uploadedFileMessage.message.msg !== "" ? (
                            <td
                              colSpan={4}
                              className={`formMessage ${
                                uploadedFileMessage.messageType.type === "error"
                                  ? "errorMessage"
                                  : uploadedFileMessage.messageType.type ===
                                    "success"
                                  ? "successMessage"
                                  : "normalText"
                              } `}
                            >
                              {uploadedFileMessage.message.msg}
                            </td>
                          ) : (
                            <td></td>
                          )}
                        </tr>
                      ) : (
                        ""
                      )}
                      {isProcEdit ? (
                        <tr className="new-params enteringFields">
                          <th
                            colSpan="4"
                            onClick={() => this.otherParams("trade")}
                          >
                            Add other parameter +{" "}
                          </th>
                        </tr>
                      ) : (
                        ""
                      )}
                      {isProcEdit &&
                        this.state.otherParamObjs.map((item, index) => {
                          return (
                            <tr className="newrow procDetail" key={index}>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                style={{ width: "88px " }}
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeParameter(
                                    index,
                                    item,
                                    e,
                                    "tradeOthers"
                                  )
                                }
                              >
                                {item.parameters}
                              </td>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeSpecification(
                                    index,
                                    item,
                                    e,
                                    "tradeOthers"
                                  )
                                }
                              >
                                {item.specifications}
                              </td>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeRemarks(
                                    index,
                                    item,
                                    e,
                                    "tradeOthers"
                                  )
                                }
                              >
                                {item.remarks}
                              </td>
                              {isProcEdit ? (
                                <td className="td-checkbox">
                                  <input
                                    onChange={(e) =>
                                      this.checkboxChange(
                                        index,
                                        item,
                                        e,
                                        "tradeOthers"
                                      )
                                    }
                                    type="checkbox"
                                    checked={item.active ? "checked" : ""}
                                  />
                                </td>
                              ) : (
                                ""
                              )}

                              <td
                                className="td-checkbox"
                                onClick={() =>
                                  this.handleErase(index, "tradeOthers")
                                }
                              >
                                <i className="fa fa-times"></i>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>

                  <Table bordered hover size="sm">
                    <thead>
                      <tr className="dvaraGreenBG">
                        <th colSpan={isProcEdit ? 5 : 4} className="headerComp">
                          Quality Parameters
                        </th>
                      </tr>
                      <tr className="dvaraGreenBG">
                        <th style={{ width: "45%" }}>Parameters</th>
                        <th>Specifications</th>
                        <th>Remarks</th>
                        {isProcEdit ? <th>Active</th> : ""}
                        {isProcEdit ? <th>Action</th> : ""}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQualityDetails.map((detail, index) => (
                        <tr className="procDetail" key={index}>
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeParameter(index, detail, e, "quality")
                            }
                            // contentEditable={detail.active ? "true" : "false"}
                            contentEditable={this.disableEditing(detail.active )}

                          >
                            {detail.parameters}
                          </td>
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "quality"
                              )
                            }
                            // contentEditable={detail.active ? "true" : "false"}
                            contentEditable={this.disableEditing(detail.active )}

                          >
                            {detail.specifications}
                          </td>

                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeRemarks(index, detail, e, "quality")
                            }
                            // contentEditable={detail.active ? "true" : "false"}
                            contentEditable={this.disableEditing(detail.active )}

                          >
                            {detail.remarks}
                          </td>
                          {isProcEdit ? (
                            <td className="td-checkbox">
                              <input
                                onChange={(e) =>
                                  this.checkboxChange(
                                    index,
                                    detail,
                                    e,
                                    "quality"
                                  )
                                }
                                type="checkbox"
                                checked={detail.active ? "checked" : ""}
                                disabled={checkDisable(detail)}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      ))}
                      {isProcEdit ? (
                        <tr className="new-params enteringFields">
                          <th
                            colSpan="4"
                            onClick={() => this.otherParams("quality")}
                          >
                            Add other parameter +{" "}
                          </th>
                        </tr>
                      ) : (
                        ""
                      )}
                      {isProcEdit &&
                        this.state.otherQualityObjs.map((item, index) => {
                          return (
                            <tr className="newrow procDetail" key={index}>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                style={{ width: "88px " }}
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeParameter(
                                    index,
                                    item,
                                    e,
                                    "qualityOthers"
                                  )
                                }
                              >
                                {item.parameters}
                              </td>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeSpecification(
                                    index,
                                    item,
                                    e,
                                    "qualityOthers"
                                  )
                                }
                              >
                                {item.specifications}
                              </td>
                              <td
                                className="enteringFields"
                                contentEditable="true"
                                suppressContentEditableWarning={true}
                                onBlur={(e) =>
                                  this.changeRemarks(
                                    index,
                                    item,
                                    e,
                                    "qualityOthers"
                                  )
                                }
                              >
                                {item.remarks}
                              </td>
                              {isProcEdit ? (
                                <td className="td-checkbox">
                                  <input
                                    onChange={(e) =>
                                      this.checkboxChange(
                                        index,
                                        item,
                                        e,
                                        "qualityOthers"
                                      )
                                    }
                                    type="checkbox"
                                    checked={item.active ? "checked" : ""}
                                  />
                                </td>
                              ) : (
                                ""
                              )}

                              <td
                                className="td-checkbox"
                                onClick={() =>
                                  this.handleErase(index, "qualityOthers")
                                }
                              >
                                <i className="fa fa-times"></i>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                
                
                
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => this.enableEdit(isProcEdit)}
                  align="left"
                  className="fa-pull-left defaultButtonElem"
                >
                  {isProcEdit ? "View" : "Edit"}
                </Button>
                {isProcEdit ? (
                  <Button
                    onClick={this.savingProc}
                    disabled={isProcCreating || isProcEditing}
                    className="fa-pull-right defaultButtonElem"
                  >
                    <div className="formUpLoadSpinnerWrap">
                      {isProcCreating || isProcEditing ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    Save
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  onClick={hideModal}
                  className="fa-pull-right defaultButtonElem"
                >
                  Close
                </Button>
                <span className="clearfix"></span>
              </Modal.Footer>
            </Modal>
            <Modal
              show={createmodalIsOpen}
              onHide={hideModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered /* onEntered={modalLoaded} */
              className="modal-adjust"
            >
              <Modal.Header>
                <Modal.Title>
                  &nbsp;&nbsp;
                  <span className="dvaraBrownText">Procurement</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="farmersUploadWrap" >
                  <Table bordered hover size="sm">
                    <thead>
                      <tr className="dvaraGreenBG">
                        <th
                          colSpan={isSpecerror || isDateerror || isProcEnderror? 5 : 4}
                          className="headerComp"
                        >
                          Trade Parameters
                        </th>
                      </tr>
                      <tr className="dvaraGreenBG">
                        <th style={{width:"1%"}}>Parameters</th>
                        <th>Specifications</th>
                        <th>Remarks</th>
                        <th>Active</th>
                        {isSpecerror || isDateerror || isProcEnderror ? <th>Action</th> : ""}
                      </tr>
                    </thead>
                    <tbody>
                     
                     
                      {initParamsList.map((detail, index) => (
                        <tr className="procDetail" key={index}>
                          {mandateParams(detail)}
                         {detail.parameters=="Procurement Date*" || detail.parameters=="Procurement End Date*" || detail.parameters === "Procurement Start Date*"?
                        
                          <td
                         
                          
                        >
                          <input type="date" 
                            suppressContentEditableWarning={true}
                              style={{border:"1px solid transparent",font:"70%",fontSize:"85%"}}
                            onChange={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "trade"
                              )
                            }
                            contentEditable={detail.active ? "true" : "false"}>
                          </input>
                          
                        </td>



                           : 
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "trade"
                              )
                            }

                            contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.specifications}
                          </td>
                           } 
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeRemarks(index, detail, e, "trade")
                            }
                            contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.remarks}
                          </td>
                          <td>
                            <input
                              onChange={(e) =>
                                this.checkboxChange(index, detail, e, "trade")
                              }
                              type="checkbox"
                              checked={detail.active ? "checked" : ""}
                              disabled={checkDisable(detail)}
                            />
                          </td>

                          {/* {isSpecerror &&
                          detail.parameters === "Procurement Date*"|| detail.parameters === "Procurement Start Date*" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.dateError}
                            </td>
                          ) : (
                            ""
                          )} */}
                          {isDateerror &&
                          detail.parameters === "Price (₹/ Quintal) *" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                           {isDateerror &&
                          detail.parameters === "Bag Size" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                          {isDateerror &&
                          detail.parameters === "Bag Weight"? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                          {isDateerror &&
                          detail.parameters === "Minimum Traded Quantity"? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.PriceError}
                            </td>
                          ) : (
                            ""
                          )}
                            {/* {isProcEnderror &&
                          detail.parameters === "Price (₹/ Quintal) *" ? (
                            <td style={{ color: "red", fontSize: "11px" }}>
                              {this.state.showendError}
                            </td>
                          ) : (
                            ""
                          )} */}
                        </tr>
                      ))}

                      <tr>
                        Add Image:{" "}
                        <input
                          type="file"
                          name="file"
                          accept="image/*"
                          onChange={this.setSelectedImgToState}
                        />
                        {uploadedFileMessage.message.msg !== "" ? (
                          <td
                            colSpan={4}
                            className={`formMessage ${
                              uploadedFileMessage.messageType.type === "error"
                                ? "errorMessage"
                                : uploadedFileMessage.messageType.type ===
                                  "success"
                                ? "successMessage"
                                : "normalText"
                            } `}
                          >
                            {uploadedFileMessage.message.msg}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </tr>
                      <tr className="new-params enteringFields">
                        <th
                          colSpan="4"
                          onClick={() => this.otherParams("trade")}
                        >
                          Add other parameter +{" "}
                        </th>
                      </tr>
                      {this.state.otherParamObjs.map((item, index) => {
                        return (
                          <tr className="newrow " key={index}>
                            <td
                              className="enteringFields"
                              contentEditable="true"
                              style={{ width: "88px " }}
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeParameter(
                                  index,
                                  item,
                                  e,
                                  "tradeOthers"
                                )
                              }
                            >
                              {item.parameters}
                            </td>
                            <td
                              className="enteringFields"
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeSpecification(
                                  index,
                                  item,
                                  e,
                                  "tradeOthers"
                                )
                              }
                            >
                              {item.specifications}
                            </td>
                            <td
                              className="enteringFields"
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeRemarks(
                                  index,
                                  item,
                                  e,
                                  "tradeOthers"
                                )
                              }
                            >
                              {item.remarks}
                            </td>
                            <td className="td-checkbox">
                              <input
                                onChange={(e) =>
                                  this.checkboxChange(
                                    index,
                                    item,
                                    e,
                                    "tradeOthers"
                                  )
                                }
                                type="checkbox"
                                checked={item.active ? "checked" : ""}
                              />
                            </td>

                            <td
                              className="td-checkbox"
                              onClick={() =>
                                this.handleErase(index, "tradeOthers")
                              }
                            >
                              <i className="fa fa-times"></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <Table bordered hover size="sm">
                    <thead>
                      <tr className="dvaraGreenBG">
                        <th colSpan={4} className="headerComp">
                          Quality Parameters
                        </th>
                      </tr>
                      <tr className="dvaraGreenBG">
                        <th>Parameters</th>
                        <th>Specifications</th>
                        <th>Remarks</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initQualityList.map((detail, index) => (
                        <tr className="procDetail" key={index}>
                          <td>{detail.parameters}</td>
                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeSpecification(
                                index,
                                detail,
                                e,
                                "quality"
                              )
                            }
                            contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.specifications}
                          </td>

                          <td
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              this.changeRemarks(index, detail, e, "quality")
                            }
                            contentEditable={detail.active ? "true" : "false"}
                          >
                            {detail.remarks}
                          </td>
                          <td className="td-checkbox">
                            <input
                              onChange={(e) =>
                                this.checkboxChange(index, detail, e, "quality")
                              }
                              type="checkbox"
                              checked={detail.active ? "checked" : ""}
                              disabled={checkDisable(detail)}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr className="new-params enteringFields">
                        <th
                          colSpan="4"
                          onClick={() => this.otherParams("quality")}
                        >
                          Add other parameter +{" "}
                        </th>
                      </tr>
                      {this.state.otherQualityObjs.map((item, index) => {
                        return (
                          <tr className="newrow " key={index}>
                            <td
                              className="enteringFields"
                              contentEditable="true"
                              style={{ width: "88px " }}
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeParameter(
                                  index,
                                  item,
                                  e,
                                  "qualityOthers"
                                )
                              }
                            >
                              {item.parameters}
                            </td>

                            <td
                              className="enteringFields"
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeSpecification(
                                  index,
                                  item,
                                  e,
                                  "qualityOthers"
                                )
                              }
                            >
                              {item.specifications}
                            </td>
                            <td
                              className="enteringFields"
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              onBlur={(e) =>
                                this.changeRemarks(
                                  index,
                                  item,
                                  e,
                                  "qualityOthers"
                                )
                              }
                            >
                              {item.remarks}
                            </td>
                            <td className="td-checkbox">
                              <input
                                onChange={(e) =>
                                  this.checkboxChange(
                                    index,
                                    item,
                                    e,
                                    "qualityOthers"
                                  )
                                }
                                type="checkbox"
                                checked={item.active ? "checked" : ""}
                              />
                            </td>

                            <td
                              className="td-checkbox"
                              onClick={() =>
                                this.handleErase(index, "qualityOthers")
                              }
                            >
                              <i className="fa fa-times"></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={this.savingProc}
                  disabled={isProcCreating || isProcEditing}
                  className="fa-pull-right defaultButtonElem"
                >
                  <div className="formUpLoadSpinnerWrap">
                    {isProcCreating || isProcEditing ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                  Save
                </Button>
                <Button
                  onClick={hideModal}
                  className="fa-pull-right defaultButtonElem"
                >
                  Close
                </Button>
                <span className="clearfix"></span>
              </Modal.Footer>
            </Modal>
          </Fragment>
          <Modal
            show={updateModalshow}
            onHide={updateModalClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            {/* <Modal.Header closeButton> */}
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Procurement Order:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                {this.state.updateMessage ? (
                  <h4 style={{ color: "green" }}>{this.state.updateMessage}</h4>
                ) : (
                  <span></span>
                )}
                <Row>
                  <Col>
                    <strong> Farmer: </strong>
                    <span className="update-dataColor">
                      {this.state.selectedfarmerName}
                    </span>
                  </Col>
                  <Col>
                    <strong> Phone :</strong>
                    <span className="update-dataColor">
                      {this.state.selectedfarmerPhone}
                    </span>
                  </Col>
                  <Col>
                    <strong>Village: </strong>
                    <span className="update-dataColor">
                      {this.state.selectedfarmerVillage}
                    </span>
                  </Col>
                  {/* <Col>Price: <strong><span> &#x20B9;</span> {selPktPrice}</strong></Col> */}
                  <br />
                  <br />
                </Row>
              </Container>
              <Container>
                <Form>
                  <Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>
                        <strong>Status</strong>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        // size="sm"
                        value={this.state.selectedOrderStatus}
                        custom
                        onChange={(e) => this.onChangeStatus(e)}
                      >
                        {this.state.UpdateState.map((x) => {
                          return <option value={x}>{x}</option>;
                        })}
                        {/* <option value="Pending">Pending</option>;
                              
                                <option value="Accepted">Accepted</option>;
                                 <option value="Completed">Completed</option>;
                                 <option value="Rejected">Rejected</option>;
                                  <option value="Failed to Delivery">Failed to Delivery</option>; */}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong> Execution Date</strong>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className={this.state.updatedateclass}
                        disabled={
                          this.state.selectedOrderStatus === "Accepted"
                            ? false
                            : true
                        }
                        onChange={this.onChangeDate}
                        value={
                          this.state.selectedOrderchooseDate
                            ? this.state.selectedOrderchooseDate
                            : ""
                        }
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group controlId="formGridAddress1">
                    <Form.Label>
                      <strong>Remarks</strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Remarks"
                      disabled={
                        this.state.selectedOrderStatus === "Rejected" ||
                        this.state.selectedOrderStatus === "Failed to Delivery"
                          ? false
                          : true
                      }
                      onChange={this.onChangeRemarks}
                      className={this.state.updateremarksclass}
                      value={this.state.remarks ? this.state.remarks : ""}
                    />
                  </Form.Group>
                </Form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <p className="requiredfields">{this.state.errorremarksmessage}</p>
              <Button variant="primary" onClick={updatehandleClose}>
                Close
              </Button>

              <Button
                onClick={this.saveUpdates}
                style={{ width: "37%" }}
                disabled={this.state.isOrderUpdating}
                variant="success"
              >
                <div className="formUpLoadSpinnerWrap">
                  {this.state.isOrderUpdating ? (
                  
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </div>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
                      show={fullImageOpen}
                      onHide={hideFullImage}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton style={{marginTop:"30px"}}>
                       
                      </Modal.Header>
                      <Modal.Body >
                        <div>
                         <Carousel>
                          
                           {this.state.sellingImageOne!=null&&
                            <Carousel.Item >
                              <div style={{height:"500px"}}>
                              <img src={this.state.sellingImageOne} alt="No Image available" height="100%" width="100%" style={{objectFit:"contain"}}/>
                              </div>
                          
                            </Carousel.Item>
                          }
                             {this.state.sellingImageTwo!=null&&
                            <Carousel.Item>
                            <div style={{height:"500px"}}>
                              <img src={this.state.sellingImageTwo} alt="No Image available" height="100%"width="1005" style={{objectFit:"contain"}}/>
                              </div>
                          
                            </Carousel.Item>
                            }
                  {(this.state.sellingImageTwo===null&& this.state.sellingImageOne===null)?
                   <Carousel.Item>
                     <div style={{height:"500px"}}>
                        <img src={noImageFpo} alt="No Image available" height="100%"width="1005" style={{objectFit:"contain"}}/>
                          </div>
   
                        </Carousel.Item>:""}
                        </Carousel> 
                       
                        
                        </div>
                        </Modal.Body>
          </Modal>
          <Modal
                      show={commoditiesSellingEditOpen}
                      onHide={CommoditiesSellingModalClose}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"> 
                         <span className="modalColor"> Update Order : </span>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body >
                    
                        
                          
                                 
          
                        <Container>
                          <Row style={{marginBottom:"20px",marginLeft:"15px"}}>
                            <Col>Farmer :<span style={{color:"#0069d9"}}> {commoditySellingFrmer}</span>
                               </Col>
                            <Col>Phone : <span style={{color:"#0069d9"}}>{commoditySellingPhone} </span></Col>
                            <Col>Village : <span style={{color:"#0069d9"}}>{commoditySellingVillage}</span></Col>

                          </Row>
                          <Form>
                            <Row>
                            <Col sm={6}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Category</strong>
                               
                                </Form.Label>
                                <Form.Control
                                      as="select"
                                      value={CommodityCategoryListDropdownValue}
                                      className={this.state.CommodityCategoryListDropdownValueclass}
                                      custom
                                      size="sm"
                                      onChange={this.handleCommodityCategoryListDropdown}
                                    >
                                      <option value="">
                                        --SELECT Category--
                                      </option>
                                      {this.CommodityCategoryListDropdown(
                                        getCommodityCategoryList
                                      )}
                                    </Form.Control>
                              </Form.Group>
                              </Col>
                              <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Commodity Name</strong>
                      </Form.Label>
                      <Form.Control
                        as="select"
                      
                        className={this.state.CommodityCategoryNameDropdownValueclass}
                        value={this.state.CommodityCategoryNameDropdownValue}
                        onChange={(e)=>this.onChnageCommodityCategoryNameDropdown(e.target.value)}


                        >
                           <option value="">
                                        --SELECT Commodity--
                            </option>
                            {this.CommodityCategoryNameDropdown(
                                        getCommodityNameDropdownList
                                      )}

                        </Form.Control>
                    </Form.Group>
                    </Col>
                             
                              </Row>
                              <Row>
                      {/* <Col md="6">
                      <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> FPO Offered Price/Quintals</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className={this.state.CommoditysellingOfferedPriceClass}

                        value={this.state.CommoditysellingOfferedPrice}
                        onChange={this.handleCommoditysellingOfferedPrice}

                       
                       

                        >
                        </Form.Control>
                        <p className="requiredfields">{this.state.sellingPriceMessage}</p>

                    </Form.Group>
                    </Col> */}
                     <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Offered Price by FPO </strong>
                      </Form.Label>

                        {/* <div style={{display:"flex"}}>
                        <input type="text" 
                        className={this.state.offeredQuantityclass}

                        value={this.state.CommoditysellingOfferedPrice}
                        onChange={this.handleCommoditysellingOfferedPrice}

                        />
                        <select id="units" 
                        value={selectedunitvalueSelling} 
                        className={this.state.selectedunitvalueclass}
                        onChange={this.handleUnitChangeSelling}>
  
                      <option value="">--Select Unit--</option>
                    
                      {this.showUnitList(unitlist)}



                                      
                                      </select>

                        
                          </div> */}
                           <Form.Control
                                type="text"
                                className={this.state.offeredQuantityclass}
                                value={this.state.CommoditysellingOfferedPrice}
                                onChange={this.handleCommoditysellingOfferedPrice}
                                >
                                </Form.Control>
                          <p className="requiredfields">{this.state.sellingPriceMessage}</p>
                    </Form.Group>
                    </Col>
                    <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Execution Date </strong>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        // min={this.state.CommoditysellingExeDateDisable}
                        min={new Date().toISOString().split("T")[0]}
                        max={this.CurrentDateMaximum()}

                        className={this.state.CommoditysellingExeDateClass}
                        value={this.state.CommoditysellingExeDate}
                        onChange={this.handleCommoditysellingExeDate}
                       
                       

                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                            
                 
                  
                            
                              </Row>
                             <Row>
                          
                             <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor">Location alloted for Delivery</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        
                        className={this.state.CommoditysellingLocationclass}

                        value={this.state.CommoditysellingLocation}
                        onChange={this.handleCommoditysellingLocation}

                       
                       

                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                              <Col md={6}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Status</strong>
                               
                                </Form.Label>
                                <Form.Control
                        as="select"
                        size="sm"
                        custom
                        className={this.state.CommoditysellingStatusClass}

                        onChange={this.handleCommoditysellingStatus}
                        value={this.state.CommoditysellingStatus} 
                      >
                        <option value=""> Select Status </option>
                          <option value="Raised">Raised</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Failed">Failed</option>
                          <option value="Rejected">Rejected</option>




                       
                       
                      </Form.Control>
                              
                             
                              
                              </Form.Group>
                            
                              </Col>
                             </Row>
                           
                            <Form.Group controlId="formGridAddress1 ">
                              <Form.Label>
                                <strong className="update-TextColor remarksposition">Remarks (FPO)</strong>
                              </Form.Label>
                              <Form.Control
                              style={{position:"relative",left:"2%"}}
                                as="textarea"
                                placeholder="Remarks"
                                className={this.state.CommoditysellingRemarksClass}

                                value={this.state.CommoditysellingRemarks}
                                onChange={this.handleCommoditysellingRemarks}
                                >
          
                                </Form.Control>
                            
                            </Form.Group>
                          </Form>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                      <p className="requiredfields">{this.state.InterestMessage}</p>

                        <Button variant="primary" onClick={CommoditiesSellingModalClose}>
                        <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="dvaraBrownText"
                              title="Save Edits"
                            />&nbsp;
                          Close
                        </Button>
          
                        <Button
                          variant="success"
                          disabled={this.handlesellingStatusDisabled()}

                          onClick={this.SaveCommodityInterest}
                        > 
                          <FontAwesomeIcon
                              icon={faSave}
                              className="dvaraBrownText"
                              title="Save Edits"
                            />&nbsp;
                          Save Changes
                        
                          
                        </Button>
                      </Modal.Footer>
                    </Modal>
        </section>
      );
    } else {
      return (
        <section className="mainWebContentSection">
          <Fragment>
            <div className="landholdingHeader wrap">No Data Available</div>
          </Fragment>
        </section>
      );
    }
  }
}