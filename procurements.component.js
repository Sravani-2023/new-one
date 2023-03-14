import React, { Component } from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import "../assets/css/landholding.css";
import UserService from "../services/user.service";
import MaterialTable from "material-table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import tableIcons from "./icons";
import NestedTable from "./nestedTable.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faMapMarker,
  faMapMarkerAlt,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

var mainCardObj = {
  total_sites: 0,
  total_area: 0,
  own_sites: 0,
  leased_sites: 0,
  irrigated_sites: 0,
  rainfed_sites: 0,
};
export default class ProcurementList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      landData: {},
      activeCardId: "registered",
      isLandHoldingLoading: false,
      isLandHoldingTabLoading: false,
      content: "",
    };
  }
  toggleClass() {
    const currentState = this.state.isActive;
    // console.log(this.state.isActive);
    this.setState({ isActive: !currentState });
  }
  handleClick(getSelection) {
    //this.toggleClass();
    //console.log("triggered");
    //console.log(getSelection);
    /* var btns = document.getElementsByclassName("landHoldingMainCards");
        for (var i = 0; i < btns.length; i++) {
            console.log(btns.length);
            
            var current = document.getElementsByclassName("active");
            console.log(current.length,"___",this.className);
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        } */
  }
  clickMenu(cardId) {
    this.setState(
      {
        isLandHoldingTabLoading: true,
        activeCardId: cardId,
      },
      this.forwardToFetchingData(cardId)
    );
  }
  forwardToFetchingData(getSelection) {
    UserService.getLandholding(getSelection).then(
      (response) => {
        this.setState({
          landData: response.data.data,
          isLandHoldingTabLoading: false,
        });
      },
      (error) => {
        this.setState({
          isLandHoldingTabLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }
  getCardData(getSelection) {
    UserService.getLandholding(getSelection).then(
      (response) => {
        // console.log("only card render call ", response.data.data);
        mainCardObj = {
          total_sites: response.data.data.total_sites,
          total_area: response.data.data.total_area,
          own_sites: response.data.data.own_sites,
          leased_sites: response.data.data.leased_sites,
          irrigated_sites: response.data.data.irrigated_sites,
          rainfed_sites: response.data.data.rainfed_sites,
          registered_sites: response.data.data.registered_sites,
          unreg_sites: response.data.data.unreg_sites,
        };
        this.setState({
          isLandHoldingLoading: false,
        });
      },
      (error) => {
        this.setState({
          isLandHoldingLoading: false,
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }
  /*   populateMainCards(getSelection){
        return(
            
        );

    } */

  render() {
    const { landData } = this.state;
    // console.log(landData);
    // console.log(this.state.activeCardId);
    //if(landData.farmers){
    const nestedColumns = [
      /* { title: "Site Id", field: "id"}, */
      { title: "Site Name", field: "siteName" },
      {
        title: "Crop Details",
        field: "crop.crop__crop_name",
        field: "crop.variety",
        render: (rowData) => {
          return (
            <div className="wrap" title="Crop Name">
              <Row className="noPadding border-bottom">
                <Col
                  lg="2"
                  md="2"
                  sm="2"
                  className="noPadding"
                  title="Crop Name"
                >
                  <i className="siteDetailIcons CropIcon" title="Crop Name"></i>
                </Col>
                <Col
                  lg="10"
                  md="10"
                  sm="10"
                  className=""
                  title="Crop Name"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.crop.crop__crop_name}
                </Col>
              </Row>
              <Row className="noPadding" title="Crop Variety">
                <Col
                  lg="2"
                  md="2"
                  sm="2"
                  className="noPadding"
                  title="Crop Variety"
                >
                  <i
                    className="siteDetailIcons CropVarietyIcon"
                    title="Crop Variety"
                  ></i>
                </Col>
                <Col
                  lg="10"
                  md="10"
                  sm="10"
                  className=""
                  title="Crop Variety"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.crop.variety}
                </Col>
              </Row>
            </div>
          );
        },
        cellStyle: {
          width: "25%",
        },
      },
      {
        title: "Site Information",
        field: "siteArea",
        field: "land_watertype",
        render: (rowData) => {
          return (
            <div className="wrap">
              <Row className="noPadding border-bottom" title="Site Area">
                <Col lg="2" ClassName="noPadding">
                  <i
                    className="siteDetailIcons SiteAreaIcon"
                    title="Site Area"
                  ></i>
                </Col>
                <Col
                  lg="6"
                  ClassName="noPadding"
                  title="Site Area"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.siteArea}
                </Col>
              </Row>
              <Row className="noPadding" title="Land Water Type">
                <Col lg="2" ClassName="noPadding" title="Land Water Type">
                  <i className="siteDetailIcons LandWaterTypeIcon"></i>
                </Col>
                <Col
                  lg="6"
                  ClassName="noPadding"
                  title="Land Water Type"
                  style={{ padding: "8px 0px 0px 5px" }}
                >
                  {rowData.land_watertype}
                </Col>
              </Row>
            </div>
          );
        },
      },
    ];
    return (
      <div className="wrap">
        {this.state.isLandHoldingLoading ? (
          <div className="wrap landHoldingPageLoaderWrap">
            <span className="spinner-border spinner-border landHoldingPageLoader"></span>
          </div>
        ) : (
          <div className="wrap">
            <div className="wrap LandHoldingMainCardsWrap">
              <Row>
                <Col md="2">
                  <div
                    id="registered"
                    onClick={this.clickMenu.bind(this, "registered")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "registered" ? "active" : ""
                    }`}
                  >
                    <span className="landHoldingMainCardsIcon sitesInfoIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.total_sites} ({mainCardObj.registered_sites}/
                      {mainCardObj.unreg_sites})
                    </span>
                    <span className="count-name">Sites Information</span>
                  </div>
                </Col>
                <Col md="2">
                  <div
                    id="total_area"
                    onClick={this.clickMenu.bind(this, "total_area")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "total_area" ? "active" : ""
                    }`}
                  >
                    <span className="landHoldingMainCardsIcon SiteAreaIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.total_area}
                    </span>
                    <span className="count-name">
                      (in Acres)
                      <br />
                      Total Area
                    </span>
                  </div>
                </Col>
                <Col md="2">
                  <div
                    id="own"
                    onClick={this.clickMenu.bind(this, "own")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "own" ? "active" : ""
                    }`}
                  >
                    <span className="landHoldingMainCardsIcon CompanyIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.own_sites}
                    </span>
                    <span className="count-name">
                      (in Acres)
                      <br />
                      Owned
                    </span>
                  </div>
                </Col>
                <Col md="2">
                  <div
                    id="farmers"
                    onClick={this.clickMenu.bind(this, "farmers")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "farmers" ? "active" : ""
                    }`}
                  >
                    <span className="FarmerOwnedIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.leased_sites}
                    </span>
                    <span className="count-name">
                      (in Acres)
                      <br />
                      Leased
                    </span>
                  </div>
                </Col>
                <Col md="2">
                  <div
                    id="irrigated"
                    onClick={this.clickMenu.bind(this, "irrigated")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "irrigated" ? "active" : ""
                    }`}
                  >
                    <span className="landHoldingMainCardsIcon IrrigIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.irrigated_sites}
                    </span>
                    <span className="count-name">
                      (in Acres)
                      <br />
                      Irrigated Land
                    </span>
                  </div>
                </Col>
                <Col md="2">
                  <div
                    id="rainfed"
                    onClick={this.clickMenu.bind(this, "rainfed")}
                    className={`card-counter landHoldingMainCards ${
                      this.state.activeCardId === "rainfed" ? "active" : ""
                    }`}
                  >
                    <span className="RainFedIcon"></span>
                    <span className="count-numbers dvaraBrownText">
                      {mainCardObj.rainfed_sites}
                    </span>
                    <span className="count-name">
                      (in Acres)
                      <br />
                      Rainfed Land
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="landholdingHeader wrap">
              {this.state.isLandHoldingTabLoading ? (
                <div className="wrap landHoldingPageLoaderWrap">
                  <span className="spinner-border spinner-border landHoldingPageTabLoader"></span>
                </div>
              ) : (
                <Row>
                  <Col lg="12" md="12" className="landHoldingMainTab padTop10">
                    <div className="EmptySpacerContent wrap"></div>
                    <div className="LandHoldingHeading PageHeading padding15">
                      <h4 className="farmerListHeading dvaraBrownText">
                        Landholding
                      </h4>
                    </div>
                    <MaterialTable
                      icons={tableIcons}
                      title=""
                      columns={[
                        /* { title: "Farmer Id", field: "id" }, */
                        {
                          title: "Farmer Name",
                          field: "first_name",
                          field: "last_name",
                          render: (rowData) =>
                            rowData.first_name + " " + rowData.last_name,
                        },
                        { title: "FR Name", field: "fr_name" },
                        {
                          title: "Location Details",
                          field: "village",
                          field: "phone",
                          render: (rowData) => {
                            return (
                              <div className="wrap noPadding">
                                <Row className="noPadding">
                                  <Col
                                    lg="1"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <FontAwesomeIcon
                                      icon={faMapMarkerAlt}
                                      className="dvaraGreenText"
                                      title="Location"
                                    ></FontAwesomeIcon>
                                  </Col>
                                  <Col
                                    lg="10"
                                    md="10"
                                    sm="10"
                                    className="noPadding"
                                  >
                                    {rowData.village}
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="1"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <FontAwesomeIcon
                                      icon={faMobileAlt}
                                      className="dvaraGreenText"
                                      title="Mobile Number"
                                    ></FontAwesomeIcon>
                                  </Col>
                                  <Col
                                    lg="10"
                                    md="10"
                                    sm="10"
                                    className="noPadding"
                                  >
                                    {rowData.phone}
                                  </Col>
                                </Row>
                              </div>
                            );
                          },
                          cellStyle: {
                            width: "25%",
                          },
                        },
                        {
                          title: "Site Information",
                          field: "siteArea",
                          field: "land_watertype",
                          render: (rowData) => {
                            return (
                              <div className="wrap">
                                <Row
                                  className="noPadding border-bottom"
                                  title="Site Area"
                                >
                                  <Col lg="2" className="noPadding">
                                    <i
                                      className="siteDetailIcons SiteAreaIcon"
                                      title="Site Area"
                                    ></i>
                                  </Col>
                                  <Col
                                    lg="6"
                                    className="noPadding"
                                    title="Site Area"
                                    style={{ padding: "8px 0px 0px 5px" }}
                                  >
                                    {rowData.siteArea}
                                  </Col>
                                </Row>
                                <Row
                                  className="noPadding"
                                  title="Land Water Type"
                                >
                                  <Col
                                    lg="2"
                                    className="noPadding"
                                    title="Land Water Type"
                                  >
                                    <i className="siteDetailIcons LandWaterTypeIcon"></i>
                                  </Col>
                                  <Col
                                    lg="6"
                                    className="noPadding"
                                    title="Land Water Type"
                                    style={{ padding: "8px 0px 0px 5px" }}
                                  >
                                    {rowData.land_watertype}
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="12"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    <ProgressBar
                                      className="farmersRegSiteBar noPadding"
                                      animated
                                    >
                                      <ProgressBar
                                        className="farmerRegSiteBarStatus"
                                        max={rowData.total_sites}
                                        now={rowData.registered_sites}
                                        key={rowData.id}
                                      />
                                    </ProgressBar>
                                  </Col>
                                </Row>
                                <Row className="noPadding">
                                  <Col
                                    lg="12"
                                    md="12"
                                    sm="12"
                                    className="noPadding"
                                  >
                                    Registered Sites:&nbsp;
                                    <span className="darkGreenText">
                                      <b>{rowData.registered_sites}</b>
                                    </span>
                                    &nbsp;/&nbsp;
                                    <span className="dvaraBrownText">
                                      {rowData.total_sites}
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            );
                          },
                        },
                        /* { title: "Total Sites", field: "total_sites" },
                                        { title: "Registered Sites", field: "registered_sites" },
                                        { title: "Total Area", field: "total_area" }, */
                      ]}
                      data={landData.farmers}
                      // other props
                      detailPanel={[
                        {
                          tooltip: "Show Sites",
                          render: (rowData) => {
                            return (
                              <div className="wrap">
                                <div className="verticalSpacer10"></div>
                                <div className="landHoldingSiteListWrap">
                                  <NestedTable
                                    columns={nestedColumns}
                                    data={rowData.sites}
                                  />
                                </div>
                                <div className="verticalSpacer20"></div>
                              </div>
                            );
                          },
                        },
                      ]}
                      onRowClick={(event, rowData, togglePanel) => {
                        togglePanel();
                      }}
                      options={{
                        doubleHorizontalScroll: true,
                        /* headerStyle: {
                                            backgroundColor: '#A3C614',
                                            color: '#efefef',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#e5e5e5',
                                            borderBottom: '2px solid #fff',
                                            fontSize: '0.9rem'
                                        }, */
                        /*  headerStyle: {
                                            backgroundColor: '#A3C614',
                                            color: '#efefef',
                                            fontSize: '1.2rem',
                                            fontFamily: 'barlow_reg',
                                            fontWeight: 'bold',
                                            padding: '10px'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#e5e5e5',
                                            borderBottom: '2px solid #fff',
                                            fontSize: '0.9rem',
                                            padding: '0px'
                                        }, */
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
                        filtering: false,
                        pageSize: 10,
                      }}
                    />
                  </Col>
                </Row>
              )}
            </div>
            <div className="verticalSpacer20 wrap"></div>
          </div>
        )}
      </div>
    );
    //}else{
    //    return (<div className="wrap">
    //     {this.state.isLandHoldingLoading ? (
    //        <div className="wrap landHoldingPageLoaderWrap">
    //            <span className="spinner-border spinner-border landHoldingPageLoader"></span>
    //        </div>
    //        ) : (<div></div>)}</div>);
    //}
  }

  componentDidMount() {
    this.setState({ isLandHoldingLoading: true }, () => {
      this.getCardData("registered");
      this.clickMenu("registered");
    });
    //this.populateMainCards("registered"));
  }
}
