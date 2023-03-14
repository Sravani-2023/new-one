import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
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
function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}

export default class MonthlyData extends Component {
    constructor(props) {
        super(props);
        // console.log("props",props)
        this.state = {
            minRequiredDate: props.data.min_required_date,
            brandRequiredPackets: props.data.brands[0].required_pkts,
            brandPacketPrice:props.data.brands[0].pkt_price,
            brandTentativeAmount:props.data.brands[0].tentative_amount,
            brandDropdowns: props.data.brand_dropdown,
            allBrands: props.data.brands,
            catName:props.data.category_name,
            productName:props.data.product_name,
            selectedBrand:props.data.brand_dropdown[0].brand_id,
            brandName:props.data.brands[0].brand_name,

        }

    }
    brandsOptions = (brandList) =>
        brandList.map((brand, i) =>

        (
            <option key={i} name={brand.brand_name} value={brand.brand_id}>
                {brand.brand_name} (&#x20b9; {brand.pkt_price})
            </option>

        ))
       
     brandOnChangeHandler = (e) => {
      let selectedBrandId = e.target.value;
      let brandIndex = this.state.allBrands.findIndex( b => b.brand_id==selectedBrandId);
      if(brandIndex>=0){
        let oldAmount = this.state.brandTentativeAmount;
      this.setState({
        brandRequiredPackets: this.state.allBrands[brandIndex].required_pkts,
        brandPacketPrice: this.state.allBrands[brandIndex].pkt_price,
        brandTentativeAmount: this.state.allBrands[brandIndex].tentative_amount,
        selectedBrand:selectedBrandId,
        brandName: this.state.allBrands[brandIndex].brand_name,

      }, () => {
        // console.log('hello', oldAmount,this.state.brandTentativeAmount )
        this.props.changeTotalAmount(this.state.brandTentativeAmount - oldAmount)
      })
    }
     }   

     navigateToPageProduct=(selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price,BrandName)=>{
        //  console.log("ask",selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price,BrandName)
       
        let arr = BindmonthYear.split('-');
       
        let sendMonth=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
        let sendMonthFullName=arr[0];
        let sendYear=arr[1];
        let productFarmerData={
           "selectedSeason":selectedSeason,
             "selectedYear":selectedYear,
             "selectedStatus":selectedStatus,
             "categoryId":categoryId,
             "productId":productId,
              "brandId":brandId,
              "sendMonth":sendMonth,
              "sendYear":sendYear,
              "categoryName":categoryName,
              "productName":productName,
               "total_packets":total_packets,
               "price":price,
               "BrandName":BrandName,
               "sendMonthFullName":sendMonthFullName
        }
        localStorage.setItem("productFarmerData", JSON.stringify(productFarmerData));
    
        //<Redirect to="/BoFarmerProductInput" />
        // this.props.history.push("/BoFarmerProductInput");
        // this.props.history.push("/BoFarmerProductInput/:fpoName/:season/:year/:isVerified/:cropId")
        this.props.history.push("/BoFarmerProductInput/" + selectedSeason + "/" + selectedYear +  "/" + productId +  "/" + brandId);
       }

    render() {
        return(
        <tr >

            <td>{this.state.catName}</td>
            <td>{this.state.productName}</td>

            <td className="brand_dropdown">
                <Form>
                    <Form.Group className="brand_input" controlId="formHorizontalUnits">
                        <Form.Control
                            as="select"
                            size="sm"
                            value={this.state.selectedBrand}
                            custom
                            onChange={this.brandOnChangeHandler}     
                        >
                            {this.brandsOptions(this.state.brandDropdowns)}

                        </Form.Control>
                    </Form.Group>
                </Form>
            </td>

            <td>{formatDate(this.state.minRequiredDate)}</td>
            <td>{this.state.brandRequiredPackets} </td>
            <td>
                <NumberFormat value={this.state.brandPacketPrice} displayType={'text'} prefix="₹ "
                    thousandSeparator={true} thousandsGroupStyle='lakh' />
            </td>
            <td className="hyplink">
                {/* {console.log("hyplink",this.props.selectedSeason, this.props.selectedYear,this.props.selectedStatus, this.props.data.category_id, this.props.data.product_id, this.state.selectedBrand, this.props.data.month, this.props.data.category_name, this.props.data.product_name, this.state.brandRequiredPackets, this.state.brandTentativeAmount,this.state.brandName)} */}
                <OverlayTrigger key="top" placement="top"
                    overlay={<Tooltip id="">Click for Farmer Details</Tooltip>}>

                    <a onClick={() => this.navigateToPageProduct(this.props.selectedSeason, this.props.selectedYear,this.props.selectedStatus, this.props.data.category_id, this.props.data.product_id, this.state.selectedBrand, this.props.data.month, this.props.data.category_name, this.props.data.product_name, this.state.brandRequiredPackets, this.state.brandTentativeAmount,this.state.brandName )}
                    >
                        <span>&#x20B9;</span>

                        <NumberFormat value={this.state.brandTentativeAmount} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle='lakh' />

                    </a>

                </OverlayTrigger>

            </td>
        </tr>
        )
    }

    componentDidMount(){
     this.props.changeTotalAmount(this.props.data.brands[0].tentative_amount);
    }


}    