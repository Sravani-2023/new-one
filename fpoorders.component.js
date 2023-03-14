import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import {TriggerAlert,} from './dryfunctions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/auth.service";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import {

    Row,
    Col,
    Form
} from "react-bootstrap";
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoFarmerOrder extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
            fpoOrdercounts: [],
            loading: false,
            showloader:true,

           
        };
    }
    // handleDateChange = (e) => {
    //     this.setState(
    //       {
    //         SelDate: e.target.value,
    //         fpoOrdercounts: []
    //       }
    //       );
    //       this.fetchCropsCount(e.target.value, this.state.SelSeason)
    // }
    // handleSeasonChange = (e) => {
    //     this.setState(
    //       {
    //         SelSeason: e.target.value,
    //         fpoOrdercounts: []
    //       }
    //     )
    //     this.fetchCropsCount(this.state.SelDate, e.target.value)
    // }

    // fetchCropsCount = (range, season) => {
      
    //     console.log("selected:  ", range, season)


    // }

     // on clicking on FPO Name in pivot table this function is trigerred . Here we are storing the fpoName and fpoId in localStorage
     //then with that fpoName we are navigating to different component and changing the URL also.
      navigateToPage= (pageName,fpoId,fpoName) => {
        localStorage.setItem("fpoId", JSON.stringify(fpoId));
        localStorage.setItem("fpoName", JSON.stringify(fpoName));

  
        this.props.history.push("/inputorders/" + fpoName);

      };
        //this function will navigate to Organization Dahboard.

      navigateToPage2= (pageName) => {
       
        this.props.history.push("/" + pageName + "");
      };

      //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
      // navigating to the component. Then we are calling API.
    componentDidMount() {
      const user = AuthService.getCurrentUser();
      if(!user){
        this.props.history.push('/')
        return
      }
      if(!user.is_parent)
        this.props.history.push("/dashboard")
      
        var flag = false;
        UserService.getFpoOrdersCount().then(
            (response) => {
                flag = true;
                // console.log("fpoorders::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader:false,
                        fpoOrdercounts: response.data.fpo_orders_data,

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
    // createRangeOptions = (ranges) =>
        
    //     ranges.length
    //     ? ranges.map((data, i) => 
    //     (
    //         <option key={i} name={data} value={data}>
    //         {data}
    //         </option>
    //     ))
    //     : "";

    render() {

        const { fpoOrdercounts, SelDate, SelSeason, showloader } = this.state;
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
                  let fpoName=rowData.name;
                  return (
                    <div
                      onClick={() =>
                        this.navigateToPage("inputorders",fpoId,fpoName)
                         
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
                title: "Total Orders",
                field: "total_orders",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Qty",
                field: "total_qty",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Value",
                field: "total_value",
                filtering:false,
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
                            <Col md={5}>
                              <h4
                                className="farmerListHeading dvaraBrownText "
                                style={{ marginLeft: "30px",fontSize:"24px" }}
                              >
                                Organization Farmer Orders Data
                              </h4>
                            </Col>

                            {/* <Col className="seasonDropdown" md={8}>
                                                <Form>
                                                    <Row>
                                                        <Col>

                                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUnits">
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
                                                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUnits">
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
                            style={{ marginLeft: "30px" }}
                            title=""
                            data={fpoOrdercounts}
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
                                { value: fpoOrdercounts.length, label: "All" },
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