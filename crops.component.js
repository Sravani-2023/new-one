import React, { Component,  Fragment, useState } from "react";
import { Container, Card, Alert, Row, Col, ProgressBar, ProgressBarProps, ToggleButtonGroup, ToggleButton, Form, Breadcrumb } from "react-bootstrap";
import { Redirect, Route,Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import  MaterialTable  from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import crop_growing from "../assets/img/crop_growing.gif";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import {TriggerAlert,} from './dryfunctions'
import AuthService from "../services/auth.service";

      // have used class Component and inside that have decrlared all the needed variable in this.state.
export default class CropsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropsdata: [],
      dateRanges: {},
      showloader: true,
      isParentLogged: false,
      fpoName: localStorage.getItem('fpoName'),
      currentFpo:"",
      currentYear:"",
      CurrentSeason:""
    };
  }
  // on Click on crop Name inside Material Table in the first and last row this navigateToPage function will be Called
  navigateToPage = ( season, year,  isVerified, cropId,  area, 
      cropName = null, compType ) => {
    // as we r using the same navigateToPage function multiple times so have applied condition based on that it will take to respective page.
    const { fpoName, isParentLogged } = this.state
    if (compType === "cropDetails") {
      if(isParentLogged){
        this.props.history.push("/cropsFarmersList/" + fpoName + "/" + cropId + "/" + season + "/" +
            year + "/" + isVerified + "/" + cropName);
      }else{
        this.props.history.push("/cropsFarmersList/" + cropId + "/" + season + "/" + year + "/" +
            isVerified + "/" + cropName );
      }
    }else {
      if(isParentLogged){
        this.props.history.push("/inputcomponent/" + fpoName +  "/" + season + "/" + year + "/" + isVerified + 
        "/" + area + "/" + cropId);
      }else{
      this.props.history.push("/inputcomponent/" + season + "/" + year + "/" + isVerified + "/" + area + 
        "/" + cropId);
      }
    }
  };
  // this function is called in Breadcrumb
  navigateMainBoard = () => {
    const {isParentLogged} = this.state
    if(isParentLogged){
      this.props.history.push("/fpohomeData");
    }
    else{
      this.props.history.push("/dashboard");
    }
  }
  

  // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
  //  Here if response is not true then api will through an error message.
  componentDidMount() {
    var flag = false;
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    const currentYear = user.current_year;
    const currentSeason = user.current_season;
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({isParentLogged: true,currentFpo: this.props.match.params.fpoName})
    }
    if (user) {
      this.setState({
        currentUser: user,
        CurrentYear:currentYear,
        CurrentSeason:currentSeason,
      });
    }

    UserService.getCropsList(fpoId).then(
      (response) => {
        flag = true;
        // console.log("componentDidMount", response.data);
        var dateDict = {};
        response.data.date_range.map((date) => {
          dateDict[date] = date;
        });
        this.setState({
          cropsdata: response.data.crops,
          dateRanges: dateDict,
          showloader: false,
        });
    //     setTimeout(() => {
    //       this.setState({showloader: false })
    //  }, 5000)
        // console.log("dateRanges",this.state.dateRanges)
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
      // we r using setTimeOut function to display error message for a period of Time.
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          // this.props.history.push("/dashboard");
          this.navigateMainBoard()
        }
      }, 30000)
    );
  }
    // here we r rendering Material Table && have given all the title inside title: of Material Table 
  render() {
    const { cropsdata, dateRanges, showloader,currentFpo } = this.state;
    const columns = [
   
      {
        title: "Crop Name",
        field: "crop__crop_name",
        filtering: false,
        render: (rowData) => {
          let cropId = rowData.crop__id;
          let season = rowData.season;
          let year = rowData.date_range;
          let isVerified = rowData.is_verified;
          let cropName = rowData.crop__crop_name;
          let area = rowData.TotalArea;
          return (
            <div
              onClick={() =>
                this.navigateToPage(
                  season,
                  year,
                  isVerified,
                  cropId,
                  area,
                  cropName,
                  "cropDetails"
                )
              }
            >
              <a href="#!">{cropName}</a>
            </div>
          );

        },
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Status",
        field: "is_verified",
        lookup: { 1: "Unverified", 2: "Verified" },
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Season",
        field: "season",
        lookup: { Zaid: "Zaid", Kharif: "Kharif", Rabi: "Rabi" },
        defaultFilter: [this.state.CurrentSeason],
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Year",
        field: "date_range",
        lookup: dateRanges,
        defaultFilter: [this.state.CurrentYear],
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Total Area (in Acres)",
        field: "TotalArea",
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      // {
      //   title: "Total Yield (in Qtl.)",
      //   field: "TotalYield",
      //   filtering: false,
      //   cellStyle: {
      //     width: "15%",
      //   },
      // },
      // {
      //   title: "Input Requirements",
      //   field: "",
      //   filtering: false,
      //   render: (rowData) => {
      //     let cropId = rowData.crop__id;
      //     let season = rowData.season;
      //     // let year = rowData.year;
      //     let year = rowData.date_range;

      //     let isVerified = rowData.is_verified;
      //     let area = rowData.TotalArea;
      //     return (
      //       <div
      //         onClick={() =>
      //           this.navigateToPage(season, year, isVerified, cropId, area)
      //         }
      //       >
      //         <a href="#!">VIEW</a>
      //       </div>
      //     );
      //   },
      //   cellStyle: {
      //     width: "15%",
      //   },
      // },
    ];
    // if cropsdata is there then it will display materialTable else will display NO Data 
    if (cropsdata) {
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
            {this.state.isParentLogged? 
            <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
              <h5 style={{marginLeft:"28px"}}> FPO: {currentFpo} </h5>
            </div>
          : ""}

            <div className="landholdingHeader wrap">
              <Row>
                <Col lg="12" md="12" sm="12" className="noPadding">
                  <div className="PageHeading padding15">
                    <h4
                      className="farmerListHeading dvaraBrownText"
                      style={{ marginLeft: "25px",fontSize:"22px" }}
                    >
                      Crops List
                    </h4>
                  </div>
                  {showloader ? (
                    <div className="mainCropsFarmerLoaderWrap">
                                              {/* <img src="https://i.pinimg.com/originals/18/42/81/184281f0fe87517a950beb8112c308dd.gif" height="200px" style={{position:"relative",top:"100px",left:"40%"}}/> */}

                        <img src={crop_growing} height="200px" style={{position:"relative",top:"100px",left:"40%"}}/>
                      {/* <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span> */}
                    </div>
                  ) : (
                    <MaterialTable
                      icons={tableIcons}
                      style={{ marginLeft: "30px" }}
                      title=""
                      data={cropsdata}
                      columns={columns}
                      actions={
                        [
                          // {
                          //   icon: VisibilityIcon,
                          //   tooltip: "View Crop Analytics",
                          //   onClick: (event, rowData) =>
                          //     this.props.history.push(
                          //       "/cropanalytics/" +
                          //         rowData.crop__id +
                          //         "/" +
                          //         rowData.crop__crop_name.toString() +
                          //         ""
                          //     ),
                          // },
                          /* {
                                      icon: tableIcons.Edit,
                                      tooltip: 'Edit',
                                      onClick: (event, rowData) => alert("Are sure you want to edit site: " + rowData.siteName)
                                    },
                                  {
                                    icon: tableIcons.Delete,
                                    tooltip: 'Delete',
                                    onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.siteName),
                                  } */
                        ]
                      }
                      options={{
                        maxBodyHeight:600,
                        actionsColumnIndex: -1,
                        doubleHorizontalScroll: true,
                        pageSize: 10,
                        pageSizeOptions: [             
                          10,
                          20,
                          50,
                          100,
                          { value:cropsdata.length, label: "All" },
                        ],
                        /* headerStyle: {
                                      backgroundColor: '#A3C614',
                                      color: '#efefef',
                                      fontSize: '1.1rem',
                                      fontWeight: 'bold'
                                  },
                                  rowStyle: {
                                      backgroundColor: '#e5e5e5',
                                      borderBottom: '2px solid #fff',
                                      fontSize: '0.9rem'
                                  }, */
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
                    />
                  )}
                </Col>
              </Row>
            </div>
            <div className="verticalSpacer20"></div>
          </Fragment>
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