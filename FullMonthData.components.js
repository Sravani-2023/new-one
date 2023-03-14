import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
import MonthlyData from "./MonthlyData.component";
import {
    Container,
    Card,
    Row,
    Col,
    Accordion,
    Tab, Nav, Tabs,
    Button,
    Table,
    Modal,
    Form,
    FormControl,
    CardGroup,
    Carousel,
    OverlayTrigger, Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faHome, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { TriggerAlert, } from './dryfunctions';
import AuthService from "../services/auth.service";
import NumberFormat from 'react-number-format';
import moment from 'moment';


export default class FullMonthData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalAmount: 0,
        }

    }
    setAmountValue= (val) => {
        // console.log('hello', val);
        this.setState({
            totalAmount: this.state.totalAmount += val
        })
    }
    

    render() {
        let index=this.props.index;
        let keyData = this.props.keyData;
        return (
            <Card className="card-outer" 
            key={"Application_" + index}
            >
               <Accordion.Toggle
                as={Card.Header}
                key={"Application_" + index}
                eventKey={"Data" + index}
                className="dvaraBrownText accordIcon   collapsed adding-Icon trialaccordion"
                style={{ padding: "6px" }}>
                <h6>{keyData.month} &nbsp;<span style={{ fontSize: "15px" }}>( Month Input Requirements)</span> </h6>
              </Accordion.Toggle>
              <Accordion.Collapse
                eventKey={"Data" + index}
            
              > 
              
                 <Card.Body className=""
                  key={"Application_" + index}
                  > 
                  <Table striped bordered hover size="sm">
                  <thead >
                                <tr className="header-bg">
                                </tr>

                            </thead>
                 
                    <thead>
                      <tr className='headerComp' >
                        <th>Category</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Tentative Date</th>
                       
                        <th>Total Packets</th>
                        <th>Packet Price</th>
                     
                        <th> Total Tentative Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                          
                          {
                                     keyData.components.map((data, componentindex) => {
                                       

                                       
                                       if(data.month===keyData.month){
                                           return (
                                             <MonthlyData  {...this.props} data={data} changeTotalAmount={this.setAmountValue} selectedSeason={this.props.selectedSeason}selectedYear={this.props.selectedYear}selectedStatus={this.props.selectedStatus}/>

                                            )
                                       }
                                      })
                       }

                           <tr className="total_comp_amt">
                                            <td colSpan="6"><center><strong>Total Amount</strong></center></td>
                                           <td><strong><span>&#x20B9;</span>
                                           <NumberFormat value={this.state.totalAmount} displayType={'text'}
                                           thousandSeparator={true} thousandsGroupStyle='lakh'/>                                                    
                                                                                       
                                           </strong></td>
                                       </tr>
                         </tbody>

                  </Table>
                 </Card.Body> 
              </Accordion.Collapse>
            </Card>
          )
    }


}    