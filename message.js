import React, { Component } from "react";
import "../assets/css/header.css";
import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  
  ToggleButtonGroup,
  ToggleButton,
  Form,
  FormSelect,
 
  Button,
} from "react-bootstrap";
import {TriggerAlert,} from './dryfunctions';
import MaterialTable from "material-table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import UserService from "../services/user.service";
import Swal from 'sweetalert2';
import moment from 'moment';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMapMarker, faMapMarkerAlt, faMobileAlt, faHome, faCaretRight } from "@fortawesome/free-solid-svg-icons";


import { Link } from "react-router-dom";
import "../assets/css/message.css";
import tableIcons from "./icons";

import AuthService from "../services/auth.service";
React.createElement('input',{type: 'checkbox', defaultChecked: true});

class message extends Component {
  constructor(props) {
    super(props);
    this.handleSelectedData = this.handleSelectedData.bind(this);
    this.handleScheduleDate = this.handleScheduleDate.bind(this);
    this.handleCustomMessage = this.handleCustomMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUsersList = this.handleUsersList.bind(this);
    this.state = {
      isLogg: false,
      isfarmers: false,
      hidefrcol:false,
      usersdata:[],
      selecteduserdata:[],
      messagedata:[],
      usercategory:"farmers",
      schedule:"now",
      scheduledate:"",
      custommessage:"",
      userslist:[],
      showloader:true,
      is_schedule:0,
      showSmsHistory:false,
    };
  }

  handleShowMessage = (message) => {
    Swal.fire({
      position: 'center',
      background:'d6d5d5',
      html:'<h4 align=left><b>Message</b></h4><b><hr><b><p font-size=8px align=left>'+message+'</p>',
      // showCloseButton: true,
      text: message,
      // showConfirmButton: false,
    });
  }

  handleShowRecieverList = (recieverlist) => {
    Swal.fire({
      position: 'center',
      background:'d6d5d5',
      // showCloseButton: true,
      html: "<h4 align=left><b>Recipients</b></h4><b><hr><pre style=align:left>"+recieverlist+"</ style=align:left>",
      // showConfirmButton: false,
    })
  }

  handleSelectedData = (data) => {
    var useridlist=[];
    // var selecteduserdata = [];
    for(var i=0;i<data.length;i++){
        if (data[i]['user_ptr_id']){
          useridlist.push(data[i]['user_ptr_id'])
        }
        else {
          useridlist.push(data[i]['id'])
        }
        
    }

    this.setState({selecteduserdata:useridlist})
  };
  navigateToPage = (pageName) => {
   

    this.props.history.push("/" + pageName + "");

  };

  componentDidMount() {
    if(!localStorage.getItem('user')){
      this.props.history.push('/')
      return
    }
    this.fetchFarmerList()
    this.fetchSMSHistoryListList()
  }

  handleScheduleDate = (e) => {
    this.setState({ scheduledate: e.target.value });
  };

  handleCustomMessage = (e) => {
    this.setState({ custommessage: e.target.value,customMsgClass:"",customMsgError:"" });
  };

  handleChange = (event) => {
    if (event.target.value == "schedule"){
    this.setState({
      isLogg: true,
      schedule:event.target.value,
      is_schedule:1,
    });
  }
  else {
    this.setState({
      isLogg: false,
      schedule:event.target.value,
      is_schedule:0,
    });
  }
  };

  fetchFarmerList = () => {
    var flag = false;
    this.setState({showloader:true,})
    const fpoId = localStorage.getItem("fpoId")

    UserService.getFarmerList(-1,-1,fpoId).then(
      (response) => {
        // console.log("response",response)
          flag = true;
          if (response.data.success) {

              this.setState({
                  isfarmers:true,
                  showloader:false,
                  hidefrcol:false,
                  usersdata: (response.data.farmers).filter(
                    function (farmer) {return (farmer.farmer_nonaccessibility==false|farmer.farmer_nonaccessibility==null)})
                  
              });
          }
          else{
            this.setState({
              showloader:false,
            })
            console.log("error")
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
        this.props.history.push('/dashboard')
        }
    }, 30000)
    );
  };

  fetchFrList = () => {
    var flag = false;
    this.setState({showloader:true,})
    const fpoId = localStorage.getItem("fpoId")

    UserService.getFrList(fpoId).then(
      (response) => {
        // console.log(response)
        var filterdFrs = response.data.data.filter((fr) => fr.id != -1)
        flag = true;
        this.setState({
          usersdata: filterdFrs,
          isfarmers:false,
          hidefrcol:true,
          showloader:false,
        });
        
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
        this.props.history.push('/dashboard')
        }
    }, 30000)
    );
  };
  
  fetchSMSHistoryListList = () => {
    var flag = false;
    this.setState({showloader:true,})

    UserService.getMessageHistoryList().then(
      (response) => {
        // console.log(response)
        flag = true;
        this.setState({
          messagedata: response.data.data,
        });
        
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
        this.props.history.push('/dashboard')
        }
    }, 30000)
    );
  };

  smsHistoryTable = () =>{
    this.setState({
      showSmsHistory:!this.state.showSmsHistory,
    })
    
  }
  handleMessageFormValidation = () => {
    let errors = false
    // alert(this.state.selecteduserdata)
    if (this.state.custommessage == ""){
      errors = true
      this.setState({customMsgClass:"requiredinputfields",customMsgError:"Message field is required"})
    }
    if (this.state.selecteduserdata == ""){
      errors = true
      this.setState({errorMsg:"Please select Farmer/FieldRepresentative from the table"})
    }
    return errors
  }
  createInput = () => {
    const data = new FormData();
    var errors = this.handleMessageFormValidation()
    if (errors==false) {
    data.append("sel_type", this.state.usercategory);
    data.append("message", this.state.custommessage);
    data.append("send_type", this.state.schedule);
    data.append("datetime", this.state.scheduledate);
    data.append("recips", this.state.selecteduserdata);

    this.setState({showloader:true,})
    var flag = false;
    UserService.SchedulingCustomizedSMS(data).then(
      (response) => {
        flag = true;
        if (response.data.success || "id" in response.data.data) {
          Swal.fire({icon: 'success',title: 'Success',backdrop:false,
          html: '<i style="color:red" class="fa fa-close"></i> <small>'+response.data.message+"</small>",
          showConfirmButton: false,
          timer: 5000,
          showCloseButton: true,backdrop:false,
        });
          // TriggerAlert("Success",response.data.message,"success");
          this.setState({showloader:false});
          window.location.reload();
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
        this.props.history.push('/dashboard')
        }
    }, 30000)
    )
  }
  else{
    console.log("required fields must be filled")
  }
  }
  
  

  handleUsersList = (event) => {
    this.setState({ 
      usercategory: event.target.value,
      showloader:true,
     });
    if (event.target.value == "farmers"){
      this.fetchFarmerList();
    }
    else {
      this.fetchFrList();
    }
    this.setState({ 
      showloader:false,
     });
  }

  render() {
    const { isfarmers, usersdata,hidefrcol, showloader, showSmsHistory, messagedata } = this.state;
      
      const columns = [
        {
          title: "First Name",
          field: "first_name",
        },
        { title: "Last Name", field: "last_name" },
        {
          title: "Village",
          field: "village",
        },
        {
          title: "Phone",
          field: "phone",
        },
        {
          title: "Field Representative",
          field: "fr_name",
          hidden: hidefrcol,
        },
        {
          title: "Farmer Interest Group",
          field: "",
        },
        {
          title: "Crops",
          field: "crops",
          hidden: hidefrcol,
          render: (rowData) => {
                 
            return (
              <div>
                {rowData.crops ? rowData.crops.join(", ") : "NA"}
             
              </div>
            );
  
          },

        },

      ];
     
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: "#4caf50",
        },
        secondary: {
          main: "rgb(0, 123, 255)",
        },
      },
    });
    
    return (
      <div className="wrap">
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
                <FontAwesomeIcon icon={faCaretRight}

                 className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"/>


                    <a href="#"

                className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"

              onClick={() => this.navigateToPage("farmerlist")}>
              {/* will navigate to the parent i.e Farmer page . */}

                  Farmers

                     </a>

            
            </div>
        <div className="message-form">
          <Form>
            <div>
              <p className="requiredfields">{this.state.errorMsg}</p>
              <select
                name="inputtypefilter"
                onChange={this.handleUsersList}
                className="Farmers-message-inputbox" value={this.state.usercategory}
              > 
                <option value="farmers">Farmers</option>
                <option value="field_representatives">Field Representatives</option>
              </select>
            </div>
            <div className="message-radio" onChange={this.handleChange}
            value={this.state.schedule}>
            
              <label>
                <input
                  type="radio"
                  id="message"
                  name="sendType"
                  value="now"
                  checked={this.state.is_schedule == 0}
                />
                Send Message Now
              </label>

              <label>
                <input
                  type="radio"
                  id="schedule"
                  name="sendType"
                  value="schedule"
                  checked={this.state.is_schedule == 1}
                />
                Schedule the Message Later
              </label>
            </div>
            {this.state.isLogg == true ? (
              <div className="dateTime">
                <input type="datetime-local" value={this.state.scheduledate} onChange={this.handleScheduleDate} />
              </div>
            ) : null}
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Send Message</Form.Label>
              <Form.Control as="textarea" className={this.state.customMsgClass} placeholder="Write Text" value={this.state.custommessage} onChange={this.handleCustomMessage} />
            </Form.Group>
            <p className="requiredfields">{this.state.customMsgError}</p>
            <Form.Group>
              <Button onClick={this.createInput} className="farmer-message-button">Submit</Button>
            </Form.Group>
          </Form>
        </div>
        <Container>
          <Row>
            <Col lg="12" md="12" className="padTop10">
              
              <MuiThemeProvider theme={theme}>
              {showloader == true ? (
                    <div className="mainCropsFarmerLoaderWrap">
                    <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                  </div>
                    
                  ) : (
                <MaterialTable
                  icons={tableIcons}
                  // title=""
                  title="Farmer List"
                  // onSelectionChange={
                  //   title="No oF "
                  // }
                  columns={columns}
              
                  data={usersdata}
                  options={{
                    // actionsColumnIndex: -1,
                    doubleHorizontalScroll: true,
                    selection: true,
                    selectionProps: rowData => 
                    // console.log(rowData.farmer_nonaccessibility === true|rowData.farmer_nonaccessibility === 'null')
                    (
                      {
                      disabled: rowData.farmer_nonaccessibility == true|rowData.farmer_nonaccessibility == 'null',
                      color: 'primary'
                    }),
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50, 100],

                    headerStyle: {
                      backgroundColor: "#A3C614",
                      color: "#fff",
                      fontSize: "1rem",
                      fontFamily: "barlow_reg",
                      fontWeight: "bold",
                    },

                    rowStyle: {
                      backgroundColor: "#f1f1f1",
                      borderBottom: "2px solid #e2e2e2",
                      fontSize: "0.9rem",
                    },
                  }}
                  onSelectionChange={(rows) => 
                    this.handleSelectedData(rows)
                    // this.handleSelectedData(rows.filter(function (farmer) {return (farmer.farmer_nonaccessibility==false)}))
                }
                />)}
               
                  <a href="javascript:void(0);" onClick={this.smsHistoryTable}>
                  <button className="farmer-message-button btn btn-primary">Message History</button></a>
                
                {showSmsHistory ? (
                <MaterialTable
                  icons={tableIcons}
                  // title=""
                  title="Farmer List"
                 
                  columns={[
                    {
                      title: "Recipients",
                      field: "sel_type",
                    },
                    {
                      title: "Message",
                      field: "message",
                      render: rowData => (<a href="javascript:void(0);" 
                      onClick={e => this.handleShowMessage(rowData.message)}>{rowData.message.length > 10 ? rowData.message.substr(0, 10 - 1) + "..." : rowData.message}</a>),
                    },
                    {
                      title: "Schedule Time",
                      field: "schedule_time",
                      render: rowData =>{
                        return moment(rowData.schedule_time).format('YYYY-MM-DD HH:mm');
                        ;
                      }
                    },
                    {
                      title: "Message Triggered",
                      field: "is_immediate",
                      render: rowData => {
                        return <p>{(rowData.is_immediate ? "Immediate" : "Scheduled")}</p>
                        
                    },
                    },
                    {
                      title: "Recipient List",
                      field: "recipients",
                      render: rowData => (<button href="javascript:void(0);" class="btn btn-success" 
                      onClick={e => this.handleShowRecieverList(rowData.recipients)}>View</button>),
                    },
                  ]}
              
                  data={messagedata}
                  options={{
                    // actionsColumnIndex: -1,
                    doubleHorizontalScroll: true,
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50, 100],

                    headerStyle: {
                      backgroundColor: "#A3C614",
                      color: "#fff",
                      fontSize: "1rem",
                      fontFamily: "barlow_reg",
                      fontWeight: "bold",
                    },

                    rowStyle: {
                      backgroundColor: "#f1f1f1",
                      borderBottom: "2px solid #e2e2e2",
                      fontSize: "0.9rem",
                    },
                  }}
                  
                />) : ("")}
              </MuiThemeProvider>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default message;
