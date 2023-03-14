import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "../assets/css/map.css";
import icon from "../assets/img/site_location.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import React, { Component } from "react";
import EventBus from "../services/eventbus.service";
import L from "leaflet";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [70, 70], // size of the icon
  shadowSize: [50, 50], // size of the shadow
  iconAnchor: [4, 62], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [23, -65], // point from which the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = DefaultIcon;

var mapCenterVal = [17.7384734, 93.9823854];
var mapZoomVal = 5;
export default class Mapnew extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      changeBBox: [21.146633, 79.08886],
      setZoomLvl: 5,
      farmerName: "",
    };
  }

  render() {
  
    mapCenterVal = this.state.changeBBox;
    mapZoomVal = this.state.setZoomLvl;
    // let selFarmerName = this.state.farmerName;
    return (
      <LeafletMap
        center={mapCenterVal}
        zoom={mapZoomVal}
        height={200}
        maxZoom={20}
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
        <Marker position={[21.146633, 79.08886]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {/* <MarkerClusterGroup>
          {this.props.sites.map((site) => {
            var lat = site["lat"];
            var long = site["long"];

            lat = "17.3850";
            long = "78.4867";

            return (
              <Marker key={site.id} position={[lat, long]}>
                <Popup minWidth={250}>
                  Site name: {site.name} / Farmer Name: {site.farmer_name}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup> */}
      </LeafletMap>
    );
  }

  // componentDidMount() {
  //   EventBus.on("changeMapBBox", (data) => {
     
  //     console.log("New BBox ", data);
  //     let lat = data.BBox[0];
  //     let long = data.BBox[1];
  //     let newLat = lat + 0.005;
  //     let newLong = long;
  //     let latLong = [];
  //     latLong.push(newLat, newLong);
  //     console.log(latLong, "__");
  //     this.setState({
  //       changeBBox: data.BBox,
  //       setZoomLvl: data.ZoomLvl,
  //       farmerName: data.farmerName,
  //     });
  //   });
  // }

  // componentWillUnmount() {
  //   EventBus.remove("changeMapBBox");
  // }
}
