import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom"; 
import { Router, Route, browserHistory } from "react-router";
import UserService from "../services/user.service";
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
    Form, Button,Modal,
    Carousel as Caro,
    CarouselItem
} from "react-bootstrap";
import Carousel from 'react-elastic-carousel';
import DateTime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

import "../assets/css/agro.css";
import "../assets/css/farmerlist.css";

import MaterialTable from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import noImageFpo from "../assets/img/noImageFpo.jpg";

import {
  faExclamationTriangle,
  faHtml5,
  faHome,
  faCaretRight,faDownload
} from "@fortawesome/free-solid-svg-icons";
import {TriggerAlert,} from './dryfunctions'
import AuthService from "../services/auth.service";

const imgURLPrefix = "https://seedcompany.s3.ap-south-1.amazonaws.com/";
// var browserHistor = ReactRouter.browserHistory;


var today = moment();//.add( 1, 'day' );
var refDate = "";
var valid = function (current) {
    return current.isBefore(today);
};
var isVerifiedDateValid = function (current) {
    return current.isAfter(refDate);
};

/**Stage Data Table Columns definition starts */
export const Comp = withRouter(({ history, location }) => {});

/**Stage Data Table Columns definition ends */

class AgronomicActivities extends Component {
  /** Constructor declation starts */
  constructor(props) {
    super(props);

    /** Binding the Event Methods starts */
    this.handleMasterActivityListClick =
      this.handleMasterActivityListClick.bind(this);
    this.handleSubActivityChange = this.handleSubActivityChange.bind(this);
    this.refMaterial = React.forwardRef();
    this.handleExportData = this.handleExportData.bind(this);

    /** Binding the Event Methods ends */

    /** Setting up of default states starts*/
    this.state = {
      siteCropID: 0,
      siteCropName: "",
      masterActivityID: 0,
      subActivitiesID: 0,
      masterActivitiesList: [],
      subActivitiesList: [],
      mainSelectedCropStageData: [],
      mainSelectedSubActivitiesList: [],
      selMasterActivityGroupID: 0,
      selActivityMainID: 0,
      selActivityGroupName: "",
      selSubActivityName: "",
      isStatusYesMasterActivitiesFound: false,
      isMasterActivitesListLoading: false,
      isSubActivitiesTabDataLoading: false,
      isSubactivitiesToggleHappening: false,
      content: "",
      fpoName: localStorage.getItem("fpoName"),
      isParentLogged: false,
      currentFpo:"",
      showDownloadLoader:false,
      fullImageOpen:false,
      image:"",
      rowImages: []
      };
    /** Setting up of default states ends*/
  }
  /** Constructor declation starts */

  /** Class Event binded Methon definitions starts */
  handleMasterActivityListClick = (event, getSelMasterActDets) => {
    // console.log(
    //   "Element ",
    //   event,
    //   " / Selected Main Act Arr",
    //   getSelMasterActDets
    // );
    let getSelCropStageID = 0;
    let activeActivityGroupName = "";
    let activeSubActivityName = "";
    let getSelGroupActID = getSelMasterActDets.activity_group_id;
    let listOfSelSubActivities = [];
    activeActivityGroupName = getSelMasterActDets.name;
    if (getSelMasterActDets.sub_act.length > 0) {
      getSelCropStageID = getSelMasterActDets.sub_act[0].id;
      activeSubActivityName = getSelMasterActDets.sub_act[0].name;
      listOfSelSubActivities = getSelMasterActDets.sub_act;
    } else {
      getSelCropStageID = getSelMasterActDets.id;
    }
    // console.log(
    //   "New Group Act ID : ",
    //   getSelGroupActID,
    //   " / New Crop Stage ID : ",
    //   getSelCropStageID
    // );
    // console.log(
    //   "List of Sub Activities under the Group ID :",
    //   getSelMasterActDets.sub_act
    // );
    this.setState(
      {
        selMasterActivityGroupID: parseInt(getSelGroupActID),
        mainSelectedSubActivitiesList: listOfSelSubActivities,
        selActivityMainID: parseInt(getSelCropStageID),
        selActivityGroupName: activeActivityGroupName,
        selSubActivityName: activeSubActivityName,
        isSubActivitiesTabDataLoading: true,
      },
      this.fetchTheSelectedActivityTabData(
        getSelCropStageID,
        this.state.siteCropID
      )
    );
  };
  handleExportData = (event) => {
    const sitedata = this.state.siteCropID
    this.setState({showDownloadLoader: true})
    var todaydate = moment(new Date()).format('MM-DD-YYYY-hh-mm-a')
      UserService.ExportAgronomicActivitiesData(sitedata).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "Agronomic_Activities_"+todaydate+'.xlsx');

      document.body.appendChild(link);
      link.click();
      this.setState({showDownloadLoader:false})
    });
  }
  
  /** Sub Activity Toggle Button click event method starts  */
  handleSubActivityChange = (e) => {
    // console.log(e);
    this.setState(
      {
        selActivityMainID: parseInt(e),
      },
      this.fetchTheSelectedActivityTabData(e, this.state.siteCropID)
    );
  };
  /** Sub Activity Toggle Button click event method ends  */

  /** Class Event binded Methon definitions starts */

  /** Class Methods sections starts */

  /*** Function for fetching the master activities list starts */

  fetchMasterActivitiesList = (getSiteCropID) => {
    // console.log(
    //   "Fetching Master Activity List for the selected crop id :",
    //   getSiteCropID,
    //   " ....."
    // );
    UserService.getAgroMasterActivityList(getSiteCropID).then(
      (response) => {
        // console.log("All Master Activities List : ", response.data);
        this.setState({
          masterActivitiesList: response.data.data,
          isMasterActivitesListLoading: false,
        });
        let listOFStatusYesMasterActivities = response.data.data.filter(
          function (el) {
            return el.staus === "Yes";
          }
        );
        if (listOFStatusYesMasterActivities.length > 0) {
          // console.log(
          //   "List of YES Status activities from Master Activities List ",
          //   listOFStatusYesMasterActivities
          // );
          this.handleMasterActivityListClick(
            null,
            listOFStatusYesMasterActivities[0]
          );
        }
      },
      (error) => {
        this.setState({
          isMasterActivitesListLoading: false,
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

  /*** Function for fetching the master activities list starts */

  /** Function for retrieving the data for the selected activity starts */
  fetchTheSelectedActivityTabData = (getCropStageID, getSiteCropID) => {
    UserService.getSelActivityInfo(
      parseInt(getCropStageID),
      parseInt(getSiteCropID)
    ).then(
      (response) => {
        if (response.data.success) {
          this.setState({
            mainSelectedCropStageData: response.data.data,
            isSubActivitiesTabDataLoading: false,
          });
        }
      },
      (error) => {
        this.setState({
          isSubActivitiesTabDataLoading: false,
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
  /** Function for retrieving the data for the selected activity starts */

  /** Updating the activity data starts */
  updateActivityData = (updatedData, cropStageId, activityId, farmCropID) => {
    // console.log(
    //   "Trying to Update this ",
    //   updatedData,
    //   " for the crop stage id ",
    //   cropStageId,
    //   " / Act Id ",
    //   activityId,
    //   " and Field Crop ID ",
    //   farmCropID
    // );
    UserService.updateActivitiesTabData(
      updatedData,
      parseInt(cropStageId),
      parseInt(activityId),
      farmCropID
    ).then(
      (response) => {
        // console.log("Output from service ", response.data);
        this.fetchTheSelectedActivityTabData(activityId, this.state.siteCropID);
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
  };
  /** Updating the activity data starts */
  /** Delete the activity data starts */
  removeActivityData = (updatedData, cropStageId, activityId, farmCropID) => {
    // console.log(
    //   "Trying to Update this ",
    //   updatedData,
    //   " for the crop stage id ",
    //   cropStageId,
    //   " / Act Id ",
    //   activityId,
    //   " and Field Crop ID ",
    //   farmCropID
    // );
  };
  navigateToPage = (pageName) => {  
    const {fpoName, isParentLogged} = this.state    
    if(isParentLogged){
          if(pageName === "dashboard"){
              this.props.history.push("/fpohomeData");
          }
          else{
              this.props.history.push("/" + pageName + "/"+ fpoName);
          }
    }else{
          this.props.history.push("/" + pageName + "");           
    }
  };
 
  /** Delete the activity data starts */
  
    
    /*** Main Render method starts */
    handleBack = () => {
        this.props.history.goBack()
      }
     
       hideFullImage=()=>{
           console.log("Image is closed")
         this.setState({
         fullImageOpen:false
          })
        }
         
          
    render() {
       
    /** Fetching needed sate variables starts */
    const {
      siteCropID,
      siteCropName,
      isMasterActivitesListLoading,
      isSubActivitiesTabDataLoading,
      mainSelectedCropStageData,
      mainSelectedSubActivitiesList,
      masterActivitiesList,
      selMasterActivityGroupID,
      selActivityMainID,
      selActivityGroupName,
      selSubActivityName,
      currentFpo,
      fullImageOpen
    } = this.state;
      /** Fetching needed sate variables starts */
  const insectPestMgmtCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }// 2016-07-15}
              }
          />
      )
  },
  { title: "Product Name", field: "product_name" },
  { title: "Dosage Qty.", field: "dosage_qty" },
  {
      title: "Application Method", field: "application_method", lookup: { 0: 'Spray', 1: 'Other' },
      editComponent: props => (
          <Form>
              <Form.Control as="select" custom onChange={(e) => props.onChange(parseInt(e.target.value))}>
                  <option value="0">Spray</option>
                  <option value="1">Other</option>
              </Form.Control>
          </Form>
      )
  },
  { title: "Insect Appearance", field: "insect_appearance" },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (
      <div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}    
      </div>
      )
    },
    cellStyle: {
    width: "10%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", 
  field: "updated_at",
  editable: 'never',
  render: rowData => 
     <div>
           {rowData.updated_at!==null ?
                        <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                        At <b>{rowData.updated_at.updated_at}</b></p>
  
             :"NA"}
  
  </div>
                      },
  ];
  const nutriMgmtCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString.toString());
                  refDate = momentString;
              }
              }
          />
      )
  },
  { title: "Material Type", field: "method_type", lookup: { 0: "Manure", 1: "Fertilizer", 2: "Others" } },
  { title: "Application Method", field: "application_method", lookup: { 0: "Soil Mixing", 1: "Foliar", 2: "Fertigation" } },
  { title: "Dosage.", field: "dosage_qty" },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "10%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  const landPrepCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString.toString());
                  refDate = momentString;
              }
              }
          />
      )
  }, { title: "Ploughing Type", field: "ploughing_type", lookup: { 0: 'Summer Ploughing', 1: 'Ploughing' }, editable: 'never' },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (
     <div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  const waterMgmtCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details Of Irrigation", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const sowingCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Variety", field: "variety"},
{ 
    title: "Spacing (in cm)", field: "" , width:"15%",
    render:(rowdata)=>{
      console.log("roews",rowdata)
      return(
        <div style={{textAlign:"center"}}> {rowdata.spacing1} <span style={{fontSize:"20px"}}>*</span> {rowdata.spacing2}</div>
      )
    }
},
  { title: "Duration (in Days)", field: "duration", type: "numeric",
  render:(rowdata)=>{
    console.log("roews",rowdata)
    return(
      <div style={{textAlign:"center"}}>{rowdata.duration}</div>
    )
  }
},
  { title: "Sowing Type", field: "sowing_type", lookup: { 0: 'Nuresery Sowing', 1: 'Transplanting/Sowing', 2: 'Re - Sowing' }, editable: 'never'},
  
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "5%",
    },
  },
  { title: "Details", field: "details" ,width:"15%"},
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  
  
  const cropIssuesCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  
  const plantDensityCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "No. Of Plants / Sq.m", field: "plantDensity", type: "numeric" ,
   render:(rowdata)=>{
     return(
      <div style={{textAlign:"center"}}>{rowdata.plantDensity}</div>
    )
  }},    
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const weedMgmtCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Chemical used", field: "chemical_used" },
  { title: "Dosage", field: "dosage" },
  { title: "Application Method", field: "application_type", lookup: { 0: "Manual", 1: "Follar" } },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  
  const diseaseMgmtCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Chemical used", field: "chemical_used" },
  { title: "Dosage", field: "dosage" },
  { title: "Application Method", field: "application_type", lookup: { 0: "Manual", 1: "Follar" } },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  const reprodStageFloweringCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Days of First Flowering", field: "first_flowering_days", type: "numeric",
  render:(rowdata)=>{
    return(
     <div style={{textAlign:"center"}}>{rowdata.first_flowering_days}</div>
   )
 } },
  { title: "Flowering 50% Days", field: "flowering_50percent_days", type: "numeric",
  render:(rowdata)=>{
    return(
     <div style={{textAlign:"center"}}>{rowdata.first_flowering_days}</div>
   )
 }},
  { title: "Status", field: "status"},
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const reprodStageFruitingCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Days of First Fruiting", field: "first_fruiting_days", type: "numeric" ,
  render:(rowdata)=>{
    return(
     <div style={{textAlign:"center"}}>{rowdata.first_fruiting_days}</div>
   )
 }},
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const reprodStageMaturityCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Colour Of Leaf", field: "leaf_color" },
  { title: "Maturity Stage", field: "maturity_stage", lookup: { 0: "Early Maturity", 1: "Late Maturity" } },
  { title: "Maturity Color", field: "maturity_color" },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  
  const harvestingCols = [{
      title: "Date Of Lifting From Field", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Percentage of Area Harvested (%)", field: "harvested_area_percentage", type: "numeric", headerStyle: { textAlign: "center" }, cellStyle: { textAlign: "center" } },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  
  const postHarvestingCols = [{
      title: "Date Of Lifting From Field", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Yield (in Qtl.)", field: "harvest_crop_yield", type: "numeric", headerStyle: { textAlign: "center" }, cellStyle: { textAlign: "center" } },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },{ title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const standardCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },
  { title: "Type", field: "type" },
  { title: "Image",
    field:"",
    width:"5%",
    export:false,
    filtering: false,
    render:(rowData)=>{
     return (<div>
      {rowData.imagepath1.length!=0?
      <div onClick={() =>setAndShowImage(rowData)}>
      <a href="#!">VIEW</a>
      </div> :"NA"}
      </div>
      )
    },
    cellStyle: {
    width: "15%",
    },
  },
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>{rowData.updated_at!=null?
                       <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                       At <b>{rowData.updated_at.updated_at}</b></p>:"NA"}</div>
                       },
  ];
  const otherActCols = [{
      title: "Activity Date", field: "activity_date", editComponent: props => (
          <DateTime
              dateFormat="YYYY-MM-DD"
              timeFormat={false}
              isValidDate={valid}
              initialViewDate={props.value}
              initialValue={props.value}
              onChange={(e) => {
                  var dateString = e._d;
                  var dateObj = new Date(dateString);
                  var momentObj = moment(dateObj);
                  var momentString = momentObj.format('YYYY-MM-DD');
                  props.onChange(momentString);
              }
              }
          />
      )
  },{title: "Activity Name", field: "activity_name"
  },{ title: "Image",
  field:"",
  width:"5%",
  export:false,
  filtering: false,
  render:(rowData)=>{
   return (<div>
    {rowData.imagepath1.length!=0?
    <div onClick={() =>setAndShowImage(rowData)}>
    <a href="#!">VIEW</a>
    </div> :"NA"}
    </div>
    )
  },
  cellStyle: {
  width: "15%",
  },
},
  { title: "Details", field: "details" },
  { title: "Updated", field: "updated_at",
    editable: 'never',
    render: rowData => 
    <div>
    {rowData.updated_at!==null ?
                 <p>By <b>{rowData.updated_at.updated_by}</b><br></br>
                 At <b>{rowData.updated_at.updated_at}</b></p>
  
      :"NA"}
  
  </div>
                      },
  ];
  const imageList=(images)=>{
    return images.map((image)=>{     
            return <Caro.Item >
              <div className="cropimage" style={{background:"darkgray"}}>
              <center>
              {image.presigned_url!=null?
              <img src={image.presigned_url} className="image" alt="No Image available" height="400px" width="600px" style={{objectFit:"contain"}}/>
                :
                <img src={noImageFpo} alt="No Image available" height="400px" width="600px" style={{objectFit:"contain"}}/>
              }
              </center>
              </div>           
              <div>
             <center>
             <p><span className="darkGreenText" style={{fontWeight:"700", float:"left", marginLeft:"140px"}}>{image.latitude} , {image.longitude}</span></p>
             <p style={{float:"left", marginLeft:"140px"}}>(Uploaded from <span className="darkGreenText" style={{fontWeight:"700"}}>{image.upload_type}</span>)</p>
             <p style={{float:"left", marginLeft:"140px"}}>Is It Uploaded from the same field? - {image.distance_from_field > 0.02 ? "No" : "yes"}</p>
             <p style={{float:"left", marginLeft:"140px"}}>Distance From Field : <span className="darkGreenText" style={{fontWeight:"700"}}>{image.distance_from_field} Km</span></p>
             </center>
             </div>      
            </Caro.Item> 
             
      }) ;   
  };
   const setAndShowImage=(rowData)=>{
    console.log("image", rowData) 
    this.setState({
      fullImageOpen:true,
      rowImages: rowData.imagepath1,
      })      
    }
    let currentCol = [];
    if (selActivityMainID === 1) {
      currentCol = insectPestMgmtCols;
    } else if (selActivityMainID === 2) {
      currentCol = nutriMgmtCols;
    } else if (selActivityMainID === 3) {
      currentCol = landPrepCols;
    } else if (selActivityMainID === 4) {
      currentCol = landPrepCols;
    } else if (selActivityMainID === 5) {
      currentCol = waterMgmtCols;
    } else if (selActivityMainID === 6) {
      currentCol = sowingCols;
    } else if (selActivityMainID === 7) {
      currentCol = sowingCols;
    } else if (selActivityMainID === 8) {
      currentCol = sowingCols;
    } else if (selActivityMainID === 9) {
      currentCol = cropIssuesCols;
    } else if (selActivityMainID === 10) {
      currentCol = cropIssuesCols;
    } else if (selActivityMainID === 11) {
      currentCol = plantDensityCols;
    } else if (selActivityMainID === 12) {
      currentCol = weedMgmtCols;
    } else if (selActivityMainID === 13) {
      currentCol = diseaseMgmtCols;
    } else if (selActivityMainID === 14) {
      currentCol = reprodStageFloweringCols;
    } else if (selActivityMainID === 15) {
      currentCol = reprodStageFruitingCols;
    } else if (selActivityMainID === 16) {
      currentCol = reprodStageMaturityCols;
    } else if (selActivityMainID === 17) {
      currentCol = harvestingCols;
    } else if (selActivityMainID === 18) {
      currentCol = postHarvestingCols;
    } else if (selActivityMainID === 19) {
      currentCol = standardCols;
    } else if (selActivityMainID === 20) {
      currentCol = otherActCols;
    }

    /** Render method's Return Function starts */
    return (
      <section className="mainWebContentSection">
        <Fragment>
          <div className="breadcrumb pageBreadCrumbHolder">
            <a
              href="#"
              className="breadcrumb-item breadcrumbs__crumb pageBreadCrumbItem"
              onClick={() => this.navigateToPage("dashboard")}
            >
              <FontAwesomeIcon
                icon={faHome}
                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
              />
              &nbsp;Dashboard
            </a>
            <FontAwesomeIcon
              icon={faCaretRight}
              className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
            />
            <a
              href="#"
              className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
              onClick={() => this.navigateToPage("crops")}
            >
              Crops List
                    </a>
                     <FontAwesomeIcon
                icon={faCaretRight}
                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
              />
              <a
                href="#"
                className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                onClick={() => this.handleBack()}
              >
                CropsFarmersList
              </a>
          
            
          </div>
          {this.state.isParentLogged? 
                   <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
                   <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
                  </div>
                   : ""}
          <div className="AgroMainWrap" style={{ marginRight: "5px" }}>
            <Row className="noPadding">
              <Col lg="12" md="12" className="noPadding">
                <h4 className="farmerListHeading dvaraBrownText">
                  Agronomic Activities
                </h4>
                <br />
                <h6 className="HeaderListSubText dvaraBrownText">
                  {siteCropID !== 0
                    ? "Crop Name : " + siteCropName
                    : "Some issue in fetching the neccessary data, please reload the page or try after sometime"}
                </h6>
              </Col>
            </Row>
            <Row className="noPadding">
              <Col lg="12" md="12" sm="12" className="noPadding">
                {isMasterActivitesListLoading ? (
                  <div className="mainActivityLoaderWrap">
                    <span className="spinner spinner-border spinner-border-md"></span>
                  </div>
                ) : !masterActivitiesList ? (
                  <div className="mainActivityLoaderWrap warningText">
                    <span className="agroMessageSpan">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className=""
                      ></FontAwesomeIcon>
                      &nbsp; No agronomic activities recorded for the selected
                      crop {" - " + siteCropName}
                    </span>
                  </div>
                ) : (
                  <Carousel itemsToShow={4} className="AgroActivityCarousel">
                    {masterActivitiesList.map((activities) => (
                      <div
                        key={activities.activity_group_id}
                        className={`text-center MainActivityHolder ${
                          selMasterActivityGroupID ===
                          activities.activity_group_id
                            ? "selectedMasterActivity"
                            : ""
                        } ${
                          activities.staus === "No" ? "disableElement" : ""
                        } `}
                        onClick={(e) => {
                          if (activities.staus !== "No") {
                            this.handleMasterActivityListClick(e, activities);
                          } else {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Row className="noPadding">
                          <Col lg="12">
                            <span className="verticalSpacer20"></span>
                          </Col>
                          <Col lg="12">
                            <span className="verticalSpacer10"></span>
                          </Col>
                          <Col lg="12">
                            <img
                              id="agro-img1"
                              className="agro-img-card2"
                              alt={activities.name}
                              src={activities.presigned_url}
                            />
                          </Col>
                          <Col lg="12" className="padTop10">
                            {activities.name}
                          </Col>
                          {/* <Col lg="12">{(activities.name !== activities.sub_activity)? (activitiesub_activity) : ("")}</Col> */}
                        </Row>
                      </div>
                    ))}
                  </Carousel>
                )}
              </Col>
            </Row>
            <Row>
            <Col lg="12" md="12" sm="12" className="noPadding">
                                  <Button onClick={this.handleExportData}
                                   className="defaultButtonElem"
                                   style={{marginTop:"30px",float:"right",marginRight:"35px"}}
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
            <Modal
                      show={fullImageOpen}
                      onHide={this.hideFullImage}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      style={{width:"600px",position:"center",marginLeft:"450px"}}
                    >
                      <Modal.Header closeButton style={{marginTop:"5px"}}>                       
                      </Modal.Header>
                      <Modal.Body>                       
                      <div style={{height:"515px",position:"center"}}>
                        <Caro>
                          {imageList(this.state.rowImages)}
                        </Caro> 
                          </div>
                      </Modal.Body>
          </Modal>
            <Row>
              <Col lg="12" md="12" sm="12" className="padTop10">
                <div className="PageHeading padding15">
                  <h4 className="farmerListHeading dvaraBrownText">
                    {selActivityGroupName}
                  </h4>
                  <br />
                  <ToggleButtonGroup
                    type="radio"
                    name="subActivitySelection"
                    onChange={this.handleSubActivityChange}
                    className="farmerCategoryToggle"
                    defaultValue={selActivityMainID}
                  >
                    {mainSelectedSubActivitiesList.length > 0 ? (
                      mainSelectedSubActivitiesList.map((subActivities) =>
                        subActivities.Status !== "No" ? (
                          <ToggleButton
                            key={subActivities.id + "_ToggleButton"}
                            value={subActivities.id.toString()}
                            //className="toggleButtonElem activeToggle"
                            className={`toggleButtonElem ${
                              selActivityMainID === subActivities.id
                                ? "activeToggle"
                                : ""
                            }`}
                          >
                            &nbsp;{subActivities.sub_activity}
                          </ToggleButton>
                        ) : (
                          <ToggleButton
                            key={subActivities.id + "_ToggleButton"}
                            value={subActivities.id.toString()}
                            className="toggleButtonElem"
                            disabled
                          >
                            &nbsp;{subActivities.sub_activity}
                          </ToggleButton>
                        )
                      )
                    ) : (
                      <h6>No Sub Activities Available</h6>
                    )}
                  </ToggleButtonGroup>
                </div>
                {isSubActivitiesTabDataLoading ? (
                  <div className="wrap selActivityTabLoaderWrap">
                    <span className="spinner-border spinner-border-lg selActivityTabLoader"></span>
                  </div>
                ) : mainSelectedCropStageData.length ? (
                  <MaterialTable
                    icons={tableIcons}
                    title=""
                    columns={currentCol}
                    ref={this.refMaterial}
                    data={mainSelectedCropStageData}
                    // actions={[
                    /* {
                                                    icon: VisibilityIcon,
                                                    tooltip: 'View',
                                                    onClick: (event, rowData) => alert("Site Details: " + rowData.siteName)
                                                    }, */
                    /* {
                                                        icon: tableIcons.Edit,
                                                        tooltip: 'Edit',
                                                        onClick: (event, rowData) =>  {
                                                            alert("Are sure you want to edit site: " + rowData.siteName)
                                                            console.log("Sel row activity date ",rowData);
                                                            refDate = rowData.activity_date;
                                                        }                                        
                                                    }, */
                    /* {
                                                    icon: tableIcons.Delete,
                                                    tooltip: 'Delete',
                                                    onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.siteName),
                                                    } */
                    // ]}

                    editable={{
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            function getOnlyChanges(prevData, currData) {
                              const prevObjProperties = Object.keys(prevData);
                              const newObjProperties = Object.keys(currData);
                              const onlyChangedObj = {};
                              for (
                                let i = 0;
                                i < newObjProperties.length;
                                i++
                              ) {
                                if (
                                  prevData[prevObjProperties[i]] !==
                                  currData[newObjProperties[i]]
                                ) {
                                  onlyChangedObj[newObjProperties[i]] =
                                    currData[newObjProperties[i]];
                                }
                              }
                              return onlyChangedObj;
                            }
                            // console.log("Updated Data ", newData);
                            const changes = getOnlyChanges(oldData, newData);
                            this.updateActivityData(
                              changes,
                              newData.id,
                              newData.activity_id,
                              siteCropID
                            );
                            resolve();
                          }, 3000);
                        }),
                      onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            // console.log(oldData);
                            const dataDelete = [...mainSelectedCropStageData];
                            const index = oldData.tableData.id;
                            const changes = { is_archived: true };
                            dataDelete.splice(index, 1);
                            this.updateActivityData(
                              changes,
                              oldData.id,
                              oldData.activity_id,
                              siteCropID
                            );
                            resolve();
                          }, 3000);
                        }),
                    }}
                    options={{
                      doubleHorizontalScroll: true,
                      headerStyle: {
                        backgroundColor: "#A3C614",
                        color: "#efefef",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        textAlign:"left"
                      },
                      rowStyle: {
                        backgroundColor: "#e5e5e5",
                        borderBottom: "2px solid #fff",
                        fontSize: "0.9rem",
                        textAlign:"left"
                      },
                      filtering: false,
                      exportButton: true,
                      actionsColumnIndex: -1,
                    }}
                  />
                ) : (
                  <div className="warningText">
                    <span className="agroMessageSpan">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className=""
                      ></FontAwesomeIcon>
                      &nbsp; No Activities Recored Yet For{" "}
                      {" - " + siteCropName}
                    </span>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Fragment>
      </section>
    );
    /** Render method's Return Function ends */
  }
  /*** Main Render method ends */

  /** Componentdidmount method starts */
  componentDidMount() {
    
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({isParentLogged: true,currentFpo: this.props.match.params.fpoName})
    }
    if (this.props.match.params) {
      let selSiteCropId = this.props.match.params.cropId;
      let selSiteCropName = this.props.match.params.cropName;

      this.setState(
        {
          siteCropID: selSiteCropId,
          siteCropName: selSiteCropName,
          isMasterActivitesListLoading: true,
        },
        this.fetchMasterActivitiesList(selSiteCropId)
      );
    }
  }
  /** Componentdidmount method ends */

  /** Class Methods sections ends */
}

export default AgronomicActivities;