import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from "./icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome, faLeaf,faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { TriggerAlert, } from './dryfunctions'
import AuthService from "../services/auth.service";
import NumberFormat from 'react-number-format';


import {
    Container,
    Card,
    Alert,
    Row,
    Col,
  
    Form,
    Modal,
    ModalBody,
    ModalDialog,
    ModalFooter,
    ModalProps,
    ModalTitle,
    ModalDialogProps,
    Button,
    Breadcrumb,
    Table
} from "react-bootstrap";

import DeleteOutline from "@material-ui/icons/DeleteOutline";
// have used class Component and inside that have decrlared all the needed variable in this.state.
//  in constructor initially we r binding all the functions which are used on this page . Binding with this.

function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}
var cropTentName;
var villageDate;

export default class ProcVillageLevel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            villageData: [],
            isParentLogged: false,
            accessed_supervisor: "",
            logged_supervisor: "",
            modalIsOpen: false,
            showloader: true,
            farmerDataLoading:false,
            farmerList: [],
            villageName:"",
            FarmerDate:"",
            FarmerSeason:"",
            FarmerVeri:"",   
            fpoName: localStorage.getItem("fpoName"),
   
        };
    }
    navigateToPage = (pageName) => {
        const {fpoName, isParentLogged} = this.state 
        console.log("hello")
   
        if(isParentLogged){
                this.props.history.push("/" + pageName + "/"+ fpoName);
        }else{
            this.props.history.push("/" + pageName + "");   
        }

      };
    // this function is called inside Breadcrumb.
    navigateMainBoard = () => {
        const { isParentLogged } = this.state
        if (isParentLogged) {
            this.props.history.push("/fpohomeData");
        }
        else {
            this.props.history.push("/dashboard");
        }
    }

    // handleform validation is called on click on save button inside Modal Popup.On click on save it will check fields required.
    // if it returns true then will send response to the api . 

    // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
    //  Here if response is not true then api will through an error message.
    componentDidMount() {
        var flag = false;

        const user = AuthService.getCurrentUser();
        const fpoId = localStorage.getItem("fpoId")
        if (!user) {
            this.props.history.push('/')
            return
        }
        if (user.is_parent) {
            this.setState({ isParentLogged: true })
        }
        this.setState({
            accessed_supervisor: fpoId,
            logged_supervisor: user.user_id
        })
        if (this.props.match.params) {
             cropTentName=this.props.match.params.cropName;
             villageDate = this.props.match.params.villageDate;
            var villageTentId = this.props.match.params.villageTentId;
            var villageTentSeason = this.props.match.params.villageTentSeason;
            var villageTentVerified = this.props.match.params.villageTentVerified
          
            
        }
        UserService.getTentativeVillageFeedData('village', villageDate, villageTentId, villageTentSeason,villageTentVerified,fpoId).then(
            (response) => {
                flag = true;
                // console.log("villageData",response.data.data)
                this.setState({
                    villageData: response.data.data,
                 
                    showloader: false,

                })
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
        )


    }
    //checking for disabling of button .
    CheckUserParent = () => {
        const { accessed_supervisor, logged_supervisor } = this.state;

        if (parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)) {
            return true;
        }
        return false;




    }
   
    farmersData = (farmerList) => {
        // console.log("farmerList",farmerList)
        return farmerList.map((farmer, index) => {
            return <tr key={index}>
                <td className="capitalise">{titleCase(farmer.farmer_name)}</td>
                <td>{farmer.farmer__phone}</td>
                <td>{farmer.fr_name}</td>
                <td>{farmer.total_crop_area}</td>
                <td>{farmer.estimated_crop_yield}</td>

                <td> {farmer.tentative_price!=="NA"?"₹" +farmer.tentative_price:farmer.tentative_price}</td>

                <td>{farmer.total_tentative_price!=="NA"?"₹" +farmer.total_tentative_price:farmer.total_tentative_price}</td>

                <td>{farmer.actual_crop_yield}</td>


               
            </tr>
        })
    }
    showModal = (selecteddata) => {
        let FrmrDate = selecteddata.get_params.date_range;
        let FrmrId =  selecteddata.get_params.crop_id;
        let FrmrSeason =  selecteddata.get_params.season;
        let FrmrVeri = selecteddata.get_params.is_verified;
        let FrVillage = selecteddata.get_params.village;
        const fpoId = localStorage.getItem("fpoId")

     
        this.setState({
            modalIsOpen: true,
            farmerDataLoading: true,
            villageName:selecteddata.village,
             FarmerDate :selecteddata.get_params.date_range,
             FarmerSeason : selecteddata.get_params.season,
             FarmerVeri : selecteddata.get_params.is_verified,

        });
        UserService.getTentativeFarmerFeedData('farmer', FrmrDate, FrmrId, 
        FrmrSeason, FrmrVeri,FrVillage,fpoId).then(
                (response) => {
                    // console.log("farmer data---", response)
                    // console.log("farmerList data---", response.data.data)
                    this.setState({
                        farmerList: response.data.data,
                        farmerDataLoading: false
                    })
                },
                (error) => {
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
            )
     
    };
    // navigateToComponent = (pageName) => {
     
    //         this.props.history.push("/" + pageName + "");  
      
    // };

    //  in render we r rendering the content of the page 
    render() {
        const {
            villageData,
            modalIsOpen,
            showloader,
            farmerDataLoading,
            farmerList,
            villageName,
            FarmerDate,
            FarmerSeason,
            FarmerVeri
        } = this.state;
        // showModal function will get triggered on click on a Modal Popup.
        // Inside this we r setting all the variables which r used in a popup.
        // Initially we r setting all the values to empty and then in the nxt setState we are assigning values .
      
        // hideModal function will get triggered on click on a  close button inside Modal Popup.
        // Inside this we r setting all the variables to empty which r used in a popup .
        const hideModal = () => {
            this.setState({
                modalIsOpen: false,

            });
        };
        // here we r defining the columns which r used inside MaterialTable.
        const columns = [
            {
                title: "Village Name",
                field: "village",
                filtering: false,
                render: (rowData) => {
                  


            return (
              <div onClick={() => this.showModal(rowData) }>
          <a href="javascript:void(0);">{rowData.village}</a>
          </div>

          );
                },
              
            },
            {
                title: "No. of Farmers growing crop",
                field: "farmer_count",
                filtering: false,
              
            },
            {
                title: "Total acreage (Acre)",
                field: "total_crop_area",
                filtering: false,
            },
            {
                title: "Estimated Production (Qtl.)",
                field: "estimated_crop_yield",
                filtering: false,
              
            },
            {
                title: "Avg. Price (₹)",
                field: "tentative_price",
                filtering: false,
                export:false,
                render: (rowData)=>{                   
                 return rowData.tentative_price!=="NA" ?"₹"+ rowData.tentative_price : rowData.tentative_price;
                },
              
            },
            {
                title: "Avg. Price (Rs.)",       
                field: "tentative_price",       
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Tentative Value (₹)",
                field: "total_tentative_price",
                filtering: false,
                export:false,
                render: (rowData)=>{                   
                    return rowData.total_tentative_price!=="NA" ?"₹"+ rowData.total_tentative_price : rowData.total_tentative_price;
                   },
               
            },
            {
                title: "Tentative Value (Rs.)",       
                field: "total_tentative_price",       
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Actual Yields (Qtl.)",
                field: "actual_crop_yield",
                filtering: false,
               
            },

        ];

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
                        <FontAwesomeIcon

                icon={faCaretRight}

                  className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"/>
                            <a href="#"
                   className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                   onClick={() => this.navigateToPage("business-opportunity")} // will navigate to the parent i.e input page .
                       >Business Potential

                          </a>

                    </div>
                    <div className="wrap village-box-details" style={{width:"90%"}}>
                    <Row>
                        <Col md="4">Crop Name : <strong className="colorCateg">{cropTentName}</strong></Col>
                        <Col md="4">Year : <strong className="colorCateg">{villageDate}</strong></Col>
                        <Col md="4">Season : <strong className="colorCateg">{this.props.match.params.villageTentSeason}</strong></Col>

                    </Row>
                
                     <br/>
                
                    <Row>
                        <Col md="4">Verification Status : <strong className="colorCateg">{this.props.match.params.villageTentVerified=="2"?"Verified":"Unverified"}</strong></Col>
                      

                    </Row>
                    </div>
                   
                    <div className="landholdingHeader wrap">
                        <Row>
                            <Col lg="12" md="12" sm="12" className="noPadding">
                                <div className="PageHeading padding15" style={{ width: "30%" }}>
                                    <Row>
                                        <Col>
                                            <h4 className="dvaraBrownText headingMargin villageHeading">
                                                Village Feed Data
                                            </h4>
                                        </Col>
                                    </Row>
                                   

                                    {/* Modal is defined and on click on ADD warehouse and pencil modal will popUP .showModal function will allow modal 
                  to open as it has specific parameters required. */}
                                      <Modal show={modalIsOpen}
                                onHide={hideModal}
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                // className="modal-adjust"
                                // dialogClassName="my-modal"
                            >
                                <Modal.Header>
                                    <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText"></span></Modal.Title>

                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <Row  className="farmerData">
                                            <Col md="4">Village Name: <strong className="colorCateg">{villageName}</strong></Col>
                                            <Col md="4">
                                                Crop Name: <strong className="colorCateg">{cropTentName}</strong>
                                            </Col>
                                            <Col md="4"> Year : <strong className="colorCateg">{FarmerDate}</strong></Col>
                                            
                                        </Row>
                                        <br></br>
                                        <Row  className="farmerData">
                                           
                                            <Col  md="4">Season: <strong className="colorCateg">{FarmerSeason}</strong></Col>
                                            <Col  md="4"> Verification Status: <strong className="colorCateg">{FarmerVeri=="2"?"Verified":"Unverified"}</strong></Col>
                                          

                                        </Row>
                                    </Container>
                                    <br></br>
                                    {(farmerDataLoading) ? (<div className="mainCropsFarmerLoaderWrap">
                                        <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                                    </div>) : (
                                        <div className="farmersUploadWrap">
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr className="dvaraGreenBG" align="center">
                                                        <th>Farmer Name</th>
                                                        <th>Phone No</th>
                                                        <th>FR Name</th>
                                                        <th>Total acreage (Acre)</th>
                                                        <th>Estimated Production (Qtl.)</th>
                                                        <th> Avg Price (₹)</th>
                                                        <th> Tentative value (₹)</th>
                                                        <th> Actual Yields (Qtl.)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                              
                                                   
                                                    {this.farmersData(farmerList)}
                                             
                                                    
                                              
                                                </tbody>
                                            </Table>
                                        </div>)}
                                </Modal.Body>
                                <Modal.Footer>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button onClick={hideModal} className="fa-pull-right defaultButtonElem">Close</Button>
                                    <span className="clearfix"></span>

                                </Modal.Footer>
                            </Modal>

                                </div>
                                <br></br>
                               
                                {showloader ? (
                                    <div className="mainCropsFarmerLoaderWrap">
                                        <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                                    </div>
                                ) : (
                                    <MaterialTable
                                        icons={tableIcons}
                                        title=""
                                        style={{ marginLeft: "30px" }}
                                        data={villageData}
                                        columns={columns}

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
                                                { value: villageData.length, label: "All" },
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
