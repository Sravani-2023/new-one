import React, { Component, Fragment, useState } from "react";
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
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

import "../index.css";
import "../assets/img/fr.svg";
import farmer_farming from "../assets/img/farmer_farming.gif";

import moment from 'moment';
import UserService from "../services/user.service";
import EventBus from "../services/eventbus.service";
import MaterialTable from "material-table";
import { ReactTabulator, reactFormatter } from "react-tabulator"; // for React 15.x, use import { React15Tabulator }
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
// import Map from "./map.component";
// import Map from "./mapnew";
import Table from "./table.component";
import TableClass from "./table.component";
import "../assets/css/farmerlist.css";

import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter";
import tableIcons from "./icons";
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faMap,
  faUpload,
  faFilter, 
  faComment,
  faDownload,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { faMobile } from "@fortawesome/fontawesome-svg-core";
import { faHireAHelper } from "@fortawesome/free-brands-svg-icons";
import { TurnedIn } from "@material-ui/icons";
import {TriggerAlert,} from './dryfunctions';
import jsPDF from "jspdf";
function sortObjsInArray(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}
// have used class Component and inside that have decrlared all the needed variable in this.state.
  //  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class FarmerList extends Component {
  constructor(props) {
    super(props);
    this.fileUploadProcessMessage = {
      message: "",
      messageType: "",
    };
             //initially we are binding all the functions with this.

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleDistChange = this.handleDistChange.bind(this);
    this.handleFRChange = this.handleFRChange.bind(this);
    this.createOptions = this.createOptions.bind(this);
    this.createStateOptions = this.createStateOptions.bind(this);
    this.createDistOptions = this.createDistOptions.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.handleAllIndiaStateChange = this.handleAllIndiaStateChange.bind(this);
    this.handleAllIndiaDistChange = this.handleAllIndiaDistChange.bind(this);
    this.handleAllIndiaBlockChange = this.handleAllIndiaBlockChange.bind(this);
    this.setSelectedFileToState = this.setSelectedFileToState.bind(this);
    this.appendMessageData = this.appendMessageData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.createAdvFilterOptions = this.createAdvFilterOptions.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.handleFIChange = this.handleFIChange.bind(this);
    this.handleserviceChange = this.handleserviceChange.bind(this);
    this.handleDownloadTemplate = this.handleDownloadTemplate.bind(this);
    this.handleUpdatefarmers = this.handleUpdatefarmers.bind(this);
    this.navigateMessage = this.navigateMessage.bind(this);
    this.handleExportData = this.handleExportData.bind(this);

    this.frListSelectorRef = React.createRef();
    this.filterSelectorRef = React.createRef();

    //Defining state variables
    this.state = {
      frlist: [],
      statelist: [],
      distlist: [],
      farmerslist: [],
      showfarmerlistcount:0,
      siteslist: [],
      //variables for upload farmer's location selection
      allIndiaStatesList: [],
      allIndiaSelStateDistList: [],
      allIndiaSelStateDistBlockList: [],
      allIndiaSelStatesID: 0,
      allIndiaSelStateDistID: 0,
      allIndiaSelStateDistBlockID: 0,
      ////////////////////////////////////
      selectedFarmerListFile: null,
      uploadedFileProcessResult: [],
      uploadedFileMessage: this.fileUploadProcessMessage,
      isFileFormatValid: true,
      farmerListFileUploadedStatus: false,
      doesFormElemsContainsError: false,
      formErrorMessage: [],
      frselectedid: 0,
      stateSelectedId: 0,
      distSelectedId: 0,
      blockSelectedId: 0,
      categoryvalue: 1,
      // categoryvalue: 3,

      isActive: false,
      isLoadingFarmersTabData: false,
      isDropDownActionStarted: false,
      isCategoryChangeStarted: false,
      isDistChangeHappened: false,
      isAllIndiaDistListLoading: false,
      isAllIndiaBlockListLoading: false,
      isFarmersListFileUploading: false,
      modalIsOpen: false,
      modalShow: false,
      selectedFarmersSiteBBox: [23, 99],
      defaultadvFilter: "farmers_count",
      advFilterData: [],
      genderData: [],
      activityData: [],
      selectedGender: "-1",
      selectedActivity: "-1",
      selectedService:"-1",
      selectTab: 1,
      distError: false,
      blockError: false,
      stateError: false,
      activityMasterData: [],
      FIlist: [],
      selectedFI: "-1",
      showDownloadLoader: false,
      userFPOName: "",
      errorResponse: [],
      templateUploaded: false,
      cleryId: "",
      intervalId: "",
      currentCeleryStatus: 0,
      isFarmersCeleryrunning: false,
      accessed_supervisor:"",
      logged_supervisor:"",
      isParentLogged: false,
      currentFpo: "",
      farmerMembershipStatus:false,
      seletedVillage:"All",
      farmerStatus:"All",
      duplicatefarmerslistForMembership:[],
      showDownloadLoader:false,
      buttonDisableExport:false,
      showDownloadLoader2:false,
      SearchByNumberMembership:"",
      defaultValueForMemberShip:4,
      SearchByTabName:"",
      SpecialServices : [],
      serviceCategory : []
    };
  }

  // function called on click of Export Button. Will show all the farmers in pdf file.

  handleExportData = (event) => {
    const data = new FormData();
    this.setState({isLoadingFarmersTabData:true})
    
    var farmerdata = this.state.farmerslist
    var todaydate = moment(new Date()).format('MM-DD-YYYY-hh-mm-a')

    var farmeridlist = []
    for(var i=0;i<farmerdata.length;i++){
      farmeridlist.push(farmerdata[i]['user_ptr_id'])
    }
    data.append("farmerids", farmeridlist);
    UserService.ExportFarmerData(data).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "Farmers_"+todaydate+'.xlsx');
      document.body.appendChild(link);
      link.click();
      this.setState({isLoadingFarmersTabData:false})
    });
  }
  //function called on click of Download Template button . will give the xlsx of required tempelate.
// we are calling an api here  and setting the download template to xlsx format.
// if error is coming as a response then we are throwing an Trigger message.
  handleDownloadTemplate = (event) => {
    const user = AuthService.getCurrentUser();
    var flag = false;
    if (user) {
      this.setState({
        userFPOName: user.org,
      });
    }
    this.setState({ showDownloadLoader: true });
    UserService.getDownloadFarmerTemplate().then(
      (response) => {
        flag = true;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.state.userFPOName + ".xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        this.setState({ showDownloadLoader: false });
      },
      (error) => {
        flag = true;
        this.setState({
          showDownloadLoader: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            "Template not found in s3 bucket. Please add them using admin panel.",
            "error"
          );
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
  };

   //Function of checking the farmer's list selection whether frs or location
  //here we are checking which tab is clicked from the buttonGroup and according to thr tab vaue received calling the function for further action.
  checkCategoryInitialChange = (clickedCategoryVal) => {
    this.setState({
      isLoadingFarmersTabData: true,
      selectTab: clickedCategoryVal,
    });

    if (clickedCategoryVal === 1) {
      this.setState({
        isCategoryChangeStarted: false,
        frselectedid: "-1",
        selectedActivity: "-1",
        selectedGender: "-1",
        selectedFI: "-1",
        selectedService:"-1",
        farmerMembershipStatus:false,

      });
      this.handleInitialFRChange("-1");
    } else if (clickedCategoryVal === 2) {
      this.setState({
        isCategoryChangeStarted: true,
        stateSelectedId: "-1",
        selectedActivity: "-1",
        selectedGender: "-1",
        selectedFI: "-1",
        selectedService:"-1",
        farmerMembershipStatus:false,

      });
      this.handleInitialStateChange("-1");
    } 
    else if (clickedCategoryVal === 4) {
      this.setState({
        farmerMembershipStatus:true,
        isCategoryChangeStarted: true,
        isLoadingFarmersTabData:false

      });
      // this.trialRandomApiCall("-1")
      this.RequestMembership("-1")


    }
    else {
      this.setState({
        isCategoryChangeStarted: true,
        defaultadvFilter: "farmers_count",
        selectedActivity: "-1",
        selectedGender: "-1",
        selectedFI: "-1",
        selectedService:"-1",
        farmerMembershipStatus:false,

      });
      this.handleInitialadvFilterChange("farmers_count");
    }
  };
  setDefaultValueForMemberShipFilter=()=>{
    if( this.props.location.search!="")
    {   
      let queryParam= this.props.location.search;

      let SplitqueryParam= queryParam.split("&");
      let SplitqueryParamTabValue= SplitqueryParam[1];
      let SplitqueryTabValue= SplitqueryParamTabValue.split("=")[1];
      if(SplitqueryTabValue==="request-for-membership")
      {
      return 4
      }
      else{
        return 1
      }
    }
    
    else
    {
      return 1
    }
    
  }
  //handling the selection criteria
  // here we r checkig which tab is clicked from the toggleButtonGroup . and according to the tab clicked we are setting value and showing the data.
  handleCategoryChange = (e) => {
    // this.relocateMap();
    this.setState({ categoryvalue: e, isActive: true });
    this.checkCategoryInitialChange(e);
    //this.checkCategoryInitialChange(e);
  };

  //fetching farmer's list on that selection
  // on click on FR wise this is called here we are calling the api .
  // this is also caled on click on select gender box under FR wise to get the data accrding to gender.
    // this is also caled on click on allied activity box under FR wise to get the data accrding .
     // this is also caled on click on Financial Interest under FR wise to get the data accrding .

  initFetchingFarmersList = (e, gender = "-1", activity = "-1", fi = "-1",service = "-1") => {
    const filter = `${gender},${activity},${fi},${service}`;
    var flag = false;
    const fpoId = localStorage.getItem("fpoId")
    var dataVisibleAfterFilter="";
    var showDefaultData=""
    UserService.getFarmerList(e, filter ,fpoId ).then(
      (response) => {
       console.log("reponse",response.data.farmers)
        flag = true;
        if (response.data.success) {
         
          if(this.state.SearchByTabName==="fr-wise")
          {
           showDefaultData=response.data.farmers.filter((farmer)=>farmer.phone=== this.state.SearchByNumberMembership);
           dataVisibleAfterFilter=showDefaultData
          }
          else{
            dataVisibleAfterFilter=response.data.farmers
          }
          this.setState({
            farmerslist: dataVisibleAfterFilter,
            isLoadingFarmersTabData: false,
            genderData: response.data.filters.Common.gender_filter,
            activityData: response.data.filters.Common.allied_activity_filter,
            FIlist: response.data.filters.Common.financial_interest,
            frlist:response.data.filters.FR,
            frselectedid: response.data.filters.FR[0].id,
            showfarmerlistcount:response.data.farmers.length,
            serviceCategory:response.data.filters.Common.service_categories,
            // advFilterData:response.data.filters.Filter


            //frselectedid: response.data[0].id
          }
          );
        }
        else{
          this.setState({
            farmerslist: [],
            showfarmerlistcount:0,
            isLoadingFarmersTabData: false,
          });
        }
      },
      (error) => {
        flag = true;
        this.setState({
          isLoadingFarmersTabData: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "at FarmerList",
            "error"
          );
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
   
  };

  //reloading farmer's list on FR change
   // on click on FR Wise tab this function is called.Inside it we are calling 
  // different function with the value recieved and there we are calling the api for data .
  handleInitialFRChange = (e) => {
    this.setState(
      {
        isLoadingFarmersTabData: true,
      },
      this.initFetchingFarmersList(e)
    );
  };
    // on click on Select FR input box function is trigerred.

  handleFRChange = (e) => {
    this.setState(
      {
        isDropDownActionStarted: true,
        isLoadingFarmersTabData: true,
      },
      this.performFRChange(e)
    );
  };
  // this is trigerred on click on Advance Filter. 


  handleInitialadvFilterChange = (e) => {
    this.setState(
      {
        isLoadingFarmersTabData: true,
      },
      this.initFetchingAdvFarmersList(e)
    );
  };
   // after clicking on Advance filter and then on SElect Filter this function is called .here we are calling an api for data.
  // showing the farmer list .
  // also called to show gender based data.
    // this is also caled on click on allied activity under Advance filter to get the data accrding .
       // this is also caled on click on Financial Interest under Advance filter to get the data accrding .
  initFetchingAdvFarmersList = (
    e,
    gender = "-1",
    activity = "-1",
    fi = "-1",
    service = "-1"
  ) => {
    const filter = `${gender},${activity},${fi},${service}`;
    var flag = false;
    const fpoId = localStorage.getItem("fpoId")

    UserService.getFarmerListByFilter(e, filter,fpoId).then(
      (response) => {
        flag = true;
        if (response.data.success) {
          this.setState({
            farmerslist: response.data.farmers,
            farmerMembershipStatus:false,
            isLoadingFarmersTabData: false,
            genderData: response.data.filters.Common.gender_filter,
            activityData: response.data.filters.Common.allied_activity_filter,
            FIlist: response.data.filters.Common.financial_interest,
            frlist:response.data.filters.FR,
            frselectedid: response.data.filters.FR[0].id,
            showfarmerlistcount:response.data.farmers.length,
            serviceCategory:response.data.filters.Common.service_categories,
            // advFilterData:response.data.filters.Filter
            //frselectedid: response.data[0].id
          });
        }
        else{
          this.setState({
            farmerslist: [],
            showfarmerlistcount:0,
            isLoadingFarmersTabData: false,
          });
        }
      },
      (error) => {
        flag = true;
        this.setState({
          isLoadingFarmersTabData: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "at Farmer List.",
            "error"
          );
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
  };
  // on click on select Filter function is called .Select filter will be shown after clicking on Advance Filter button.

  handleFilterChange = (e) => {
    const { selectedGender, selectedActivity, selectedFI ,selectedService} = this.state;
    this.setState(
      {
        defaultadvFilter: e.target.value,
        isLoadingFarmersTabData: true,
      },
      this.initFetchingAdvFarmersList(
        e.target.value,
        selectedGender,
        selectedActivity,
        selectedFI,
        selectedService
      )
    );
  };
  // on click on gender this function is trigerred. after clicking on Advance filter this will be shown.
// here we are calling an api for gender basis.
  handleGenderChange = (e) => {
    const {
      selectTab,
      stateSelectedId,
      distSelectedId,
      frselectedid,
      defaultadvFilter,
      selectedActivity,
      selectedFI,
      selectedService
    } = this.state;
    this.setState({
      selectedGender: e.target.value,
      isLoadingFarmersTabData: true,
    });
    if (selectTab === 1) {
      this.initFetchingFarmersList(
        frselectedid,
        e.target.value,
        selectedActivity,
        selectedFI,
        selectedService
      );
    } else if (selectTab === 2) {
      this.initFarmersTabPopulate(
        stateSelectedId,
        distSelectedId,
        e.target.value,
        selectedActivity,
        selectedFI,
        selectedService
      );
    } else {
      this.initFetchingAdvFarmersList(
        defaultadvFilter,
        e.target.value,
        selectedActivity,
        selectedFI,
        selectedService
      );
    }
  };
   // this function is called on click on Allied Activity. According to the button group value we are 
  // passing value to get the allied activity list data.
  // eg if we hv clicked on FR wise then in allied activity we are initially checking the value and then accoding to that calling an api .
  handleActivityChange = (e) => {
    const {
      selectTab,
      stateSelectedId,
      distSelectedId,
      frselectedid,
      defaultadvFilter,
      selectedGender,
      selectedFI,
      selectedService
    } = this.state;
    this.setState({
      selectedActivity: e.target.value,
      isLoadingFarmersTabData: true,
    });
    if (selectTab === 1) {
      this.initFetchingFarmersList(
        frselectedid,
        selectedGender,
        e.target.value,
        selectedFI,
        selectedService
      );
    } else if (selectTab === 2) {
      this.initFarmersTabPopulate(
        stateSelectedId,
        distSelectedId,
        selectedGender,
        e.target.value,
        selectedFI,
        selectedService
      );
    } else {
      this.initFetchingAdvFarmersList(
        defaultadvFilter,
        selectedGender,
        e.target.value,
        selectedFI,
        selectedService
      );
    }
  };
  // this function is called on click on Financial Product Interest. According to the button group value we are 
  // passing value to get the Financial Product Interestlist data.
  // eg if we hv clicked on FR wise then on click on  Financial Product Interest. we are initially checking the value and then accoding to that calling an api .
  handleFIChange = (e) => {
    const {
      selectTab,
      stateSelectedId,
      distSelectedId,
      frselectedid,
      defaultadvFilter,
      selectedGender,
      selectedActivity,
      selectedService,
      selectedFI,
    } = this.state;
    this.setState({
      selectedFI: e.target.value,
      isLoadingFarmersTabData: true,
    });
    if (selectTab === 1) {
      this.initFetchingFarmersList(
        frselectedid,
        selectedGender,
        selectedActivity,
        selectedService,
        e.target.value
      );
    } else if (selectTab === 2) {
      this.initFarmersTabPopulate(
        stateSelectedId,
        distSelectedId,
        selectedGender,
        selectedActivity,
        selectedService,
        e.target.value
      );
    } else {
      this.initFetchingAdvFarmersList(
        defaultadvFilter,
        selectedGender,
        selectedActivity,
        selectedService,
        e.target.value
      );
    }
  };
  handleserviceChange = (e) => {
    const {
      selectTab,
      stateSelectedId,
      distSelectedId,
      frselectedid,
      defaultadvFilter,
      selectedGender,
      selectedActivity,
      selectedFI,
    } = this.state;
    this.setState({
      selectedService: e.target.value,
      isLoadingFarmersTabData: true,
    });
    if (selectTab === 1) {
      this.initFetchingFarmersList(
        frselectedid,
        selectedGender,
        selectedActivity,
        e.target.value
      );
    } else if (selectTab === 2) {
      this.initFarmersTabPopulate(
        stateSelectedId,
        distSelectedId,
        selectedGender,
        selectedActivity,
        e.target.value
      );
    } else {
      this.initFetchingAdvFarmersList(
        defaultadvFilter,
        selectedGender,
        selectedActivity,
        e.target.value
      );
    }
  };

  performFRChange = (e) => {
    let changedFRId = e.target.value;
    const { selectedGender, selectedActivity } = this.state;
    const filter = `${selectedGender},${selectedActivity}`;
    var flag = false;
    const fpoId = localStorage.getItem("fpoId")

    UserService.getFarmerList(e.target.value, filter ,fpoId).then(
      (response) => {
        flag = true;
        this.setState({
          farmerslist: response.data.farmers,
          farmerMembershipStatus:false,

          genderData: response.data.filters.Common.gender_filter,
          activityData: response.data.filters.Common.allied_activity_filter,
          FIlist: response.data.filters.Common.financial_interest,
          showfarmerlistcount:response.data.farmers.length,
          serviceCategory:response.data.filters.Common.service_categories,
          // advFilterData:response.data.filters.Filter,

          frselectedid: changedFRId,
          isDropDownActionStarted: false,
          isLoadingFarmersTabData: false,
        });
      },
      (error) => {
        flag = true;
        this.setState({
          isDropDownActionStarted: false,
          isLoadingFarmersTabData: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "at Farmer List",
            "error"
          );
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
  };

  //farmer's list state change
  // on click on Upload details  and then on Select State  inside popup this is called .
  // calling an api and then appendin the data in select state as a dropdown values.
  handleStateChange = (e) => {
    let selectedStateId = e.target.value;
    var flag = false;
    const fpoId = localStorage.getItem("fpoId")
    UserService.getDistList(e.target.value,fpoId).then(
      (response) => {
        flag = true;
        this.setState(
          {
            distlist: response.data.data,
            stateSelectedId: selectedStateId,
            isDistChangeHappened: true,
          },
          this.handleInitialDistChange(
            selectedStateId,
            response.data.data[0].agmarkDistId
          )
        );
      },
      (error) => {
        flag = true;
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "District List.",
            "error"
          );
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
  };
  handleVillageType=(villageType,farmerStat)=>{
    this.setState({
      seletedVillage:villageType,
      farmerStatus:farmerStat
    }, this.filterVillageBasis(villageType,farmerStat))
   
  }
  filterVillageBasis=(villageType,farmerStat)=>{
    let returnListVillage=[];
    let returnListFarmer=[];
           returnListVillage = this.state.duplicatefarmerslistForMembership.filter((product,ind)=> {
            if(villageType==="All")
            return product
            else if (villageType==="Non village")
              return  product.village_master__village_name===null;
            else 
            return  product.village_master__village_name!==null;

                       });

                       returnListFarmer = returnListVillage.filter((product,ind)=> {
                        if(farmerStat==="All")
                        return product
                       
                        else 
                        return  product.onboarded_status==farmerStat;
                                          });



    // if(villageType==="Non village")
    // {
      
    //      returnList = this.state.duplicatefarmerslistForMembership.filter((data,ind)=> {
    //       return  data.village_master__village_name===null;
    //                   });
    // }
    // else
    // {
    //   returnList = this.state.duplicatefarmerslistForMembership.filter((data,ind)=> {
    //     return  data.village_master__village_name!==null;
    //                 });
    // }
    this.setState({
      farmerslist:returnListFarmer
    })

  }
  //handle district change for farmer's popup .
  handleDistChange = (e) => {
    this.setState({
      isDistChangeHappened: true,
      isLoadingFarmersTabData: true,
    });
    const { selectedGender, selectedActivity, selectedFI,selectedService } = this.state;

    this.initFarmersTabPopulate(
      this.state.stateSelectedId,
      e.target.value,
      selectedGender,
      selectedActivity,
      selectedFI,
      selectedService
    );
  };

  //handle state change for farmer's upload change
  handleAllIndiaStateChange = (e) => {
    this.setState(
      {
        allIndiaSelStatesID: e.target.value,
        isAllIndiaDistListLoading: true,
        stateError: false,
      },
      this.fetchAllIndiaDistList(e.target.value)
    );
  };
  //handle district change for farmer's upload change calling fetchAllIndiaBlockList
  handleAllIndiaDistChange = (e) => {
    this.setState(
      {
        allIndiaSelStateDistID: e.target.value,
        isAllIndiaBlockListLoading: true,
        distError: false,
      },
      this.fetchAllIndiaBlockList(e.target.value)
    );
  };
      //handle Block change for farmer's upload change calling fetchAllIndiaBlockList

  handleAllIndiaBlockChange = (e) => {
    this.setState({
      allIndiaSelStateDistBlockID: e.target.value,
      blockError: false,
    });
  };
   // in modal popup under upload farmers list .
  // on click on any filed there we r calling this function.
  // getting a data from api.
  fetchAllIndiaDistList = (e) => {
    var flag = false;
    //allIndiaSelStateDistList
    UserService.getSelStatesDistList(e).then(
      (response) => {
        flag = true;
        let sortedAllIndiaSelStatesDistList = response.data.data.sort(
          sortObjsInArray("distName")
        );
        this.setState({
          allIndiaSelStateDistList: sortedAllIndiaSelStatesDistList,
          isAllIndiaDistListLoading: false,
        });
      },
      (error) => {
        flag = true;
        this.setState({
          isAllIndiaDistListLoading: false,
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
  };

  //Called through district list change function
  fetchAllIndiaBlockList = (e) => {
    //allIndiaSelStateDistList

    UserService.getSelStatesDistBlockList(
      this.state.allIndiaSelStatesID,
      e
    ).then(
      (response) => {
        let sortedAllIndiaSelStatesDistBlockList = response.data.data.sort(
          sortObjsInArray("block_name")
        );
        this.setState({
          allIndiaSelStateDistBlockList: sortedAllIndiaSelStatesDistBlockList,
          isAllIndiaBlockListLoading: false,
        });
      },
      (error) => {
        this.setState({
          isAllIndiaBlockListLoading: false,
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
   // for main page.
  // on click on Location wise this function is trigerred .
  // here initially we are calling an api for Select State and according to the State selected we are calling Dist api.
  handleInitialStateChange = (e) => {
    var flag = false;
    const fpoId = localStorage.getItem("fpoId")

    UserService.getDistList(e,fpoId).then(
      (response) => {
        flag = true;
        this.setState(
          {
            isCategoryChangeStarted: false,
            distlist: response.data.data,
          },
          this.handleInitialDistChange(e, response.data.data[0].agmarkDistId)
        );
      },
      (error) => {
        flag = true;
        this.setState({
          isCategoryChangeStarted: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " " + "at District List"),
            "error"
          );
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
  };
  
    RequestMembership = () => {
    
      var flag = false;
      const fpoId = localStorage.getItem("fpoId")
      UserService.getInterestedFarmers(fpoId).then(
        (response) => {
  
          flag = true;
          if (response.data.success) {
            let showDefaultData=[];
            let  MembershipDuplicateList=[]
            if( this.props.location.search!="")
            {
              
             if(this.state.SearchByTabName==="request-for-membership")
             {  
              showDefaultData=response.data.int_farmers_list.filter((farmer)=>farmer.phone=== this.state.SearchByNumberMembership
              ); 
              MembershipDuplicateList=showDefaultData
             }
             else{
              showDefaultData=response.data.int_farmers_list
              MembershipDuplicateList=showDefaultData
             }
             
            }
            else{
              showDefaultData=response.data.int_farmers_list;
              MembershipDuplicateList=showDefaultData

            }
            this.setState({
              // farmerslist: response.data.int_farmers_list,
              // duplicatefarmerslistForMembership:response.data.int_farmers_list,

              farmerlist:showDefaultData,
              duplicatefarmerslistForMembership:MembershipDuplicateList,

              isLoadingFarmersTabData: false,
              seletedVillage:"All",
              farmerStatus:"All",
             
  
  
            }
            );
            this.filterVillageBasis(this.state.seletedVillage,this.state.farmerStatus)
          }
          else{
            this.setState({
              farmerslist: [],
              showfarmerlistcount:0,
              isLoadingFarmersTabData: false,
            });
          }
        },
        (error) => {
          flag = true;
          this.setState({
            isLoadingFarmersTabData: false,
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
          if (error.response) {
            TriggerAlert(
              "Error",
              error.response.data.message.replace(".", " ") + "at FarmerList",
              "error"
            );
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
    };
   // on main page.
  // according to the state selected we are calling an api for dist here.
  handleInitialDistChange = (state_id, distagmarkId) => {
    const { selectedGender, selectedActivity, selectedFI,selectedService } = this.state;
    this.setState(
      { isLoadingFarmersTabData: true },
      this.initFarmersTabPopulate(
        state_id,
        distagmarkId,
        selectedGender,
        selectedActivity,
        selectedFI,
        selectedService
      )
    );
  };
  // will be called on click on Location wise and under that select gender box. 
    // this is also caled on click on allied activity button under location wise to get the data accrding to gender.
       // this is also caled on click on Financial Interest under location wise to get the data accrding .
  //  // according to the state selected we are calling an api for dist here.
  initFarmersTabPopulate = (
    state_id,
    distagmarkId,
    gender = "-1",
    activity = "-1",
    fi = "-1",
    service = "-1"
  ) => {
    const sendId = `${state_id}:${distagmarkId}`;
    const filter = `${gender},${activity},${fi},${service}`;
    const fpoid=this.state.accessed_supervisor
    var flag = false;
    UserService.getFarmerListByDist(sendId, filter,fpoid).then(
      (response) => {
        flag = true;
        if (response.data.success) {
          this.setState({
            isLoadingFarmersTabData: false,
            isDistChangeHappened: false,
            farmerslist: response.data.farmers,
            farmerMembershipStatus:false,

            showfarmerlistcount:response.data.farmers.length,
            distSelectedId: distagmarkId,
            genderData: response.data.filters.Common.gender_filter,
            activityData: response.data.filters.Common.allied_activity_filter,
            FIlist: response.data.filters.Common.financial_interest,
            serviceCategory:response.data.filters.Common.service_categories,
            // advFilterData:response.data.filters.Filter

          });
        }
        else {
          this.setState({
            isLoadingFarmersTabData: false,
            farmerslist:[],
            showfarmerlistcount:0
          });
        }
      },
      (error) => {
        flag = true;
        this.setState({
          isLoadingFarmersTabData: false,
          isDistChangeHappened: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") +
              "at Farmer list by District",
            "error"
          );
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
  };
   // here we r mapping all the values received from an api as a dropdown options . 
   // in select Filter these values will append.
  createAdvFilterOptions = (filterData) =>
  
   
    filterData.length
      ? filterData.map((data) => (
      
          <option
            key={data.filter_value}
            name={data.filter_value}
            value={data.filter_value}
            >
            {data.filter_name} ({data.count})
          </option>
        ))
      : "";
  
    // here we r mapping all the values received from an api as a dropdown options . 
   // in select FR these values will append.
  createOptions = (frlist) =>
    frlist.length
      ? frlist.map((data) => (
          <option key={data.id} name={data.first_name} value={data.id}>
            {data.first_name + " " + data.last_name} ({data.filter_count})
          </option>
        ))
      : "";
    // here we r mapping all the values received from an api as a dropdown options . 
      // in select State these values will append.
  createStateOptions = (statelist) =>
    statelist.length
      ? statelist.map((data) => (
          <option key={data.stateId} name={data.name} value={data.stateId}>
            {data.name}
          </option>
        ))
      : "";
     // here we r mapping all the values received from an api as a dropdown options . 
      // in select Dist these values will append.
  createDistOptions = (distlist) =>
    distlist.length
      ? distlist.map((data) => (
          <option key={data.distId} name={data.name} value={data.agmarkDistId}>
            {data.name}
          </option>
        ))
      : "";
    // here we r mapping all the values received from an api as a dropdown options . 
      // in Allied activity these values will append.
  createActivityOptions = (activityData) =>
    activityData.length
      ? activityData.map((data) => (
          <option
            key={data.filter_value}
            name={data.filter_value}
            value={data.filter_value}
          >
            {data.filter_name} 
          </option>
        ))
      : "";
   // here we r mapping all the values received from an api as a dropdown options . 
      // in select gender these values will append.
  createGenderOptions = (genderData) =>
    genderData.length
      ? genderData.map((data) => (
          <option
            key={data.filter_value}
            name={data.filter_value}
            value={data.filter_value}
          >
            {data.filter_name} ({data.filter_count})
            
          </option>
        ))
      : "";
     // here we r mapping all the values received from an api as a dropdown options . 
      // in Financial Year these values will append.
  createFIOptions = (FIlist) =>
    FIlist.length
      ? FIlist.map((data) => (
          <option
            key={data.filter_value}
            name={data.filter_value}
            value={data.filter_value}
          >
            {data.filter_name}
          </option>
        ))
      : "";
   createservicesOptions = (serviceCategory) =>
     serviceCategory.length
      ? serviceCategory.map((data) => (
          <option
            key={data.filter_value}
            name={data.filter_value}
            value={data.filter_value}
          >
            {data.filter_name}
          </option>
        ))
      : "";
  createAllIndiaStateOptions = (allIndiaStatesList) =>
    allIndiaStatesList.length
      ? allIndiaStatesList.map((data) => (
          <option key={data.id} name={data.state_eng_name} value={data.id}>
            {data.state_eng_name}
          </option>
        ))
      : "";

  createAllIndiaSelStateDistOptions = (allIndiaSelStatesDistList) =>
    allIndiaSelStatesDistList.length
      ? allIndiaSelStatesDistList.map((data) => (
          <option key={data.id} name={data.distName} value={data.agmarkDistId}>
            {data.distName}
          </option>
        ))
      : "";

  createAllIndiaSelStateDistBlockOptions = (allIndiaSelStatesDistBlockList) =>
    allIndiaSelStatesDistBlockList.length
      ? allIndiaSelStatesDistBlockList.map((data) => (
          <option key={data.id} name={data.block_name} value={data.block_code}>
            {data.block_name}
          </option>
        ))
      : "";

  modalToggle = (status) => {
    this.setState({
      modalShow: status,
    });
  };
     // this is checking file upload format inside popup.

  setSelectedFileToState = (event) => {
    var file = event.target.files[0];
    let fileValidateResults = this.validateFileUploaded(event);
    let fileValidateResultStatus = fileValidateResults.status;
    let fileValidateResultMsg = fileValidateResults.msg;
    let fileValidateResultMsgType = fileValidateResults.msgType;
    if (fileValidateResultStatus) {
      // if return true allow to setState
      this.appendMessageData(fileValidateResultMsg, fileValidateResultMsgType);
      this.setState({
        selectedFarmerListFile: file,
        farmerListFileUploadedStatus: true,
      });
    } else {
      this.appendMessageData(fileValidateResultMsg, fileValidateResultMsgType);
      this.setState({
        farmerListFileUploadedStatus: false,
      });
    }
  };
 
// for showing progress bar inside popup.
  progres_call = () => {
    const {currentCeleryStatus, intervalId, cleryId } = this.state
    UserService.celeryStatus(this.state.cleryId).then(
      (response) => {
    
        if (!response.data.details){
           
            this.setState({
              currentCeleryStatus: 100,
              isFarmersCeleryrunning: false,
              cleryId: "",

            })
            clearInterval(intervalId);
            
        }
        else{
            this.setState({
              currentCeleryStatus: response.data.details.current
            })
            
        }
    });
  }
  // celryLoader = (celery_task_id) => {
  //       if(celery_task_id){
  //         var intervalId = setInterval(this.progres_call, 2000);
  //         this.setState({intervalId: intervalId, cleryId: celery_task_id});        
  //           // store intervalId in the state so it can be accessed later:

  //       }
  //     }

 
  uploadFarmersListFile = () => {
    this.setState({
      isFarmersListFileUploading: true,
    });
    const { distError, blockError, stateError } = this.state;
    const data = new FormData();
    data.append("farmerfile", this.state.selectedFarmerListFile);
    const currFileTypeStatus = this.state.isFileFormatValid;
    const currFileSelectionStatus = this.state.farmerListFileUploadedStatus;
    const selStateID = this.state.allIndiaSelStatesID;
    const selStatesDistID = this.state.allIndiaSelStateDistID;
    const selStateDistBlockId = this.state.allIndiaSelStateDistBlockID;
    let errormsg = "";

    if (parseInt(selStateID) == 0) {
      errormsg = true;
      this.setState({ stateError: true });
    }
    if (parseInt(selStatesDistID) == 0) {
      errormsg = true;
      this.setState({ distError: true });
    }

    if (parseInt(selStateDistBlockId) == 0) {
      errormsg = true;
      this.setState({ blockError: true });
    }
    if (!currFileTypeStatus || !currFileSelectionStatus) {
      errormsg = true;
    }

    if (!errormsg) {
      var flag = false;
      UserService.uploadFarmersList(
        selStateID,
        selStatesDistID,
        selStateDistBlockId,
        data
      ).then(
        (response) => {
          if (response.data.success) {
            if (response.data.errors.length > 0) {
              this.setState({
                errorResponse: response.data.errors,
              });
            }

            flag = true;
            this.appendMessageData(response.data.message, "");
            this.setState({
              uploadedFileProcessResult: response.data,
              isFarmersListFileUploading: false,
              templateUploaded: true,
              allIndiaSelStatesID: 0,
              allIndiaSelStateDistID: 0,
              allIndiaSelStateDistBlockID: 0,
            });
          if(response.data.celery_task_id){ 
            // this.celryLoader(response.data.celery_task_id)
            var intervalId = setInterval(this.progres_call, 1000);
            this.setState({intervalId: intervalId, 
                cleryId: response.data.celery_task_id,
                isFarmersCeleryrunning: true});        
              // store intervalId in the state so it can be accessed later:
  
            }
          }

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
        },
      
      );
    } else {
      this.appendMessageData(
        // "Please select the state, district and then upload the file",
        `Please Upload the File`,
        "error"
      );
      return null;
    }
  };
  appendMessageData(msg, type) {
    this.fileUploadProcessMessage.message = "";
    this.fileUploadProcessMessage.messageType = "";
    this.fileUploadProcessMessage.message = { msg };
    this.fileUploadProcessMessage.messageType = { type };
    this.setState({
      uploadedFileMessage: this.fileUploadProcessMessage,
      isFarmersListFileUploading: false,
    });
  }
    // validaton of file upload.

  validateFileUploaded = (event) => {
    let file = event.target.files[0];
    let size = 0;
    let allowedFormat =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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
    if (file.type !== allowedFormat) {
      err =
        file.name +
        " is not the MS Excel file, please upload only '.xlsx' files\n";
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
  handleUpdatefarmers = (newfarmers) => {
    this.setState({ farmerslist: newfarmers,
      showfarmerlistcount:newfarmers.length,
      farmerMembershipStatus:false,

     });
  };
    // navigating to message page.

  navigateMessage = (e) => {
    this.props.history.push("customized-sms/");
  };
      // navigating to dashboard.
    
  navigateMainBoard = () => {
    const {isParentLogged} = this.state
    if(isParentLogged){
      this.props.history.push("/fpohomeData");
    }
    else{
      this.props.history.push("/dashboard");
    }
  }

  // navigateToPage = (pageName) => {
  //   const information_parent=JSON.parse(localStorage.getItem("user"))
  //   var login_parentCheck=information_parent.is_parent;
   
  //   var pageName="";
  //   if(login_parentCheck===true)
  //   {
  //     pageName="fpohomeData"
  //   }
  //   else
  //   pageName="Dashboard"

  //   this.props.history.push("/" + pageName + "");
  // };
    // on click on any tab we r disabling the whole row so that till d time data is not received user cannot click on anything.

  disableOnLoad = (data) => {
    let value = "";
    if (data === true) {
      value = "disableDataClass";
    } else {
      value = "farmersHeader ";
    }
    return value;
  };
 
  CheckHideButton=()=>{
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "hidingButton";
    }
    return "defaultButtonElem";
  }
  handleExportInterestedFarmer=()=>{
    const {farmerslist}=this.state;
       this.setState({
        buttonDisableExport:true,
        showDownloadLoader2:true,
       })
   
    UserService.getInterestedFarmerExport().then(

        (response) => {
        
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'interestedFarmer.xlsx');
            document.body.appendChild(link);
            link.click();
            this.setState({
              showDownloadLoader2:false,
                buttonDisableExport:false
            })
     
          
         
        },
        (error) => {
            this.setState({
              showDownloadLoader2:false,
              buttonDisableExport:false,
                content:
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString(),
            });
            if (error.response) {
                TriggerAlert("Error","A failure occurred during process of services. Please contact your respective administrators.", "error");
            } else {
                TriggerAlert(
                    "Error",
                    "Server closed unexpectedly, Please try again",
                    "error"
                );
            }
        },
    
     
    );
}
  render() {
    const {
      farmerslist,
      frlist,
      distlist,
      statelist,
      allIndiaStatesList,
      allIndiaSelStatesID,
      allIndiaSelStateDistList,
      allIndiaSelStateDistBlockList,
      allIndiaSelStateDistID,
      selectedFarmerListFile,
      uploadedFileMessage,
      allIndiaSelStateDistBlockID,
      uploadedFileProcessResult,
      isAllIndiaDistListLoading,
      //isAllIndiaDistBlockListLoading,
      isAllIndiaBlockListLoading,
      isFarmersListFileUploading,
      siteslist,
      categoryvalue,
      modalShow,
      modalIsOpen,
      stateSelectedId,
      advFilterData,
      activityData,
      genderData,
      distError,
      blockError,
      stateError,
      activityMasterData,
      FIlist,
      errorResponse,
      templateUploaded,
      isFarmersCeleryrunning,
      currentFpo,
      SpecialServices,
      serviceCategory
    } = this.state;
        // show d model popup.
  

    const showModal = () => {
      this.setState({
        modalIsOpen: true,
      });
    };
        // on click on close this will hide d popup.

    const hideModal = () => {
      this.fileUploadProcessMessage.message = "";
      this.fileUploadProcessMessage.messageType = "";
      if (templateUploaded) {
        this.handleCategoryChange(1);
      }
      this.setState({
        modalIsOpen: false,
        uploadedFileMessage: this.fileUploadProcessMessage,
        distError: false,
        blockError: false,
        stateError: false,
        allIndiaSelStatesID: 0,
        allIndiaSelStateDistID: 0,
        allIndiaSelStateDistBlockID: 0,
        errorResponse: [],
      });
    };
     // here we are showing the field on Ui according to the choosed filter.

    const DropDownDiv = () => {
      if (categoryvalue === 1) {
        return (
          <Col lg="12" className="">
            <Row>
              <Col lg="2" >
                <i className="frIcon" title="Field Representative"></i>
              </Col>
              <Col lg="10" >
                <Form.Label className="dvaraBrownText">
                  <b>Select FR</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  custom
                  size="sm"
                  value={this.state.frselectedid}
                  onChange={this.handleFRChange}
                  ref={this.frListSelectorRef}
                >
                  {this.createOptions(frlist)}
                </Form.Control>
                {this.state.isDropDownActionStarted ? (
                  <div className="frActionLoader">
                    <span className="spinner-border spinner-border-sm"></span>
                  </div>
                ) : (
                  <div className="wrap loaderWrap">
                    <span className=""></span>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        );
      } else if (categoryvalue === 2) {
        return (
          <Col lg="12" className="">
            <Row className="">
              <Col lg="1">
                <FontAwesomeIcon
                  icon={faMap}
                  className="dvaraGreenText textSize30px"
                ></FontAwesomeIcon>
              </Col>
              <Col lg="5" className="">
                <Form.Label className="dvaraBrownText">
                  <b>Select State</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="stateChange"
                  value={this.state.stateSelectedId}
                  custom
                  size="sm"
                  onChange={this.handleStateChange}
                >
                  {this.createStateOptions(statelist)}
                </Form.Control>
              </Col>
              <Col lg="5" className="">
                <Form.Label className="dvaraBrownText">
                  <b>Select District</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="distChange"
                  custom
                  size="sm"
                  value={this.state.distSelectedId}
                  onChange={this.handleDistChange}
                >
                  {this.createDistOptions(distlist)}
                </Form.Control>
                {this.state.isDistChangeHappened ? (
                  <div className="frActionLoader">
                    <span className="spinner-border spinner-border-sm"></span>
                  </div>
                ) : (
                  <div className="wrap loaderWrap">
                    <span className=""></span>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        );
      } else if (categoryvalue === 3) {
        return (
          <Col lg="12" className="">
            <Row>
              <Col lg="2">
                <i className="frIcon" title="Field Representative"></i>
              </Col>
              <Col lg="10">
                <Form.Label className="dvaraBrownText">
                  <b>Select Filter</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  custom
                  size="sm"
                  value={this.state.defaultadvFilter}
                  onChange={this.handleFilterChange}
                  ref={this.filterSelectorRef}
                >
                  
                  {this.createAdvFilterOptions(advFilterData)}
                </Form.Control>
              </Col>
             
            </Row>
          </Col>
        );
      }
      else if (categoryvalue===4){
      
        return (
          <Col lg="12" className="">
            <Row className="">
              <Col lg="1">
                <FontAwesomeIcon
                  icon={faMap}
                  className="dvaraGreenText textSize30px"
                ></FontAwesomeIcon>
              </Col>
              <Col lg="4" className="">
                <Form.Label className="dvaraBrownText">
                  <b>Village Status</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="stateChange"
                  value={this.state.seletedVillage}
                  custom
                  size="sm"
                  onChange={(e)=>this.handleVillageType(e.target.value,this.state.farmerStatus)}
                >
                  <option value="All">All</option>
                  <option value="village">
                    Existing Village
                  </option>
                  <option value="Non village">
                    New Village
                  </option>
                </Form.Control>
              </Col>
              <Col lg="4" className="">
                <Form.Label className="dvaraBrownText">
                  <b>Farmer Status</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="distChange"
                  custom
                  size="sm"
                  value={this.state.farmerStatus}
                  onChange={(e)=>this.handleVillageType(this.state.seletedVillage,e.target.value)}


                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>

                </Form.Control>
              
              </Col>
              <Col lg="3">
              <Button   
                           onClick={this.handleExportInterestedFarmer}
                             style={{marginTop:"30px"}}
                             disabled={this.state.buttonDisableExport}
                                className="defaultDisableButton"
                                   variant="primary"
                                   size="sm">
                             <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                              ></FontAwesomeIcon>
                            &nbsp;&nbsp;Export Data
                            {this.state.showDownloadLoader ? (
                          <div className="formDistLoadSpinnerWrap">
                          <span className="spinner-border spinner-border-sm"></span>
                         </div>
                         ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                        )}
                          </Button>
              </Col>
            </Row>
          </Col>
        );
       
      }

    };

    return (
      <div className="wrap">
        {this.state.loading ? (
          <span className="spinner-border spinner-border-sm dashboardLoader"></span>
        ) : (
          <section
            className="mainWebContentSection "
            style={{ marginLeft: "25px" }}
          >
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
              <h5 style={{ marginLeft: "26px"}}> FPO: {currentFpo} </h5>
            </div>
          : ""}
            <Fragment>
              <div className="farmerListMainSection">
                <Row>
                  <Col xs lg="12" className="FarmersListPane">
                    <div
                      className={this.disableOnLoad(
                        this.state.isLoadingFarmersTabData
                      )}>
                      <Row>
                        <Col xs lg="3">
                          <h4 className="farmerListHeading dvaraBrownText">
                            Farmers List
                          </h4>
                        </Col>
                        <Col
                          xs
                          lg="9"
                         
                        >
                          <ToggleButtonGroup
                            type="radio"
                            name="categorySelection"
                            className="farmerCategoryToggle"
                            defaultValue={this.setDefaultValueForMemberShipFilter()}
                            onChange={this.handleCategoryChange}>
                            <ToggleButton
                              value={1}
                              className="toggleButtonElem toggleButtonElemBorder">
                                <i className="frIconBtn"
                                title="Field Representative"
                              ></i>
                              &nbsp;FR Wise
                            </ToggleButton>

                            <ToggleButton
                              value={2}
                              className="toggleButtonElem toggleButtonElemBorder">
                              <FontAwesomeIcon
                                icon={faMap}
                                className="dvaraBrownText"
                              ></FontAwesomeIcon>
                              &nbsp;Location Wise
                            </ToggleButton>
                            <ToggleButton
                              value={3}
                              className="toggleButtonElem toggleButtonElemBorder">
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="dvaraBrownText"
                              ></FontAwesomeIcon>
                              &nbsp;Advance Filter
                            </ToggleButton>
                            <ToggleButton
                              value={4}
                              className="toggleButtonElem toggleButtonElemBorder">
                                <i className="frIconBtn"
                                title="Field Representative"
                              ></i>
                              &nbsp;Request For Membership
                            </ToggleButton>
                          </ToggleButtonGroup>
                          &nbsp;&nbsp;&nbsp;
                          {/* <Button
                            // className="defaultButtonElem"
                            // disabled={this.CheckUserParent()}
                            className={this.CheckHideButton()}


                            variant="primary"
                            size="sm"
                            onClick={() => showModal(true)}
                          >
                            <FontAwesomeIcon
                              icon={faUpload}
                              className="dvaraBrownText"
                            ></FontAwesomeIcon>
                            &nbsp;&nbsp;Upload Farmers List
                          </Button> */}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Button
                            // className="defaultButtonElem"
                            className={this.CheckHideButton()}
                            variant="primary"
                            size="sm"
                            onClick={this.navigateMessage}
                            style={{marginRight:"10px"}}
                          >
                            <FontAwesomeIcon
                              icon={faComment}
                              className="dvaraBrownText"
                            ></FontAwesomeIcon>
                            &nbsp;&nbsp;Message
                          </Button>
                          <Button
                            onClick={this.handleDownloadTemplate}
                            className={this.CheckHideButton()}
                            variant="primary"
                            size="sm"
                          >
                            <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                            ></FontAwesomeIcon>
                            &nbsp;&nbsp;Download Template
                            {this.state.showDownloadLoader ? (
                              <div className="formDistLoadSpinnerWrap">
                                <span className="spinner-border spinner-border-sm"></span>
                              </div>
                            ) : (
                              <div className="formDistLoadSpinnerWrap"></div>
                            )}
                          </Button>
                          {/* {this.state.farmerslist.length > 0 ? (
                                        <Col lg="3" className="exportdataclass" style={{float:"right",marginRight:"215px",marginTop:"30px"}}>
                                          <Button
                                            onClick={this.handleExportData}
                                            className="defaultButtonElem"
                                            variant="primary"
                                            size="sm"
                                          >
                                            <FontAwesomeIcon
                                              icon={faDownload}
                                              className="dvaraBrownText"
                                            ></FontAwesomeIcon>
                                            &nbsp;&nbsp;Export Data
                                            {this.state.showDownloadLoader ? (
                                              <div className="formDistLoadSpinnerWrap">
                                                <span className="spinner-border spinner-border-sm"></span>
                                              </div>
                                            ) : (
                                              <div className="formDistLoadSpinnerWrap"></div>
                                            )}
                                          </Button>  
                                    
                                          <span
                                            style={{
                                              padding: "5px",
                                              color: "rgba(114, 49, 12, 1)",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Response Count :{" "}    
                                            <span
                                              style={{
                                                fontWeight: "400",
                                                color: "#228B22",
                                                marginLeft:"230px",
                                              }}
                                            >
                                              {this.state.showfarmerlistcount}
                                            </span>                                       
                                          </span>                                          
                                        </Col>
                                      ) : (
                                        ""
                                      )}     */}

                          <Modal
                            show={modalIsOpen}
                            onHide={hideModal}
                            size="md  "
                            aria-labelledby="contained-modal-title-vcenter"
                            centered /* onEntered={modalLoaded} */
                          >
                            <Modal.Header>
                              <Modal.Title>
                                <FontAwesomeIcon
                                  icon={faUpload}
                                  className="dvaraGreenText"
                                ></FontAwesomeIcon>
                                &nbsp;&nbsp;
                                <span className="dvaraBrownText">
                                  Upload Farmers List
                                </span>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="farmersUploadWrap">
                                <Form>
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select State</b>*{" "}
                                      {stateError ? (
                                        <span style={{ color: "red" }}>
                                          Please Select State
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={allIndiaSelStatesID}
                                      custom
                                      size="sm"
                                      onChange={this.handleAllIndiaStateChange}
                                    >
                                      <option value="0">
                                        --SELECT STATE--
                                      </option>
                                      {this.createAllIndiaStateOptions(
                                        allIndiaStatesList
                                      )}
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select District</b>*{" "}
                                      {distError ? (
                                        <span style={{ color: "red" }}>
                                          Please Select District
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      size="sm"
                                      value={allIndiaSelStateDistID}
                                      custom
                                      onChange={this.handleAllIndiaDistChange}
                                    >
                                      <option value="0">
                                        --SELECT DISTRICT--
                                      </option>
                                      {this.createAllIndiaSelStateDistOptions(
                                        allIndiaSelStateDistList
                                      )}
                                    </Form.Control>
                                    {isAllIndiaDistListLoading ? (
                                      <div className="formDistLoadSpinnerWrap">
                                        <span className="spinner-border spinner-border-sm"></span>
                                      </div>
                                    ) : (
                                      <div className="formDistLoadSpinnerWrap"></div>
                                    )}
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select Block</b>*{" "}
                                      {blockError ? (
                                        <span style={{ color: "red" }}>
                                          Please Select Block
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      size="sm"
                                      value={allIndiaSelStateDistBlockID}
                                      custom
                                      onChange={this.handleAllIndiaBlockChange}
                                    >
                                      <option value="0">
                                        --SELECT Block--
                                      </option>
                                      {this.createAllIndiaSelStateDistBlockOptions(
                                        allIndiaSelStateDistBlockList
                                      )}
                                    </Form.Control>
                                    {isAllIndiaBlockListLoading ? (
                                      <div className="formDistLoadSpinnerWrap">
                                        <span className="spinner-border spinner-border-sm"></span>
                                      </div>
                                    ) : (
                                      <div className="formDistLoadSpinnerWrap"></div>
                                    )}
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      Select Farmers List File (in <i>*.xlsx</i>{" "}
                                      format)
                                    </Form.Label>
                                    <input
                                      type="file"
                                      name="file"
                                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                      onChange={this.setSelectedFileToState}
                                    />
                                  </Form.Group>
                                  
                                  <Form.Group>
                                    {isFarmersCeleryrunning ? (
                                    <div>
                                      Please Wait {this.state.currentCeleryStatus} %
                                      
                                    <ProgressBar animated now={this.state.currentCeleryStatus} />
                                  </div>
                                    ) : (
                                      ""
                                    )}
                                
                                  </Form.Group>
                                  {!isFarmersCeleryrunning ? 
                                  (<Form.Group>
                                    {uploadedFileMessage.message.msg !== "" ? (
                                      <Form.Label
                                        className={`formMessage ${
                                          uploadedFileMessage.messageType
                                            .type === "error"
                                            ? "errorMessage"
                                            : uploadedFileMessage.messageType
                                                .type === "success"
                                            ? "successMessage"
                                            : "normalText"
                                        } `}
                                        >
                                        {uploadedFileMessage.message.msg}
                                        {errorResponse.length ? (
                                          <ul>
                                            {errorResponse.map((error) => {
                                              return (
                                                <li style={{ color: "red" }}>
                                                  {error}
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          ""
                                        )}
                                      </Form.Label>
                                    ) : (
                                      <Form.Label></Form.Label>
                                    )}
                                  </Form.Group>): ""}
                                </Form>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                onClick={this.uploadFarmersListFile}
                                disabled={isFarmersListFileUploading}
                                className="fa-pull-right defaultButtonElem"
                                >
                                <div className="formUpLoadSpinnerWrap">
                                  {isFarmersListFileUploading ? (
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
                        </Col>
                      </Row>
                      <Row>
                        <Col xs lg="12" className="padTopLeft10">
                          <Form>
                            <Row>
                              <Form.Group Col={5}>
                                <DropDownDiv />
                              </Form.Group>
                              {categoryvalue != 4 && 
                                <Form.Group Col={7}>
                                  <Col lg="12">
                                    <Row className="filters" style={{width:"1450px"}}>
                                      <Col lg="2" className="">
                                        <Form.Label className="dvaraBrownText">
                                          <b>Gender</b>
                                        </Form.Label>
                                        <br />
                                        <Form.Control
                                          style={{ width: "250px" }}
                                          as="select"
                                          id="stateChange"
                                          value={this.state.selectedGender}
                                          custom
                                          size="sm"
                                          onChange={this.handleGenderChange}
                                        >
                                          {this.createGenderOptions(genderData)}
                                        </Form.Control>                                       
                                      </Col>    
                                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  */}
                                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    */}
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                      <Col lg="2" className="">
                                        <Form.Label className="dvaraBrownText">
                                          <b>Allied Activity</b>
                                        </Form.Label>
                                        <br />
                                        <Form.Control
                                          style={{ width: "250px" }}
                                          as="select"
                                          id="actChange"
                                          custom
                                          size="sm"
                                          value={this.state.selectedActivity}
                                          onChange={this.handleActivityChange}
                                        >
                                          {this.createActivityOptions(
                                            activityData
                                          )}
                                        </Form.Control>                                       
                                      </Col>
                                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
                                       <Col lg="2" className="">
                                        <Form.Label className="dvaraBrownText">
                                          <b>Special Services Category</b>
                                        </Form.Label>
                                        <br />
                                        <Form.Control
                                          style={{ width: "230px" }}
                                          as="select"
                                          id="stateChange"
                                          value={this.state.selectedService}
                                          custom
                                          size="sm"
                                          onChange={this.handleserviceChange}
                                        >
                                          {this.createservicesOptions(serviceCategory)}
                                        </Form.Control>
                                       </Col>
                                       {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   */}
                                        <Col lg="2" className="">
                                        <Form.Label className="dvaraBrownText">
                                          <b>Product Response</b>
                                        </Form.Label>
                                        <br />
                                        <Form.Control
                                          style={{ width: "220px" }}
                                          as="select"
                                          id="stateChange"
                                          value={this.state.selectedFI}
                                          custom
                                          size="sm"
                                          onChange={this.handleFIChange}
                                        >
                                          {this.createFIOptions(FIlist)}
                                        </Form.Control>
                                      </Col> 
                                      {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  */}
                                    {this.state.farmerslist.length >0 ? ( 
                                    <Col lg='2' className="exportdataclass" 
                                  //   style={{position:"absolute",
                                  //   // marginTop:"-56px",
                                  //   // marginLeft:"978px"
                                  // }}
                                    >
                                  <Button onClick={this.handleExportData}
                                   className="defaultButtonElem"
                                   variant="primary"
                                   size="sm">
                             <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                              ></FontAwesomeIcon>
                            &nbsp;&nbsp;Export Data
                            {this.state.showDownloadLoader ? (
                          <div className="formDistLoadSpinnerWrap">
                          <span className="spinner-border spinner-border-sm"></span>
                         </div>
                         ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                        )}
                          </Button>
                          <br />
                          <span style={{padding:"5px",color:"rgba(114, 49, 12, 1)",fontWeight:"bold"}}>
                            Response Count:
                            <span style={{fontWeight:"400",color:"#228B22"}}> 
                            {this.state.showfarmerlistcount}
                              </span>
                              </span>
                                    </Col>
                                    ) : ("") }
                                  </Row>
                                </Col>
                              </Form.Group>
                              } 
                            </Row>
                          </Form>
                        </Col>
                      </Row>
                    </div>
                    <div className="farmersTabContent wrap">
                        {this.state.isLoadingFarmersTabData ? (
                          // <div className="wrap loaderWrap">
                          //   <div class="LoaderWrapper">
                          //     <div class="circle"></div>
                          //     <div class="circle"></div>
                          //     <div class="circle"></div>
                          //     <div class="shadow"></div>
                          //     <div class="shadow"></div>
                          //     <div class="shadow"></div>
                          //     <span>Loading</span>
                          //   </div>

                          // </div>
                          <img src={farmer_farming} height="150px"style={{position:"relative",top:"100px",left:"42%"}}/>

                        ) : (
                          <Table
                            farmers={farmerslist}
                             accessed_supervisor={this.state.accessed_supervisor}
                             logged_supervisor={this.state.logged_supervisor}
                          updatefarmers={this.handleUpdatefarmers}
                          rowClickParentHandler={this.outputEvent}
                          activityMaster={activityMasterData}
                          serviceList={SpecialServices}
                          membership={this.state.farmerMembershipStatus}
                          updateMembershipData={this.RequestMembership}
                        />
                      
                      )}
                      <div className="EmptySpacerContent wrap"></div>
                    </div>
                  </Col>
                  {/* <Col xs lg="5" className="FarmersMapViewPane">
                    <div className="wrap FarmersMapContainer">
                      <Map sites={siteslist} />
                    </div>
                  </Col> */}
                </Row>
                <Row></Row>
              </div>
            </Fragment>
          </section>
        )}
      </div>
    );
  }

  //Farmers Table Population

  componentDidMount() {
    var flag = false;
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({ isParentLogged: true, currentFpo: this.props.match.params.fpoName })
    }

    this.setState({
      accessed_supervisor:fpoId,
      logged_supervisor: user.user_id
    })
     
  



    UserService.getStateList(fpoId).then(
      (response) => {
        this.setState({
          statelist: response.data.data,
          stateSelectedId: response.data.data[0].stateId,
        });
      },
      (error) => {
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
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "at StateList",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );
    UserService.getAllIndiaStatesList().then(
      (response) => {
        let sortedAllIndiaStatesList = response.data.data.sort(
          sortObjsInArray("id")
        );
        this.setState({
          allIndiaStatesList: sortedAllIndiaStatesList,
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
        if (error.response) {
          TriggerAlert(
            "Error",
            "Something terrible went wrong at IndiaStatesList",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );

    UserService.getAdvanceFilter(fpoId).then(
      (response) => {
        if (response.data.success) {
          this.setState({
            advFilterData: response.data.data,
          });
          // this.handleInitialadvFilterChange(response.data.data[0].filter_value)
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
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") + "at AdvanceFilter.",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );
    UserService.getCommonFilter(fpoId).then(
      (response) => {
        if (response.data.success) {
          this.setState({
            activityData: response.data.allied_activity_filter,
            genderData: response.data.gender_filter,
            FIlist: response.data.financial_interest,
          });
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
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", " ") +
              "at Common Filters.",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );

    UserService.getAlliedActivities().then(
      (response) => {
        let sortedActivitiesList = response.data.response.sort(
          sortObjsInArray("id")
        );
        if (response.data.success) {
          this.setState({
            activityMasterData: sortedActivitiesList,
          });
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
        if (error.response) {
          TriggerAlert(
            "Error",
            "Something terrible went wrong at AlliedActivities.",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );

    UserService.getFPOsServices().then(
      (response) => {
        

        let sortedServices = response.data.services_list.sort(
          sortObjsInArray("id")
        );
        if (response.data.success) {
          this.setState({
            SpecialServices: sortedServices,
          });
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
        if (error.response) {
          TriggerAlert(
            "Error",
            "Something terrible went wrong at AlliedActivities.",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );
     
    if( this.props.location.search!="")
    {
      let queryParam= this.props.location.search;
      let SplitqueryParam= queryParam.split("&");
      let SplitqueryParamTabValue= SplitqueryParam[1];
      let SplitqueryParamLatValue= SplitqueryParam[2];
      let SplitqueryParamEndValue= SplitqueryParamLatValue.split("=")[1];
      let SplitqueryTabValue= SplitqueryParamTabValue.split("=")[1];

      this.setState({
        SearchByNumberMembership:SplitqueryParamEndValue,
        SearchByTabName:SplitqueryTabValue
      },()=>{
        if(SplitqueryTabValue!=="fr-wise")
        {  
           this.handleCategoryChange(4)
           return ;
        }
        else
          {

            this.handleCategoryChange(1)
           }
      }
    
      
      )
      
    }
    if( this.props.location.search=="")
    {
    UserService.getFrList(fpoId).then(
      (response) => {
        flag = true;
        if (response.data.success) {
         
          this.setState(
            {
              frlist: response.data.data,
              frselectedid: response.data.data[0].id,
            },
            this.handleInitialFRChange(response.data.data[0].id)
          );
        }
      },
      (error) => {
        flag = true;
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
        if (error.response) {
          TriggerAlert(
            "Error",
            error.response.data.message.replace(".", "") + " at FR List",
            "error"
          );
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

}
