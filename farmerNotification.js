import React, { Component } from "react";
import "../assets/css/notification.css";
import { TriggerAlert, AlertMessage } from './dryfunctions'
import UserService from "../services/user.service";
// import farmerIcon from "../assets/img/sickle.svg";
import farmerIcon from "../assets/img/farmerFarmgreen.png"
import ProductIcon from "../assets/img/inputgreenIcon.png";
import Commodity from "../assets/img/cmdtgreenIcon.png";
import farmerCmpIcon from "../assets/img/farmerNotfcmp.svg"
import ProductcmpIcon from "../assets/img/inputNotcmp.svg"; 
import CommoditycmpIcon from "../assets/img/CmdtNotcmp.svg";
import Service from "../assets/img/SpecServNotcmp.jpg";
import ServicecmpIcon from "../assets/img/servicecmpicon.jpg";

import Update from "../assets/img/updateGreen.png";

import { Form } from "react-bootstrap";
import moment, { max } from "moment";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faCaretRight
} from "@fortawesome/free-solid-svg-icons";


class farmerNotification extends Component {
  constructor(props) {
    super(props);

    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleAllReadChange = this.handleAllReadChange.bind(this);
    
    this.state = {
      totalCount: [],
      totalUnreadCount: [],
      monthList:[],
      SelDate: "all",
      month : "",
      farmersdata:[],
      searchCategory:"",
      componentHeader : "",
      HeaderIcon: ""
    }
  }
  navigateToPage = (pageName) => {  
    const {isParentLogged} = this.state    
    if(isParentLogged){
          if(pageName === "dashboard"){
            this.props.history.push("/" + pageName + "");
          }          
    }else{
          this.props.history.push("/" + pageName + "");           
    }
  };

  sendNotificationLink=(link)=>{
    console.log("showlink",link)
      this.props.history.push(`/${link}`)
      window.location.reload();
      }

  handleAllReadChange = (e) => { 
    let queryParam= this.props.location.search;
    let SplitqueryParam= queryParam.split("=");
    let SplitqueryParamTabValue= SplitqueryParam[1];
    UserService.MarkAsAllRead(SplitqueryParamTabValue).then(
      response => {
        Swal.fire({icon: 'success',title: 'Success',
        html: '<i style="color:red" class="fa fa-close"></i> <small>'+response.data.result.message+"</small>",
        showConfirmButton: false,timer: 5000,showCloseButton: true,})   
     },
    ) 
    window.location.reload();
  }; 

  handleMonthChange = (e) => {
    const data = new FormData();
    data.append("month",e.target.value)
    let queryParam= this.props.location.search;
    let SplitqueryParam= queryParam.split("=");
    let SplitqueryParamTabValue= SplitqueryParam[1];
    UserService.getFarmerNotificationList(data, SplitqueryParamTabValue).then(
      response => {
        this.setState({
          showloader: false,
          farmersdata:response.data.data.result,
          totalCount: response.data.data.total_count,
          totalUnreadCount: response.data.data.total_unread_count,
        });   
     },
    );
    this.setState(
      {
        Selmonth: e.target.value,
        showloader: true,
      }
      );     
  }

  ReadStatus = (id) => {
    var flag = false;
    UserService.getChangeReadStatus(id).then(     
      response => {
      this.setState({
        id : response.data.result.id,
        isRead : true,
        bgColor: "rgb(229, 231, 233 )"
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

  componentDidMount() {
    const data = new FormData();
    const d = new Date();
    let month = (d.getMonth()+1).toString();
    data.append("month", month);
    let queryParam= this.props.location.search;
    let SplitqueryParam= queryParam.split("=");
    let SplitqueryParamTabValue= SplitqueryParam[1];
     
    
    if (SplitqueryParamTabValue === "farmers"){
      this.setState({
        componentHeader: "Farmer Update Notification",
        HeaderIcon: farmerIcon
      })
    }
    else if(SplitqueryParamTabValue === "input_orders"){
      this.setState({
        componentHeader: "Input Order Notification",
        HeaderIcon: ProductIcon
      })
    }

    else if(SplitqueryParamTabValue === "commodity_sell_orders"){
      this.setState({
        componentHeader: "Commodity Order Notification",
        HeaderIcon: Commodity
      })
    }
    else if(SplitqueryParamTabValue === "new_update"){
      this.setState({
        componentHeader: "New Updates",
        HeaderIcon: Update
      })
    }
    else if(SplitqueryParamTabValue === "special_services"){
      this.setState({
        componentHeader: "Special Services",
        HeaderIcon: Service
      })
    }

    UserService.getFarmerNotificationList(data, SplitqueryParamTabValue).then(
      response => {
        this.setState({
          showloader: false,
          farmersdata:response.data.data.result,
          totalCount: response.data.data.total_count,
          totalUnreadCount: response.data.data.total_unread_count,
          isRead:true,
          bgColor:"rgb(229, 231, 233 )",
          searchCategory: SplitqueryParamTabValue,

        });   
     },
    );
    UserService.getAllMonths().then(
      response => {        
        this.setState({
          monthList:response.data.data
        })
        console.log(this.state.monthList)
      }
    )
  }
 
  render() {
    const {
      totalUnreadCount,
      totalCount,SelDate,
      searchCategory
    } = this.state
    console.log(searchCategory)
    const NotificationData = (searchCategory) =>{
      console.log('searchCategory', searchCategory.category)
      
      if(searchCategory.category === "farmers"){
        return <div>
        {this.state.farmersdata.map((item , key) => ( 
                          <div index={key}
                          className="notifications" 
                          style={{background :(item.is_read === true && item.id === item.id) && this.state.bgColor}}
                          onClick={()=>this.ReadStatus(item.id)} >
                          <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"65px",width:"80px",background:"rgb(229, 231, 233 )"}} src={farmerCmpIcon} />
                          {item.title}
                          <span className="date-time">{moment(item.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                          <div className="notifiaction-message"><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(item.redirect_url)}>{item.message}</a></div>
                          </div>   
        ))}   
    </div>
      }
      else if(searchCategory.category === "input_orders"){
        return <div>
        {this.state.farmersdata.map((item , key) => ( 
                          <div index={key}
                          className="notifications" 
                          style={{background :(item.is_read === true && item.id === item.id) && this.state.bgColor}}
                          onClick={()=>this.ReadStatus(item.id)} >
                          <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"65px",width:"80px",background:"rgb(229, 231, 233 )"}} src={ProductcmpIcon} />
                          {item.title}
                          <span className="date-time">{moment(item.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                          <div className="notifiaction-message"><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(item.redirect_url)}>{item.message}</a></div>
                          </div>   
        ))}    
    </div>
      }
      else if(searchCategory.category ==="commodity_sell_orders"){
        return <div>
        {this.state.farmersdata.map((item , key) => ( 
                          <div index={key}
                          className="notifications" 
                          style={{background :(item.is_read === true && item.id === item.id) && this.state.bgColor}}
                          onClick={()=>this.ReadStatus(item.id)} >
                          <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"65px",width:"80px",background:"rgb(229, 231, 233 )"}} src={CommoditycmpIcon} />
                          {item.title}
                          <span className="date-time">{moment(item.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                          <div className="notifiaction-message"><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(item.redirect_url)}>{item.message}</a></div>
                          </div>   
        ))}  
    </div>
      }
      else if(searchCategory.category === "special_services"){
        return <div>
        {this.state.farmersdata.map((item , key) => ( 
                          <div index={key}
                          className="notifications" 
                          style={{background :(item.is_read === true && item.id === item.id) && this.state.bgColor}}
                          onClick={()=>this.ReadStatus(item.id)} >
                          <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"65px",width:"80px",background:"rgb(162 , 198 , 23)"}} src={ServicecmpIcon} />
                          {item.title}
                          <span className="date-time">{moment(item.created_at).format("DD/MM/YYYY , h:mm a")}</span>
                          <div className="notifiaction-message"><a href="#" className="anchor" onClick={()=>this.sendNotificationLink(item.redirect_url)}>{item.message}</a></div>
                          </div>   
        ))}    
    </div>
    }
  }
    const d = new Date();
    let month = (d.getMonth()+1).toString();
    return (
      <div>
        <div className="breadcrumb pageBreadCrumbHolder">
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
              className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
            />
            <a
              href="#"
              className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
              onClick={() => this.navigateToPage("webnotification")}
            >
              Web notification
                    </a>
            </div>
        <div className="notification-box">
        <img className="card main-icon dashBoardIcons" style={{position:"absolute",top:"7px",left:"10px",height:"105px"}} src={this.state.HeaderIcon} />
        {this.state.componentHeader}
          {/* Farmer Update Notifications */}
        <div className="notification-box-mesage">
            Total Count ( {totalCount} ) <br />
            Unread Count ( {totalUnreadCount} ) <br />
        {totalUnreadCount>0 ? <div> Mark all as Read <input type="checkbox" onChange={this.handleAllReadChange}/></div>:''}
            
          
          </div>
          
        </div>
        <div className="dropdown-months">
          <Form.Control
            as="select"
            value={this.state.Selmonth ? (this.state.Selmonth) : (month)}
            onChange={this.handleMonthChange}
            >
            {/* {Object.values(this.state.monthList).map((val,key,ind) => (              
              // console.log("helloooooooo",ind,key, val)
              <option key={ind} name={val} value={val}>
                  {val}
                </option>
                                ))}             */}
            
            <option value="1">January</option>                      
            <option value="2">February</option>                      
            <option value="3">March</option>                      
            <option value="4">April</option>                      
            <option value="5">May</option>                      
            <option value="6">June</option>                      
            <option value="7">July</option>                      
            <option value="8">August</option>                      
            <option value="9">September</option>                      
            <option value="10">October</option>                      
            <option value="11">November</option>                      
            <option value="12">December</option>   
           </Form.Control>
        </div>
        <div>{this.state.farmersdata.length>0?
        <NotificationData category={searchCategory}/> 
        : <div className="No-data" style={{marginLeft:"100px", width:"500px"}}>No Data Available</div>}
        
        
      </div>
  
</div>
  
)

        }
      }

export default farmerNotification