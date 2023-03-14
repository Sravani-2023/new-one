import React, { Component } from "react";
import "../assets/css/notification.css";
import { TriggerAlert, AlertMessage } from './dryfunctions'
import UserService from "../services/user.service";
import { Form } from "react-bootstrap";
import moment from "moment";


class inputBuyOrderNotification extends Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.state = {
      totalCount: [],
      totalUnreadCount: [],
      monthList:[],
      SelDate: "all",
      month : "",
      inputBuyOrderdata:[]
    }
  }

  handleDateChange = (e) => {
    this.setState(
      {
        Selmonth: e.target.value,
        showloader: true
      }
      );     
  }
  componentDidMount() {
    const data = new FormData();
    data.append("month", 12);
    UserService.getInputBuyOrderNotificationList(data).then(
      response => {
        this.setState({
          showloader: false,
          inputBuyOrderdata:response.data.data.result,
          totalCount: response.data.data.total_count,
          totalUnreadCount: response.data.data.total_unread_count,
        });  
        console.log(response.data.data.result,"haaaaaaaaaaaaaaaaaaa") 
     },
    );
  }
  render() {
    const {
      totalUnreadCount,
      totalCount,SelDate
    } = this.state

    const d = new Date();
    let month = (d.getMonth()+1).toString();
    return (
      <div>
        <div className="notification-box">
          Input Buy Order Notifications
          <div className="notification-box-mesage">
            Total Count ( {totalCount} ) <br />
            Unread Count ( {totalUnreadCount} ) <br />
            Mark all as Read <input type="checkbox" />
          </div>
          <img className="update-image" src="https://t3.ftcdn.net/jpg/02/95/80/92/360_F_295809244_VuvPwJe6PA9LkI678lxNgZQkvyTSq4XB.jpg" />
        </div>
        <div className="dropdown-months">
          <Form.Control
            as="select"
            // size="sm"
            // value={month}
            onChange={e => {
              this.setState({
                Selmonth: e.target.value,
                showloader: true
              });
           }}
            // onChange={this.handleDateChange}
            // value={month}
            // Selmonth
          >
            <option value="1">Janauary</option>                      
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
        {this.state.inputBuyOrderdata.map((item) => ( 
                          <div className="notifications"> <u>{item.title}</u>
                          <span className="date-time">{moment(item.created_at).format("DD/MM/YYYY , HH:mm")}</span>
                          <div className="notifiaction-message">{item.message}</div>
                            </div>   
        ))}    
        
        {/* <div className="unread-notification">
          <u>Compliance</u>
        </div> */}
      </div>
    );
  }
}

export default inputBuyOrderNotification