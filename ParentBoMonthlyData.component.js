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
import MaterialTable from "material-table";
import tableIcons from './icons';
import moment from 'moment';
function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}

export default class ParentBoMonthlyData extends Component {
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
            modalIsOpen:false,
            fpoDataLoading: false,
            fpoNestedList:[],
            MonthNameDisplay:"",



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

    //  navigateToPageProduct=(selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price,BrandName)=>{
    //      console.log("ask",selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price,BrandName)
       
    //     let arr = BindmonthYear.split('-');
       
    //     let sendMonth=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
    //     let sendMonthFullName=arr[0];
    //     let sendYear=arr[1];
    //     let productFarmerData={
    //        "selectedSeason":selectedSeason,
    //          "selectedYear":selectedYear,
    //          "selectedStatus":selectedStatus,
    //          "categoryId":categoryId,
    //          "productId":productId,
    //           "brandId":brandId,
    //           "sendMonth":sendMonth,
    //           "sendYear":sendYear,
    //           "categoryName":categoryName,
    //           "productName":productName,
    //            "total_packets":total_packets,
    //            "price":price,
    //            "BrandName":BrandName,
    //            "sendMonthFullName":sendMonthFullName
    //     }
    
     
    //     // this.props.history.push("/BoFarmerProductInput/" + selectedSeason + "/" + selectedYear +  "/" + productId +  "/" + brandId);
    //    }
    ProductFpoData=(season,year,verifiedSend,categoryId,productId,brandId,sendMonth,sendYear)=>{
        // console.log("check point",season,year,verifiedSend,categoryId,productId,brandId,sendMonth,sendYear)
        var flag=false;
       UserService.BoParentVillageComponent(season,year,verifiedSend,categoryId,productId,brandId,sendMonth,sendYear).then(
                (response) => {
                    flag = true; 
                    // console.log("modal response",response)
                    if (response.data.success==true) {
                      
                        this.setState({
                            fpoNestedList: response.data.data,
                            fpoDataLoading: false,
                          



        
                        })
                  
                    }
                    else{
                        console.log("success false")
                        this.setState({
                            fpoDataLoading: false,
                           })
                      
                    }
                },
                (error) => {
                    flag = true; 
                    console.log("farmer error")
                    this.setState({
                        fpoDataLoading: false,


        
                    })
                    if (error.response){
                      TriggerAlert("Error",error.response.data.message,"error");
                    }
                    else {
                      TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
                    }
                    this.setState({
                      modalIsOpen:false,
                    })
                  },
                  setTimeout(() => {
                    if(flag==false){
                        this.setState({
                            showloader:false,
                        });
                    TriggerAlert("Error","Response Timed out, Please try again","info");
                    this.navigateToPage("dashboard")
                    }
                }, 30000)
        
            )
    }
    // FpoNameProductLevelData=(nestedData)=>{
    //     return nestedData.map((fpo,index)=>{
    //         return <tr key={index}>
    //          <td colSpan="4">{fpo.fpo_name}</td>
    //          <td   >{fpo.fpo_block}</td>
    //          <td  >{fpo.fpo_dist}</td>
    //          <td  >{fpo.fpo_state}</td>
    //          <td  >{fpo.category}</td>
    //          <td  >{fpo.product}</td>
    //          <td  >{fpo.brand_name}</td>
    //          <td  >{fpo.required_pkts}</td>
    //          <td  >{fpo.pkt_price}</td>
    //          <td >
    //          <NumberFormat value={fpo.tentative_amount} displayType={'text'}                   
    //                 thousandSeparator={true} thousandsGroupStyle='lakh'/>
             
    //          </td>

    //             </tr>

    //     }) 

    // }
    handleOverallModalSum=(data)=>{
        let sum=0;
        data.map((item)=>{
           
                let addedSumValue=item.tentative_amount
               sum=sum+addedSumValue
         
        })
        return sum

    }
    moveToPage=(pageName,fpoId,fpoName)=>{
     
        localStorage.setItem("fpoId", JSON.stringify(fpoId));
        localStorage.setItem("fpoName", fpoName);
        localStorage.removeItem("ProductAccordionData");
        localStorage.removeItem("filterItemData");

      

  
        // this.props.history.push("/" + pageName + "/" + fpoName);
        this.props.history.push("/" + pageName + "/" + fpoName);


    }

    render() {
       const{modalIsOpen,fpoNestedList,fpoDataLoading,MonthNameDisplay}=this.state;
        //    console.log("fpoNestedList",fpoNestedList)
      
        const OpenModalPopUp= (val,selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear) =>{
            let arr = BindmonthYear.split('-');
       
            let sendMonth=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
            let sendMonthFullName=arr[0];
            let sendYear=arr[1];
            console.log(" ProductModal is open");
            this.setState({
                modalIsOpen:true,
                fpoDataLoading:true,
                MonthNameDisplay:sendMonthFullName
                
            })
           
            // console.log("village check",selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price,BrandName)
          
             this.ProductFpoData(selectedSeason,selectedYear,selectedStatus, categoryId, productId, brandId,sendMonth,sendYear)
           
          



          }
        const handleClose = () =>{
            this.setState({
                modalIsOpen:false,
            })
        }

      
        const fpoColumnList = [
            
          
            {
                title: "Fpo Name",
                field: "fpo_name",
                filtering:false,
              
                headerStyle:{
                //   backgroundColor:"blue",
                  position:"sticky",
                  top:0,
                  zIndex: 1000,
                  textOverflow:'ellipsis',
                 overflow:'hidden',
                 fontWeight: "bold",
                 resize: "horizontal",
                 overflowX: "overlay",
                 overflowY: "hidden",
                },

                cellStyle: {
                    //    position: '-webkit-sticky',
                  position: 'sticky',
                  background: '#f1f1f1',
                  left: 0,
                  zIndex: 1,
                  minWidth: 300,
                  maxWidth: 300
                  },
                  render: (rowData) => {
                    let fpoId = rowData.sub_fpo_id;
                    let fpoName=rowData.fpo_name;
                    return (
                      <div
                        onClick={() =>
                          this.moveToPage("BoProductInput",fpoId,fpoName)
                           
                        }
                      >
                        <a href="#!">{rowData.fpo_name}</a>
                      </div>
                    );
          
                  },

               
            },
            
           
            {
                title: "Block",
                field: "fpo_block",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "District",
                field: "fpo_dist",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "State",
                field: "fpo_state",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Category",
                field: "category",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Product",
                field: "product",
                filtering:false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Brand",
                field: "brand_name",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Packets",
                field: "required_pkts",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Packet Price",
                field: "pkt_price",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Tentative Amount",
                field: "tentative_amount",
                filtering:false,
                render:(rowData)=>{
                    return <NumberFormat value={rowData.tentative_amount} displayType={'text'}                   
                    thousandSeparator={true} thousandsGroupStyle='lakh'/>
                },
                cellStyle: {
                    width: "15%"
                }
            },

          
        ];






















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
                <OverlayTrigger key="top" placement="top"
                    overlay={<Tooltip id="">Click for Farmer Details</Tooltip>}>

                    <a onClick={() =>OpenModalPopUp(true,this.props.selectedSeason, this.props.selectedYear,this.props.selectedStatus, this.props.data.category_id, this.props.data.product_id, this.state.selectedBrand, this.props.data.month )}
                    >
                        <span>&#x20B9;</span>
                        <NumberFormat value={this.state.brandTentativeAmount} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle='lakh' />

                    </a>

                </OverlayTrigger>

            </td>
            <Modal show={modalIsOpen} onHide={handleClose}
                                          size="xl" style={{marginTop:"50px"}}
                                          
                                        >
                                     <Modal.Header closeButton style={{backgroundColor: "rgb(163, 198, 20,0.9)",
                                   textAlign: "center", padding: "15px",color: "blue"}}>
                                     <Modal.Title >
                                   <span style={{textAlign:"center",alignItems:"center"}}> {MonthNameDisplay} Month Input Requirement </span>
                                 
                                     </Modal.Title>
                                     </Modal.Header>
                                    <Modal.Body style={{width:"100%"}}>
                                    <div style={{marginTop:"20px"}}>
                                      
                                        {fpoDataLoading?<span className="spinner-border spinner-border-lg mainCropsFarmerLoader" ></span>:

                                        <div>
                                               {/* <Table striped bordered hover size="sm"  className="table" id="table-to-xls2">
                                                 <thead>
                                                     <tr className="dvaraGreenBG" align="center">
                                                         <th colSpan="4">FPO Name</th>
                                                         <th >Block </th>
                                                         <th >District</th>
                                                         <th >State</th>
                                                         <th > Category</th>
                                                         <th >Product</th>
                                                         <th >Brands</th>
                                                         <th >Total Packets</th>

                                                         <th >Packet Price</th>

                                                         <th >Tentative Amount</th>
                                                     </tr>
                                                 </thead>
                                                 <tbody>
                                                   
                                                     {this.FpoNameProductLevelData(fpoNestedList)}
                                                     <tr className="total_comp_amt">
                                                 <td colSpan="12"><center><strong>Total Amount</strong></center></td>
                                               
                                                <td><strong><span>&#x20B9;</span>
                                                <NumberFormat value={this.handleOverallModalSum(fpoNestedList)} displayType={'text'}
                                                thousandSeparator={true} thousandsGroupStyle='lakh'/>                                                    
                                                                                            
                                                </strong></td>
                                            </tr>
                                                 </tbody>
                                             </Table>  */}
                                                   <MaterialTable icons={tableIcons}

title=""
style={{ marginLeft: "30px" }}
data={fpoNestedList}
columns={fpoColumnList}
actions={[
]}
options={{
    maxBodyHeight:"500px",
    actionsColumnIndex: -1,
    doubleHorizontalScroll: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 50, 100, { value: fpoNestedList.length, label: 'All' }],
    exportButton: true,
   
    headerStyle: {
        backgroundColor: '#A3C614',
        color: '#fff',
        fontSize: '1.2rem',
        fontFamily: 'barlow_reg',
        fontWeight: 'bold',
        position: 'sticky',
        top:0,
        overflow:"hidden",
        left: 0,
       
    },
    
    rowStyle: {
        backgroundColor: '#f1f1f1',
        borderBottom: '2px solid #e2e2e2',
        fontSize: '0.9rem'
    },
    filtering: true
}}
/>
                                
                                        <Table style={{marginLeft:"29px",width:"97%"}}>
                                        <thead>
                                     <tr style={{backgroundColor:"#A3C614"}}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                         <td colSpan="14"><b> 
                                             Total Tentative Amount: <NumberFormat value={this.handleOverallModalSum(fpoNestedList)} displayType={'text'}
                                                thousandSeparator={true} thousandsGroupStyle='lakh'/>   
                                           </b></td>

                                     </tr>
                                     </thead>
                                        </Table> 
                                        </div>
    }
                                        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </tr>
        
        )
    }

    componentDidMount(){
     this.props.changeTotalAmount(this.props.data.brands[0].tentative_amount);
    }


}    