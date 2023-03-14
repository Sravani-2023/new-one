import React, { Component } from "react";
import "../assets/css/header.css";
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
  Carousel,
} from "react-bootstrap";

import UserService from "../services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mainLogo from "../assets/img/doordrishti.png";
import {
  faGripLinesVertical,
  faUser,
  faUsers,
  faMapMarkerAlt,
  faKey,
  faSignOutAlt,
  faWarehouse,faBell,faClock
} from "@fortawesome/free-solid-svg-icons";
import farmerIcon from "../assets/img/sickle.svg";
import ReminderImg from "../assets/img/Reminder.jpg"
import { Link,withRouter } from "react-router-dom";
import Dashboard from "../components/dashboard.component";
import FarmerList from "../components/farmerlist.component";
import AuthService from "../services/auth.service";
import { TriggerAlert,AlertMessage } from './dryfunctions'
import { green } from "@material-ui/core/colors";
import moment from "moment";
import Swal from 'sweetalert2';

class Header extends Component {
  constructor(props) {
    super(props);
    this.modalToggle = this.modalToggle.bind(this);
    this.handleOldPasswordCtrlChange =
      this.handleOldPasswordCtrlChange.bind(this);
    this.handleNewPasswordCtrlChange =
      this.handleNewPasswordCtrlChange.bind(this);
    this.handleRetypeNewPasswordCtrlChange =
      this.handleRetypeNewPasswordCtrlChange.bind(this);
    this.handleChangePasswordFormSubmit =
      this.handleChangePasswordFormSubmit.bind(this);
      this.handleAllReadChange = this.handleAllReadChange.bind(this);

    this.state = {
      showDashBoard: false,
      showFarmerList: false,
      currentUser: {},
      userFPOName: "",
      userName: "",
      userID: 0,
      userLocation: "",
      newPassword: "",
      oldPassword: "",
      retypedNewPassword: "",
      onChangeNewPasswordComment: [{}],
      isPasswordLengthOK: false,
      isRetypePasswordMatchesNewPassword: false,
      isPasswordChangeHappening: false,
      modalIsOpen: false,
      modalShow: false,
      is_parent: false,
      fullModalOpen:false,
      openModal:false,
      notificationCount: 0,
      reminderCount:0, 
      notificationList :[],
      reminderList:[],
      isRead:"",
      markChecked: false,
      markingRead : false
    };
  }
  
  sendNotificationLink=(link)=>{
    console.log("showlink",link)
    // await this.ReadApiCall(link,sendId)
      this.props.history.push(`/${link}`)
      window.location.reload();
      }
   ReadStatus = (id) => {
    var flag = false;
    UserService.getChangeReadStatus(id).then(     
      response => {
        console.log("read api",response.data)     
      this.setState({
        id : response.data.result.id,
        isRead : true,
        bgColor: "#DCDCDC",
      }); 
      window.location.reload();    
    },
    error => {
      this.setState({
        content:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
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
    }
    }, 500000)  
    );
   }
  modalToggle = (status) => {
    this.setState({
      modalShow: status,
    });
  };

  handleAllReadChange = (e) => { 
    // window.location.reload();
    let queryParam= this.props.location.search;
    let SplitqueryParam= queryParam.split("=");
    let SplitqueryParamTabValue= SplitqueryParam[1];
    this.setState({
      markingRead : true
    })
    UserService.MarkHomeNotificationsAsAllRead(SplitqueryParamTabValue,true).then(
      response => {
        Swal.fire({icon: 'success',title: 'Success',
        html: '<i style="color:red" class="fa fa-close"></i> <small>'+response.data.result.message+"</small>",
        showConfirmButton: false,timer: 5000,showCloseButton: true,})
        this.setState({
          fullModalOpen:false, 
          openModal:false,
          notificationCount : 0,
          notificationList : [],
          markingRead : false
        })
     },
    ) 
    
  };

  handleOldPasswordCtrlChange = (e) => {
    this.setState({
      oldPassword: e.target.value,
    });
  };
  handleNewPasswordCtrlChange = (e) => {
    let isValidPassword = this.checkEnteredPassword(e.target.value);
    this.setState({
      newPassword: e.target.value,
    });
    if (isValidPassword.status) {
      this.setState({
        isPasswordLengthOK: true,
        onChangeNewPasswordComment: isValidPassword,
      });
    } else {
      this.setState({
        isPasswordLengthOK: false,
        onChangeNewPasswordComment: isValidPassword,
      });
    }
  };
  handleRetypeNewPasswordCtrlChange = (e) => {
    this.setState({
      retypedNewPassword: e.target.value,
    });
    let retypePasswordComment = {
      status: false,
      msg: "",
      msgType: "",
    };
    let refNewPassword = this.state.newPassword;
    let enteredVal = e.target.value;
    if (refNewPassword === "") {
      retypePasswordComment.msg = "First enter the New Password!";
      retypePasswordComment.msgType = "error";
      retypePasswordComment.status = false;
    } else if (enteredVal === refNewPassword) {
      retypePasswordComment.msg = "Retype Password matches with New Password!";
      retypePasswordComment.msgType = "success";
      retypePasswordComment.status = true;
    } else if (enteredVal !== refNewPassword) {
      retypePasswordComment.msg =
        "Retype Password doesn't match with New Password!";
      retypePasswordComment.msgType = "error";
      retypePasswordComment.status = false;
    }
    this.setState({
      isRetypePasswordMatchesNewPassword: retypePasswordComment.status,
      onChangeNewPasswordComment: retypePasswordComment,
    });
  };

  handleChangePasswordFormSubmit = () => {
    this.setState({
      isPasswordChangeHappening: true,
    });

    const data = new FormData();
    //data.append('farmerfile', );
    let currOldPasswordFieldData = this.state.oldPassword;
    let currNewPasswordFieldData = this.state.newPassword;
    let currRetypeNewPasswordFieldData = this.state.retypedNewPassword;
    let currRetypeCheckWithNewPassword =
      this.state.isRetypePasswordMatchesNewPassword;
    let currNewPasswordValidStatus = this.state.isPasswordLengthOK;
    let currUserID = this.state.userID;
    let changePasswordCommentVal = {
      status: false,
      msg: "",
      msgType: "",
    };
    if (
      currOldPasswordFieldData === "" ||
      currNewPasswordFieldData === "" ||
      currRetypeNewPasswordFieldData === ""
    ) {
      changePasswordCommentVal.status = false;
      changePasswordCommentVal.msg = "Please fill all the fields!";
      changePasswordCommentVal.msgType = "error";
      this.setState({
        isPasswordChangeHappening: false,
      });
    } else if (!currRetypeCheckWithNewPassword) {
      changePasswordCommentVal.status = false;
      changePasswordCommentVal.msg =
        "Retyped Password is not matchin with New Password !";
      changePasswordCommentVal.msgType = "error";
      this.setState({
        isPasswordChangeHappening: false,
      });
    } else if (!currNewPasswordValidStatus) {
      changePasswordCommentVal.status = false;
      changePasswordCommentVal.msg =
        "Entered New Password doesn't match the length constraints";
      changePasswordCommentVal.msgType = "error";
      this.setState({
        isPasswordChangeHappening: false,
      });
    } else {
      /* const passwordData = new FormData()
      passwordData.append('old_password', this.state.currOldPasswordFieldData);
      passwordData.append('password', this.state.currNewPasswordFieldData); */
   
      UserService.updateNewPassword(
        currUserID,
        currNewPasswordFieldData,
        currOldPasswordFieldData
      ).then(
        (response) => {
          /*  this.appendMessageData(response.data.message, "");*/
          this.setState({
            isPasswordChangeHappening: false,
          });
        },
        (error) => {
          // console.log(error);
          this.setState({
            isPasswordChangeHappening: false,
          });
        }
      );
    }

    this.setState({
      onChangeNewPasswordComment: changePasswordCommentVal,
    });
  };

  checkEnteredPassword = (e) => {
    let minPasswordLength = 8;
    let maxPasswordLength = 20;
    let msg = "";
    if (e.length < minPasswordLength) {
      msg = "Entered Password length is very less";
      return { status: false, msg: msg, msgType: "error" };
      //toast.error(err);
    } else if (e.length > maxPasswordLength) {
      msg = "Entered Password length is very lengthy";
      return { status: false, msg: msg, msgType: "error" };
    } else {
      msg = "Password seems good!";
      return { status: true, msg: msg, msgType: "success" };
    }
  };

  componentDidMount() {
    var flag = false;
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showDashBoard: true,
        showFarmerList: true,
        userFPOName: user.org,
        userName: user.name,
        userID: user.user_id,
        is_parent: user.is_parent,
        // userLocation: user.district + ", " + user.state,
        userLocation: user.block? user.block + "," +user.district + ", " + user.state:user.district + ", " + user.state,

      });
    }
    UserService.getNotificationAndReminderCount().then(
      response => {
          this.setState({
            showloader:false,
            notificationCount : response.data.data.notification_count,
            reminderCount : response.data.data.reminder_count
          });           
        },
        error => {
          this.setState({
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString()
          });      
        if (error.response) {
          // TriggerAlert("Error", error.response.data.message, "error");
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
          // TriggerAlert("Error", "Response Timed out, Please try again", "info");
          // this.navigateMainBoard()
        }
      }, 600000)   //  time in milliseconds, 1000 =  1 sec  (600000 = 10 MINS)
    );
    UserService.getNotificationList().then(     
      response => {     
      this.setState({
        showloader:false,
        notificationList : response.data.result.data,
        isRead : true,
        bgColor: "#DCDCDC",
      });  
    },
    error => {
      this.setState({
        content:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
      }); 
    if (error.response) {
      // TriggerAlert("Error", error.response.data.message, "error");
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
    }
  }, 600000)  
    );
    UserService.getReminderList().then(     
    response => {     
    this.setState({
      showloader:false,
      reminderList : response.data.result.data,
    });   
  },
  error => {
    this.setState({
      content:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
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
  }
  }, 600000)  
    );      
   } 

  logOut() {    
      AuthService.logout();
    }
  hideModal=()=>{
    this.setState({
      fullModalOpen:false,
      openModal:false,
      
     })
   } 
  
  render() {
    const {
      currentUser,
      showDashBoard,
      showFarmerList,
      userFPOName,
      userName,
      userLocation,
      modalShow,
      oldPassword,
      newPassword,
      retypedNewPassword,
      isPasswordChangeHappening,
      onChangeNewPasswordComment,
      modalIsOpen,fullModalOpen,openModal,
      notificationCount,reminderCount,isRead
      } = this.state;   

    const showModal = () => {
      this.setState({
        modalIsOpen: true,
      });
    };

    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
      });
      //setTitle("Transitioning...");
    };
    const popUpImage=()=>{ 
      this.setState({
        markChecked : false,
        fullModalOpen:true, 
        openModal:false           
        })      
    }
    const popImage = () =>{
        this.setState({
          markChecked : false,
          openModal: true,
          fullModalOpen: false
        })
    }  
    const ChangeChecked  = (e) => {
      console.log(e.target.checked)
      if(e.target.checked){
        this.setState({
          markChecked: true
        })
      }
      else{
        this.setState({
          markChecked: false
        })
      }
    }
     
    return (
      <div className="wrap">
        <nav className="sb-topnav navbar navbar-expand dvaraBrownBG topNavBar">
          <button
            className="btn btn-link btn-sm order-1 order-lg-0 openSideBarMenu"
            id="sidebarToggle"
            href="#"
          ></button>
          <div className="-none -lg-block dvaraGreenText">
            <FontAwesomeIcon icon={faGripLinesVertical} />
          </div>
          <Link to={this.state.is_parent ? "/fpohomeData":"/dashboard"}>
            {" "}
            <img src={mainLogo} className="doordrishti" alt="mainLogo"></img>
          </Link>
          <div className="navbar-brand">
            <h4 className="brandText" >{userFPOName}</h4>
          </div>
          <ul className="navbar-nav ml-auto ml-md-0 userDropDownParent">
            <li className="fpoLocationHolder">
              <span className="">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="dvaraGreenText"
                ></FontAwesomeIcon>
                &nbsp;
                <a href="/Userprofile" className="userName">
                  {userLocation}{" "}
                </a>
              </span>
            </li>
            <li className="bellHolder" current-count={notificationCount}>
            <span className="">
                <FontAwesomeIcon 
                icon={faBell} onClick={() =>popUpImage()}
                className="dvaraWhiteText" 
                style={{width:"25px",height:"24px",cursor:"pointer",marginRight:"5px",marginTop:"5px"}}
               />            
            </span>            
          </li>
          <li className="bellHolder" current-count={reminderCount}>
            <span className="">
             <FontAwesomeIcon 
                icon={faClock} onClick={() =>popImage()}
                className="dvaraWhiteText" 
                style={{width:"25px",height:"24px",cursor:"pointer",marginRight:"10px",marginTop:"5px" }}
               />                         
            </span>            
          </li>
            <li className="nav-item dropdown" style={{marginTop:"10px"}}>
              <a
                className="nav-link dropdown-toggle userIcon"
                id="userDropdown"
                role="button"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faUsers} />
              </a>
              <div
                className="dropdown-menu dropdown-menu-right topNavBarDropDown"
                aria-labelledby="userDropdown"
              >
                <ul>
                  <li className="navDropDownUserNameViewOnly">
                    <span className="">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="dvaraGreenText"
                      ></FontAwesomeIcon>
                      &nbsp;{userName}
                    </span>
                  </li>
                  <li
                    className="navDropDownUserNameView changePassword"
                              
                  >
                    <Link to={"/userprofile"}>
                    <span className="" style={{color: "black"}}>
                      <FontAwesomeIcon
                        icon={faUser}
                        className="dvaraGreenText"
                      ></FontAwesomeIcon>
                      &nbsp;&nbsp;Profile
                    </span></Link>
                  </li>
                  {/* <li
                    className="navDropDownUserNameView changePassword"
                    onClick={() => showModal(true)}
                  >
                    <span className="">
                      <FontAwesomeIcon
                        icon={faKey}
                        className="dvaraGreenText"
                      ></FontAwesomeIcon>
                      &nbsp;Change Password
                    </span>
                  </li> */}
                </ul>
                {/* <div className="fpoDetailsRespView">
                  <ul>
                    <li className="fpoDetsRespView fpoRespViewOrgName">
                      <span className="">
                        <FontAwesomeIcon
                          icon={faWarehouse}
                          className="dvaraGreenText"
                        ></FontAwesomeIcon>
                        &nbsp;{userFPOName}
                      </span>
                    </li>
                    <li className="fpoLocationHolderRespView fpoDetsRespView">
                      <span className="">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="dvaraGreenText"
                        ></FontAwesomeIcon>
                        &nbsp;{userName}
                      </span>
                    </li>
                    <li className="fpoLocationHolderRespView fpoDetsRespView">
                      <span className="">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="dvaraGreenText"
                        ></FontAwesomeIcon>
                        &nbsp;Change Password
                      </span>
                    </li>
                    <li className="fpoUserNameRespView fpoDetsRespView">
                      <span className="">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="dvaraGreenText"
                        ></FontAwesomeIcon>
                        &nbsp;{userLocation}
                      </span>
                    </li>
                  </ul>
                </div> */}
                <div className="dropdown-divider fpoDetailsRespView"></div>
                <a
                  className="dropdown-item navDropDownUserNameView"
                  href="/"
                  onClick={this.logOut}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="dvaraGreenText"
                  ></FontAwesomeIcon>
                  &nbsp;Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
        <Modal
          show={modalIsOpen}
          onHide={hideModal}
          size="md  "
          aria-labelledby="contained-modal-title-vcenter"
          centered /* onEntered={modalLoaded} */
        >
          <Modal.Header>
            <Modal.Title>
              <FontAwesomeIcon
                icon={faKey}
                className="dvaraGreenText"
              ></FontAwesomeIcon>
              &nbsp;&nbsp;
              <span className="dvaraBrownText">Change Password</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label className="dvaraBrownText">
                      <b>Old Password</b>
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      type="password"
                      size="sm"
                      onChange={this.handleOldPasswordCtrlChange}
                      value={oldPassword}
                      placeholder="Enter Old Password"
                    ></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label className="dvaraBrownText">
                      <b>New Password</b>
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      size="sm"
                      onChange={this.handleNewPasswordCtrlChange}
                      placeholder="Enter New Password"
                    ></Form.Control>
                    <Form.Text id="passwordHelpBlock" muted>
                      <i>
                        Your password must be 8-20 characters long, contain
                        letters and numbers.
                      </i>
                    </Form.Text>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label className="dvaraBrownText">
                      <b>Retype New Password</b>
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      type="password"
                      value={retypedNewPassword}
                      size="sm"
                      onChange={this.handleRetypeNewPasswordCtrlChange}
                      placeholder="Retype New Password"
                    ></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            <div className="fa-pull-left">
              <Form.Text
                id="passwordChangeMessageHolder"
                className={`formMessage ${
                  onChangeNewPasswordComment.msgType === "error"
                    ? "errorMessage"
                    : onChangeNewPasswordComment.msgType === "success"
                    ? "successMessage"
                    : "normalText"
                } `}
              >
                {onChangeNewPasswordComment.msg}
              </Form.Text>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="fa-pull-right">
              <Button
                className="defaultButtonElem"
                style={{ width: "80px" }}
                disabled={isPasswordChangeHappening}
                onClick={this.handleChangePasswordFormSubmit}
              >
                <div className="passwordChangeSpinnerWrap fa-pull-left">
                  {isPasswordChangeHappening ? (
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
            </div>
            <span className="clearfix"></span>
          </Modal.Footer>
        </Modal>
        <Modal 
          show={fullModalOpen}
          onHide={this.hideModal}
          size="lg"   
          aria-labelledby="contained-modal-title-lg"
          > 
          <div className="modalup">
          <Modal.Header style={{height:"60px"}}>           
            <div className="bellHolder" current-count={notificationCount}>                           
                                      <FontAwesomeIcon 
                                      icon={faBell}
                                      className="dvaraWhiteText" 
                                      style={{width:"28px",height:"28px",marginRight:"280px",marginTop:"2px",color:"rgb(114, 49, 12)"}}
                                    />
                                    <div className="Notification-title" >Notifications</div>                                    
                                    {/* <div style={{float:"right",marginLeft:"350px",marginTop:"-28px"}}><input type="checkbox"  onChange={this.handleAllReadChange}/>&nbsp;
                                   Mark all as read</div>  */}
                                    <div style={{marginLeft:"250px",marginTop:"-28px"}}><input type="checkbox" 
                                    onChange={ (e) => ChangeChecked(e)}  />&nbsp;
                                   Mark all as read</div>
                                   { this.state.markChecked ?                                       
                                   <Button disabled={this.state.markingRead}  className="defaultButtonElem" style={{float: "right", marginTop: "-28px", marginLeft:"380px"}}  onClick={this.handleAllReadChange}>Submit</Button> : ''}
                                   </div>            
                     </Modal.Header>
                <Modal.Body >    
                      <div  style={{marginTop:"5px"}}>                         
                             {this.state.notificationList.length>0?               
                              <div style={{height:"420px",marginTop:"35px"}}>                 
                              {this.state.notificationList.map((user) => (       
                                  <div className="notification-pop-up" 
                                  style= {{ backgroundColor: (user.is_read === true && user.id === user.id) &&  this.state.bgColor }} 
                                  onClick={()=>this.ReadStatus(user.id)} >   
                                <div style= {{ backgroundColor: (user.is_read === true && user.id === user.id) &&   this.state.bgColor}}></div>
                                <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"60px"}} src={farmerIcon} />
                                    <div className="notification-message" >{user.title}</div>
                                    <span className="dateformat">{moment(user.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                                    <div className="notification-link" style={{color:"black"}}><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(user.redirect_url)}> {user.message}</a>  </div>                     
                                    {/* <div className="date-format">{moment(user.created_at).format("DD/MM/YYYY , h:mm a")}</div> */}
                              </div>
                            ))}   
                              </div>                         
                            
                             : <div style={{height:"100px",marginTop:"-50px",top:"-200px"}}>
                             <div className="Nodata" >No Data to Display</div>
                             </div>
                             }                                                                               
                        </div>
                      </Modal.Body>
                      <Modal.Footer style={{height:"60px"}}>             
                 <a href="/webnotification/" style={{ marginRight:"250px",fontSize:"18px",marginBottom:"5px"}} className="anchor-link"><u>View All Notifications</u></a>
                 <Button className="defaultButtonElem" onClick={this.hideModal} style={{height:"35px",width:"20%",marginTop:"-10px"}}>
                         Close
                        </Button>  
                 </Modal.Footer>
                 </div>
          </Modal>
          <Modal
          show={openModal}
          onHide={this.hideModal}
          size="lg"   
          aria-labelledby="contained-modal-title-vcenter"
          style={{marginLeft:"35%"}}
          centered >
            <div className="modalpopup">
            <Modal.Header style={{height:"60px"}}>           
            <div className="bellHolder" current-count={reminderCount}>                           
                                      <FontAwesomeIcon 
                                      icon={faClock}
                                      className="dvaraWhiteText" 
                                      style={{width:"25px",height:"25px",marginRight:"350px",marginTop:"5px",color:"rgb(114, 49, 12)"}}
                                    />
                                    <div className="Notification-title" >Reminders</div>          
                                     
                                   </div>            
            </Modal.Header>                           
                <Modal.Body >   
                         <div style={{marginTop:"5px"}}>
                         {this.state.reminderList.length>0?                 
                                <div style={{height:"400px",marginTop:"35px"}}>                          
                                {this.state.reminderList.map((item) => (       
                                  <div className="notification-pop-up"
                                  // style= {{ backgroundColor: (item.is_read === true && item.id === item.id) &&  this.state.bgColor}} 
                                  onClick={()=>this.ReadStatus(item.id)}> 
                                 <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"65px",width:"80px",background:"rgb(229, 231, 233 )"}} src={ReminderImg} />                             
                                  <div className="notification-message" >{item.title}</div>
                                  <span className="dateformat">{moment(item.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                                  <div className="notification-link" style={{color:"black"}}><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(item.redirect_url)}> {item.message}</a>  </div> 
                                  </div>
                              ))}                            
                              </div>
                              : 
                              <div style={{height:"100px",marginTop:"-50px"}}>
                              <div className="no-data" style={{marginLeft:"-50px",marginTop:"50px"}} >No Data to Display</div>
                              </div>
                              }  
                          </div>                          
                      </Modal.Body>
                      <Modal.Footer style={{height:"60px"}}>             
                 <a href="/Reminder" style={{ marginRight:"250px",fontSize:"18px",marginBottom:"5px"}} className="anchor-link"
                 ><u>View All Reminders</u></a>
                 <Button className="defaultButtonElem" onClick={this.hideModal} style={{height:"35px",width:"20%",marginTop:"-10px"}}>
                         Close
                        </Button> 
                 </Modal.Footer>                 
                 </div>
          </Modal>
      </div>
    );
  }
}

{/* <div style={{height:"450px"}}>   
                      {this.state.reminderList.map((item)=> (
                        <div className="reminder-pop-up">
                           <div className="notification-message" ><u>{item.title}</u></div>
                           <a href="#" onClick={()=>this.sendNotificationLink(item.redirect_url)}>  {item.message}</a>
                           <div className="dateformat">{moment(item.created_at).format("YYYY-MM-DD , HH:mm")}</div>
                           </div> 
                      ))}                                                                                                                                   
                        </div> */}
export default withRouter(Header) ;

/**  <button class="btn btn-link btn-sm order-1 order-lg-0 openSideBarMenu" id="sidebarToggle" href="#"></button>
                                <div class="-none -lg-block"><i class="fas fa-grip-lines-vertical" style="font-size: 1.3em; color: #fff;"></i></div>
                                <img src="images/doordrishti.png" class="doordrishti">
                                <form class="-none -md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                                    <div class="input-group">
                                        
                                    </div>
                                </form>
                                <ul class="navbar-nav ml-auto ml-md-0">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                            <a class="dropdown-item" href="#">Settings</a>
                                            <a class="dropdown-item" href="#">Activity Log</a>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item" href="login.html">Logout</a>
                                        </div>
                                    </li>
                                </ul> */
