import React, { Component } from 'react';
import {Row, Col, ProgressBar, Form ,Button,Modal,Container,OverlayTrigger,Tooltip,Alert,Carousel} from 'react-bootstrap';
import "../assets/css/landholding.css";
import "../assets/css/inputproducts.css";
import UserService from "../services/user.service";
import MaterialTable from 'material-table';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import tableIcons from './icons';
import NestedTable from './nestedTable.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMapMarker, faMapMarkerAlt, faMobileAlt, faHome, faCaretRight,faSave, faWindowClose,faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import {TriggerAlert,AlertMessage} from './dryfunctions';
import AuthService from "../services/auth.service";
import ImageNotAvailable from "../assets/img/ImageNotAvailable.png";
import noImageFpo from "../assets/img/noImageFpo.jpg";
import NumberFormat from 'react-number-format';

import moment from "moment"


var mainCardObj = { total_sites     :   0,
                    total_area      :   0,
                    own_sites       :   0,
//                    leased_sites    :   0,
//                    irrigated_sites :   0,
//                    rainfed_sites   :   0
                };
                var mainCardObjBuying = { village     :   0,
                  orders      :   0,
                  values       :   0,

              };
   


                // getFilterData is called in component did mount and inside Dropdown in MaterialTable to
                // show data according to the selected value in dropdown.
function getFilterData(orderList, input_type) {
    var data = orderList.filter(function(product){   
          if (input_type == "all") {
              return product
          }  
          else {
          return product.product__is_service === parseInt(input_type)
          }
        }
    )
    return data
}
function addAfter(array, index, newItem) {
  return [
      ...array.slice(0, index),
      newItem,
      ...array.slice(index)
  ];
}
//have used class Component and inside that have declared all the needed variable in this.state.
  //  in constructor initially we r binding all the functions which are used on this page . Binding with this.
export default class OrderList extends Component {
    constructor(props){
        super(props);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleEstimatedDate = this.handleEstimatedDate.bind(this);
        this.handleActualDate = this.handleActualDate.bind(this);

        this.state ={
            orderData: [],
            finalData: [],
            //activeCardId: "registered",
            isLandHoldingLoading: false,
            isLandHoldingTabLoading: false,
            content : "",
            inputType: "0",  //0->For Product  1->For Service
            isParentLogged: false,
            fpoName: localStorage.getItem('fpoName'),
            updateModalshow:false,
            UpdateState:[],
            accessed_supervisor:"",
            logged_supervisor:"",
            selectedOrderStatus:"",
            tentativeDate:"",
            actualDate:"",
            remarks:"",
            initialOrderStatus: "",
            initialOrderRemarks: "",
            initialOrderExecDate: "",
            initialOrderActualDate:"",
            selectedOrderId:"",
            updateMessage:"",
            currentFpo:"",
            compareOrderDate:"" ,
            activeTabSelling: 'Fpo Listed',
            sellingactiveCardId:"Fpo Listed",
            // imageHeight:100,
            // imagewidth:100
            sellingModalIsOpen:false,
            fpoSellingdata:[],
            finalSellingRecord:[],
            sellingCropShow:[],
            selectedcropvalue:"",
            unitlist:[],
            selectedunitvalue:"",
            deliverymode:"",
            sellingProductName:"",
            sellingBrandName:"",
            sellingPrice:"",
            sellingestDate:"",
            sellingestDateDisabled:"",
            sellingRemarks:"",
            sellingstatus:"",
            sellingId:"",
            offeredQuantity:"",
            sellingCheckType:"",
            offeredQuantityclass:"startOfferedQuantityClass",selectedcropvalueclass:"",
            sellingProductNameclass:"",sellingBrandNameclass:"",
            selectedunitvalueclass:"UnitClass",sellingPriceclass:"",
            deliverymodeclass:"",sellingstatusclass:"",
            sellingestDateclass:"",sellingRemarksclass:"",sellingerrormessage:"",
            sellingOrderCreatedDate:"",sellingOrderUpdating:false,fullImageOpen:false,
            sellingImageOne:"",sellingImageTwo:"",
            sellingordertype:"Product",sellingstatustype:"all",
            // initailSelectedYear:10,
            initailSelectedYear:"2023-2024",
            dateRanges:[],
            sellingPriceMessage:"",
            StatusForDisable:"",
            farmerOrderYear:"2023-2024",
            farmerOrderStatus:"all",
            buyingCategory:"",
            timePeriod:"",
            tabSearchValue:"",
            tabNameFilter:"",
            tabType:""




        }
    }
    handleOfferedQuantity=(e)=>{
      
      // let validRegEx=/^[0-9]*$/;
      let validRegEx=/^(\d+)?([.]?\d{0,4})?$/

      // this.setState({
      //   offeredQuantity:e.target.value,
      //   offeredQuantityclass:"startOfferedQuantityClass"
      // })
      if (validRegEx.test( e.target.value)) {
        this.setState({
          offeredQuantity:e.target.value,
          offeredQuantityclass:"startOfferedQuantityClass"
        });
      } else {
        this.setState({
          offeredQuantitymessage:"Only Numeric value allowed"
         });
      }
    }
    showCropList = (sellingCropShow) =>
    sellingCropShow.length
    ? sellingCropShow.map((data) => (
        <option key={data.id} name={data.crop_name} value={data.id}>
          {data.crop_name}
        </option>
      ))
    : "";
    handleCropChange=(e)=>{
      this.setState({
        selectedcropvalue:e.target.value,
        selectedcropvalueclass:""
      })
    }
    handleBuyingTimePeriod=(e)=>{
      this.setState({
        timePeriod:e.target.value,
        TimePeriodclass:""
      })
    }
    checkSellingInputType=()=>{
      const{sellingCheckType}=this.state;
      
      // if(sellingCheckType==="service"|| sellingCheckType==="Service")
      if(sellingCheckType==="Service")

      {
        console.log("sellingCheckType",sellingCheckType)
      return true
      }
      else 
      return false
    }
    handlesellingStatusDisabled=()=>{
      const {StatusForDisable,sellingOrderUpdating}=this.state;
      if(StatusForDisable==="Completed"|| StatusForDisable==="Cancelled"|| StatusForDisable==="Rejected")

      {
        console.log("StatusForDisable",StatusForDisable)
      return true
      }
      if(sellingOrderUpdating)
        return true
    
         
      return false
    }
    
    showUnitList = (unitlist) =>
    unitlist.length
    ? unitlist.map((data) => (
        <option key={data.id} name={data.unit_name} value={data.id}>
          {data.unit_name}
        </option>
      ))
    : "";
    handleUnitChange=(e)=>{
      this.setState({
        selectedunitvalue:e.target.value,
        selectedunitvalueclass:"UnitClass"
      })
    }
    handlesellingProductName=(e)=>{
      this.setState({
        sellingProductName:e.target.value,
        sellingProductNameclass:""
      })
    }
    handlesellingBrandName=(e)=>{
      this.setState({
        sellingBrandName:e.target.value,
        sellingBrandNameclass:""
      })
    }
    handlesellingPrice=(e)=>{
      // this.setState({
      //   sellingPrice:e.target.value,
      //   sellingPriceclass:""
      // })
       
    // let validDateRegEx =/^[\d]*$/;
  

    // if (validDateRegEx.test( e.target.value)) {
    //   this.setState({
    //       sellingPrice:e.target.value,
    //       sellingPriceclass:"",
    //       sellingPriceMessage:""
    //   });
    // } else {
    //   this.setState({
    //     sellingPriceMessage:"Size value must be a number",
    //       });
    // }
    let validDateRegEx=/^(\d+)?([.]?\d{0,4})?$/

  

    if (validDateRegEx.test( e.target.value)) {
      this.setState({
        sellingPrice:e.target.value,
              sellingPriceclass:"",
              sellingPriceMessage:""
          });
     
    } else {
      this.setState({
         sellingPriceMessage:"Size value must be a number",
  });
    }
    }
    handlesellingstatus=(e)=>{
      this.setState({
        sellingstatus:e.target.value,
        sellingstatusclass:""
      })
    }
    handlesellingestDate=(e)=>{
      this.setState({
        sellingestDate:e.target.value,
        sellingestDateclass:""
      })
    }
   
    sellingMaxDate=()=>{
      const{sellingOrderCreatedDate}=this.state;
      let futureDate= new Date(sellingOrderCreatedDate);
      //  console.log("futureDate",futureDate,sellingOrderCreatedDate)
       let futureCopyDate = futureDate.setDate(new Date(futureDate).getDate() + 90); 
       let exa = new Date(futureCopyDate) //.toISOString().split("T")[0]
        // console.log("exa",exa.getMonth(),exa.getFullYear(),exa.getDate())
         let sendMaxDate=`${exa.getFullYear()}-${exa.getMonth()}-${exa.getDate()}`
        //  console.log("sendMaxDate",sendMaxDate)
         return sendMaxDate
    }
    handlesellingRemarks=(e)=>{
      this.setState({
        sellingRemarks:e.target.value,
        sellingRemarksclass:""
      })
    }
    handleDeliveryMode = (e) => {
      this.setState({ 
        deliverymode: e.target.value ,
        deliverymodeclass:""
      });
    };
    toggleClass(){
        const currentState = this.state.isActive;
        this.setState({ isActive: !currentState });
    }

    clickMenu(cardId){
        this.setState ({
            isLandHoldingTabLoading    :   true,
            activeCardId    :   cardId
        }, this.forwardToFetchingData(cardId));
    }
    forwardToFetchingData () {
       
     
        const fpoId = localStorage.getItem("fpoId")
        
        UserService.getInputOrdersList(fpoId).then(
            response => {
            // console.log("Click menu data", response)
              this.setState({
                orderData: response.data.order_data,
                isLandHoldingTabLoading    :   false
              });
            },
            error => {
              this.setState({
                isLandHoldingTabLoading    :   false,
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
   // on click on a dropdown in materialTable this function is called . inside it we r filtering data on the basis of options available in dropdown.
    handleTypeChange = (e) => {
        const filterList = getFilterData(this.state.finalData, e.target.value)
        this.setState({
            inputType: e.target.value,
            orderData: filterList
        })

    }
    FarmerFilterOnTheBasisStatus=(filteredTypeList,Sellingstatus)=>{
      var result = [];
      console.log("check",filteredTypeList)
      console.log("Sellingstatus",Sellingstatus)
      if(Sellingstatus==="all" || Sellingstatus==null)
      {
        return filteredTypeList
      }
      filteredTypeList.forEach((component, index)=> {
        const comp = {...component};
        console.log("statusComp",comp)
     
          comp.orders = component.orders.filter((subMenu)=> {
          return subMenu.order_status ==Sellingstatus ;
        });
        console.log(" Status comp.orders",comp.orders)
        console.log("Status new comp",comp)
  
        if( comp.orders.length > 0) {
          result.push(comp);
          console.log("Status length",result)
        }
       
        console.log(" Status result",result)
  
      });
        return result
     
     
      }
    AllFarmerOrderYear=(FarmerIterateList,FarmerYear,FarmerType,FarmerStatus)=>{
      console.log("FarmerIterateList",FarmerIterateList)
      console.log("FarmerYear",FarmerYear,"FarmerType",FarmerType)
      let compareYear=FarmerYear.split('-');
      console.log("compareYear",compareYear)
      let farmerListYear=FarmerIterateList;
      if(FarmerYear!="all"){
       farmerListYear=FarmerIterateList.filter((product)=>{
          let createdDate=product.created_at__date.slice(0, 4)
          return createdDate==compareYear[0]
      })
    }
       console.log("farmerListYear",farmerListYear)
       let farmerListType=farmerListYear.filter((product)=>{
        if(FarmerType==="all")
          return product
        else
          return product.product__is_service==FarmerType
     })
     console.log("farmerListType",farmerListType);
     let FarmerfilteredDataStatus = this.FarmerFilterOnTheBasisStatus(farmerListType, FarmerStatus)      
      console.log("FarmerfilteredDataStatus",FarmerfilteredDataStatus)
      this.setState({
      farmerOrderYear:FarmerYear,
      farmerOrderStatus:FarmerStatus,
      inputType:FarmerType,
      orderData: FarmerfilteredDataStatus

  
     })
  
      }
     














    filterOnTheBasisOfStatus=(filteredTypeList,Sellingstatus)=>{
      var result = [];
      // console.log("check",filteredTypeList)
      // console.log("Sellingstatus",Sellingstatus)
      if(Sellingstatus==="all")
      {
        return filteredTypeList
      }
      filteredTypeList.forEach((component, index)=> {
        const comp = {...component};
        // console.log("statusComp",comp)
     
          comp.orders = component.orders.filter((subMenu)=> {
          return subMenu.order_status ==Sellingstatus ;
        });
        // console.log(" Status comp.orders",comp.orders)
        // console.log("Status new comp",comp)
  
        if( comp.orders.length > 0) {
          result.push(comp);
          // console.log("Status length",result)
        }
       
        // console.log(" Status result",result)
  
      });
        return result
     
      }
   
    AllFiltersBuyingInputs=(IterateList,SellingYear,SellingType,Sellingstatus)=>{
      console.log("IterateList ",IterateList,"SellingYear ",SellingYear)
      // let filteredData = []
      let filterListYear=IterateList;
           if(SellingYear!=="all")
           {
      let compareYear=SellingYear.split('-');
       filterListYear=IterateList.filter((product)=>{
          let createdDate=product.created_at.slice(0, 4)
          return createdDate==compareYear[0]
      })
    }
       console.log("filterListYear",filterListYear)
       let filterListType=filterListYear.filter((product)=>{
                //  if(SellingType==="all")
                //  return product
                //  else
                return product.input_type==SellingType
            })
            console.log("filterListType",filterListType)
    
      



        // let filteredDataStatus = this.filterOnTheBasisOfStatus(filterListType, Sellingstatus)   
        let filteredDataStatus=filterListType.filter((product)=>{
           if(Sellingstatus==="all")
           return product
           else
          return product.order_status==Sellingstatus
      })   
      console.log("filteredDataStatus",filteredDataStatus)

    this.setState({
      fpoSellingdata: filteredDataStatus,

      initailSelectedYear:SellingYear,
      sellingordertype:SellingType,
      sellingstatustype: Sellingstatus,


  
    })
   
   
  
    }

   










    //Common function to redirect dashboard with respected logged users
    navigateMainBoard = () => {
        const {isParentLogged} = this.state
        if(isParentLogged){
          this.props.history.push("/fpohomeData");
        }
        else{
          this.props.history.push("/dashboard");
        }
      }
    
    // this function is called in breadcrumb.
    navigateToComponent = (pageName) => {
        const { fpoName, isParentLogged } = this.state

        if(isParentLogged){
            this.props.history.push("/inputs/" + fpoName);
        }
        else{
            this.props.history.push("/" + pageName + "");  
        }    
    };
    handleOption1 = (data) => {
      if (data === "Pending") {
        return ["Pending","Accepted", "Rejected"];
      } else if (data === "Accepted") {
        return ["Accepted","Completed", "Failed"];
      }
       else if (data === "Completed") {
          return [ "Completed"];
      }
       else if (data === "Rejected") {
         return [ "Rejected"];
      }
       else if(data=="Failed")  {
        return ["Failed "];
       }
       else{
          return ["NA"];
       }
    };
    handleEstimatedDate = (e) => {
      this.setState({ tentativeDate: e.target.value,tentclass:"" });
    };
    handleActualDate = (e) => {
      this.setState({ actualDate: e.target.value,actualclass:"" });
    };
    handleRemarks = (e) => {
      this.setState({ remarks: e.target.value,remarksclass:"" });
    };
   
    addValidation = () => {
      let errors = false;
      
      if (this.state.selectedOrderStatus ==="Rejected"||this.state.selectedOrderStatus ==="Failed") {
        //  console.log("this.state.remark",this.state.remarks)
        if (this.state.remarks===null || this.state.remarks==="") {
          errors = true;

          this.setState({
            remarksclass: "requiredinputfields",
          });
              setTimeout(() => {
      this.setState({
        remarksclass: "",
          });
  }, 5000)
  
  
          
        }
      }
     if(this.state.selectedOrderStatus==="Accepted")
     { 
      
        if (this.state.tentativeDate===null || this.state.tentativeDate==="") {
          
          
          errors = true;
          this.setState({
            tentclass: "requiredinputfields",
          });
           setTimeout(() => {
      this.setState({
        tentclass: "",
          });
  }, 5000)
  
        }
     }
     if(this.state.selectedOrderStatus==="Completed")
     { 
      
        if (this.state.actualDate===null || this.state.actualDate==="") {
          
          
          errors = true;
          this.setState({
            actualclass: "requiredinputfields",
          });
           setTimeout(() => {
      this.setState({
        actualclass: "",
          });
  }, 5000)
  
        }
     }
      if (errors == false) {
        this.setState({ errorremarksmessage: "" });
        return true;
      } else {
       
        this.setState({
          errorremarksmessage: "Required fields must be filled",
        });
        return false;
      }
    };
      sellingValidation = () => {
        let errors = false;
        const{sellingCheckType}=this.state;
        if(sellingCheckType==="product"|| sellingCheckType==="Product")
         {
          console.log("this.state.selectedcropvalue",this.state.selectedcropvalue)
        if (this.state.selectedcropvalue == "" || this.state.selectedcropvalue===null) {
          errors = true;
          console.log("crop")
          this.setState({ selectedcropvalueclass: "requiredinputfields" });
        }
        if (this.state.sellingProductName == "" || this.state.sellingProductName===null) {
          errors = true;
          console.log("product")

          this.setState({ sellingProductNameclass: "requiredinputfields" });
        }
        if (this.state.sellingBrandName == "" || this.state.sellingBrandName===null) {
          errors = true;
          console.log("brand")

          this.setState({ sellingBrandNameclass: "requiredinputfields" });
        }
      }
      // if(sellingCheckType==="Service"){
      //   if (this.state.timePeriod == "" ||this.state.timePeriod===null ) {
      //    errors=true;
      //    this.setState({ TimePeriodclass: "requiredOfferedQuantityClass" });

      // }}

        if (this.state.offeredQuantity == "" ||this.state.offeredQuantity===null ) {
          errors = true;
          console.log("quantity")

          this.setState({ offeredQuantityclass: "requiredOfferedQuantityClass" });
        }
        if (this.state.selectedunitvalue == "" || this.state.selectedunitvalue ===null) {
          errors = true;
          console.log("unit")

          this.setState({ selectedunitvalueclass: "requiredUnitClass" });
        }
    
        if (this.state.sellingPrice == "" || this.state.sellingPrice ===null) {
          errors = true;
          console.log("price")

          this.setState({ sellingPriceclass: "requiredinputfields" });
        }
        if (this.state.deliverymode == "") {
          errors = true;
          // console.log("mode")

          this.setState({ deliverymodeclass: "requiredinputfields" });
        }
        if (this.state.sellingstatus == "") {
          errors = true;
          console.log("status")

          this.setState({ sellingstatusclass: "requiredinputfields" });
        }
        if (this.state.sellingestDate == "" || this.state.sellingestDate===null) {
          errors = true;
          // console.log("date")

          this.setState({ sellingestDateclass: "requiredinputfields" });
        }
        if (this.state.sellingRemarks == "" || this.state.sellingRemarks===null) {
          errors = true;
          // console.log("remarks")

          this.setState({ sellingRemarksclass: "requiredinputfields" });
        }
    
        if (errors == false) {
          this.setState({ sellingerrormessage: "" });
          return true;
        } else {
          this.setState({ sellingerrormessage: "Required fields must be filled" });
          return false;
        }
      };








    
    sellingSaveChanges=()=>{
      const{selectedunitvalue,deliverymode,sellingProductName,sellingBrandName,sellingPrice,sellingestDate,sellingRemarks,
        selectedcropvalue,sellingId ,timePeriod,sellingstatus,offeredQuantity,sellingCheckType}=this.state
        // console.log("on save","selectedunitvalue ",selectedunitvalue,"deliverymode ",deliverymode,"sellingProductName ",sellingProductName,
        // "sellingBrandName ",sellingBrandName,"sellingPrice ",sellingPrice,"sellingestDate ",sellingestDate,"sellingRemarks ",sellingRemarks,
        // selectedcropvalue,"sellingId",sellingId,"sellingstatus",sellingstatus
        // ,"offeredQuantity ",offeredQuantity)

        var success = this.sellingValidation();
       
         if(success==true){

        // let sendindData={
        //  "id": sellingId,
        //  "order_status":parseInt (sellingId),
        //  "fpo_accepted_quantity":parseInt (offeredQuantity),
        //  "fpo_offered_price":parseInt(sellingPrice),
        //  "fpo_date_of_delivery":sellingestDate,
        //  "mode_of_delivery":deliverymode,
        //  "fpo_remarks":sellingRemarks,
        //  "crop_id":parseInt(selectedcropvalue),
        //  "fpo_product_name":sellingProductName,
        //  "fpo_brand_name":sellingBrandName,
        // }
        // console.log("send",sendindData)
        this.setState({
          sellingOrderUpdating:true
        })
        const data = new FormData();
        console.log("sellingCheckType",sellingCheckType)
        if(sellingCheckType==="product"|| sellingCheckType==="Product")
        {
          console.log("why enter")
          data.append("crop_id", parseInt(selectedcropvalue));
          data.append("fpo_product_name", sellingProductName);
          data.append("fpo_brand_name", sellingBrandName);
        }
        // if(sellingCheckType==="Service")
        // {
        //   data.append("time_period", timePeriod);

        // }

        data.append("id",parseInt (sellingId));
        data.append("order_status", sellingstatus);
        data.append("fpo_accepted_quantity", parseInt (offeredQuantity));
        data.append("fpo_offered_price", parseInt(sellingPrice));
        data.append("fpo_date_of_delivery", sellingestDate);
        data.append("mode_of_delivery", deliverymode);
        data.append("fpo_remarks", sellingRemarks);
        data.append("fpo_units_id", selectedunitvalue);
        console.log("this.state.fpoSellingdata",this.state.fpoSellingdata)

        var flag = false; 
        UserService.EditSellingOrders(data).then(
          response => {
            flag = true; 
            console.log("updated data ", response);
            if(response.data.success){
              console.log("success",response.data.data)
              // var currentSellingList = this.state.fpoSellingdata;
              // var gettingoldOrder = this.state.fpoSellingdata.find(item => item.id === parseInt(sellingId));
              // console.log("gettingoldOrder",gettingoldOrder)
              // var gettingSeperateOrders=gettingoldOrder.orders
              // console.log("gettingSeperateOrders",gettingSeperateOrders)
              // var gettingIndex = gettingSeperateOrders.findIndex(item => item.id === parseInt(sellingId));
              // console.log("gettingIndex",gettingIndex)

            
              //   let neworderEdit=gettingSeperateOrders.filter(item => item.id !== parseInt(sellingId))
              //   const finalAddedarray = addAfter(neworderEdit, gettingIndex, response.data.data)

              //   console.log("neworderEdit",neworderEdit)
              //   console.log("finalAddedarray",finalAddedarray)
              //   delete gettingoldOrder.orders;
              //    console.log("final",gettingoldOrder)
              //    gettingoldOrder['orders'] = finalAddedarray;
              //    console.log("final adding",gettingoldOrder)
              //     var resFarmers = this.state.fpoSellingdata.filter(item => item.id !== parseInt(sellingId));
              //   console.log("resFarmers",resFarmers)
              //   var resFarmersIndex = this.state.fpoSellingdata.findIndex(item => item.id === parseInt(sellingId));
              //   console.log("resFarmerssecond",resFarmersIndex)
              //   const newfinalArrayHello = addAfter(resFarmers, resFarmersIndex, gettingoldOrder)
                
                this.setState({
                  sellingOrderUpdating:false,
                

                })
              UserService.getBuyingOrderData().then(
                response => {
                  flag = true; 
                  if(response.data.success){
                    this.setState({
                      // fpoSellingdata:response.data.data,
                      finalSellingRecord:response.data.data,

                      sellingModalIsOpen:false,
                      sellingOrderUpdating:false


                    })
                    this.AllFiltersBuyingInputs(response.data.data,this.state.initailSelectedYear,this.state.sellingordertype,this.state.sellingstatustype)

                  }
                },
                error => {
                  flag = true; 
                  this.setState({
                    // isLandHoldingLoading    :   false,
                    content:
                      (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                      error.message ||
                      error.toString()
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
              );
            }
            else{
              this.setState({
                sellingOrderUpdating:false
              })
              TriggerAlert("Error",response.data.message,"error");
            }
          },
          error => {
            flag = true; 
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
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
          //     this.navigateMainBoard()
          //     }
          // }, 30000)
        );
        }

    }
    SaveUpdateChanges = () => {
      const {
        selectedOrderStatus,
        tentativeDate,
        actualDate,
        remarks,
        selectedOrderId,
        initialOrderStatus,
        initialOrderRemarks,
        initialOrderExecDate,
        initialOrderActualDate,
        updateMessage,
      } = this.state;
    
  
      // var dataRemarks = remarks;
      // console.log("initialOrderRemarks",initialOrderRemarks," remarks",remarks)
    //  console.log("remarks",remarks)
     if(remarks==="")
     {
       console.log("empty remarks")
     }
  
       if (
        initialOrderStatus === selectedOrderStatus &&
        initialOrderRemarks === remarks &&
        initialOrderExecDate === tentativeDate &&
        initialOrderActualDate===actualDate
      ) 
      {
        AlertMessage("No Changes Applied.","warning");
  
        return false;
      }
      var success = this.addValidation();
      // console.log("success", success);
      if (success == true) {
        this.setState({
          isOrderUpdating: true,
        });
        const data = {
          order_status: selectedOrderStatus,
          tentative_execution_date: tentativeDate,
          actual_execution_date:actualDate,
          remarks: remarks,
        };
        var flag = false;
   
        UserService.UpdateInputOrder(selectedOrderId, data).then(
          (response) => {
          
            flag = true;
            if (response.data.success) {

            //   var currentOrderList = this.state.orderData;
            //   var responseOrderData = response.data.data.orders;
         
            //   var ExactDataList = responseOrderData.find(function(e) {
            //     return e.id == selectedOrderId;
            //   });
            
            //   let indexOfEditedOrder = -1;
            //   let orderListIndex = -1;
            //   currentOrderList.map((inputObject, procindex) => {
            //     let currentInputOrder = inputObject.orders;
            //     currentInputOrder.filter((item, orderIndex) => {              
                 
                 
                 
                 
            //       if (item.id === selectedOrderId) {
            //         indexOfEditedOrder = orderIndex;
            //         orderListIndex = procindex;
                 
            //       }
                 
                 
            //     });
            //   });
           
            //   let oldOrderList = JSON.parse(JSON.stringify(currentOrderList));
           
            //   oldOrderList[orderListIndex].orders[
            //     indexOfEditedOrder
            //   ] = ExactDataList;
             
            //   let dataOfOrderList = oldOrderList;
           
  
            //   this.setState(
            //     {
            //       updateMessage: response.data.message,
            //       orderData: dataOfOrderList,
                 
            //       updateModalshow: true,
            //       selectedOrderId: "",
            //       isOrderEdit: false,
            //       isOrderUpdating: false,
            //     }
              
            //   );

            //   setTimeout(() => {
            //     this.setState({
            //       updateModalshow: false,
            //         });
            // }, 2000)
            const fpoId = localStorage.getItem("fpoId")
                this.setState({
                  updateMessage: response.data.message,
                  updateModalshow: true,
                  isOrderEdit: false,
                  isOrderUpdating: false,

     
                })
            UserService.getInputOrdersList(fpoId).then(
              response => {
                flag = true; 
                if(response.data.success){
                  this.setState({
                      isLandHoldingLoading    :   false,
                      // updateModalshow: false,
                      isOrderEdit: false,
                      isOrderUpdating: false,

                      finalData: response.data.order_data,
                      isLandHoldingTabLoading    :   false
                  },this.AllFarmerOrderYear(response.data.order_data,this.state.farmerOrderYear,this.state.inputType,this.state.farmerOrderStatus));
                     setTimeout(() => {
                this.setState({
                  updateModalshow: false,
                    });
            }, 1500)
                }
              },
              error => {
                flag = true; 
                this.setState({
                  isLandHoldingLoading    :   false,
                  content:
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString()
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
            );
            
            
           
            }
           
          },
          (error) => {
            flag = true;
            if (error.response) {
              TriggerAlert("Error", error.response.data.message, "error");
            } else {
              TriggerAlert(
                "Error",
                "Server closed unexpectedly, Please try again",
                "error"
              );
            }
            this.setState({
              updateModalshow: false,
              selectedOrderId: "",
              isOrderEdit: false,
              isOrderUpdating: false,
            });
          }
        );
      } else {
        console.log("error");
      }
    
      
    };
    onChangeStatus = (e) => {
      this.setState({ selectedOrderStatus: e.target.value });
    };
    // after loading the page inside ComponentDidMount this function is called . inside it we are calling an UserService 
    // and storing the data data comiing from that in a state Variable.
      //  Here if response is not true then api will through an error message.

    getCardData(fpoId){
        var flag = false;   
        if( this.props.location.search!="")
        {
          let queryParam= this.props.location.search;
          console.log("web initial",queryParam.length)
          console.log("web params22", queryParam);
          let SplitqueryParam= queryParam.split("&");
          console.log("web params34", SplitqueryParam);
          let SplitqueryParamTabValue= SplitqueryParam[1];
          let SplitqueryParamSearchValue
          if(SplitqueryParam.length>=5)
          {
            console.log("web 5")
             SplitqueryParamSearchValue= SplitqueryParam[4];
          }
          else{
            console.log("web55")

             SplitqueryParamSearchValue= SplitqueryParam[3];

          }
          let SplitqueryParamType= SplitqueryParam[2];
          console.log("web params58", SplitqueryParamSearchValue);
          let SplitqueryParamEndValue= SplitqueryParamSearchValue.split("=")[1];
          let SplitqueryTabValue= SplitqueryParamTabValue.split("=")[1];
          let SplitqueryTabShow= SplitqueryParamType.split("=")[1];

          console.log("web params67", SplitqueryParamEndValue,"  ",SplitqueryTabValue);
          this.setState({
            tabSearchValue:SplitqueryParamEndValue,
            tabNameFilter:SplitqueryTabValue,
            tabType:SplitqueryTabShow
          })
          
        }
        UserService.getInputOrdersList(fpoId).then(
            response => {
              flag = true; 
              // console.log("only card render call ", response);
              if(response.data.success){
                // const filterList = getFilterData(response.data.order_data, this.state.inputType)
                  // const filterList=this.AllFarmerOrderYear(response.data.order_data,this.state.farmerOrderYear,this.state.inputType,this.state.farmerOrderStatus)
                // console.log("response",response)
                //  mainCardObj contains data values which are shown in the top cards on the browser.
                mainCardObj = {
                    total_village     :   response.data.village,
                    total_products      :   response.data.products,
                    total_orders      :   response.data.orders,
                    value    :   response.data.value
                }
                // console.log("fifty",this.props.location)
                if( ((this.props.location.search!="")&&( this.state.tabNameFilter==="fpo-listed-input")))
                  { 
                    console.log("enter1")
                    let filteredData=response.data.order_data.filter((item)=>item.village===this.state.tabSearchValue)
                    console.log("enter3",filteredData)
                    this.setState({
                      isLandHoldingLoading :false,
                      finalData: response.data.order_data,
                      isLandHoldingTabLoading :false,
                      activeTabSelling:'Fpo Listed'
                      // farmerOrderYear:FarmerYear,
                      // farmerOrderStatus:"Pending",
                      // inputType:"all",
                      // orderData: filteredData
                    },this.AllFarmerOrderYear(filteredData,"all","all","all"))
                  }
                  else{
                    console.log("enter2")
                   this.setState({
                    isLandHoldingLoading    :   false,
                    // orderData: filterList,
                    // orderData: response.data.order_data,

                    finalData: response.data.order_data,
                    isLandHoldingTabLoading    :   false
                },this.AllFarmerOrderYear(response.data.order_data,this.state.farmerOrderYear,this.state.inputType,this.state.farmerOrderStatus));
                }
              }
            },
            error => {
              flag = true; 
              this.setState({
                isLandHoldingLoading    :   false,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
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
          );
          UserService.getBuyingOrderData().then(
            response => {
              flag = true; 
              // console.log("only card render call ", response);
              if(response.data.success){
         
                mainCardObjBuying = {
                  village     :   response.data.cumulative_data.village,
                  orders      :   response.data.cumulative_data.orders,
                  values      :   response.data.cumulative_data.value,
              } 
                
              if( ((this.props.location.search!="")&&( this.state.tabNameFilter==="farmer-interest-for-input")))
              { 
                console.log("happy1")
                let filteredData=response.data.data.filter((item)=>item.ticketid==this.state.tabSearchValue)   
                console.log("enter4",filteredData)

                this.setState({
                  finalSellingRecord:response.data.data,
                  activeTabSelling:"Farmer Interest"
                },()=>{
                  if(this.state.tabType==="product-orders") 
                  {
                    this.AllFiltersBuyingInputs(filteredData,"all","Product","all")
                  }
                  else
                  this.AllFiltersBuyingInputs(filteredData,"all","Service","all")
                }
                )
              }   
              else{
                this.setState({
                  finalSellingRecord:response.data.data,
                },this.AllFiltersBuyingInputs(response.data.data,"2023-2024","Product","all")
                )
              }         
               

              }
            },
            error => {
              flag = true; 
              this.setState({
                // isLandHoldingLoading    :   false,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
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
            //     this.navigateMainBoard()
            //     }
            // }, 30000)
          );
          UserService.getSellingCropList().then(
            response => {
              flag = true; 
              console.log("sellingCropShow ", response);
              if(response.data.success){
                console.log("sellingCropShow success",response.data.data)
                this.setState({
                  sellingCropShow:response.data.data
                })
              }
            },
            error => {
              flag = true; 
              this.setState({
                // isLandHoldingLoading    :   false,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString()
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
          );
          UserService.getYearRanges().then(
            (response) => {
                flag = true;
                console.log("res",response.data.date_ranges)
              
                this.setState({
                    
                    dateRanges: response.data.date_ranges,
                    showloader: false,
                });
               console.log("dateRanges",this.state.dateRanges)
            },
            (error) => {
                flag = true;
                this.setState({
                    // showloader: false,
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
    }
    CheckUserParent=(buttonstatus)=>{
      const{accessed_supervisor,logged_supervisor}=this.state;
      if(parseInt(this.state.accessed_supervisor) !== parseInt(this.state.logged_supervisor))
      {
        return true;
      }
      if(buttonstatus===null)
      {
        return true;
      }
    return false;
    }
    handleStatusColor=(StatusMessage)=>{
        if(StatusMessage==="Completed")
        return "GreenMessageText";
        else if (StatusMessage==="Rejected" || StatusMessage==="Failed")
        return "RedMessageText"
        else if (StatusMessage==="Pending")
        return "OrangeMessageText"
        else if (StatusMessage==="Accepted")
        return "BlueMessageText"
        else
        return ""
    }
    maxDate=()=>{
      var dtToday = new Date();
      var month = dtToday.getMonth() + 1;
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;  
        return maxDate

    }
    activeTabSelling(cardId) {
      this.setState({
          isLandHoldingTabLoading: true,
          activeTabSelling: cardId
      })
  }
 
  // handleImageUrl=(rowData)=>{
  //   console.log("rowData",rowData)
  //   if(rowData.photo1_presigned_url==null && rowData.photo2_presigned_url!=null)
  //   {
  //     console.log("first",rowData.photo1_presigned_url, "   ",rowData.photo2_presigned_url)
  //   return rowData.photo2_presigned_url;
  //   }
  //   else if (rowData.photo1_presigned_url!=null && rowData.photo2_presigned_url==null)
  //   {
  //     console.log("second",rowData.photo1_presigned_url, "   ",rowData.photo2_presigned_url)

  //   return rowData.photo1_presigned_url
  //   }
  //   else
  //   return noImageFpo
  // }

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
 
    render() {
        const { orderData ,updateModalshow,UpdateState,selectedOrderStatus,tentativeDate,
          actualDate,remarks,selectedOrderId,updateMessage,currentFpo,sellingModalIsOpen,fpoSellingdata,sellingCropShow,selectedcropvalue
        ,selectedunitvalue,unitlist,deliverymode,offeredQuantity,sellingCheckType,fullImageOpen, dateRanges} = this.state;
          const sellingUpdateModal=(unitvalue,updateId,rowData)=>{
            console.log("i am data here",rowData)
            console.log("unitvalue",unitvalue)
            let sendunit=unitvalue.toLowerCase()
            // let str = sendunit.replace(/^"(.*)"$/, '$1');
            // console.log("str",str)

            //  if (sendunit==="products")
            //       sendunit="product"
            // UserService.getUnitList(sendunit).then(
              UserService.getUnitList("product").then(

              (response) => {

                console.log("unitlist",response.data.data)
               
                this.setState({
                  unitlist: response.data.data,
                });
              },
              (error) => {
                this.setState({
                  content:
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString(),
                });
              }
            );
            this.setState({
              offeredQuantityclass:"startOfferedQuantityClass",
              selectedunitvalueclass:"UnitClass",
              sellingModalIsOpen:true,
              sellingId:updateId,
              sellingCheckType:unitvalue,
              timePeriod:rowData.time_period,
              selectedcropvalue:rowData.crop_id,
              sellingProductName:rowData.fpo_product_name,
              sellingBrandName:rowData.fpo_brand_name,
              offeredQuantity:rowData.fpo_accepted_quantity,
              sellingPrice:rowData.fpo_offered_price,
              deliverymode:rowData.mode_of_delivery,
              sellingstatus:rowData.order_status,
              sellingestDate:rowData.fpo_date_of_delivery,
              sellingestDateDisabled:rowData.fpo_date_of_delivery,

              sellingRemarks:rowData.fpo_remarks,
              selectedunitvalue:rowData.fpo_units_id,
              sellingOrderCreatedDate:rowData.created_at.slice(0, 10),
              StatusForDisable:rowData.order_status,
              buyingCategory:rowData.input_category__input_category






            },()=> console.log("time period ",this.state.time_period))
           
          }

          const sellingUpdateClose = () => {
            this.setState({
              sellingModalIsOpen:false,
              sellingerrormessage:"",
              selectedcropvalueclass:"",
              sellingProductNameclass:"",
              sellingBrandNameclass:"",
              offeredQuantityclass:"",
              selectedunitvalueclass:"",
              sellingPriceclass:"",
              deliverymodeclass:"",
              sellingstatusclass:"",
              sellingestDateclass:"",
              sellingRemarksclass:"",
              offeredQuantityclass:"startOfferedQuantityClass",
              selectedunitvalueclass:"UnitClass"


           
            });
          };
          const showFullImage=(rowData)=>{
            console.log("full image is open")
             this.setState({
              fullImageOpen:true,
              sellingImageOne:rowData.photo1_presigned_url,
              sellingImageTwo:rowData.photo2_presigned_url
              // sellingImageShow:rowData.photos,
             })
            //  console.log("sellingImageShow",this.state.sellingImageShow)

          }
          const hideFullImage=()=>{
            this.setState({
              fullImageOpen:false
            })

          }
          const showUpdateModal = (selectdRow) => {
            this.setState({
              updateModalshow: true,
              selectedOrderId: selectdRow.id,
              selectedOrderStatus:selectdRow.order_status,
              tentativeDate:selectdRow.tentative_execution_date__date,
              actualDate:selectdRow.actual_execution_date__date,
              remarks:selectdRow.remarks,
              initialOrderStatus: selectdRow.order_status,
              initialOrderRemarks: selectdRow.remarks,
              initialOrderExecDate: selectdRow.tentative_execution_date__date,
              initialOrderActualDate: selectdRow.actual_execution_date__date,

              UpdateState:this.handleOption1(selectdRow.order_status),
              tentclass:"",
              actualclass:"",
              remarksclass:"",
              updateMessage:"",
              errorremarksmessage:"",
              compareOrderDate:selectdRow.created_at.slice(0, 10)
            
          });
          };
         
          const updatehandleClose = () => {
            this.setState({
              updateModalshow: false,
             isOrderUpdating:false,
           
            });
          };
    //  console.log("orderData",orderData)
     // nestedColumns is assigned under detailPanle. nestedColumn is showing a table .
          const nestedColumns=[
                /* { title: "Site Id", field: "id"}, */
                { title: "Customer Details", field: "customer",
                width: "25%",
              },{ title: "Total Amount", field: "tot_price",
              width: "30%",hidden:true, export:true},
                { title: "Order Details", field: "quantity_ordered",
                width: "30%",
                  render: rowData => {
                      return(
                          <div className="wrap">
                              <Row className="noPadding border-bottom" title="Quantity Ordered">
                                  <Col lg="2" md="2" sm="2" className="noPadding" >
                                    <i className="siteDetailIcons QuantityOrdered" ></i>
                                  </Col>
                                  <Col lg="10" md="10" sm="10" className=""  style={{padding: "8px 0px 0px 5px"}}>
                                    Quantity-Ordered :{rowData.quantity_ordered}
                                  </Col>
                              </Row>
                              <Row className="noPadding" title="Total Amount">
                                  <Col lg="2" md="2" sm="2" className="noPadding" >
                                    <i className="siteDetailIcons TotalPrice" ></i>

                                  </Col>
                                  <Col lg="10" md="10" sm="10" className="" title="Total Amount" style={{padding: "8px 0px 0px 5px"}}>
                                    Total Amount :₹ {rowData.tot_price}
                                  </Col>

                              </Row>
                          </div>
                      );
                  },
                
                },
                { title: "Offered Prices", field: "offered_price",
                width: "20%",
                  render: rowData => {
                        return(
                            <div className="wrap">
                               <Row className="noPadding" title="Site Area">
                                    <Col lg="2" className="noPadding">
                                        <i className="siteDetailIcons OfferedPrice" title="Offer Price"></i>
                                    </Col>
                                    <Col lg="6" className="noPadding" title="Offer Price" style={{padding: "8px 0px 0px 15px"}}>
                                    ₹ {rowData.offered_price}
                                    </Col>
                                </Row>
                                {/* <Row className="noPadding border-bottom" title="Site Area">
                                    <Col lg="2" className="noPadding">
                                        <i className="siteDetailIcons OfferedPrice" title="Offer Price"></i>
                                    </Col>
                                    <Col lg="6" className="noPadding" title="Offer Price" style={{padding: "8px 0px 0px 15px"}}>
                                    ₹ {rowData.offered_price}
                                    </Col>
                                </Row> */}
                                {/* <Row className="noPadding" title="Land Water Type">
                                    <Col lg="2" className="noPadding" title="Land Water Type">
                                        <i className="siteDetailIcons LandWaterTypeIcon"></i>
                                    </Col>
                                    <Col lg="6" className="noPadding" title="Land Water Type" style={{padding: "8px 0px 0px 15px"}}>
                                        Noted/Not
                                    </Col>
                                </Row> */}
                            </div>
                        );
                  }
                },
               
                {
                    title: "Order Status",
                    field: "order_status",
                    width: "15%",
                    render: (rowData) => {
                      return rowData.order_status ? <span className={this.handleStatusColor(rowData.order_status)}>{rowData.order_status} </span>: "NA";
                    },
                  },
                  {
                    title: "Order Date",
                    field: "created_at",
                    width: "15%",
                    render: (rowData) => {
                      // console.log("slice",rowData)
                      return rowData.created_at.slice(0, 10)
                    },
                    
                   
                  },
                  {
                    title: "Status Change",
                    field: "",
                    width: "10%",
                    // render: (rowData) => {
                    //   return (
                    //     <Button
                    //      onClick={() => showUpdateModal(rowData)}
                    //      type="button"
                    //      name="button"
                    //      align="center"
                    //    >
                    //      Update
                    //    </Button>
                        
                    //   );
                    // },
                    render: (rowData) => {
                      return (
                        // <Button
                        //   disabled={this.CheckUserParent()}
            
                        //   onClick={() => showUpdateModal(rowData)}
                        //   type="button"
                        //   name="button"
                        //   align="center"
                        // >
                        //   Update
                        // </Button>
                      
                        this.CheckUserParent(rowData.order_status)?
                          (<OverlayTrigger key="left" placement="left"
                        
                          overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
                     
                         
                     <Button
                      
                      style={{opacity:"0.3",cursor:"not-allowed"}}
                      className="buttonBackgroundColor"

                         type="button"
                        
                         align="center"
                       >
                         Update
                       </Button>
                         
                        </OverlayTrigger>)
                       
                       
                       : (<Button
                        
            
                         onClick={() => showUpdateModal(rowData)}
                         type="button"
                         name="button"
                         align="center"
                         className="buttonBackgroundColor"
                       >
                         Update
                       </Button>)
                       
                         
                        
                      );
                    },
                  },
            ];
//            const nestedSellingColumns=[

            
//             {
//               title: "Order Date",
//               field:"created_at",
//               filtering: false,
//               render:(rowData)=>{ 
              
//                 return(
//                   moment(rowData.created_at).format("YYYY/MM/DD")
//                 )
//               },
//               cellStyle: {
//                   width: "15%",
//               },
//           },
//             {
//               title: "Farmer Details",
//               field:"customer",
//               filtering: false,
//               cellStyle: {
//                   width: "15%",
//               },
//           },
//           {
//             title: "Product Image",
//             field:"cropimage",
//             filtering: false,
            
//             render:(rowData)=>{
//                return (
//                 //  <div className="outerimg">
//                 //  <img src={noImageFpo} alt="helo"className="innerimg" ></img>
              
//                 //  </div>
//                 // <div>Hello</div>
//                   <div style={{cursor:"pointer"}}>
//                     {
//                     (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url===null)?
//                     <img src={noImageFpo} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img>

//                     : 
//                     (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url!==null)?
//                     <img src={rowData.photo2_presigned_url} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img>
//              :
//              <img src={rowData.photo1_presigned_url} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img>
//             }
//                  {/* <img src={rowData.photo1_presigned_url} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img> */}
//                  {/* <img src={this.handleImageUrl(rowData)} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img> */}

//                  </div>
//                )
//             },
//             cellStyle: {
//                 width: "15%",
//             },
//         },
//       //   {
//       //     title: "Crop Name",
//       //     field:"crop_name",
//       //     filtering: false,
//       //     render: rowData => {
//       //       return(
//       //         <div>{rowData.crop_name?rowData.crop_name:"NA"} </div>
//       //       )
//       //     },
//       //     cellStyle: {
//       //         width: "15%",
//       //     },
//       // },
//       {
//         title: "Quantity Ordered  (Farmer)",
//         field: "quantity_ordered",
//         hidden:true,
//         export:true,
//         filtering: false,
//         cellStyle: {
//           width: "15%",
//         },
//       },
//       {
//         title: "Price (Farmer) ",
//         field: "expected_price",
//         hidden:true,
//         export:true,
//         filtering: false,
//         cellStyle: {
//           width: "15%",
//         },
//       },
//       {
//         title: "Product Details (Farmer)",
//         filtering: false,
//         export:false,
//             render:(rowData)=>{
//             return (
//              <div>
//             <div>{rowData.crop_name? <div>Crop Name : <span className='darkGreenText'> {rowData.crop_name}</span></div>: "" }
//             {rowData.time_period? <div>Time : <span className='darkGreenText'> {rowData.time_period}</span></div>: "" }
//             </div>
//            <div>Quantity Ordered : <span className='darkGreenText'> {rowData.quantity_ordered}</span></div>
//            <div>Expected Price : <span className='darkGreenText'>₹ {rowData.expected_price}</span></div>


//              </div>
//             )
//          },
//         cellStyle: {

//             width: "15%",
//         },
//     },
//     {
//       title: "Date of Delivery(Farmer)",
//       field: "expected_delivery_date",
//       hidden:true,
//       export:true,
//       filtering: false,
//       cellStyle: {
//         width: "15%",
//       },
//     },
//     {
//       title: "Date of Delivery (FPO) ",
//       field: "fpo_date_of_delivery",
//       hidden:true,
//       export:true,
//       filtering: false,
//       cellStyle: {
//         width: "15%",
//       },
//     },
//     {
//       title: "Expected Date of Delivery",
//       filtering: false,
//       export:false,

//       render:(rowData)=>{
//         // console.log("slice",rowData.expected_delivery_date.slice(0,10))
//         // console.log("slice22",rowData.fpo_date_of_delivery)

//         return (
//          <div>
//        {rowData.expected_delivery_date?<div> Farmer: <span className='darkGreenText'>{rowData.expected_delivery_date.slice(0,10)}</span></div>:""}

//        {rowData.fpo_date_of_delivery?<div> FPO : <span className='darkGreenText'>{rowData.fpo_date_of_delivery.slice(0,10)}</span></div>:""}
//       {/* //  <div> Date of Delivery(FPO) {rowData.fpo_date_of_delivery}</div> */}


//          </div>
//         )
      
//      },
//       cellStyle: {
//           width: "15%",
//       },
//   },
//   {
//     title: "Quantity (FPO)",
//     field: "fpo_accepted_quantity",
//     hidden:true,
//     export:true,
//     filtering: false,
//     cellStyle: {
//       width: "15%",
//     },
//   },
//   {
//     title: "Price (FPO)",
//     field: "fpo_offered_price",
//     hidden:true,
//     export:true,
//     filtering: false,
//     cellStyle: {
//       width: "15%",
//     },
//   },
//   {
//     title: "Offered Quantity/Price (FPO) ",
//     filtering: false,
//     export:false,
//     render:(rowData)=>{
//       return (
//        <div>
//      <div>  Quantity:<span className='darkGreenText'> {rowData.fpo_accepted_quantity}</span></div>
//      <div> Price :<span className='darkGreenText'>{rowData.fpo_offered_price?"₹"+ rowData.fpo_offered_price:"NA"}</span></div>


//        </div>
//       )
//    },
//     cellStyle: {
//         width: "15%",
//     },
// },
// {
//   title: "Order Status",
//   field:"order_status",
//   filtering: false,
//   cellStyle: {
//       width: "15%",
//   },
// },
// {
//   title: "Change Status",
//   filtering: false,
//   render:(rowData)=>{
//     return (
//       // this.CheckUserParent(rowData.order_status)?
//       // (<OverlayTrigger key="left22" placement="left"
    
//       // overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
 
     
//       //       <Button
  
//       //          style={{opacity:"0.3",cursor:"not-allowed"}}
//       //          className="buttonBackgroundColor"
//       //           type="button"
//       //               align="center"
//       //                >
//       //                  Update
//       //               </Button>
//       //             </OverlayTrigger>)
//       //             : (
//                   <Button
//                 onClick={() => sellingUpdateModal(rowData.input_type,rowData.id,rowData)}
//                  type="button"
//                     name="button"
//                  align="center"
//                  className="buttonBackgroundColor"
//                      >
//                      Update
//                       </Button>
//                       // )
   
//     )
//  },
//   cellStyle: {
//       width: "15%",
//   },
// },
//            ]
            const fpoSelling = [
              {
                title: "Order Date",
                field:"created_at",
                filtering: false,
                render:(rowData)=>{ 
                
                  return(
                    moment(rowData.created_at).format("DD/MM/YYYY")
                  )
                },
                cellStyle: {
                    width: "15%",
                },
            },
            {
              title: "Farmer Details",
              field:"",
              export:false,
              filtering: false,
              cellStyle: {
                // position: 'sticky',
                // background: '#f1f1f1',
                left: 0,
                zIndex: 1,
                minWidth: 300,
                maxWidth: 300
                },
              render:(rowData)=>{ 
              
                return(
                  <div>
                    <div>
                   Name :  <span className='darkGreenText' style={{fontWeight:"700"}}> {rowData.farmer__first_name} &nbsp;{rowData.farmer__last_name}</span>
                   <br/>
                   Phone : <span className='darkGreenText' style={{fontWeight:"700"}}>{rowData.farmer__phone}</span>
                      </div>
                   
                      <div>
                      Village : <span className='darkGreenText' style={{fontWeight:"700"}}> {rowData.farmer__village}</span>
                      </div>
                    </div>
                )
              },
              cellStyle: {
                  width: "15%",
              },
          },
          {
            title: "First Name",
            field: "farmer__first_name",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Last Name",
            field: "farmer__last_name",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Phone",
            field: "farmer__phone",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Village",
            field: "farmer__village",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
       
          {
            title: "Input Type",
            field: "input_type",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Product Image",
            field:"",
            export:false,
            filtering: false,
            
            render:(rowData)=>{
               return (
                //  <div className="outerimg">
                //  <img src={noImageFpo} alt="helo"className="innerimg" ></img>
              
                //  </div>
                // <div>Hello</div>
                  <div style={{cursor:"pointer",textAlign:"center"}}>
                    {
                    (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url===null)?
                    <img src={noImageFpo} alt="image1"className="" height="50px" width="50px"onClick={()=>showFullImage(rowData)} ></img>

                    : 
                    (rowData.photo1_presigned_url===null && rowData.photo2_presigned_url!==null)?
                    <img src={rowData.photo2_presigned_url} alt="image1"className="" height="50px"  width="50px" onClick={()=>showFullImage(rowData)} ></img>
             :
             <img src={rowData.photo1_presigned_url} alt="image1"className="" height="50px"  width="50px"onClick={()=>showFullImage(rowData)} ></img>
            }
                 {/* <img src={rowData.photo1_presigned_url} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img> */}
                 {/* <img src={this.handleImageUrl(rowData)} alt="image1"className="" height="100px" onClick={()=>showFullImage(rowData)} ></img> */}

                 </div>
               )
            },
            cellStyle: {
                width: "15%",
            },
        },
        {
          title: "Category",
          field:"input_category__input_category",
          filtering: false,
       

          cellStyle: {
              width: "15%",
          },
      },
      {
        title: "Time Period ",
        field: "required_time",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Time Type",
        field: "time_period",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Crop Name  ",
        field: "crop_name",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Product (FPO)  ",
        field: "fpo_product_name",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Product (Farmer)  ",
        field: "brand_name",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Brand (FPO)  ",
        field: "fpo_brand_name",
        hidden:true,
        export:true,
        filtering: false,
        cellStyle: {
          width: "15%",
        },
      },
      {
        title: "Product/Brand Name",
        field:"",
        filtering: false,
        render: rowData => {
          return(
            <div>
              {rowData.input_type==="Product"?<div>Product  :<span style={{fontWeight:"800",color:"brown"}}>{rowData.fpo_product_name?rowData.fpo_product_name:rowData.brand_name} </span></div>:""}
              {rowData.input_type==="Product"?<div>Brand  :<span style={{fontWeight:"800",color:"brown"}}>{rowData.fpo_brand_name?rowData.fpo_brand_name:"NA"}</span></div>:""}

           
            <div>{rowData.input_type==="Service" && "Rent"}</div>
            </div>
          )
        },
        cellStyle: {
            width: "15%",
        },
    },
          {
            title: "Quantity Ordered  (Farmer)",
            field: "quantity_ordered",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Quantity (FPO)",
            field: "fpo_accepted_quantity",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Date of Delivery(Farmer)",
            field: "expected_delivery_date",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Date of Delivery (FPO) ",
            field: "fpo_date_of_delivery",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Price (Farmer) ",
            field: "expected_price",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
          {
            title: "Price (FPO)",
            field: "fpo_offered_price",
            hidden:true,
            export:true,
            filtering: false,
            cellStyle: {
              width: "15%",
            },
          },
        
        
          {
            title: "Product Details (Farmer)",
            filtering: false,
            export:false,
            cellStyle: {
              // position: 'sticky',
              // background: '#f1f1f1',
              left: 0,
              zIndex: 1,
              minWidth: 300,
              maxWidth: 300
              },
                render:(rowData)=>{
                 

                return (
                 <div>
                <div>{rowData.crop_name? <div>Crop Name : <span className='darkGreenText' style={{fontWeight:"700"}}> {rowData.crop_name}</span></div>: "" }
                {rowData.time_period? <div>Time : <span className='darkGreenText'style={{fontWeight:"700"}}>{rowData.required_time}&nbsp; {rowData.time_period}</span></div>: "" }
                </div>
               <div>Quantity Ordered : <span className='darkGreenText'style={{fontWeight:"700"}}> {rowData.quantity_ordered} &nbsp;{rowData.units__unit_name}</span></div>
               <div>Expected Price : <span className='darkGreenText'style={{fontWeight:"700"}}>₹ {rowData.expected_price}</span></div>
    
    
                 </div>
                )
             },
            cellStyle: {
    
                width: "15%",
            },
        },
       
      
        {
          title: "Expected Date of Delivery",
          filtering: false,
          export:false,
    
          render:(rowData)=>{
            // console.log("slice",rowData.expected_delivery_date.slice(0,10))
            // console.log("slice22",rowData.fpo_date_of_delivery)
    
            return (
             <div>                   
           {rowData.expected_delivery_date?<div> Farmer: <span className='darkGreenText'style={{fontWeight:"700"}}> {moment(rowData.expected_delivery_date.slice(0,10)).format("DD/MM/YYYY")}</span></div>:""}
    
           {rowData.fpo_date_of_delivery?<div> FPO : <span className='darkGreenText'style={{fontWeight:"700"}}>{moment(rowData.fpo_date_of_delivery.slice(0,10)).format("DD/MM/YYYY")}
</span></div>:""}
          {/* //  <div> Date of Delivery(FPO) {rowData.fpo_date_of_delivery}</div> */}
    
    
             </div>
            )
          
         },
          cellStyle: {
              width: "15%",
          },
      },
     
    
      {
        title: "Offered Quantity/Price (FPO) ",
        filtering: false,
        export:false,
        render:(rowData)=>{
          return (
           <div>
         <div>  Quantity:<span className='darkGreenText' style={{fontWeight:"700"}}> {rowData.fpo_accepted_quantity?rowData.fpo_accepted_quantity:"NA"} &nbsp;{rowData.fpo_units__unit_name}</span></div>
         <div> Price :<span className='darkGreenText' style={{fontWeight:"700"}}>{rowData.fpo_offered_price?"₹"+ rowData.fpo_offered_price:"NA"}</span></div>
    
    
           </div>
          )
       },
        cellStyle: {
            width: "15%",
        },
    },
        
            
              // {
              //     title: "Category",
              //     field:"input_category__input_category",
              //     filtering: false,
               

              //     cellStyle: {
              //         width: "15%",
              //     },
              // },
             
           
             
          
         
      //   {
      //     title: "Order Details",
      //     field:"Order",
      //     filtering: false,
      //     export:false,
      //     render: rowData => {
      //       return(
      //           <div className="wrap">
      //               <Row className="noPadding">
      //                   <Col lg="12" md="12" sm="12" className="noPadding">
      //                       Total Quantity:&nbsp;<span className="darkGreenText"><b>{rowData.total_quantity}</b></span>
      //                   </Col>
      //               </Row>
      //               <Row className="noPadding">
      //                   <Col lg="12" md="12" sm="12" className="noPadding">
      //                       Order Count:&nbsp;
      //                           <span className="darkGreenText">
      //                           <b>{rowData.count}</b>
      //                           </span>

      //                </Col>
      //               </Row>
      //               <Row className="noPadding">
      //                   <Col lg="12" md="12" sm="12" className="noPadding">
      //                           Total Value:&nbsp;
      //                           <span className="darkGreenText">
      //                           <b>₹ {parseInt(rowData.total_price)}</b>
      //                           </span>
      //                           {/* &nbsp;/&nbsp; */}
      //                   </Col>
      //               </Row>
      //           </div>
      //       );
      //   },
      //     cellStyle: {
      //         width: "15%",
      //     },
      // },
        {
          title: "Order Status",
          field:"order_status",
          filtering: false,
          cellStyle: {
              width: "15%",
          },
        },
             
              {
                title: "Change Status",
                filtering: false,
                render:(rowData)=>{
                  return (
                    // this.CheckUserParent(rowData.order_status)?
                    // (<OverlayTrigger key="left22" placement="left"
                  
                    // overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
               
                   
                    //       <Button
                
                    //          style={{opacity:"0.3",cursor:"not-allowed"}}
                    //          className="buttonBackgroundColor"
                    //           type="button"
                    //               align="center"
                    //                >
                    //                  Update
                    //               </Button>
                    //             </OverlayTrigger>)
                    //             : (
                                <Button
                              onClick={() => sellingUpdateModal(rowData.input_type,rowData.id,rowData)}
                               type="button"
                                  name="button"
                               align="center"
                               className="buttonBackgroundColor"
                                   >
                                   Update
                                    </Button>
                                    // )
                 
                  )
               },
                cellStyle: {
                    width: "15%",
                },
              },
           
          ];
            return (
                <div className="wrap">
                {this.state.isLandHoldingLoading ? (
                    <div className="wrap landHoldingPageLoaderWrap">
                        <span className="spinner-border spinner-border landHoldingPageLoader"></span>
                    </div>
                    ) : (
                    <div className="wrap">
                        <div className="breadcrumb pageBreadCrumbHolder landHoldingBreadCrumbWrap" >

                        <a

                        href="#"

                        className="breadcrumb-item pageBreadCrumbItem"

                        onClick={() => this.navigateMainBoard()}
                         // will navigate to dashboard.

                        >

                        <FontAwesomeIcon

                            icon={faHome}

                            className="dvaraBrownText breadcrumb-separator pageBreadCrumbItem"

                            style={{ fontSize: "0.7rem" }}

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

                        onClick={() => this.navigateToComponent("inputs")} // will navigate to the parent i.e input page .

                        >Inputs

                        </a>

                        </div>
                      
                        <div className="wrap LandHoldingMainCardsWrap" >
                        
                        <Row>
                        <Col md="3"></Col>
                            
                            <Col md="3">
                            <div id="registered" className={`card-counter landHoldingMainCards  ${this.state.activeTabSelling === "Fpo Listed" ? "active" : ""}`}
                             onClick={this.activeTabSelling.bind(this, "Fpo Listed")}
                            >
                                <span className="landHoldingMainCardsIcon sitesInfoIcon"></span>
                                <span className="count-name" style={{fontSize:"17px",color:"rgba(114, 49, 12, 1)",fontWeight:"700"}}>FPO Listed Input</span>

                            </div>
                            </Col>
                            <Col md="3">
                            <div id="total_area" className={`card-counter landHoldingMainCards  ${this.state.activeTabSelling === "Farmer Interest" ? "active" : ""}`}
                           onClick={this.activeTabSelling.bind(this, "Farmer Interest")}
                            >
                                <span className="landHoldingMainCardsIcon SiteAreaIcon"></span>
                                <span className="count-name"style={{fontSize:"17px",color:"rgba(114, 49, 12, 1)",fontWeight:"700"}}>Farmer Interests for Inputs</span>
                            </div>
                            </Col>
                            <Col md="3"></Col>

                         
                        </Row>
                    </div>
                        {this.state.isParentLogged? 
                   <div style={{ marginLeft: "30px", color: 'rgba(114, 49, 12, 1)'  }} >
                   <h5 style={{marginLeft:"28px",marginBottom:"20px"}}> FPO: {currentFpo} </h5>
                  </div>
                   : ""}
                        {/* this code is for the Cards which r appearing on the top of the screen in a browser. */}
                      
                        {this.state.activeTabSelling==="Fpo Listed"?
                        <div>
                            <div className="wrap LandHoldingMainCardsWrap">
                        
                        <Row>
                            
                            <Col md="3">
                            <div id="registered" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="landHoldingMainCardsIcon sitesInfoIcon"></span>
                                    <span className="count-numbers dvaraBrownText">{mainCardObj.total_village}</span>
                                <span className="count-name">No. Of Villages Ordering</span>

                            </div>
                            </Col>
                            <Col md="3">
                            <div id="total_area" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="landHoldingMainCardsIcon SiteAreaIcon"></span>
                                <span className="count-numbers dvaraBrownText">{mainCardObj.total_products}</span>
                                <span className="count-name">No. of products getting orders</span>
                            </div>
                            </Col>
                            <Col md="3">
                            <div id="own" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="landHoldingMainCardsIcon CompanyIcon"></span>
                                <span className="count-numbers dvaraBrownText">{mainCardObj.total_orders}</span>
                                <span className="count-name">No. of Orders</span>
                            </div>
                            </Col>
                            <Col md="3">
                            <div id="farmers" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="FarmerOwnedIcon"></span>
                                <span className="count-numbers dvaraBrownText"><strong> &#x20B9;</strong> {mainCardObj.value}</span>
                                <span className="count-name"><br/>Total Order Value</span>
                            </div>
                            </Col>
                         
                        </Row>
                    </div>
                        <div className="inputProductHeader wrap">
                              
                            <Row>
                                <Col lg="12" md="12" sm="12" className="">
                                    <div className="LandHoldingHeading PageHeading inputOrderHeading" >
                                        <Row>
                                            <Col md={6} >

                                                                <h4 className="farmerListHeading dvaraBrownText" style={{marginLeft:"25px",position:"relative",top:"32px"}}>Farmer Orders</h4>
                                            </Col>
                                            </Row>
                                             <Row style={{marginLeft:"20px",marginTop:"46px"}}>
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={5} className="dvaraBrownText">Year: </Form.Label>
                                                 <Col sm={7}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.farmerOrderYear}
                                                         onChange={(e)=>this.AllFarmerOrderYear(this.state.finalData,e.target.value,this.state.inputType,this.state.farmerOrderStatus)}

                                                     >
                                                         {/* <option value="2023-2024" selected>2023-2024</option>
                                                         <option value="2022-2023">2022-2023</option>
                                                         <option value="2021-2022" >2021-2022</option>
                                                         <option value="2020-2021">2020-2021</option>
                                                         <option value="2019-2020">2019-2020</option> */}
                                                           {this.YearOptions(dateRanges)}

                                                         
                                                     </Form.Control>
                                                 </Col>
                                            
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                     <Col md={4} className="" >
                                            <Form>                                                   
                                                    <Form.Group as={Row} controlId="formHorizontalUnits">
                                                        <Form.Label column="sm" lg={5} className="dvaraBrownText">Input Type: </Form.Label>
                                                        <Col sm={7}>
                                                            <Form.Control
                                                                as="select"
                                                                size="sm"
                                                                value={this.state.inputType}
                                                                custom
                                                                // onChange={this.handleTypeChange} 
                                                                onChange={(e)=>this.AllFarmerOrderYear(this.state.finalData,this.state.farmerOrderYear,e.target.value,this.state.farmerOrderStatus)}

                                                            >
                                                                <option value="all">All</option>
                                                                <option value="0" selected>Product Orders</option>
                                                                <option value="1">Service Orders</option>
                                                                
                                                            </Form.Control>
                                                        </Col>
                                                    </Form.Group>
                                                      
                                                </Form>
                                            </Col>
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={5} className="dvaraBrownText">Order Status: </Form.Label>
                                                 <Col sm={7}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.farmerOrderStatus}
                                                         onChange={(e)=>this.AllFarmerOrderYear(this.state.finalData,this.state.farmerOrderYear,this.state.inputType,e.target.value)}

                                                          >
                                                         <option value="all">All</option>

                                                         <option value="Pending">Pending</option>
                                                         <option value="Accepted" >Accepted</option>
                                                         <option value="Completed">Completed</option>
                                                         <option value="Failed">Failed</option>
                                                         <option value="Rejected">Rejected</option>

                                                         <option value="Cancelled">Cancelled</option>


                                                         
                                                     </Form.Control>
                                                 </Col>
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                 </Row> 
                                    </div>

                                    <MaterialTable icons={tableIcons}
                                    style={{marginTop:"36px"}}
                                    title=""
                                    columns={[
                                        /* { title: "Farmer Id", field: "id" }, */
                                        { title: "Village", field: "village",
                                          render: rowData => rowData.village
                                        },
                                        { title: "Product Name", field: "product__product" ,
                                        render: rowData => rowData.product__product},
                                        { title: "Product Details", field: "product__input_category__input_category", field: "product__brand_name",
                                          render: rowData => { return(
                                                                <div className="wrap noPadding">
                                                                    <Row className="noPadding">
                                                                        <Col lg="1" md="12" sm="12" className="noPadding">
                                                                            {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="dvaraGreenText" title="Location"></FontAwesomeIcon> */}
                                                                        </Col>
                                                                        <Col lg="10" md="10" sm="10" className="noPadding">
                                                                           Product: <span style={{fontWeight:"800",color:"brown"}}>{rowData.product__input_category__input_category}</span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="noPadding">
                                                                        <Col lg="1" md="12" sm="12" className="noPadding">
                                                                            {/* <FontAwesomeIcon icon={faMobileAlt} className="dvaraGreenText" title="Mobile Number"></FontAwesomeIcon> */}
                                                                          {/* <img src="https://icon-library.com/images/branding-icon-png/branding-icon-png-1.jpg" width="100%"/> */}
                                                                        </Col>
                                                                        <Col lg="10" md="10" sm="10" className="noPadding">
                                                                           Brand: {rowData.product__brand_name}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            ); }

                                        },
                                        {
                                          title: "Input Type",
                                          // width: "20%",
                                          field: "product__is_service",
                                          lookup: { 0: "Product", 1: "Service" },
                
                                          hidden: true,
                                          export: true,
                                          searchable: true,
                                        },
                                       
                                        {
                                            title: "Order Details", field: "order_details",
                                            export: false,
                                            searchable: true,
                                            
                                            render: rowData => {
                                                return(
                                                    <div className="wrap">
                                                        <Row className="noPadding">
                                                            <Col lg="12" md="12" sm="12" className="noPadding">
                                                                Total Quantity:&nbsp;{rowData.total_quantity}
                                                            </Col>
                                                        </Row>
                                                        <Row className="noPadding">
                                                            <Col lg="12" md="12" sm="12" className="noPadding">
                                                                Order Count:&nbsp;
                                                                    <span className="darkGreenText">
                                                                    <b>{rowData.count}</b>
                                                                    </span>

                                                         </Col>
                                                        </Row>
                                                        <Row className="noPadding">
                                                            <Col lg="12" md="12" sm="12" className="noPadding">
                                                                    Total Value:&nbsp;
                                                                    <span className="darkGreenText">
                                                                    <b>₹ {parseInt(rowData.total_price)}</b>
                                                                    </span>
                                                                    {/* &nbsp;/&nbsp; */}
                                                                    <span className="dvaraBrownText">{rowData.total_sites}</span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                );
                                            },
                                            customSort: (a, b) => a.total_price - b.total_price
                                        },
                                       
                                       
                                        {
                                          title: "Total Quantity",
                                          // width: "20%",
                                          field: "total_quantity",
                
                                          hidden: true,
                                          export: true,
                                          searchable: true,
                                        },
                                        {
                                          title: "Order Count",
                                          // width: "20%",
                                          field: "count",
                
                                          hidden: true,
                                          export: true,
                                          searchable: true,
                                        },
                                        {
                                          title: "Total Value",
                                          // width: "20%",
                                          field: "total_price",
                
                                          hidden: true,
                                          export: true,
                                          searchable: true,
                                        },
                                       





                                        /* { title: "Total Sites", field: "total_sites" },
                                        { title: "Registered Sites", field: "registered_sites" },
                                        { title: "Total Area", field: "total_area" }, */
                                    ]}
                                    data={orderData}
                                    // other props
                                    detailPanel={[
                                        {
                                        tooltip: 'Show Orders',
                                        render: rowData => {
                                            return (
                                                <div className="wrap">
                                                    <div className="verticalSpacer10"></div>
                                                    <div className="landHoldingSiteListWrap" style={{width:"92%"}}>
                                                      {/* {console.log("rowData.orders",rowData.orders)} */}


                                                        <MaterialTable columns={nestedColumns} data={rowData.orders} compType="inputOrder"
                                                        title=""
                                                        icons={tableIcons}
                                                        
                                                        options={{
                                                          maxBodyHeight:300,
                                                            exportButton: true,
                                                            exportAllData: true,
                                                            doubleHorizontalScroll: true,
                                                            detailPanelType: "single",
                                                            headerStyle: {
                                                                backgroundColor: '#A3C614',
                                                                color: '#fff',
                                                                fontSize: '1.2rem',
                                                                fontFamily: 'barlow_reg',
                                                                fontWeight: 'bold',
                                                                zIndex:1
                                                            },
                                                            rowStyle: {
                                                                backgroundColor: '#f1f1f1',
                                                                borderBottom: '2px solid #e2e2e2',
                                                                fontSize: '0.9rem'
                                                            },
                                                            filtering: false,
                                                            pageSize: 10,
                                                            pageSizeOptions: [
                                                             
                                                              10,
                                                              20,
                                                              50,
                                                              100,
                                                             
                                                             
                                                              
                                                              // { value:orderData.length, label: "All" },
                                                            ],
                                                        }}
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        />
                                                    </div>
                                                    <div className="verticalSpacer20"></div>
                                                </div>
                                            )
                                        },
                                        },
                                    ]}
                                    onRowClick={(event, rowData, togglePanel) =>{ togglePanel(); }}
                                    options={{
                                      maxBodyHeight:600,
                                        exportButton: true,
                                        exportAllData: true,
                                        doubleHorizontalScroll: true,
                                        detailPanelType: "single",
                                        headerStyle: {
                                            backgroundColor: '#A3C614',
                                            color: '#fff',
                                            fontSize: '1.2rem',
                                            fontFamily: 'barlow_reg',
                                            fontWeight: 'bold'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#f1f1f1',
                                            borderBottom: '2px solid #e2e2e2',
                                            fontSize: '0.9rem'
                                        },
                                        filtering: false,
                                        pageSize: 10,
                                        pageSizeOptions: [
                                         
                                          10,
                                          20,
                                          50,
                                          100,
                                         
                                         
                                          
                                          { value:orderData.length, label: "All" },
                                        ],
                                    }}
                                    />
                                </Col>
                            </Row>
                          
                        {/* } */}
                        </div>
                        </div>
    :<div>
           <div className="wrap LandHoldingMainCardsWrap">
                        
                        <Row>
                        <Col md="1"></Col>
                            <Col md="3">
                            <div id="registered" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="landHoldingMainCardsIcon sitesInfoIcon"></span>
                                    <span className="count-numbers dvaraBrownText">{mainCardObjBuying.village}</span>
                                <span className="count-name">No. Of Villages Ordering</span>

                            </div>
                            </Col>
                           
                            <Col md="3">
                            <div id="own" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="landHoldingMainCardsIcon CompanyIcon"></span>
                                <span className="count-numbers dvaraBrownText">{mainCardObjBuying.orders}</span>
                                <span className="count-name">No. of Orders</span>
                            </div>
                            </Col>
                            <Col md="3">
                            <div id="farmers" className={`card-counter landHoldingMainCards ${this.state.activeCardId === "None" ? "active" : ""}`}>
                                <span className="FarmerOwnedIcon"></span>
                                <span className="count-numbers dvaraBrownText"><strong> &#x20B9;</strong> 
                                <NumberFormat value={mainCardObjBuying.values} displayType={'text'} 
                                thousandSeparator={true} thousandsGroupStyle='lakh'/> 
                                </span>
                                <span className="count-name"><br/>Total Order Value (FPO)</span>
                            </div>
                            </Col>
                            <Col md="1"></Col>
                        </Row>
                    </div>
      
       
      <div className="inputProductHeader wrap">
                     
                   
                             <div className="">
                                 <Row style={{marginLeft:"20px",marginTop:"20px"}}>
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={3} className="dvaraBrownText">Year: </Form.Label>
                                                 <Col sm={5}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.initailSelectedYear}
                                                         onChange={(e)=>this.AllFiltersBuyingInputs(this.state.finalSellingRecord,e.target.value,this.state.sellingordertype,this.state.sellingstatustype)}

                                                        //  onChange={(e)=>this.BuyingYearChange(this.state.finalSellingRecord,e.target.value)}
                                                     >
                                                         {/* <option value="2022-2023" selected>2022-2023</option>
                                                         <option value="2021-2022" >2021-2022</option>
                                                         <option value="2020-2021">2020-2021</option>
                                                         <option value="2019-2020">2019-2020</option> */}
                                                          {this.YearOptions(dateRanges)}

                                                         
                                                     </Form.Control>
                                                 </Col>
                                            
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                     <Col md={4} className="" >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={3} className="dvaraBrownText">Order Type: </Form.Label>
                                                 <Col sm={5}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.sellingordertype}
                                                         onChange={(e)=>this.AllFiltersBuyingInputs(this.state.finalSellingRecord,this.state.initailSelectedYear,e.target.value,this.state.sellingstatustype)}

                                                        //  onChange={this.handleSellingTypeChange} 
                                                     >
                                                         {/* <option value="all">All</option> */}
                                                         <option value="Product">Product Orders</option>
                                                         <option value="Service">Service Orders</option>
                                                         
                                                     </Form.Control>
                                                 </Col>
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                     <Col md={4} >
                                     <Form>                                                   
                                             <Form.Group as={Row} controlId="formHorizontalUnits">
                                                 <Form.Label column="sm" lg={3} className="dvaraBrownText">Order Status: </Form.Label>
                                                 <Col sm={5}>
                                                     <Form.Control
                                                         as="select"
                                                         size="sm"
                                                         custom
                                                         value={this.state.sellingstatustype}
                                                         onChange={(e)=>this.AllFiltersBuyingInputs(this.state.finalSellingRecord,this.state.initailSelectedYear,this.state.sellingordertype,e.target.value)}

                                                        //  onChange={(e)=>this.handleSellingStatusChange(e.target.value)} 
                                                          >
                                                         <option value="all">All</option>

                                                         <option value="Raised">Raised</option>
                                                         <option value="Accepted" >Accepted</option>
                                                         <option value="Completed">Completed</option>
                                                         <option value="Failed">Failed</option>
                                                         <option value="Rejected">Rejected</option>

                                                         <option value="Cancelled">Cancelled</option>


                                                         
                                                     </Form.Control>
                                                 </Col>
                                             </Form.Group>
                                               
                                         </Form>
                                     </Col>
                                 </Row>
                             </div>
                             <div>
                             <MaterialTable
                                            icons={tableIcons}
                                            style={{ marginLeft: "30px" }}
                                            title=""
                                            data={fpoSellingdata}
                                             
                                            columns={fpoSelling}
                                          //   detailPanel={[
                                          //     {
                                          //     tooltip: 'Show Orders',
                                          //     render: rowData => {
                                          //         return (
                                          //             <div className="wrap">
                                          //                 <div className="verticalSpacer10"></div>
                                          //                 <div className="landHoldingSiteListWrap" style={{width:"98%"}}>
      
      
                                          //                     <MaterialTable 
                                          //                     columns={nestedSellingColumns} 
                                          //                    data={rowData.orders}
                                          //                      compType="inputOrder"
                                          //                     title=""
                                          //                     icons={tableIcons}
                                                              
                                          //                     options={{
                                          //                       maxBodyHeight:300,
                                          //                         exportButton: true,
                                          //                         exportAllData: true,
                                          //                         doubleHorizontalScroll: true,
                                          //                         detailPanelType: "single",
                                          //                         headerStyle: {
                                          //                             backgroundColor: '#A3C614',
                                          //                             color: '#fff',
                                          //                             fontSize: '1.2rem',
                                          //                             fontFamily: 'barlow_reg',
                                          //                             fontWeight: 'bold',
                                          //                             zIndex:1
                                          //                         },
                                          //                         rowStyle: {
                                          //                             backgroundColor: '#f1f1f1',
                                          //                             borderBottom: '2px solid #e2e2e2',
                                          //                             fontSize: '0.9rem'
                                          //                         },
                                          //                         filtering: false,
                                          //                         pageSize: 10,
                                          //                         pageSizeOptions: [
                                                                   
                                          //                           10,
                                          //                           20,
                                          //                           50,
                                          //                           100,
                                          //                         ],
                                          //                     }}
                                          //                     />
                                          //                 </div>
                                          //                 <div className="verticalSpacer20"></div>
                                          //             </div>
                                          //         )
                                          //     },
                                          //     },
                                          // ]}
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
                                                    fontSize: "12px",
                                                },
                                                filtering: true,
                                                
                                            }}
                                        />
                       <Modal
                      show={sellingModalIsOpen}
                      onHide={sellingUpdateClose}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"> 
                         <span className="modalColor"> Update Order : </span>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body >
                    
                        
                          
                                     
                                     {/* {this.state.updateMessage ? 
                                          <Alert variant="success">
                                          <Alert.Heading>{this.state.updateMessage}</Alert.Heading>
                                        
                                        </Alert>
                                     :""} */}
          
                        <Container>
                          <Form>
                            {this.checkSellingInputType()===true?"":
                            <Row>
                            <Col sm={4}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Crop Name</strong>
                               
                                </Form.Label>
                                <Form.Control
                                      as="select"
                                      value={selectedcropvalue}
                                      className={this.state.selectedcropvalueclass}
                                      custom
                                      size="sm"
                                      onChange={this.handleCropChange}
                                      // disabled={this.checkSellingInputType()}
                                    >
                                      <option value="0">
                                        --SELECT Crop--
                                      </option>
                                      {this.showCropList(
                                        sellingCropShow
                                      )}
                                    </Form.Control>
                              </Form.Group>
                              </Col>
                              <Col md="4">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Product Name</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        max={50}
                        className={this.state.sellingProductNameclass}
                        value={this.state.sellingProductName}
                        onChange={this.handlesellingProductName}
                        // disabled={this.checkSellingInputType()}


                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                    <Col md="4">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Brand Name</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        max={50}
                        className={this.state.sellingBrandNameclass}

                        value={this.state.sellingBrandName}
                        onChange={this.handlesellingBrandName}
                        // disabled={this.checkSellingInputType()}

                       
                       

                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                             
                              </Row>
                        }
                              <Row>
                              <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Category</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        max={50}
                        // className={this.state.sellingBrandNameclass}
                         disabled
                        value={this.state.buyingCategory}
                        // onChange={this.handlesellingBrandName}
                        // disabled={this.checkSellingInputType()}

                       
                       

                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                            
                    <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Offered Quantity by FPO </strong>
                      </Form.Label>

                        <div style={{display:"flex"}}>
                        <input type="text" 
                        style={{width:"20%",padding:"5px",border: "1px solid #ced4da",height:"35px"}}
                        className={this.state.offeredQuantityclass}
                          maxLength={3}
                        onChange={this.handleOfferedQuantity} value={offeredQuantity}/>
                        &nbsp;&nbsp;&nbsp;
                        <select id="units" 
                        // style={{padding:"5px",border: "1px solid #ced4da"}} 
                        value={selectedunitvalue} 
                        className={this.state.selectedunitvalueclass}
                        onChange={this.handleUnitChange}>
 
                          <option value="">--Select Unit--</option>

                          {this.showUnitList(unitlist)}
                                      
                                      </select>

                        
                          </div>


                      
                       
                    </Form.Group>
                    </Col>
                  
                            
                              </Row>
                             <Row>
                             <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Offered Price by FPO </strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className={this.state.sellingPriceclass}
                        value={this.state.sellingPrice}
                        onChange={this.handlesellingPrice}
                         maxLength={4}
                       

                        >

                        </Form.Control>
                        <p className='requiredfields'>{this.state.sellingPriceMessage}</p>
                    </Form.Group>
                    </Col>
                              <Col md={6}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Mode Of Delivery </strong>
                               
                                </Form.Label>
                                <Form.Control
                        as="select"
                        size="sm"
                        custom
                        className={this.state.deliverymodeclass}

                        onChange={this.handleDeliveryMode}
                        value={this.state.deliverymode} 
                      >
                        <option value="">
                          Select Input type
                        </option>
                        <option
                          value="Farmer Picks"
                        >
                          Farmer Picks
                        </option>
                        <option
                          value="FPO Delivers"
                        >
                          FPO Deliver
                        </option>
                      </Form.Control>
                              </Form.Group>
                            
                              </Col>
                            
                             </Row>
                             <Row>
                             <Col md={6}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Status</strong>
                               
                                </Form.Label>
                                <Form.Control
                        as="select"
                        size="sm"
                        custom
                        className={this.state.sellingstatusclass}
                        onChange={this.handlesellingstatus}
                        value={this.state.sellingstatus} 
                      >
                        <option value=""> Select Status </option>
                          <option value="Raised">Raised</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Failed">Failed</option>
                          <option value="Rejected">Rejected</option>




                       
                       
                      </Form.Control>
                              
                             
                              
                              </Form.Group>
                            
                              </Col>
                              <Col md={6}>
                              <Form.Group as={Col } controlId="formGridEmail">
                                <Form.Label>
                                  <strong className="update-TextColor">Estimated Date Of Delivery </strong>
                               
                                </Form.Label>
                                <Form.Control
                                 type="date"
                                 className={this.state.sellingestDateclass}
                                 min={this.state.sellingOrderCreatedDate}
                              
                                 max={this.sellingMaxDate()}
                                 value={this.state.sellingestDate}
                                 onChange={this.handlesellingestDate}
                                
                                >
                              
                             
                                </Form.Control>
                              </Form.Group>
                            
                              </Col>
                             </Row>
                             {/* <Row>
                             {this.checkSellingInputType()===true?

                             <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Time Period</strong>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        
                        className={this.state.TimePeriodclass}

                        value={this.state.timePeriod}
                        onChange={this.handleBuyingTimePeriod}
                        
                       
                       

                        >
                          <option value="">--Select Value--</option>
                          <option value="Hourly">Hourly</option>
                          <option value="Daily">Daily</option>
                          <option value="Per Test">Per Test</option>


                        </Form.Control>
                    </Form.Group>
                    </Col>:""
    }
                             </Row> */}
                            <Form.Group controlId="formGridAddress1 ">
                              <Form.Label>
                                <strong className="update-TextColor remarksposition">Remarks</strong>
                              </Form.Label>
                              <Form.Control
                              style={{position:"relative",left:"2%"}}
                                as="textarea"
                                placeholder="Remarks"
                                className={this.state.sellingRemarksclass}

                                value={this.state.sellingRemarks}
                                onChange={this.handlesellingRemarks}
                                >
          
                                </Form.Control>
                            
                            </Form.Group>
                          </Form>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.sellingerrormessage}
                      </p>
                        <Button variant="primary" onClick={sellingUpdateClose}>
                        <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="dvaraBrownText"
                              title="Save Edits"
                            />&nbsp;
                          Close
                        </Button>
          
                        <Button
                          variant="success"
                          onClick={this.sellingSaveChanges}
                          // disabled={this.state.sellingOrderUpdating?true:false}
                          disabled={this.handlesellingStatusDisabled()}

                        > 
                          <FontAwesomeIcon
                              icon={faSave}
                              className="dvaraBrownText"
                              title="Save Edits"
                            />&nbsp;
                          Save Changes
                          {this.state.sellingOrderUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                          
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Modal
                      show={fullImageOpen}
                      onHide={hideFullImage}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        {/* <Modal.Title id="contained-modal-title-vcenter"> 
                         <span className="modalColor">  </span>
                        </Modal.Title> */}
                      </Modal.Header>
                      <Modal.Body >
                        <div>
                         <Carousel>
                          
                           {this.state.sellingImageOne!=null&&
                            <Carousel.Item >
                              <div style={{height:"500px"}}>
                              <img src={this.state.sellingImageOne} alt="No Image available" height="100%" width="100%" style={{objectFit:"contain"}}/>
                              </div>
                          
                            </Carousel.Item>
    }
      {this.state.sellingImageTwo!=null&&
                            <Carousel.Item>
                            <div style={{height:"500px"}}>
                              <img src={this.state.sellingImageTwo} alt="No Image available" height="100%"width="1005" style={{objectFit:"contain"}}/>
                              </div>
                          
                            </Carousel.Item>
    }
    {(this.state.sellingImageTwo===null&& this.state.sellingImageOne===null)?
     <Carousel.Item>
     <div style={{height:"500px"}}>
       <img src={noImageFpo} alt="No Image available" height="100%"width="1005" style={{objectFit:"contain"}}/>
       </div>
   
     </Carousel.Item>:""}
    {/* <p>NO IMAGE TO DISPLAY</p>:""} */}
                        </Carousel> 
                          {/* <Carousel>
                          
                          {this.state.sellingImageShow.map((photoshow) => (
                            <Carousel.Item>
                             <div style={{height:"500px"}}>
                              <img src={photoshow} alt="No Image available" height="100%" width="100%" style={{objectFit:"contain"}}/>
                              </div>
                          
                          
                            
                            </Carousel.Item>
                          ))} 
                        </Carousel> */}
                        
                        </div>
                        </Modal.Body>
                        </Modal>
                          </div>
                       
                   
                 </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      </div>}
            <Modal
                      
            show={updateModalshow}
            onHide={updatehandleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            
            centered
          >
            {/* <Modal.Header closeButton> */}
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter"> 
               <span className="modalColor"> Update Input Order : </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body >
          
                {/* {this.state.updateMessage ? (
                  <h4 style={{ color: "green",position:"relative",left:"4%" }}>{this.state.updateMessage}</h4>
                ) : (
                  <span></span>
                )} */}
                
                           
                           {this.state.updateMessage ? 
                                <Alert variant="success">
                                <Alert.Heading>{this.state.updateMessage}</Alert.Heading>
                              
                              </Alert>
                           :""}

              <Container>
                <Form>
                  <Row>
                  <Col sm={6}>
                    <Form.Group as={Col } controlId="formGridEmail">
                      <Form.Label>
                        <strong className="update-TextColor">Status</strong>
                     
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={this.state.selectedOrderStatus}
                        custom
                        onChange={(e) => this.onChangeStatus(e)}
                      >
                        {this.state.UpdateState.map((x) => {
                          return <option value={x}>{x}</option>;
                        })}
                   
                      </Form.Control>
                    </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Estimated Date of Receiving/Delivery</strong>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className={this.state.tentclass}
                        value={this.state.tentativeDate}
                        min={this.state.compareOrderDate}
                        onChange={this.handleEstimatedDate}
                        disabled={
                          this.state.selectedOrderStatus === "Accepted"
                            ? false
                            : true
                        }
                        >
                         
                        </Form.Control>
                    </Form.Group>
                      </Col>
                    <Col md="6">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        <strong className="update-TextColor"> Actual Date of Receiving/Delivery</strong>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className={this.state.actualclass}
                        // min={this.state.compareOrderDate}
                        min={this.state.tentativeDate}

                        max={this.maxDate()}
                        value={this.state.actualDate}
                        onChange={this.handleActualDate}
                        disabled={
                          this.state.selectedOrderStatus === "Completed"
                            ? false
                            : true
                        }

                        >

                        </Form.Control>
                    </Form.Group>
                    </Col>
                    </Row>

                  <Form.Group controlId="formGridAddress1 ">
                    <Form.Label>
                      <strong className="update-TextColor remarksposition">Remarks</strong>
                    </Form.Label>
                    <Form.Control
                    style={{position:"relative",left:"2%"}}
                      as="textarea"
                      placeholder="Remarks"
                      onChange={this.handleRemarks}
                      value={this.state.remarks}
                      className={this.state.remarksclass}


                      disabled={
                        this.state.selectedOrderStatus === "Rejected" ||
                        this.state.selectedOrderStatus === "Failed"
                          ? false
                          : true
                      }
                      >

                      </Form.Control>
                  
                  </Form.Group>
                </Form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <p className="requiredfields">{this.state.errorremarksmessage}</p>
              <Button variant="primary" onClick={updatehandleClose}>
              <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="dvaraBrownText"
                    title="Save Edits"
                  />&nbsp;
                Close
              </Button>

              <Button
                variant="success"
                onClick={this.SaveUpdateChanges}
              > 
                <FontAwesomeIcon
                    icon={faSave}
                    className="dvaraBrownText"
                    title="Save Edits"
                  />&nbsp;
                Save Changes
                {this.state.isOrderUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                
              </Button>
            </Modal.Footer>
          </Modal>
                        <div className="verticalSpacer20 wrap"></div>
                    </div>
                    
                    )
                }
                </div>
            );
    }
  // inside componentDid we are calling the api and taking data from api,storing that in a state variable .
  //  Here if response is not true then api will through an error message.
    componentDidMount(){
        const user = AuthService.getCurrentUser();
        const fpoId = localStorage.getItem("fpoId")
        if(!user){
          this.props.history.push('/')
          return
        }
        if(user.is_parent){
          this.setState({ isParentLogged:true ,currentFpo: this.props.match.params.fpoName })
        }
        this.setState({
          accessed_supervisor:fpoId,
          logged_supervisor: user.user_id
        })
       
        this.setState({isLandHoldingLoading :   true}, 
            () => { this.getCardData(fpoId); 
        });
    }
}
