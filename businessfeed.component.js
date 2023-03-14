import React, { Component, Fragment } from 'react';
import { Row, Col, ProgressBar, Form ,Button} from 'react-bootstrap';
import "../assets/css/landholding.css";
import "../assets/css/inputproducts.css";
import UserService from "../services/user.service";
import MaterialTable from 'material-table';
import tableIcons from './icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMapMarker, faMapMarkerAlt, faMobileAlt, faHome, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { TriggerAlert, } from './dryfunctions';
import AuthService from "../services/auth.service";
import crop_growing from "../assets/img/crop_growing.gif";


import NumberFormat from 'react-number-format';
var mainCardObj = {
    total_sites: 0,
    total_area: 0,
    own_sites: 0,

};

function addAfter(array, index, newItem) {
    return [
        ...array.slice(0, index),
        newItem,
        ...array.slice(index)
    ];
}

//have used class Component and inside that have declared all the needed variable in this.state.
//  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class BusinessFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cropsdata: [],
            dateRanges: {},
            showloader: true,
            activeCardId: 'crops',
            isParentLogged: false,
            fpoName: localStorage.getItem('fpoName'),
            uniqueDataloading: false,
            cowCattleFeedData: [],
            uniqueCowFeedData: [],
            buffaloCattleFeedData:[],
            uniqueBuffaloFeedData:[],
            procOutputdata: [],
            CurrentYear:"",
            CurrentSeason:""
        }
    }

    // on Click on crop Name inside Material Table in the first and last row this navigateToPage function will be Called
    navigateToPage = (season, year, isVerified, cropId, area,
        cropName = null, compType) => {
        // as we r using the same navigateToPage function multiple times so have applied condition based on that it will take to respective page.
        const { fpoName, isParentLogged } = this.state

        if (isParentLogged) {
            this.props.history.push("/inputcomponent/" + fpoName + "/" + season + "/" + year + "/" + isVerified +
                "/" + area + "/" + cropId);
        } else {
            this.props.history.push("/inputcomponent/" + season + "/" + year + "/" + isVerified + "/" + area +
                "/" + cropId);
        }

    };
   

navigateToOutputPage = (cropName,villageDate, villageTentId, villageTentSeason, villageTentVerified) => {
  
    const { fpoName, isParentLogged } = this.state

        if (isParentLogged) {
            this.props.history.push("/TentativeVillageLevel/"+fpoName+ "/" +cropName+ "/" + villageDate + "/" + villageTentId + "/" + villageTentSeason + "/" + 
         villageTentVerified);
        } else {
            this.props.history.push("/TentativeVillageLevel/"+cropName+ "/" + villageDate + "/" + villageTentId + "/" + villageTentSeason + "/" + 
            villageTentVerified);
        }

}
navigateToProductBo=()=>{
    const { fpoName, isParentLogged } = this.state

    if (isParentLogged) {
        localStorage.removeItem("ProductAccordionData");
        localStorage.removeItem("filterItemData");

        this.props.history.push("/BoProductInput/" + fpoName);
    }
    else {
        localStorage.removeItem("ProductAccordionData");
        localStorage.removeItem("filterItemData");

        this.props.history.push("/" + "BoProductInput" + "");
    }
}

    navigateToFeedPage = (productName, brand, cattleType, category, packetPrice, totalPackets, totalAmt) => {
      
            const { fpoName, isParentLogged } = this.state

            if (isParentLogged) {
                this.props.history.push("/villagelevelfeed/" +fpoName + "/" + category + "/" + productName + "/" + brand + "/" + 
            cattleType + "/" + packetPrice + '/' + totalPackets + "/" + totalAmt);
            } else {
                this.props.history.push("/villagelevelfeed/" + category + "/" + productName + "/" + brand + "/" + 
                cattleType + "/" + packetPrice + '/' + totalPackets + "/" + totalAmt);
            }
    
    }


    activeCard(cardId) {
        localStorage.setItem("activeCardId", JSON.stringify(cardId));
        this.setState({
            isLandHoldingTabLoading: true,
            activeCardId: cardId
        })
    }


    //Common function to redirect dashboard with respected logged users
    navigateMainBoard = () => {
        const { isParentLogged } = this.state
        // console.log("in navigateMainBoard------isParentLogged", isParentLogged)
        if (isParentLogged) {
            this.props.history.push("/fpohomeData");
        }
        else {
            this.props.history.push("/dashboard");
        }
    }

    // this function is called in breadcrumb.
    // navigateToComponent = (pageName) => {
    //     const { fpoName, isParentLogged } = this.state

    //     if (isParentLogged) {
    //         this.props.history.push("/inputs/" + fpoName);
    //     }
    //     else {
    //         this.props.history.push("/" + pageName + "");
    //     }
    // };

    handleBrandChange = (e, product, cattle_type) => {
        this.setState({ uniqueDataloading: true })
        if(cattle_type == 'cow'){
            var feed = this.state.cowCattleFeedData
            var uniqueFeed = this.state.uniqueCowFeedData
        }
        else{
            var feed = this.state.buffaloCattleFeedData
            var uniqueFeed = this.state.uniqueBuffaloFeedData

        }
        const selRow = feed.find(comp => comp.brand_name === e.target.value &&
            comp.product_name === product.product_name);
        const removeRow = uniqueFeed.find(comp => comp.product_name === product.product_name);
        const index = uniqueFeed.findIndex(item => item.product_name === product.product_name)
        uniqueFeed.splice(index, 1);
        const newkeyObj = addAfter(uniqueFeed, index, selRow)
        uniqueFeed = newkeyObj
        if(cattle_type == 'cow'){
            this.setState({
                uniqueCowFeedData: uniqueFeed,
                uniqueDataloading: false
            })
        }else{
            this.setState({
                uniqueBuffaloFeedData: uniqueFeed,
                uniqueDataloading: false
            })
        }
    }

    brandsOptions = (brandList) => {
        return brandList.map((brand, i) =>
        (
            <option key={i} name={brand} value={brand}>
                {brand}
            </option>
        ))
    }


    render() {
        const { cropsdata, dateRanges, showloader, uniqueCowFeedData, uniqueBuffaloFeedData,procOutputdata ,isParentLogged} = this.state;
        const cowfeedcolumns = [
           
            {
                title: "Category",
                field: "feed_category",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Product",
                field: "product_name",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Brand",
                field: "",
                export:false,
                filtering: false,
                render: (rowData) => {
                    return (
                        <Form>
                            <Form.Group className="brand_input" controlId="formHorizontalUnits">
                                <Form.Control
                                    as="select"
                                    size="sm"
                                    value={rowData.brand_name}
                                    custom
                                    onChange={(e, val) => this.handleBrandChange(e, rowData, 'cow')}
                                >
                                    {this.brandsOptions(rowData.brand_list)}

                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )
                },
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Brand",
                field:"brand_name",             
                hidden:true,
                export:true, 
            },
            {
                title: "Daily Requirement",
                field: "daily_requirement",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
                render: (rowData)=>{
                   return String(rowData.daily_requirement)+" "+rowData.unit}
            },
            {
                title: "Packet Size",
                field: "packet_size",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },

                render: (rowData)=>{
                   return String(rowData.packet_size)+" " + rowData.unit}

            },

            {
                title: "Packet Price (₹)",
                field: "packet_price",
                export: false,
                //   render: (rowData)=>{                   
                //     return ("₹"+ rowData.packet_price)
                // },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Packet Price (Rs.)",       
                field: "packet_price",       
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Price/Unit (₹)",
                field: "price_per_unit",
                filtering: false,
                export:false,
                render: (rowData)=>{                   
                   return rowData.price_per_unit - Math.floor(rowData.price_per_unit) !== 0?parseFloat(rowData.price_per_unit).toFixed(2)
                    :
                    rowData.price_per_unit;
                    // "₹"+parseFloat(                                      
                },
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Price/Unit (Rs.)",       
                field: "price_per_unit",       
                hidden: true,
               
                export: true,
                searchable: true,
              },

            {
                title: "Package Requirement",
                field: "quantity",
                render: (rowData)=>{                   
                    return <NumberFormat value={rowData.quantity} displayType={'text'}                   
                    thousandSeparator={true} thousandsGroupStyle='lakh'/>
                },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount(₹)",
                field: "total_amount",
                export:false,
                render: (rowData)=>{
                    let productName = rowData.product_name
                    let brand = rowData.brand_name
                    let cattleType = 'cow'
                    let category = rowData.feed_category
                    let packetPrice = rowData.packet_price
                    let totalPackets = rowData.packet_nos
                    let totalAmt = rowData.total_amount
                    return  <a href="javascript:void(0);"><NumberFormat value={rowData.total_amount} displayType={'text'} prefix="₹ "
                    onClick={() => this.navigateToFeedPage(productName, brand, cattleType, category, packetPrice, totalPackets,
                        totalAmt) }
                    thousandSeparator={true} thousandsGroupStyle='lakh' /></a>

                },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount(Rs.)",       
                field: "total_amount",       
                hidden: true,
                export: true,
                searchable: true,
              },

        ]
        const buffalofeedcolumns = [
           
            {
                title: "Category",
                field: "feed_category",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Product",
                field: "product_name",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Brand",
                field: "",
                filtering: false,
                export:false,
                render: (rowData) => {
                    return (
                        <Form>
                            <Form.Group className="brand_input" controlId="formHorizontalUnits">
                                <Form.Control
                                    as="select"
                                    size="sm"
                                    value={rowData.brand_name}
                                    custom
                                    onChange={(e, val) => this.handleBrandChange(e, rowData, 'buffalo')}
                                >
                                    {this.brandsOptions(rowData.brand_list)}

                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )
                },
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Brand",
                field:"brand_name",             
                hidden:true,
                export:true, 
            },
            {
                title: "Daily Requirement",
                field: "daily_requirement",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
                render: (rowData)=>{
                    return String(rowData.daily_requirement)+" "+rowData.unit}
            },
            {
                title: "Packet Size",
                field: "packet_size",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
                render: (rowData)=>{
                    return String(rowData.packet_size)+" "+rowData.unit}
            },
            {
                title: "Packet Price (₹)",
                field: "packet_price",
                export:false,
                // render: (rowData)=>{                   
                //     return ("₹"+ rowData.packet_price)
                // },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Packet Price (Rs.)",       
                field: "packet_price",       
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Price/Unit (₹)",
                field: "price_per_unit",
                export:false,
                render: (rowData)=>{  
                    return rowData.price_per_unit - Math.floor(rowData.price_per_unit) !== 0?parseFloat(rowData.price_per_unit).toFixed(2)
                    :
                    rowData.price_per_unit;                 
                    // return ("₹"+ rowData.price_per_unit)
                },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Price/Unit (Rs.)",       
                field: "price_per_unit",               
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Package Requirement",
                field: "quantity",
                render: (rowData)=>{
                    return <NumberFormat value={rowData.quantity} displayType={'text'}
                    thousandSeparator={true} thousandsGroupStyle='lakh'/>

                },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount(₹)",
                field: "total_amount",
                export:false,
                render: (rowData)=>{
                    let productName = rowData.product_name
                    let brand = rowData.brand_name
                    let cattleType = 'buffalo' 
                    let category = rowData.feed_category
                    let packetPrice = rowData.packet_price
                    let totalPackets = rowData.packet_nos
                    let totalAmt = rowData.total_amount
                    return <a href="javascript:void(0);"><NumberFormat value={rowData.total_amount} displayType={'text'}  prefix="₹ "
                    onClick={() => this.navigateToFeedPage(productName, brand, cattleType,  category, packetPrice, 
                            totalPackets, totalAmt) }
                    thousandSeparator={true} thousandsGroupStyle='lakh' /></a>

                },
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Tentative Amount (Rs.)",       
                field: "total_amount",       
                hidden: true,
                export: true,
                searchable: true,
              },

        ]
        const columns = [

            {
                title: "Crop Name",
                field: "crop__crop_name",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Status",
                field: "is_verified",
                lookup: { 1: "Unverified", 2: "Verified" },
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Season",
                field: "season",
                lookup: { Zaid: "Zaid", Kharif: "Kharif", Rabi: "Rabi" },
                defaultFilter: [this.state.CurrentSeason],
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Year",
                field: "date_range",
                lookup: dateRanges,
                defaultFilter: [this.state.CurrentYear],
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Total Area (in Acres)",
                field: "TotalArea",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Total Yield (in Qtl.)",
                field: "TotalYield",
                filtering: false,
                cellStyle: {
                    width: "15%",
                },
            },
            {
                title: "Input Requirements",
                field: "",
                filtering: false,
                render: (rowData) => {
                    let cropId = rowData.crop__id;
                    let season = rowData.season;
                    // let year = rowData.year;
                    let year = rowData.date_range;

                    let isVerified = rowData.is_verified;
                    let area = rowData.TotalArea;
                    return (
                        <div
                            onClick={() =>
                                this.navigateToPage(season, year, isVerified, cropId, area)
                            }
                        >
                            <a href="#!">VIEW</a>
                        </div>
                    );
                },
                cellStyle: {
                    width: "15%",
                },
            },
        ];
        const procurementcolumns = [

            {
                title: "Crop Name",
                field: "crop_name",
                filtering: false,
                render: (rowData) => {
                    let cropName=rowData.crop_name
                    let date_Range = rowData.get_params.date_range
                    let CropVillageId = rowData.get_params.crop_id
                    let cropSeasonVillage = rowData.get_params.season
                    let cropVerifiedVillage = rowData.get_params. is_verified
                
                    return (
                      <div
                        onClick={() =>
                            this.navigateToOutputPage(
                                cropName,
                                date_Range,
                                CropVillageId,
                                cropSeasonVillage,
                                cropVerifiedVillage,
                            
                            )
                          }
                      >
                        <a href="javascript:void(0);">{rowData.crop_name}</a>
                      </div>
                  
                    );
          
                  },
               
            },
           
            {
                title: "Year",
                field: "year",
                //  lookup: { "2020-2021": "2020-2021", "2021-2022": "2021-2022", "2022-2023": "2022-2023" },

                // filtering:false,
                lookup:dateRanges,
                defaultFilter: [this.state.CurrentYear]
            },
           
            {
                title: "Season",
                field: "season",
                lookup: { Zaid: "Zaid", Kharif: "Kharif", Rabi: "Rabi" },
                defaultFilter: [this.state.CurrentSeason],
                // filtering:false,
             
            },
            {
                title: " Verification Status",
                field: "is_verified",
                lookup: { Verified: "Verified", "Not Verified": "Not Verified" },
                // filtering:false,
               
            },
            {
                title: "Total Acreage (Acre)",
                field: "total_crop_area",
                filtering:false,
              
            },
            {
                title: "Estimated Production (Qtl.)",
                field: "estimated_crop_yield",
                filtering:false,

               
            },
            {
                title: "Avg Price (₹)",
                field: "tentative_price",
                export :false,
                render: (rowData)=>{                   
                    return rowData.tentative_price!=="NA" ? "₹"+rowData.tentative_price : rowData.tentative_price;
                },
                filtering:false,
              
            },
            {
                title: "Avg Price (Rs.)",       
                field: "tentative_price",               
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Total Tentative value (₹)",
                field: "total_tentative_price",
                export:false,
                render: (rowData)=>{                   
                    return rowData.total_tentative_price!=="NA" ?"₹"+ rowData.total_tentative_price : rowData.total_tentative_price;
                },
                filtering: false, 
              
            },
            {
                title: "Total Tentative value (Rs.)",       
                field: "total_tentative_price",               
                hidden: true,
                export: true,
                searchable: true,
              },
            {
                title: "Actual Yields",
                field: "actual_crop_yield",
                filtering: false,
            },
        ];

        return (
            <section className="mainWebContentSection">
                <Fragment>
                    <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap">
                        <a
                            href="#"
                            className="breadcrumb-item pageBreadCrumbItem"
                            onClick={() => this.navigateMainBoard()}
                        >
                            <FontAwesomeIcon
                                icon={faHome}
                                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                                style={{ fontSize: "0.7rem" }}
                            />
                            &nbsp;Dashboard
                        </a>
                    </div>
                      {isParentLogged?<div style={{position:"relative",top:"-11px",left:"5%",color:"brown",fontSize:"17px"}}>FPO Name : {this.state.fpoName}</div>:""}
                    <div className="wrap LandHoldingMainCardsWrap"
                    //  style={{ boxShadow: "inset 10px 10px 50px #a3c614"}}
                     >

                        <Row style={{justifyContent:"space-evenly"}}>

                            {/* <Col md="1">

                            </Col> */}
                            <Col md="3">
                                <div id="total_area"
                                    onClick={this.activeCard.bind(this, "crops")}
                                    className={`card-counter landHoldingMainCards ${this.state.activeCardId === "crops" ? "active" : ""}`}>
                                            <span className="CropMainCardsIcon CropIcon"></span>
                                    <span className="count-name" style={{ 'font-size': '22px',color:"rgba(114, 49, 12, 1)" }}>Crop-wise Input </span>
                                    {/* <span className="landHoldingMainCardsIcon SiteAreaIcon"></span> */}
                                    {/* <span className="count-numbers dvaraBrownText">{mainCardObj.total_products}</span> */}
                                    {/* <span className="count-name" style={{ 'font-size': '32px',color:"rgba(114, 49, 12, 1)" }}> <img src={crops_plant} width="18%" className="businessIcon1"/>Crops</span> */}
                                </div>
                            </Col>
                            <Col md="3">
                                <div id="own"
                                    // onClick={this.activeCard.bind(this, "cattle")}
                                    onClick={this.navigateToProductBo}
                                    className={`card-counter landHoldingMainCards`}>
                                            <span className="inputProductIcon "></span>
                                    <span className="count-name" style={{ 'font-size': '22px',color:"rgba(114, 49, 12, 1)" }}>Product-wise Input</span>
                                  
                                </div>
                            </Col>
                            <Col md="3">
                            <div id="own"
                                    onClick={this.activeCard.bind(this, "Tentoutput")}
                                    className={`card-counter ProcurementMainCards ${this.state.activeCardId === "Tentoutput" ? "active" : ""}`}>
                                            <span className="ProcurementOwnedIcon "></span>
                                    <span className="count-name" style={{ 'font-size': '22px',color:"rgba(114, 49, 12, 1)" }}> Output</span>
                                   
                                </div>
                            </Col>
                            <Col md="3">
                                <div id="own"
                                    onClick={this.activeCard.bind(this, "cattle")}
                                    className={`card-counter landHoldingMainCards ${this.state.activeCardId === "cattle" ? "active" : ""}`}>
                                            <span className="CattleOwnedIcon "></span>
                                    <span className="count-name" style={{ 'font-size': '22px',color:"rgba(114, 49, 12, 1)" }}>Cattle Feed</span>
                                    {/* <span className="landHoldingMainCardsIcon CompanyIcon"></span> */}
                                    {/* <span className="count-numbers dvaraBrownText">{mainCardObj.total_orders}</span> */}
                                    {/* <span className="count-name" style={{ 'font-size': '31px',color:"rgba(114, 49, 12, 1)" }}><img src={cattle_feed} width="18%" className="businessIcon2"/>Cattle Feed</span> */}
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {this.state.activeCardId == 'crops' ?
                        (<div className="landholdingHeader wrap">
                            <Row>
                                <Col lg="12" md="12" sm="12" className="noPadding">
                                    <div className="PageHeading padding15">
                                        <h4
                                            className="farmerListHeading dvaraBrownText"
                                            style={{ marginLeft: "25px", fontSize: "22px" }}>
                                            Crops List
                                        </h4>
                              {/* <button className="productBoButton" style={{ marginLeft: "25px" }} onClick={this.navigateToProductBo} >
                                 Product List
                             <span></span><span></span><span></span><span></span>
                             </button> */}
                                    </div>
                                    {showloader ? (
                                        <div className="mainCropsFarmerLoaderWrap">
                                            <img src={crop_growing} height="200px" style={{ position: "relative", top: "100px", left: "40%" }} />
                                        </div>
                                    ) : (
                                        <MaterialTable
                                            icons={tableIcons}
                                            style={{ marginLeft: "30px" }}
                                            title=""
                                            data={cropsdata}
                                            columns={columns}
                                            options={{
                                                exportButton: true,
                                                exportAllData: true,
                                                maxBodyHeight:600,
                                                actionsColumnIndex: -1,
                                                doubleHorizontalScroll: true,
                                                pageSize: 10,
                                                pageSizeOptions: [             
                                                    10,
                                                    20,
                                                    50,
                                                    100,
                                                    { value:cropsdata.length, label: "All" },
                                                  ],
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
                        </div>) : 
                         this.state.activeCardId=="Tentoutput" ?
                         (<div className="landholdingHeader wrap">
                         <Row>
                             <Col lg="12" md="12" sm="12" className="noPadding">
                                 <div className="PageHeading padding15">
                                     <h4
                                         className="farmerListHeading dvaraBrownText"
                                         style={{ marginLeft: "25px", fontSize: "22px" }}>
                                       Tentative Output
                                     </h4>
                                 </div>
                                 {showloader ? (
                                     <div className="mainCropsFarmerLoaderWrap">

                                         <img src={crop_growing} height="200px" style={{ position: "relative", top: "100px", left: "40%" }} />
                                     </div>
                                 ) : (

                                     <MaterialTable
                                         icons={tableIcons}
                                         style={{ marginLeft: "30px" }}
                                         title=""
                                         data={procOutputdata}
                                         columns={procurementcolumns}
                                         options={{
                                            exportButton: true,
                                            exportAllData: true,
                                             maxBodyHeight:600,
                                             actionsColumnIndex: -1,
                                             doubleHorizontalScroll: true,
                                             pageSize: 10,
                                             pageSizeOptions: [             
                                                 10,
                                                 20,
                                                 50,
                                                 100,
                                                 { value:procOutputdata.length, label: "All" },
                                               ],
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
                     </div>) 
                         :
                        (
                            <div className="landholdingHeader wrap">
                                <Row>
                                    <Col lg="12" md="12" sm="12" className="noPadding">
                                        <div className="PageHeading padding15">
                                            <h4
                                                className="farmerListHeading dvaraBrownText"
                                                style={{ marginLeft: "25px", fontSize: "22px" }}
                                            >
                                                Cow Feed
                                            </h4>
                                        </div>
                                        {showloader ? (
                                            <div className="mainCropsFarmerLoaderWrap">

                                                <img src={crop_growing} height="200px" style={{ position: "relative", top: "100px", left: "40%" }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <MaterialTable
                                                    icons={tableIcons}
                                                    style={{ marginLeft: "30px" }}
                                                    title=""
                                                    data={uniqueCowFeedData}
                                                    columns={cowfeedcolumns}

                                                    options={{
                                                      
                                                        actionsColumnIndex: -1,
                                                        doubleHorizontalScroll: true,
                                                        pageSize: 10,
                                                        pageSizeOptions: [             
                                                            10,
                                                            20,
                                                            50,
                                                            100,
                                                            { value:uniqueCowFeedData.length, label: "All" },
                                                          ],
                                                        exportAllData: true,
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
                                                <br></br>
                                                <div className="PageHeading padding15">
                                                    <h4
                                                        className="farmerListHeading dvaraBrownText"
                                                        style={{ marginLeft: "25px", fontSize: "22px" }}
                                                    >
                                                        Buffalo Feed
                                                    </h4>
                                                </div>
                                                <MaterialTable
                                                    icons={tableIcons}
                                                    style={{ marginLeft: "30px" }}
                                                    title=""
                                                    data={uniqueBuffaloFeedData}
                                                    columns={buffalofeedcolumns}

                                                    options={{
                                                       
                                                        actionsColumnIndex: -1,
                                                        doubleHorizontalScroll: true,
                                                        pageSize: 10,
                                                        pageSizeOptions: [             
                                                            10,
                                                            20,
                                                            50,
                                                            100,
                                                            { value:uniqueBuffaloFeedData.length, label: "All" },
                                                          ],
                                                        exportAllData: true,
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

                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        )
                    }

                </Fragment>
            </section>
        );


    }
    // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
    //  Here if response is not true then api will through an error message.
 
    componentDidMount() {
        var flag = false;
        const user = AuthService.getCurrentUser();
        const currentYear = user.current_year;
        const currentSeason = user.current_season;
        const fpoId = localStorage.getItem("fpoId");
        const activeCard =JSON.parse(localStorage.getItem("activeCardId"));
        if (!user) {
            this.props.history.push('/')
            return
        }
        if (user.is_parent) {
            this.setState({ isParentLogged: true })
        }
        if (activeCard) {
            this.setState({ activeCardId: activeCard },()=>{
                // console.log("active",this.state.activeCardId)

            })
        }

        if (user) {
            this.setState({
              currentUser: user,
              CurrentYear:currentYear,
              CurrentSeason:currentSeason,
            },()=> console.log("ppppppppp",this.state.CurrentYear));           
          }

        UserService.getCropsList(fpoId).then(
            (response) => {
                flag = true;
                // console.log("componentDidMount", response.data);
                var dateDict = {};
                response.data.date_range.map((date) => {
                    dateDict[date] = date;
                });
                this.setState({
                    cropsdata: response.data.crops,
                    dateRanges: dateDict,
                    showloader: false,
                });
                // console.log("cropsdata", this.state.cropsdata);

                //     setTimeout(() => {
                //       this.setState({showloader: false })
                //  }, 5000)
                // console.log("dateRanges", this.state.dateRanges)
            },
            (error) => {
                flag = true;
                this.setState({
                    showloader: false,
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
                if (error.response) {
                    TriggerAlert("Error", error.response.data.message, "error");
                } else {
                    TriggerAlert(
                        "Error",
                        "Server closed unexpectedly, Please try again",
                        "error"
                    );
                }
            },
            // we r using setTimeOut function to display error message for a period of Time.
            setTimeout(() => {
                if (flag == false) {
                    this.setState({
                        showloader: false,
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    // this.props.history.push("/dashboard");
                    this.navigateMainBoard()
                }
            }, 30000)
        );
       
        UserService.getFpoFeedData('fpo',fpoId).then(
            (response) => {
                if(response.data.success){
                var flag = true;
                const reponseCowFeed = response.data.data.cow
                const responeBufFeed = response.data.data.buffalo
                var uniqueCowFeedArray = []
                var uniqueBuffaloFeedArray = []
                
                // console.log("reponseCowFeed",reponseCowFeed)
                if(reponseCowFeed.length > 0 ){
                    var cowfeedData = reponseCowFeed.sort(function(a, b) {
                        return b.priority - a.priority
                    });
                    // console.log("cowfeedData",cowfeedData)

                    uniqueCowFeedArray = [
                        ...new Map(cowfeedData.map((item) => [item["product_name"], item])).values(),
                    ];
                }
                if(responeBufFeed.length > 0 ){
                    var buffaloFeedData = responeBufFeed.sort(function(a, b) {
                        return b.priority - a.priority
                    });
                    
                    uniqueBuffaloFeedArray = [
                        ...new Map(buffaloFeedData.map((item) => [item["product_name"], item])).values(),
                    ];
                }
                // console.log("uniqueCowFeedArray--", uniqueCowFeedArray, "uniqueBuffaloFeedArray--", uniqueBuffaloFeedArray)
                this.setState({
                    cowCattleFeedData: cowfeedData,
                    uniqueCowFeedData: uniqueCowFeedArray,
                    buffaloCattleFeedData: buffaloFeedData,
                    uniqueBuffaloFeedData: uniqueBuffaloFeedArray,
                })
            }
            else{
                this.setState({
                    showloader: false,
                })
            }
            },
            
            (error) => {
                flag = true;
                this.setState({
                    showloader: false,
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
                if (error.response) {
                    TriggerAlert("Error", error.response.data.message, "error");
                } else {
                    TriggerAlert(
                        "Error",
                        "Server closed unexpectedly, Please try again",
                        "error"
                    );
                }
            },
            // we r using setTimeOut function to display error message for a period of Time.
            setTimeout(() => {
                if (flag == false) {
                    this.setState({
                        showloader: false,
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    // this.props.history.push("/dashboard");
                    this.navigateMainBoard()
                }
            }, 30000)
        )
        UserService.getTentitaveOutputList("fpo",fpoId).then(
            (response) => {
                flag = true;
                // console.log("tentative output", response.data.data);
                if(response.data.success){
                    this.setState({
                        procOutputdata: response.data.data,                       
                        showloader: false,
                    });

                }
               
                // console.log("dateRanges", this.state.dateRanges)
            },
            (error) => {
                flag = true;
                this.setState({
                    showloader: false,
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
                if (error.response) {
                    TriggerAlert("Error", error.response.data.message, "error");
                } else {
                    TriggerAlert(
                        "Error",
                        "Server closed unexpectedly, Please try again",
                        "error"
                    );
                }
            },
            // we r using setTimeOut function to display error message for a period of Time.
            setTimeout(() => {
                if (flag == false) {
                    this.setState({
                        showloader: false,
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    // this.props.history.push("/dashboard");
                    this.navigateMainBoard()
                }
            }, 30000)
        );
        
    }
}
