import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from "./icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome,faCaretRight } from "@fortawesome/free-solid-svg-icons";
import {TriggerAlert,ComplianceAlertMessage} from './dryfunctions'
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
} from "react-bootstrap";




// function getyearFilterData(compliancedata, input_type) {
//   var data = compliancedata.filter(function(product){   
//       console.log(product);     
//         if (input_type == "all") {
//             return product
//         }  
//         else {
//         return String(product.year) === String(input_type)
//         }
//       }
//   )
//   return data
// }



function getyearFilterData(compliancedata, input_type) {
  // console.log("all",input_type)
  var data = compliancedata.filter(function(product){   
      // console.log(product);     
  
          if (input_type == "all") {
              return product
          }  
          else {
            
            return String(product.financial_year_range) === String(input_type)    

          }
        })

  

  return data
};

function getFilterData(compliancedata, input_type) {
    var data = compliancedata.filter(function(product){   
        // console.log(product);     
          if (input_type == "all") {
              return product
          }  
          else {
          return product.status === (input_type)
          }
        }
    )
    return data
}
export default class ComplianceHistory extends Component {
  constructor(props) {
    super(props);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleCompletiondate = this.handleCompletiondate.bind(this);
    this.handleReason = this.handleReason.bind(this);
    

    this.state = {
      compliancedata: [],
      loading: false,
      showloader: true,
      errormessage: "",
      orderData:[],
      finYearDisable:"",
      finalMonth:"",
      DropdownList:[],
      yearlist:[],
      completiondate:"",
      precompletionDate:"",
      isComplianceUpdating:false,
      minDate: new Date(),
      maxDate: new Date()


    };
    
  }

  uniqueBy(arr, prop){
    return arr.reduce((a, d) => {
      if (!a.includes(d[prop])) { a.push(d[prop]); }
      return a;
    }, []);
  }

  extractYears(historydata){
    var year_list = (this.uniqueBy(historydata,"financial_year_range")).filter(function (el) {return el != null})
    year_list.sort((a, b) => (a > b) ? 1 : -1) //sorting the financial year range in ascending order
    this.setState({
      yearlist:year_list
    })
    // console.log("yearlist",this.state.yearlist)
  }
  handleYearChange = (e) => {
    // console.log(e.target.value)
    const filterList = getyearFilterData(this.state.compliancedata, e.target.value)
    this.setState({
        inputType: e.target.value,
        orderData: filterList
    })
  }
  handleTypeChange = (e) => {
    const filterList = getFilterData(this.state.compliancedata, e.target.value)
    this.setState({
        inputType: e.target.value,
        orderData: filterList
    })
}


handleCompletiondate = (e) => {
  this.setState({ completiondate: e.target.value, completiondateclass: "" });
};

handleReason = (e) => {
  this.setState({ reason: e.target.value, reasonclass: "" });
};

handleFormValidation = () => {
  let errors = false;
  if (this.state.actiontype == "edit"){
  if (this.state.completiondate == "" | this.state.completiondate == undefined) {
    errors = true;
    this.setState({ completiondateclass: "requiredinputfields" });
  }
  }
  if (this.state.compliancetype != 'Miscellaneous'){
  if (this.state.reason == "" | this.state.reason == undefined) {
    errors = true;
    this.setState({ reasonclass: "requiredinputfields" });
    }
  }

  if (errors == false) {
    this.setState({ errormessage: "" });
    return false;
  } else {
    this.setState({ errormessage: "Required fields must be filled" });
    return true;
  }
}
openDeleteTicket = (auditId) => {
  this.setState({
    modalIsOpen:true,
    // showloader: true,
    actiontype:'delete',
    errormessage:"",
    reasonclass:"",
    deleteauditId:auditId,
    reason:"",
  });
}
deleteIssueTicket = (auditId) => {
  var success = this.handleFormValidation();
  
  if (success == false) {
    this.setState({
      modalIsOpen:false,
      showloader: true,
    })
    const data = new FormData();
    data.append("new_completion_date", "");
    data.append("action", "Delete");
    data.append("comliance_event", this.state.deleteauditId);
    data.append("reason", this.state.reason);
    var flag = false;
    UserService.CreateComplianceTicket(data).then(
      (response) => {
        flag = true;
        if (response.data.success || "id" in response.data.data) {
          this.setState({
            modalIsOpen: false,
            showloader: false,
          });
        }
      },
      (error) => {
        flag = true;
        if (error.response) {
          TriggerAlert("Error", error.response.data.error, "error");
          this.setState({
            showloader: false,
          });
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
          this.props.history.push("/dashboard");
        }
      }, 30000)
    );
  
} else {
  console.log("required fields missed");
}
}
createComplianceticket = () => {
    
      var success = this.handleFormValidation();
    if (success == false) {
      this.setState({
        // showloader: true,
        isComplianceUpdating:true,
      });
      const data = new FormData();
      // console.log("check complition data",this.state.completiondate)
        data.append("new_completion_date", this.state.completiondate);
        data.append("action", "Edit");
        data.append("reason", this.state.reason);
        data.append("comliance_event", this.state.complianceevent);
        var flag = false;
        UserService.CreateComplianceTicket(data).then(
          (response) => {
            flag = true;
            // console.log("edit ticket response",response)
            if (response.data.success || "id" in response.data.data) {
              if (this.state.compliancetype != 'Miscellaneous'){
              ComplianceAlertMessage( "Ticket Successfully Raised");
              }
              else {
                ComplianceAlertMessage("Changes updated successfully.");
              }
              this.setState({
                modalIsOpen: false,
                showloader: false,
                isComplianceUpdating:false,

              });
            }
          },
          (error) => {
            flag = true;
            if (error.response) {
              this.setState({
                showloader: false,
                isComplianceUpdating:false,

              })
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
              isComplianceUpdating:false,

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
              this.props.history.push("/dashboard");
            }
          }, 30000)
        );
      
    } else {
      console.log("required fields missed");
    }
  };
  

 
  navigateToPage= (pageName) => {
     
    this.props.history.push("/" + pageName + "");
  };

  componentDidMount() {
    var flag = false;
    if(!localStorage.getItem('user')){
      this.props.history.push('/')
      return
    }
    UserService.getComplianceHistoryList().then(
      (response) => {
        flag = true;
        // console.log("respose->", response)
        if (response.data.data.length == 0) {
          this.setState({ showloader: false });
        } else if (response.data.data.length > 0) {
          this.extractYears(response.data.data)
         
          this.setState({
            orderData: response.data.data,
            compliancedata: response.data.data,
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
          this.props.history.push("/dashboard");
        }
      }, 30000)
    );
  }

  render() {
    const {
      compliancedata,
      showloader,
      orderData,
      modalIsOpen,
      isComplianceUpdating,
    } = this.state;
    
    const showModal = (val, selecteddata = null) => {

      this.setState({
        modalIsOpen: true,
        completiondate:"",
        reason:"",
        actiontype:'edit',
        errormessage:"",
        reasonclass:"",
        completiondateclass:"",
      });
      if (selecteddata) {
        console.log('selecteddata-----------', selecteddata)
        const finYearDisable = new Date(selecteddata.due_date).getFullYear()
        debugger
        // const date = new Date(this.state.precompletionDate); 
        const date = new Date(selecteddata.due_date); 
      
        const month = date.toLocaleString('default', { month: 'long' });
        // console.log(month);
        let min_date = ""
        let max_date = ""
        if(month=="January"||month=="February"||month=="March")
        {
          min_date = `${finYearDisable-1}-04-01`
          max_date =  `${finYearDisable}-03-31`
        }
        else{
          min_date = `${finYearDisable}-04-01`          
          max_date =  `${finYearDisable+1}-03-31`
        }
        
       
      
        this.setState({
          complianceevent:selecteddata.id,
          precompletionDate:selecteddata.completion_date,
          compliancetype:selecteddata.compliance_type,
          // completiondate:selecteddata.due_date,
          minDate : min_date,
          maxDate: max_date
          
        })
      }
    }
    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
      })
    }
    
    const columns = [
      {
        title: "Meeting Name",
        field: "meeting_name",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Compliance Type",
        field: "compliance_type",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Due Date",
        field: "due_date",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Completeion Date",
        field: "completion_date",
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Status",
        field: "status",
        // lookup: { 'Pending': 'Pending', 'Completed': 'Completed' },
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
              onClick={() => this.navigateToPage("dashboard")}
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

                         onClick={() => this.navigateToPage("userprofile")} // will navigate to the parent i.e profile page .

                           >Profile

                              </a>

          </div>
          <div className="landholdingHeader wrap">
            <Row>
              <Col lg="12" md="12" sm="12" className="noPadding">
                <div className="PageHeading padding15" style={{width:"30%"}}>
                <Row>
                    <Col md={8}>
                      <h4 className="farmerListHeading dvaraBrownText headingMargin">
                        Compliance History
                      </h4>
                    </Col>

                    <Col md={6}>
                      {/* <Button onClick={() => showModal(true)}>
                        Add Warehouse
                      </Button> */}
                    </Col>
                  </Row>
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
                          {this.state.actiontype == "delete" ? ("Delete"):("Update")} Compliance
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo"
                        >
                          {this.state.actiontype == "edit" ? (
                              

                          <div>
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
                              Previous Completion Date :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                type="date"
                                name="crop"
                                disabled
                                value={this.state.precompletionDate}
                              />
                            </Col>
                          </Form.Group>

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
                              Completion Date :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                className={this.state.completiondateclass}
                                type="date"
                                name="crop"
                                min={this.state.minDate}
                                max={this.state.maxDate}
                                value={this.state.completiondate}
                                onChange={this.handleCompletiondate}
                              />
                            </Col>
                          </Form.Group>
                          </div>
                          ):("")}
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
                              Reason :
                            </Form.Label>
                            <Col sm={6}>
                              <Form.Control
                                size="sm"
                                className={this.state.reasonclass}
                                type="text"
                                name="reason"
                                value={this.state.reason}
                                onChange={this.handleReason}
                              />
                            </Col>
                          </Form.Group>
                          

                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage}
                      </p>
                      {this.state.actiontype == "edit" ?(
                      <Button
                        onClick={this.createComplianceticket}
                        disabled={isComplianceUpdating}

                        className="fa-pull-right defaultButtonElem"
                      >
                      
                        
                        Save Changes
                  {isComplianceUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                      </Button>) : (
                        <Button
                        onClick={this.deleteIssueTicket}
                        
                        className="fa-pull-right defaultButtonElem"
                      >
                        <div className="formUpLoadSpinnerWrap">
                          
                        </div>
                        Save
                      </Button>
                      )}
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
                    <Row>
                         <Col lg="12" md="12" sm="12" className="">
                         <div className="LandHoldingHeading PageHeading inputOrderHeading">
                                        <Row>
                                            <Col md={4} >
                                              

                                                                {/* <h4 className="farmerListHeading dvaraBrownText" style={{marginLeft:"25px"}}>Farmer Orders</h4> */}
                                            </Col>
                                            <Col md={4} >

                                            <Form>                                                   
                                                    <Form.Group as={Row} controlId="formHorizontalUnits" style={{marginTop:"20px"}} >
                                                        <Form.Label column="sm" lg={6} className="dvaraBrownText">Compliance Status: </Form.Label>
                                                        <Col sm={5}>
                                                            <Form.Control
                                                                as="select"
                                                                size="sm"
                                                                // value={this.state.inputType}
                                                                custom
                                                                onChange={this.handleTypeChange}
                                                            >
                                                                {/* <option selected disabled>Select option to filter</option> */}
                                                                <option value="all" selected>All</option>
                                                                <option value="Pending">Pending</option>
                                                                <option value="Completed">Completed</option>
                                                                
                                                            </Form.Control>
                                                        </Col>
                                                    </Form.Group>
                                                      
                                                </Form>

                                                                {/* <h4 className="farmerListHeading dvaraBrownText" style={{marginLeft:"25px"}}>Farmer Orders</h4> */}
                                            </Col>
                                            <Col md={4} className="typeDropdown" >
                                            <Form>                                                   
                                                    <Form.Group as={Row} controlId="formHorizontalUnits" style={{marginTop:"10px"}}>
                                                        <Form.Label column="sm" lg={5} className="dvaraBrownText">Financial Year: </Form.Label>
                                                        <Col sm={5}>
                                                            <Form.Control
                                                                as="select"
                                                                size="sm"
                                                                custom
                                                                onChange={this.handleYearChange}
                                                            >
                                                                <option value="all" selected>All</option> 
                                                               {this.state.yearlist.map((value) => <option value={value} >{value}</option>)}
                                                                {/* <option value="2018">2018-2019</option>

<option value="2019" >2019-2020</option>

<option value="2020">2020-2021</option>
<option value="2021">2021-2022</option>
                                                                 */}
                                                            </Form.Control>
                                                        </Col>
                                                    </Form.Group>
                                                      
                                                </Form>
                                            </Col>
                                        </Row>
                                    </div>
                  <MaterialTable
                    icons={tableIcons}
                    title=""
                    style={{ marginLeft: "30px" }}
                    data={orderData}
                    columns={columns}
                    actions={[
                      {
                        icon: tableIcons.Edit,
                        tooltip: "Edit",
                        onClick: (event, rowData) => showModal(true, rowData),
                      },
                      (rowData) => ({
                        icon: tableIcons.Delete,
                        tooltip: "Delete",
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                          if (
                            window.confirm(
                              'Are you sure to delete this "' +
                                rowData.meeting_name +
                                '" record?'
                            )
                          ) {
                            this.openDeleteTicket(rowData.id);
                          }
                        },
                      }),
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
                        { value: compliancedata.length, label: "All" },
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
                  </Col>
                </Row>
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
