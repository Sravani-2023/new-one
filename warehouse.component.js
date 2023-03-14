import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from "./icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import {TriggerAlert,} from './dryfunctions'
import AuthService from "../services/auth.service";

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
} from "react-bootstrap";

import DeleteOutline from "@material-ui/icons/DeleteOutline";
      // have used class Component and inside that have decrlared all the needed variable in this.state.
  //  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class WareHouse extends Component {
  constructor(props) {
    super(props);
    this.handleWsp = this.handleWsp.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleDistrict = this.handleDistrict.bind(this);
    this.handleCapacity = this.handleCapacity.bind(this);
    this.handleContact = this.handleContact.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.handleLatitude = this.handleLatitude.bind(this);
    this.handleLongitude = this.handleLongitude.bind(this);
    

    this.state = {
      warehousedata: [],
      wsp_title: "",
      address: "",
      block: "",
      district: "",
      capacity: "",
      contact: "",
      number: "",
      latitude: "",
      longitude: "",
      is_wsp_edit: false,
      modalIsOpen: false,
      wsp_id: -1,
      isWspCreating: false,
      loading: false,
      disabledId: -1,
      showloader: true,
      errormessage: "",
      namefieldmessage:"",
      // check_ParentFpo:"",
      // check_ParentSupervisor:"",
      information_parentFpo:"",
      accessed_supervisor:"",
      logged_supervisor:"",
      isParentLogged: false,
      currentFpo:""
    };
  }
  // handleWsp,handleAddress,handleBlock,handleDistrict,handleCapacity,handleContact,handleNumber these functions
  // are called inside a Modal popup which will appear on click on ADD Warehouse and on click on pencil icon 
  // in a MaterialTable.
  // these functions we r setting the values inside setState as well as checking few validation
  handleWsp = (e) => {
      // var data=e.target.value.charAt[0];
      // if(typeof parseInt(data) !== 'number' ){

      // }

      // console.log("a",data)
      //   if(typeof data != "number")
      //   {
      //     console.log("b",data)
      //     console.log("vvv",typeof (data) !== "number")
      //     this.setState({
      //             wsp_title: e.target.value, 
      //             wspname: "",
      //             namefieldmessage:"",
      //           });
      //     }
      //     else{
      //       this.setState({
      //                   namefieldmessage: "First letter cannot be a number",
      //                 });

      //     }

     let validDateRegEx =/^[a-zA-Z].*/;
  
      if (validDateRegEx.test( e.target.value)) {
        this.setState({
          wsp_title: e.target.value, 
          wspname: "",
          namefieldmessage:"",
        });
      } else {
        this.setState({
              namefieldmessage: "First letter should be a character",
              wsp_title: "",
            });
            setTimeout(() => {
              this.setState({
                namefieldmessage: "",
                  });
          }, 1500)
          
      }
    // this.setState({ wsp_title: e.target.value, wspname: "" });
  };
  handleAddress = (e) => {
    this.setState({ address: e.target.value, addressclass: "" });
  };
  handleBlock = (e) => {
    this.setState({ block: e.target.value, blockclass: "" });
  };
  handleDistrict = (e) => {
    this.setState({ district: e.target.value, districtclass: "" });
  };

  handleLatitude = (e) => {
    var latitude = e.target.value
    if(latitude == 0 ){
      this.setState({latitudemessage:"Latitude must be greater than 0.",latitude:""})
    }else{
      this.setState({latitude:e.target.value, latitudeclass:"",latitudemessage:''})
    }
  }

  handleLongitude = (e) => {
    var longitude = e.target.value
    if(longitude == 0 ){
      this.setState({longitudemessage:"Longitude must be greater than 0." ,longitude:""})
    }else{
      this.setState({longitude:e.target.value, longitudeclass:"",latitudemessage:''})
    }
  }

  handleCapacity = (e) => {
    var capacity = parseInt(e.target.value)  
    if (isNaN(capacity) == false) {
      this.setState({
        capacity: capacity,
        capacitymessage: "",
        capacityclass: "",
      });
    } else {
      this.setState({ capacitymessage: "Capacity is a number field" });
    }
  };
  handleContact = (e) => {
    // console.log((e.target.value).length)
    if ((e.target.value).length > 50){
      this.setState({contacterromessage:"must be less than 50 characters",contact:""})
    }
    else{
    this.setState({ contact: e.target.value, contactclass: "" });
    }
  };

  handleNumber = (e) => {
    // if (isNaN(e.target.value) == false) {
      let validDateRegEx = /^[0-9,-]*$/;      
      // let validDateRegEx = /^[a-zA-Z]*/;
      // /^(-)?([,0-9])+$/;
      // let validDateRegEx =/[+-]?\d+(?:[.,]\d+)?/
        if (validDateRegEx.test( e.target.value)) {
        this.setState({
          number: e.target.value,
          phonefieldmessage: "",
          contactnoclass: "",
        });
      } else {
        this.setState({
              phonefieldmessage: "Contact Details must be a phone number",
            });
      } 
      
      // this.setState({
      //   number: e.target.value,
      //   phonefieldmessage: "",
      //   contactnoclass: "",
      // });
    // } else {
    //   this.setState({
    //     phonefieldmessage: "Contact Details is a must be a phone number",
    //   });
    // }
  };
  // this function is called inside Breadcrumb.
  navigateMainBoard = () => {
    const {isParentLogged} = this.state
    if(isParentLogged){
      this.props.history.push("/fpohomeData");
    }
    else{
      this.props.history.push("/dashboard");
    }
  }
  // navigateToPage2=(pageName)=>{
  //   this.props.history.push("/" + pageName + "");

  // }
  // handleform validation is called on click on save button inside Modal Popup.On click on save it will check fields required.
  // if it returns true then will send response to the api . 
  handleFormValidation = () => {
    //   var validated_fields = {'wspname':this.state.wsp_title,
    //   'capacityclass':this.state.capacity,'addressclass':this.state.address,
    //   'blockclass':this.state.block,'districtclass':this.state.district,
    //   'contactclass':this.state.contact,'contactnoclass':this.state.number
    // }
    let errors = false;
    if (this.state.wsp_title == "") {
      errors = true;
      this.setState({ wspname: "requiredinputfields" });
    }
    if (this.state.capacity == "") {
      errors = true;
      this.setState({ capacityclass: "requiredinputfields" });
    }
    if (this.state.block == "") {
      errors = true;
      this.setState({ blockclass: "requiredinputfields" });
    }
    if (this.state.address == "") {
      errors = true;
      this.setState({ addressclass: "requiredinputfields" });
    }
    if (this.state.district == "") {
      this.setState({ districtclass: "requiredinputfields" });
    }
    // if (this.state.contact == "") {
    //   errors = true;
    //   this.setState({ contactclass: "requiredinputfields" });
    // }
    // if (this.state.number == "") {
    //   errors = true;
    //   this.setState({ contactnoclass: "requiredinputfields",phonefieldmessage:"" });
    // }

    if (this.state.contact) {
      var validcontact = this.state.contact
      const regExp = /^[A-Za-z]+$/;
      var checkpassed = regExp.test(validcontact)
      if (checkpassed == false){
        errors = true;
        this.setState({ contactclass: "requiredinputfields",contacterromessage:"Please enter only characters"});
      }
      else{
        this.setState({ contactclass: "",contacterromessage:"" });
      }
    }
    if (this.state.number) {
      var validnumber = this.state.number
      const regExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
      var checkpassed = regExp.test(validnumber)
      if (checkpassed == false){
        errors = true;
        this.setState({ contactnoclass: "requiredinputfields",phonefieldmessage:"Phone number must be atleast 10 numbers"});
      }
      else{
        this.setState({ contactnoclass: "",phonefieldmessage:"" });
      }
    }
    if (this.state.latitude) {
      var latitude = this.state.latitude
      const regExp = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
      var checkpassed = regExp.test(latitude)
      if (checkpassed == false){
        errors = true;
        this.setState({ latitudeclass: "requiredinputfields",latitudemessage:"Please enter valid latitude." });
      }
      else{
        this.setState({ latitudeclass: "",latitudemessage:"" });
      }
    }
    if (this.state.longitude) {
      var longitude = this.state.longitude
      const regExp = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      var checkpassed = regExp.test(longitude)
      if (checkpassed == false){
        errors = true;
        this.setState({ longitudeclass: "requiredinputfields",longitudemessage:"Please enter valid longitude." });
      }
      else{
        this.setState({ longitudeclass: "",longitudemessage:"" });
      }
    }

    // for (const fields in validated_fields){
    //   if (validated_fields[fields] == ""){
    //     errors+=(fields+",")
    //     console.log(fields)
    //     console.log(this.state.wspname)
    //     this.setState({fields:"requiredinputfields"})
    //     console.log(this.state.wspname)
    //   }
    // }
    if (errors == false) {
      this.setState({ errormessage: "" });
      return true;
    } else {
      this.setState({ errormessage: "Required fields must be filled" });
      return false;
    }
  };
  // on click on ADD warehouse and pencil icon createWsp is called. && on dustbin also
  // here we are deleting as well as updating at the same time so for that we have taken a variable 
  // and r comparing with that and according to that we r chossing the api.
  createWsp = (wsp_id = null) => {
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor)){
      TriggerAlert(
        "Error",
        "You Do not have access to Edit.",
        "error"
      );
      return false
    }
    var form = document.forms.namedItem("fileinfo");
    if (wsp_id > 0) {       // we r checking it for Delete.

      var success = true;
    } else {           //here we r checking for updating values and creating

      var success = this.handleFormValidation();
    }
    if (success == true) {
      this.setState({
        isWspCreating: true,
      });
      const data = new FormData();
      var is_wsp_edit = this.state.is_wsp_edit;
      if (wsp_id > 0) {
        data.append("is_active", 1); // wsp need to be delete
        is_wsp_edit = true;
        this.setState({
          disabledId: wsp_id,
        });
      } else {   //appending all the required fields which we have to send 
        data.append("wsp", this.state.wsp_title);
        data.append("address", this.state.address);
        data.append("block", this.state.block);
        data.append("district", this.state.district);
        data.append("capacity", this.state.capacity);
        data.append("contactperson", this.state.contact);
        data.append("phone", this.state.number);
        data.append("is_active", 0);
        data.append("lat", this.state.latitude);
        data.append("long", this.state.longitude);
        wsp_id = this.state.wsp_id;
      }

      //console.log(data);
      if (is_wsp_edit & (wsp_id > 0)) {   // here we will proceed with deletion api
        var flag = false;
        UserService.WspUpdate(wsp_id, data).then(
          (response) => {
            flag = true;
            if (response.data.success || "id" in response.data.data) {
              this.setState({
                modalIsOpen: false,
                isWspCreating: false,
                loading: true,
                is_wsp_edit: false,
                wsp_id: -1,
              });

              this.setState((prevState) => ({
                warehousedata: prevState.warehousedata.filter(
                  (el) => el.id != wsp_id
                ),
              }));

              if (!response.data.data.is_active) {
                var wspList = this.state.warehousedata;
                wspList.unshift(response.data.data);
                this.setState({
                  warehousedata: wspList,
                });
              }
            }
          },
          (error) => { 
            flag = true;
            if (error.response) {
              TriggerAlert("Error", error.response.data.error, "error");
            } else {
              TriggerAlert(
                "Error",
                "Server closed unexpectedly, Please try again",
                "error"
              );
            }
            this.setState({
              modalIsOpen: false,
            });
          },
          setTimeout(() => {
            if (flag == false) {
              this.setState({
                showloader: false,
              });
              TriggerAlert(
                "Error",
                "Response Timed out, Please try again",
                "info"
              );
              this.navigateMainBoard()
            }
          }, 30000)
        );
      } else {     // sending response for creating and updating
        var flag = false;
        UserService.WspCreate(data).then(
          (response) => {
            flag = true;
            if (response.data.success || "id" in response.data.data) {
              var wspList = this.state.warehousedata;
              wspList.unshift(response.data.data);
              this.setState({
                modalIsOpen: false,
                isWspCreating: false,
                loading: true,
                warehousedata: wspList,
              });
            }
          },
          (error) => {
            flag = true;
            if (error.response) {
              TriggerAlert("Error", error.response.data.error, "error");
            } else {
              TriggerAlert(
                "Error",
                "Server closed unexpectedly, Please try again",
                "error"
              );
            }
            this.setState({
              modalIsOpen: false,
            });
          },
          setTimeout(() => {
            if (flag == false) {
              this.setState({
                showloader: false,
              });
              TriggerAlert(
                "Error",
                "Response Timed out, Please try again",
                "info"
              );
              this.navigateMainBoard()
            }
          }, 30000)
        );
      }
    } else {
      console.log("required fields missed");
    }
  };
   // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
  //  Here if response is not true then api will through an error message.
  componentDidMount() {
    var flag = false;
   
    const user = AuthService.getCurrentUser();
    const fpoId = localStorage.getItem("fpoId")
    if(!user){
      this.props.history.push('/')
      return
    }
    if(user.is_parent){
      this.setState({ isParentLogged:true ,currentFpo: this.props.match.params.fpoName })
    }
    this.setState({
      accessed_supervisor:fpoId,
      logged_supervisor: user.user_id
    })
    UserService.getWareHouseList(fpoId).then(
      (response) => {
        flag = true;
        // console.log("response",response)
        if (response.data.data.length == 0) {
          this.setState({ 
            showloader: false,
           });
        } else if (response.data.data.length > 0) {
          this.setState({
            warehousedata: response.data.data,
            showloader: false,
          });
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
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.navigateMainBoard()
        }
      }, 30000)
    );
  }
  //checking for disabling of button .
  CheckUserParent=()=>{
    const{accessed_supervisor,logged_supervisor}=this.state;

    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return true;
    }
  return false;



  
  }
  CheckUserTooltip=()=>{
    const{accessed_supervisor,logged_supervisor}=this.state;

    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "Don't have access";
    }
  return "Edit";



  }
  CheckHideButton=()=>{
    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "hidingButton";
    }
    return "";
  }
  CheckUserTooltipDelete=()=>{
    const{accessed_supervisor,logged_supervisor}=this.state;

    if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
    {
      return "Don't have access";
    }
  return "Delete";



  }
  //  in render we r rendering the content of the page 
  render() {
    const {
      warehousedata,
      modalIsOpen,
      isWspCreating,
      disabledId,
      showloader,
      check_ParentFpo,
      information_parentFpo,
      currentFpo
    } = this.state;
    // showModal function will get triggered on click on a Modal Popup.
    // Inside this we r setting all the variables which r used in a popup.
    // Initially we r setting all the values to empty and then in the nxt setState we are assigning values .
    const showModal = (val, selecteddata = null) => {
      this.setState({
        modalIsOpen: true,
        is_wsp_edit: false,
        errormessage: "",
        capacitymessage: "",
        namefieldmessage:"",
        phonefieldmessage: "",
        wspname: "",
        capacityclass: "",
        addressclass: "",
        blockclass: "",
        districtclass: "",
        contactclass: "",
        contactnoclass: "",
        latitudeclass: "",
        longitudeclass: "",
        wsp_title:"",
        capacity:"",
        address:"",
        block:"",
        district:"",
        contact:"",
        number:"",
        latitude:"",
        longitude:"",
      });
      if (selecteddata) {
        this.setState({
          wsp_title: selecteddata.wsp,
          address: selecteddata.address,
          block: selecteddata.block,
          district: selecteddata.district,
          capacity: selecteddata.capacity,
          contact: selecteddata.contactperson,
          number: selecteddata.phone,
          latitude: selecteddata.lat,
          longitude: selecteddata.long,
          wsp_id: selecteddata.id,
          is_wsp_edit: true,
        });
      }
    };
    // hideModal function will get triggered on click on a  close button inside Modal Popup.
    // Inside this we r setting all the variables to empty which r used in a popup .
    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
        wsp_id: -1,
        wsp_title: "",
        address: "",
        block: "",
        district: "",
        capacity: "",
        contact: "",
        number: "",
        latitude: "",
        longitude: "",
        is_wsp_edit: false,
      });
    };
    // here we r defining the columns which r used inside MaterialTable.
    const columns = [
      {
        title: "Warehouse Service Provider",
        field: "wsp",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Address",
        field: "address",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Block",
        field: "block",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "District",
        field: "district",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Capacity(MT)",
        field: "capacity",
        //   filtering:false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Contact Person",
        field: "contactperson",
        //   filtering:false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Contact Number",
        field: "phone",
        // filtering:false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Latitude",
        field: "lat",
        // filtering:false,
        render: (rowData) => {
                 
          return (
            <div>
              {rowData.lat!==null?parseFloat(rowData.lat).toFixed(5):""}
           
            </div>
          );

        },
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Longitude",
        field: "long",
        // filtering:false,
        render: (rowData) => {
                 
          return (
            <div>
              {rowData.long!==null?parseFloat(rowData.long).toFixed(5):""}
           
            </div>
          );

        },
        cellStyle: {
          width: "15%",
        },
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
            {/* {this.state.logged_supervisor!=this.state.accessed_supervisor?
             <a
             href="#"
             className="breadcrumb-item pageBreadCrumbItem"
             
             onClick={() => this.navigateToPage2("fpowsps")}
           >
             <FontAwesomeIcon
               icon={faHome}
               className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
               style={{ fontSize: "0.7rem" }}
             />
             
             &nbsp;Organization WSP List
           </a>
          
          
          :""} */}
           
          </div>
          {this.state.isParentLogged? 
                   <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
                   <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
                  </div>
                   : ""}
          <div className="landholdingHeader wrap">
            <Row>
              <Col lg="12" md="12" sm="12" className="noPadding">
                <div className="PageHeading padding15" style={{width:"30%"}}>
                  <Row>
                    <Col md={6}>
                      <h4 className="farmerListHeading dvaraBrownText headingMargin"style={{fontSize:"22px"}}>
                        WSP List
                      </h4>
                    </Col>

                    <Col md={6}>
                      {/* {check_ParentFpo===true?
                       <Button disabled>
                       Add Warehouse
                     </Button> */}
                     {/* :  */}
                     <Button className={this.CheckHideButton()} onClick={() => showModal(true)}>
                        Add Warehouse
                      </Button>
{/* } */}
                    </Col>
                  </Row>
                  {/* Modal is defined and on click on ADD warehouse and pencil modal will popUP .showModal function will allow modal 
                  to open as it has specific parameters required. */}
                  <Modal
                    show={modalIsOpen}
                    onHide={hideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered /* onEntered={modalLoaded} */
                    className="modal-adjust"
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Add Warehouse Service Provider
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo"
                          autocomplete="off"

                        >
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText"
                              column="sm"
                              lg={4}
                            >
                              Warehouse Service Provider Name :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                className={this.state.wspname}
                                type="text"
                                name="crop"
                                value={this.state.wsp_title}
                                onChange={this.handleWsp}
                              />
                              <p className="requiredfields">
                                {this.state.namefieldmessage}
                              </p>
                            </Col>
                            
                          </Form.Group>

                          {/* <Form.Group as={Row} className="mb-12" >
                    {(uploadedFileMessage.message.msg !== "") ?
                      (<Form.Label className={`formMessage ${((uploadedFileMessage.messageType.type === "error") ? 
                        ("errorMessage") : ((uploadedFileMessage.messageType.type === "success") ? ("successMessage") : ("normalText")))} `}>
                          {uploadedFileMessage.message.msg}</Form.Label>) : (
                        <Form.Label></Form.Label>
                      )}
                  </Form.Group> */}
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Capacity ( MT ) :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                autocomplete="nope"

                                className={this.state.capacityclass}
                                type="text"
                                name="crop"
                                maxLength="10"
                                value={this.state.capacity}
                                onChange={this.handleCapacity}
                              />
                              {/* <p className="requiredfields">{this.state.capacitymessage}</p> */}
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3 "
                            controlId="formHorizontalSizw"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Address:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                as="textarea"
                                size="sm"
                                 autocomplete="nope"
                                className={this.state.addressclass}
                                type="text"
                                name="crop"
                                value={this.state.address}
                                onChange={this.handleAddress}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalActPrc"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Block/Taluka:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.blockclass}
                                name="crop"
                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                value={this.state.block}
                                onChange={this.handleBlock}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalOffPrice"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              District:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                className={this.state.districtclass}
                                type="text"
                                name="crop"
                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                value={this.state.district}
                                onChange={this.handleDistrict}
                              />
                              {this.state.ofdprcmsg !== "" ? (
                                <span style={{ color: "red" }}>
                                  {this.state.ofdprcmsg}
                                </span>
                              ) : (
                                <span></span>
                              )}
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalDiscount"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Contact Person :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                className={this.state.contactclass}
                                type="text"
                                name="disount"
                                value={this.state.contact}                                
                                onChange={this.handleContact}
                              />
                              <p className="requiredfields">
                                {this.state.contacterromessage}
                              </p>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalAvailability"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Contact Details:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.contactnoclass}
                                name="crop" minlength={9} maxlength="10"
                                title="Phone number must be atleast 10 numbers"
                                value={this.state.number}                              
                                // pattern="/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/"
                                // pattern="/^[-+]?[0-9]+(\.[0-9]+)?$/"
                                // "^\d+(,\d+)*$"
                                onChange={this.handleNumber}
                              />
                              <p className="requiredfields">
                                {this.state.phonefieldmessage}
                              </p>
                            </Col>
                          </Form.Group>


                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalAvailability"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Latitude:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.latitudeclass}
                                name="latitude"
                                value={this.state.latitude}
                                onChange={this.handleLatitude}
                              />
                              <p className="requiredfields">
                                {this.state.latitudemessage}
                              </p>
                            </Col>
                          </Form.Group>


                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalAvailability"
                          >
                            <Form.Label
                              column="sm"
                              lg={4}
                              className="dvaraBrownText"
                            >
                              Longitude:
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.longitudeclass}
                                name="crop" minvalue={1}
                                value={this.state.longitude}
                                onChange={this.handleLongitude}
                              />
                              <p className="requiredfields">
                                {this.state.longitudemessage}
                              </p>
                            </Col>
                          </Form.Group>


                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage}
                      </p>
                      <Button
                        onClick={this.createWsp}
                        disabled={isWspCreating}
                        className="fa-pull-right defaultButtonElem"
                      >
                        <div className="formUpLoadSpinnerWrap">
                          {isWspCreating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <span></span>
                          )}
                        </div>
                        Save
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        onClick={hideModal}
                        className="fa-pull-right defaultButtonElem"
                      >
                        Close
                      </Button>
                      <span className="clearfix"></span>
                    </Modal.Footer>
                  </Modal>
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
                    data={warehousedata}
                    columns={columns}
                    actions={[
                      {
                        icon: tableIcons.Edit,
                        disabled:this.CheckUserParent(),
                        tooltip: this.CheckUserTooltip(),
                        onClick: (event, rowData) => showModal(true, rowData),
                      },
                      (rowData) => ({
                        icon: tableIcons.Delete,
                        disabled:this.CheckUserParent(),

                        // tooltip: "Delete",
                        tooltip: this.CheckUserTooltipDelete(),

                        isFreeAction: true,
                        onClick: (event, rowData) => {
                          if (
                            window.confirm(
                              'Are you sure to delete this "' +
                                rowData.wsp +
                                '" record?'
                            )
                          ) {
                            this.createWsp(rowData.id);
                          }
                        },
                      }),
                      // {
                      //     icon: tableIcons.Delete,
                      //     tooltip: 'Delete',
                      //     onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.wsp),
                      //     disabled: rowData
                      // }
                    ]}
                    options={{
                      actionsColumnIndex: -1,
                      doubleHorizontalScroll: true,
                      pageSize: 10,
                      pageSizeOptions: [
                        10,
                        20,
                        50,
                        100,
                        { value: warehousedata.length, label: "All" },
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
                {/* {showloader ? (
                    <div className="mainCropsFarmerLoaderWrap">
                    <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                  </div>
                  ): ("")} */}
              </Col>
            </Row>
          </div>
          <div className="verticalSpacer20"></div>
        </Fragment>
      </section>
    );
  }
}
