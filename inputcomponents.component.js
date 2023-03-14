import React, { Component, Fragment } from "react";
import { Form, Table, Row, Col, Modal, Button, Tab, OverlayTrigger, Tooltip, Container } from "react-bootstrap";
import UserService from "../services/user.service";
import moment from 'moment';
import "../assets/css/inputComp.css";
import NumberFormat from 'react-number-format';

import "../index.css";
import "../assets/img/fr.svg";
import {TriggerAlert,} from './dryfunctions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHtml5, faHome,faCaretRight,faDownload } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../services/auth.service";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

// import ComponentTable from "./compTable.component";

var startIndex;
let ParentMonth=[]
// var startvalues=[]
function uniqueByMonth(components) {
    var compData = {}
    Object.keys(components).map((key, index) => (compData[key] = unique(components[key],
        ["month"])))
    return compData
}
//to show date in format
function formatDate(string) {
    const date = moment(string).format(' MMM. DD, YYYY')
    return date
}
function unique(arr, keyProps) {
    const kvArray = arr.map(entry => {
        const key = keyProps.map(k => entry[k]).join('|');
        return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
}

function uniqeData(components) {
    var compData = {}
    Object.keys(components).map((key, index) => (compData[key] = unique(components[key],
        ["compid","category", "product"])))
    return compData
}
//adding a new row
function addAfter(array, index, newItem) {
    return [
        ...array.slice(0, index),
        newItem,
        ...array.slice(index)
    ];
}
//writing in uppercase
function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}
export default class InputComponent extends Component {
    constructor(props) {
        super(props)
        // this.handleBrandChange = this.handleBrandChange.bind(this)
        this.wrapper = React.createRef();

        this.tableWrapper = React.createRef();

        this.state = {
            componentsList: "",
            cropData: "",
            area: "",
            monthlyList: [],
            uniqueCompData: {},
            uniqueDataloading: true,
            modalIsOpen: false,
            farmerList: [],
            selProduct: "",
            selCategory: "",
            farmerDataLoading: false,
            selTotalPkts: "",
            selPktPrice: "",
            isVerRes: "",
            fpoName: localStorage.getItem("fpoName"),
            isParentLogged: false,
            staticResponse:[],
            cropsHeaderTableData:"",
            dropDownValue:"",
            filteredBrandData:[],
            componentsIterate:[],
            exportCropName:"",
            showDownloadLoader:false,
            buttonDisableExport:false,
            selectedBrandName:"",
            selectedArea:""


        }
    }
    //navigating breadcrumb 
    navigateToPage = (pageName) => {
        const {fpoName, isParentLogged} = this.state    
        if(isParentLogged){
           
                this.props.history.push("/" + pageName + "/"+ fpoName);
           
        }else{
            this.props.history.push("/" + pageName + "");   
            // this.props.history.goBack()
        
        }

      };
   
   
    // handleBrandChange = (e, key, category, product, compId) => {
    //     this.setState({ uniqueDataloading: true })
    //     var comps = this.state.componentsList
    //     var uniqueComps = this.state.uniqueCompData

    //     const selRow = comps[key].find(comp => comp.brand_name === e.target.value &&
    //         comp.product === product && comp.category === category && comp.compid === compId);
    //     const removeRow = uniqueComps[key].find(
    //             comp => comp.product === product && comp.category === category && comp.compid === compId);
    //     const index = uniqueComps[key].findIndex(
    //             item => item.product === product && item.category === category && item.compid === compId)
    //     uniqueComps[key].splice(index, 1);
    //     const newkeyObj = addAfter(uniqueComps[key], index, selRow)
    //     uniqueComps[key] = newkeyObj

    //     this.setState({
    //         uniqueCompData: uniqueComps,
    //         uniqueDataloading: false
    //     })




    // }

    //modifying the response of api and iterating over the array created after modification.
    updateFetchData=(staticResponse)=>{
        // console.log("me enterd",staticResponse)
        let components=[];
           let componentObject={}
        
           staticResponse.component_data.map((data,index)=>{
         
            data.components.map((item,InitialIndex)=>{
                  if(item.brand_dropdown.length!==0)
                  {
              
                 componentObject={
                    brand_dropdown:item.brand_dropdown,
                    brands:item.brands[0],
                    category_id:item.category_id,
                    category_name:item.category_name,
                    crop_area:item.crop_area,
                    max_required_date:item.max_required_date,
                    min_required_date:item.min_required_date,
                    month:item.month,
                    product_id:item.product_id,
                    product_name:item.product_name

                 }     
                 components.push(componentObject)  
                }                 
            })
        
          

            // console.log("qwerty",components)
            

           })

           var filteredData=[];
        //    console.log("az")
           staticResponse.component_data.map((item)=>{
                item.components.map((data)=>{
                    if(data.brand_dropdown.length!==0){
                 let sendData=data.brands
                 filteredData.push(sendData)
                    }
                }) 
        })
        // console.log("filteredData",filteredData)
       this.setState({
          componentsIterate:components,
           filteredBrandData:filteredData,
        
           

       })





             



    }
    navigateMainBoard = () => {
        const {isParentLogged} = this.state
        if(isParentLogged){
          this.props.history.push("/fpohomeData");
        }
        else{
          this.props.history.push("/dashboard");
        }
      }
      
  //fetching the api response and sending required parameters
    componentDidMount() {
        const user = AuthService.getCurrentUser();
        const fpoId = localStorage.getItem("fpoId")
        if(!user){
          this.props.history.push('/')
          return
        }
        if(user.is_parent){
            this.setState({isParentLogged: true})
          }
        let season = this.props.match.params.season;
        let year = this.props.match.params.year;
        let isVerified = this.props.match.params.isVerified;
        let area = this.props.match.params.area;
        let cropId = this.props.match.params.cropId;
        var flag = false;

        if(isVerified.toString()=='2')
        {
            isVerified="yes"
        }
        else
        isVerified="no"
                
      
        UserService.getInputComponents(season, year, isVerified, cropId, fpoId).then(
            (response) => {
                flag = true; 
                //  console.log("coming",response)
                if (response.data.success) {
                    // console.log("coming2",response.data)

                    // var uniqueData = uniqeData(response.data.data.components)
                    // console.log('response',response )
                    if(response.data.component_data.length!=0)
                    {
                    this.setState({
                        staticResponse:response.data,
                        cropsHeaderTableData:response.data.selected_filters,
                        isVerRes: response.data.selected_filters.is_verified,
                        exportCropName: response.data.selected_filters.crop_name,
                          selectedArea:area,
                        componentsList: response.data.components,
                         uniqueDataloading: false,

                        // cropData: response.data.data.date_range[0],
                        // area: area,
                        // monthlyList: response.data.data.monthly_total,
                        // uniqueCompData: uniqueData,

                    }
                    ,this.updateFetchData(response.data));
                    // console.log("catch error",this.state.staticResponse)
                }
                else{
                    this.setState({
                        uniqueDataloading: false,
                        staticResponse:[]
                    })
                }
            }
                else{
                    this.setState({
                        uniqueDataloading: false,
                        staticResponse:[]

                    })
                }

            },
            (error) => {
                console.log("error api")
                flag = true; 
                this.setState({
                    uniqueDataloading:false,
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
            }, 30000)
        )
    }
    //showing total amount after every table.
    handlesumMonthlyAmt=(data)=>{
        const{componentsIterate}=this.state;
     
        let sum=0;
        componentsIterate.map((item)=>{
            if(item.month===data.month){
                let addedSumValue=item.brands.tentative_amount
               sum=sum+addedSumValue
            }
        })
        return sum

    }
    showHeadingTentativeSum=(sumData)=>{
       let totSum=0;
       sumData.map((item)=>{
        let addingtent=item.brands.tentative_amount
        totSum=totSum+addingtent
          
       })
       return totSum
    }
    // sumMonthlyAmt(key) {
    //         console.log("key",key)
    //     const result = Object.values(this.state.uniqueCompData[key]).reduce((r, { amount }) => r + amount, 0);
    //     return   (<NumberFormat value={result} displayType={'text'}
    //     thousandSeparator={true} thousandsGroupStyle='lakh'/> )

    // }
  
    //showing dropdown options
    brandsOptions = (brandList) =>
               
        brandList.map((brand, i) =>

        (
            <option key={i} name={brand.brand_name} value={brand.brand_id}>
                {brand.brand_name} (&#x20b9; {brand.pkt_price})
            </option>
          
        ))
   //showing popup on click of view farmerdetails and calling an api.
    showModal = (val, selecteddata, categoryId, productId, brandId,BindmonthYear,categoryName,productName,total_packets,price) => {
         const fpoId = localStorage.getItem("fpoId")
        //    console.log("selecteddata",selecteddata)
        let season = this.props.match.params.season;
        let year = this.props.match.params.year;
        let isVerified = this.props.match.params.isVerified;
        // console.log("muio",isVerified)
        let cropId = this.props.match.params.cropId;
        // console.log("em clicked",season,year,isVerified,fpoId,cropId,categoryId,productId,brandId,BindmonthYear,categoryName,productName)
        let arr = BindmonthYear.split('-');
        // console.log("arr",arr[0],arr[1])
        // let sendMonth;
        // if(arr[0]==="January")
        //    sendMonth=1;
        let sendMonth=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
        let sendYear=arr[1];
        // console.log("isVerified",sendMonth)
        let verifiedSend;
       if (isVerified==2)
       verifiedSend="yes"
        else
        verifiedSend="no"

        // console.log("verifiedSend",verifiedSend)

           this.setState({
            modalIsOpen: true,
            farmerDataLoading: true,
            selCategory: categoryName,
            selProduct: productName,
            selTotalPkts: total_packets,
            selPktPrice: price,
            selectedBrandName:selecteddata.brands.brand_name


        })
        var flag = false;
        // console.log("enter farmer")
            //  console.log("em clicked",season,year,verifiedSend,fpoId,cropId,categoryId,productId,brandId,brandId,sendMonth,sendYear)

        UserService.getComponentFarmers(season,year,verifiedSend,fpoId,cropId,categoryId,productId,brandId,sendMonth,sendYear).then(
            (response) => {
                flag = true; 
                // console.log("farmer response",response)
                if (response.data.success==true) {
                    this.setState({
                        // farmerList: response.data.data,
                        farmerList: response.data,

                        farmerDataLoading: false
                    })
                    // console.log("farmerList",this.state.farmerList)
                }
                // else{
                //     this.setState({

                //     })
                // }
            },
            (error) => {
                flag = true; 
                console.log("farmer error")
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


    //iterating over poppup table.
    farmersData = (farmerList) => {
        // console.log("nested farmer",farmerList)
       
        if(farmerList!=undefined)
        {
          
            let sortedData = farmerList.sort(function(a,b) {
                return b.month_components[0].components[0].brands[0].tentative_amount - a.month_components[0].components[0].brands[0].tentative_amount;
            });
            // console.log("sortedData",sortedData)
        return sortedData.map((farmer, index) => {
            return <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{farmer.village}</td>
                    <td className="capitalise">{titleCase(farmer.farmer_name)}</td>
                    <td>{farmer.contact}</td>

                
                <td>{formatDate(farmer.min_tentative_date)}</td>
                   {/* {
                     farmer.month_components.map((item)=>{
                        //  console.log("qty",item.components[0].brands[0].qty_required)
                        return <td>{parseFloat(item.components[0].brands[0].qty_required).toFixed(2)}</td>

                     })
                  } */}

{
                     farmer.month_components.map((item)=>{
                        //  console.log("qty",item.components[0].brands[0].qty_required)
                        return <td>{item.components[0].brands[0].required_pkts}</td>

                     })
                  }
                    {
                     farmer.month_components.map((item)=>{
                      
                        return <td>
                             <NumberFormat value={item.components[0].brands[0].tentative_amount} displayType={'text'} prefix="₹ "
                             thousandSeparator={true} thousandsGroupStyle='lakh'/> 
                         
                            </td>

                     })
                  } 
              

            </tr>
        })
        }
        // farmerList.map((farmer,index)=>{
        //     console.log("ff",farmer)
        // })
        // return farmerList.map((farmer, index) => {
        //     return <tr key={index}>
        //         <td className="capitalise">{titleCase(farmer.farmer_name)}</td>
        //         <td>{farmer.contact}</td>
        //         <td>{farmer.village}</td>
        //         {/* <td>{formatDate(farmer.expected_date)}</td>
        //         <td>{farmer.no_of_packets}</td>
        //         <td><span>&#x20B9;</span> {farmer.amount}</td> */}

        //     </tr>
        // })
    }
  
   
//     RevampBrandChange=(e,data,brands,index)=>{
//           const{filteredBrandData}=this.state;
//           let addBrand = brands.find((data=>data.brand_id==e.target.value))
//              console.log("addBrand",addBrand)
//              const filtered = filteredBrandData.filter((data,ind)=> {
//                 return index !==ind;
//               });
//             //  filteredBrandData[index].splice(index, 1);
//              console.log("you",filtered)
//                   const finalAddedarray = addAfter(filtered, index, addBrand)

//             // const finalAddedarray= filteredBrandData.insert(index, addBrand)
//              console.log("finalData",finalAddedarray)
// this.setState({
//     filteredBrandData:finalAddedarray
// })

            

//     }
//on dropdown change calling the function and replacing the previous row with the new row clicked.
    componentItegateBrandChange=(e,brands,checkIndex)=>{
        const{componentsIterate}=this.state;

        // console.log("bh",brands,checkIndex)
        // console.log("for modifying brands",this.state.filteredBrandData,checkIndex)
        const againData=this.state.filteredBrandData.find((data,index)=>index===checkIndex)
        // console.log("againData",againData)

        let addBrand = againData.find((data=>data.brand_id==e.target.value))
        //    console.log("addBrand",addBrand)

        //    let fewPropAdded = componentsIterate.find((data,index)=>{checkIndex ===index})
        //    console.log("fewPropAdded",fewPropAdded)
        let fewPropAdded= componentsIterate.find(function(value, index) {
            return checkIndex ==index
          });
                //    console.log("fewPropAdded",fewPropAdded.category_id)
                   let newAddedData={
                    brand_dropdown:fewPropAdded.brand_dropdown,
                    brands:addBrand,
                    category_id:fewPropAdded.category_id,
                    category_name:fewPropAdded.category_name,
                    crop_area:fewPropAdded.crop_area,
                    max_required_date:fewPropAdded.max_required_date,
                    min_required_date:fewPropAdded.min_required_date,
                    month:fewPropAdded.month,
                    product_id:fewPropAdded.product_id,
                    product_name:fewPropAdded.product_name








                   }
                //    console.log("newAddedData",newAddedData)
           const filtered = componentsIterate.filter((data,ind)=> {
              return checkIndex !==ind;
            });
        //    console.log("final",filtered)
                const finalAddedarray = addAfter(filtered, checkIndex, newAddedData)

        //    console.log("finalcomponentIterate",finalAddedarray)
this.setState({
    componentsIterate:finalAddedarray
})


    }
    //export api is getting called.
    handleExport=()=>{
        const {exportCropName,buttonDisableExport,showDownloadLoader}=this.state;
           this.setState({
            buttonDisableExport:true,
            showDownloadLoader:true,
           })
        let season = this.props.match.params.season;
        let year = this.props.match.params.year;
        let isVerified = this.props.match.params.isVerified;
        let cropId = this.props.match.params.cropId;
       
        if(isVerified.toString()=='2')
        {
            isVerified="yes"
        }
        else
        isVerified="no"
        // UserService.getCropExportData(this.state.staticResponse).then(
        UserService.getCropExportData(season, year, isVerified, cropId).then(

            (response) => {
            
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', exportCropName+'.xlsx');
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
  
    render() {
        // console.log("componentsIterate",this.state.componentsIterate)
        const {componentsIterate,staticResponse,isVerRes,area,uniqueDataloading,modalIsOpen,selCategory,selProduct,selTotalPkts,selPktPrice
        ,farmerDataLoading,farmerList,buttonDisableExport} = this.state
        // console.log("ak",this.state.staticResponse)
        // console.log('componentsIterate----', componentsIterate)
        const hideModal = () => {
            this.setState({
                modalIsOpen: false
            })
        }
      
           
           if(!uniqueDataloading){
            if(this.state.staticResponse.length!=0 ){
              
                if(this.state.staticResponse.component_data.length!=0){


                return(
                    <section className="mainWebContentSection">
                               <Fragment>
                                    <div>
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
                            className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                          />
                          <a
                            href="#"
                            className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                            onClick={() => this.navigateToPage("business-opportunity")}
                          >
                            Business Potential
                          </a>
                        </div> 
                        <Button onClick={this.handleExport}
                              style={{float:"right",marginRight:"100px",marginBottom:"10px"}}
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
                          <span className="spinner-border spinner-border-sm"></span>
                         </div>
                         ) : (
                        <div className="formDistLoadSpinnerWrap"></div>
                        )}
                          </Button>












                        <Table striped bordered hover size="sm">
                                 <thead>
                                     <tr>

                                         <td colSpan="4"><center><b> {this.state.cropsHeaderTableData.crop_name}:&nbsp;
                                              {isVerRes==="no"?"Unverified":"Verified"}: &nbsp;{this.state.selectedArea} Acres
                                                 </b></center></td>
                                            <td colSpan="4" align='center'>
                                             <b>Total Tentative Amount:&nbsp;
                                             <NumberFormat value= {this.showHeadingTentativeSum( this.state.componentsIterate)} displayType={'text'} prefix="₹ "
                                                thousandSeparator={true} thousandsGroupStyle='lakh' style={{fontWeight:"800"}}/>   
                                             </b>
                                         </td>

                                     </tr>
                                     <tr>
                                         <td colSpan="4" align='center'>
                                             <b>Sowing Date: {formatDate(this.state.cropsHeaderTableData.sowing_min_date)} -
                                                 {formatDate(this.state.cropsHeaderTableData.sowing_max_date)}
                                             </b>
                                         </td>
                                         <td colSpan="4" align='center'>
                                             <b>Expected Harvest Date: {formatDate(this.state.cropsHeaderTableData.harvest_min_date)} -
                                                 {formatDate(this.state.cropsHeaderTableData.harvest_max_date)}
                                             </b>
                                         </td>
                                     </tr>
                                 </thead>
                             </Table>
                             {
                               
                         this.state.staticResponse.component_data.map((keyData, index) => {

                             return (<Table striped bordered hover size="sm" key={index} >
                                 <thead >
                                     <tr className="header-bg">
                                         <td colSpan="7"><center><b>{keyData.month} &nbsp;Month Input Requirements</b></center></td>
                                     </tr>

                                 </thead>
                                 <thead>
                                     <tr className='headerComp' >
                                         <th><span style={{position:"relative",left:"15px",fontWeight: "bold"}}>Category</span></th>
                                         <th>Product</th>
                                         <th>Brand</th>
                                         <th>Expected Date</th>
                                         {/* <th>Application Rate</th> */}
                                         <th>Total Packets</th>
                                         <th>Packet Price</th>
                                         <th>Tentative Amt</th>

                                     </tr>
                                 </thead>
                              <tbody>
                                {/* {console.log("mnkl",this.state.componentsIterate)} */}
                               {
                                          this.state.componentsIterate.map((data, componentindex) => {
                                            

                                            
                                            if(data.month===keyData.month){
                                                return (
                                                <tr key={componentindex}>
                                                 {/* {console.log("data",data)}
                                                 {console.log(data.month,"data.month"," keyData.month",keyData.month)} */}

                                                    <td>{data.category_name}</td>
                                                 <td>{data.product_name}</td>
                                                
                                                 <td className="brand_dropdown">
                                                                            <Form>
                                                                                <Form.Group className="brand_input" controlId="formHorizontalUnits">
                                                                                    <Form.Control
                                                                                        as="select"
                                                                                        size="sm"
                                                                                     
                                                                                        custom
                                                                                         onChange={(e, val) => this.componentItegateBrandChange(e, keyData.brands,componentindex)}
                                                                                    >
                                                                                        {this.brandsOptions(data.brand_dropdown,index)}
                   
                                                                                    </Form.Control>
                                                                                </Form.Group>
                                                                            </Form>
                                                                        </td>
                                                                        
                                                                        <td>{formatDate(data.min_required_date)}</td>
                                                                        {/* <td>{data.brands.application_rate} Qty/Acre</td> */}
                                                                        <td>{data.brands.required_pkts}</td>
                                                                        <td>
                                                                        <NumberFormat value= {data.brands.pkt_price} displayType={'text'} prefix="₹ "
                                                                        thousandSeparator={true} thousandsGroupStyle='lakh'/> 
                                                                      
                                                                         
                                                                            </td>
                                                                     


                                                         <td className="hyplink">
                                                         <OverlayTrigger key="top" placement="top"
                                                             overlay={<Tooltip id="">Click for Farmer Details</Tooltip>}>

                                                             <a onClick={()=>this.showModal(true,data,data.category_id,data.product_id,data.brands.brand_id,data.month,data.category_name,data.product_name,data.brands.required_pkts,data.brands.tentative_amount)}
                                                            //  onClick={() => this.showModal(true, month.farmer_list,
                                                            //      month.category, month.product, month.tot_packets, month.packet_price)}
                                                                 >

                                                                 <span>&#x20B9;</span>
                                                                
                                                                  <NumberFormat value={data.brands.tentative_amount} displayType={'text'}
                                                thousandSeparator={true} thousandsGroupStyle='lakh'/> 
                                         
                                                             </a>

                                                         </OverlayTrigger>

                                                     </td>
                                           










                                                                             
                                                                           
                                                                      
                   
                                                 </tr>
                                                 )
                                            }
                                          
                                            
                                           })

                          
                            }

                                <tr className="total_comp_amt">
                                                 <td colSpan="6"><center><strong>Total Amount</strong></center></td>
                                                <td><strong><span>&#x20B9;</span>
                                                <NumberFormat value={this.handlesumMonthlyAmt(keyData)} displayType={'text'}
                                                thousandSeparator={true} thousandsGroupStyle='lakh'/>                                                    
                                                                                            
                                                </strong></td>
                                            </tr>
                              </tbody>

                             </Table>)

                         })
                     }

                <Modal show={modalIsOpen}
                                 onHide={hideModal}
                                 size="lg"
                                 aria-labelledby="contained-modal-title-vcenter"
                                 centered
                                 className="modal-adjust"
                                 dialogClassName="my-modal"
                             >
                                 <Modal.Header style={{backgroundColor:"rgba(163, 198, 20, 0.8)",padding:"20px"}} >

                                     <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText">{this.state.cropsHeaderTableData.crop_name}</span>
                                     
                                     <span style={{position:"relative",top:"23px",position: "absolute",
                                                      left: "84%"}}>
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="download-table-xls-button btn mb-3 ExportButtonFrontClass"
                                        table="table-to-xls2"
                                        filename="tablexls"
                                        sheet="tablexls"

                                        buttonText="Export Data"/></span>
                                     
                                     
                                     
                                     </Modal.Title>

                                 </Modal.Header >
                                 <Modal.Body>
                                     <Container>
                                       
                                         <Row align="center" className="farmerData">

                                             <Col>
                                                 Category:&nbsp; <strong className="dvaraBrownText">{selCategory}</strong>
                                             </Col>
                                             <Col>
                                                 Product : <strong className="dvaraBrownText">{selProduct}</strong>
                                             </Col>
                                             <Col>No.Of Packets: <strong className="dvaraBrownText">{selTotalPkts}</strong></Col>
                                             <Col>Price: <strong className="dvaraBrownText">&nbsp;
                                             <NumberFormat value= {selPktPrice} displayType={'text'} prefix="₹ "
                                                         thousandSeparator={true} thousandsGroupStyle='lakh' style={{fontWeight:"800"}}/> 
                                              </strong></Col> 

                                         </Row>
                                     </Container>
                                     <br></br>
                                     {(farmerDataLoading) ? (<div className="mainCropsFarmerLoaderWrap">
                                         <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span>
                                     </div>) : (
                                         <div className="farmersUploadWrap">

                                             <Table striped bordered hover size="sm"  className="table" id="table-to-xls2">
                                                 <thead>

                                                   {/* <tr style={{display:"none"}}> */}
                                                    <tr style={{display:"none"}}><b>Crop </b>:{this.state.cropsHeaderTableData.crop_name}</tr>
                                                    <tr style={{display:"none"}}><b>Category </b>:{selCategory}</tr>

                                                   {/* </tr> */}
                                                   {/* <tr style={{display:"none"}}> */}
                                                   <tr style={{display:"none"}}> <b>Product: </b> {selProduct}</tr>
                                                    <tr style={{display:"none"}}><b> Brand </b> :{this.state.selectedBrandName}</tr>
                                                   {/* </tr> */}



                                                     <tr className="dvaraGreenBG" align="center">
                                                        <th>Sl.No.</th>
                                                         <th>Village</th>
                                                         <th>Farmer Name</th>
                                                         <th>Contact No.</th>
                                                         <th>Tentative Date</th>
                                                         {/* <th>Quantity Required</th> */}
                                                         <th>No Of Packets</th>

                                                         <th>Tentative Amount</th>
                                                     </tr>
                                                 </thead>
                                                 <tbody>
                                                   
                                                     {this.farmersData(farmerList.farmers)}
                                                 </tbody>
                                             </Table>
                                         </div>)}
                                 </Modal.Body>
                                 <Modal.Footer>
                                     &nbsp;&nbsp;&nbsp;
                                     <Button onClick={hideModal} className="fa-pull-right " style={{backgroundColor:"rgba(163, 198, 20, 0.8)",color:"brown",marginRight:"20px",outline:"none"}}>Close</Button>
                                     <span className="clearfix"></span>

                                 </Modal.Footer>
                             </Modal>






















                        </div>
                        </Fragment>
                        </section>
                )
                    }


                
            }
            else{
                return( <section>
                         
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
                            className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"
                          />
                          <a
                            href="#"
                            className="breadcrumb-item breadcrumbs__crumb breadcrumbs__crumb pageBreadCrumbItem"
                            onClick={() => this.navigateToPage("business-opportunity")}
                          >
                            Business Potential
                          </a>
                        </div> 
                    
                    
                    <div style={{textAlign:"center",marginTop:"200px",fontWeight:"700"}}>No Data To Display</div></section>)
            }
        }
        else{
            return (<span className="spinner-border spinner-border-lg mainCropsFarmerLoader" style={{marginTop:"200px"}}></span>)
        }


        

       
    }
}