import React, { Component } from 'react';
import {Row, Col, ProgressBar,
    Modal,
    ModalBody,
    ModalDialog,
    ModalFooter,
    ModalProps,
    ModalTitle,
    ModalDialogProps,
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Form,
    Alert,
    Toast,
    OverlayTrigger,
    Tooltip,
    Popover } from 'react-bootstrap';

import "../assets/css/landholding.css";
import "../assets/css/farmerlist.css";
import UserService from "../services/user.service";
import Map from "./map.component";


import EventBus from "../services/eventbus.service";
import MaterialTable from 'material-table';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NestedTable from './nestedTable.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMapMarker, faMapMarkerAlt, faMobileAlt, faTimes, faSave, faExclamationTriangle,faHome ,faDownload} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../services/auth.service";
import {TriggerAlert} from './dryfunctions';
import landholding_loader from "../assets/img/landholding_loader.gif";
import noImageFpo from "../assets/img/noImageFpo.jpg";
var dateSelfieLabel=false;
  
// var mainCardObj = {
//   total_sites: 0,
//   total_area: 0,
//   own_sites: 0,
//   leased_sites: 0,
//   irrigated_sites: 0,
//   rainfed_sites: 0,
// };

 // have used class Component and inside that have decrlared all the needed variable in this.state.
  //  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class Landholding extends Component {
  constructor(props) {
    super(props);
   //this cardObj has values of the top row which has cards i.e Site Information,Total Area.
    let CardObj = {
      total_sites: 0,
      total_area: 0,
      own_sites: 0,
      leased_sites: 0,
      irrigated_sites: 0,
      rainfed_sites: 0,
      registered_sites: 0,
      unreg_sites: 0,
    };
    // this.hideSiteEditModal = this.hideSiteEditModal.bind(this);s
    // this.showSiteEditModal = this.showSiteEditModal.bind(this);

    //initially we are binding all the functions with this.
    this.siteEditingAlertToggle = this.siteEditingAlertToggle.bind(this);
    this.setActionMessageWindowStatus =
      this.setActionMessageWindowStatus.bind(this);
    this.checkAndUpdateSiteData = this.checkAndUpdateSiteData.bind(this);
    this.deleteSelSite = this.deleteSelSite.bind(this);
    this.editSiteClearEdits = this.editSiteClearEdits.bind(this);
    this.doSiteApproveStatusChange = this.doSiteApproveStatusChange.bind(this);
    this.setReDigitizeReqStatus = this.setReDigitizeReqStatus.bind(this);

    /**Site Edit Form Field's ref creation starts  */
    this.editSiteNameFieldRef = React.createRef();
    this.editSiteAreaFieldRef = React.createRef();
    this.editSiteLeasedOrOwnedFieldRef = React.createRef();
    this.editSiteIrrigatedOrRainfedFieldRef = React.createRef();
    this.editIrrigationSource = React.createRef();
     this.editIrrigationType=React.createRef();
    this.editSiteRedigitizationFieldRef = React.createRef();
    this.editSiteApproveOrRejectFieldRef = React.createRef();
    /**Site Edit Form Field's ref creation ends  */
  // have declared all the used variables in this.state.
    this.state = {
      selectedValue: '',
      landData: {},
      activeCardId: "registered",
      isLandHoldingLoading: false,
      isLandHoldingTabLoading: false,
      content: "",
      allSitesList: "",
      siteEditingModal: false,
      currSiteDefData: {},
      siteApprovedStatus: -1,
      isReDigitizeReqRaised: -1,
      isSiteInfoUpdateStarted: false,
      showSiteEditingAlert: false,
      currSiteEditingAlertType: "",
      currSiteEditingAlertHeading: "",
      currSiteEditingAlertBody: "",
      floatingAlertWindowStatus: false,
      floatingAlertWindowAutoHideStatus: true,
      floatingAlertWindowHeading: "",
      floatingAlertWindowMsg: "",
      floatingAlertWindowMsgType: "",
      isFloatingWindowLoaderIconShown: false,
      mainCardObj: CardObj,
      logged_supervisor: "",
      accessed_supervisor: "",
      data_loaded: false,
      isParentLogged: false,
      landPaginationSize:"",
      currentFpo:"",
      selfieurl:"",
      selfierelation:"",
      selfiename:"",
      selfienumber:"",
      selfiedigitztn:"",
      selfieModalisOpen: false,
      selfieSiteName:"",
      selfieFarmerName:"",
      IrrigationTypeDetails:[],
      IrrSourceDetails:[],
      isExportApiBackend:false,
      showDownloadLoader:false,
      buttonDisableExport:false,
      showExtraRows:false,
      keepExtraVar:true,

      // IrrSourceValue:"",
      // IrrDetailsValue:"",
      // irrigation_source_id:"",
      // irrigation_source_id:""


    };
  }

  /** Event methods starts */
  // after deleting the crop this function is triggered . it will show a floating window at the bottom with response from a api 
  // with a proper message.
  setActionMessageWindowStatus = (currStatus) => {
    this.setState({
      floatingAlertWindowStatus: currStatus,
    });
    // console.log("floatingAlertWindowStatus",this.state.floatingAlertWindowStatus)
  };
  handleExport=()=>{
    const{landData}=this.state;
    console.log("export",landData.farmers)
    this.setState({
      showDownloadLoader:true,
      buttonDisableExport:true
  })

     let farmerdata=landData.farmers
    UserService.getLandholdingExportData(farmerdata).then(

      (response) => {
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', "landholding.xlsx");
          document.body.appendChild(link);
          link.click();
          this.setState({
              showDownloadLoader:false,
              buttonDisableExport:false
          })
   
        
       
      },
      (error) => {
          this.setState({
              showDownloadLoader: false,
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
  // here we are deleting sites and for deleting that we are calling an api . this delete will appear on clicking a dustbin inside a row.
  // and accordinly we are displaying a message on the floating window at the bottom left.
  // and after deleting we are showing the modified data.
  deleteSelSite = (selSiteID) => {
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)){
      TriggerAlert(
        "Error",
        "You Do not have access to Delete.",
        "error"
      );
      return false
    }
    let siteDelPayLoad = {
      is_archived: true,
    };
    UserService.doSiteEdit(selSiteID, siteDelPayLoad)
      .then(
        (response) => {
          let responseCode = response.status;
          let mainResponseStatusTxt = response.statusText;
          if (responseCode === 200) {
            if (!this.isObjectEmpty(response.data)) {
              let responseDataMsg = response.data.message;
              let responseSuccessStatus = response.data.success;
              if (responseSuccessStatus) {
                if (!this.isObjectEmpty(response.data.data)) {
                  let responseUpdatedSiteData = response.data.data;
                  // console.log("del site data ", responseUpdatedSiteData);
                  let currLandHoldingLoadedData = this.state.landData;
                  // console.log(
                  //   "Curr LandHolding data ",
                  //   currLandHoldingLoadedData
                  // );
                  let currLandHoldingLoadedDataFarmers =
                    currLandHoldingLoadedData.farmers;
                  // console.log(currLandHoldingLoadedDataFarmers);
                  let indexOfEditedSite = -1;
                  let farmersIndexForLandHolding = -1;
                  currLandHoldingLoadedDataFarmers.map(
                    (farmerDetails, farmersIndex) => {
                      let currLandHoldingLoadedDataFarmersSitesList =
                        farmerDetails.sites;
                      // console.log(currLandHoldingLoadedDataFarmersSitesList);

                      currLandHoldingLoadedDataFarmersSitesList.filter(
                        (item, sitesIndex) => {
                          // console.log(item);
                          if (item.id === selSiteID) {
                            // console.log(sitesIndex);
                            farmersIndexForLandHolding = farmersIndex;
                            indexOfEditedSite = sitesIndex;
                          }
                        }
                      );
                      // console.log("Matchin site index", indexOfEditedSite);
                      // console.log(
                      //   "Matchin farmers index",
                      //   farmersIndexForLandHolding
                      // );
                    }
                  );
                  // console.log(
                  //   "Index of deleted site in landholding data : ",
                  //   indexOfEditedSite
                  // );
                  // console.log(
                  //   "Index of farmers having deleted site in landholding data : ",
                  //   farmersIndexForLandHolding
                  // );

                  currLandHoldingLoadedDataFarmers[
                    farmersIndexForLandHolding
                  ].sites.splice([indexOfEditedSite], 1);
                  currLandHoldingLoadedData.farmers =
                    currLandHoldingLoadedDataFarmers;
                  let updatedLandHoldingDataAfterSitesDeleting =
                    currLandHoldingLoadedData;
                  // console.log(
                  //   "Updated landholding data after deleting selected site info ",
                  //   updatedLandHoldingDataAfterSitesDeleting
                  // );
                  this.setState(
                    {
                      landData: updatedLandHoldingDataAfterSitesDeleting,
                      isFloatingWindowLoaderIconShown: false,
                      floatingAlertWindowHeading: `Site \"${selSiteID}\" deleted successfully!`,
                      floatingAlertWindowMsg: `Message from service : ${responseDataMsg}`,
                      floatingAlertWindowMsgType: "success",
                    },
                    () => {
                      this.setActionMessageWindowStatus(true);
                    }
                  );
                } else {
                  this.setState(
                    {
                      isFloatingWindowLoaderIconShown: false,
                      floatingAlertWindowHeading: `Site \"${selSiteID}\" deleted successfully!`,
                      floatingAlertWindowMsg: `Site \"${selSiteID}\" deleted but couldn't fetch the updated data, please refresh the page! Message from service : ${responseDataMsg}`,
                      floatingAlertWindowMsgType: "",
                    },
                    () => {
                      this.setActionMessageWindowStatus(true);
                    }
                  );
                }
              } else {
                this.setState(
                  {
                    isFloatingWindowLoaderIconShown: false,
                    floatingAlertWindowHeading: `Site \"${selSiteID}\" couldn't be deleted!`,
                    floatingAlertWindowMsg: `Message from service : ${responseDataMsg}`,
                    floatingAlertWindowMsgType: "error",
                  },
                  () => {
                    this.setActionMessageWindowStatus(true);
                  }
                );
              }
            } else {
              this.setState(
                {
                  isFloatingWindowLoaderIconShown: false,
                  floatingAlertWindowHeading: `Site \"${selSiteID}\" couldn't be deleted!`,
                  floatingAlertWindowMsg: `Couldn't successfully retreive proper response for deleting the site \"${this.state.currSiteDefData.siteID}\". Message from service : ${mainResponseStatusTxt}`,
                  floatingAlertWindowMsgType: "error",
                },
                () => {
                  this.setActionMessageWindowStatus(true);
                }
              );
            }
          } else {
            this.setState(
              {
                isFloatingWindowLoaderIconShown: false,
                floatingAlertWindowHeading: `Site \"${selSiteID}\" couldn't be deleted!`,
                floatingAlertWindowMsg: `Couldn't delete the site \"${this.state.currSiteDefData.siteID}\" now, please try again later! Message from service : ${mainResponseStatusTxt}`,
                floatingAlertWindowMsgType: "error",
              },
              () => {
                this.setActionMessageWindowStatus(true);
              }
            );
          }
        },
        (error) => {
          // console.log(JSON.stringify(error));

          this.setState(
            {
              isFloatingWindowLoaderIconShown: false,
              floatingAlertWindowHeading: `Site \"${selSiteID}\" couldn't be deleted!`,
              floatingAlertWindowMsg: `Couldn't contact the delete service now, please try again later! Message from service : ${error.message}`,
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString(),
            },
            () => {
              this.siteEditingAlertToggle(true);
            }
          );
        }
      )
      .catch((error) => {
        // console.log("Site Edite catch error (non parse)", error);
        // console.log("Site edit catch error ", JSON.stringify(error));
        this.setState(
          {
            isSiteInfoUpdateStarted: false,
            currSiteEditingAlertType: "danger",
            currSiteEditingAlertHeading: `Couldn't perform the delete action, please contact the administrator! `,
            currSiteEditingAlertBody: `Message from service : ${error}`,
          },
          () => {
            this.siteEditingAlertToggle(true);
          }
        );
      });
  };
  // this function is called on click on Close button of popup.
  hideSiteEditModal = () => {
    this.setState({
      siteEditingModal: false,
    });
  };
// on editing a crop in case of error this function is triggered.
// in order to check validations also and to show warnings this function is also trigerred inside a popup.
  siteEditingAlertToggle = (setStatus) => {
    this.setState({
      showSiteEditingAlert: setStatus,
    });
  };
// this function is trigerred inside a modelPopup when we hav to reject or Approve reDigitization .
  doSiteApproveStatusChange = (getSelSiteApproveOrRejVal) => {
    // console.log("Approve or reject click val ", getSelSiteApproveOrRejVal);

    this.setState({
      siteApprovedStatus: getSelSiteApproveOrRejVal,
    });
  };
  // this is trigerred inside ModalPop. this is triggered on a field Redigitization Required? after selecting yes or no from the options. 
  setReDigitizeReqStatus = (getReDigitizeReqStatus) => {
    // console.log("Redigitization req click val ", getReDigitizeReqStatus);
    let currRedigitizeReqSelection = -1;
    if (getReDigitizeReqStatus === 0) currRedigitizeReqSelection = false;
    else if (getReDigitizeReqStatus === 1) currRedigitizeReqSelection = true;

    this.setState({
      isReDigitizeReqRaised: currRedigitizeReqSelection,
    });
  };
// this is trigerred inside ModalPop which will appear on click of pencil icon . Here if the user wants to delete the changes which he has 
// done he can erase them by clicing on Clear Edit button insted of using backspace or delete key . 
  editSiteClearEdits = (e) => {
    let siteNameDefVal = this.editSiteNameFieldRef.current.defaultValue.trim();
    this.editSiteNameFieldRef.current.value = siteNameDefVal;

    let siteAreaDefVal = this.editSiteAreaFieldRef.current.defaultValue.trim();
    this.editSiteAreaFieldRef.current.value = siteAreaDefVal;

    let siteOwnTypeDefVal = this.state.currSiteDefData.leasedOrOwn.trim();
    this.editSiteLeasedOrOwnedFieldRef.current.value = siteOwnTypeDefVal;

    let siteIrrigationTypeDefVal =
      this.state.currSiteDefData.irrigatedOrRainFed.trim();
    this.editSiteIrrigatedOrRainfedFieldRef.current.value =
      siteIrrigationTypeDefVal;

    let currStateValForEditSiteDefData = this.state.currSiteDefData;

    let siteReDigitizationDefVal = this.state.currSiteDefData.ReDigitize;
    currStateValForEditSiteDefData.ReDigitize = siteReDigitizationDefVal;

    let siteApproveOrRejDefVal = this.state.currSiteDefData.Approval;
    currStateValForEditSiteDefData.Approval = siteApproveOrRejDefVal;

    this.setState({
      siteApprovedStatus: -1,
      isReDigitizeReqRaised: false,
    });

    /* this.editSiteApproveOrRejectFieldRef.current.value = siteApproveOrRejDefVal; */
  };
  // this is trigerred inside ModalPop which will appear on click of pencil icon. On click on Save Updates this function is trigerred
  // initially we are checking all the valdations and after that calling the api and updating the state variables.

  checkAndUpdateSiteData = (e) => {

    const{showExtraRows,currSiteDefData,keepExtraVar}=this.state; 
    


    let siteEditedFields = 0;
    let siteEditedFieldsIssueList = [];
    let siteIrrigationSourceRefVal = '';
    let siteIrrigationTypeRefVal = '';
    let siteNameDefVal = this.editSiteNameFieldRef.current.defaultValue.trim();
    let siteNameCurrVal = this.editSiteNameFieldRef.current.value.trim();

    let siteAreaDefVal = this.editSiteAreaFieldRef.current.defaultValue.trim();
    let siteAreaCurrVal = this.editSiteAreaFieldRef.current.value.trim();

    let siteOwnTypeDefVal = this.state.currSiteDefData.leasedOrOwn.trim();
    let siteOwnTypeCurrVal =
      this.editSiteLeasedOrOwnedFieldRef.current.value.trim();
    // console.log(
    //   "Site own type curr val ",
    //   siteOwnTypeCurrVal,
    //   "____Def val ",
    //   siteOwnTypeDefVal
    // );

    let siteIrrigationTypeDefVal =
      this.state.currSiteDefData.irrigatedOrRainFed.trim();
    let siteIrrigationTypeCurrVal =
      this.editSiteIrrigatedOrRainfedFieldRef.current.value.trim();

      let siteIrrigationRefSourceDefVal =
      this.state.currSiteDefData.irrigation_source_id;
      if(showExtraRows || (parseInt(currSiteDefData.irrigatedOrRainFed)===1 && keepExtraVar===true)) {
         siteIrrigationSourceRefVal =
        this.editIrrigationSource.current.value;
  
         siteIrrigationTypeRefVal =
        this.editIrrigationType.current.value;
      }
         
      if(showExtraRows || (parseInt(currSiteDefData.irrigatedOrRainFed)===1 && keepExtraVar===true)) {
           if(siteIrrigationSourceRefVal==="")
           {
           alert("PLease Enter Source")
           this.setState({
            isSiteInfoUpdateStarted: false,

           })
           return
           }
           if(siteIrrigationTypeRefVal==="")
           {
           alert("PLease Enter Type")
           this.setState({
            isSiteInfoUpdateStarted: false,

           })
           return
           }


      }
     
      let siteIrrigationRefTypeDefVal =
      this.state.currSiteDefData.irrigation_type_id;
     

    // console.log(
    //   "Site irrigation type curr val ",
    //   siteIrrigationTypeCurrVal,
    //   "____Def val ",
    //   siteIrrigationTypeDefVal
    // );
  // console.log("siteIrrigationSourcevalue",siteIrrigationSourceRefVal)
    let siteReDigitizationDefVal,
      siteReDigitizationCurrVal,
      siteApproveOrRejDefVal,
      siteApproveOrRejCurrVal;

    if (this.state.currSiteDefData.ReDigitize === 0) {
      siteReDigitizationDefVal = this.state.currSiteDefData.ReDigitize;
      siteReDigitizationCurrVal =
        this.editSiteRedigitizationFieldRef.current.value;
    } else if (this.state.currSiteDefData.ReDigitize == 0) {
      siteReDigitizationDefVal = this.state.currSiteDefData.ReDigitize;
      siteReDigitizationCurrVal =
        this.editSiteRedigitizationFieldRef.current.value;
      siteApproveOrRejDefVal = this.state.currSiteDefData.Approval;
      siteApproveOrRejCurrVal =
        this.editSiteApproveOrRejectFieldRef.current.value;
    }

    let editedFieldsUpdatedData = {};

    if (siteNameCurrVal !== "") {
      if (siteNameCurrVal.toLowerCase() !== siteNameDefVal.toLowerCase()) {
        if (this.isClearOfSpecialCharacters(siteNameCurrVal)) {
          siteEditedFields += 1;
          editedFieldsUpdatedData.siteName = siteNameCurrVal;
        } else {
          let siteNameNotValidStringError =
            'Entered site name "' +
            siteNameCurrVal +
            '" is not valid, no special characters are allowed!';
          siteEditedFieldsIssueList.push(siteNameNotValidStringError);
        }
      }
    } else {
      let siteNameEmptyStringError =
        "Site name is mandatory, cannot leave it empty!";
      siteEditedFieldsIssueList.push(siteNameEmptyStringError);
    }

    if (siteAreaCurrVal !== "") {
      if (siteAreaCurrVal.toLowerCase() !== siteAreaDefVal.toLowerCase()) {
        if (this.checkFloat(siteAreaCurrVal)) {
          siteEditedFields += 1;
          editedFieldsUpdatedData.siteArea = siteAreaCurrVal;
        } else {
          let siteAreaNotValidFormatError =
            'Entered site area "' +
            siteAreaCurrVal +
            '" is not valid, only valid numeric values are allowed!';
          siteEditedFieldsIssueList.push(siteAreaNotValidFormatError);
        }
      }
    } else {
      let siteAreaEmptyStringError =
        "Site Area is mandatory, cannot leave it empty!";
      siteEditedFieldsIssueList.push(siteAreaEmptyStringError);
    }

    if (siteIrrigationTypeCurrVal !== siteIrrigationTypeDefVal) {
      /*  if(siteAreaCurrVal.toLowerCase() !== siteAreaDefVal.toLowerCase()){ */
      /*  if(this.checkFloat(siteAreaCurrVal)){ */
      siteEditedFields += 1;
      editedFieldsUpdatedData.irrigatedOrRainFed = siteIrrigationTypeCurrVal;
      /*  }else{ */
      /*     let siteAreaNotValidFormatError = "Entered site area \""+siteAreaCurrVal+"\" is not valid, only valid numeric values are allowed!";
                    siteEditedFieldsIssueList.push(siteAreaNotValidFormatError);
                } */
      /* } */
    } /* else{
            let siteIrrigationTypeNotChangedError = "No changes made in irrigation type!";
            siteEditedFieldsIssueList.push(siteIrrigationTypeNotChangedError);
        } */
       
        if(siteIrrigationSourceRefVal!==""){
        if (siteIrrigationSourceRefVal !== siteIrrigationRefSourceDefVal) {
        
          siteEditedFields += 1;
          editedFieldsUpdatedData.irrigation_source_id = parseInt(siteIrrigationSourceRefVal);
         
        } 
      }
      if(siteIrrigationTypeRefVal!=""){

        if (siteIrrigationRefTypeDefVal !== siteIrrigationTypeRefVal) {
        
          siteEditedFields += 1;
          editedFieldsUpdatedData.irrigation_type_id = parseInt(siteIrrigationTypeRefVal);
         
        } 
      }
    if (siteOwnTypeCurrVal !== siteOwnTypeDefVal) {
      /*  if(siteAreaCurrVal.toLowerCase() !== siteAreaDefVal.toLowerCase()){ */
      /*  if(this.checkFloat(siteAreaCurrVal)){ */
      siteEditedFields += 1;
      editedFieldsUpdatedData.leasedOrOwn = siteOwnTypeCurrVal;
      /*  }else{ */
      /*     let siteAreaNotValidFormatError = "Entered site area \""+siteAreaCurrVal+"\" is not valid, only valid numeric values are allowed!";
                    siteEditedFieldsIssueList.push(siteAreaNotValidFormatError);
                } */
      /* } */
    } /* else{
            let siteOwnTypeNotChangedError = "No changes made in own type!";
            siteEditedFieldsIssueList.push(siteOwnTypeNotChangedError);
        } */

    if (this.state.siteApprovedStatus !== -1) {
      siteEditedFields += 1;
      editedFieldsUpdatedData.Approval = this.state.siteApprovedStatus;
    }
    if (this.state.isReDigitizeReqRaised !== -1) {
      siteEditedFields += 1;
      editedFieldsUpdatedData.ReDigitize = this.state.isReDigitizeReqRaised;
    }

    if (siteEditedFieldsIssueList.length > 0) {
      // console.log(
      //   "Site Edit fields data issues list ",
      //   siteEditedFieldsIssueList
      // );
      let siteEditFieldsIssuesMsg = (
        <div className="wrap">
          {siteEditedFieldsIssueList.map((item, index) => {
            return (
              <Row>
                <Col className="errorMessage midText pad5">{item}</Col>
              </Row>
            );
          })}
        </div>
      );
      this.setState(
        {
          isSiteInfoUpdateStarted: false,
          currSiteEditingAlertType: "danger",
          currSiteEditingAlertHeading: "Entered Values are not valid!",
          currSiteEditingAlertBody: siteEditFieldsIssuesMsg,
        },
        () => {
          this.siteEditingAlertToggle(true);
          siteEditedFieldsIssueList = [];
        }
      );
    } else if (siteEditedFields > 0) {
      // console.log(
      //   "Edited fields in payload before sending it to API ",
      //   editedFieldsUpdatedData
      // );
      UserService.doSiteEdit(
        this.state.currSiteDefData.siteID,
        editedFieldsUpdatedData
      )
        .then(
          (response) => {
            // console.log("Landholding edit site response ", response);
            let responseCode = response.status;
            let mainResponseStatusTxt = response.statusText;
            if (responseCode === 200) {
              if (!this.isObjectEmpty(response.data)) {
                let responseDataMsg = response.data.message;
                let responseSuccessStatus = response.data.success;
                if (responseSuccessStatus) {
                  if (!this.isObjectEmpty(response.data.data)) {
                    let responseUpdatedSiteData = response.data.data;
                    let currLandHoldingLoadedData = this.state.landData;
                 
                    let currLandHoldingLoadedDataFarmers =
                      currLandHoldingLoadedData.farmers;
                    let indexOfEditedSite = -1;
                    let farmersIndexForLandHolding = -1;
                    currLandHoldingLoadedDataFarmers.map(
                      (farmerDetails, farmersIndex) => {
                        let currLandHoldingLoadedDataFarmersSitesList =
                          farmerDetails.sites;
                        // console.log(currLandHoldingLoadedDataFarmersSitesList);

                        currLandHoldingLoadedDataFarmersSitesList.filter(
                          (item, sitesIndex) => {
                            // console.log(item);
                            if (item.id === this.state.currSiteDefData.siteID) {
                              // console.log(sitesIndex);
                              farmersIndexForLandHolding = farmersIndex;
                              indexOfEditedSite = sitesIndex;
                            }
                          }
                        );
                    
                      }
                    );
                    currLandHoldingLoadedDataFarmers[
                      farmersIndexForLandHolding
                    ].sites[indexOfEditedSite] = responseUpdatedSiteData;
                    currLandHoldingLoadedData.farmers =
                      currLandHoldingLoadedDataFarmers;
                    let updatedLandHoldingDataAfterSitesUpdate =
                      currLandHoldingLoadedData;
                    // console.log(
                    //   "Updated landholding data after adding edited site info ",
                    //   updatedLandHoldingDataAfterSitesUpdate
                    // );
                    this.setState(
                      {
                        landData: updatedLandHoldingDataAfterSitesUpdate,
                        isSiteInfoUpdateStarted: false,
                        currSiteEditingAlertType: "success",
                        currSiteEditingAlertHeading: `Site \"${this.state.currSiteDefData.siteID}\" updated successfully!`,
                        currSiteEditingAlertBody: `Message from service : ${responseDataMsg}`,
                      },
                      () => {
                        this.siteEditingAlertToggle(true);
                        siteEditedFieldsIssueList = [];
                      }
                    );
                  } else {
                    this.setState(
                      {
                        isSiteInfoUpdateStarted: false,
                        currSiteEditingAlertType: "warning",
                        currSiteEditingAlertHeading: `Site \"${this.state.currSiteDefData.siteID}\" updated but couldn't fetch the updated data!`,
                        currSiteEditingAlertBody: `Message from service : ${responseDataMsg}`,
                      },
                      () => {
                        this.siteEditingAlertToggle(true);
                        siteEditedFieldsIssueList = [];
                      }
                    );
                  }
                } else {
                  this.setState(
                    {
                      isSiteInfoUpdateStarted: false,
                      currSiteEditingAlertType: "danger",
                      currSiteEditingAlertHeading: `Site \"${this.state.currSiteDefData.siteID}\" couldn't be updated!`,
                      currSiteEditingAlertBody: `Message from service : ${responseDataMsg}`,
                    },
                    () => {
                      this.siteEditingAlertToggle(true);
                      siteEditedFieldsIssueList = [];
                    }
                  );
                }
              } else {
                this.setState(
                  {
                    isSiteInfoUpdateStarted: false,
                    currSiteEditingAlertType: "warning",
                    currSiteEditingAlertHeading: `Couldn't successfully retreive proper response for updating the site \"${this.state.currSiteDefData.siteID}\" `,
                    currSiteEditingAlertBody: `Message from service : ${mainResponseStatusTxt}`,
                  },
                  () => {
                    this.siteEditingAlertToggle(true);
                    siteEditedFieldsIssueList = [];
                  }
                );
              }
            } else {
              this.setState(
                {
                  isSiteInfoUpdateStarted: false,
                  currSiteEditingAlertType: "danger",
                  currSiteEditingAlertHeading: `Couldn't update the site \"${this.state.currSiteDefData.siteID}\" now, please try again later! `,
                  currSiteEditingAlertBody: `Message from service : ${mainResponseStatusTxt}`,
                },
                () => {
                  this.siteEditingAlertToggle(true);
                  siteEditedFieldsIssueList = [];
                }
              );
            }
          },
          (error) => {
            // console.log(JSON.stringify(error));
            this.setState(
              {
                isSiteInfoUpdateStarted: false,
                currSiteEditingAlertType: "danger",
                currSiteEditingAlertHeading: `Couldn't contact the update service now, please try again later! `,
                currSiteEditingAlertBody: `Message from service : ${error.message}`,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString(),
              },
              () => {
                this.siteEditingAlertToggle(true);
                siteEditedFieldsIssueList = [];
              }
            );
          }
        )
        .catch((error) => {
          // console.log("Site Edite catch error (non parse)", error);
          // console.log("Site edit catch error ", JSON.stringify(error));
          this.setState(
            {
              isSiteInfoUpdateStarted: false,
              currSiteEditingAlertType: "danger",
              currSiteEditingAlertHeading: `Couldn't perform the update action, please contact the administrator! `,
              currSiteEditingAlertBody: `Message from service : ${error}`,
            },
            () => {
              this.siteEditingAlertToggle(true);
              siteEditedFieldsIssueList = [];
            }
          );
        });
    } else {
      // console.log("Site Edit fields data edited fields ", siteEditedFields);
      this.setState(
        {
          isSiteInfoUpdateStarted: false,
          currSiteEditingAlertType: "danger",
          currSiteEditingAlertHeading: "No Changes Made!",
          currSiteEditingAlertBody: "",
        },
        () => {
          this.siteEditingAlertToggle(true);
          siteEditedFieldsIssueList = [];
        }
      );
    }
  };
  /** Event methods ends */

  /** Other Methods starts */

  /** Field Validation methods starts */
  isObjectEmpty = (value) => {
    /* console.log(value," __ To check obj",Object.prototype.toString.call(value,""); */
    return (
      Object.prototype.toString.call(value) === "[object Object]" &&
      JSON.stringify(value) === "{}"
    );
  };
// here we r using regix for float variable which is used inside popup.
  checkFloat = (x) => {
    // console.log("To test float for ", x);
    var regexForFloat = /^[0-9]*[.]?[0-9]+$/;
    if (regexForFloat.test(x)) {
      return true;
    } else {
      return false;
    }
  };
 
//regix for integer
  checkInt = (x) => {
    var regexForInt = /^[1-9]\d*$/;
    if (x.toString().match(regexForInt)) {
      return true;
    } else {
      return false;
    }
  };
//regix for unsigned no.
  isOnlyUnsignedWholeNumber = (value) => {
    let onlyNumericRegex = /^[0-9]+$/;
    if (onlyNumericRegex.test(value)) {
      return true;
    } else {
      return false;
    }
  };
  // here we r using regix for no special characters required which is used inside popup.

  isClearOfSpecialCharacters = (value) => {
    let NonSpls = /^[A-Za-z0-9 ]+$/;

    if (NonSpls.test(value)) {
      return true;
    } else {
      return false;
    }
  };
  /** Field Validation methods ends */

  toggleClass() {
    const currentState = this.state.isActive;
    // console.log(this.state.isActive);
    this.setState({ isActive: !currentState });
  }


  // this will be called on click of a card . and inside that filteringTofetch function is called the cards which appear on the top.
  // on click on cards this will dispaly the material table data . for eg . if u have clicked on the Owned card then 
  // material table data will show owned farmers.
  getFilterData(filterOption){
    this.setState(
      {
        // isLandHoldingTabLoading: true,
        activeCardId: filterOption,
      },
      this.filteringTofetchingData(filterOption)
      // this.getCardData(cardId)

    );
  }
// on click on cards this will dispaly the material table data . for eg . if u have clicked on the Owned card then 
  // material table data will show owned farmers. this function is basically filtering the table data and showing the data 
  // according to the card clicked.
  // here instead of calling an api we r taking data from local storage .
  filteringTofetchingData(filterOption){
    // console.log("filterOption",filterOption)
     if(filterOption!="registered"){
      this.setState({
        isExportApiBackend:false
      })
     }
     else{
      this.setState({
        isExportApiBackend:true
      })
     }
    let landholdingStorageData = JSON.parse(localStorage.getItem('landholding'))
    let allSitesGeoJson = JSON.parse(localStorage.getItem('sites_wkt'))
    let jsonSites = []
    let filteredData = []
    let sites = []
    let farmerData = landholdingStorageData.farmers
    
    if(filterOption === 'registered'){
      filteredData = farmerData.filter(function (farmer) {
        return farmer.sites.length > 0
      })
    }
    else if(filterOption === 'total_area'){
      filteredData = landholdingStorageData.farmers
    }
    else if(filterOption === 'own'){
        [filteredData, sites] = this.filterLeasedOrowned(farmerData, 2)
        jsonSites = allSitesGeoJson.features.filter(property => sites.includes(parseInt(property.properties.pk)))
        allSitesGeoJson.features = jsonSites 
    }
    
    else if(filterOption === 'farmers'){
     [ filteredData, sites ]= this.filterLeasedOrowned(farmerData, 1)
      
      jsonSites = allSitesGeoJson.features.filter(property => sites.includes(parseInt(property.properties.pk)))
      allSitesGeoJson.features = jsonSites
    }
    else if(filterOption === 'irrigated'){
      [filteredData, sites] = this.filterIrrigatedOrRainfed(farmerData, "Irrigated")      
      jsonSites = allSitesGeoJson.features.filter(property => sites.includes(parseInt(property.properties.pk)))
      allSitesGeoJson.features = jsonSites
   
    }
    else if(filterOption === 'rainfed'){
      [filteredData, sites] = this.filterIrrigatedOrRainfed(farmerData, "Rainfed")  
      jsonSites = allSitesGeoJson.features.filter(property => sites.includes(parseInt(property.properties.pk)))
      allSitesGeoJson.features = jsonSites

    }
      
    landholdingStorageData.farmers = filteredData
    this.setState({
      isLandHoldingTabLoading: false,
      landData: landholdingStorageData,
      allSitesList: allSitesGeoJson,
      // mainCardObj: mainCardValues,
      // landPaginationSize:landholdingStorageData.farmers,
      isLandHoldingLoading: false 
    },()=>{
      EventBus.dispatch("changeMapFeatures", {
        BBox: [ 18.146633, 79.088860 ],
        ZoomLvl: 5,
        filterdSitesData: allSitesGeoJson,
      });
    });

  }

  //filtering can be done in deep level 
  // filtering cards data based on category .
  filterLeasedOrowned(arr, category) {
  
    var result = [];

    arr.forEach((component, index)=> {
      const comp = {...component};
      if(Array.isArray(comp.sites)) {
        comp.sites = comp.sites.filter((subMenu)=> {
        return subMenu.leasedOrOwn === category ;
      });

      if( comp.sites.length > 0) {
        result.push(comp);
      }
      }
    });
    var sitesIds = []
    result.map(farmer=> {
      farmer.sites.map(site => {
        sitesIds.push(site.id)
      })
    })
    return [result, sitesIds]
  }
    // filtering cards data .

  filterIrrigatedOrRainfed(arr, category){
    // var filterList = arr.filter(obj => obj.sites.some(cat => cat.land_watertype === category));
   
    var result = [];

    arr.forEach((component, index)=> {
      const comp = {...component};
      if(Array.isArray(comp.sites)) {
        comp.sites = comp.sites.filter((subMenu)=> {
        return subMenu.land_watertype === category ;
      });

      if( comp.sites.length > 0) {
        result.push(comp);
      }
      }
    });
    var sitesIds = []
    result.map(farmer=> {
      farmer.sites.map(site => {
        sitesIds.push(site.id)
      })
    })
    return [result, sitesIds]

  }
  // this is triggered on loading of the page.
  clickMenu(cardId) {
    this.setState(
      {
        isLandHoldingTabLoading: true,
        activeCardId: cardId,
      },
      this.forwardToFetchingData(cardId)
      // this.getCardData(cardId)

    );
  }
  // here we r setting data in localstorsge after callin a api.
  forwardToFetchingData(getSelection) {
    // console.log('calling API=====================')
    const fpo_id = localStorage.getItem("fpoId")
    // if(this.state.activeCardId!="registered"){
    //   this.setState({
    //     isExportApiBackend:false
    //   })
    //  }
    UserService.getLandholding(getSelection, fpo_id).then(
      (response) => {
        this.setState({ data_loaded:true })
        console.log("Landholding Resp", response);
        if(response.data.success){
          localStorage.setItem("landholding", JSON.stringify(response.data.data));
          localStorage.setItem('sites_wkt',  response.data.data.all_sites_wkt)
          // console.log("landData22",response.data.data)

          let allSitesGeoJson = JSON.parse(response.data.data.all_sites_wkt)
          let mainCardValues = {
          total_sites: response.data.data.total_sites,
          total_area: response.data.data.total_area,
          own_sites: response.data.data.own_sites,
          leased_sites: response.data.data.leased_sites,
          irrigated_sites: response.data.data.irrigated_sites,
          rainfed_sites: response.data.data.rainfed_sites,
          registered_sites: response.data.data.registered_sites,
          unreg_sites: response.data.data.unreg_sites,
          };
          this.setState({
          landData: response.data.data,
          
          allSitesList: allSitesGeoJson,
          isLandHoldingTabLoading: false,
          mainCardObj: mainCardValues,
          isLandHoldingLoading: false,

          });
          // console.log("landData",this.state.landData)

      }
      
      else{
        this.setState({
          isLandHoldingLoading: false,
          isLandHoldingTabLoading: false,
          // landData: [],
        })
      }
      },
      (error) => {
        this.setState({
          isLandHoldingTabLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }
 

  // on click on breadcrumb this function is called .this will redirect to different component.
  // navigateToPage = () => {
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

  
  callIt = () => {
    this.setState({ data_loaded:true })
    // console.log('-------------------- in call')
    this.clickMenu("total");
  }
  handleSelfieFarmerName=(FarmerName)=>{
    console.log("FarmerName",FarmerName)
    this.setState({
      selfieFarmerName:FarmerName
    })
  }
  getIrrigationtType=(Id)=>{
    const {IrrigationTypeDetails}=this.state;
    let finalvalue="";
    IrrigationTypeDetails.map((data)=>{
        if(data.id===Id)
        {
          finalvalue= data.irrg_type
        }
    })
    return finalvalue
  }
  getIrrigationSourceValue=(Id)=>{
    let finalsourcevalue="";
    const {IrrSourceDetails}=this.state;
    IrrSourceDetails.map((data)=>{

        if(data.id===Id)
        finalsourcevalue= data.source
    })
    return finalsourcevalue
  }
  handleMaterialTableExport=()=>{
    // console.log("handleMaterialTableExport",this.state.activeCardId)
    if(this.state.activeCardId != "registered"){
      return true
    }
    return false
  }
  handleDisableRefData=(e)=>{
    console.log("enter1")
    
    // if(this.editSiteIrrigatedOrRainfedFieldRef.current.value!=2)
    //   {
    //     console.log("enter56")
    //   }
  }
  handleExtraRow=()=>{
    const{showExtraRows,currSiteDefData,keepExtraVar}=this.state;

    if(showExtraRows===true)
    {
      // console.log("happy")
      return true
    }
    if(parseInt(currSiteDefData.irrigatedOrRainFed)===1 && keepExtraVar===true)
    {
      // console.log("happy aaaa")

    return true
    }
    return false
  }
 
  tryingChange=(e)=>{
    console.log("trying change",e.target.value)
    // console.log("qwerty",this.state.showExtraRows ,this.state.currSiteDefData.irrigatedOrRainFed)
    if(parseInt(e.target.value) === 1)
    { 
      // console.log("trying change 3444444",e.target.value)
      this.setState({
        showExtraRows:true
      })
    }
    else{
      console.log("tr")
      this.setState({
        showExtraRows:false,
        keepExtraVar:false
      })
    }
  }
  render() {
    // console.log("IrrSourceValue",this.state.IrrSourceValue)
    const {
      landData,
      allSitesList,
      siteEditingModal,
      currSiteDefData,
      siteApprovedStatus,
      isReDigitizeReqRaised,
      isSiteInfoUpdateStarted,
      showSiteEditingAlert,
      currSiteEditingAlertType,
      currSiteEditingAlertHeading,
      currSiteEditingAlertBody,
      floatingAlertWindowStatus,
      floatingAlertWindowAutoHideStatus,
      floatingAlertWindowHeading,
      floatingAlertWindowMsg,
      floatingAlertWindowMsgType,
      isFloatingWindowLoaderIconShown,
      mainCardObj,
      landPaginationSize,
      currentFpo,
      selfieurl,
      selfieModalisOpen
    } = this.state;
    
      // showModal function will get triggered on click on a Modal Popup.
    // Inside this we r setting all the variables which r used in a popup.
    // we are assigning values in setState  .
    const showSiteEditModal = (siteData) => {
      console.log("siteData",siteData)
      if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)){
        TriggerAlert(
          "Error",
          "You Do not have access to Edit.",
          "error"
        );
        return false
      }
      let currDefIrrigationTypeVal = 0;
      if (siteData.land_watertype === "Rainfed") currDefIrrigationTypeVal = "2";
      else if (siteData.land_watertype === "Irrigated")
        currDefIrrigationTypeVal = "1";
      let currSiteData = {
        siteName: siteData.siteName,
        leasedOrOwn: "" + siteData.leasedOrOwn + "",
        siteArea: siteData.siteArea,
        irrigatedOrRainFed: currDefIrrigationTypeVal,
        ReDigitize: siteData.redigitization_required,
        Approval: -1,
        siteID: siteData.id,
        irrigation_source_id:siteData.irrigation_source_id,
        irrigation_type_id:siteData.irrigation_type_id
      };
      this.setState({
        siteEditingModal: true,
        currSiteDefData: currSiteData,
      });
      
    };

      // hideModal function will get triggered on click on a  close button inside Modal Popup.
    // Inside this we r setting all the variables to empty which r used in a popup .
    const  hideSiteEditModal = () => {
      this.setState({
        siteEditingModal: false,
        currSiteDefData: {}

      });
    };
    const showSelfieModal = (val, date,name,number,relation,presigned_url,siteName,createdAt,rowData) => {
      console.log("rowData",rowData)
        if(date){
          if(date == 'NaT'){
            var lastdigitizeDate = createdAt
                dateSelfieLabel =false
          }else{
            var lastdigitizeDate = date
            dateSelfieLabel =true

          }
        }else {
          var lastdigitizeDate = createdAt
              dateSelfieLabel =false

        }

      //  console.log("rowData",siteName);
          this.setState({
          selfieSiteName:siteName,
        selfieModalisOpen: true,
         selfiename:name,
         selfienumber:number,
         selfierelation:relation,
         selfiedigitztn:lastdigitizeDate,
         selfieurl:presigned_url

      },()=>console.log("details",this.state.selfiename,this.state.selfienumber,this.state.selfierelation,this.state.selfiedigitztn,this.state.selfieurl))
      
    }
    const selfieModalHide = () => {
      this.setState({
        selfieModalisOpen: false,
      });
    };
// nested column has all the data which is shown in nested material table.
    const nestedColumns = [
      { title: "Site Name", field: "siteName" },
      {
        title: "Crop Details",
        field: "crop.crop__crop_name",
        export: true,

        render: (rowData) => {
          return (
            <div className="wrap" title="Crop Name">
              <Row className="noPadding">
                <Col lg="10" md="10" sm="10" className="noPadding">
                  {Array.isArray(rowData.crop) ? (
                    rowData.crop.map((data) => <li>{data.crop__crop_name} </li>)
                  ) : (
                    <div style={{ marginLeft: "18px" }}>{"No Crop"} </div>
                  )}
                </Col>
              </Row>
            </div>
          );
        },
        cellStyle: {
          width: "25%",
        },
      },
      {
        title: "Site Information",
        field: "siteArea",

        render: (rowData) => {
          // console.log("Site Information",rowData)
          return (
            <div className="wrap">
              <Row className="noPadding border-bottom" title="Site Area">
                <Col lg="2" className="noPadding">
                  <i
                    className="siteDetailIcons SiteAreaIcon"
                    title="Site Area"
                  ></i>
                </Col>
                <Col
                  lg="6"
                  className="noPadding"
                  title="Site Area"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.siteArea}
                </Col>
                <br/>
              </Row>
              {/* <Row style={{position:"relative",left:"20%"}}> {this.getIrrigationSourceValue(rowData.irrigation_source_id)}{rowData.irrigation_type_id!=null?"/":""}{this.getIrrigationtType(rowData.irrigation_type_id)}</Row> */}

              <Row className="noPadding" title="Land Water Type">
                <Col lg="2" className="noPadding" title="Land Water Type">
                  <i className="siteDetailIcons LandWaterTypeIcon"></i>
                </Col>
                <Col
                  lg="6"
                  className="noPadding"
                  title="Land Water Type"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.land_watertype}
                </Col>
              </Row>
              <Row style={{position:"relative",left:"20%"}}> {this.getIrrigationSourceValue(rowData.irrigation_source_id)}{rowData.irrigation_type_id!=null?"/":""}{this.getIrrigationtType(rowData.irrigation_type_id)}</Row>

            </div>
          );
        },
      },
    ];
    return (
      <div className="wrap">
        

        {this.state.isLandHoldingLoading ? (
          <div className="wrap">
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
            <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1);'  }} >
              <h5> FPO: {currentFpo} </h5>
            </div>
          : ""}

       
            <div className="wrap landHoldingPageLoaderWrap">
             {/* <span className="spinner-border spinner-border landHoldingPageLoader"></span> */}
             <img src={landholding_loader} height="170px" style={{position:"relative",top:"250px",left:"42%"}}/>

            </div>
          </div>
        ) : (
            <div className="wrap">
              <div className="landHoldingPageContenteHeader wrap">
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
              <h5 style={{marginLeft:"28px"}}> FPO: {currentFpo} </h5>
            </div>
              : ""}
                <div className="wrap LandHoldingMainCardsWrap">
                  <Row>
                    <Col md="2">
                      <div
                        id="registered"
                        onClick={this.getFilterData.bind(this, "registered")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "registered" ? "active" : ""
                        }`}
                      >
                        <span className="landHoldingMainCardsIcon sitesInfoIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.total_sites} ({mainCardObj.registered_sites}/
                          {mainCardObj.unreg_sites})
                        </span>
                        <span className="count-name">Sites Information</span>
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        id="total_area"
                        onClick={this.getFilterData.bind(this, "total_area")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "total_area" ? "active" : ""
                        }`}
                      >
                        <span className="landHoldingMainCardsIcon SiteAreaIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.total_area}
                        </span>
                        <span className="count-name">
                          (in Acres)
                          <br />
                          Total Area
                        </span>
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        id="own"
                        onClick={this.getFilterData.bind(this, "own")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "own" ? "active" : ""
                        }`}
                      >
                        <span className="landHoldingMainCardsIcon CompanyIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.own_sites}
                        </span>
                        <span className="count-name">
                          (in Acres)
                          <br />
                          Owned
                        </span>
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        id="farmers"
                        onClick={this.getFilterData.bind(this, "farmers")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "farmers" ? "active" : ""
                        }`}
                      >
                        <span className="FarmerOwnedIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.leased_sites}
                        </span>
                        <span className="count-name">
                          (in Acres)
                          <br />
                          Leased
                        </span>
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        id="irrigated"
                        onClick={this.getFilterData.bind(this, "irrigated")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "irrigated" ? "active" : ""
                        }`}
                      >
                        <span className="landHoldingMainCardsIcon IrrigIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.irrigated_sites}
                        </span>
                        <span className="count-name">
                          (in Acres)
                          <br />
                          Irrigated Land
                        </span>
                      </div>
                    </Col>
                    <Col md="2">
                      <div
                        id="rainfed"
                        onClick={this.getFilterData.bind(this, "rainfed")}
                        className={`card-counter landHoldingMainCards ${
                          this.state.activeCardId === "rainfed" ? "active" : ""
                        }`}
                      >
                        <span className="RainFedIcon"></span>
                        <span className="count-numbers dvaraBrownText">
                          {mainCardObj.rainfed_sites}
                        </span>
                        <span className="count-name">
                          (in Acres)
                          <br />
                          Rainfed Land
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="landholdingHeader wrap">
              {this.state.isLandHoldingTabLoading ? (
                <div className="wrap landHoldingPageLoaderWrap">
                  {/* <span className="spinner-border spinner-border landHoldingPageTabLoader"></span> */}
                
                  <img src={landholding_loader} height="170px" style={{position:"relative",top:"250px",left:"42%"}}/>
               
                </div>
              ) : (
                <Row>
                      <Col lg="7" md="7" className="landHoldingMainTab padTop10">
                    <div className="EmptySpacerContent wrap"></div>
                    <div className="LandHoldingHeading PageHeading padding15">
                      <h4
                        className="farmerListHeading dvaraBrownText"
                        style={{ marginLeft: "25px",fontSize:"22px"}}
                      >
                        Landholding
                      </h4>
                   

                    </div>
                    {this.state.isExportApiBackend?
                      <span style={{float:"right"}}>
                      <Button 
                    onClick={this.handleExport}
                              style={{position:"relative",zIndex:"100",marginTop:"20px",marginRight:"20px"}}
                              
                                className="defaultDisableButton"
                                disabled={this.state.buttonDisableExport}
                                   variant="primary"
                                   size="sm">
                             <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                              ></FontAwesomeIcon>
                            &nbsp;&nbsp;Export Data
                            {this.state.showDownloadLoader ? (
                          <div className="formDistLoadSpinnerWrap" style={{position:"relative",left:"28%"}}>
                          <span className="spinner-border spinner-border-sm"></span>
                         </div>
                         ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                        )} 
                          </Button>
                          </span>
                            :"" }
                  
                  
                    <MaterialTable
                      icons={tableIcons}
                      title=""
                      style={{ marginLeft: "15px" }}
                      columns={[
                        {
                          title: "Farmer Name",
                          width: "20%",
                          field: "first_name",
                          searchable: true,
                          // field:"last_name",

                          render: (rowData) =>
                            rowData.first_name + " " + rowData.last_name,
                        },
                        {
                          title: "Last Name",
                          // width: "20%",
                          field: "last_name",

                          hidden: true,
                          export: true,
                          searchable: true,
                        },

                        { title: "FR Name", field: "fr_name" , width: "20%"},
                        {
                          title: "Location Details",
                          width: "20%",
                          //   field: "phone",
                          field: "village",
                          //   sorting: true,
                          render: (rowData) => {
                            return (
                              <div className="wrap noPadding">
                                <Row className="noPadding">
                                  <Col
                                    lg="1"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <FontAwesomeIcon
                                      icon={faMapMarkerAlt}
                                      className="dvaraGreenText"
                                      title="Location"
                                    ></FontAwesomeIcon>
                                  </Col>
                                  <Col
                                    lg="10"
                                    md="10"
                                    sm="10"
                                    className="noPadding noPadding2"
                                  >
                                    {rowData.village}
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="1"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <FontAwesomeIcon
                                      icon={faMobileAlt}
                                      className="dvaraGreenText"
                                      title="Mobile Number"
                                    ></FontAwesomeIcon>
                                  </Col>
                                  <Col
                                    lg="10"
                                    md="10"
                                    sm="10"
                                    className="noPadding noPadding2"
                                  >
                                    {rowData.phone}
                                  </Col>
                                </Row>
                              </div>
                            );
                          },
                        },
                        {
                          title: "Phone No",

                          field: "phone",

                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Sites Information",
                          width: "40%",
                          field: "total_area",
                          export: false,

                          render: (rowData) => {
                            return (
                              <div className="wrap">
                                <Row className="noPadding">
                                  <Col
                                    lg="12"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    Total Area:&nbsp;
                                    {rowData.total_area} Acres
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="12"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <ProgressBar
                                      className="farmersRegSiteBar noPadding"
                                      animated
                                    >
                                      <ProgressBar
                                        className="farmerRegSiteBarStatus"
                                        max={rowData.total_sites}
                                        now={rowData.registered_sites}
                                        key={rowData.id}
                                      />
                                    </ProgressBar>
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="12"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    Registered Sites:&nbsp;
                                    <span className="darkGreenText">
                                      <b>{rowData.registered_sites}</b>
                                    </span>
                                    &nbsp;/&nbsp;
                                    {rowData.total_number_of_sites && (
                                      <span className="dvaraBrownText">
                                        {rowData.total_number_of_sites}
                                      </span>
                                    )}
                                    {rowData.total_sites && (
                                      <span className="dvaraBrownText">
                                        {rowData.total_sites}
                                      </span>
                                    )}
                                  </Col>
                                </Row>
                                {/* <Row
                                          className={this.getColorCode(
                                            rowData.redigitization_requested
                                          )}
                                        ></Row> */}
                              </div>
                            );
                          },
                        },

                        {
                          title: "Total Area",

                          field: "total_area",

                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Registered Sites",

                          field: "registered_sites",

                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Total Sites",

                          field: "total_sites",

                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                      ]}
                      data={landData.farmers}
                      // other props
                 //inside detail panel we are showing all the properties of nested table.
                      detailPanel={[
                        {
                          tooltip: "Show Sites",
                          render: (rowData) => {
                            return (
                              <div className="wrap">
                                <div className="verticalSpacer10"></div>
                                <div className="landHoldingSiteListWrap">
                                  <MaterialTable
                                    icons={tableIcons}
                                    title=""
                                    data={rowData.sites}
                                    columns={nestedColumns}
                                    actions={[
                                      (rowData) => ({
                                       
                                        icon: VisibilityIcon,
                                        tooltip: "View Selfie",
                                        onClick: (event, rowData) => {
                                          showSelfieModal(true,rowData.redigitization_date,rowData.selfie_person_name,rowData.selfie_person_number,rowData.selfie_person_relation,rowData.selfie_presigned_url,rowData.siteName, rowData.created_at,rowData);
                                        },
                                      }),
                                    
                                      (rowData) => ({
                                        disabled:parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor),
                                        icon: tableIcons.Edit,
                                        tooltip: "Edit",
                                        onClick: (event, rowData) => {
                                          if (
                                            window.confirm(
                                              'Are sure you want to edit site: "' +
                                                rowData.siteName +
                                                '"'
                                            )
                                          ) {
                                            showSiteEditModal(rowData);
                                          }
                                        },
                                      }),
                                    
                                      (rowData) => ({
                                        disabled:parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor),
                                        icon: tableIcons.Delete,
                                        tooltip: "Delete",
                                        onClick: (event, rowData) => {
                                          if (
                                            window.confirm(
                                              'Are sure you want to Delete site: "' +
                                                rowData.siteName +
                                                '"'
                                            )
                                          ) {
                                            this.setState(
                                              {
                                                isFloatingWindowLoaderIconShown: true,
                                                floatingAlertWindowHeading: `Deleting the Site '${rowData.id}'...`,
                                                floatingAlertWindowMsg: "",
                                                floatingAlertWindowMsgType: "",
                                              },
                                              () => {
                                                this.setActionMessageWindowStatus(
                                                  true
                                                );
                                                this.deleteSelSite(rowData.id);
                                              }
                                            );
                                          }
                                        },
                                      }),
                                     
                                    ]}
                                    onRowClick={(
                                      event,
                                      rowData,
                                      togglePanel
                                    ) => {

                                   
                                      let centerLocation = [
                                        rowData.finalLatitude,
                                        rowData.finalLongitude,
                                      ];
                                      EventBus.dispatch("changeMapBBox", {
                                        BBox: centerLocation,
                                        ZoomLvl: 20,
                                        farmer: "",
                                        siteData: rowData,
                                      });
                                    }}
                                   
                                  
                                    options={{
                                      // here we r showing color coding . according to the condition we r displaying the colors on the complete row.
                                      rowStyle: (rowData) => {
                                        let colorVal = "";
                                        let borderVal = "";
                                        let borderValTop = "";
                                        if (
                                          rowData.redigitization_required ==
                                          "-1"
                                        ) {
                                          colorVal =
                                            " inset -5px 1px 1px rgba(114, 49, 12, 1 ";
                                          borderVal =
                                            " 2px inset rgba(114, 49, 12, 1";
                                          borderValTop =
                                            " 3px inset rgba(114, 49, 12, 1";
                                        } else {
                                          colorVal = "";
                                          borderVal = "";
                                          borderValTop = "";
                                        }

                                        return {
                                          boxShadow: colorVal,
                                          borderRight: borderVal,
                                          borderTop: borderValTop,
                                          backgroundColor: "#f1f1f1",
                                          // borderBottom: "2px solid #e2e2e2",
                                        };
                                      },

                                      actionsColumnIndex: -1,
                                      //  search:false,
                                      exportAllData: true,
                                   
                                     
                                      headerStyle: {
                                        backgroundColor: "#A3C614",
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                        fontFamily: "barlow_reg",
                                        fontWeight: "bold",
                                      }
                                    }}
                                  />
                                </div>
                                <div className="verticalSpacer20"></div>
                              </div>
                            );
                          },
                        },
                      ]}
                      onRowClick={(event, rowData, togglePanel) => {
                        togglePanel();

                        let FarmerName =
                          rowData.first_name + " " + rowData.last_name;
                        let farmerFRName = rowData.fr_name;
                        // localStorage.setItem("selfiefrmrname", JSON.stringify(FarmerName));
                          this.handleSelfieFarmerName(FarmerName)
                     
                        if (rowData.sites.length > 0) {
                          let centerLocation = [
                            rowData.sites[0].finalLatitude,
                            rowData.sites[0].finalLongitude,
                          ];
                          EventBus.dispatch("changeMapBBox", {
                            BBox: centerLocation,
                            ZoomLvl: 18,
                            farmer: FarmerName,
                          });
                        }
                      }}
                      options={{
                       // here we r showing color coding . according to the condition we r displaying the colors on the complete row.
                        rowStyle: (rowData) => {
                          let colorVal = "";
                          let borderVal = "";
                          let borderValTop = "";
                          if (rowData.redigitization_requested === true) {
                            colorVal =
                              "  inset -5px 1px 1px rgba(114, 49, 12, 1 ";
                            borderVal = " 2px inset rgba(114, 49, 12, 1";
                            borderValTop = " 3px inset rgba(114, 49, 12, 1";
                          } else {
                            colorVal = "";
                            borderVal = "";
                            borderValTop = "";
                          }

                          return {
                            boxShadow: colorVal,
                            borderRight: borderVal,
                            borderTop: borderValTop,
                            backgroundColor: "#f1f1f1",
                            // borderBottom: "2px solid #e2e2e2",
                            fontSize: "0.9rem",
                          };
                        },
                        exportFileName: `Landholding Farmers Details - ${this.state.activeCardId}`,

                        doubleHorizontalScroll: true,
                        detailPanelColumnAlignment: "left",
                        detailPanelType: "single",
                        // exportAllData: false,
                        exportButton: this.handleMaterialTableExport(),

                        headerStyle: {
                          backgroundColor: "#A3C614",
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontFamily: "barlow_reg",
                          fontWeight: "bold",
                        },

                        filtering: false,
                        pageSize: 5,
                        pageSizeOptions: [
                          5,
                          10,
                         
                          100,
                          200,
                          // 500,
                          // 800,
                          
                          // { value:landPaginationSize.length, label: "All" },
                        ],
                        
                        tableLayout: "auto",
                      }}
                    />
                  </Col>
                  {/* on half page we are showing map .sp here we are initializing Map component. */}
                  <Col lg="5" md="5" className="MapViewPane padTop10 ">
                    <div className="EmptySpacerContent wrap"></div>
                    <div className="wrap MapContainerHolder">
                      <div className="MapContainer">
                        <Map sites={allSitesList} />
                                            

                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
            <div className="verticalSpacer20 wrap"></div>

            {/** Modal window for sites editing starts  **/}
            <Modal
              show={siteEditingModal}
              onShow={() => {
                this.setState(
                  {
                    isSiteInfoUpdateStarted: false,
                    currSiteEditingAlertType: "",
                    currSiteEditingAlertHeading: "",
                    currSiteEditingAlertBody: "",
                  },
                  () => {
                    this.siteEditingAlertToggle(false);
                  }
                );
              }}
              /* onHide={this.hideCoApplicantEditingModal} */
              backdrop="static"
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              style={{marginTop:"40px"}}
            >
              <Modal.Header  style={{borderRadius:"10px"}}>
                <Modal.Title>
                  <Row>
                    <Col>
                      <h5 className="dvaraBrownText">Edit Site Details</h5>
                      <br />
                    </Col>
                  </Row>
                  <Row className="noPadding wrap" style={{ width: "500px" }}>
                    <Col className="noPadding" lg="3">
                      <h6 className="dvaraGreenText">
                        Site ID: {currSiteDefData.siteID}{" "}
                      </h6>
                    </Col>
                    <Col className="noPadding" lg="8">
                      <h6 className="dvaraGreenText">
                        {" "}
                        Site Name: {currSiteDefData.siteName}{" "}
                      </h6>
                    </Col>
                  </Row>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Alert
                  show={showSiteEditingAlert}
                  onClick={() => {
                    this.siteEditingAlertToggle(false);
                  }}
                  variant={currSiteEditingAlertType}
                  dismissible
                >
                  <Alert.Heading>{currSiteEditingAlertHeading}</Alert.Heading>
                  <p>{currSiteEditingAlertBody}</p>
                </Alert>
              


                
                <Form id={`sitesEditingForm`} >
                  <Row>
                    <Col>
                      <Form.Row>
                        <Col lg="5" className="padTop10">
                          <Form.Group as={Col} controlId={`formSiteName`}>
                            <Form.Label>Site Name</Form.Label>
                            <Form.Control
                              size="sm"
                              defaultValue={currSiteDefData.siteName}
                              ref={this.editSiteNameFieldRef}
                              name="siteNameEditField"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="5" className="padTop10">
                          <Form.Row>
                            <Form.Group as={Col} controlId={`formSiteArea`}>
                              <Form.Label>Site Area</Form.Label>
                              <Form.Control
                                size="sm"
                                disabled
                                ref={this.editSiteAreaFieldRef}
                                defaultValue={currSiteDefData.siteArea}
                                name="siteAreaEditField"
                              />
                            </Form.Group>
                          </Form.Row>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Row>
                        <Col lg="5" className="padTop10">
                          <Form.Group as={Col} controlId={`formSiteOwnType`}>
                            <Form.Label>Leased or Own</Form.Label>
                            <Form.Group
                              as={Col}
                              controlId="formGridSiteOwnType"
                            >
                              <Form.Control
                                as="select"
                                // id={`leasedOrOwnedSelectBox`}
                                ref={this.editSiteLeasedOrOwnedFieldRef}
                                size="sm"
                                defaultValue={currSiteDefData.leasedOrOwn}
                                /*  onChange = {this.secondaryApplicantStateOnChange}*/
                              >
                                <option name="Owned" value="2">
                                  Owned
                                </option>
                                <option name="Leased" value="1">
                                  Leased
                                </option>
                              </Form.Control>
                            </Form.Group>
                          </Form.Group>
                        </Col>
                        <Col lg="5" className="padTop10">
                          <Form.Row>
                            <Form.Group
                              as={Col}
                              controlId={`formSiteIrrigationType`}
                            >
                              <Form.Label>Irrigated or Rainfed</Form.Label>
                              <Form.Control
                                as="select"
                                // id={`irrigatedOrRainfedSelectBox`}
                                ref={this.editSiteIrrigatedOrRainfedFieldRef}
                                size="sm"
                                defaultValue={
                                  currSiteDefData.irrigatedOrRainFed
                                }
                                 onChange = {this.tryingChange}
                              >
                                <option name="Owned" value="2">
                                  Rainfed
                                </option>
                                <option name="Leased" value="1">
                                  Irrigated
                                </option>
                                
                              </Form.Control>
                            </Form.Group>
                          </Form.Row>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Row>
                  <Row>
                  {/* <label for="cars">Choose a car:</label>

<select id="cars" ref={this.editIrrigationSource}
              >
  
                              {this.handleIrrigationTypeOption(this.state.IrrigationTypeDetails)}

</select> */}

                  </Row>
                 {/* {this.state.showExtraRows && currSiteDefData.irrigatedOrRainFed==1 ? */}
                 {/* {console.log("fff",this.state.showExtraRows,"second",currSiteDefData.irrigatedOrRainFed)} */}
                 {/* {this.state.showExtraRows || currSiteDefData.irrigatedOrRainFed==1 ? */}
                 {this.handleExtraRow()?


                  <Row>

                        <Col lg="5" className="padTop10">
                          <Form.Group as={Col} >
                            <Form.Label>Source</Form.Label>
                            <Form.Group
                              as={Col}
                             
                            >
                              <Form.Control
                                as="select"
                                ref={this.editIrrigationSource}
                                // defaultValue={
                                //   this.state.IrrSourceValue
                                // }
                                defaultValue={
                                  currSiteDefData.irrigation_source_id
                                }
                                // value={this.state.IrrSourceValue}
                                // onChange={this.handleSourceChange}
                                size="sm"
                              >
                                 <option value="">--Select Source--</option>
                                {this.state.IrrSourceDetails.map((data) => (
                                  <option
                               key={data.id}
                               name={data.source}
                              value={data.id}
                                    >
                                   {data.source}
            
                                  </option>
                                   ))
                                }
                              
                                {/* {this.handleIrrigationSourceOption(this.state.IrrSourceDetails)} */}
                              </Form.Control>
                            </Form.Group>
                          </Form.Group>
                        </Col>
                        <Col lg="5" className="padTop10">
                         
                            <Form.Group
                              as={Col}
                            >
                              <Form.Label>Type</Form.Label>
                              <Form.Control
                                as="select"
                                ref={this.editIrrigationType}
                                defaultValue={
                                  currSiteDefData.irrigation_type_id
                                }
                                // defaultValue={this.state.IrrDetailsValue}
                                // id={`irrigatedOrRainfedSelectBox`}
                                // value={this.state.IrrDetailsValue}
                                // onChange={this.handleTypeChange}

                                size="sm"
                               
                              >
                                <option value="">--Select Type--</option>
                                { this.state.IrrigationTypeDetails.map((data) => (
                                  <option
                               key={data.id}
                               name={data.irrg_type}
                              value={data.id}
                                    >
                                   {data.irrg_type}
            
                                  </option>
                                   ))
                                }
                                {/* {console.log("type", currSiteDefData.irrigation_type_id)} */}
                            {/* {this.handleIrrigationTypeOption(this.state.IrrigationTypeDetails)} */}

                              </Form.Control>
                            </Form.Group>
                      
                        </Col>
                   
                  
                  </Row>
  :""}
               
                  <Row>
                    <Col>
                      {currSiteDefData.ReDigitize > 0 ? (
                        <Form.Row>
                          <Col lg="5" className="padTop10">
                            <Form.Group
                              as={Col}
                              controlId={`formSiteRedigitization`}
                            >
                              <Form.Label>Redigitization Required?</Form.Label>
                              <br />
                              <Form.Label>
                                Redigitization Already requested
                              </Form.Label>
                              <br />
                            </Form.Group>
                          </Col>
                        </Form.Row>
                      ) : currSiteDefData.ReDigitize === -1 ? (
                        <Form.Row>
                          <Col lg="5" className="padTop10">
                            <Form.Group
                              as={Col}
                              controlId={`formSiteRedigitization`}
                            >
                              <Form.Label>Redigitization required?</Form.Label>
                              <br />
                              <Form.Label>
                                Redigitization Already requested
                              </Form.Label>
                              <br />
                            </Form.Group>
                          </Col>
                          <Col lg="5" className="padTop10">
                            <Form.Row>
                              <Form.Group
                                as={Col}
                                controlId={`formSiteApproveOrReject`}
                              >
                                <Form.Label>Approve or Reject?</Form.Label>
                                <br />
                                <ToggleButtonGroup
                                  type="radio"
                                  name="reDigitizationToggleSelection"
                                  className=""
                                  ref={this.editSiteApproveOrRejectFieldRef}
                                  defaultValue={siteApprovedStatus}
                                  onChange={this.doSiteApproveStatusChange}
                                >
                                  <ToggleButton
                                    value={1}
                                    variant="outline-success"
                                    title="Approve"
                                    size="sm"
                                  >
                                    {/* <i
                                                                    className="toggleButtonIcon makerToggleIcon editIconGreen"
                                                                    title="Maker"
                                                                ></i> */}
                                    Approve
                                  </ToggleButton>
                                  <ToggleButton
                                    value={0}
                                    variant="outline-danger"
                                    className=""
                                    title="Reject"
                                    size="sm"
                                  >
                                    {/*  <i
                                                                    title="checker"
                                                                ></i> */}
                                    Reject
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              </Form.Group>
                            </Form.Row>
                          </Col>
                        </Form.Row>
                      ) : (
                        <Form.Row>
                          <Col lg="5" className="padTop10">
                            <Form.Group
                              as={Col}
                              controlId={`formSiteRedigitization`}
                            >
                              <Form.Label>Redigitization Required?</Form.Label>
                              <br />
                              <ToggleButtonGroup
                                type="radio"
                                name="reDigitizationToggleSelection"
                                className="ToggleButton"
                                ref={this.editSiteRedigitizationFieldRef}
                                defaultValue={isReDigitizeReqRaised}
                                onChange={this.setReDigitizeReqStatus}
                              >
                                <ToggleButton
                                  value={1}
                                  className="toggleButtonElem makerToggle"
                                  title="Yes"
                                  size="sm"
                                >
                                  {/* <i
                                                            className="toggleButtonIcon makerToggleIcon editIconGreen"
                                                            title="Maker"
                                                        ></i> */}
                                  Yes
                                </ToggleButton>
                                <ToggleButton
                                  value={0}
                                  className="toggleButtonElem"
                                  title="No"
                                  size="sm"
                                >
                                  {/*  <i
                                                            title="checker"
                                                        ></i> */}
                                  No
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </Form.Group>
                          </Col>
                        </Form.Row>
                      )}
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  size="sm"
                  variant={isSiteInfoUpdateStarted ? "secondary" : "success"}
                  onClick={(e) => {
                    this.setState(
                      {
                        isSiteInfoUpdateStarted: true,
                        showSiteEditingAlert: false,
                        currSiteEditingAlertType: "",
                        currSiteEditingAlertHeading: "",
                        currSiteEditingAlertBody: "",
                      },
                      () => this.checkAndUpdateSiteData(e)
                    );
                  }}
                  className="fa-pull-right"
                  disabled={isSiteInfoUpdateStarted}
                >
                  <FontAwesomeIcon
                    icon={faSave}
                    className="dvaraBrownText"
                    title="Save Edits"
                  />{" "}
                  Update Changes
                  {isSiteInfoUpdateStarted ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="fa-pull-right"
                  onClick={(e) => {
                    this.setState(
                      {
                        isSiteInfoUpdateStarted: false,
                        showSiteEditingAlert: false,
                        currSiteEditingAlertType: "",
                        currSiteEditingAlertHeading: "",
                        currSiteEditingAlertBody: "",
                      },
                      () => this.editSiteClearEdits(e)
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="dvaraBrownText"
                    title="Clear Edits"
                  />{" "}
                  Clear Edits
                </Button>
                <Button
                  size="sm"
                  onClick={hideSiteEditModal}
                  className="fa-pull-right"
                >
                  Close
                </Button>
                <div className="clearFixing"></div>
              </Modal.Footer>
            </Modal>

            <Modal
                      show={selfieModalisOpen}
                      onHide={selfieModalHide}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton style={{backgroundColor:"rgba(163, 198, 20, 0.6)"}}>
                        <Modal.Title>
                          &nbsp;&nbsp;
                          <span className="dvaraBrownText">
                           Selfie Details
                          </span>
                         
                        </Modal.Title>
                      </Modal.Header>
                    
                            {/* <h6 className="dvaraBrownText" style={{marginLeft:"25px",marginTop:"5px"}}> Farmer Name : {this.state.selfieFarmerName}</h6>
                            <h6 className="dvaraBrownText" style={{marginLeft:"25px",marginTop:"5px"}}>Site Name : {this.state.selfieSiteName}</h6> */}

                            <div style={{marginTop:"10px"}}>
                              {console.log("selfieFarmerName",this.state.selfieFarmerName)}
                            <span className="dvaraBrownText" style={{marginLeft:"25px",fontSize:"16px"}}> Farmer Name :&nbsp; {this.state.selfieFarmerName.toUpperCase()}</span>
                            <span className="dvaraBrownText" style={{float:"right",marginRight:"35px",fontSize:"16px"}}>Site Name :&nbsp; {this.state.selfieSiteName.toUpperCase()}</span>

                            </div>
                         
                      <Modal.Body>
                      <div className="selfieWrap">
               <div className="selfieDivFirst"><img src={selfieurl!=null?selfieurl:noImageFpo} alt="No Image"/></div>
               <div className="selfieDivSecond">
                <Row>
                  <Col lg="1"></Col>
                  <Col lg="5">
                  <Form.Group>
                            <Form.Label className="colorCateg">Name</Form.Label>
                            <Form.Control
                              size="sm"
                              value={this.state.selfiename}
                              disabled
                              className="inputDisabled"


                            />
                          </Form.Group>
                  </Col>
                  <Col lg="5">
                  <Form.Group>
                            <Form.Label className="colorCateg"> {dateSelfieLabel?"Redigitized Date":"Digitized Date"}</Form.Label>
                            <Form.Control
                              size="sm"
                              type="date"
                              value={this.state.selfiedigitztn}
                              disabled
                              className="inputDisabled"
                            
                            />
                          </Form.Group>
                  </Col>
                  <Col lg="1"></Col>
                  <Col lg="1"></Col>
                  <Col lg="5">
                  <Form.Group>
                            <Form.Label className="colorCateg"> Relation</Form.Label>
                            <Form.Control
                              size="sm"
                              value={this.state.selfierelation}
                              disabled
                              className="inputDisabled"


                            />
                          </Form.Group>
                  </Col>
                  <Col lg="5">
                  <Form.Group>
                            <Form.Label className="colorCateg">Phone Number</Form.Label>
                            <Form.Control
                              size="sm"
                              value={this.state.selfienumber}
                              disabled
                              className="inputDisabled"


                            />
                          </Form.Group>
                  </Col>



                </Row>


               </div>


               </div>
                      </Modal.Body>
                      <Modal.Footer>
                       
                        <Button variant="success" onClick={selfieModalHide}>
                          Close
                        </Button>
                     
                      </Modal.Footer>
                    </Modal>
            {/** Modal window for sites editing ends  **/}

            <div className="actionMessageToastHolder">
              <Toast
                onClose={() => {
                  this.setActionMessageWindowStatus(false);
                }}
                show={floatingAlertWindowStatus}
                delay={15000}
                autohide={floatingAlertWindowAutoHideStatus}
              >
                <Toast.Header
                  className={`${
                    floatingAlertWindowMsgType === "error"
                      ? "errorMessage errorBG"
                      : floatingAlertWindowMsgType === "success"
                      ? "toastSuccessMessage successBG"
                      : "normalText"
                  }`}
                >
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded mr-2"
                    alt=""
                  />
                  <strong
                    className={`mr-auto ${
                      floatingAlertWindowMsgType === "error"
                        ? "errorMessage"
                        : floatingAlertWindowMsgType === "success"
                        ? "toastSuccessMessage"
                        : "normalText"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className={`mr-auto ${
                        floatingAlertWindowMsgType === "error"
                          ? "errorMessage"
                          : floatingAlertWindowMsgType === "success"
                          ? "toastSuccessMessage"
                          : "normalText"
                      }`}
                    />
                    &nbsp;&nbsp;{floatingAlertWindowHeading}
                  </strong>
                  &nbsp;&nbsp;
                  {isFloatingWindowLoaderIconShown ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                  {/* <small>11 mins ago</small> */}
                </Toast.Header>
                <Toast.Body>{floatingAlertWindowMsg}</Toast.Body>
              </Toast>
            </div>
          </div>
        )}
      </div>
    );
   
  }

  componentDidMount() {

    this.setState({
      isLandHoldingTabLoading: true
    })

    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({ isParentLogged:true, currentFpo: this.props.match.params.fpoName})
    }
    this.setState({
      accessed_supervisor:fpoId,
      logged_supervisor: user.user_id
    })
    if(parseInt(fpoId) !== parseInt(user.user_id)){     
      localStorage.removeItem("landholding");
      localStorage.removeItem("sites_wkt");
      this.clickMenu("total");
    }
     
    window.addEventListener('load', this.callIt );
    if(parseInt(fpoId) === parseInt(user.user_id)){
      let landholdingData = ""
     
      if(localStorage.getItem("landholding")){
        landholdingData = JSON.parse(localStorage.getItem("landholding"));
        let allSitesGeoJson = JSON.parse(localStorage.getItem("sites_wkt"))
        // console.log("Landholding componentDidMount------------", landholdingData);
        let mainCardValues = {
          total_sites: landholdingData.total_sites,
          total_area: landholdingData.total_area,
          own_sites: landholdingData.own_sites,
          leased_sites: landholdingData.leased_sites,
          irrigated_sites: landholdingData.irrigated_sites,
          rainfed_sites: landholdingData.rainfed_sites,
          registered_sites: landholdingData.registered_sites,
          unreg_sites: landholdingData.unreg_sites,
        };
        this.setState({
          landData: landholdingData,
          allSitesList: allSitesGeoJson,
          isLandHoldingTabLoading: false,
          mainCardObj: mainCardValues,
          isLandHoldingTabLoading: false,
          landPaginationSize:landholdingData.farmers,
          
        });
      }else{
        // console.log("Else part --------------------------------")
        this.setState({
            isLandHoldingLoading: true,
          })
          this.clickMenu("total");
        //   () => {
            
        //     this.clickMenu("total");
        //   }
        // );
      }
    }
    // else{
    //     if(!localStorage.getItem("landholding"))
    //       this.clickMenu("total");
        
    // }
     var flag=false;
    UserService.getIrrigationSource().then(
      (response) => {
          flag = true; 
          console.log("Irrigation source",response)
        this.setState({
          IrrSourceDetails: response.data.data,
          // IrrSourceValue:response.data.data[0].source

        
        });
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
        if (error.response){
          TriggerAlert("Error",error.response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      },
      setTimeout(() => {
        if(flag==false){
           
        TriggerAlert("Error","Response Timed out, Please try again","info");
        this.navigateMainBoard()

        }
    }, 30000)
    );
    UserService.getIrrigationTypeList().then(
      (response) => {
          flag = true; 
          console.log("Irrigation Type",response)

        this.setState({
          IrrigationTypeDetails: response.data.data,
          // IrrDetailsValue:response.data.data[0].id
        
        });
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
        if (error.response){
          TriggerAlert("Error",error.response.data.message,"error");
        }
        else {
          TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
        }
      },
      setTimeout(() => {
        if(flag==false){
           
        TriggerAlert("Error","Response Timed out, Please try again","info");
        this.navigateMainBoard()

        }
    }, 30000)
    );




  
  }
  
  componentWillUnmount(){
    window.removeEventListener('load', this.callIt );
  }
}
