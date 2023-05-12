import React, { Component, Fragment, useState } from "react";
import UserService from "../services/user.service";
import FullMonthData from "./FullMonthData.components";
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
import { faHtml5, faHome,faCaretRight ,faDownload} from "@fortawesome/free-solid-svg-icons";
import { TriggerAlert, } from './dryfunctions';
import AuthService from "../services/auth.service";
import "../assets/css/landholding.css";
import "../assets/css/inputproducts.css";
import moment from 'moment';
import bo_green from "../assets/img/bo_green.png";

// function addAfter(array, index, newItem) {
//     return [
//         ...array.slice(0, index),
//         newItem,
//         ...array.slice(index)
//     ];
// }
// return date in a particular format
function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}
export default class BoProductInput extends Component {
    constructor(props) {
        super(props);
        this.state={
          activeId:0,
          isParentLogged: false,
          dateRanges: [],
          showloader:true,
         
          // selectedYear:"2021-2022",
          // selectedSeason:"Kharif",
          // selectedStatus:"yes",
          selectedYear:"",
          selectedSeason:"",
          selectedStatus:"all",
          showFilterError:false,
          showFilterErrorMessage:"",
          uniqueDataloading: true,
          staticResponse:[],
          cropsHeaderTableData:"",
          dropDownValue:"",
          filteredBrandData:[],
          componentsIterate:[],
          secondParamsNoData:false,
          exportCropName:"",
          showDownloadLoader:false,
          fpoName: localStorage.getItem('fpoName'),
          buttonDisableExport:false,
          currentYear:"",
          CurrentSeason:""


       
     
      }
        
    }
    //navigate to different component
  
  




   // for navigating to different dashboard
   navigateMainBoard = () => {
    const { isParentLogged } = this.state
    if (isParentLogged) {
        this.props.history.push("/fpohomeData");
    }
    else {
        this.props.history.push("/dashboard");
    }
}
navigateToPage = (pageName) => {
    const {fpoName, isParentLogged} = this.state 

    if(isParentLogged){
            this.props.history.push("/" + pageName + "/"+ fpoName);
    }else{
        this.props.history.push("/" + pageName + "");   
    }

  };
//calling api yearrange to append in a dropdown and product level
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
    // const nameOfMonth = new Date().toLocaleString(
    //     'default', {month: 'long'}
    //   );
    //   console.log("nameOfMonth",nameOfMonth); 
   
    const fpoId = localStorage.getItem("fpoId")
    const currentYear = user.current_year;
    const currentSeason = user.current_season;
    const ProductAccordionDataLocalStorage =JSON.parse(localStorage.getItem("ProductAccordionData"));
    const filterItemData=JSON.parse(localStorage.getItem("filterItemData"));

    if (user) {
        this.setState({
          currentUser: user,
          CurrentYear:currentYear,
          CurrentSeason:currentSeason,
          selectedYear:currentYear,
          selectedSeason:currentSeason
          
        });
      }
    UserService.getYearRanges().then(
        (response) => {
            flag = true;
            // console.log("res",response.data.date_ranges)
            // var dateDict = {};
            // response.data.date_range.map((date) => {
            //     dateDict[date] = date;
            // });
            this.setState({
                
                dateRanges: response.data.date_ranges,
                showloader: false,
            });
        //    console.log("dateRanges",this.state.dateRanges)
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
                this.navigateMainBoard()
            }
        }, 30000)
    );
        if(ProductAccordionDataLocalStorage)
        { 
            // console.log("yes")
            this.setState({
                staticResponse:ProductAccordionDataLocalStorage,
                uniqueDataloading: false,
                selectedYear:filterItemData.year,
                selectedSeason:filterItemData.season,
                selectedStatus:filterItemData.status,


            })
        }
        else{
            // console.log("no")

            this.handleGetAccordionData(currentSeason,currentYear,this.state.selectedStatus)

        }
    //   this.handleGetAccordionData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus)







   }
   //appending year range in a dropdown
   YearOptions = (yearList) => {
    // console.log("yearList",yearList)
    if(yearList.length!==null){
      return yearList.map((year, index) =>
    (
        <option key={index} name={year} value={year}>
            {year}
        </option>
    ))
    }
  
}
//selecting season and calling product level api
handleselectedSeason=(e)=>{
    this.setState({
        selectedSeason:e.target.value,
        showFilterErrorMessage:"",
        uniqueDataloading:true,

    },()=>this.handleGetAccordionData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus)
    )
}
//selecting year and calling product level api

handleselectedYear=(e)=>{
    this.setState({
        selectedYear:e .target.value ,
        showFilterErrorMessage:"",
        uniqueDataloading:true,
    },()=>this.handleGetAccordionData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus)
    )
}
//selecting year and calling product level api

handleselectstatus=(e)=>{
    this.setState({
        selectedStatus:e .target.value,
        showFilterErrorMessage:"",
        uniqueDataloading:true,

    },()=>this.handleGetAccordionData(this.state.selectedSeason,this.state.selectedYear,this.state.selectedStatus))
}
// updateFetchData=(staticResponse)=>{
//     let components=[];
//        let componentObject={}
    
//        staticResponse.component_data.map((data,index)=>{
     
//         data.components.map((item,InitialIndex)=>{
//               if(item.brand_dropdown.length!==0)
//               {
          
//              componentObject={
//                 brand_dropdown:item.brand_dropdown,
//                 brands:item.brands,
//                 category_id:item.category_id,
//                 category_name:item.category_name,
//                 crop_area:item.crop_area,
//                 max_required_date:item.max_required_date,
//                 min_required_date:item.min_required_date,
//                 month:item.month,
//                 product_id:item.product_id,
//                 product_name:item.product_name

//              }     
//              components.push(componentObject)  
//             }                 
//         })
    
      

        

//        })

//        var filteredData=[];
//        staticResponse.component_data.map((item)=>{
//             item.components.map((data)=>{
//                 if(data.brand_dropdown.length!==0){
//              let sendData=data.brands
//              filteredData.push(sendData)
//                 }
//             }) 
//     })
//    this.setState({
//       componentsIterate:components,
//        filteredBrandData:filteredData,
    
       

//    },()=>console.log("branddata",this.state.filteredBrandData))





         



// }
//calling product level api after dropdown value changed
handleGetAccordionData=(season,year,status)=>{
//   console.log("pp",season,year,status)
    const{selectedSeason,selectedYear,selectedStatus}=this.state;
    const filterItemData={
        "season":season,
         "year":year,
         "status":status
    }
        var flag=false;
        const fpoId = localStorage.getItem("fpoId")

        UserService.getProductInputComponents(season,year,status,fpoId).then(
            (response) => {
                flag = true; 
                //  console.log("coming",response)
                 
                if (response.data.success) {
                    // console.log("coming2",response.data)

                     if(response.data.component_data.length!=0)
                     {
                    this.setState({
                      
                         staticResponse:response.data,
                         cropsHeaderTableData:response.data.selected_filters,
                         isVerRes: response.data.selected_filters.is_verified,
                         componentsList: response.data.components,

                          uniqueDataloading: false,
 


                    

                    });
                    localStorage.setItem("filterItemData",JSON.stringify(filterItemData))
                    localStorage.setItem("ProductAccordionData", JSON.stringify(this.state.staticResponse));

                    // console.log("catch error",this.state.staticResponse)
                }
                else{
                  this.setState({
                      uniqueDataloading: false,
                      staticResponse:[],

                  })
                  localStorage.setItem("filterItemData",JSON.stringify(filterItemData))

                  localStorage.setItem("ProductAccordionData", JSON.stringify(this.state.staticResponse));

              }
              }
                else{
                    this.setState({
                        uniqueDataloading: false,
                        staticResponse:[],

                    })
                    localStorage.setItem("filterItemData",JSON.stringify(filterItemData))
                    localStorage.setItem("ProductAccordionData", JSON.stringify(this.state.staticResponse));
                }

            },
            (error) => {
                console.log("error api")
                flag = true; 
                localStorage.removeItem("ProductAccordionDataLocalStorage");
                localStorage.removeItem("filterItemData");
                this.setState({
                    uniqueDataloading:false,
                    secondParamsNoData:true,

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
            setTimeout(() => {
                if(flag==false){
                    this.setState({
                        showloader:false,
                    });
                TriggerAlert("Error","Response Timed out, Please try again","info");
                this.navigateMainBoard()
                }
            }, 45000)
        );
    
}

// brandsOptions = (brandList) =>
               
// brandList.map((brand, i) =>

// (
//     <option key={i} name={brand.brand_name} value={brand.brand_id}>
//         {brand.brand_name} (&#x20b9; {brand.pkt_price})
//     </option>
  
// ))
// componentItegateBrandChange=(e,brands,checkIndex)=>{
//     const{componentsIterate}=this.state;

   
//     const againData=this.state.filteredBrandData.find((data,index)=>index===checkIndex)

//     let addBrand = againData.find((data=>data.brand_id==e.target.value))

  
//     let fewPropAdded= componentsIterate.find(function(value, index) {
//         return checkIndex ==index
//       });
//                let newAddedData={
//                 brand_dropdown:fewPropAdded.brand_dropdown,
//                 brands:addBrand,
//                 category_id:fewPropAdded.category_id,
//                 category_name:fewPropAdded.category_name,
//                 crop_area:fewPropAdded.crop_area,
//                 max_required_date:fewPropAdded.max_required_date,
//                 min_required_date:fewPropAdded.min_required_date,
//                 month:fewPropAdded.month,
//                 product_id:fewPropAdded.product_id,
//                 product_name:fewPropAdded.product_name








//                }
//        const filtered = componentsIterate.filter((data,ind)=> {
//           return checkIndex !==ind;
//         });
//             const finalAddedarray = addAfter(filtered, checkIndex, newAddedData)

//        this.setState({
//         componentsIterate:finalAddedarray,
     
//         })
        


// // e.preventDefault();
// }

//calling api on click of export button
handleProductExport=()=>{
    const {selectedYear,
    selectedSeason,selectedStatus
    }=this.state;
    // console.log("export  product clicked")
    this.setState({
        showDownloadLoader:true,
        buttonDisableExport:true
    })
    let exportselectedStatus="all";
    if(selectedStatus==="yes")
    exportselectedStatus="Verified"
    if(selectedStatus==="no")
    exportselectedStatus="UnVerified"
   console.log("exportselectedStatus",exportselectedStatus)
    UserService.getProductExportData(this.state.staticResponse).then(
        (response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', exportselectedStatus+ "/" + selectedSeason+ "/"+selectedYear+'.xlsx');
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
handleProductRowDisable=()=>{
    const{uniqueDataloading}=this.state;
    if(uniqueDataloading)
    return "handleCropRowDisableclass" 
    else return ""
}


    render(){
      const{monthlyList,uniqueCompData,activeId,showloader,uniqueDataloading,secondParamsNoData,
        dateRanges,selectedStatus,selectedSeason,selectedYear,componentsIterate,staticResponse,buttonDisableExport}=this.state;
        // console.log("productComponentsIterate",componentsIterate)
        const RenderProductDiv = () => { 
         
            if(staticResponse.component_data.length!=0){
         
            return (
                   <div style={{marginTop:"30px"}}>
             <Accordion
             defaultActiveKey="Data0">
             {staticResponse.component_data.map((keyData, index) => {
              return <FullMonthData  {...this.props} keyData={keyData} index={index} selectedSeason={selectedSeason}selectedYear={selectedYear}selectedStatus={selectedStatus} />
             })
             }
            </Accordion> 
           </div> 
            )
            }
      
      
      }
     
       
       return (

         <section>
               <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap">
                <a
                href="#"
                className="breadcrumb-item breadcrumbs__crumb pageBreadCrumbItem"
                onClick={() => this.navigateMainBoard()}
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
            </div>
           <div className="width-90">
            <div style={{width:"80%",margin:"auto"}}>
           <Row className={this.handleProductRowDisable()}>
            <Col sm={1}></Col>
            <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                //   className={this.state.ceomonthclass}
                                  value={selectedStatus}
                                  onChange={this.handleselectstatus}
                                  style={{border:"1px solid grey",color:"brown"}}
                                >
                                  {/* <option value=""> Select Status</option> */}
                                  <option value="all">All</option>

                                  <option value="yes">Verified</option>
                                  <option value="no">Unverified</option>
                                
                                </Form.Control>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                //   className={this.state.ceomonthclass}
                                  value={selectedSeason}
                                  onChange={this.handleselectedSeason}
                                  style={{border:"1px solid grey",color:"brown"
                                }}

                                >
                                  {/* <option value=""> Select Season</option> */}
                                  <option value="Kharif">Kharif</option>

                                  <option value="Zaid">Zaid</option>
                                  <option value="Rabi">Rabi</option>
                                
                                </Form.Control>
                              </Col>
                              <Col sm={3}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                //   className={this.state.ceomonthclass}
                                  value={selectedYear}
                                  onChange={this.handleselectedYear}
                                  style={{border:"1px solid grey",color:"brown"}}

                                >
                                        {this.YearOptions(dateRanges)}

                                
                                </Form.Control>
                              </Col>
                            <Col sm={2}>                        
                            {staticResponse.length!=0?
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
                <div>
                  
                  {/* {staticResponse.length!=0?<RenderProductDiv/>:"No Data To Display"} */}
                  {uniqueDataloading?<img src={bo_green} height="180px" style={{ position: "relative", top: "120px", left: "45%" }} />
                  // <span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"200px"}}></span>
                  :
                  staticResponse.length!=0?<RenderProductDiv/>: <div style={{textAlign:"center",marginTop:"200px",color:"#007bff",fontSize:"18px"}}>No Data To Display</div>
                            }
                  
                
                  </div>
                
              
       </div>
       </section>
       )
          // }
          // else{
          //   return(<span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>)
          // }
    }
}
