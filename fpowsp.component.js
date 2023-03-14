import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Row, Col } from "react-bootstrap";
import {TriggerAlert,} from './dryfunctions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/auth.service";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoWsp extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
            fpowspcounts: [],           
            loading: false,
            showloader:true,
        


        };
    }
    //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are showing error message on frontend also if API returns an error in response.
    componentDidMount() {
     
      const user = AuthService.getCurrentUser();
      if(!user){
        this.props.history.push('/')
        return
      }
      if(!user.is_parent)
        this.props.history.push("/dashboard")
      
        var flag = false;
        UserService.getFpoWspsCount().then(
            (response) => {
                flag = true;
                // console.log("fpowsps::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader:false,
                        fpowspcounts: response.data.fpo_wsp_data
                    });
                }
                else {
                    this.setState({showloader:false,})
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
                    showloader:false,
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
    navigateToPage= (pageName,fpoId,fpoName) => {
    
      localStorage.setItem("fpoId", JSON.stringify(fpoId));
      localStorage.setItem("fpoName", JSON.stringify(fpoName));

      this.props.history.push(
        "/wsp/" +
      
          fpoName
        
      );
     
      };
       //this function will navigate to Organization Dahboard.
      navigateToPage2= (pageName) => {
       
        this.props.history.push("/" + pageName + "");
      };

    

    render() {

        const { fpowspcounts, showloader } = this.state;
      
        const columns = [
          
            {
                title: "Fpo Name",
                field: "name",
                cellStyle: {
                  minWidth: 350,
                  maxWidth: 350
                },
                render: (rowData) => {
                  let fpoId = rowData.id;
                  let fpoName = rowData.name;


                  return (
                    <div
                      onClick={() =>
                        this.navigateToPage("wsp",fpoId,fpoName)
                         
                      }
                    >
                      <a href="#!">{rowData.name}</a>
                    </div>
                  );
        
                },
                // cellStyle: {
                //     width: "15%"
                // }
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
                title: "Total Warehouses",
                field: "wsp_count",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Capacity",
                field: "total_capacity",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
              title: "Latitude",
              field: "wsp_fpo__lat",
              filtering:false,
              render: (rowData) => {
              

                return (
                  <div>
                    {rowData.wsp_fpo__lat===null?"NA" :<span>{rowData.wsp_fpo__lat}</span> }
                  
                  </div>
                );
      
              },
              cellStyle: {
                  width: "15%"
              }
          },
          {
            title: "Longitude",
            field: "wsp_fpo__long",
            filtering:false,
            render: (rowData) => {
              

              return (
                <div>
                  {rowData.wsp_fpo__lat===null?"NA" :<span>{rowData.wsp_fpo__long}</span> }
                
                </div>
              );
    
            },
            cellStyle: {
                width: "15%"
            }
        }
          
        ];
        
            return (
              <section className="mainWebContentSection">
                <Fragment>
                <div  className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap"> 
                  <a
                href="#"
                className="breadcrumb-item pageBreadCrumbItem"
                onClick={() =>this.navigateToPage2("fpohomeData")}
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
                                Organization WSPs Data
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
                            style={{ marginLeft: "30px" }}
                            title=""
                            data={fpowspcounts}
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
                                { value: fpowspcounts.length, label: "All" },
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