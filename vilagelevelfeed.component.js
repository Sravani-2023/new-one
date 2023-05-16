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
    ProgressBar,
    ProgressBarProps,
    ToggleButtonGroup,
    ToggleButton,
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
export default class VillageLevelFeed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            villageData: [],
            isParentLogged: false,
            accessed_supervisor: "",
            logged_supervisor: "",
            modalIsOpen: false,
            showloader: true,
            productName: "",
            brand: "",
            cattleType: "",
            farmerDataLoading: false,
            selVillage: "",
            selPackets:"",
            selAmount:"",
            farmerList: [],
            selCategory: "",
            selTotalAmt: "",
            packetPrice: "",
            fpoName: localStorage.getItem("fpoName"),

            
        };
    }

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
            var productName = this.props.match.params.productName;
            var brand = this.props.match.params.brand;
            var cattleType = this.props.match.params.cattleType;
            var category = this.props.match.params.category
            var packetPrice = this.props.match.params.packetPrice
            var totalAmt = this.props.match.params.totalAmount
            
        }
        // cattleType=cow&productName=green fodder&brandName=Local
        UserService.getVillageFeedData('village', cattleType, productName, brand,fpoId).then(
            (response) => {
                flag = true;
                // console.log(response.data.data)
                this.setState({
                    villageData: response.data.data,
                    productName : productName,
                    brand : brand,
                    cattleType : cattleType,
                    selCategory: category,
                    selTotalAmt: totalAmt,
                    packetPrice: packetPrice,
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
        const sortedFarmers = farmerList.sort((a, b) => a.total_amount - b.total_amount);
        
        return sortedFarmers.map((farmer, index) => {
          return <tr key={index}>
            <td className="capitalise">{titleCase(farmer.farmer_name)}</td>
            <td>{farmer.farmer_phone}</td>
            <td>{farmer.count_value}</td>
            <td>{farmer.packet_nos}</td>
            <td><span>&#x20B9;</span><NumberFormat value={farmer.total_amount} displayType={'text'}                 
              thousandSeparator={true} thousandsGroupStyle='lakh' /></td>
          </tr>
        });
      }
    showModal = (selecteddata) => {
        const {cattleType, productName, brand} = this.state;
        const fpoId = localStorage.getItem("fpoId")


        this.setState({
            modalIsOpen: true,
            farmerDataLoading: true,
            selPackets:selecteddata.packet_nos,
            selVillage:selecteddata.village,
            selAmount: selecteddata.total_amount

        },()=>{ 
            console.log("amount")
            // console.log("selAmount",this.state.selAmount)
        });
       
        UserService.getVillageFarmerFeedData('farmer', cattleType, productName, 
            brand, selecteddata.village,fpoId).then(
                (response) => {
                    // console.log("farmer data---", response)
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
        //   if (selecteddata) {
        //     this.setState({

        //     });
        //   }
    };
   
    navigateToPage = (pageName) => {
        const {fpoName, isParentLogged} = this.state 
   
        if(isParentLogged){
                this.props.history.push("/" + pageName + "/"+ fpoName);
        }else{
            this.props.history.push("/" + pageName + "");   
        }

      };

    //  in render we r rendering the content of the page 
    render() {
        const {
            villageData,
            modalIsOpen,
            showloader,
            productName, 
            brand, 
            cattleType, 
            farmerDataLoading,
            selPackets,
            selAmount,
            farmerList,
            selCategory,
            selTotalAmt,
            packetPrice,
            selVillage
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
                title: "Village",
                field: "village",
                sorting:false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "No. of Cattle",
                field: "cattle_nos",
                sorting:false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "No. of Packets",
                field: "packet_nos",
                sorting:false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount (₹) ",
                field: "total_amount",
                export:false,
                render: (rowData) => {
                    return  <a href="javascript:void(0);"><NumberFormat value={rowData.total_amount} displayType={'text'}
                    prefix="₹ "
                    onClick={() => this.showModal(rowData) }
                    thousandSeparator={true} thousandsGroupStyle='lakh' /></a>

                },
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount (Rs.)",       
                field: "total_amount",               
                hidden: true,
                export: true,
                searchable: true,
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
                        <Col md="4">Category : <strong className="colorCateg">{selCategory}</strong></Col>
                        <Col md="4">Product Name : <strong className="colorCateg">{productName}</strong></Col>
                        <Col md="4">Brand : <strong className="colorCateg">{brand}</strong></Col>

                    </Row>
                
                     <br/>
                
                    <Row>
                        <Col md="4">Packet Price : <strong className="colorCateg">₹ {packetPrice}</strong></Col>
                        <Col md="4">Total Amount : <strong  className="colorCateg">
                            <NumberFormat value={selTotalAmt} displayType={'text'}  
                            prefix="₹ "               
                            thousandSeparator={true} thousandsGroupStyle='lakh' /></strong></Col>

                    </Row>
                    </div>
                    {/* <Table borderless size="sm">
                    <tbody>
                        <tr>
                            <th>Category:</th>
                            <td align="left">{selCategory}</td>                            
                            <th>Product Name:</th>
                            <td align="left">{productName}</td>
                            <th>Brand:</th>
                            <td align="left">{brand}</td>
                            
                        </tr>
                        <tr>
                            
                            <th>Packet Price:</th>
                            <td align="left">{packetPrice}</td>
                            <th>Total Amount</th>
                            <td align="left">{selTotalAmt}</td>

                        </tr>
                       
                    </tbody>
                    </Table> */}

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
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                className="modal-adjust"
                                dialogClassName="my-modal"
                            >
                                <Modal.Header>
                                    <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText"></span></Modal.Title>

                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                        <Row  className="farmerData">
                                            <Col md="4">Village: <strong className="colorCateg">{selVillage}</strong></Col>
                                            <Col md="4">
                                                Product Name: <strong className="colorCateg">{productName}</strong>
                                            </Col>
                                            <Col md="4"></Col>
                                            
                                        </Row>
                                        <br></br>
                                        <Row  className="farmerData">
                                            <Col>
                                                Brand : <strong className="colorCateg">{brand}</strong>
                                            </Col>
                                            <Col>No.of Packets: <strong className="colorCateg">{selPackets}</strong></Col>
                                            <Col>Amount: <strong className="colorCateg"><span> &#x20B9;</span>
                                                <NumberFormat value={selAmount} displayType={'text'}               
                                                    thousandSeparator={true} thousandsGroupStyle='lakh' /></strong></Col>

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
                                                        <th>Phone</th>
                                                        <th>No.of {cattleType}s</th>
                                                        <th>No.of Packets</th>
                                                        <th>Amount</th>
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
