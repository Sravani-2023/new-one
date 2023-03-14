

import React, { Component } from "react";
import { Form, Table, Row, Col, Modal, Button, Tab, OverlayTrigger, Tooltip, Container } from "react-bootstrap";
import moment from 'moment';
import "../assets/css/inputComp.css";
import UserService from "../services/user.service";

import "../index.css";
import "../assets/img/fr.svg";

function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}
function addAfter(array, index, newItem) {
    return [
        ...array.slice(0, index),
        newItem,
        ...array.slice(index)
    ];
}

function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}
export default class ComponentTable extends Component {
    constructor(props) {
        super(props);
        this.handleBrandChange = this.handleBrandChange.bind(this)
        this.wrapper = React.createRef();

        this.state = {
            cropData: "",
            area: "",
            monthlyList: [],
            uniqueDataloading: true,
            modalIsOpen: false,
            farmerList: [],
            selProduct: "",
            selCategory: "",
            farmerDataLoading: false,
            selTotalPkts: "",
            selPktPrice: ""
        }
        //this.setBounds = this.setBounds.bind(this);
    }
    handleBrandChange = (e, key, category, product) => {
        this.setState({ uniqueDataloading: true })
        var comps = this.props.allComponents
        var uniqueComps = this.props.components

        const selRow = comps[key].find(comp => comp.brand_name === e.target.value &&
            comp.product === product && comp.category === category);
        const removeRow = uniqueComps[key].find(comp => comp.product === product && comp.category === category);
        const index = uniqueComps[key].findIndex(item => item.product === product && item.category === category)
        uniqueComps[key].splice(index, 1);
        const newkeyObj = addAfter(uniqueComps[key], index, selRow)
        uniqueComps[key] = newkeyObj

        this.setState({
            uniqueCompData: uniqueComps,
            uniqueDataloading: false
        })




    }
    sumMonthlyAmt(key) {

        const result = Object.values(this.state.uniqueCompData[key]).reduce((r, { amount }) => r + amount, 0);
        return result

    }
    brandsOptions = (brandList) =>

        brandList.map((brand, i) =>

        (
            <option key={i} name={brand.brand_name} value={brand.brand_name}>
                {brand.brand_name} (&#x20b9; {brand.pack_price})
            </option>
        ))

    showModal = (val, selecteddata, category, product, total_packets, price) => {

        this.setState({
            modalIsOpen: true,
            farmerDataLoading: true,
            selCategory: category,
            selProduct: product,
            selTotalPkts: total_packets,
            selPktPrice: price


        });
        UserService.getComponentFarmers({ 'farmer_list': selecteddata, 'packet_price': price }).then(
            (response) => {
                // console.log(response)
                if (response.data.success) {
                    this.setState({
                        farmerList: response.data.data,
                        farmerDataLoading: false
                    })
                }
            }

        )
    }


    renderTableData(key) {

        return this.props.components[key].map((month, index) => {
            // return unique(this.state.uniqueCompData[key], ["category", "product"]).map((month, index) => {

            return <tr key={index}>
                <td>{month.category}</td>
                <td>{month.product}</td>
                <td className="brand_dropdown">
                    <Form>
                        <Form.Group className="brand_input" controlId="formHorizontalUnits">
                            <Form.Control
                                as="select"
                                size="sm"
                                value={month.brand_name}
                                custom
                                ref={this.wrapper}
                                onChange={(e, val) => this.handleBrandChange(e, key, month.category, month.product)}
                            >
                                {this.brandsOptions(month.brands)}

                            </Form.Control>
                        </Form.Group>
                    </Form>
                    {/* {month.brand_name} */}
                </td>
                <td>{formatDate(month.expected_date)}</td>
                <td>{month.calc_logic}  Qty/Acre</td>
                <td>{month.tot_packets}</td>
                <td>{month.packet_price}</td>
                <td className="hyplink">
                    <OverlayTrigger key="top" placement="top"
                        overlay={<Tooltip id="">Click for Farmer Details</Tooltip>}>

                        <a onClick={() => this.showModal(true, month.farmer_list,
                            month.category, month.product, month.tot_packets, month.packet_price)}>
                            <span>&#x20B9;</span> {month.amount}
                        </a>

                    </OverlayTrigger>

                </td>
            </tr>
        })

    }

    farmersData = (farmerList) => {
        return farmerList.map((farmer, index) => {
            return <tr key={index}>
                <td className="capitalise">{titleCase(farmer.first_name)}</td>
                <td className="capitalise">{titleCase(farmer.last_name)}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.village}</td>
                <td>{farmer.no_of_packets}</td>
                <td><span>&#x20B9;</span> {farmer.amount}</td>

            </tr>
        })
    }


    render() {
        const {modalIsOpen, farmerList, farmerDataLoading,
            selCategory, selProduct, selTotalPkts, selPktPrice } = this.state
       
        const hideModal = () => {
            this.setState({
                modalIsOpen: false
            })
        }
        // console.log("sites", this.props.components);

        return (
            <div>

                {
                    Object.keys(this.props.components).map((key, index) => (
                        // Object.keys(componentsList).map((key, index) => (


                        <Table striped bordered hover size="sm" key={index}>
                            <thead >
                                <tr className="header-bg">
                                    <td colSpan="8"><center><b>{key} Month Input Requirements</b></center></td>
                                </tr>
                            </thead>
                            <thead>
                                <tr className='headerComp' >
                                    <th>Category</th>
                                    <th>Product</th>
                                    <th>Brand</th>
                                    <th>Expected Date</th>
                                    <th>Application Rate</th>
                                    <th>Total Packets</th>
                                    <th>Packet Price</th>
                                    <th>Tentative Amt</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTableData(key)}
                                <tr className="total_comp_amt">
                                    <td colSpan="7"><center><strong>Total Amount</strong></center></td>
                                    <td><strong><span>&#x20B9;</span>{this.sumMonthlyAmt(key)}</strong></td>
                                </tr>

                            </tbody>

                        </Table>
                        

                    ))
                }
                   <Modal show={modalIsOpen}
                                onHide={hideModal}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered /* onEntered={modalLoaded} */
                                className="modal-adjust"
                                dialogClassName="my-modal"
                            >
                                <Modal.Header>
                                    <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText">{this.state.cropData.crop__crop_name}</span></Modal.Title>

                                </Modal.Header>
                                <Modal.Body>
                                    <Container>
                                    <Row align="center">
                                        
                                        <Col>
                                            Category: <strong>{selCategory}</strong>
                                        </Col>
                                        <Col>
                                            Product : <strong>{selProduct}</strong>
                                        </Col>
                                        <Col>No.Of Packets: <strong>{selTotalPkts}</strong></Col>
                                        <Col>Price: <strong><span> &#x20B9;</span> {selPktPrice}</strong></Col>

                                    </Row>
                                    </Container>
                                    <br></br>
                                    {(farmerDataLoading) ? (<div className="mainCropsFarmerLoaderWrap">
                                        <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                                    </div>) : (
                                        <div className="farmersUploadWrap">
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Phone</th>
                                                        <th>Village</th>
                                                        <th>No.of Packets</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.farmersData(farmerList)}
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


            </div>

        );
    }



}
