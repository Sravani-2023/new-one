import React, { Component } from 'react';
import { Row, Col, Form ,Button,Table,Modal, CloseButton} from 'react-bootstrap';
import "../assets/css/inputproducts.css";
import UserService from "../services/user.service";
import MaterialTable from 'material-table';
import tableIcons from './icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMapMarker, faMapMarkerAlt, faMobileAlt, faHome, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { TriggerAlert, } from './dryfunctions';
import AuthService from "../services/auth.service";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import NumberFormat from 'react-number-format';
import loaderNestedProduct from "../assets/img/loaderNestedProduct.gif";
import moment from 'moment';

function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}
function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}
export default class BoFarmerProductInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
         modalIsOpen:false,
         farmerList: [],
         productName:"",
         brandName:"",
         sendMonthFullName:"",
         Pricevalue:"",
         uniqueDataloading:true,
         villageDataLoading:true,
         villageList:[],
         villageFrmerName:"",
         villagePrdtName:"",
         villageContactName:"",
         villageName:"",
         fpoName: localStorage.getItem('fpoName'),
         isParentLogged: false


        }
    }
    gettingDate=(string) =>{
        const date = moment(string).format(' MMM. DD, YYYY')
        return date
    }
  
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
    navigateToPage = (pageName) => {
        const { fpoName, isParentLogged } = this.state

        if (isParentLogged) {
            this.props.history.push("/"+pageName +"/" + fpoName);
        }
        else {
            this.props.history.push("/" + pageName + "");
        }
    };
    
    componentDidMount() {
        var flag = false;
    const user = AuthService.getCurrentUser();
    if (!user) {
        this.props.history.push('/')
        return
    }
    if (user.is_parent) {
        this.setState({ isParentLogged: true })
    }
    const fpoId = localStorage.getItem("fpoId")
    const productFarmerData =JSON.parse(localStorage.getItem("productFarmerData"))
    
    // console.log("productFarmerData",productFarmerData)
    // console.log("productFarmerData",productFarmerData.sendYear)
    let season=productFarmerData.selectedSeason;
    let year=productFarmerData.selectedYear;
    let verifiedSend=productFarmerData.selectedStatus;
    // let fpoId=productFarmerData.selectedSeason;
    let categoryId=productFarmerData.categoryId;
    let productId=productFarmerData.productId;
    let brandId=productFarmerData.brandId;
    let sendMonth=productFarmerData.sendMonth;
    let sendYear=productFarmerData.sendYear;
     this.setState({
        productName:productFarmerData.productName,
        brandName:productFarmerData.BrandName,
        sendMonthFullName:productFarmerData.sendMonthFullName,
        Pricevalue:productFarmerData.price
     })
    //  console.log("here",season,year,verifiedSend,fpoId,categoryId,productId,brandId,sendMonth,sendYear)
   
    UserService.getProductFarmersComponent(season,year,verifiedSend,fpoId,categoryId,productId,brandId,sendMonth,sendYear).then(
        (response) => {
            flag = true; 
            // console.log("farmer response",response)
            if (response.data.success==true) {
                if( response.data.farmers.length!=0)
                {   
                    var sendData= response.data.farmers;
                    // var sortedfarmerList = sendData.sort(function(a, b) {
                    //     return b.village - a.village
                    // });
                //    var sortedfarmerList= sendData.sort(dynamicSort("village"));
                //    var sortedfarmerList= sendData

                    // console.log("sortedfarmerList",sortedfarmerList)

                this.setState({
                    // farmerList: response.data.farmers,
                    // farmerList: sortedfarmerList,
                    farmerList: sendData,


                    farmerDataLoading: false,
                    uniqueDataloading:false,

                })
                // console.log("farmerList",this.state.farmerList)
            }
            else{
                this.setState({
                    uniqueDataloading:false,

                })
            }
            }
            else{
                console.log("success false")
                this.setState({
                    uniqueDataloading:false,

                })
            }
        },
        (error) => {
            flag = true; 
            console.log("farmer error")
            this.setState({
                uniqueDataloading:false,

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
            this.navigateMainBoard()
            }
        }, 30000)

    )

    }
    handleQuantitySum=(rowData)=>{
               let qtySum=0; 
        rowData.month_components.map((item)=>{
            // console.log("it",item)
            item.components.map((data)=>{
                // console.log("dt",data.brands[0].qty_required)

                qtySum+=data.brands[0].qty_required
            })
        })
        let sendQty=parseFloat(qtySum).toFixed(2)
        return sendQty

    }
    handlePacketSum=(rowData)=>{
        let pktSum=0; 
 rowData.month_components.map((item)=>{
    //  console.log("it",item)
     item.components.map((data)=>{
        //  console.log("dt",data.brands[0].required_pkts)

         pktSum+=data.brands[0].required_pkts
     })
 })
 return pktSum

}
handleTentativeAmtSum=(rowData)=>{
    let TentSum=0; 
rowData.month_components.map((item)=>{
//  console.log("it",item)
 item.components.map((data)=>{
    //  console.log("dt",data.brands[0].tentative_amount)

     TentSum+=data.brands[0].tentative_amount
 })
})
return TentSum

}

// handleCropsData=()=>{
//     const{villageList}=this.state;
//    console.log("dk",villageList)
//    return villageList.map((farmer, index) => {
//          farmer.month_components.map((data)=>{
//             data.components.map((item)=>{
//     return <tr key={index}>
//                         <td>{item.crop_name}</td>

        
//         {/* <td>{formatDate(farmer.min_tentative_date)}</td>
//            {
//              farmer.month_components.map((item)=>{
//                 return <td>{parseFloat(item.components[0].brands[0].qty_required).toFixed(2)}</td>

//              })
//           }
//              */}
      

//     </tr>
//          })
//         })
// })


// //    return villageList.map((farmer, index) => {
// //               return (farmer.month_components.map((data)=>{
// //                   data.components.map((item)=>{
// //                     // console.log("items",item)
// //                     <td>{item.crop_name}</td>
// //                   })
// //               })
// //               )
//             // return <tr key={index}>
//             //     <td className="capitalise">{titleCase(farmer.farmer_name)}</td>
//             //     <td>{farmer.contact}</td>
//             //     <td>{farmer.village}</td>
           

//             // </tr>
//         // })
//  }
handleValueSum=(rowData)=>{
  
    let TentSum=0; 
rowData.map((village)=>{
village.month_components.map((item)=>{
 item.components.map((data)=>{

     TentSum+=data.brands[0].tentative_amount
 })
})
})
return TentSum

}
    render(){
        const{modalIsOpen,sendMonthFullName,farmerList,uniqueDataloading,villageList,villageDataLoading}=this.state;
        const OpenModalPopUp= (val,farmerId,frmrName,prdtName,contact,village) =>{
            const fpoId = localStorage.getItem("fpoId")
            const productFarmerData =JSON.parse(localStorage.getItem("productFarmerData"))
            let season=productFarmerData.selectedSeason;
            let year=productFarmerData.selectedYear;
            let verifiedSend=productFarmerData.selectedStatus;
            let categoryId=productFarmerData.categoryId;
            let productId=productFarmerData.productId;
            let brandId=productFarmerData.brandId;
            let sendMonth=productFarmerData.sendMonth;
            let sendYear=productFarmerData.sendYear;
            // console.log("Modal is open");
            this.setState({
                modalIsOpen:true,
                  villageFrmerName:frmrName,
                            villagePrdtName:prdtName,
                            villageContactName:contact,
                            villageName:village,
                            villageDataLoading:true
            })
           
            // console.log("village check",season,year,verifiedSend,fpoId,farmerId,categoryId,productId,brandId,sendMonth,sendYear)
            var flag=false;
            UserService.getProductVillageComponent(season,year,verifiedSend,fpoId,farmerId,categoryId,productId,brandId,sendMonth,sendYear).then(
                (response) => {
                    flag = true; 
                    // console.log("village response",response)
                    if (response.data.success==true) {
                        if(response.data.farmers){
                        this.setState({
                            villageList: response.data.farmers,
                            villageDataLoading: false,
                          



        
                        })
                        // console.log("happy",response)
                    }
                    else{
                       this.setState({
                        villageDataLoading:false
                       })
                    }
                    }
                    else{
                        console.log("success false")
                        this.setState({
                            villageDataLoading:false
                           })
                      
                    }
                },
                (error) => {
                    flag = true; 
                    console.log("farmer error")
                    this.setState({
                        uniqueDataloading:false,
                        villageDataLoading:false

        
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
                    this.navigateMainBoard()

                    }
                }, 30000)
        
            )
          



          }
        const handleClose = () =>{
            this.setState({
                modalIsOpen:false,
            })
        }
  
        const columns = [

            
            {
                title: "Village Name",
                field: "village",
                filtering:false,
            },
            {
                title: "Name of Farmer",
                field: "farmer_name",
                filtering:false,

            },
            {
                title: "Contact No.",
                field: "contact",
                filtering:false,

            },
           
            // {
            //     title: "Quantity Required",
            //     field: "",
            //     filtering:false,

            //     render: (rowData) => {
                  
            //         return (
            //              <div>{this.handleQuantitySum(rowData)}</div>
                     
                    
                         
                       


            //         //  return <td>{parseFloat(qtySum).toFixed(2)}</td>

            //             // return <td>{parseFloat(item.components[0].brands[0].qty_required).toFixed(2)}</td>

                     
                     
                     
            //         );
          
            //       },
           
            // },
            {
                title: "Tentative Date",
                field: "min_tentative_date",
                filtering:false,
                render: (rowData) => {
                  
                    return (
                         <div>{this.gettingDate(rowData.min_tentative_date)}</div>
                     
                    );
          
                  },

            },
            {
                title: "Total Packets",
                field: "",
                filtering:false,

                render: (rowData) => {
                  
                    return (
                         <div>{this.handlePacketSum(rowData)}</div>
                     
                    );
          
                  },
           
            },
            {
                title: "Tentative Amount (Rs.)",
                field: "",
                filtering:false,

                render: (rowData) => {
                
                    return (
                        <div  style={{color:"blue",cursor:"pointer"}} onClick={()=>OpenModalPopUp(true,rowData.farmer_id,rowData.farmer_name,rowData.product_name,rowData.contact,rowData.village)} 
                        > 
                            <NumberFormat value={this.handleTentativeAmtSum(rowData)} displayType={'text'} prefix="₹ "
        thousandSeparator={true} thousandsGroupStyle='lakh'/>
                            {/* Rs {this.handleTentativeAmtSum(rowData)} */}
                            </div>
                    
                   );
                    // return (
                     
                    //     rowData.month_components.map((item)=>{
                    //     return <td>Rs {item.components[0].brands[0].tentative_amount}</td>

                    //  })
                     
                     
                    // );
          
                  },
            },
         
        ];
     
        return(
            <div className="">
                 <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap">
                <a
                href="#"
                className="breadcrumb-item breadcrumbs__crumb pageBreadCrumbItem"
                onClick={() =>this.navigateMainBoard()}
               
                >
                <FontAwesomeIcon
                  icon={faHome}
                  className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                />
                &nbsp;Dashboard
              </a>
              <FontAwesomeIcon
                icon={faCaretRight}
                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"/>
               
              <a
                href="#"
                className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                onClick={() => this.navigateToPage("business-opportunity")}
               >
                Business Potential
              </a>
              <FontAwesomeIcon
                icon={faCaretRight}
                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"/>
              <a
                href="#"
                className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                onClick={() => this.navigateToPage("BoProductInput")}
               >
                 Product Business Potential
              </a>
            </div>
                     <div style={{width:"80%",margin:"auto",padding:"2px",borderRadius:"10px"}}>
              <Table striped bordered hover size="sm">
                                <thead>
                                    <tr className='dvaraBrownText' style={{backgroundColor:"#a3c614"}}>
                                        <td colSpan="9"><center><b> {sendMonthFullName} Month Input Requirement
                                            </b></center></td>
                                    </tr>
                                    {/* <tr style={{backgroundColor: "aliceblue"}}> */}
                                    <tr>


                                        <td colSpan="3" align='center'>
                                            <b>Product Name: <b className='dvaraBrownText'>&nbsp;&nbsp;{this.state.productName}</b>
                                            </b>
                                        </td>
                                        <td colSpan="3" align='center'>
                                            <b>Brand Name: <b className='dvaraBrownText'>&nbsp;&nbsp;{this.state.brandName}</b>
                                            </b>
                                        </td>
                                        <td colSpan="3" align='center'>
                                            <b>Value: <b  className='dvaraBrownText' 
                                            >&nbsp;&nbsp;   <NumberFormat value= {this.state.Pricevalue} displayType={'text'} prefix="₹ "
                                                             thousandSeparator={true} thousandsGroupStyle='lakh' style={{fontWeight:"800"}}/> 
                                                                                         

                                            {/* Rs {this.state.Pricevalue} */}
                                            </b>
                                            </b>
                                        </td>
                                    </tr>
                                </thead>
                  </Table>
                  </div>
                  {!uniqueDataloading?
                  <div style={{marginTop:"50px"}}>
                    {this.state.farmerList.length!=0?
                    <div>           
                        {/* <span style={{position:"relative",top:"15px",right:"25px",zIndex:"100",float:"right"}}> */}
                        <span style={{position:"relative",top:"15px",zIndex:"100",float:"right",marginLeft:"14px",marginRight:"15px"}}>

                                     <ReactHTMLTableToExcel
                                        id="data-table-xls-button"
                                        className="download-table-xls-button btn  mb-3 ExportButtonFrontClass"
                                        table="data-to-xls"
                                        filename="data"
                                        sheet="data"
                                       
                                        buttonText="Export"/>
                                        </span>
                       <Table striped bordered hover size="sm" className="table" id="data-to-xls" style={{display:"none"}}>
                                    
                       <thead>
                                     <tr className='headerComp' >
                                         <th>Village Name</th>
                                         <th>Farmer Name</th>
                                         <th>Contact No</th>
                                         {/* <th>Quantity Required</th> */}
                                         <th> Tentative Date</th>
                                         <th>Total Packets</th>
                                       
                                         <th>Tentative Amt</th>

                                     </tr>
                                 </thead>
                             <tbody>
                                {farmerList.map((farmer)=>{
                                   return <tr>
                                       <td>{farmer.village}</td>
                                       <td>{farmer.farmer_name}</td>
                                       <td>{farmer.contact}</td>
                                       <td>{this.handleQuantitySum(farmer)}</td>
                                       <td>{this.gettingDate(farmer.min_tentative_date)}</td>
                                       <td>{this.handlePacketSum(farmer)}</td>
                                       <td>{this.handleTentativeAmtSum(farmer)}</td>


                                       </tr>
                                })}
                                

                             </tbody>
                             
    
                  </Table>
























                   <MaterialTable
                           icons={tableIcons}
                           style={{ marginLeft: "55px"}}
                           title=""
                           data={farmerList}
                           columns={columns}
                           options={{
                                    // exportButton: true,
                                    // exportAllData: true,
                                    searchFieldAlignment: "right",
                                    actionsColumnIndex: -1,
                                    doubleHorizontalScroll: true,
                                    pageSize: 10,
                                    pageSizeOptions: [             
                                                    10,
                                                    20,
                                                    50,
                                                    100,
                                                  ],
                             headerStyle: {
                                        backgroundColor: "#A3C614",
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                         fontFamily: "barlow_reg",
                                         fontWeight: "bold",
                                         borderRight:"1px solid #e2e2e2",
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
                          : <p style={{textAlign:"center", color:"brown"}}>No Data To Display</p>}
                                        </div>
    :<img src={loaderNestedProduct} width="500px" style={{position:"relative",left:"30%",top:"20%"}}/>}
                                        <Modal show={modalIsOpen} onHide={handleClose}
                                          size="xl" style={{marginTop:"50px"}}
                                        >
                                     <Modal.Header closeButton>
                                     <Modal.Title>
                                         <span style={{position:"absolute",left:"86%",top:"15px"}}>
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="download-table-xls-button btn  mb-3 ExportButtonFrontClass"
                                        table="table-to-xls"
                                        filename="tablexls"
                                        sheet="tablexls"

                                        buttonText="Export Data"/></span>
                                     </Modal.Title>
                                     </Modal.Header>
                                    <Modal.Body style={{width:"93%",margin:"auto"}}>
                                    <Table striped bordered hover size="sm" className="table" id="table-to-xls">
                                       <thead>
                                    <tr className='dvaraBrownText' style={{backgroundColor:"#a3c614"}}>
                                        <td colSpan="14"><center><b> {this.state.sendMonthFullName} Month Input Requirement
                                            </b></center></td>
                                    </tr>
                                    <tr style={{backgroundColor: ""}}>
                                        <td colSpan="7" align="left" >
                                            <b>Farmer Name : <b className='dvaraBrownText'>&nbsp;&nbsp;{this.state.villageFrmerName}</b>
                                            </b>
                                        </td>
                                        <td colSpan="7"  rowspan="3" > <b>Product :</b> <span  style={{color:"rgba(114, 49, 12, 1)",fontWeight:"800"}}>{this.state.villagePrdtName} </span><br/>
                                        <b> 
                                            Value :</b> 
                                            <NumberFormat value= {this.handleValueSum(villageList)} displayType={'text'} prefix="₹ "
                                                             thousandSeparator={true} thousandsGroupStyle='lakh' style={{color:"rgba(114, 49, 12, 1)",fontWeight:"800"}}/> 
                                            {/* {this.handleValueSum(villageList)} */}
                                            </td>
                                        </tr>
                                        <tr >
                                        <td colSpan="7" >
                                            <b>Contact No: <b  className='dvaraBrownText'>&nbsp;&nbsp;{this.state.villageContactName}</b>
                                            </b>
                                        </td>
                                    </tr>
                                    <tr style={{backgroundColor: ""}}>
                                        <td colSpan="7">
                                            <b>Village Name: <b  className='dvaraBrownText' >&nbsp;&nbsp;{this.state.villageName}</b>
                                            </b>
                                        </td>
                                    </tr>
                                </thead>
                           {villageDataLoading?<div style={{height:"150px"}}><span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"10px"}}></span></div>:


                                <tbody>
                                <tr style={{backgroundColor: "#a3c614"}}>
                                  <th  colSpan="2" style={{textAlign:"center"}}>Crop Name</th>
                                  <th colSpan="4" style={{textAlign:"center"}}>Brand</th>
                                  <th colSpan="2" style={{textAlign:"center"}}>Tentative Date</th>
                                  <th colSpan="2" style={{textAlign:"center"}}>No of Packets</th>
                                  <th colSpan="2" style={{textAlign:"center"}}>Tentative Amount</th>

                                </tr>
                               
                                    {/* <td>vfg</td> */}
                                    {/* {this.handleCropsData(villageList)} */}
                                    {/* <td colSpan="2">1</td>
                                    <td colSpan="4">Asha 3066 bg ii(Rs 765) </td>
                                    <td colSpan="2" >Asha ncs 9011 bt 2(Rs 765) </td>

                                    <td colSpan="2">Gromor godavari urea (Rs 242) </td>
                                    <td colSpan="2">mno </td> */}

                                      {villageList.map((farmer, index) => {
                                          return farmer.month_components.map((data)=>{
                                            return  data.components.map((item)=>{
                                            return(
                                                <tr>
                                                <td colSpan="2">{item.crop_name}</td>
                                    <td colSpan="4">{item.brands[0].brand_name} </td>
                                    <td colSpan="2" >{formatDate(item.min_tentative_date)} </td>

                                    <td colSpan="2">{item.brands[0].required_pkts} </td>
                                    <td colSpan="2">
                                    <NumberFormat value={item.brands[0].tentative_amount}  displayType={'text'} prefix="₹ "
                                  thousandSeparator={true} thousandsGroupStyle='lakh'/>
                                    
                                    </td> 

                                                </tr>
   
                                               )
                                            })
                                        //    data.components.map((item)=>{
                                        //     console.log("item22",item)

                                        //     console.log("item",item.crop_name)
                                          
                                         
                                        //    })
                                       })

                                    })
                                }

                                   
                                </tbody>
    }
                  </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
            </div>
        )
    }
}