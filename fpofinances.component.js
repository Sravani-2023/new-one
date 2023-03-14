import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import {TriggerAlert,} from './dryfunctions';
import AuthService from "../services/auth.service";


import {

    Row,
    Col,
    Form
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoFI extends Component {
    constructor(props) {
        super(props)
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        
        this.state = {
            fpoFIcounts: [],
            loading: false,
            // ranges: [],
            SelDate: "all",
            showloader:true,
            SelSeason: "all",
            
          };
    }
    handleDateChange = (e) => {
        this.setState(
          {
            SelDate: e.target.value,
            fpoFIcounts: []
          }
          );
          this.fetchCropsCount(e.target.value, this.state.SelSeason)
    }
  
    handleSeasonChange = (e) => {
        this.setState(
          {
            SelSeason: e.target.value,
            fpoFIcounts: []
          }
        )
        this.fetchCropsCount(this.state.SelDate, e.target.value)
    }
    navigateToPage2= (pageName) => {
       
      this.props.history.push("/" + pageName + "");
    };

    fetchCropsCount = (range, season) => {
        var flag = false;

        UserService.getFpoFIsCount(range, season).then(
            (response) => {
                flag = true; 
                // console.log("fpofis::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader:false,
                        fpoFIcounts: response.data.fpo_fi_data,
                        // ranges: response.data.date_ranges_list

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
    
      //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are showing error message on frontend also if API returns an error in response.
    componentDidMount() {
        // if(!localStorage.getItem('user')){
        //     this.props.history.push('/')
        //     return
        //   }
          const user = AuthService.getCurrentUser();
          if(!user){
            this.props.history.push('/')
            return
          }
          if(!user.is_parent)
          this.props.history.push("/dashboard")
       

        this.fetchCropsCount('all', 'all')
    }
    createRangeOptions = (ranges) =>
        
        ranges.length
        ? ranges.map((data, i) => 
        (
            <option key={i} name={data} value={data}>
            {data}
            </option>
        ))
        : "";

    render() {

        const { fpoFIcounts, SelDate, SelSeason, showloader } = this.state;
        const columns = [

            {
                title: "Fpo Name",
                field: "farmer_fpo__name",
                cellStyle: {
                  minWidth: 300,
                  maxWidth: 300
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
                title: "Total Farmers Linked",
                field: "farmers_with_fi",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Quantum of Loan Given",
                field: "quantum_load",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Default Cases",
                field: "default_cases",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Mean Khetscore",
                field: "mean_khetscore",
                filtering: false,
                render: (rowData) => {
                 
                  return (
                    <div>
                      {rowData.mean_khetscore===0?rowData.mean_khetscore:parseFloat(rowData.mean_khetscore).toFixed(4)}
                     {/* {parseFloat(rowData.mean_khetscore).toFixed(2)} */}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Avg Landholding",
                field: "avg_landholding_size",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                      {rowData.avg_landholding_size==="0"?rowData.avg_landholding_size:parseFloat(rowData.avg_landholding_size).toFixed(4)}
                     {/* {parseFloat(rowData.mean_khetscore).toFixed(2)} */}
                   
                    </div>
                  );
        
                },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Avg No.of Sites",
                field: "avg_farmer_sites",
                filtering:false,
                render: (rowData) => {
                 
                  return (
                    <div>
                      {rowData.avg_farmer_sites===0?rowData.avg_farmer_sites:parseFloat(rowData.avg_farmer_sites).toFixed(4)}
                     {/* {parseFloat(rowData.mean_khetscore).toFixed(2)} */}
                   
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
                        <div className="PageHeading padding15 fpoCropsHeading">
                          <Row>
                            <Col md={6}>
                              <h4
                                className="farmerListHeading dvaraBrownText "
                                style={{ marginLeft: "30px",fontSize:"24px" }}
                              >
                                Organization Financials Data
                              </h4>
                            </Col>

                            {/* <Col className="seasonDropdown" md={8}>
                                                <Form>
                                                    <Row>
                                                        <Col>

                                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalYears">
                                                                <Form.Label column="sm" lg={2} className="dvaraBrownText">Date: </Form.Label>
                                                                <Col sm={6}>
                                                                    <Form.Control
                                                                        as="select"
                                                                        size="sm"
                                                                        value={SelDate}
                                                                        custom
                                                                        onChange={this.handleDateChange}
                                                                    >
                                                                        <option value="all">All</option>
                                                                        {this.createRangeOptions(ranges)}
                                                                    </Form.Control>
                                                                </Col>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalSeasons">
                                                                <Form.Label column="sm" lg={2} className="dvaraBrownText">Season: </Form.Label>
                                                                <Col sm={6}>
                                                                    <Form.Control
                                                                        as="select"
                                                                        size="sm"
                                                                        value={SelSeason}
                                                                        custom
                                                                        onChange={this.handleSeasonChange}
                                                                    >
                                                                        <option value="all">All</option>
                                                                        <option value="Zaid">Zaid</option>
                                                                        <option value="Kharif">Kharif</option>
                                                                        <option value="Rabi">Rabi</option>


                                                                    </Form.Control>
                                                                </Col>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Col> */}
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
                            data={fpoFIcounts}
                            columns={columns}
                            actions={
                              [
                                // {
                                //     icon: tableIcons.Edit,
                                //     tooltip: 'Edit',
                                //     onClick: (event, rowData) => showModal(true, rowData)
                                // },
                                // rowData => ({
                                //     icon: tableIcons.Delete,
                                //     tooltip: 'Delete',
                                //     isFreeAction: true,
                                //     onClick: (event, rowData) => {if(window.confirm('Are you sure to delete this "'+ rowData.wsp + '" record?'))
                                //                             {this.createWsp(rowData.id)}},
                                //   })
                              ]
                            }
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
                                { value: fpoFIcounts.length, label: "All" },
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