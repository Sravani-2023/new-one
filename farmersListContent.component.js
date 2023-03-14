import React, { Component } from 'react';
import "../index.css";
import "../assets/img/fr.svg";
import UserService from "../services/user.service";
import { Container, Card, Alert, Row, Col, ProgressBar, ProgressBarProps, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

import "../assets/css/farmerlist.css";
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faHireAHelper } from "@fortawesome/free-brands-svg-icons";

export default class FarmersListContent extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          farmerslist: [],
          filterText: ''
        };
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      }
      
      handleFilterTextChange(filterText){
        this.setState(
            {
                filterText:filterText
            });
    }
      componentDidMount() {
        UserService.getFarmerList().then(
          response => {
            this.setState({
              farmerslist: response.data
            });            
          },
          error => {
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            });
          }
        );
      }
    render() {
        const { farmerslist } = this.state;
        // console.log(farmerslist);
        return (
            <div className="wrap">
                {farmerslist.map((farmer) => (                    
                    <Row key={farmer.id} id={farmer.id} className="farmersCard">
                    <Col lg="4">
                        <h4 className="farmerListHeading dvaraBrownText">{farmer.first_name}</h4><h6 className="farmerListHeading dvaraBrownText">{farmer.last_name}</h6>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="dvaraGreenText"></FontAwesomeIcon><span className="farmersVillageName">&nbsp;{farmer.village}</span>
                    </Col>
                    <Col lg="8" className="">
                        <Row>
                        <Col lg="5" className="">
                            <h4 className="farmerListHeading dvaraBrownText"><i className="frIcon" title="Field Representative"></i>{farmer.fr_name}</h4>
                        </Col>
                        <Col lg="7" className="farmerCardSiteDetails">
                            Total Area (in Acres):&nbsp;{farmer.total_area}
                            <ProgressBar className="farmersRegSiteBar" animated>
                            <ProgressBar className="farmerRegSiteBarStatus" max={farmer.total_sites} now={farmer.registered_sites} key={farmer.id} />
                            </ProgressBar>
                            Registered Sites:&nbsp;<span className="darkGreenText"><b>{farmer.registered_sites}</b></span>&nbsp;/&nbsp;<span className="dvaraBrownText">{farmer.total_sites}</span>
                        </Col>
                        </Row>              

                    </Col>
                    </Row>
                ))}
          </div>
        )
    }
}
