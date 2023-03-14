import React, { Component, Fragment } from 'react';
import {Row, Col, Button } from 'react-bootstrap';
import "../assets/css/landholding.css";
import "../assets/css/crops.css";
import UserService from "../services/user.service";
import MaterialTable from 'material-table';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import tableIcons from './icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faMap,
  faHome,
  faCaretRight,faDownload,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../services/auth.service";

import { faHireAHelper } from "@fortawesome/free-brands-svg-icons";
import {TriggerAlert,} from './dryfunctions'
import moment from 'moment';

 
export default class CropListByFarmer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      farmerData: [],
      cropId: 0,
      siteCropId: 0,
      CurrcropName: "",
      showloader: true,
      fpoName: localStorage.getItem("fpoName"),
      isParentLogged: false,
      currentFpo:""
    };
  }

  componentDidMount() {
    
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    let cropId = ""
    let season = ""
    let year = ""
    let isVerified = ""
    let cropName = ""
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({isParentLogged: true,currentFpo: this.props.match.params.fpoName})
    }
    if (this.props.match.params) {
      
      let split_url = this.props.match.url.split('/')
      if(split_url.length > 7){
        if(user.is_parent){
          // console.log('Parent logged-------------------------')
          cropId = split_url[3];
          season = split_url[4];
          year = split_url[5];
          isVerified = split_url[6];
          cropName = split_url.slice(7,).join().replace(',','/')

        }
        else{
          // console.log('child logged-------------------------')

          cropId = split_url[2];
          season = split_url[3];
          year = split_url[4];
          isVerified = split_url[5];
          cropName = split_url.slice(6,).join().replace(',','/')
        }
        
      }
      else{
        // console.log('child logged-------------------------')

        cropId = this.props.match.params.cropId;
        season = this.props.match.params.season;
        year = this.props.match.params.year;
        isVerified = this.props.match.params.isVerified;
        cropName = this.props.match.params.cropName;
      }
      // console.log(cropId);
      // console.log(season);
      // console.log(year);
      var flag = false;
      UserService.getCropsListByFarmer(cropId, season, year, isVerified, fpoId).then(
        (response) => {
          flag = true;
          // console.log("nesting of farmers crop",response.data.data)
          if (response.data.success) {
            this.setState({
              farmerData: response.data.data,
              currentCropId: cropId,
              CurrcropName: cropName,
              showloader: false,
            });
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
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            // this.props.history.push("/dashboard");
            this.navigateToPage("dashboard")
          }
        }, 30000)
      );
    }
  }
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

  navigateAgronamy = (data) => {
    const {fpoName, isParentLogged} = this.state
      if(isParentLogged){      
        this.props.history.push(
              "/agronomics/" +
                fpoName +
                "/" +
                data.id +
                "/" +
                data.crop__crop_name.toString() +
                ""
            );
        }else{
          this.props.history.push(
            "/agronomics/" +
              data.id +
              "/" +
              data.crop__crop_name.toString() +
              ""
          );
        }
  }
  handleExportCropData=()=>{
    const cropsdata = this.state.farmerData;
    console.log("export",cropsdata)
    this.setState({
      showDownloadLoader:true,
      buttonDisableExport:true
  })
  var cropidlist = []
      for(var i=0;i<cropsdata.length;i++){
        cropidlist.push(cropsdata[i]['id'])
      }
      console.log(cropidlist)
    UserService.getCropsListExportData(cropidlist).then(
      (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
           console.log(url);
          const link = document.createElement('a');
          link.href = url;
          var todaydate = moment(new Date()).format('MM-DD-YYYY-hh-mm-a')
          link.setAttribute('download', "Total_Agronomic_Activities_"+todaydate+'.xlsx');
          document.body.appendChild(link);
          link.click();
          this.setState({
              showDownloadLoader:false,
              buttonDisableExport:false
          })           
      });
    }

  render() {
    const { farmerData, siteCropId, CurrcropName, showloader, isParentLogged ,currentFpo} = this.state;
    // console.log(farmerData);
    if (farmerData) {
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
             
            </div>
            {this.state.isParentLogged? 
                   <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
                   <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
                  </div>
                   : ""}
           <Row>
            <Col lg="12" md="12" sm="12" className="noPadding">
                                  <Button onClick={this.handleExportCropData}
                                   className="defaultButtonElem"
                                   style={{marginTop:"30px",float:"right",marginRight:"52px"}}
                                   variant="primary"
                                   size="sm">
                             <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                              ></FontAwesomeIcon>
                            &nbsp;Export Data
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
            <div className="landholdingHeader wrap">
              <Row>
                <Col lg="12" md="12" sm="12">
                  <div className="PageHeading padding15" style={{marginLeft:"20px"}}>
                    <h4 className="farmerListHeading dvaraBrownText">
                      Crop Farmers
                    </h4>
                    <br />
                    <h6 className="HeaderListSubText dvaraBrownText">
                      {" Crop Name : " + CurrcropName}
                    </h6>
                  </div>
                  {showloader ? (
                    <div className="mainCropsFarmerLoaderWrap">
                      <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                    </div>
                  ) : (
                    <MaterialTable
                      icons={tableIcons}
                      title=""
                      style={{ width: "100%" }}
                      columns={[
                        {
                          title: "Farmer Name",
                          field: "",
                          width: "20%",
                          export:true,
                          // field: "farmer__last_name",
                          // style: {width: "0px"},
                          render: (rowData) => {
                            return (
                              rowData.farmer__first_name +
                              " " +
                              rowData.farmer__last_name
                            );
                          },
                        
                        },
                        {
                          title: "Agronomic Activities Captured",
                          field: "agronomyactivities",
                          width: "20%",
                          export:true,
                        },
                  
                        {
                          title: "First Name",
                  
                          field: "farmer__first_name",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        
                        {
                          title: "Last Name",
                  
                          field: "farmer__last_name",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        

                        {
                          title: "FR Name",
                          field: "farmer__farmer_fr__first_name",
                          // style: {width: "0px"},
                          width: "10%",
                          export:true,
                       
                        },
                        {
                          title: "Location Details",
                          width: "10%",
                          field: "",
                        
                          render: (rowData) => {
                            return (
                              <div className="wrap">
                                <Row>
                                  <Col lg="12" md="12" sm="12">
                                    <FontAwesomeIcon
                                      icon={faMapMarkerAlt}
                                      className="dvaraGreenText"
                                      title="Village"
                                    ></FontAwesomeIcon>
                                    &nbsp;{rowData.farmer__village}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="12" md="12" sm="12">
                                    <FontAwesomeIcon
                                      icon={faMap}
                                      className="dvaraGreenText"
                                      title="Site Name"
                                    ></FontAwesomeIcon>
                                    &nbsp;{rowData.farmer_site__siteName}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="12" md="12" sm="12">
                                    <i
                                      className="iconHolder areaIcon"
                                      title="Total Area"
                                    ></i>
                                    &nbsp;
                                    <span title="Total Area">
                                      {rowData.TotalArea} Acres
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            );
                          },
                        
                        },
                        {
                          title: "Village",
                  
                          field: "farmer__village",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Total Area",
                  
                          field: "TotalArea",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },

                        {
                          title: "Site Name",
                  
                          field: "farmer_site__siteName",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Cropping Info",
                          // style: {width: "0px"},
                          field: "",
                          width: "30%",
                          headerStyle: {
                           
                            textAlign:"center"
                          },

                          // field: "duration",
                          // field: "sowing_date",
                          // field: "harvest_date",
                          // field: "month",
                          render: (rowData) => {
                            return (
                              <div className="">
                                <Row
                                  className="border-bottom-greyDark"
                                  style={{ padding: "5px 0px 5px 5px" }}
                                >
                                  <Col lg="6" md="6" sm="6">
                                    Total Crop Yield
                                    <br />
                                    <span className="dvaraBrownText">
                                      {rowData.crop_yield}
                                    </span>
                                  </Col>
                                  <Col lg="6" md="6" sm="6">
                                    Duration
                                    <br />
                                    <span className="dvaraBrownText">
                                      {rowData.duration}&nbsp;Days
                                    </span>
                                  </Col>
                                  {/* <Col lg="4" md="4" sm="4">
                                    Month(s):
                                    <br />
                                    <span className="dvaraBrownText">
                                      {rowData.month}
                                    </span>
                                  </Col> */}
                                </Row>
                                <Row
                                  className=""
                                  style={{ padding: "5px 0px 5px 5px" }}
                                >
                                  {/* <Col
                                    lg="4"
                                    md="8"
                                    sm="8"
                                    title="Seed Variety"
                                  >
                                    <i
                                      className="CroppingFarmerDetsIcon CroppingFarmerSeedVarietyIcon"
                                      title="Seed Variety"
                                    />
                                    &nbsp;
                                    <span className="dvaraBrownText">
                                      {rowData.variety}
                                    </span>
                                  </Col> */}
                                  <Col lg="6" md="8" sm="8" title="Sowing Date">
                                    <i
                                      className="CroppingFarmerDetsIcon CroppingFarmerSowingIcon"
                                      title="Sowing Date"
                                    />
                                    &nbsp;
                                    <span className="dvaraBrownText">
                                      {rowData.sowing_date}
                                    </span>
                                  </Col>
                                  <Col
                                    lg="6"
                                    md="8"
                                    sm="8"
                                    title="Harvesting Date"
                                  >
                                    <i
                                      className="CroppingFarmerDetsIcon CroppingFarmerHarvestIcon"
                                      title="Harvesting Date"
                                    />
                                    &nbsp;
                                    <span className="dvaraBrownText">
                                      {rowData.harvest_date}
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            );
                          },
                          // cellStyle: {
                          //   width: "20%",
                          //   backgroundColor: "red"
                          //   // padding: "0",
                          // },
                        },
                        {
                          title: "Total Crop Yield",
                  
                          field: "crop_yield",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Duration (days)",
                  
                          field: "duration",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Months",
                  
                          field: "month",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Sowing Date",
                  
                          field: "sowing_date",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                        {
                          title: "Harvest Date",
                  
                          field: "harvest_date",
                  
                          hidden: true,
                          export: true,
                          searchable: true,
                        },
                      ]}
                      data={farmerData}
                      options={{
                        doubleHorizontalScroll: true,
                        pageSize: 10,
                        pageSizeOptions: [
                          10,
                          20,
                          50,
                          100,
                          { value: farmerData.length, label: "All" },
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
                          fontSize: "0.9rem",
                        
                        },
                        filtering: false,
                        exportButton: true,
                      }}
                      actions={[
                        {
                          icon: "View",
                          tooltip: "Go to Agronomics Page",
                          onClick: (event, rowData) => {this.navigateAgronamy(rowData)}
                            // this.props.history.push(
                            //   "/agronomics/" +
                              
                            //     rowData.id +
                            //     "/" +
                            //     rowData.crop__crop_name.toString() +
                            //     ""
                            // );
                          // },
                        },
                      ]}
                      components={{
                        Action: (props) => (
                          <div
                            onClick={(event) =>
                              props.action.onClick(event, props.data)
                            }
                            className="actionButtonCropFarmerDets"
                            title="View Agronomics"
                          >
                            <i className="viewAgroButton"></i>
                          </div>
                        ),
                      }}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </Fragment>
        </section>
      );
    } else {
      return (
        <div>
          <p>No Data Avaialable</p>
        </div>
      );
    }
  }
}
