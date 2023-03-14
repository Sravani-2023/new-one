import React, { Component } from "react";
import UserService from "../services/user.service";
import { TriggerAlert, AlertMessage } from "./dryfunctions";
import { Accordion, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import reminderIcon from "../assets/img/reminderGreen.png";
import ReminderImg from "../assets/img/Reminder.jpg";
// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css'; // theme css file
// import { DateRangePicker } from 'react-date-range';
// import { addDays } from 'date-fns';
import { DateRangePicker } from "rsuite";
import subDays from "date-fns/subDays";
import "rsuite/dist/rsuite.css";
class Reminder extends Component {
  constructor() {
    super();

    this.state = {
      showHideComp1: false,
      showHideComp2: false,
      Reminderdata: [],
      totalCount: [],
      selectedRange: "",
      selection: {
        startDate: "",
        endDate: "",
        key: "selection",
      },
      startdate: {},
      enddate: {},
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  navigateToPage = (pageName) => {
    const { isParentLogged } = this.state;
    if (isParentLogged) {
      if (pageName === "dashboard") {
        this.props.history.push("/" + pageName + "");
      }
    } else {
      this.props.history.push("/" + pageName + "");
    }
  };
  sendNotificationLink = (link) => {
    console.log("showlink", link);
    this.props.history.push(`/${link}`);
    window.location.reload();
  };
  ReadStatus = (id) => {
    UserService.getChangeReadStatus(id).then((response) => {
      this.setState({
        id: response.data.result.id,
        isRead: true,
        bgColor: "#DCDCDC",
      });
      window.location.reload();
    });
  };

  hideComponent(name) {
    console.log(name);
    switch (name) {
      case "showHideComp1":
        this.setState({
          showHideComp1: !this.state.showHideComp1,
        });
    }
  }

  componentDidMount() {
    var flag = false;
    const data = new FormData();
    data.append("month", 12);
    UserService.getRemindersList(data).then((response) => {
      this.setState({
        showloader: false,
        Reminderdata: response.data.data.result,
        totalCount: response.data.data.total_count,
        isRead: true,
        bgColor: "#DCDCDC",
      });
    });
  }

  handleChange = (range) => {
    console.log(range);
    const startDate = range[0].toISOString().substr(0, 10);
    const endDate = range[1].toISOString().substr(0, 10);
    this.setState({
      selectedRange: range,
      startdate: startDate,
      enddate: endDate,
    });
    console.log(`Start date: ${startDate}`);
    console.log(`End date: ${endDate}`);
  };
  handleSubmit = (startDate, endDate) => {
    var flag = false;
    UserService.getRemindersList(startDate, endDate).then((response) => {
      this.setState({
        startdate: startDate,
        enddate: endDate,
        showloader: false,
        Reminderdata: response.data.data.result,
        totalCount: response.data.data.total_count,
        isRead: true,
        bgColor: "#DCDCDC",
      });
    });
  };

  render() {
    const { showHideComp1, totalCount, selection } = this.state;

    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().substr(0, 10);
    const { allowedRange } = DateRangePicker;

    // const selectionRange = {
    //   startDate: this.state.selection.startDate,
    //   endDate: this.state.selection.endDate,
    //   key: 'selection',
    // }
    const ranges = [
      {
        label: "today",
        value: [new Date(), new Date()],
      },
      {
        label: "yesterday",
        value: [subDays(new Date(), 1), subDays(new Date(), 1)],
      },
    ];

    return (
      <div>
        <div className="breadcrumb pageBreadCrumbHolder">
          <a
            href="#"
            className="breadcrumb-item pageBreadCrumbItem"
            onClick={() => this.navigateToPage("dashboard")}>
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
            onClick={() => this.navigateToPage("webnotification")}>
            Web notification
          </a>
        </div>

        <div
          className="notification-box"
          style={{ height: "95px", width: "350px" }}>
          <img
            className="card main-icon dashBoardIcons"
            style={{
              position: "absolute",
              top: "1px",
              left: "10px",
              height: "85px",
            }}
            src={reminderIcon}
          />
          Reminder
          <div className="notification-box-mesage">
            Total Count ( {totalCount} ) <br />
          </div>
        </div>

        <DateRangePicker
          style={{ marginLeft: "650px", marginTop: "-30px" }}
          onChange={this.handleChange}
          ranges={[]}
          value={this.state.selectedRange}
          disabledDate={allowedRange(`${currentYear}-01-01`, new Date())}
        />
        <Button
          className="defaultButtonElem"
          style={{ marginLeft: "910px", marginTop: "-70px" }}
          onClick={() =>this.handleSubmit(this.state.startdate, this.state.enddate)}>
          Submit
        </Button>

        {Object.keys(this.state.Reminderdata).map((data, index, keys) => {
          return (
            <div className="reminder-date">
              <div className="Accordian-key">
                <Card className="card-inner">
                  <div
                    as={Card.Header}
                    eventKey={data}
                    data-toggle="collapse"
                    data-parent="#accordion"
                    className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                    onClick={() => this.hideComponent("showHideComp1")}
                    style={{ color: "white", fontSize: "25px" }}
                  >
                    Reminders
                  </div>
                  <div
                    eventKey={data}
                    // class="panel-collapse collapse"
                  >
                    <Card.Body style={{ display: "inline-block" }}>
                      {/* {showHideComp1  &&  */}
                      <div>
                        {Object.values(this.state.Reminderdata).map(
                          (item, ind, values) => {
                            return (
                              <div>
                                {item.map((messagedata) => {
                                  return (
                                    <div>
                                      {index === ind ? (
                                        <div
                                          className="notification"
                                          style={{
                                            background:
                                              messagedata.is_read === true &&
                                              messagedata.id ===
                                                messagedata.id &&
                                              this.state.bgColor,
                                          }}
                                          onClick={() =>this.ReadStatus(messagedata.id)}>
                                          {/* <div className="reminder-title-box" > */}
                                          <img
                                            className="card main-icon dashBoardIcons"
                                            style={{
                                              position: "absolute",
                                              top: "7px",
                                              left: "10px",
                                              height: "65px",
                                              width: "80px",
                                              background: "rgb(229, 231, 233 )",
                                            }}
                                            src={ReminderImg}
                                          />
                                          {messagedata.title}
                                          <span className="date-time">
                                            {moment(item.created_at).format(
                                              "DD/MM/YYYY , h:mm a"
                                            )}
                                          </span>
                                          {/* </div> */}
                                          <div className="reminder-message-box">
                                            <a
                                              href="#"
                                              onClick={() =>this.sendNotificationLink(messagedata.redirect_url)}>
                                              {" "}
                                              {messagedata.message}.
                                            </a>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }
                        )}
                      </div>
                      {/* }   */}
                    </Card.Body>
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Reminder;
