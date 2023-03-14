import React, { Component, Fragment} from "react";
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
    Form
  } from "react-bootstrap";
import Carousel from 'react-elastic-carousel';
import DateTime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

import "../assets/css/agro.css";

import  MaterialTable  from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const imgURLPrefix = "https://seedcompany.s3.ap-south-1.amazonaws.com/";

var today = moment();//.add( 1, 'day' );
var valid = function( current ){
    return current.isBefore( today );
};

const insectPestMgmtCols = [  { title : "Activity Date", field : "activity_date", editComponent: props => (
        <DateTime 
         dateFormat="YYYY-MM-DD"
         timeFormat={false}
         isValidDate={ valid }
         initialViewDate = {props.value}
         initialValue = {props.value}
         onChange={(e) => {
                            var dateString = e._d;
                            var dateObj = new Date(dateString);
                            var momentObj = moment(dateObj);
                            var momentString = momentObj.format('YYYY-MM-DD'); 
                            // console.log("New Date", momentString);
                            props.onChange(momentString);
                        }// 2016-07-15}
        }
        />
      )},
                                            { title : "Details", field : "details"},
                                            { title : "Dosage Qty.", field : "dosage_qty"},
                                            {title: "Application Method", field : "application_method", lookup: { 0: 'Spray', 1: 'Other' },
                                            editComponent: props => (
                                                <Form>
                                                    <Form.Control as="select" custom onChange={(e) => props.onChange(parseInt(e.target.value))}>
                                                        <option value="0">Spray</option>
                                                        <option value="1">Other</option>
                                                    </Form.Control>
                                                </Form>
                                              )},
                                            { title : "Insect Appearance", field : "insect_appearance"}
                                        ];
const nutriMgmtCols = [  { title : "Activity Date", field : "activity_date", editComponent: props => (
    <DateTime 
     dateFormat="YYYY-MM-DD"
     timeFormat={false}
     initialViewDate = {props.activity_date}
     isValidDate={ valid }
    />
  )},
                                            { title : "Details", field : "details"},
                                            { title : "Dosage Qty.", field : "dosage_qty"},
                                            { title : "Verfied Date", field : "verified_date"}
                                        ];
const landPrepCols = [  { title : "Activity Date", field : "activity_date", editComponent: props => (
    <DateTime 
     dateFormat="YYYY-MM-DD"
     timeFormat={false}
     initialViewDate = {props.activity_date}
     isValidDate={ valid }
    />
  )},
                                            { title : "Details", field : "details"},
                                            { title : "Verfied Date", field : "verified_date"},
                                            { title : "Ploughing Type", field : "ploughing_type", lookup: { 0: 'Summer Ploughing', 1: 'Ploughing' }}
                                        ];
const waterMgmtCols = [ { title : "Activity Date", field : "activity_date", editComponent: props => (
    <DateTime 
     dateFormat="YYYY-MM-DD"
     timeFormat={false}
     initialViewDate = {props.activity_date}
     isValidDate={ valid }
    />
  )},
                        { title : "Details", field : "details"},
                        { title : "Verfied Date", field : "verified_date"}
                                        ];
const sowingCols = [{ title : "Activity Date", field : "activity_date", editComponent: props => (
    <DateTime 
     dateFormat="YYYY-MM-DD"
     timeFormat={false}
     initialViewDate = {props.activity_date}
     isValidDate={ valid }
    />
  )},
                    { title : "Details", field : "details"},
                    { title : "Variety", field : "variety"},
                    { title : "Sowing Type", field : "sowing_type", lookup: { 0: 'Nuresery Sowing', 1: 'Transplanting/Sowing', 2:'Re - Sowing' }},
                    { title : "Verified or Not", field : "verified", lookup: { 0: 'No', 1: 'Yes' }},
                    { title : "Verfied Date", field : "verified_date"}];

class Agro extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedCropId: 0,
            selectedCropName: "",
            isLoadingAgroActivityData: false,
            masterActivitiesList: [],
            selActivityTabData: [],
            isSelActivityTabLoading: false,
            isActivitiesPerformed: false,
            content: "",
            selectedActivityId: "",
            selectedActivityName: "",
            selectedActivitySubActName: "",
            idOfFirstEntryofStatusYesActivity: 0

        }
    }

    fetchActivityInfo = (getSelActivityId, getSelCropId) => {
        // console.log(getSelActivityId,"_fetchac_",getSelCropId);
        UserService.getSelActivityInfo(getSelActivityId, getSelCropId).then(
            response => {
            //   console.log(response.data);      
              //const keysInObj = Object.keys(response.data);
              //console.log(sampleTabData);
              const keysInObj = Object.keys(response.data);
              let neededKeyVal = keysInObj[0];
            //   console.log(neededKeyVal,"__",response.data[neededKeyVal]);
              this.setState({
                isSelActivityTabLoading    :   false,
                selActivityTabData  :   response.data[neededKeyVal]
              });
            },
            error => {
              this.setState({
                isSelActivityTabLoading    :   false,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
              });
            }
          );        
    };
    fetchMasterAgronomicActivitiesList = (getSiteCropId, getCropName) =>{
        UserService.getAgroMasterActivityList(getSiteCropId).then(
            response => {
            // console.log(response.data.data);
            var listOfStatusYesActivities = response.data.data.filter(function (el) {
                return el.Status === "Yes";
            });
            
                // console.log(listOfStatusYesActivities, "__",response.data.data);
                if(listOfStatusYesActivities.length > 0){
                    this.setState({
                        selectedCropId: getSiteCropId,
                        selectedCropName: getCropName,
                        masterActivitiesList    :  response.data.data,
                        isLoadingAgroActivityData    :   false,
                        isActivitiesPerformed   :   true,
                        isSelActivityTabLoading   :    true,
                        idOfFirstEntryofStatusYesActivity: listOfStatusYesActivities[0].id,
                        selectedActivityId: listOfStatusYesActivities[0].id, 
                        selectedActivityName: listOfStatusYesActivities[0].name, 
                        selectedActivitySubActName: listOfStatusYesActivities[0].sub_activity
                    },this.fetchActivityInfo(listOfStatusYesActivities[0].id, getSiteCropId));
                }
                else{
                    // console.log("no status yes found");
                    this.setState({
                        isLoadingAgroActivityData    :   false,
                        isSelActivityTabLoading   :    false,
                        isActivitiesPerformed   : false,
                        selectedCropId  :   getSiteCropId,
                        selectedCropName: getCropName
                    });
                }
            
            },
            error => {
            this.setState({
                isLoadingAgroActivityData    :   false,
                isSelActivityTabLoading   :    false,
                isActivitiesPerformed   : false,
                content:
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            });
            }
        );
    };

    updateActivityData = (updatedData, activityId) =>{
        // console.log(updatedData,"__UpdatedData__ID", activityId);
        UserService.updateActivitiesTabData(updatedData, activityId).then(
            response => {
                // console.log(response.data)
            },
            error => {
            this.setState({
                isLoadingAgroActivityData    :   false,
                isSelActivityTabLoading   :    false,
                isActivitiesPerformed   : false,
                content:
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            });
            }
        );
    }

    render(){
        const { selectedCropId, selectedCropName, masterActivitiesList, selectedActivityId, selectedActivityName, selectedActivitySubActName, idOfFirstEntryofStatusYesActivity, isSelActivityTabLoading, selActivityTabData, isLoadingAgroActivityData, isActivitiesPerformed } = this.state;
        // console.log("activity loading ", isLoadingAgroActivityData,"__IS ACTIVITIES DONE?__",isActivitiesPerformed);
        let currentCol = [];
        if(selectedActivityId === 1){
            currentCol = insectPestMgmtCols;
        }
        else if(selectedActivityId === 2){
            currentCol = nutriMgmtCols;
        }else if(selectedActivityId === 3){
            currentCol = landPrepCols;
        }else if(selectedActivityId === 4){
            currentCol = landPrepCols;
        }
        else if(selectedActivityId === 5){
            currentCol = waterMgmtCols;
        }
        else if(selectedActivityId === 6){
            currentCol = sowingCols;
        }
        else if(selectedActivityId === 7){
            currentCol = sowingCols;
        }
        else if(selectedActivityId === 8){
            currentCol = sowingCols;
        }
        return(
            <section className="mainWebContentSection">
                <Fragment>
                    <div className="AgroMainWrap">
                        <Row className="noPadding">
                            <Col lg="12" md="12" className="noPadding">
                                <h4 className="farmerListHeading dvaraBrownText">
                                    Agronomic Activities
                                </h4><br/>
                                <h6 className="HeaderListSubText dvaraBrownText">{"Crop Name : "+selectedCropName}</h6>
                            </Col>
                        </Row>
                        <Row className="noPadding">
                            <Col lg="12" md="12" sm="12" className="noPadding">
                            {/* <div className={`mainActivityLoaderWrap ${(isLoadingAgroActivityData) ? "showElement" : "hideElement"}`}><span  className="spinner-border spinner-border-md"></span></div>*/}
                            {isLoadingAgroActivityData ? 
                            (
                                <div className="mainActivityLoaderWrap"><span className="spinner spinner-border spinner-border-md"></span></div>
                            ):(isActivitiesPerformed ? (
                                masterActivitiesList.length ? (
                                <Carousel itemsToShow={4} className="AgroActivityCarousel">
                                                                        
                                        {masterActivitiesList.map(activities => (
                                                                    
                                                <div key={activities.id}                                                    
                                                    className={`text-center MainActivityHolder ${(selectedActivityId === activities.id) || (idOfFirstEntryofStatusYesActivity === activities.id) ? "selectedMasterActivity" : ""} ${activities.Status === "No" ? ("disableElement") : ""} `}
                                                    onClick={(e)=>{
                                                        if(activities.Status !== "No"){
                                                            this.setState({
                                                                selectedActivityId: activities.id, 
                                                                selectedActivityName: activities.name, 
                                                                selectedActivitySubActName: activities.sub_activity,
                                                                idOfFirstEntryofStatusYesActivity: 0
                                                            });
                                                            this.fetchActivityInfo(activities.id, selectedCropId);
                                                        }
                                                        else{
                                                            e.stopPropagation();
                                                        }                                                                    
                                                    }}>
                                                    <Row className="noPadding">
                                                        <Col lg="12"><span className="verticalSpacer20"></span></Col>
                                                        <Col lg="12"><span className="verticalSpacer10"></span></Col>
                                                        <Col lg="12"><img id="agro-img1" className="agro-img-card2" alt={activities.name} src={activities.presigned_url} /></Col>
                                                        <Col lg="12">{activities.name}</Col>
                                                        <Col lg="12">{(activities.name !== activities.sub_activity)? (activities.sub_activity) : ("")}</Col>
                                                    </Row>
                                                </div>
                                        ))}
                                </Carousel>  
                                ):
                                (<div className="mainActivityLoaderWrap errorText">
                                    <span  className="agroMessageSpan"><FontAwesomeIcon  icon={faExclamationTriangle} className=""></FontAwesomeIcon>&nbsp; Couldn't fetch the agronomic activities list, Please try again later</span>
                                 </div>
                                )
                            ) : (
                                <div className="mainActivityLoaderWrap warningText">
                                    <span  className="agroMessageSpan">
                                        <FontAwesomeIcon  icon={faExclamationTriangle} className=""></FontAwesomeIcon>&nbsp; No agronomic activities recorded for the selected crop {" - "+selectedCropName}
                                    </span>
                                 </div>
                            )
                        
                            )
                        }                        
                                                        
                            {/* {(isLoadingAgroActivityData)?((isActivitiesPerformed)?(
                               (masterActivitiesList.length)?(
                                <div>Activities Perfomed</div>):(
                                <div>Couldn't fetch data</div>)
                            ):(
                                <div>No Agronomic activity done</div>
                            )):(
                                <div className="mainActivityLoaderWrap"><span className="spinner-border spinner-border-md"></span></div>
                            )                   
                            }
 */}

                            {/* {(isLoadingAgroActivityData)?((isActivitiesPerformed)?
                             ((masterActivitiesList.length)?(
                             <div>Activities Perfomed</div>):
                             (<div>Couldn't fetch data</div>)
                            )
                             :(<div>No Agronomic activity done</div>)):(
                                <div className="mainActivityLoaderWrap"><span className="spinner-border spinner-border-md"></span></div>
                             )
                            } */}
                           {/*  { 
                                } */}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12" md="12" sm="12" className="padTop10">
                                <div className="PageHeading padding15">
                                    <h4 className="farmerListHeading dvaraBrownText">{selectedActivityName}</h4><br/>                         
                                    <h6 className="HeaderListSubText dvaraBrownText">{selectedActivitySubActName}</h6>
                                </div>
                                {isSelActivityTabLoading ? 
                                (
                                    <div className="wrap selActivityTabLoaderWrap">
                                        <span className="spinner-border spinner-border-lg selActivityTabLoader"></span>
                                    </div>
                                )
                                :
                                (<MaterialTable icons={tableIcons}
                                    title=""
                                    columns={currentCol}
                                    data={selActivityTabData}
                                    actions={[
                                        /* {
                                          icon: VisibilityIcon,
                                          tooltip: 'View',
                                          onClick: (event, rowData) => alert("Site Details: " + rowData.siteName)
                                        }, */
                                       /*  {
                                            icon: tableIcons.Edit,
                                            tooltip: 'Edit',
                                            onClick: (event, rowData) => alert("Are sure you want to edit site: " + rowData.siteName)
                                          }, */
                                        {
                                          icon: tableIcons.Delete,
                                          tooltip: 'Delete',
                                          onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.siteName),
                                        }
                                      ]}
                                    editable={{
                                        onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                            const dataUpdate = [...selActivityTabData];
                                            const index = oldData.tableData.id;
                                            dataUpdate[index] = newData;
                                            this.updateActivityData(dataUpdate[index], dataUpdate[index].activity_id);
                                            // console.log(oldData,"<--old Data <<>> Tab Update -->",  dataUpdate[index]);
                                            resolve();
                                            }, 1000, )
                                        }),
                                        /* onRowDelete: oldData =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                            const dataDelete = [...data];
                                            const index = oldData.tableData.id;
                                            dataDelete.splice(index, 1);
                                            setData([...dataDelete]);
                                            
                                            resolve()
                                            }, 1000)
                                        }) */
                                    }}
                                    options={{
                                        doubleHorizontalScroll: true,
                                        headerStyle: {
                                            backgroundColor: '#A3C614',
                                            color: '#efefef',
                                            fontSize: '1.3rem',
                                            fontWeight: 'bold'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#e5e5e5',
                                            borderBottom: '2px solid #fff',
                                            fontSize: '0.9rem'
                                        },
                                        filtering: false,
                                          exportButton: true,
                                      }}       
                                />)
                                }
                            </Col>
                            <Col lg="12" md="12" sm="12" className="noPadding">
                                <div className="verticalSpacer20"></div>
                            </Col>
                        </Row>
                    </div>
                </Fragment>
            </section>
        );
    }
    componentDidMount(){
        if(this.props.match.params){
            let cropId = this.props.match.params.cropId;
            let cropName = this.props.match.params.cropName;
            // console.log(cropId,"_",cropName);
            this.setState({
                isLoadingAgroActivityData    :   true
            },this.fetchMasterAgronomicActivitiesList(cropId, cropName));
       
            
            
              /* this.setState({
                selectedCropId: cropId,
                selectedCropName: cropName,
                masterActivitiesList    :  sampleMainActMaster,
                isLoadingAgroActivityData    :   false,
                isSelActivityTabLoading   :    true,
                idOfFirstEntryofStatusYesActivity: listOfStatusYesActivities[0].id,
                selectedActivityId: listOfStatusYesActivities[0].id, 
                selectedActivityName: listOfStatusYesActivities[0].name, 
                selectedActivitySubActName: listOfStatusYesActivities[0].sub_activity
              },this.fetchActivityInfo(listOfStatusYesActivities[0].id, cropId)); */
        } 
    }
}

export default Agro;