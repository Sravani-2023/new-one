import React, { Component, Fragment, useState, Suspense, lazy } from "react";
import UserService from "../services/user.service";

import Catalog from "react-catalog-view";
import Chart from "react-google-charts";

/** Importing CSS Files **/

import "../assets/css/inputproducts.css";
import {TriggerAlert,} from './dryfunctions'

import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  ProgressBar,
  ProgressBarProps,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  Modal,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalProps,
  ModalTitle,
  ModalDialogProps,
  Button,
} from "react-bootstrap";
import { HTML5_FMT } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHtml5, faHome } from "@fortawesome/free-brands-svg-icons";
import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import farmer_sowing from "../assets/img/farmer_sowing.gif";
import noImageFpo from "../assets/img/noImageFpo.jpg";

import AuthService from "../services/auth.service";

const decimal_accept = /^[+-]?\d*(?:[.,]\d*)?$/;
//comments
 // have used class Component and inside that have decrlared all the needed variable in this.state.
  //  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class ProductData extends Component {
  //const [products,setProducts] = useState([])
  constructor(props) {
    super(props);
    // this.navigateToPage = this.navigateToPage.bind(this); //this is used for navigation to different page 
    //these functions r used inside a Modal PopUp.
    this.handleCtgrChange = this.handleCtgrChange.bind(this);
    this.handleSubCtgrChange = this.handleSubCtgrChange.bind(this);
    this.setSelectedImgToState = this.setSelectedImgToState.bind(this);
    this.handleCropName = this.handleCropName.bind(this);
    this.handleCompany = this.handleCompany.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleActPrice = this.handleActPrice.bind(this);
    this.handleOffPrice = this.handleOffPrice.bind(this);
    this.handleDiscount = this.handleDiscount.bind(this);
    this.handleAvailability = this.handleAvailability.bind(this);
    this.handleIsAvailabe = this.handleIsAvailabe.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleInputFilter = this.handleInputFilter.bind(this);
    this.handleSubCatInputChange = this.handleSubCatInputChange.bind(this);
    this.handleDeliveryMode = this.handleDeliveryMode.bind(this);
    this.handleDesctiption = this.handleDesctiption.bind(this);


    
    this.fileUploadProcessMessage = {
      message: "",
      messageType: "",
    };
    this.fileUploadProcessMessage2 = {
      message: {msg:null},
      messageType: "",
    };
    this.state = {
      inputList: [],
      filterInputs: [],
      isDataAvailable: false,
      loading: true,
      categorylist: [],
      subcategorylist: [],
      unitlist: [],
      modalIsOpen: false,
      modalShow: false,
      cropname: "",
      product_description:"",
      product_description_message:"",
      service_subcat_name:"",
      SelCatgry: 0,
      Selunit: 0,
      SelSubCtgr: 0,
      SubCtgrLoading: false,
      uploadedFileMessage: this.fileUploadProcessMessage,
      isCropCreating: false,
      selectedInputImg: null,
      isFileFormatValid: true,
      ImgUploadedStatus: false,
      // SelUnit: "Kg",
      company: "",
      size: "",
      actPrice: "",
      OffPrice: "",
      discount: "",
      availibility: "",
      is_available: false,
      ofdprcmsg: "",
      product_id: -1,
      is_product_edit: false,
      value: "",
      show: false,
      visible:8,
      inputType: "all",
      check_ParentFpo:"",
      check_ParentSupervisor:"",
      accessed_supervisor:"",
      logged_supervisor:"",
      isParentLogged: false,
      deliverymode:"",
      productdeliveryclass:"",
      fpoName: localStorage.getItem('fpoName'),
      currentFpo:"",
    };
  }
  //this is used for navigation to dashboard and inputOrder.

  navigateMainBoard = () => {
    const {isParentLogged} = this.state
    if(isParentLogged){
      this.props.history.push("/fpohomeData");
    }
    else{
      this.props.history.push("/dashboard");
    }
  }

  navigateToComponent = (pageName) => {
    const { fpoName, isParentLogged } = this.state
    if(isParentLogged){
      this.props.history.push("/inputorders/" + fpoName);
    }
    else{
      this.props.history.push("/" + pageName + "");

    }
  };
 //in ModalPopUp under Category name this function is called.
  handleCtgrChange = (e) => {
    this.setState(
      {
        SelCatgry: e.target.value,
        SubCtgrLoading: true,
        SelCatgryClass:"",
      },
      //after fetching the category according to category choosed we r fetching options for subcategory .Under this we r calling the api for subCategory.
      this.fetchSubCtgrList(e.target.value)
    );
  };
  // this is called under subCategory .here we can choose subcategory from options available.
  handleSubCtgrChange = (e) => {
    this.setState({ SelSubCtgr: e.target.value,SelSubCtgrClass:"" });
    //  console.log("sub category22",this.state.SelSubCtgr)

  };
  // this is called under Crop/Product .
  handleCropName = (e) => {
    this.setState({ cropname: e.target.value,cropnameclass:"" });
  };
   // this is called under subCategory .here we can r not giving options  to choose so whenever show==false then this function
   //is trigerred else handleSubCtgrChange is triggered.
  handleSubCatInputChange = (e) => {
    this.setState({ service_subcat_name: e.target.value,SelSubCtgrInputClass:"" });
  };
  // this is called under Company Name in ModalPopUp. 
  handleCompany = (e) => {
    this.setState({ company: e.target.value,companyclass:"" });
  };

  handleDesctiption = (e) => {
    if(e.target.value.length>249)
    {
      this.setState({
        product_description_message:"Length should be less then 250"
      })
    }
    else
    this.setState({ product_description: e.target.value,product_descriptionclass:"",product_description_message:"" });
  };
    // this is called under Size/Quantity in ModalPopUp. Here we r checking input value must be a number and length 
    //should be >= 8 . accordingly we r displaying the error message.

  // handleSize = (e) => {
  //   if (isNaN(e.target.value) == false) {
  //     if (e.target.value.length >8){
  //       this.setState({ sizemessage: "Number is not adquate" });
  //     }
  //     else{
  //     this.setState({ size: e.target.value,sizeclass:"",sizemessage:"" });
  //   }
  //   }
  //   else{
  //     this.setState({ sizemessage: "Size value must be a number" });
  //   }
  // };
  handleSize = (e) => {
     
    let validDateRegEx =/^[\d]*$/;
  

    if (validDateRegEx.test( e.target.value)) {
      this.setState({
        size: e.target.value,
        sizeclass:"",
        sizemessage:""
      });
    } else {
      this.setState({
        sizemessage:"Size value must be a number",
          });
    }
  
};
CurrentDateMaximum=()=>{
  const{sellingOrderCreatedDate}=this.state;
  let futureDate= new Date(sellingOrderCreatedDate);
  //  console.log("futureDate",futureDate,sellingOrderCreatedDate)
   let futureCopyDate = futureDate.setDate(new Date(futureDate).getDate() + 90); 
   let exa = new Date(futureCopyDate) //.toISOString().split("T")[0]
    // console.log("exa",exa.getMonth(),exa.getFullYear(),exa.getDate())
     let sendMaxDate=`${exa.getFullYear()}-${exa.getMonth()}-${exa.getDate()}`
    //  console.log("sendMaxDate",sendMaxDate)
     return sendMaxDate
}
    // this is called under Unit Name in ModalPopUp. 

  handleUnitChange = (e) => {
    this.setState({ Selunit: e.target.value,Selunitclass:"" });
  };
    // this is called under Actual Price in ModalPopUp. Here we r making any changes in the actual price we r emptyng offered price and discount
    // as these two fields r dependent on actual parice .

  handleActPrice = (e) => {
    if (decimal_accept.test(e.target.value)) {
      this.setState({
        actPrice: e.target.value,
        ofdprcmsg: "",
        OffPrice: "",
        discount: "",
        actPriceclass:"",
      });
    }
  };
    // this is called under Offered Price in ModalPopUp. Here we r checking validation like offered price should be less then actual price. 
    // and accordingly we r calculating discount .

  handleOffPrice = (e) => {
    this.setState({
      ofdprcmsg: "",
      discount: "",
      OffPriceclass:"",
    });
    const actprc = this.state.actPrice;
    var disc = "";
    if (isNaN(e.target.value) == false) {
    if (actprc !== "") {
      if (decimal_accept.test(e.target.value)) {
        const ofdprc = e.target.value;
        
        if (parseFloat(actprc) < parseFloat(ofdprc)) {
          // console.log(actprc, ofdprc);
          this.setState({
            ofdprcmsg: "Offered Price should less than Actual Price",
            OffPrice: "",
            discount: "",
            offeredpricemsg:"",
          });
        } else {
          if (e.target.value !== "") {
            disc =
              ((parseFloat(actprc) - parseFloat(ofdprc)) * 100) /
              parseFloat(actprc);
          }
          this.setState({ OffPrice: e.target.value, discount: disc,offeredpricemsg:"" });
        }
      }
    } else {
      this.setState({
        ofdprcmsg: "Offered Price should less than Actual Price",
        OffPrice: "",
      });
    }
  }
  else{
    this.setState({offeredpricemsg:"Offered price must be number"})
  }
  };
    // this is called under Discount in ModalPopUp. 

  handleDiscount = (e) => {
    this.setState({ discount: e.target.value });
  };
    // this is called under Availability in ModalPopUp. Here we r displaying the date.

  handleAvailability = (e) => {
    this.setState({ availibility: e.target.value });
  };
    // this is called under IsAvailable in ModalPopUp. Here we r using checkbox to check the Availability.

  handleIsAvailabe = (e) => {
    this.setState({ is_available: e.target.checked });
  };
  //this is called under Input type in modal PopUp.
  // here initially we r checking if the required input is a service or product.Then according to that we r calling a UserService for Catogory and we r 
  // also fetching data for subCategory in the function fetchSubCtgrList and UserService for getUnitList also.
  // we r calling three UserService here i.e for Category,Subcategory , Unit.
  // at the same time if UserService will return any error we r displaying it .
  handleCategoryChange(event) {
    // let show = false
    // console.log("event",event)
    if (event!=undefined&&event.target.value == "service"){
      this.setState({show: true,productserviceclass:"",is_service:'1' })
    }
    else{
      this.setState({show: false,productserviceclass:"",is_service:'0' })
    }

    let value=event!=undefined?event.target.value:"product";

    this.setState({ is_prod_service: value,productserviceclass:"" });
    // console.log("value calling",value)
    UserService.getCategoryList(value).then(
      (response) => {
        // console.log("getCategoryList_compDidMnt ", response.data.success);
        if (response.data.success==true){
        this.setState({
          categorylist: response.data.data,
          SelCatgry: response.data.data[0].id,
          SubCtgrLoading: true,
        });
        this.fetchSubCtgrList(this.state.SelCatgry);
      }
      else {
        this.setState({
          modalIsOpen:false,
        })
        if (response){
          TriggerAlert("Error",response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      }
      },
      (error) => {
        this.setState({
          modalIsOpen:false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response){
          TriggerAlert("Error",error.response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      }
    );

    UserService.getUnitList(value).then(
      (response) => {
        if (response.data.success==true){
        // console.log("getunitlist ", response.data);
        this.setState({
          unitlist: response.data.data,
          Selunit: response.data.data[0].id,
        });
      }
      else {
        if (response){
          TriggerAlert("Error",response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      }
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
        if (error.response){
          TriggerAlert("Error",error.response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      }
    );
  }
  handleDeliveryMode = (e) => {
    this.setState({ deliverymode: e.target.value,productdeliveryclass:"" });
  };
  //this function is called in ModalPoUp at the time of Editing i.e on click on pencil in cards .
  fetchUnitList = (e, unit_id = null) => {
    // this.setState({
    //   SubCtgrLoading: true
    // })
    var unit = -1;
    //subcategorylist
    // console.log("before category fetch ", e);
    UserService.getUnitList(e).then(
      (response) => {
        if (unit_id) {
          unit = unit_id;
        } else {
          unit = response.data.data[0].id;
        }
        this.setState({
          unitlist: response.data.data,
          Selunit: unit,
          // SubCtgrLoading: false,
        });
      },
      (error) => {
        this.setState({
          // SubCtgrLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  };
    //this function is called in ModalPoUp at the time of Editing i.e on click on pencil in cards .


  fetchCtgrList = (e, cat_id = null) => {
    this.setState({
      SubCtgrLoading: true,
    });
    var Cat = -1;
    //subcategorylist
    // console.log("before category fetch ", e);
    UserService.getCategoryList(e).then(
      (response) => {
        if (cat_id) {
          Cat = cat_id;
        } else {
          Cat = response.data.data[0].id;
        }
        this.setState({
          categorylist: response.data.data,
          SelCatgry: Cat,
          SubCtgrLoading: false,
        });
      },
      (error) => {
        this.setState({
          SubCtgrLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  };
    //this function is called for filtering the cards. Filtering cards on the basic of Service , Product .
    

  handleInputFilter = (e) => {
   
   
      let inputVal = e.target.value
      // alert(inputVal)
    
      const filterList = this.state.inputList
    this.setState({ inputType: inputVal });
     if (this.state.filterInputs === null) {
       return;
     }
      var data = filterList.filter(function (product) {
        if (inputVal == 1) {
          return product.is_service == 1
              
        } else if (inputVal == 0) {
          return product.is_service == 0
        }
        else {
          return filterList
        }
      })
      this.setState({
        filterInputs: data
      })
   
    // console.log("filtered data:", data)
  };
  //this function is called inside a Search Box to search For a specific product based on its name .
  handleSearchChange = (e) => {
      
    
    let searchKey = e.target.value;
    const filterList = this.state.inputList;

    this.setState({ value: searchKey });
     if (this.state.filterInputs === null) {
       return;
     }
    var data = filterList.filter(function (product) {
      if (searchKey === "") {
        return filterList;
      } else {
        return (
          product.serarchkey.toLowerCase().includes(searchKey.toLowerCase()) //||
          // product.input_prod_category.toLowerCase().includes(searchKey) ||
          // product.input_prod_subcategory.toLowerCase().includes(searchKey) ||
          // product.product.toLowerCase().includes(searchKey)
        );
      }
    });
    this.setState({
      filterInputs: data,
    });
   
    // console.log("dearch:  ", data);
  };
  // SelectImage is checking the image . if url is null then this function is assingning a default image .
  SelectImage = (data) => {
    let newImage=noImageFpo
  // let newImage="https://askleo.askleomedia.com/wp-content/uploads/2004/06/no_image-300x245.jpg"
  // let newImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWoBMrItzoASn4r5zHCBieVZ8Y7lAvMwQTgg&usqp=CAU"
  // let newImage="https://image.shutterstock.com/image-vector/unavailable-flat-style-busy-sign-260nw-646745005.jpg"

    if (data === null) {
      return newImage;
    } else return data;
  };
  // fetchSubCtgrList is checking for the SubCategory .
  fetchSubCtgrList = (e, sub_cat_id = null) => {
    this.setState({
      SubCtgrLoading: true,
    });
    var subCat = -1;
    //subcategorylist
    // console.log("before subcategory fetch ", response.data.data[0].id);
    // console.log("in subcat",e);
    UserService.getSelSubCtgrList(e).then(
      (response) => {
        // console.log("before subcategory fetch ", response.data);
        
        if (sub_cat_id) {
          subCat = sub_cat_id;
        } else if(response.data.data.length > 0) {
          subCat = response.data.data[0].id;
        }
        this.setState({
          subcategorylist: response.data.data,
          SelSubCtgr: subCat,
          SubCtgrLoading: false,
        });
      },
      (error) => {
        this.setState({
          SubCtgrLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  };
  // in modalPopup accrding to the Input Type choosen we r mapping the category options.
  createCtgrOptions = (categorylist) =>
    categorylist.length
      ? categorylist.map((data) => (
          <option key={data.id} name={data.input_category} value={data.id}>
            {data.input_category}
          </option>
        ))
      : "";
    // in modalPopup accrding to the Input Type choosen we r mapping the Unit options.

  createUnitOptions = (unitlist) =>
    unitlist.length
      ? unitlist.map((data) => (
          <option key={data.id} name={data.unit_name} value={data.id}>
            {data.unit_name}
          </option>
        ))
      : "";
  // in modalPopup accrding to the Input Type choosen we r mapping the Subcategory options.

  createSelSubCtgrOptions = (subctgrlist) =>
    subctgrlist.length
      ? subctgrlist.map((data) => (
          <option key={data.id} name={data.input_sub_category} value={data.id}>
            {data.input_sub_category}
          </option>
        ))
      : "";
       


      // this function is called inside modal PopUp .Here we r checking the wheather the file uploaded by the user
      // is in correct format or not likewise we r throwing the error i.e we r checking the file validations.
      validateFileUploaded = (event) => {
    let file = event.target.files[0];
    let size = 0;
    // let allowedFormat = "image"
    let err = "";
    // console.log("file.size",file.size);
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
        // this function is called inside modal PopUp .Here we r checking the wheather the file uploaded by the user

  setSelectedImgToState = (event) => {
    // console.log("file check in image",event)
    var file = event.target.files[0];
    // console.log("file",file);
    let fileValidateResults = this.validateFileUploaded(event);
    let fileValidateResultStatus = fileValidateResults.status;
    let fileValidateResultMsg = fileValidateResults.msg;
    let fileValidateResultMsgType = fileValidateResults.msgType;
    if (fileValidateResultStatus) {
      // console.log("file2",file);
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
  appendMessageData(msg, type) {
    this.fileUploadProcessMessage.message = "";
    this.fileUploadProcessMessage.messageType = "";
    this.fileUploadProcessMessage.message = { msg };
    this.fileUploadProcessMessage.messageType = { type };
    // console.log(this.fileUploadProcessMessage);
    this.setState({
      uploadedFileMessage: this.fileUploadProcessMessage,
      isCropCreating: false,
    });
  }
  // on click on save button inside modal popup we r checking the validations .
  // here we r checking for required fields and for error we are displaying the message.
  handleInputProductFormValidation = () => {
   
    let errors = false
    // console.log(this.state.is_service)
    // console.log(this.state.is_prod_service)
    if (this.state.is_prod_service == undefined & this.state.is_service==undefined){
    if (this.state.is_service == "" | this.state.is_service == undefined){
      errors = true
      this.setState({productserviceclass:"requiredinputfields"})
    }
  }
  if (this.state.is_service == "-1"){
    errors = true
      this.setState({productserviceclass:"requiredinputfields"})
  }
    if (this.state.SelCatgry ==""){
      errors = true
      this.setState({SelCatgryClass:"requiredinputfields"})
    }
    // alert(this.state.is_service)
    
    if (this.state.is_prod_service=="service" | this.state.is_service==1){
      if (this.state.service_subcat_name==""){
        errors = true
        this.setState({SelSubCtgrInputClass:"requiredinputfields"})
      }
    }
    else if (this.state.is_service==undefined & this.state.is_prod_service == undefined){
      this.setState({SelSubCtgrClass:"requiredinputfields"})
    }
    else if (this.state.is_prod_service=="product" | this.state.is_service==0){
      if (this.state.SelCatgry == 0){
        errors = true
        this.setState({SelSubCtgrClass:"requiredinputfields"})
      }
    }
    // else {
    //   errors = true
    //   this.setState({SelSubCtgrClass:"requiredinputfields"})
    // }
    
     
    if (this.state.company == ""){
      errors = true
      this.setState({companyclass:"requiredinputfields"})
    }
    if (this.state.cropname == ""){
      errors = true
      this.setState({cropnameclass:"requiredinputfields"})
    }
    if (this.state.product_description == ""){
      errors = true
      this.setState({product_descriptionclass:"requiredinputfields"})
    }
    if (this.state.service_subcat_name == ""){
      this.setState({servicesubcatnameclass:"requiredinputfields"})
    }
    if (this.state.size == "0"){
      errors = true
      this.setState({sizeclass:"requiredinputfields",sizemessage:"Size value must be greater than 0"})
    }
    if (this.state.Selunit == ""){
      errors = true
      this.setState({Selunitclass:"requiredinputfields"})
    }
    if (this.state.actPrice == ""){
      errors = true
      this.setState({actPriceclass:"requiredinputfields"})
    }
    if (this.state.OffPrice == ""){
      errors = true
      this.setState({OffPriceclass:"requiredinputfields"})
    }
    if (this.state.deliverymode === "null" || this.state.deliverymode ==""){
      errors = true
      this.setState({productdeliveryclass:"requiredinputfields"})
    }
    
    
    
    if (errors == false){
      this.setState({errormessage:"",isCropCreating:false})
      return true
    }
    else {
      // console.log("Required fields must be filled")
      this.setState({errormessage:"Required fields must be filled"})
      return false
    }
    }
  //create input is called on click on save button in a PopUp . here initially we are checking the required validations and then 
  // sending the data to the UserService.
  //initially we r checking wheather we r editing or creating the Input and accordinly we are choosing UserService.
  createInput = () => {
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)){
      TriggerAlert(
        "Error",
        "You Do not have access to Edit.",
        "error"
      );
      return false
    }
    var form = document.forms.namedItem("fileinfo");
    let success = this.handleInputProductFormValidation()
    const fpoId = localStorage.getItem("fpoId")

    if (success == true){
    
      this.setState({
        isCropCreating: true,
      });
    const data = new FormData();
      // alert(this.state.is_service)
      // alert(this.state.is_prod_service)
      if (this.state.is_prod_service == undefined){
        var prod_service = this.state.is_service
      }
      else {
        var prod_service = this.state.is_prod_service
      }
    data.append("input_category", this.state.SelCatgry);
    data.append("input_sub_category", this.state.SelSubCtgr);
    data.append("brand_name", this.state.company);
    data.append("product", this.state.cropname);
    data.append("product_description", this.state.product_description);
    data.append("service_subcat_name", this.state.service_subcat_name);
    data.append("size", this.state.size);
    data.append("units", this.state.Selunit);
    data.append("actual_price", this.state.actPrice);
    data.append("offered_price", this.state.OffPrice);
    data.append("is_available", this.state.is_available);
    data.append("availability_date", this.state.availibility);
    data.append("is_prod_cat", prod_service);
    data.append("mode_of_delivery", this.state.deliverymode);

    //console.log(data);

    const currFileTypeStatus = this.state.isFileFormatValid;
    const currFileSelectionStatus = this.state.ImgUploadedStatus;
    if (this.state.is_product_edit & (this.state.product_id > 0)) {
      if (this.state.selectedInputImg) {
        data.append("product_Image", this.state.selectedInputImg);
      }
      var flag = false;
      UserService.inputProductEdit(this.state.product_id, data).then(
        (response) => {
          // console.log(response.data);
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              modalIsOpen: false,
              isCropCreating: false,
              loading: true,
            });
            UserService.getInputList(fpoId).then((response) => {
              // console.log(response.data.crops);
              this.setState({
                inputList: response.data.data,
                filterInputs: response.data.data,
                isDataAvailable: true,
                loading: false,
              });
            });
          }
          else {
            if (response){
              TriggerAlert("Error",response.data.message,"error");
            }
            else {
              TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
            }
            this.setState({
              modalIsOpen:false,
            })
          }
          this.appendMessageData(response.data.message, "");
        },
        (error) => {
          flag = true;
          if (error.response){
            TriggerAlert("Error",error.response.data.message,"error");
          }
          else {
            TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
          }
          this.setState({
            modalIsOpen:false,
          })
          // console.log(error);
        },
        setTimeout(() => {
          if(flag==false){
              this.setState({
                  showloader:false,
              });
          TriggerAlert("Error","Response Timed out, Please try again","info");
          // this.props.history.push('/dashboard')
          this.navigateMainBoard()
          }
      }, 30000)
      );
    } else {
      data.append("product_Image", this.state.selectedInputImg);
        // console.log(data);
        var flag = false;
        const fpoId = localStorage.getItem("fpoId")

        UserService.inputProductCreate(data).then(
          (response) => {
            // console.log(response.data);
            flag = true; 
            if (response.data.success || "id" in response.data.data) {
              this.setState({
                modalIsOpen: false,
                isCropCreating: false,
                loading: true,
              });
              // this.props.history.push('/inputs')
              UserService.getInputList(fpoId).then((response) => {
                // console.log(response.data.crops);
                this.setState({
                  inputList: response.data.data,
                  filterInputs: response.data.data,
                  isDataAvailable: true,
                  loading: false,
                });
              });
            }
            else {
              this.setState({
                modalIsOpen:false,
              })
              if (response){
                TriggerAlert("Error",response.data.message,"error");
              }
              else {
                TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
              }
            }
            this.appendMessageData(response.data.message, "");
          },
          (error) => {
            flag = true; 
            // console.log(error);
          },
          setTimeout(() => {
            if(flag==false){
                this.setState({
                    showloader:false,
                });
            TriggerAlert("Error","Response Timed out, Please try again","info");
            // this.props.history.push('/dashboard')
            this.navigateMainBoard()
            }
        }, 30000)
        );
      
    }
  }else {
    console.log("required fields missed")
  }
  };
  
  // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
  //  Here if response is not true then api will through an error message.
  componentDidMount() {
    var flag = false;
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({ isParentLogged:true,currentFpo: this.props.match.params.fpoName })
    }
    this.setState({
      accessed_supervisor:fpoId,
      logged_supervisor: user.user_id
    })
   
   
    UserService.getInputList(fpoId).then(
      (response) => {
        flag = true; 
        // console.log("getInputList didMount", response);
        this.setState({
          inputList: response.data.data,
          filterInputs: response.data.data,
          isDataAvailable: true,
          loading: false,
          check_ParentFpo:response.data.is_parent_fpo,
          check_ParentSupervisor:response.data.is_parent_supervisor,
        });
        // this.handleCategoryChange(null);
      },
      (error) => {
        flag = true; 
        this.setState({
          loading:false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response){
          TriggerAlert("Error",error.response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      },
      setTimeout(() => {
        if(flag==false){
            this.setState({
                showloader:false,
            });
        TriggerAlert("Error","Response Timed out, Please try again","info");
        // this.props.history.push('/dashboard')
        this.navigateMainBoard()
        }
    }, 30000)
    );
    
    // this.handleCategoryChange();
  }
  // on click on Show More button below Cards this function is triggered . 
  // using this function we r showing only limited cards .
  loadMoreItems = () => {
    this.setState((old)=>{
      return {
        visible: old.visible + 12
      }
    })
  }
  CheckHideButton=()=>{
    const{accessed_supervisor,logged_supervisor}=this.state;

    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "hidingButton";
    }
  return "create-product btn view-order-button  text-right download-temp";
  }
  CheckUserParent=()=>{
    const{accessed_supervisor,logged_supervisor}=this.state;

    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return true;
    }
  return false;
  }
 

  render() {
    const {
      inputList,
      isDataAvailable,
      loading,
      modalIsOpen,
      SelCatgry,
      Selunit,
      categorylist,
      unitlist,
      SelSubCtgr,
      subcategorylist,
      SubCtgrLoading,
      uploadedFileMessage,
      isCropCreating,
      filterInputs,
      visible,
      check_ParentFpo,
      check_ParentSupervisor,
      currentFpo
      // SelUnit
    } = this.state;
    const {show} = this.state;
    // showModal function will get triggered on click on a Modal Popup.
    // Inside this we r setting all the variables which r used in a popup.
    // Initially we r setting all the values to empty and then in the nxt setState we are assigning values .
    // console.log("new check upload",uploadedFileMessage)
    const showModal = (val, selecteddata = null) => {
      if(!selecteddata)
      {
        this.handleCategoryChange();

      }
      
      this.setState({
        modalIsOpen: true,
        is_product_edit: false,
        // uploadedFileMessage: this.fileUploadProcessMessage,

        uploadedFileMessage: this.fileUploadProcessMessage2,
        // uploadFileMessage:this.handleFileMessage(),
        SelCatgryClass:"",SelSubCtgrClass:"",companyclass:"",cropnameclass:"",
        servicesubcatnameclass:"",sizeclass:"",Selunitclass:"",actPriceclass:"",
        OffPriceclass:"",is_availableclass:"",
        product_descriptionclass:"",
        // is_service:'-1',
        is_service:'0',

        SelCatgry:[],
        service_subcat_name:"",
        SelSubCtgr:[],
        cropname:'',
        product_description:'',
        company:'',
        size:'',
        Selunit:[],
        actPrice:'',
        OffPrice:'',
        discount:'',
        availibility:'',
        is_available:'',
        productdeliveryclass:"",
        productserviceclass:"",
        errormessage:"",
        deliverymode:"",
      });
      if (selecteddata) {
        console.log(selecteddata)
        this.fetchSubCtgrList(
          selecteddata.category_id,
          selecteddata.sub_category_id
        );
        this.fetchCtgrList(selecteddata.is_service, selecteddata.category_id);
        this.fetchUnitList(selecteddata.is_service, selecteddata.unit);
        if (selecteddata.is_service == 1){
          this.setState({show: true });
        }
        else {
          this.setState({show: false });
        }
        this.setState({
          actPrice: selecteddata.actual_price,
          availibility: selecteddata.availability_date,
          company: selecteddata.brand_name,
          discount: selecteddata.discount,
          product_id: selecteddata.id,
          SelCatgry: selecteddata.category_id,
          Selunit: selecteddata.unit,
          // SelSubCtgr: selecteddata.sub_category_id,
          OffPrice: selecteddata.offered_price,
          selectedInputImg: selecteddata.presigned_url,
          cropname: selecteddata.product,
          service_subcat_name: selecteddata.service_subcat_name,
          
          is_available: selecteddata.is_available,
          is_product_edit: true,
          size: selecteddata.size,
          // SelUnit: selecteddata.units,
          is_service: selecteddata.is_service,
          deliverymode:selecteddata.mode_of_delivery,
          product_description:selecteddata.product_description,
         
        });
      }
    };
     // hideModal function will get triggered on click on a  close button inside Modal Popup.
    // Inside this we r setting all the variables to empty which r used in a popup .
    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
        // uploadedFileMessage: this.fileUploadProcessMessage,
        uploadedFileMessage: this.fileUploadProcessMessage2,

        actPrice: "",
        availibility: "",
        company: "",
        discount: "",
        product_id: -1,
        SelCatgry: 0,
        Selunit: 0,
        OffPrice: "",
        cropname: "",
        service_subcat_name:"",
        size: "",
        is_available: true,
        is_product_edit: false,
        product_description_message:""

      });
    };

    const RenderProductDiv = () => { 
      // this is returning all the Cards which we can see on the browser.
       
     // here we sre using slice method to show only limited cards . Rest  can appear on click on show More button.
      return filterInputs.slice(0,visible).map((product) => {
         
        return (

          









          <div className=" col-sm-6 col-md-4 col-lg-3 mt-3 shadowContainer" key={product.id}>
          {/* <div className=" col-sm-6 col-md-4 col-lg-3 mt-3 " key={product.id}> */}


            <div className="rcv-catalog-card rcv-catalog-card-custom rcv-catalog-card-custom cardHeight" style={{  boxShadow: "inset 2px 2px 24px rgb(182, 176, 176)"
}}>
              <div className="rcv-card-content">
                <div className="crop-image">
                  <a href="#">
                    <img
                      src={this.SelectImage(product.presigned_url)} 
                      // this will check image . if image is null will assign a default image.
                      width="100%"
                     
                      alt="product-image"
                    />
                  </a>
                </div>

                <div className="card-content-height ">
                  <div>
                    <h5 className="responsive-size FontFamilyStyle">
                      <span className="product-category">
                        {product.input_prod_category}/
                      </span>

                      <span className="product-subcategory">
                       
                        {product.is_service === 1
                          ? product.service_subcat_name
                          : product.input_prod_subcategory}
                      </span>
                    </h5>
                   
                    <div className=" varietyText FontFamilyStyle">
                      {product.product} <br />{" "}
                      <span
                        className="quantity-A"
                        // style={{ color: "#007bff " }}
                        // style={{color:"#b311e0",fontWeight:"400"}}
                        style={{color:"#0c6572",fontWeight:"400"}}

                      >
                        ( {product.brand_name} ){" "}
                      </span>
                    </div>
                  </div>
                  <div>
                    {product.discount!="0.00"?
                    <div
                      className="quantity-Amount"
                      style={{
                        fontWeight: "600",
                        textDecorationLine: "line-through",
                        color: "black",
                      }}
                    >
                     
                      ₹ {product.actual_price}
                    </div>
                    :
                    <div
                    className="quantity-Amount"
                    style={{
                      fontWeight: "600",
                     
                      color: "black",
                    }}
                  >
                   
                    ₹ {product.actual_price}
                  </div>}
                    <div className="quantity-Amount">
                      ₹ {product.offered_price} / {product.size} {product.unit_str}
                    </div>
                  </div>
                  <div className="crop-discount">
                    Discount: {product.discount} %{" "}
                  </div>

                  {/* <div className="wrapping-button">
                    <Button
                      className="crops-button"
                      onClick={() => showModal(true, product)}  
                       // display the Modal 
                      id="ThirdButton"
                    >
                      <i className="fa fa-pencil"></i>
                    </Button>
                  </div> */}
                  {/* <div class="po-content"> */}
           {/* <p class="dona"> <Button
                      className=""
                      onClick={() => showModal(true, product)}  
                       // display the Modal 
                      id="ThirdButton"
                    >
                      <i className="fa fa-pencil"></i>
                    </Button></p> */}
             {/* </div> */}
              
              {/* old code */}

             {/* <div class="shadow-content2">  <Button
                      className="crops-buttonWithAnimation"
                      disabled={this.CheckUserParent()}
                      onClick={() => showModal(true, product)}  
                      
                      id="ThirdButton"
                    >
                      <i className="fa fa-pencil"></i>
                    </Button> </div> */}
                    {/* new code */}

                    {!this.CheckUserParent()?
                         <div class="shadow-content2">  <Button
                         className="crops-buttonWithAnimation"
                       
                         onClick={() => showModal(true, product)}  
                         
                         id="ThirdButton"
                       >
                         <i className="fa fa-pencil"></i>
                       </Button> </div>
                       : ""}

                </div>
              </div>
            </div>
           
          </div>
             
        );
        
      });
    
    
    };

    return (
      <div>
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
        {this.state.isParentLogged? 
            <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
              <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
            </div>
          : ""}

        <div className="width-80">
         
          <select
            name="inputtypefilter"
            value={this.state.inputType}
            custom
            className="inputPadding"
            style={{ marginLeft: "10px" }}
            onChange={this.handleInputFilter}  
            //this function is called for filtering the cards. Filtering cards on the basic of Service , Product .

          >
          
            <option value="all">All</option>
            <option value="1">Service</option>
            <option value="0">Product</option>
          </select>
          &nbsp;&nbsp;&nbsp;
          <input
            aria-invalid="false"
            placeholder="Search"
            type="text"
            aria-label="Search"
            className="inputPadding"
            value={this.state.value}
            style={{width:"200px",height:"35px"}}
            onChange={this.handleSearchChange}   
            style={{width:"15%",height:"38px"}}
            //this function is called inside a Search Box to search For a specific product based on its name .

          />
       
          <span className="shift-right">
            <button
              className="create-product btn view-order-button text-right download-temp"
              onClick={() => this.navigateToComponent("inputorders")}
              type="button"
              name="button"
              margin=" 29px 20px;"
            >
              View Orders
            </button>
            <button
              // className="create-product btn view-order-button  text-right download-temp"
              className={this.CheckHideButton()}
              // disabled={this.CheckUserParent()}
              onClick={() => showModal(true)}
              type="button"
              name="button"
              margin=" 29px 20px;"
            >
              <span className="fa fa-plus"></span> Add New Product/Service
            </button>
          </span>
          {/* </div> */}
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
                &nbsp;&nbsp;<span className="dvaraBrownText">Add Input</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="farmersUploadWrap">
                <Form
                  encType="multipart/form-data"
                  method="post"
                  name="fileinfo"
                  autocomplete="off"

                >
                  <br></br>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalInputType"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Input Type
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        size="sm"
                        className={this.state.productserviceclass}
                        // value={SelUnit}
                        custom
                        onChange={this.handleCategoryChange} 
                        // here initially we r checking if the required input is a service or product.Then according to that we r calling a UserService for Catogory and we r 
                        // also fetching data for subCategory in the function fetchSubCtgrList and UserService for getUnitList also.
                      >
                        {/* {console.log("is service ",this.state.is_service)} */}
                     
                        <option
                          value="service"
                          selected={this.state.is_service == 1}
                        >
                          Service
                        </option>
                        <option
                          value="product"
                          selected={this.state.is_service == 0}
                        >
                          Product
                        </option>
                        
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalCtgr"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Category
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        className={this.state.SelCatgryClass}
                        value={SelCatgry}
                        custom
                        size="sm"
                        onChange={this.handleCtgrChange}
                      >
                        <option value="0">--SELECT CATEGORY--</option>
                        {this.createCtgrOptions(categorylist)}
                      </Form.Control>
                    </Col>
                    {SubCtgrLoading ? (
                      <div className="formDistLoadSpinnerWrap">
                        <span className="spinner-border spinner-border-sm"></span>
                      </div>
                    ) : (
                      <div className="formDistLoadSpinnerWrap"></div>
                    )}
                  </Form.Group>
                  {show && (
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalCrop"
                    >
                      <Form.Label
                        className="dvaraBrownText formWeight"
                        column="sm"
                        lg={3}
                      >
                        Sub-Category
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Control
                          size="sm"
                          type="text"
                          className={this.state.SelSubCtgrInputClass}
                          name="service_subcat_name"
                          value={this.state.service_subcat_name}
                          onChange={this.handleSubCatInputChange}
                        />
                      </Col>
                    </Form.Group>
                  )}
                  {!show && (
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalSubCtgr"
                    >
                      <Form.Label
                        column="sm"
                        lg={3}
                        className="dvaraBrownText formWeight"
                      >
                        Sub-Category
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Control
                          as="select"
                          size="sm"
                          className={this.state.SelSubCtgrClass}
                          value={SelSubCtgr}
                          custom
                          onChange={this.handleSubCtgrChange}
                        > 
                        {/* {console.log("sub category",SelSubCtgr)} */}
                          {/* <option value="0">--SELECT SUBCATEGORY--</option> */}
                          {this.createSelSubCtgrOptions(subcategorylist)}
                        </Form.Control>
                      </Col>
                      {SubCtgrLoading ? (
                        <div className="formDistLoadSpinnerWrap">
                          <span className="spinner-border spinner-border-sm"></span>
                        </div>
                      ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                      )}
                    </Form.Group>
                  )}
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalCrop"
                  >
                    <Form.Label
                      className="dvaraBrownText formWeight"
                      column="sm"
                      lg={3}
                    >
                      Crop/Product
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="crop"
                        className={this.state.cropnameclass}
                        value={this.state.cropname}
                        onChange={this.handleCropName}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalCrop"
                  >
                    <Form.Label
                      className="dvaraBrownText formWeight"
                      column="sm"
                      lg={3}
                    >
                      Usage/Description of the Product
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        as="textarea"
                        // type="text"
                        name="product_description"
                        className={this.state.product_descriptionclass}
                        value={this.state.product_description}
                        onChange={this.handleDesctiption}
                      />
                    </Col>
                    <p className="requiredfields" style={{marginLeft:"20px",marginTop:"10px"}}> {this.state.product_description_message}</p>
                  </Form.Group>


                  <Form.Group>
                    <Form.Label
                      column="sm"
                      lg={6}
                      className="dvaraBrownText formWeight"
                    >
                      Select product Image (in{" "}
                      <i className="formWeight">*.jpg, *.png</i> format)
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={this.setSelectedImgToState}
                        style={{height:"30px"}}
                      />
                    </Col>
                    {/* <input type="file" name="file" accept="image/*" onChange={this.setSelectedImgToState} /> */}
                  </Form.Group>
                  <Form.Group as={Row} className="mb-12">
                   
                    {uploadedFileMessage.message.msg !== "" ? (
                      <Form.Label
                        className={`formMessage ${
                          uploadedFileMessage.messageType.type === "error"
                            ? "errorMessage"
                            : uploadedFileMessage.messageType.type === "success"
                            ? "successMessage"
                            : "normalText"
                        } `}
                      >
                        {uploadedFileMessage.message.msg}
                      </Form.Label>
                    ) : (
                      <Form.Label></Form.Label>
                    )}
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalBrand"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Company/Brand
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="text"
                        className={this.state.companyclass}
                        name="crop"
                        value={this.state.company}
                        onChange={this.handleCompany}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalSizw"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Size/Quantity
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="text"
                        className={this.state.sizeclass}
                        name="crop"
                        maxLength={8}
                        value={this.state.size}
                        onChange={this.handleSize}
                         // we r checking input value must be a number and length should be >= 8 . accordingly we r displaying the error message
                        
                      />
                      <p className="requiredfields">{this.state.sizemessage}</p>
                    </Col>
                  </Form.Group>
                  {/* <Form.Group as={Row} className="mb-3" controlId="formHorizontalUnits">
                    <Form.Label column="sm" lg={3} className="dvaraBrownText">Units</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        size="sm"
                        value={SelUnit}
                        custom
                        onChange={this.handleUnitChange}
                      >
                        <option value="Kg">Kg</option>
                        <option value="Grams">Grams</option>
                        <option value="Litre">Litre</option>
                        <option value="Millilitre">Millilitre</option>
                        <option value="Units">Units</option>
                      </Form.Control>
                    </Col>
                  </Form.Group> */}

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalCtgr"
                  >
                    <Form.Label column="sm" lg={3} className="dvaraBrownText formWeight">
                      Units
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        value={Selunit}
                        custom
                        className={this.state.Selunitclass}
                        size="sm"
                        onChange={this.handleUnitChange}
                      >
                        <option selected disabled>
                          --SELECT UNIT--
                        </option>
                        {this.createUnitOptions(unitlist)}
                      </Form.Control>
                    </Col>
                    {SubCtgrLoading ? (
                      <div className="formDistLoadSpinnerWrap">
                        <span className="spinner-border spinner-border-sm"></span>
                      </div>
                    ) : (
                      <div className="formDistLoadSpinnerWrap"></div>
                    )}
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalActPrc"
                  >
                    <Form.Label column="sm" lg={3} className="dvaraBrownText formWeight">
                      Actual Price
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="crop"
                        className={this.state.actPriceclass}
                        pattern="[+-]?\d+(?:[.,]\d+)?"
                        value={this.state.actPrice}
                        onChange={this.handleActPrice}
                        //Here if we r making any changes in the actual price we r emptyng offered price and discount as these two fields r dependent on actual parice .
    
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalOffPrice"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Offered Price
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        className={this.state.OffPriceclass}
                        type="text"
                        name="crop"
                        pattern="[+-]?\d+(?:[.,]\d+)?"
                        value={this.state.OffPrice}
                        onChange={this.handleOffPrice}
                        //Here we r checking validation like offered price should be less then actual price nd accordingly we r calculating discount .
                        
                      />
                      <p className="requiredfields">
                        {this.state.offeredpricemsg}
                      </p>
                      {this.state.ofdprcmsg !== "" ? (
                        <span style={{ color: "red" }}>
                          {this.state.ofdprcmsg}
                        </span>
                      ) : (
                        <span></span>
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalDiscount"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Discount
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="text"
                        disabled
                        name="disount"
                        value={this.state.discount}
                        onChange={this.handleDiscount}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalAvailability"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Availability
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        size="sm"
                        type="date"
                        name="crop"
                        value={this.state.availibility}
                        onChange={this.handleAvailability}
                        min={new Date().toISOString().split("T")[0]}
                        max={this.CurrentDateMaximum()}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalAvailability"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Mode of Delivery
                    </Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        as="select"
                        size="sm"
                        className={this.state.productdeliveryclass}
                        custom
                        onChange={this.handleDeliveryMode}
                        value={this.state.deliverymode} 
                      >
                        <option value="">
                          Select Input type
                        </option>
                        <option
                          value="farmer picks"
                          // selected={this.state.is_service == 1}
                        >
                          Farmer Picks
                        </option>
                        <option
                          value="fpo delivers"
                          // selected={this.state.is_service == 0}
                        >
                          FPO Deliver
                        </option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalisAvlb"
                  >
                    <Form.Label
                      column="sm"
                      lg={3}
                      className="dvaraBrownText formWeight"
                    >
                      Is Available
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        value={this.state.is_available}
                        onChange={this.handleIsAvailabe}
                        name="is_available"
                        id="formHorizontalavailable"
                        checked={this.state.is_available}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <p className="requiredfields">{this.state.errormessage}</p>
              <Button
                onClick={this.createInput}
                disabled={isCropCreating}
                className="fa-pull-right defaultButtonElem"
              >
                <div className="formUpLoadSpinnerWrap">
                  {isCropCreating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </div>
                Save
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                onClick={hideModal}
                className="fa-pull-right defaultButtonElem"
              >
                Close
              </Button>
              <span className="clearfix"></span>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="width-80">
          {/* { console.log("data for fortune",this.state.filterInputs)} */}
          {this.state.loading ? (
                              
                              <img src={farmer_sowing} height="250px" style={{position:"relative",top:"100px",left:"45%"}}/>

            // <span className="spinner-border spinner-border-sm dashboardLoader"></span>
          
          ) : (
            <div>
              <Row className="mt-5" style={{ paddingBottom: "60px" }}>
                {this.state.filterInputs != null ? (
                  <RenderProductDiv />
                ) : (
                  <div className="no-dataRenderproduct">
                    No Data is Available
                  </div>
                )}

                {/* <RenderProductDiv /> */}
              </Row>
              {this.state.filterInputs != null &&
                this.state.visible < this.state.filterInputs.length && (
                  <h1 className="text-center">
                    <Button
                      onClick={() => this.loadMoreItems()}
                      style={{
                        backgroundColor: "rgba(163, 198, 20, 1)",
                        border: "transparent",
                        marginBottom: "20px",
                      }}
                    >
                      Show More
                    </Button>
                  </h1>
                )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
