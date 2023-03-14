import React, { Component } from "react";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-choropleth";
import { Map as LeafletMap, TileLayer, Marker, Popup, Polygon, GeoJSON, useLeaflet } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-markercluster";




import "../assets/css/map.css";
import icon from "../assets/img/site_location.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import Carousel from "react-elastic-carousel";

import EventBus from "../services/eventbus.service";


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
  Carousel,
  ListGroupItem,
} from "react-bootstrap";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize:     [70, 70], // size of the icon
  shadowSize:   [50, 50], // size of the shadow
  iconAnchor:   [4, 62], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [23, -65], // point from which the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = DefaultIcon;

var mapCenterVal = [ 18.146633, 79.088860 ];
/* var mapCenterVal = [20.7384734, 93.9823854]; */
var mapZoomVal = 5;


let savedGeojson = {};

function Choro(props) {
  const { map } = useLeaflet();

  useEffect(() => {
    if (Object.keys(props.geojson).length > 0) {
      if (savedGeojson) map.removeLayer(savedGeojson);
      savedGeojson = L.choropleth(props.geojson, {
        valueProperty: "DIFF", // which property in the features to use
        scale: ["white", "red"], // chroma.js scale - include as many as you like
        steps: 5, // number of breaks or steps in range
        mode: "q", // q for quantile, e for equidistant, k for k-means
        fillColor: "green",
        opacity: "0.6",
        color: "blue"
        //style,
        /* onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Total " + feature.properties.DIFF + "<br>" //+
            // feature.properties.incidents.toLocaleString() +
            // " incidents"
          );
        } */
      }).addTo(map);
    }
  }, [props.geojson]);

  return null;
}

function SitesJsonData(sitesData){
  const default_sites_json = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "EPSG:4326"
        }
    },
    "features": []
  }
  if(sitesData){
    return sitesData
  }
  else if(localStorage.getItem('sites_wkt')){
    return JSON.parse(localStorage.getItem('sites_wkt'))
  }
  else{
    return default_sites_json
  }
}
export default class Map extends Component {
  constructor(props){
    
    super(props);
    //this.setBounds = this.setBounds.bind(this);

    this.mapRef = React.createRef();

    this.state = {
      changeBBox : mapCenterVal, 
      setZoomLvl : 5, 
      farmerName: "",
      allSites  :  {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "EPSG:4326"
            }
        },
        "features": []
    },
       siteData: {},
    //  music:false,
      siteGeoJson : {}
    }    
  }

  /* Other methods */
  isObjectEmpty = (value) => {

    return (
      Object.prototype.toString.call(value) === '[object Object]' &&
      JSON.stringify(value) === '{}'
    );
  }

  RenderSiteDetails = (getSiteData) => {

  
    let currentSiteData = getSiteData.currRowSiteData;//props.data.filter(filterNeededId);  
     const siteDetailsElements = (
       <div>
         <Carousel className="carousel-editing">
           {/* interval={1000} */}

           {Array.isArray(currentSiteData.crop) ? (
             currentSiteData.crop.map((data) => (
               <Carousel.Item>
                

                 <Card style={{ width: "100%" }}>
                   <Card.Header className="card-header-editing">
                     <Card.Title className="title-editing">
                       Site Name:
                       <span style={{ color: "rgba(114, 49, 12, 1)" }}>
                         &nbsp; {currentSiteData.siteName}
                       </span>
                     </Card.Title>
                   </Card.Header>
                   <Card.Body className="cardBodyNoPadding">
                     <ListGroup className="list-group-flush">
                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding">
                             <i className="siteDetailIcons SiteAreaIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">Site Area</span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {currentSiteData.siteArea}
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>
                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding">
                             <i className="siteDetailIcons LandWaterTypeIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               Land Water Type
                             </span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {currentSiteData.land_watertype}
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>
                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding">
                             <i className="siteDetailIcons CropIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">Crop </span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {data.crop__crop_name}
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>

                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding">
                             <i className="siteDetailIcons SowingIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               Sowing Date
                             </span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {data.sowing_date}
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>
                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding">
                             <i className="siteDetailIcons HarvestIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               Harvest Date
                             </span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {data.harvest_date}
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>
                       <ListGroupItem className="noPadding">
                         <Row className="noPadding">
                           <Col lg="2" ClassName="noPadding testBord">
                             <i className="siteDetailIcons DurationIcon"></i>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">Duration</span>
                           </Col>
                           <Col lg="5" ClassName="noPadding">
                             <span className="siteDetailsTitle">
                               {data.duration} Days
                             </span>
                           </Col>
                         </Row>
                       </ListGroupItem>
                     </ListGroup>
                   </Card.Body>
                 </Card>
               </Carousel.Item>
             ))
           ) : (
             <Card style={{ width: "100%" }}>
               <Card.Header className="card-header-editing">
                 <Card.Title className="title-editing">
                   Site Name: {currentSiteData.siteName}
                 </Card.Title>
               </Card.Header>
               <Card.Body className="cardBodyNoPadding">
                 <ListGroup className="list-group-flush">
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons SiteAreaIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">Site Area</span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">
                           {currentSiteData.siteArea}
                         </span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons LandWaterTypeIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">
                           Land Water Type
                         </span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">
                           {currentSiteData.land_watertype}
                         </span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons CropIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">Crop </span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">{"NA"}</span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                   {/* <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons CropVarietyIcon"></i>
                       </Col>
                       <Col lg="4" ClassName="noPadding">
                         <span className="siteDetailsTitle">Crop Variety</span>
                       </Col>
                       <Col lg="6" ClassName="noPadding">
                         <span className="siteDetailsTitle">
                           {currentSiteData.crop.variety}
                         </span>
                       </Col>
                     </Row>
                   </ListGroupItem> */}
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons SowingIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">Sowing Date</span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">{"NA"}</span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding">
                         <i className="siteDetailIcons HarvestIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">Harvest Date</span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">{"NA"}</span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                   <ListGroupItem className="noPadding">
                     <Row className="noPadding">
                       <Col lg="2" ClassName="noPadding testBord">
                         <i className="siteDetailIcons DurationIcon"></i>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">Duration</span>
                       </Col>
                       <Col lg="5" ClassName="noPadding">
                         <span className="siteDetailsTitle">{"NA"}</span>
                       </Col>
                     </Row>
                   </ListGroupItem>
                 </ListGroup>
               </Card.Body>
             </Card>
           )}
         </Carousel>
       </div>

    
     );

    return(<div className="wrap">{siteDetailsElements}</div>);
  }
  
   /* lat = "17.3850"
            long = "78.4867" */
  render() {
    const { changeBBox, setZoomLvl, allSites, farmerName, siteData, siteGeoJson} = this.state;
    mapCenterVal = changeBBox;
    var wkts = allSites.features.map((site) => site.geometry.coordinates[0])
    //var latlongsPositions = wkts.map(polygon => polygon.map(v => [v[1], v[0]]))
    //console.log('---------------------------------',latlongsPositions, '-------', wkts)
    mapZoomVal = setZoomLvl;
    return (
      <LeafletMap
        center={mapCenterVal}
        ref={this.mapRef}
        zoom={mapZoomVal}
        height={200}
        maxZoom={20}
        crs={L.CRS.EPSG3857}
        geojson={allSites}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        paddingBottomRight={[0, 100]}
      >
        <TileLayer url="https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" />
        {/* {console.log("Number of sites Now: ", allSites.features.length)} */}

      <Choro geojson={allSites} />
    <Polygon pathOptions={{ color: 'blue' }} positions={wkts}/>
            {
            (siteData !== undefined) ? ((!this.isObjectEmpty(siteData)) ? (
               <Marker
               
                key={siteData.id}
                position={[siteData.finalLatitude, siteData.finalLongitude]}
              >
                {/* {console.log("check for marker",siteData)} */}
                <Popup minWidth={250}> <this.RenderSiteDetails currRowSiteData={siteData}/></Popup>
              </Marker> 
            

            ) : (
              <></>
            )):(<></>)}
      </LeafletMap>
    );
  }

  componentDidMount() {
	    console.log("JSON Data--------------", SitesJsonData(this.props.sites) )
   
 this.setState({
      allSites    : SitesJsonData(this.props.sites) 
    });
    
    EventBus.on("changeMapFeatures", (data) =>{
    //  console.log("datatttt",data)
     if(data.filterdSitesData.features.length > 0)
        this.setState({
          allSites    : data.filterdSitesData,
          changeBBox  : data.BBox, 
          setZoomLvl  : data.ZoomLvl,
          // siteData: data.siteData,
          siteData: {}
          // siteData    :data.siteData
        });
      else
        this.setState({
          allSites    : {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": {
                    "name": "EPSG:4326"
                }
            },
            "features": []
        },
          changeBBox  : data.BBox, 
          setZoomLvl  : data.ZoomLvl,
          // siteData: data.siteData,
          siteData: {}
        });
    });


    EventBus.on("changeMapBBox", (data) =>{
      //this.setState()
      
      let lat = data.BBox[0];
      let long = data.BBox[1];
      let newLat = lat+0.005;
      let newLong = long;
      let latLong = [];
      latLong.push(newLat, newLong);
      
      if('siteData' in data){
        if(data.siteData.geojson_wkt !== null){
  
          this.setState({changeBBox : data.BBox, setZoomLvl : data.ZoomLvl, farmerName: data.farmerName, siteData: data.siteData/* , "siteGeoJson" : siteGeoJson */});
        }
        else
          this.setState({changeBBox : data.BBox, setZoomLvl : data.ZoomLvl, farmerName: data.farmerName, siteData: data.siteData});
      }
      else
        this.setState({changeBBox : data.BBox, setZoomLvl : data.ZoomLvl, farmerName: data.farmerName, siteData: {}, siteGeoJson: {}});
    });    
  }

  componentWillUnmount() {
    EventBus.remove("changeMapBBox");
    EventBus.remove("changeMapFeatures");
  }

}
