import React from 'react';

import MaterialTable from 'material-table';
import tableIcons from './icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
//import { Card } from '@material-ui/core';
import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  ProgressBar,
  ProgressBarProps,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
var mapCenterVal = [17.7384734, 93.9823854];
var mapZoomVal = 5;

export default function nestedTable(props) {

  function RenderSiteDetails(getCurrRowID){
   
    function filterNeededId (ArrObj){
      if(ArrObj.id === getCurrRowID.currRowSiteId)
      {
        return (ArrObj);
      }
      else{
        return;
      }
    }

    let currentSiteData = props.data.filter(filterNeededId);
    
    const siteDetailsElements = (
      <Card style={{ width: '100%' }}>        
          <Card.Header>
            <Card.Title>Site Name: {currentSiteData[0].siteName}{/* <span className="minimizeCard">    <FontAwesomeIcon
                                icon={faWindowMinimize}
                                className="dvaraBrownText"
                              ></FontAwesomeIcon></span> */}
              </Card.Title>
          </Card.Header>
          <Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons SiteAreaIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                    <span className="siteDetailsTitle">Site Area</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].siteArea}</span>
                  </Col>
                </Row>                 
              </ListGroupItem>
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons LandWaterTypeIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                    <span className="siteDetailsTitle">Land Water Type </span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].land_watertype}</span>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons CropIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                    <span className="siteDetailsTitle">Crop Name</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].crop.crop__crop_name}</span>
                  </Col>
                </Row>                 
              </ListGroupItem>
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons CropVarietyIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                    <span className="siteDetailsTitle">Crop Variety</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].crop.variety}</span>
                  </Col>
                </Row>                 
              </ListGroupItem>
              <ListGroupItem className="noPadding"><Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons SowingIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                    <span className="siteDetailsTitle">Sowing Date</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].crop.sowing_date}</span>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding">
                    <i className="siteDetailIcons HarvestIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                  <span className="siteDetailsTitle">Harvest Date</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].crop.harvest_date}</span>
                  </Col>
                </Row>
              </ListGroupItem>              
              <ListGroupItem className="noPadding">
                <Row className="noPadding">
                  <Col lg="2" className="noPadding testBord">
                    <i className="siteDetailIcons DurationIcon"></i>
                  </Col>
                  <Col lg="4" className="noPadding">
                  <span className="siteDetailsTitle">Duration</span>
                  </Col>
                  <Col lg="6" className="noPadding">
                    <span className="siteDetailsTitle">{currentSiteData[0].crop.duration}</span>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
      </Card>
    );

    return(<div className="wrap">{siteDetailsElements}</div>);
  }
  
  function RenderSitesMap(getCurrRowID){
   
    function filterNeededId (ArrObj){
      if(ArrObj.id === getCurrRowID.currRowSiteId)
      {
        return (ArrObj);
      }
      else{
        return;
      }
    }

    let currentSiteData = props.data.filter(filterNeededId);

    let selectedSiteLatLong = [currentSiteData[0].finalLatitude, currentSiteData[0].finalLongitude];
    let selSiteName = currentSiteData[0].siteName;
    let selSiteId = currentSiteData[0].id;

    const currSiteMapElem = (
      <Card className="sitesMapHolderCard">        
        <Card.Header>
          <Card.Title>Site ID: {selSiteId} / Site Name: {selSiteName} Location{/* <span className="minimizeCard">    <FontAwesomeIcon
                              icon={faWindowMinimize}
                              className="dvaraBrownText"
                            ></FontAwesomeIcon></span> */}
            </Card.Title>
        </Card.Header>
        <Card.Body>
          <LeafletMap
            center={selectedSiteLatLong}
            zoom={18}
            maxZoom={20}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
          >
            <TileLayer url="https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" />
            <Marker
                key={selSiteId}
                position={selectedSiteLatLong}
              >
                <Popup minWidth={350} offset={[250, 250]} >{/* <h5>Site ID: <span class="dvaraGreenText">{selSiteId}</span> / Site Name: <span class="dvaraGreenText">{selSiteName}</span> </h5> */}
                  <RenderSiteDetails currRowSiteId={selSiteId}/>
                </Popup>
              </Marker>
          </LeafletMap>
        </Card.Body>
      </Card>
    );

    return (
      <div className="wrap sitesMapCardWrap">{currSiteMapElem}</div>
    );
  }
  if(props.compType === "procOrder"){
  
      return (
        
          <div className="wrap">
              <MaterialTable  
              icons={tableIcons}
              title="" 
              data={props.data} 
              columns={props.columns}
              options={{
                  actionsColumnIndex: -1,
                  detailPanelType: "single",
                    headerStyle: {
                      backgroundColor: '#A3C614',
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontFamily: 'barlow_reg',
                      fontWeight: 'bold'
                  },
                  // exportButton: true,

                }}
              />
          </div>
        )
    }
    else if(props.compType === "inputOrder") {
      return (

        <div className="wrap">
            <MaterialTable  
            icons={tableIcons}
            title="" 
            data={props.data} 
            columns={props.columns}
            // actions={[
                
                // {
                //     icon: tableIcons.Edit,
                //     tooltip: 'Edit',
                //     onClick: (event, rowData) => alert("Are sure you want to edit site: " + rowData.siteName)
                //   },
                // {
                //   icon: tableIcons.Delete,
                //   tooltip: 'Delete',
                //   onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.siteName),
                // }
              // ]}
              // onRowClick={(event, rowData, togglePanel) =>{ togglePanel(); }}
              // detailPanel={[
              //   {
              //     icon: VisibilityIcon,
              //     tooltip: 'Show Site Details and Map',
              //     render: rowData => {
              //       return (
              //         <div className="wrap sitesDetailsWrap">
              //           <Row>
                         
              //             <Col lg="12" md="6"  className="">
              //               <RenderSitesMap currRowSiteId={rowData.id}></RenderSitesMap>
              //             </Col>
              //           </Row>
              //         </div>
              //       )
              //     },
              //   }]}


              options={{
                actionsColumnIndex: -1,
                detailPanelType: "single",
                  headerStyle: {
                    backgroundColor: '#A3C614',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontFamily: 'barlow_reg',
                    fontWeight: 'bold'
                },
                exportButton: true,

              }}
            />
        </div>
    )
    }
    else{
      return (

        <div className="wrap">
            <MaterialTable  
            icons={tableIcons}
            title="" 
            data={props.data} 
            columns={props.columns}
            actions={[
                
                {
                    icon: tableIcons.Edit,
                    tooltip: 'Edit',
                    onClick: (event, rowData) => alert("Are sure you want to edit site: " + rowData.siteName)
                  },
                {
                  icon: tableIcons.Delete,
                  tooltip: 'Delete',
                  onClick: (event, rowData) => window.confirm("Are you sure you want to delete " + rowData.siteName),
                }
              ]}
              onRowClick={(event, rowData, togglePanel) =>{ togglePanel(); }}
              detailPanel={[
                {
                  icon: VisibilityIcon,
                  tooltip: 'Show Site Details and Map',
                  render: rowData => {
                    return (
                      <div className="wrap sitesDetailsWrap">
                        <Row>
                          {/* <Col lg="5" md="6"  className="">
                            <RenderSiteDetails currRowSiteId={rowData.id}/>
                          </Col>
                          <Col lg="7" md="6"  className="noPadding">
                            <RenderSitesMap currRowSiteId={rowData.id}></RenderSitesMap>
                          </Col> */}
                          <Col lg="12" md="6"  className="">
                            <RenderSitesMap currRowSiteId={rowData.id}></RenderSitesMap>
                          </Col>
                        </Row>
                      </div>
                    )
                  },
                }]}


              options={{
                actionsColumnIndex: -1,
                detailPanelType: "single",
                /*  headerStyle: {
                    backgroundColor: 'rgba(163, 198, 20, 1)',
                    color: '#FFF',
                    fontFamily: 'barlow_reg',
                    fontSize: '1.2em',
                    fontWeight: 'bold'
                  }, */
                  headerStyle: {
                    backgroundColor: '#A3C614',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontFamily: 'barlow_reg',
                    fontWeight: 'bold'
                },/* ,
                rowStyle: {
                    backgroundColor: '#f1f1f1',
                    borderBottom: '2px solid #e2e2e2',
                    fontSize: '0.9rem'
                }, */
                // exportButton: true,

              }}
            />
        </div>
    )
    }
}
