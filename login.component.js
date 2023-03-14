import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {

  Row,
  Col,
  
  Button
} from "react-bootstrap";
import CheckButton from "react-validation/build/button";
import '../assets/css/login.css';
import mainLogo from '../assets/img/doordrishti.png';
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome, faEye } from "@fortawesome/free-solid-svg-icons";
import { faEarlybirds } from "@fortawesome/free-brands-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      is_parent_supervisor: true,
      loggedIn: false,
      showEnteredPassword:false,

    };
  }
  componentDidMount(){
    const user = localStorage.getItem('user')
    if(user){
      let userJSON = JSON.parse(user)
      this.setState(
        {
          loggedIn: true,
        },
        () => {
          if(userJSON.is_parent)
            this.props.history.push("/fpohomeData");
          else
            this.props.history.push("/dashboard");
        }
      );
    }
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  showPassword=(e)=> {
    const{showEnteredPassword}=this.state;
    this.setState({
      showEnteredPassword:!showEnteredPassword,
    });
  }

  handleLogin(e) {
    e.preventDefault();
    const { state = {} } = this.props.location;
    const { prevLocation } = state;
    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        (response) => {
          if(response.Error) {
            this.setState({
              loading: false,
              message: response.Error,
              
            });
          }
          else{
            this.setState(
              {
                loggedIn: true,
                is_parent_supervisor: response.is_parent,

              },
              () => {
                if(response.is_parent)
                  this.props.history.push( prevLocation || "/fpohomeData");
                
                else
                  this.props.history.push( prevLocation || "/dashboard");
                  
                
              }
            );
         
          }

        },
        error => {
          // console.log(error)
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
   const{showEnteredPassword}=this.state;
    return (
      <div className="wrap loginBG">
         <div className="container main-block">
        <div className="card card-container card-basic">
        <img id="profile-img" className="profile-img-card" alt="Dvara_Logo" src={mainLogo} />

          <Form 
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                maxlength="10"
                onChange={this.onChangeUsername}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                // type="password"
                type={showEnteredPassword?"text":"password"}
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
              {showEnteredPassword===true?
               <FontAwesomeIcon
               icon={faEye}
               onClick={this.showPassword}
               className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
               style={{ fontSize: "0.9rem" ,float:"right",top:"-25px",position:"relative",right:"10px"}}
             />
          :
          <FontAwesomeIcon
          icon={faEyeSlash}
          onClick={this.showPassword}
          className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
          style={{ fontSize: "0.9rem" ,float:"right",top:"-25px",position:"relative",right:"10px"}}
        />
          }
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
       </div>          
      </div>
    );
  }
}