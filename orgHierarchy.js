import React, { Component } from "react";
import UserService from '../services/user.service';
 import { Row, Col } from "react-bootstrap";
export default class organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StorageData: "",
      accounting_ref_id: "",
      accounting_password: "",
      giddhAccessUrl: "",
      responseStatusMsg: "",
      responseStatus: "",
      loading: true,
    };
  }
  componentDidMount() {
    if(!localStorage.getItem('user')){
      this.props.history.push('/')
      return
    }
    const { StorageData, responseStatusMsg, responseStatus } = this.state;

    const information = JSON.parse(localStorage.getItem("user"));
    // console.log("All the Data", information);
    if (localStorage.getItem("user")) {
      this.setState(
        {
          StorageData: information,
          accounting_ref_id: information.accounting_ref_id,
          accounting_password: information.accounting_pwd,
        },
        () => {
          // console.log("avc", this.state.StorageData);
          if (this.state.accounting_ref_id !== "") {
            var accountingBodyData = {
              "uniqueKey": this.state.accounting_ref_id,
              "password":this.state.accounting_password
   
           
              // "password": "pr123456",
              // "uniqueKey": "prachu@Dvara.com"

            };
            UserService.accountingLoginService(accountingBodyData).then(
              (response) => {
                if (response.status == 200) {
                  let userDets = response.data.body.user;
                  if (userDets.isVerified) {
                   
                    let UserSessionID = response.data.body.session.id;
                    localStorage.setItem("giddhtoken",UserSessionID)
                     let giddhPageUrl =
                       "https://app.giddh.com/token-verify?request=" +
                       UserSessionID;
                    this.setState({
                      giddhAccessUrl: giddhPageUrl,
                      loading: false,
                    });
                  }
                  else {
                  
                    this.setState({
                      loading: false,
                      responseStatus: "User Unverified",
                      responseStatusMsg:
                        "User haven't verified their email id yet, kindly verify the email id before accessing the Accounting Services.",
                    });
                  }
                }
                else {
                  this.setState({
                    loading: false,
                    responseStatus: response.status,
                    responseStatusMsg: response.statusText,
                  });

                }
                // console.log("accountingLoginRes", response)
              },

             
              (error) => {
                // console.log("errorrrr", error)
                this.setState({
                  loading: false,
                  responseStatus: "",
                  responseStatusMsg: error.message,
                  content:
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString(),
                });
              });
          }
          else {
            this.setState({
              loading: false,
              responseStatus: "Not Registered",
              responseStatusMsg:
                "You are not registered for the Accounting Services, Kindly contact administrator for more information regarding the same.",
            });
          }
        });
    }
  }

  render() {
    const {
      StorageData,
      accounting_ref_id,
      accounting_password,
      responseStatusMsg,
      responseStatus,
      giddhAccessUrl,
      loading
    } = this.state;
    // console.log("Storage", StorageData);
    return (
     
      <section>
        {this.state.loading ? (
          <span className="spinner-border spinner-border-sm dashboardLoader"></span>
        ) : (
          <div className="wrap">
            <Row>
              <Col lg="12">
             
                {responseStatusMsg !== "" ? (
                  <div className="errorText" style={{textAlign:"center"}}>
                
                    Error in accessing account page,error Information : <br />{" "}
                    {responseStatus} : {responseStatusMsg}
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <iframe
                  id="accountingPageIframe"
                  src={giddhAccessUrl}
                  className="iFrame-Accounting"
                // width="100%"
                // height="700px"
                />
              </Col>
            </Row>
          </div>
        )}
      </section>
    );












  }
}
