import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "../assets/css/map.css";
import icon from "../assets/img/site_location.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import Carousel from "react-elastic-carousel";
import React, { Component } from "react";
import EventBus from "../services/eventbus.service";
import L from "leaflet";
import { Icon } from "leaflet";
import {
  Map as LeafletMap,
//   MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  GeoJSON,
} from "react-leaflet";
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

import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
let DefaultIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: icon,
   // size of the icon

  iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
   iconSize:     [20, 20], // size of the icon
  shadowSize:   [20, 20], // size of the shadow
  iconAnchor:   [4, 62], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [23, -65], 
});
L.Marker.prototype.options.icon = DefaultIcon;
export default class CropMap extends Component {
  constructor(props) {
    super(props);
      this.state = {
        farmerData: [
          //   {
          //     Id: 1,
          //     Location: "Maharashtra",
          //     Total_Cases: "36,39,855",
          //     New_Cases_Per_Day: "61,695",
          //     Cases_Per_1_Million_People: "31,877",
          //     Deaths: "59,153",
          //     Latitude: 19.601194,
          //     Longitude: 75.552979,
          //   },
          //   {
          //     Id: 2,
          //     Location: "Kerala",
          //     Total_Cases: "11,97,301",
          //     New_Cases_Per_Day: "8,126",
          //     Cases_Per_1_Million_People: "34,574",
          //     Deaths: "4,856",
          //     Latitude: 10.850516,
          //     Longitude: 76.27108,
          //   },
         
        
          {
            id: 4664,
            farmer_id: 9141,
            wkt: "POLYGON ((86.40250761061907 20.836892500900255,86.40208147466183 20.83713033184863,86.40240132808687 20.83762761352655,86.40250660479067 20.837549903580577,86.40236310660839 20.83731802689045,86.40265613794327 20.83714725261326,86.40250761061907 20.836892500900255))",
            name: "online2_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8372776049",
            long: "86.4024193771",
            geojson: null,
          },
          {
            id: 4661,
            farmer_id: 9141,
            wkt: "POLYGON ((86.4008523 20.8364763,86.4006249 20.8365379,86.4004212 20.836726,86.400261 20.8368214,86.4000856 20.8370043,86.4002875 20.8372552,86.4009697 20.8366349,86.4009022 20.836523,86.4008523 20.8364763))",
            name: "offline1_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8367172556",
            long: "86.4005840778",
            geojson: null,
          },
          {
            id: 4655,
            farmer_id: 9141,
            wkt: "POLYGON ((86.40096902847289 20.836643075681156,86.40015229582787 20.83736690903322,86.39990553259851 20.83706797568112,86.40009295195341 20.836967704402806,86.40032932162285 20.836834844856174,86.40040073543786 20.836753060973166,86.40058748424053 20.836556591463477,86.40067230910061 20.836371402265033,86.40096902847289 20.836643075681156))",
            name: "online1_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8368201955",
            long: "86.4003887074",
            geojson: null,
          },
          {
            id: 4671,
            farmer_id: 9141,
            wkt: "POLYGON ((86.4010456 20.8389968,86.401274 20.8394257,86.4014775 20.8392595,86.4012409 20.838907,86.4010456 20.8389968))",
            name: "offline4_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8391171600",
            long: "86.4012167200",
            geojson: null,
          },
          {
            id: 4670,
            farmer_id: 9141,
            wkt: "POLYGON ((86.4020406 20.8382105,86.402519 20.8389474,86.4027747 20.8388284,86.4022315 20.8380751,86.4020406 20.8382105))",
            name: "offline3_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8384543800",
            long: "86.4023212800",
            geojson: null,
          },
          {
            id: 4669,
            farmer_id: 9141,
            wkt: "POLYGON ((86.4022196084261 20.838069118063,86.40202112495898 20.83817346209713,86.40251398086549 20.838927682439135,86.40276342630386 20.838810805167842,86.4022196084261 20.838069118063))",
            name: "online3_rakesh",
            farmer_name: "Lokesh Kumar",
            lat: "20.8384952669",
            long: "86.4023795351",
            geojson: null,
          },
          {
            id: 4579,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5077692 20.8105369,86.5076882 20.8103879,86.5076164 20.8103681,86.5075457 20.8104307,86.5076139 20.8106168,86.5077692 20.8105369))",
            name: "offline 1",
            farmer_name: "Durga Prasad",
            lat: "20.8104680800",
            long: "86.5076466800",
            geojson: null,
          },
          {
            id: 4588,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5064028 20.8107439,86.5061566 20.810785,86.5061132 20.8106148,86.506376 20.8106603,86.5064028 20.8107439))",
            name: "offline 10",
            farmer_name: "Durga Prasad",
            lat: "20.8107010000",
            long: "86.5062621500",
            geojson: null,
          },
          {
            id: 4587,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5065119 20.8109254,86.506505 20.8111851,86.5063416 20.8112096,86.5063198 20.8110342,86.5063816 20.8109193,86.5065119 20.8109254))",
            name: "offline 9",
            farmer_name: "Durga Prasad",
            lat: "20.8110547200",
            long: "86.5064119800",
            geojson: null,
          },
          {
            id: 4585,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5068749 20.8108183,86.5067996 20.8108484,86.5067837 20.8105314,86.5068263 20.8105752,86.5068306 20.8108431,86.5068749 20.8108183))",
            name: "offline 7",
            farmer_name: "Durga Prasad",
            lat: "20.8107232800",
            long: "86.5068230200",
            geojson: null,
          },
          {
            id: 4583,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5071299 20.8105711,86.5070346 20.8103501,86.5071937 20.810351,86.5072595 20.8105322,86.5071299 20.8105711))",
            name: "offline 5",
            farmer_name: "Durga Prasad",
            lat: "20.8104511000",
            long: "86.5071544250",
            geojson: null,
          },
          {
            id: 4581,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5078655 20.8106945,86.5078306 20.8108393,86.5077253 20.8108857,86.5076436 20.8107955,86.5078655 20.8106945))",
            name: "offline 3",
            farmer_name: "Durga Prasad",
            lat: "20.8108037500",
            long: "86.5077662500",
            geojson: null,
          },
          {
            id: 4586,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5066753 20.8108503,86.5067194 20.8111368,86.5065353 20.8111504,86.5065473 20.8108725,86.5066753 20.8108503))",
            name: "offline 8",
            farmer_name: "Durga Prasad",
            lat: "20.8110025000",
            long: "86.5066193250",
            geojson: null,
          },
          {
            id: 4584,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5070786 20.8107677,86.5071314 20.8109979,86.5070367 20.8109916,86.5069442 20.8108149,86.507116 20.8107382,86.5070786 20.8107677))",
            name: "offline 6",
            farmer_name: "Durga Prasad",
            lat: "20.8108620600",
            long: "86.5070613800",
            geojson: null,
          },
          {
            id: 4580,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5078817 20.8106756,86.5080065 20.8108694,86.5080888 20.8108069,86.5079662 20.8105762,86.5078817 20.8106756))",
            name: "offline 2",
            farmer_name: "Durga Prasad",
            lat: "20.8107320250",
            long: "86.5079858000",
            geojson: null,
          },
          {
            id: 4589,
            farmer_id: 9146,
            wkt: "POLYGON ((86.505944 20.8106835,86.5061273 20.8110726,86.5059066 20.8110654,86.5058244 20.8109989,86.5058856 20.810752,86.5060152 20.8106763,86.505944 20.8106835))",
            name: "offline 1a",
            farmer_name: "Durga Prasad",
            lat: "20.8108747833",
            long: "86.5059505167",
            geojson: null,
          },
          {
            id: 4582,
            farmer_id: 9146,
            wkt: "POLYGON ((86.5074154 20.8108544,86.5075544 20.8110333,86.5073147 20.81112,86.5072632 20.8109068,86.5074154 20.8108544))",
            name: "offline 4",
            farmer_name: "Durga Prasad",
            lat: "20.8109786250",
            long: "86.5073869250",
            geojson: null,
          },
          {
            id: 5449,
            farmer_id: 9231,
            wkt: "POLYGON ((80.89943412691356 26.93359107269026,80.8993037045002 26.933291863945964,80.89877597987652 26.933525611504358,80.89905392378569 26.933894764270303,80.89943412691356 26.93359107269026))",
            name: "test issue resolution",
            farmer_name: "Gulrez Ahmed",
            lat: "26.9335758281",
            long: "80.8991419338",
            geojson:
              '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[80.89943412691356, 26.93359107269026], [80.8993037045002, 26.933291863945964], [80.89877597987652, 26.933525611504358], [80.89905392378569, 26.933894764270303], [80.89943412691356, 26.93359107269026]]]}}]}',
          },
          {
            id: 5450,
            farmer_id: 9231,
            wkt: "POLYGON ((80.89943412691356 26.93359107269026,80.8993037045002 26.933291863945964,80.89877597987652 26.933525611504358,80.89905392378569 26.933894764270303,80.89943412691356 26.93359107269026))",
            name: "test issue resolution",
            farmer_name: "Gulrez Ahmed",
            lat: "26.9335758281",
            long: "80.8991419338",
            geojson:
              '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[80.89943412691356, 26.93359107269026], [80.8993037045002, 26.933291863945964], [80.89877597987652, 26.933525611504358], [80.89905392378569, 26.933894764270303], [80.89943412691356, 26.93359107269026]]]}}]}',
          },
          {
            id: 5448,
            farmer_id: 9231,
            wkt: "POLYGON ((80.8993761241436 26.933674767301824,80.89933890849352 26.933795227651583,80.89943010360003 26.93386875921622,80.89959505945446 26.93375338039827,80.8993761241436 26.933674767301824))",
            name: "test site",
            farmer_name: "Gulrez Ahmed",
            lat: "26.9337730336",
            long: "80.8994350489",
            geojson:
              '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[80.8993761241436, 26.933674767301824], [80.89933890849352, 26.933795227651583], [80.89943010360003, 26.93386875921622], [80.89959505945446, 26.93375338039827], [80.8993761241436, 26.933674767301824]]]}}]}',
          },
          {
            id: 5511,
            farmer_id: 9235,
            wkt: "POLYGON ((83.0095175 25.3060362,83.0095835 25.3058557,83.0096315 25.3059572,83.0095781 25.3059819,83.0095175 25.3060362))",
            name: "Naya Khet test",
            farmer_name: "Pankaj Gaur",
            lat: "25.3059734400",
            long: "83.0095656200",
            geojson: null,
          },
          {
            id: 5478,
            farmer_id: 9224,
            wkt: "POLYGON ((77.3124459385872 28.497029979157258,77.31243319809437 28.49709774971425,77.31254786252975 28.497098928332242,77.31256429105997 28.49702938984788,77.3124459385872 28.497029979157258))",
            name: "test 1",
            farmer_name: "Senthil Kumar",
            lat: "28.4970640118",
            long: "77.3124978226",
            geojson:
              '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[77.3124459385872, 28.497029979157258], [77.31243319809437, 28.49709774971425], [77.31254786252975, 28.497098928332242], [77.31256429105997, 28.49702938984788], [77.3124459385872, 28.497029979157258]]]}}]}',
          },
          {
            id: 5513,
            farmer_id: 9536,
            wkt: "POLYGON ((78.40867079794407 17.481387110451703,78.40897422283888 17.481235529331148,78.40923707932234 17.482123908023457,78.40894136577846 17.482434104025167,78.40867079794407 17.481387110451703))",
            name: "ssa kar",
            farmer_name: "Uma Sankar",
            lat: "17.4817951630",
            long: "78.4089558665",
            geojson:
              '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[78.40867079794407, 17.481387110451703], [78.40897422283888, 17.481235529331148], [78.40923707932234, 17.482123908023457], [78.40894136577846, 17.482434104025167], [78.40867079794407, 17.481387110451703]]]}}]}',
          },
          {
            id: 5512,
            farmer_id: 9232,
            wkt: "POLYGON ((83.5292264074087 18.281700970201054,83.52919891476631 18.281549115609078,83.52908626198769 18.281550389023394,83.52909497916698 18.281669134867837,83.5292264074087 18.281700970201054))",
            name: "sample site",
            farmer_name: "Shivam Raghuvanshi",
            lat: "18.2816174024",
            long: "83.5291516408",
            geojson: null,
          },
        ],
      };
  }

    render() {
      
    const position = [18.146633, 79.08886];
    return (
      <LeafletMap center={position} zoom={5} scrollWheelZoom={true}>
        <TileLayer url="https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}" />
        {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        <GeoJSON
          data={this.state.covidData}
          fillColor="green"
          opacity="0.6"
          color="blue"
        ></GeoJSON>
        {this.state.farmerData.map((eachData) => (
          <Marker key={eachData.Id} position={[eachData.lat, eachData.long]}>
            <Popup>
              <div>{eachData.farmer_id}</div>
              <div>{eachData.farmer_name}</div>
              <div>{eachData.name}</div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>
    );
  }
}
