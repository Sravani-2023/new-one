import React, { Component } from "react";
import "../assets/css/header.css";
import { TriggerAlert, AlertMessage } from "./dryfunctions";
import UserService from "../services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import FarmerNotifcImg from "../assets/img/FarmersNotifcsn.jpg";
import InputNotifcsn from "../assets/img/InputNotifcsn.jpg";
import CommodityNotifcsn from "../assets/img/CommodityNotifcsn.jpg";
import ReminderImg from "../assets/img/Reminder.jpg";
import NewUpdateImg from "../assets/img/Newupdate.png";
import SpecServiceImg from "../assets/img/special_service.jpg";

class webnotification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      farmersCount: [],
      commodityCount: [],
      inputOrdersCount: [],
      newUpdateCount: [],
      remindersCount: [],
      specialservicesCount: [],
      categoryList: [],
    };
  }

  navigateToPage = (pageName) => {
    localStorage.removeItem("activeCardId");

    this.props.history.push("/" + pageName + "");
  };

  navigateMainBoard = () => {
    this.props.history.push("/dashboard");
  };

  componentDidMount() {
    var flag = false;
    UserService.getAllCategoryCount().then(
      (response) => {
        this.setState({
          showloader: false,
          categoryList: response.data.category_list,
          farmersCount: response.data.data.result.farmers,
          commodityCount: response.data.data.result.commodity_sell_orders,
          inputOrdersCount: response.data.data.result.input_orders,
          newUpdateCount: response.data.data.result.new_update,
          remindersCount: response.data.data.result.reminders,
          specialservicesCount: response.data.data.result.special_services,
        });
        console.log(response.data.category_list);
      },
      (error) => {
        this.setState({
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
        }
      }, 300000)
    );
  }

  render() {
    const {
      farmersCount,
      commodityCount,
      inputOrdersCount,
      newUpdateCount,
      remindersCount,
      specialservicesCount,
      categoryList,
    } = this.state;

    return (
      <div className="wrap">
        <div className="breadcrumb pageBreadCrumbHolder">
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
        </div>
        <section className="mainWebContentSection">
          <div className="container">
            <div className="width-90 margin-auto">
              <div className="row">
                <div className="col-lg-4">
                  <div
                    className="card mb-4 dashboard"
                    onClick={() =>this.navigateToPage("farmerNotification?category=farmers")}>
                    <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                      Farmer Update
                    </div>
                    <div className="cardbody">
                      <img
                        src={FarmerNotifcImg}
                        className="card main-icon dashBoardIcon"
                        alt="farmerNotifcImg"
                        // style={{height:"150px",width:"450px",objectFit:"contain"}}
                      />
                    </div>
                    <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                      ( {farmersCount} )
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div
                    className="card mb-4 dashboard"
                    onClick={() =>
                      this.navigateToPage("farmerNotification?category=input_orders")}>
                    <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                      Input Orders
                    </div>
                    <div className="cardbody">
                      <img
                        src={InputNotifcsn}
                        className="card main-icon dashBoardIcon"
                        alt="InputNotifcImg"
                        // style={{height:"100%",width:"100%",objectFit:"contain"}}
                      />
                    </div>
                    <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                      ( {inputOrdersCount} )
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div
                    className="card mb-4 dashboard"
                    onClick={() =>this.navigateToPage("farmerNotification?category=commodity_sell_orders")}>
                    <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                      Commodity Orders
                    </div>
                    <div className="cardbody">
                      <img
                        src={CommodityNotifcsn}
                        className="card main-icon dashBoardIcon"
                        alt="CommodityNotifcImg"
                        // style={{height:"100%",width:"95%",objectFit:"contain"}}
                      />
                    </div>
                    <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                      ( {commodityCount} )
                    </div>
                  </div>
                </div>
              </div>
              <div className="width-100">
                <div className="row margin-left-1500">
                  <div className="col-lg-4">
                    <div
                      className="card mb-4 dashboard"
                      onClick={() => this.navigateToPage("Reminder")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                        Reminder
                      </div>
                      <div className="cardbody">
                        <img
                          src={ReminderImg}
                          className="card main-icon dashBoardIcon"
                          alt="ReminderImg"
                          // style={{height:"100%",width:"77%",objectFit:"contain"}}
                        />
                      </div>
                      <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                        ( {remindersCount} )
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div
                      className="card mb-4 dashboard"
                      onClick={() =>this.navigateToPage("farmerNotification?category=new_update")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                        New Updates
                      </div>
                      <div className="cardbody">
                        <img
                          src={NewUpdateImg}
                          className="card main-icon dashBoardIcon"
                          alt="NewUpdateImg"
                          // style={{height:"100%",width:"100%",objectFit:"contain"}}
                        />
                      </div>
                      <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                        ( {newUpdateCount} )
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div
                      className="card mb-4 dashboard"
                      onClick={() =>this.navigateToPage("farmerNotification?category=special_services")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                        Special Services
                      </div>
                      <div className="cardbody">
                        <img src={SpecServiceImg}
                            className="card main-icon dashBoardIcon"
                            alt="SpecialServiceImg"
                            // style={{height:"100%",width:"100%",objectFit:"contain"}}
                            	/>
                      </div>
                      <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                        ( {specialservicesCount} )
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default webnotification;
