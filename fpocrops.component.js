import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthService from "../services/auth.service";

import { faHtml5, faHome } from "@fortawesome/free-solid-svg-icons";
import {

    Row,
    Col,
    Form,
    Modal,
    Container,
    Table,
    Button
} from "react-bootstrap";
import {TriggerAlert,} from './dryfunctions';

function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}
//have used class component . Initially we are defining all the state variables which are used inside the component.

export default class FpoCrop extends Component {
    constructor(props) {
        super(props)
        //binding all the functions used in the component with this.
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        
        this.state = {
            fpocropcounts: [],
            loading: false,
            ranges: [],
            SelDate: "all",
            SelSeason: "all",
            showloader:true,
            modalIsOpen: false,
            selectedCropNames : [],
            selectedFpo: "",
           

           
        };
    }
                //this function will navigate to Organization Dahboard.

    navigateToPage2= (pageName) => {
       
      this.props.history.push("/" + pageName + "");
    };
    //on selecting a data Under Date option this function is called . Here we are choosing the date . and according to the value choosed we are making 
    // ApI call .This is a get API call.
    handleDateChange = (e) => {
        this.setState(
          {
            SelDate: e.target.value,
            fpocropcounts: [],
            showloader: true
          }
          );
          this.fetchCropsCount(e.target.value, this.state.SelSeason)
    }
     //on selecting a Season Under Season option this function is called . Here we are choosing the Season and according to the value choosed we are making 
    // ApI call .This is a get API call.
    handleSeasonChange = (e) => {
        this.setState(
          {
            SelSeason: e.target.value,
            fpocropcounts: [],
            showloader: true
          }
        )
        this.fetchCropsCount(this.state.SelDate, e.target.value)
    }
  //In fetchCropsCount function we are making a API call . Here filters are handled by backend only . Initailly on loading the page by default we are choosing
  // all as a option in Date and Season . Later on changing it we are making a API call and displaying error also in frontend.
    fetchCropsCount = (range, season) => {
      
        var flag = false;
        UserService.getFpoCropsCount(range, season).then(
            (response) => {
                flag = true;
                // console.log("fpocrops::  ", response)
                if (response.data.success) {
                    this.setState({
                        fpocropcounts: response.data.fpo_crops_data,
                        ranges: response.data.date_ranges_list,
                        showloader:false,

                    });
                }
                else {
                    this.setState({showloader:false,})
                    if (response){
                        TriggerAlert("Error",response.data.message,"error");
                      }
                      else {
                        TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
                      }
                }
            },
            (error) => {
                flag = true;
                this.setState({
                    showloader:false,
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
                this.props.history.push('/fpohomeData')             
                }
            }, 30000)
        );
    }
     // on clicking on FPO Name in pivot table this function is trigerred . Here we are storing the fpoName and fpoId in localStorage
     //then with that fpoName we are navigating to different component and changing the URL also.
    navigateToPage= (pageName,fpoId,fpoName) => {
      localStorage.setItem("fpoId", JSON.stringify(fpoId));
      localStorage.setItem("fpoName", fpoName);

      this.props.history.push("/crops/" + fpoName);
    };
  
    //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are calling fetchCropsCount function.
    componentDidMount() {
      // if(!localStorage.getItem('user')){
      //   this.props.history.push('/')
      //   return
      // }
      const user = AuthService.getCurrentUser();
      if(!user){
        this.props.history.push('/')
        return
      }
      if(!user.is_parent)
        this.props.history.push("/dashboard")
       
        this.fetchCropsCount('all', 'all')
    }
    //here in dropdown under Date we  are appending all the date ranges received after making an Api Call.
    createRangeOptions = (ranges) =>
        
        ranges.length
        ? ranges.map((data, i) => 
        (
            <option key={i} name={data} value={data}>
            {data}
            </option>
        ))
        : "";
    //this function is showing all the crops in table on click on View column in pivot table.
      cropsData = (cropNames) => {
          return cropNames.map((crop, index) => {
              return <tr key={index}>
                  <td style={{"text-align": "left"}}>{index+1}</td>
                  <td className="capitalise" style={{"text-align": "left"}}>{titleCase(crop)}</td>
                 
              </tr>
          })
      }

   //rendering the materialTable.
    render() {

        const { fpocropcounts, SelDate, SelSeason, ranges, showloader, modalIsOpen } = this.state;
     //on click on View option showModal is trigerred .Here we are displaying modal.
       const showModal = (cropNames, fpo_name) =>{
          this.setState({ modalIsOpen: true, selectedCropNames: cropNames, selectedFpo: fpo_name})

        }
       //on click on View option showModal is trigerred . and on click on  Close hideModal is trigerred.

        const hideModal = () => {
          this.setState({
              modalIsOpen: false,
              selectedCropNames: [],
              selectedFpo: ""
          })
      }
        const columns = [

            {
                title: "Fpo Name",
                field: "farmer_fpo__name",
                // width:"55%",
                cellStyle: {
                  minWidth: 350,
                  maxWidth: 350
                },
                render: (rowData) => {
                  let fpoId = rowData.farmer_fpo;
                  let fpoName=rowData.farmer_fpo__name;
                  return (
                    <div
                      onClick={() =>
                        this.navigateToPage("crops",fpoId,fpoName)
                         
                      }
                    >
                      <a href="#!">{rowData.farmer_fpo__name}</a>
                    </div>
                  );
        
                },
                // cellStyle: {
                //     width: "15%"
                // }
            },
            {
                title: "Block",
                field: "fpo_block",
                // cellStyle: {
                //     width: "15%"
                // }
            },
            {
                title: "District",
                field: "fpo_dist",
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "State",
                field: "fpo_state",
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Crops Grown",
                field: "crop_count",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Crop Names",
                field: "crop_names",
                filtering:false,
                render: (rowData) => {
                  const crop_names = rowData.crop_names
                  const fpo_name =  rowData.farmer_fpo__name
                  
                  return (
                    <div
                      onClick={() =>
                        showModal(crop_names, fpo_name)
                      }
                    >
                      <a href="#!">VIEW</a>
                    </div>
                  );
                  
                },
                cellStyle: {
                    width: "15%"
                }
            },
            // {
            //     title: "Season",
            //     // field: "crop_count",
            //     // filtering:false,
            //     lookup: { "Zaid": "Zaid", "Rabi": 'Rabi', "Kharif": 'Kharif' },
            //     cellStyle: {
            //         width: "15%"
            //     }
            // },

        ];
        
            return (
              <section className="mainWebContentSection">
                <Fragment>
                <div  className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap"> 
                  <a
                href="#"
                className="breadcrumb-item pageBreadCrumbItem"
                onClick={() =>this.navigateToPage2("fpohomeData")
                }
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                  style={{ fontSize: "0.7rem" }}
                />
                &nbsp;Dashboard
              </a>
                  
                  
                  </div>
                  <div className="landholdingHeader wrap">
                    <Row>
                      <Col lg="12" md="12" sm="12" className="noPadding">
                        <div className="PageHeading padding15 fpoCropsHeading">
                          <Row>
                            <Col md={4}>
                              <h4
                                className="farmerListHeading dvaraBrownText "
                                style={{ marginLeft: "30px",fontSize:"24px" }}
                              >
                                Organization Crops Data
                              </h4>
                            </Col>

                            <Col className="seasonDropdown" md={6}>
                              <Form>
                                <Row>
                                  <Col>
                                    <Form.Group
                                      as={Row}
                                      className="mb-3"
                                      controlId="formHorizontalUnits"
                                    >
                                      <Form.Label
                                        column="sm"
                                        lg={2}
                                        className="dvaraBrownText"
                                      >
                                        Date:{" "}
                                      </Form.Label>
                                      <Col sm={8}>
                                        <Form.Control
                                          as="select"
                                          size="sm"
                                          value={SelDate}
                                          custom
                                          onChange={this.handleDateChange}
                                        >
                                          <option value="all">All</option>
                                          {this.createRangeOptions(ranges)}
                                        </Form.Control>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group
                                      as={Row}
                                      className="mb-3"
                                      controlId="formHorizontalUnits"
                                    >
                                      <Form.Label
                                        column="sm"
                                        lg={3}
                                        className="dvaraBrownText"
                                      >
                                        Season:{" "}
                                      </Form.Label>
                                      <Col sm={6}>
                                        <Form.Control
                                          as="select"
                                          size="sm"
                                          value={SelSeason}
                                          custom
                                          onChange={this.handleSeasonChange}
                                        >
                                          <option value="all">All</option>
                                          <option value="Zaid">Zaid</option>
                                          <option value="Kharif">Kharif</option>
                                          <option value="Rabi">Rabi</option>
                                        </Form.Control>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Form>
                            </Col>
                          </Row>
                        </div>
                        {showloader ? (
                          <div className="mainCropsFarmerLoaderWrap">
                            <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                          </div>
                        ) : (
                          <MaterialTable
                            icons={tableIcons}
                            title=""
                            style={{ marginLeft: "30px" }}
                            data={fpocropcounts}
                            columns={columns}
                            actions={
                              [
                                // {
                                //     icon: tableIcons.Edit,
                                //     tooltip: 'Edit',
                                //     onClick: (event, rowData) => showModal(true, rowData)
                                // },
                                // rowData => ({
                                //     icon: tableIcons.Delete,
                                //     tooltip: 'Delete',
                                //     isFreeAction: true,
                                //     onClick: (event, rowData) => {if(window.confirm('Are you sure to delete this "'+ rowData.wsp + '" record?'))
                                //                             {this.createWsp(rowData.id)}},
                                //   })
                              ]
                            }
                            options={{
                              maxBodyHeight:500,

                              actionsColumnIndex: -1,
                              doubleHorizontalScroll: true,
                              pageSize: 10,
                              pageSizeOptions: [
                                10,
                                20,
                                50,
                                100,
                                { value: fpocropcounts.length, label: "All" },
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
                        )}
                      </Col>
                    </Row>
                  </div>
                  {/* Modal on click on VIew. */}
                  <Modal show={modalIsOpen}
                                onHide={hideModal}
                                size="md"
                                // aria-labelledby="contained-modal-title-vcenter"
                                // centered /* onEntered={modalLoaded} */
                                className="modal-adjust"
                                // dialogClassName="my-modal"
                            >
                                <Modal.Header>
                                

                                    <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText">{this.state.selectedFpo}</span></Modal.Title>

                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                    <Row align="center">
                                        
                                        <Col>
                                            Date: <strong>{SelDate}</strong>
                                        </Col>
                                        <Col>
                                            Season : <strong>{SelSeason}</strong>
                                        </Col>
                                       

                                    </Row>
                                    </Container>
                                    <br></br>
                                    {(!this.state.selectedCropNames.length) ? (<div align="center">
                                        No crops Found
                                    </div>) : (
                                        <div>
                                            <Table striped bordered size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Crop Name</th>
                                                       
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.cropsData(this.state.selectedCropNames)}
                                                </tbody>
                                            </Table>
                                        </div>)}
                                </Modal.Body>
                                <Modal.Footer>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button onClick={hideModal} className="fa-pull-right defaultButtonElem">Close</Button>
                                    <span className="clearfix"></span>

                                </Modal.Footer>
                            </Modal>


                  <div className="verticalSpacer20"></div>
                </Fragment>
              </section>
            );
        
    }
}