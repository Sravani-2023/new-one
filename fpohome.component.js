import React, { Component } from "react";
import AuthService from "../services/auth.service";
import "../assets/css/dashboard.css";
import farmerIcon from "../assets/img/sickle.svg";
import landHoldingIcon from "../assets/img/farm.svg";
import croppingAreaIcon from "../assets/img/field.svg";
import ProductIcon from "../assets/img/product.png";
import Commodity from "../assets/img/commodity.png";
import OrderIcon from "../assets/img/orders.png";
import WarehouseIcon from "../assets/img/warehouse.png";
import AccountIcon from "../assets/img/accountant.png";
import Organizer from "../assets/img/organizer.png";
import {TriggerAlert,} from './dryfunctions'
import UserService from "../services/user.service";
import Financial from "../assets/img/financial.png"


export default class FpoHome extends Component {
  constructor(props) {
    super(props);
    this.navigateToPage = this.navigateToPage.bind(this);
  
    this.state = {
      OrgDetails: "",
      isDataAvaialble: false,
      loading: true,
    };
  }
  navigateToPage = (pageName) => {
  
    this.props.history.push("/" + pageName + "");
  }
  navigateToPageBo = (pageName) => {
    localStorage.removeItem("BoParentfilterItem");
    localStorage.removeItem("BoParentProductAccordion");
    this.props.history.push("/" + pageName + "");
  }


  render() {
    const {
      OrgDetails,
     
    } = this.state;
  
    return (
      <div className="wrap dashBoardWrap">
        {this.state.loading ? (
          <span className="spinner-border spinner-border-sm dashboardLoader"></span>
        ) : (
          <section className="mainWebContentSection">
            
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-lg-12 padding15"></div>
              </div>
              <div className="width-90">
              <div className="row">
                {/* <div className="col-md-2">
              
              </div> */}
              <div className="col-md-12">

             
             
              {/* <div className="width-80 margin-auto"> */}
              <div className="margin-auto">

                <div className="row">
                 <div className="col-lg-1"></div>
                  <div className="col-lg-2">
                    <div className="card mb-4 dashboardCard" onClick={() => this.navigateToPage("fpolist")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        FPOs
                      </div>
                      <div className="card-body">
                        <img
                          src={Organizer}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.fpo_count}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="card mb-4 dashboardCard" onClick={() => this.navigateToPage("fpofarmers")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Farmers
                      </div>
                      <div className="card-body">
                        <img
                          src={farmerIcon}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.farmer_count}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpolandholdings")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Landholding
                      </div>
                      <div className="card-body">
                        <img
                          src={croppingAreaIcon}
                          className="card main-icon dashBoardIcons"
                          alt="totalCroppingArea_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {this.state.isDataAvaialble
                          ? "" +
                          Math.round(OrgDetails.landholding_area) +
                          " Acres"
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpocrops")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Crops
                      </div>
                      <div className="card-body">
                        <img
                          src={landHoldingIcon}
                          className="card main-icon dashBoardIcons"
                          alt="landholding_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {this.state.isDataAvaialble
                          ? "" + Math.round(OrgDetails.crop_area) + " Acres"
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpoinputs")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Inputs
                      </div>
                      <div className="card-body">
                        <img
                          src={ProductIcon}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.input_product_count}
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className="row">
                  <div className='col-lg-1'></div>
                  {/* <div className='col-lg-2'></div> */}
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpoOrders")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight" >
                        Farmer Orders
                      </div>
                      <div className="card-body">
                        <img
                          src={OrderIcon}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.input_order_count}
                        {/* /{this.state.isDataAvaialble
                          ? "" + Math.round(OrgDetails.input_order_total_value)
                          : ""} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpoprocurements")}>
                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Procurements 
                      </div>
                      <div className="card-body">
                        <img
                          src={Commodity}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.proc_order_total_qty}
                        {/* /{this.state.isDataAvaialble
                          ? "" + Math.round(OrgDetails.proc_order_total_value)
                          : ""} */}
                      
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-2">
                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpowsps")}>

                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Warehouses
                      </div>
                      <div className="card-body">
                        <img
                          src={WarehouseIcon}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">
                        {OrgDetails.wsp_count}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">

                    <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPage("fpoFinancials")}>

                      <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                        Financial
                      </div>
                      <div className="card-body">
                        <img
                          src={AccountIcon}
                          className="card main-icon dashBoardIcons"
                          alt="farmers_Icon"
                        />
                      </div>
                      <div className="card-footer fpoCardVals text-center dvaraGreenText">

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">

                   <div className="card mb-3 dashboardCard" onClick={() => this.navigateToPageBo("fpoBo")}>

                   <div className="card-header dashboardCardTitle text-center dvaraBrownText fpofontHeight">
                            BO
                         </div>
                   <div className="card-body">
                 <img
                  src={Financial}
                 className="card main-icon dashBoardIcons"
                    alt="farmers_Icon"
                      />
                    </div>
                  <div className="card-footer fpoCardVals text-center dvaraGreenText">

                    </div>
                   </div>
                   </div>
                  {/* <div className='col-lg-2'></div> */}
                 
                </div>
              </div>
              </div>
              </div>
              </div>
             
            </div>
          </section>
        )}
      </div>
    );
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if(!user){
      this.props.history.push('/')
      return
    }
    if(!user.is_parent)
      this.props.history.push("/dashboard")
    var flag = false;
    UserService.getOrgData().then(
      (response) => {
          flag = true; 
        this.setState({
          OrgDetails: response.data.data,
          isDataAvaialble: true,
          loading: false,
        });
      },
      (error) => {
        flag = true; 
        this.setState({
          loading: false,
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

  }


}
