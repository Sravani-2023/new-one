import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Row, Col } from "react-bootstrap";
import {TriggerAlert,} from './dryfunctions'
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoLandholding extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
            fpolandholdincounts: [],           
            loading: false,
            showloader:true,
           

        };
    }
   //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are calling the API and fetching the data and if API returns error then we are displaying an error messge .
    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if(!user){
          this.props.history.push('/')
          return
        }
        if(!user.is_parent)
          this.props.history.push("/dashboard")
        
        var flag = false;
        UserService.getFpoLandholdingsCount().then(
            (response) => {
                flag = true; 
                // console.log("fpolands::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader: false,
                        fpolandholdincounts: response.data.fpo_landholding_data
                    });
                }
                else {
                    this.setState({
                        showloader: false,
                    });
                    if (response){
                        TriggerAlert("Error",response.data.message,"error");
                      }
                      else {
                        TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
                      }
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
                this.props.history.push('/fpohomeData')             
                }
            }, 30000)
        );
    }
     // on clicking on FPO Name in pivot table this function is trigerred . Here we are storing the fpoName and fpoId in localStorage
     //then with that fpoName we are navigating to different component and changing the URL also.
    navigateToPage = (fpoId, fpoName) => {
      localStorage.setItem("fpoId", fpoId)
      localStorage.setItem("fpoName", JSON.stringify(fpoName));

      this.props.history.push("/landholding/" + fpoName);
    }
            //this function will navigate to Organization Dahboard.

    navigateToPage2= (pageName) => {
       
      this.props.history.push("/" + pageName + "");
    };
    //rendering the materialTable

    render() {

        const { fpolandholdincounts, showloader } = this.state;
      
        const columns = [
          
            {
                title: "Fpo Name",
                field: "farmer_fpo__name",
                headerStyle:{
               
                    position:"sticky",
                    top:0,
                    zIndex: 1000,
                
                  },
                cellStyle: {
                  position: '-webkit-sticky',
                  position: 'sticky',
                  background: '#f1f1f1',
                  left: 0,
                  zIndex: 1,
                  minWidth: 300,
                  maxWidth: 300
                },

                render: (rowData) => {
                  let sub_fpo_id = rowData.farmer_fpo;
                  let fpo_name = rowData.farmer_fpo__name;
                  return (
                    <div
                      onClick={() =>
                        this.navigateToPage(
                          sub_fpo_id,
                          fpo_name
                        )
                      }
                    >
                      <a href="#!">{rowData.farmer_fpo__name}</a>
                    </div>
                  );
        
                },
            },
            {
                title: "Block",
                field: "fpo_block",
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "District",
                field: "fpo_dist",
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "State",
                field: "fpo_state",
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Sites",
                field: "total_farmsites",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Registered Sites",
                field: "total_reg_farmsites",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "UnRegistered Sites",
                field: "total_unreg_farmsites",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Registered Area",
                field: "total_reg_area",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                     {parseFloat(rowData.total_reg_area).toFixed(2)}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Irrigation Area",
                field: "total_irrigated_area",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                  {Math.round(rowData.total_irrigated_area)}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Area without Irrigation",
                field: "total_notirrigated_area",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                  {Math.round(rowData.total_notirrigated_area)}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Avg Landholding Size",
                field: "avg_landholding_size",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                     {parseFloat(rowData.avg_landholding_size).toFixed(2)}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
          
        ];
        
            return (
              <section className="mainWebContentSection">
                <Fragment>
                <div  className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap"> 
                  <a
                href="#"
                className="breadcrumb-item pageBreadCrumbItem"
                onClick={() =>this.navigateToPage2("fpohomeData")
                }
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                  style={{ fontSize: "0.7rem" }}
                />
                &nbsp;Dashboard
              </a>
                  
                  
                  </div>
                  <div className="landholdingHeader wrap">
                    <Row>
                      <Col lg="12" md="12" sm="12" className="noPadding">
                        <div className="PageHeading padding15">
                          <Row>
                            <Col md={12}>
                              <h4
                                className="farmerListHeading dvaraBrownText"
                                style={{ marginLeft: "30px",fontSize:"24px" }}
                              >
                                Organization Landholdings Data
                              </h4>
                            </Col>
                          </Row>
                        </div>
                        {showloader ? (
                          <div className="mainCropsFarmerLoaderWrap">
                            <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                          </div>
                        ) : (
                          <MaterialTable
                        
                            icons={tableIcons}
                            title=""
                            style={{ marginLeft: "30px" }}
                            data={fpolandholdincounts}
                            columns={columns}
                           
                            options={{
                              maxBodyHeight:500,

                              actionsColumnIndex: -1,
                              doubleHorizontalScroll: true,
                              pageSize: 10,
                              pageSizeOptions: [
                                10,
                                20,
                                50,
                                100,
                                // {
                                //   value: fpolandholdincounts.length,
                                //   label: "All",
                                // },
                              ],
                              exportButton: true,

                              headerStyle: {
                                backgroundColor: "#A3C614",
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontFamily: "barlow_reg",
                                fontWeight: "bold",
                                position: 'sticky',
                                top:0,
                                overflow:"hidden",
                                left: 0,
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
       
    }
}