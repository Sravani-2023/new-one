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

export default class FpoProcurement extends Component {
    constructor(props) {
        super(props)
        //binding functions used with this.
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        
        this.state = {
            fpoproccounts: [],
            months : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            years: [],
            loading: false,
            SelMnt: "all",
            SelYear: "all",
            showloader:true,
          

        };
    }
     //on selecting a data Under Month option this function is called . Here we are choosing the Month . and according to the value choosed we are making 
    // ApI call .This is a get API call.
    handleMonthChange = (e) => {
        this.setState(
          {
            SelMnt: e.target.value,
            fpoproccounts: [],
            showloader:true,
          }
          );
          // console.log(" this.month change", this.state.SelYear)
          this.fetchProcsCount(e.target.value, this.state.SelYear)
          
    }
      //on selecting a data Under Year option this function is called . Here we are choosing the Year . and according to the value choosed we are making 
    // ApI call .This is a get API call.
    handleYearChange = (e) => {
        this.setState(
          {
            SelYear: e.target.value,
            fpoproccounts: [],
            showloader:true,
          }
        )
        // console.log(" this.year change", e.target.value)

        this.fetchProcsCount(this.state.SelMnt, e.target.value)
    }
       //here in dropdown under Month we  are appending all the Month.

    createMonthOptions = (months) =>
        months.map((data, i) => 
        (
            <option key={i} name={data} value={data}>
            {data}
            </option>
        ))
    //here in dropdown under Year we  are appending all the Year received after making an Api Call.

    createYearOptions = (years) =>
        years.map((data, i) => 
        (
            <option key={i} name={data} value={data}>
            {data}
            </option>
        ))
      // on clicking on FPO Name in pivot table this function is trigerred . Here we are storing the fpoName and fpoId in localStorage
     //then with that fpoName we are navigating to different component and changing the URL also.
        navigateToPage= (pageName,fpoId,fpoName) => {
          // console.log("fpoId",fpoId)
          localStorage.setItem("fpoId", JSON.stringify(fpoId));
          localStorage.setItem("fpoName", JSON.stringify(fpoName));

          // console.log(JSON.parse(localStorage.getItem("fpoId")
          // ))
          this.props.history.push(
            "/commodities/" +
          
              fpoName
            
          );
                   };
          //this function will navigate to Organization Dahboard.
          navigateToPage2= (pageName) => {
       
            this.props.history.push("/" + pageName + "");
          };
    
    //In fetchProcsCount function we are making a API call . Here filters are handled by backend only . Initailly on loading the page by default we are choosing
  // all as a option in month and year . Later on changing it we are making a API call and displaying error also in frontend.
    fetchProcsCount = (month, year) => {
      
        // console.log("selected:  ", month, year)
        var flag = false;
        UserService.getFpoProcsCount(month, year).then(
            (response) => {
                flag = true; 
                // console.log("fpoprocs::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader:false,
                        fpoproccounts: response.data.fpo_procs_data,
                        years: response.data.years_list
                        
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
    
     //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are calling fetchProcsCount function.
    componentDidMount() {
      // if(!localStorage.getItem('user')){
      //   this.props.history.push('/')
      //   return
      // }
      const user = AuthService.getCurrentUser();
      if(!user){
        this.props.history.push('/')
        return
      }
      if(!user.is_parent)
        this.props.history.push("/dashboard")
      
        this.fetchProcsCount('all', 'all')
    }
  
    render() {

        const { fpoproccounts, SelMnt, SelYear, months, years, showloader } = this.state;
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
                        this.navigateToPage("commodities",fpoId,fpoName)
                         
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
                title: "Commodities",
                field: "commodity_listed",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Farmers Interested",
                field: "interested_farmers",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Orders",
                field: "total_orders",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Offered Qty",
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
                        <div className="PageHeading padding15 fpoCropsHeading">
                          <Row>
                            <Col md={5}>
                              <h4
                                className="farmerListHeading dvaraBrownText "
                                style={{ marginLeft: "30px",fontSize:"24px" }}
                              >
                                Organization Procurements Data
                              </h4>
                            </Col>

                            <Col className="seasonDropdown" md={7}>
                              <Form>
                                <Row>
                                  <Col>
                                    <Form.Group
                                      as={Row}
                                      className="mb-3"
                                      controlId="formHorizontalMnth"
                                    >
                                      <Form.Label
                                        column="sm"
                                        lg={2}
                                        className="dvaraBrownText"
                                      >
                                        Month:{" "}
                                      </Form.Label>
                                      <Col sm={6}>
                                        <Form.Control
                                          as="select"
                                          size="sm"
                                          value={SelMnt}
                                          custom
                                          onChange={this.handleMonthChange}
                                        >
                                          <option value="all">All</option>
                                          {this.createMonthOptions(months)}
                                        </Form.Control>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      as={Row}
                                      className="mb-3"
                                      controlId="formHorizontalYear"
                                    >
                                      <Form.Label
                                        column="sm"
                                        lg={2}
                                        className="dvaraBrownText"
                                      >
                                        Year:{" "}
                                      </Form.Label>
                                      <Col sm={6}>
                                        <Form.Control
                                          as="select"
                                          size="sm"
                                          value={SelYear}
                                          custom
                                          onChange={this.handleYearChange}
                                        >
                                          <option value="all">All</option>
                                          {this.createYearOptions(years)}
                                        </Form.Control>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Form>
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
                            data={fpoproccounts}
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
                                { value: fpoproccounts.length, label: "All" },
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