import React, { ReactDOM,Component, Fragment, useState } from "react";
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
import { Hidden } from "@material-ui/core";
//have used class component . Initially we are defining all the state variables which are used inside the component.

var stickyposition;
export default class FpoList extends Component {
    constructor(props) {
        super(props)
        this.fpoListTableWrapRef=React.createRef();
        this.state = {
            fpolist: [],           
            loading: false,
            showloader:true,
           

        };
    }
    //this function will navigate to Organization Dahboard.
    navigateToPage2= (pageName) => {
       
        this.props.history.push("/" + pageName + "");
      };
    //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are calling the API and fetching the data and if API returns error then we are displaying an error messge .
    componentDidMount() {
        // stickyposition=this.fpoListTableWrapRef.current;

        // if(!localStorage.getItem('user')){
        //     this.props.history.push('/')
        //     return
        //   }
        // window.addEventListener("scroll",()=>{
        //      let tabWrapElement=document.getElementById("tableWrap");
        //     //  tabWrapElement.style.top=Math.max(0,250-this.scrollTop());
        //     tabWrapElement.style.position="fixed";
        //     // tabWrapElement.style.top=0;


        // })
        // let stickyElem = document.getElementById("tableWrap");
        // ReactDOM.findDOMNode(this.refs["fpoListTableWrapRef"]).getBoundingClientRect();
        // console.log("  ReactDOM.findDOMNode(this.refs[fpoListTableWrapRef]).getBoundingClientRect();",  ReactDOM.findDOMNode(this.refs["fpoListTableWrapRef"]).getBoundingClientRect())

    //    let currStickyPos = stickyElem.getBoundingClientRect().top + window.pageYOffset;
    //     window.onscroll = function() {
            
          
    //         if(window.pageYOffset > currStickyPos) {
    //             stickyElem.style.position = "fixed";
    //             stickyElem.style.top = "0px";
    //         } else {
    //             stickyElem.style.position = "relative";
    //             stickyElem.style.top = "initial";
	// 	}

    // }


        const user = AuthService.getCurrentUser();
        if(!user){
          this.props.history.push('/')
          return
        }
        if(!user.is_parent)
          this.props.history.push("/dashboard")
        

        var flag = false;
        UserService.getFpoList().then(
            (response) => {
                flag = true; 
                // debugger
                // console.log("fpolists::  ", response)
                if (response.data.success) {
                    this.setState({
                        showloader:false,
                        fpolist: response.data.fpo_data
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

        )
    }
 // rendering material table data.
    
//  stickyposition=ReactDOM.findDOMNode(this.fpoListTableWrapRef.current).getBoundingClientRect();

// stickyposition=this.fpoListTableWrapRef.current.getBoundingClientRect();

    render() {
      
        const { fpolist, showloader } = this.state;
                //   console.log("abcdef", stickyposition);

        const columns = [
            
          
            {
                title: "Fpo Name",
                field: "farmer_fpo__name",
                filtering:false,
              
                headerStyle:{
                //   backgroundColor:"blue",
                  position:"sticky",
                  top:0,
                  zIndex: 1000,
                  textOverflow:'ellipsis',
                 overflow:'hidden',
                 fontWeight: "bold",
                 resize: "horizontal",
                 overflowX: "overlay",
                 overflowY: "hidden",
                },

                cellStyle: {
                    //    position: '-webkit-sticky',
                  position: 'sticky',
                  background: '#f1f1f1',
                  left: 0,
                  zIndex: 1,
                  minWidth: 300,
                  maxWidth: 300
                  },
               
            },
            
           
            {
                title: "Block",
                field: "fpo_block",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },

            {
                title: "District",
                field: "fpo_dist",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },

            {
                title: "State",
                field: "fpo_state",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            
            {
                title: "Licenses",
                field: "farmer_fpo__seed_license",
                render: rowData => {
                    return <ul>
                        <li >Seed:  <span className="darkGreenText">{(rowData.farmer_fpo__seed_license ? "YES" : "NO")} </span></li>
                        <li>AgroChemical: <span className="darkGreenText"> {(rowData.farmer_fpo__agrochem_license ? "YES" : "NO")}</span></li>
                        <li>Fertilizer:  <span className="darkGreenText">{(rowData.farmer_fpo__fert_license ? "YES" : "NO")}</span></li>
                        <li>APMC: <span className="darkGreenText"> {(rowData.farmer_fpo__apmc_license ? "YES" : "NO")}</span></li>
                    </ul>
                },
                filtering:false,
                cellStyle: {
                    width: "100%"
                }
            },
            
            {
                title: "Share Cap",
                field: "last_year_share_cap",
                filtering:false,
                render: (rowData) => {
                    return rowData.last_year_share_cap ? rowData.last_year_share_cap : "NA";
                  },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Yearly Turn-over(Last FY)(INR)",
                field: "fpo_turnover.turn_over",
                filtering:false,
                render: (rowData) => {
                    return rowData.fpo_turnover.turn_over ? rowData.fpo_turnover.turn_over : "NA";
                  },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Profits(Last FY)(INR)",
                field: "fpo_turnover.profits",
                filtering:false,
                render: (rowData) => {
                    return rowData.fpo_turnover.profits? rowData.fpo_turnover.profits: "NA";
                  },
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Established",
                field: "farmer_fpo__establishment_date",
                filtering:false,
                render: (rowData) => {
                    return rowData.farmer_fpo__establishment_date? rowData.farmer_fpo__establishment_date: "NA";
                  },
                cellStyle: {
                    width: "15%"
                }
            },

            {
                title: "Staff(CEO, Accountant, Others)",
                field: "farmer_fpo__staff_count",
                filtering:false,
                cellStyle: {
                    width: "15%"
                },
                render: rowData => {
                    return <ul>
                        <li >CEO: {(rowData.farmer_fpo__ceo_count)}</li>
                        <li>Accountant: {(rowData.farmer_fpo__accountant_count)}</li>
                        <li>Others: {(rowData.farmer_fpo__other_count)}</li>
                        <li>Staff: {(rowData.farmer_fpo__staff_count)}</li>
                    </ul>
                },
            },

            {
                title: "Using our accounting platform",
                field: "accounting_service",
                render: rowData => (rowData.accounting_service ? "YES": "NO"),
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },

            {
                title: "Using our service for accounting entries",
                field: "farmer_fpo__der_acc_entry",
                render: rowData => (rowData.farmer_fpo__der_acc_entry ? "YES": "NO"),
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },

            {
                title: "Total farmers with Mobile app",
                field: "app_farmers",
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
                                                <h4 className="fpoListHeading dvaraBrownText" style={{ marginLeft: "25px", fontSize: "24px" }}>
                                                     Organization List Data
                                                </h4>
                                            </Col>

                                            
                                        </Row>
                                       
                                    </div>
                                    {showloader ?
                                        (

                                            <div className="mainCropsFarmerLoaderWrap">
                                                <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                                            </div>
                                        ) :

                                        ( <div id="tableWrap" ref={this.fpoListTableWrapRef} style={{position:"sticky",top:"0px",height:"400px"}}> 
                                        
                                        <MaterialTable icons={tableIcons}

                                            title=""
                                            style={{ marginLeft: "30px" }}
                                            data={fpolist}
                                            columns={columns}
                                            actions={[
                                            ]}
                                            options={{
                                                maxBodyHeight:"500px",
                                                actionsColumnIndex: -1,
                                                doubleHorizontalScroll: true,
                                                pageSize: 10,
                                                pageSizeOptions: [10, 20, 50, 100, { value: fpolist.length, label: 'All' }],
                                                exportButton: true,
                                               
                                                headerStyle: {
                                                    backgroundColor: '#A3C614',
                                                    color: '#fff',
                                                    fontSize: '1.2rem',
                                                    fontFamily: 'barlow_reg',
                                                    fontWeight: 'bold',
                                                    position: 'sticky',
                                                    top:0,
                                                    overflow:"hidden",
                                                    left: 0,
                                                   
                                                },
                                                
                                                rowStyle: {
                                                    backgroundColor: '#f1f1f1',
                                                    borderBottom: '2px solid #e2e2e2',
                                                    fontSize: '0.9rem'
                                                },
                                                filtering: true
                                            }}
                                        /> </div>)
                                        }
                                </Col>
                            </Row>
                        </div>
                        <div className="verticalSpacer20"></div>
                    </Fragment>
                </section>
            );
        
    }
}