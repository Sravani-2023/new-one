import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {TriggerAlert,} from './dryfunctions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/auth.service";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import {
    
    Row,
    Col
} from "react-bootstrap";
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoFarmer extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
            fpofarmercounts: [],
            loading: false,
            showloader:true,

            
        };
    }
     // on clicking on FPO Name in pivot table this function is trigerred . Here we are storing the fpoName and fpoId in localStorage
     //then with that fpoName we are navigating to different component and changing the URL also.
    navigateToPage= (pageName,fpoId,fpoName) => {
    localStorage.setItem("fpoId", JSON.stringify(fpoId));
    localStorage.setItem("fpoName", JSON.stringify(fpoName));

   
    this.props.history.push(
      "/farmerlist/" +
        fpoName
    );
     
    };
        //this function will navigate to Organization Dahboard.

    navigateToPage2= (pageName) => {
       
      this.props.history.push("/" + pageName + "");
    };

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
        UserService.getFpoFarmersCount().then(

            (response) => {

                flag = true; 
                // console.log("fpofarmers::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader: false,
                        fpofarmercounts: response.data.fpo_farmer_data
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
  //rendering the materialTable
    render() {

        const { fpofarmercounts, showloader } = this.state;
        
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


                  // overflow:"hidden",
                  // color: '#FFF',
                  // position: 'sticky',
                  // left: 0,
                  minWidth: 300,
                  maxWidth: 300
                },

               
                render: (rowData) => {
                  let fpoId = rowData.farmer_fpo;
                  let fpoName = rowData.farmer_fpo__name;

                  return (
                    <div
                      onClick={() =>
                        this.navigateToPage("farmerlist",fpoId, fpoName)
                         
                      }
                    >
                      <a href="#!">{rowData.farmer_fpo__name}</a>
                    </div>
                  );
        
                    }
                  
            },
            {
                title: "Block",
                field: "fpo_block",
                width: 150,
              //  width:"5%",
            },
            {
                title: "District",
                field: "fpo_dist",
                width: 150,
                // width:"5%",
            },
            {
                title: "State",
                field: "fpo_state",
                width: 150,
                // width:"5%",
            },
            {
                title: "Total Farmers",
                field: "total_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "Member Farmers",
                field: "member_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "Non Member Farmers",
                field: "non_member_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "Farmers with Land",
                field: "farmers_with_land",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "Landless Farmers",
                field: "landless_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "KYC Completed",
                field: "kyc_completed",
                filtering:false,
                width: 150,
                // width:"5%",
            },
            {
                title: "KYC incomplete",
                field: "kyc_not_completed",
                filtering:false,
                width: 150,
                // width:"5%",
               
            },
            {
                title: "Farmers with Agri and Allied",
                field: "allied_activity_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
               
            },
            {
                title: "Farmers with Dairy",
                field: "dairy_farmers",
                filtering:false,
                width: 150,
                // width:"5%",
               
            }
            

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
                                Organization Farmers Data
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
                            data={fpofarmercounts}
                            // data={[
                            //   {  id:"1",farmer_fpo__name: 'Mehmet', fpo_block: 'Baran', fpo_dist: 1987, fpo_state: 63 },
                            //   { id:"2",farmer_fpo__name: 'Mehmet22', fpo_block: 'Baran45', fpo_dist: 19878, fpo_state: 6378 },
                            // ]}      
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
                             
                              // fixedColumns: {
                              //   left: 1,
                              // },
                              maxBodyHeight:500,
                              // display:"scroll",
                              actionsColumnIndex: -1,
                              doubleHorizontalScroll: true,
                              pageSize: 10,
                              pageSizeOptions: [
                                10,
                                20,
                                50,
                                100,
                                { value: fpofarmercounts.length, label: "All" },
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