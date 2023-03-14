import React, { Component, Fragment, useState } from "react";
import { Redirect, Route, Link } from 'react-router-dom';
import UserService from "../services/user.service";
import "../assets/css/crops.css";
import MaterialTable from "material-table";
import tableIcons from './icons';
import {TriggerAlert,} from './dryfunctions';
import AuthService from "../services/auth.service";
import "../assets/css/landholding.css";
import "../assets/css/inputproducts.css";

import FullParentBoMonthData from "./FullParentBoMonthData.component";

import {
    Container,
    Card,
    Row,
    Col,
    Accordion,
    Tab,Nav,Tabs,
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

import { faHtml5, faHome,faDownload } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from 'react-number-format';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function unique(arr, keyProps) {
    const kvArray = arr.map(entry => {
     const key = keyProps.map(k => entry[k]).join('|');
     return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
   }
function uniqeBrandData(brands) {
    
    const finalBrandsArr = unique(brands, ["category_name", "product_name"])
    return finalBrandsArr
    }
    
//have used class component . Initially we are defining all the state variables which are used inside the component.
export default class FpoBO extends Component {
    constructor(props) {
        super(props)
     
        
        this.state = {
         
            showloader:false,

            activeCardId: 'crops',
            selectedStatus:"all",
            selectedSeason:"Kharif",
            selectedYear:"2022-2023",
            selectedMonth: new Date().getMonth() + 1,
            dateRanges: [],
            InputCropList:[],
            cropInputDataloading: true,
            staticResponse:[],
            selectedProductYear:"2022-2023",
            selectedProductSeason:"Kharif",
            selectedProductStatus:"all",
            Outputloader:true,
            procOutputdata: [],
            cattleFieldData:[],
            cattleloader:true,
            showDownloadLoader:false,
            buttonDisableExport:false,
            ProductInputDataloading: false,

  
        



            
          };
    }
 
    //for navigation to dashboard
  
    navigateToPage2= (pageName) => {
       
      this.props.history.push("/" + pageName + "");
    };
    //for moving to fpo Name component and saving data in localstorage.
    moveToPage=(pageName,fpoId,fpoName)=>{
        const{activeCardId}=this.state;
        localStorage.setItem("fpoId", JSON.stringify(fpoId));
        localStorage.setItem("fpoName", fpoName);
        localStorage.setItem("activeCardId", JSON.stringify(activeCardId));

  
        this.props.history.push("/" + pageName + "/" + fpoName);
        // this.props.history.push("/" + pageName + "");


    }
 
    
      //in componentDidMount initially we are checking if it is a valid user or not .Then we are checking if valid user is parent or not then accordinly we are 
    // navigating to the component. Then we are showing error message on frontend also if API returns an error in response.
    componentDidMount() {
     
          const user = AuthService.getCurrentUser();
          const fpoId = localStorage.getItem("fpoId");

          if(!user){
            this.props.history.push('/')
            return
          }
          if(!user.is_parent)
          this.props.history.push("/dashboard")
          var flag=false;
          UserService.getYearRanges().then(
            (response) => {
                flag = true;
              
                this.setState({
                    
                    dateRanges: response.data.date_ranges,
                    showloader: false,
                });
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
            setTimeout(() => {
                if (flag == false) {
                    this.setState({
                        showloader: false,
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    this.props.history.push('/fpohomeData')  
                }
            }, 30000)
        );
        //callig crop level api
        this.handleTableData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus,this.state.selectedMonth)
         //output api
        UserService.getTentitaveOutputList("fpo",-1).then(
            (response) => {
                flag = true;
                if(response.data.success){
                    this.setState({
                        procOutputdata: response.data.data,                       
                        Outputloader: false,
                    });

                }
               
                // console.log("dateRanges", this.state.dateRanges)
            },
            (error) => {
                flag = true;
                this.setState({
                    Outputloader: false,
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
                        Outputloader: false,
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    this.props.history.push("/fpohomeData");
                }
            }, 30000)
        );
        //cattlefeed api
        UserService.getFpoFeedData('fpo',-1).then(
            (response) => {
                 flag = true;
                // const reponseCowFeed = response.data.data.cow
                // const responeBufFeed = response.data.data.buffalo
                // var uniqueCowFeedArray = []
                // var uniqueBuffaloFeedArray = []
                
            
                this.setState({
                    cattleFieldData:response.data.data,
                    cattleloader:false


                    
                })
                
            },
            
            (error) => {
                flag = true;
                this.setState({

                    cattleloader:false,
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
                        cattleloader:false
                    });
                    TriggerAlert("Error", "Response Timed out, Please try again", "info");
                    this.props.history.push("/fpohomeData");
                }
            }, 30000)
        )
       

    }
    //checking which card is active and showing status active and according to the consition calling product level api.
    activeCard(cardId) {
        // localStorage.setItem("activeCardId", JSON.stringify(cardId));
        this.setState({
            isLandHoldingTabLoading: true,
            activeCardId: cardId
        },()=>{
            if(this.state.activeCardId=="ProductLevel")
            {

                // console.log("here")
                const BoParentProductAccordion =JSON.parse(localStorage.getItem("BoParentProductAccordion"));
                const BoParentfilterItem=JSON.parse(localStorage.getItem("BoParentfilterItem"));
                // console.log("BoParentfilterItem",BoParentfilterItem)
                if(BoParentProductAccordion)
                { 
                    this.setState({
                        staticResponse:BoParentProductAccordion,
                       
                        selectedProductYear:BoParentfilterItem.year,
                        selectedProductSeason:BoParentfilterItem.season,
                        selectedProductStatus:BoParentfilterItem.status,
        
        
                    })
                }
                else{
                    // console.log("nogone")
                    this.InputProductLevelData(this.state.selectedProductSeason,this.state.selectedProductYear,this.state.selectedProductStatus)

            }
            }
              
        })
    }
   //after selecting season calling the api
    handleselectedSeason=(e)=>{
        this.setState({
            selectedSeason:e.target.value,
            cropInputDataloading: true,

    
        },()=>this.handleTableData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus,this.state.selectedMonth)
        )
    }
   //after selecting year calling the api
    
    handleselectedYear=(e)=>{
        this.setState({
            selectedYear:e.target.value ,
            cropInputDataloading: true,

        },()=>this.handleTableData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus,this.state.selectedMonth)
        )
    }
   //after selecting status calling the api
    
    handleselectstatus=(e)=>{
        this.setState({
            selectedStatus:e.target.value,
            cropInputDataloading: true,

        },()=>this.handleTableData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus,this.state.selectedMonth))
    }
       //after selecting month calling the api

    handleselectedMonth=(e)=>{
        this.setState({
            selectedMonth:e.target.value,
            cropInputDataloading: true,

    
        },()=>this.handleTableData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus,this.state.selectedMonth))
    }
       //after selecting season calling the product level api

    handleProductselectedSeason=(e)=>{
        this.setState({
            selectedProductSeason:e.target.value,
            ProductInputDataloading: true,

    
        },()=>this.InputProductLevelData(this.state.selectedProductSeason,this.state.selectedProductYear,this.state.selectedProductStatus)
        )
    }
       //after selecting year calling the product level api
    
    handleProductselectedYear=(e)=>{
        this.setState({
            selectedProductYear:e.target.value ,
            ProductInputDataloading: true,

        },()=>this.InputProductLevelData(this.state.selectedProductSeason,this.state.selectedProductYear,this.state.selectedProductStatus)
        )
    }
         //after selecting status calling the product level api
    
    handleProductselectstatus=(e)=>{
        this.setState({
            selectedProductStatus:e.target.value,
            ProductInputDataloading: true,

        },()=>this.InputProductLevelData(this.state.selectedProductSeason,this.state.selectedProductYear,this.state.selectedProductStatus))
    }
   // calling product level api with respect to season,year,status and storing data in storage.
    InputProductLevelData=(season,year,status)=>{
      
            
        
        const filterItemData={
            "season":season,
             "year":year,
             "status":status
        }
        this.setState({
            ProductInputDataloading: true,

        })
        var flag=false;
        UserService.getProductInputComponents(season,year,status,-1).then(
            (response) => {
                flag = true; 
                if (response.data.success) {

                     if(response.data.component_data.length!=0)
                     {
                    this.setState({
                         staticResponse:response.data,
                         ProductInputDataloading: false,

                    });
                    localStorage.setItem("BoParentfilterItem",JSON.stringify(filterItemData))
                    localStorage.setItem("BoParentProductAccordion", JSON.stringify(this.state.staticResponse));
                }
                else{
                  this.setState({
                    ProductInputDataloading: false,
                    staticResponse:[],

                  })
                  localStorage.setItem("BoParentfilterItem",JSON.stringify(filterItemData))
                  localStorage.setItem("BoParentProductAccordion", JSON.stringify(this.state.staticResponse));
              }
              }
                else{
                    localStorage.setItem("BoParentfilterItem",JSON.stringify(filterItemData))
                    localStorage.setItem("BoParentProductAccordion", JSON.stringify(this.state.staticResponse));
                  
                    this.setState({
                     
                        staticResponse:[],
                        ProductInputDataloading: false,



                    })
                }

            },
            (error) => {
                console.log("error api")
                flag = true; 
                localStorage.removeItem("BoParentfilterItem");
                localStorage.removeItem("BoParentProductAccordion");
                this.setState({
                    ProductInputDataloading: false,
                    staticResponse:[],
                  

                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
                if (error.response){
                    TriggerAlert("Error",error.response.data.message,"error");
                  }
                  else {
                    TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
                  }
            },
            // setTimeout(() => {
            //     if(flag==false){
            //         this.setState({
            //             showloader:false,
            //         });
            //     TriggerAlert("Error","Response Timed out, Please try again","info");
            //     this.props.history.push("/fpohomeData");

            //     }
            // }, 45000)
        );
    }
    //calling crop level api with respect to season,year,status,month.
    handleTableData=(season,year,status,month)=>{
     var flag=false;
     UserService.getParentBoInputCropComponent(season,year,status,month).then(
         (response) => {
             flag = true; 
            //   console.log("cropresponse_____",response)
             if (response.data.success) {
               
                 this.setState({
                      InputCropList:response.data.fpo_input_data,
                       cropInputDataloading: false,
                 });
           
           }
             else{
                 this.setState({
                    cropInputDataloading: false,
                    InputCropList:[]

                 })
             }

         },
         (error) => {
             console.log("error api")
             flag = true; 
             this.setState({
                cropInputDataloading: false,

                 content:
                     (error.response &&
                         error.response.data &&
                         error.response.data.message) ||
                     error.message ||
                     error.toString(),
             });
             if (error.response){
                 TriggerAlert("Error",error.response.data.message,"error");
               }
               else {
                 TriggerAlert("Error","Server closed unexpectedly, Please try again","error");
               }
         },
        //  setTimeout(() => {
        //      if(flag==false){
        //          this.setState({
        //              showloader:false,
        //          });
        //      TriggerAlert("Error","Response Timed out, Please try again","info");
        //      this.props.history.push("/fpohomeData");

        //      }
        //  }, 45000)
     );

    }
    //mapping year options from a api call.
    YearOptions = (yearList) => {
        if(yearList.length!==null){
          return yearList.map((year, index) =>
        (
            <option key={index} name={year} value={year}>
                {year}
            </option>
        ))
        }
      
    }
    //on click on export button this api is getting called in terms of product level.
    handleProductExport=()=>{
        const {
        selectedProductYear,
        selectedProductSeason,
        selectedProductStatus,
        }=this.state;
        // console.log("export  product clicked")
        this.setState({
            showDownloadLoader:true,
            buttonDisableExport:true
        })
        let exportselectedStatus="all";
        if(selectedProductStatus==="yes")
        exportselectedStatus="Verified"
        if(selectedProductStatus==="no")
        exportselectedStatus="UnVerified"
        UserService.getProductExportData(this.state.staticResponse).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', exportselectedStatus+ "/" + selectedProductSeason+ "/"+selectedProductYear+'.xlsx');
                document.body.appendChild(link);
                link.click();
                this.setState({
                    showDownloadLoader:false,
                    buttonDisableExport:false
    
                })
              
             
            },
            (error) => {
                this.setState({
                    showDownloadLoader: false,
                    buttonDisableExport:false,
    
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
                if (error.response) {
                    TriggerAlert("Error","A failure occurred during process of services. Please contact your respective administrators.", "error");
                } else {
                    TriggerAlert(
                        "Error",
                        "Server closed unexpectedly, Please try again",
                        "error"
                    );
                }
            },
        
         
        );
    }
    //disabling other filters after selecting single filter in crop .
    handleCropRowDisable=()=>{
        const{cropInputDataloading}=this.state;
        if(cropInputDataloading)
        return "handleCropRowDisableclass" 
        else return ""
    }
   //disabling other filters after selecting one filter in product level.
    handleProductRowDisable=()=>{
        const{ProductInputDataloading}=this.state;
        if(ProductInputDataloading)
        return "handleCropRowDisableclass" 
        else return ""
    }
    render() {
         const{selectedStatus,selectedYear,selectedSeason,dateRanges,selectedMonth,InputCropList,cropInputDataloading,selectedProductYear
        ,selectedProductSeason,selectedProductStatus,staticResponse,ProductInputDataloading,procOutputdata,OutputLoader,cattleFieldData,buttonDisableExport}=this.state;
        const RenderProductDiv = () => { 
         
            if(staticResponse.component_data.length!=0){
         
            return (
                   <div style={{marginTop:"30px",width:"94%",marginLeft:"50px"}}>
             <Accordion
             defaultActiveKey="Data0">
             {staticResponse.component_data.map((keyData, index) => {
              return <FullParentBoMonthData  {...this.props} keyData={keyData} index={index} selectedSeason={selectedProductSeason}selectedYear={selectedProductYear}selectedStatus={selectedProductStatus} />
             })
             }
            </Accordion> 
           </div> 
            )
            }
      
      
      }
      const brandsTentativeValue = (givenBrands) => {
        const finalBrands = uniqeBrandData(givenBrands)
        let sum=0;
        finalBrands.map((item)=>{
           
            let addedSumValue=item.tentative_amount
            sum=sum+addedSumValue
            
        })
        return sum
      }
     
        const inputCrops = [

            {
                title: "Fpo Name",
                field: "fpo_name",
                filtering:false,
                render: (rowData) => {
                    let fpoId = rowData.sub_fpo_id;
                    let fpoName=rowData.fpo_name;
                    return (
                      <div
                        onClick={() =>
                          this.moveToPage("business-opportunity",fpoId,fpoName)
                           
                        }
                      >
                        <a href="#!">{rowData.fpo_name}</a>
                      </div>
                    );
          
                  },

                cellStyle: {
                  minWidth: 300,
                  maxWidth: 300
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
            // {
            //     title: "Verification Status",
            //     field: this.state.selectedStatus,
            //     filtering: false,
            //     render: (rowData) => {
                 
            //         return (
            //           <div>
            //           {this.state.selectedStatus==="no"? "Unverified" :this.state.selectedStatus==="yes"?"Verified":"All"}
                     
            //           </div>
            //         );
          
            //       },

            //     cellStyle: {
            //         width: "15%"
            //     }
            // },
            {
                title: "Total Acerage (in Acre)",
                field: "crop_area",
                filtering:false,
                render: (rowData) => {
                 
                    return (
                      <div>
                       {parseFloat(rowData.crop_area).toFixed(3)}
                     
                      </div>
                    );
          
                  },

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total No of Crops",
                field: "crop_count",
                filtering:false,
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Tentative Value",
                field: "",
                filtering: false,
                render : (rowdata) => {
                    return(
                        <div>
                        <NumberFormat value={brandsTentativeValue(rowdata.brands)} displayType={'text'}                   
                        thousandSeparator={true} thousandsGroupStyle='lakh' prefix="₹ "/>
                        </div>
                    )
                },
                cellStyle: {
                    width: "15%"
                }
            },
           
          

        ];
        const tentativeOutputColumn = [

            {
                title: "FPO Name",
                 field:"fpo_name",
                filtering: false,
                render: (rowData) => {
                    let fpoId = rowData.sub_fpo_id;
                    let fpoName=rowData.fpo_name;
                    return (
                      <div
                        onClick={() =>
                          this.moveToPage("business-opportunity",fpoId,fpoName)
                           
                        }
                      >
                        <a href="#!">{rowData.fpo_name}</a>
                      </div>
                    );
          
                  },
                cellStyle: {
                    minWidth: 300,
                    maxWidth: 300
                  },
                
             
               
            },
           
            {
                title: "Block",
                field: "fpo_block",
                filtering:false,
             
            },
           
            {
                title: "District",
                field: "fpo_dist",
                filtering:false,

            },
            {
                title: "State",
                field: "fpo_state",
                filtering:false,
              
               
            },
            {
                title: "Verification Status",
                field: "is_verified",
                // filtering:false,
                lookup: { Verified: "Verified", "Not Verified": "Not Verified" },

              
               
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
                title: "Total Tentative value (Rs)",       
                field: "total_tentative_price",    
                filtering:false,           
              
             
              },
           
        ];
        const cattlecolumns = [

            {
                title: "Fpo Name",
                field: "fpo_name",
                filtering:false,
                render: (rowData) => {
                    let fpoId = rowData.sub_fpo_id;
                    let fpoName=rowData.fpo_name;
                    return (
                      <div
                        onClick={() =>
                          this.moveToPage("business-opportunity",fpoId,fpoName)
                           
                        }
                      >
                        <a href="#!">{rowData.fpo_name}</a>
                      </div>
                    );
          
                  },

                cellStyle: {
                  minWidth: 300,
                  maxWidth: 300
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
                title: "Total No Of Cattle",
                field: "cattle_nos",
                filtering: false,

                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Package Requirement",
                field: "packet_nos",
                filtering:false,
                render:(rowData)=>{
                    return <NumberFormat value={rowData.packet_nos} displayType={'text'}                   
                    thousandSeparator={true} thousandsGroupStyle='lakh'/>
                },
                
                cellStyle: {
                    width: "15%"
                }
            },
            {
                title: "Total Tentative Value (Rs)",
                field: "total_amount",
                filtering:false,
                render:(rowData)=>{
                    return <NumberFormat value={rowData.total_amount} displayType={'text'}                   
                    thousandSeparator={true} thousandsGroupStyle='lakh'/>
                },
                cellStyle: {
                    width: "15%"
                }
            },
         
           
          

        ];
        return (
            <section className="mainWebContentSection">
                <Fragment>
                    <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap">
                        <a
                            href="#"
                            className="breadcrumb-item pageBreadCrumbItem"
                            onClick={() =>this.navigateToPage2("fpohomeData")}

                        >
                            <FontAwesomeIcon
                                icon={faHome}
                                className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                                style={{ fontSize: "0.7rem" }}
                            />
                            &nbsp;Dashboard
                        </a>
                    </div>

                    <div className="wrap LandHoldingMainCardsWrap"
                     >

                        <Row style={{justifyContent:"space-evenly"}}>

                       
                            <Col md="3">
                                <div id="total_area"
                                    onClick={this.activeCard.bind(this, "crops")}
                                    className={`card-counter landHoldingMainCards ${this.state.activeCardId === "crops" ? "active" : ""}`}>
                                            <span className="CropMainCardsIcon CropIcon"></span>
                                    <span className="count-name" style={{ 'font-size': '22px',color:"rgba(114, 49, 12, 1)" }}>Crop-Wise Input</span>
                               
                                </div>
                            </Col>
                            <Col md="3">
                                <div id="own"
                                    // onClick={this.navigateToProductBo}
                                    onClick={this.activeCard.bind(this, "ProductLevel")}
                                    className={`card-counter landHoldingMainCards ${this.state.activeCardId === "ProductLevel" ? "active" : ""}`}>

                                    {/* className={`card-counter landHoldingMainCards`}> */}
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
                                 
                                </div>
                            </Col>
                        </Row>

                    </div>
                  
                    {this.state.activeCardId == 'crops' ?
                        (<div className="landholdingHeader wrap">
                                   <div style={{width:"80%",margin:"auto"}}>
                      <Row className={this.handleCropRowDisable()}>
                        <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  value={selectedStatus}
                                  onChange={this.handleselectstatus}
                                  style={{border:"1px solid grey",color:"brown"}}
                                >
                                  <option value="all">All</option>

                                  <option value="yes">Verified</option>
                                  <option value="no">Unverified</option>
                                
                                </Form.Control>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  value={selectedSeason}
                                  onChange={this.handleselectedSeason}
                                  style={{border:"1px solid grey",color:"brown"
                                }}

                                >
                                  <option value="Kharif">Kharif</option>


                                  <option value="Zaid">Zaid</option>
                                  <option value="Rabi">Rabi</option>
                                
                                </Form.Control>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  value={selectedYear}
                                  onChange={this.handleselectedYear}
                                  style={{border:"1px solid grey",color:"brown"}}

                                >
                                        {this.YearOptions(dateRanges)}

                                
                                </Form.Control>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  value={selectedMonth}
                                  onChange={this.handleselectedMonth}
                                  style={{border:"1px solid grey",color:"brown"}}

                                >
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>



                                
                                </Form.Control>
                              </Col>
                      
                              </Row>

                        </div> 
                         {cropInputDataloading?<span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"140px"}}></span>:
                        <div style={{marginTop:"20px"}}>

                     <span style={{position:"relative",top:"15px",zIndex:"100",float:"right",marginLeft:"14px",marginRight:"15px"}}>

                     <ReactHTMLTableToExcel
                         id="cropWise-table-xls-button"
                      className="download-table-xls-button btn  mb-3 ExportButtonFrontClass"
                        table="cropWise-to-xlsx"
                     filename="cropWise"
                 sheet="cropWise"
   
                   buttonText="Export"/>
                             </span>
                 <Table striped bordered hover size="sm" className="table" id="cropWise-to-xlsx" style={{display:"none"}}>

                         <thead>
                         <tr className='headerComp' >
                           <th>Fpo Name</th>
                           <th>Block </th>
                           <th> District</th>
                            <th> State</th>
                            <th> Total Acerage (in acre)</th>
                         <th>Total No of Crops</th>
  
                          <th>Total Tentative Value</th>

                   </tr>
                    </thead>
                      <tbody>
                   {InputCropList.map((item)=>{
                       return <tr>
                     <td>{item.fpo_name}</td>
                    <td>{item.fpo_block}</td>
                     <td>{item.fpo_dist}</td>
                    <td>{item.fpo_state}</td>
                      <td>{item.crop_area}</td>
                         <td>{item.crop_count}</td>

                        <td>   <NumberFormat value={brandsTentativeValue(item.brands)} displayType={'text'} prefix="₹ "
                               thousandSeparator={true} thousandsGroupStyle='lakh'/></td>


                              </tr>
                            })}
                    </tbody>
                      </Table> 
                        <MaterialTable
                                            icons={tableIcons}
                                            style={{ marginLeft: "30px" }}
                                            title=""
                                            data={InputCropList}
                                            columns={inputCrops}
                                            options={{
                                                // exportButton: true,
                                                // exportAllData: true,
                                                maxBodyHeight:600,
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
                               }
                        
                        </div>) : 
                        this.state.activeCardId=="ProductLevel"?
                        (<div className="landholdingHeader wrap">
                        <div style={{width:"80%",margin:"auto"}}>
           <Row className={this.handleProductRowDisable()}>
            <Col sm={1}></Col>
             <Col sm={3}>
                     <Form.Control
                       size="sm"
                       as="select"
                       value={selectedProductStatus}
                       onChange={this.handleProductselectstatus}
                       style={{border:"1px solid grey",color:"brown"}}
                     >
                       <option value="all">All</option>

                       <option value="yes">Verified</option>
                       <option value="no">Unverified</option>
                     
                     </Form.Control>
                   </Col>
                   <Col sm={3}>
                     <Form.Control
                       size="sm"
                       as="select"
                       value={selectedProductSeason}
                       onChange={this.handleProductselectedSeason}
                       style={{border:"1px solid grey",color:"brown"
                     }}

                     >
                       <option value="Kharif">Kharif</option>
                       <option value="Zaid">Zaid</option>
                       <option value="Rabi">Rabi</option>
                     
                     </Form.Control>
                   </Col>
                   <Col sm={3}>
                     <Form.Control
                       size="sm"
                       as="select"
                       value={selectedProductYear}
                       onChange={this.handleProductselectedYear}
                       style={{border:"1px solid grey",color:"brown"}}

                     >
                             {this.YearOptions(dateRanges)}
                     </Form.Control>
                   </Col>
                   <Col sm={2}>                        
                            {staticResponse.length!=0&& ProductInputDataloading===false?
                             <Button onClick={this.handleProductExport}
                                   className="defaultDisableButton"
                                   disabled={buttonDisableExport}
                                   variant="primary"
                                   size="sm">
                             <FontAwesomeIcon
                              icon={faDownload}
                              className="dvaraBrownText"
                              ></FontAwesomeIcon>
                            &nbsp;&nbsp;Export Data
                            {this.state.showDownloadLoader ? (
                          <div className="formDistLoadSpinnerWrap">
                          &nbsp;<span className="spinner-border spinner-border-sm"></span>
                         </div>
                         ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                        )}
                          </Button>
    :""}
</Col>
                   </Row>
                         </div> 
                         {ProductInputDataloading? <span className="spinner-border spinner-border-sm dashboardLoader" style={{marginTop:"100px"}}></span>
                  :
                  staticResponse.length!=0?<RenderProductDiv/>: <div style={{textAlign:"center",marginTop:"200px",color:"#007bff",fontSize:"18px"}}>No Data To Display</div>
                            }
                  
                         </div>)
                        : this.state.activeCardId=="Tentoutput" ?
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
                                 {this.state.Outputloader ? (
                                     <span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"140px"}}></span>
                                 ) : (

                                     <MaterialTable
                                         icons={tableIcons}
                                         style={{ marginLeft: "30px" }}
                                         title=""
                                         data={procOutputdata}
                                         columns={tentativeOutputColumn}
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
                                                Cattle Feed
                                            </h4>
                                        </div>
                                        {this.state.cattleloader ? (
                                     <span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"140px"}}></span>
                                 ) : (

                                     <MaterialTable
                                         icons={tableIcons}
                                         style={{ marginLeft: "30px" }}
                                         title=""
                                         data={cattleFieldData}
                                         columns={cattlecolumns}
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
                                                 { value:cattleFieldData.length, label: "All" },
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
                            </div>
                        )
                    }

                </Fragment>
            </section>
        );
        
    }
}