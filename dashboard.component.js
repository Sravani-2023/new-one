import React, { Component } from "react";
import AuthService from "../services/auth.service";
import WeatherWidget from "./weatherwidget.component.js";
//import weatherMetricsInfo, { weatherAlertsInfo } from "../data/weatherData.js";
import "../assets/css/dashboard.css";
import farmerIcon from "../assets/img/sickle.svg";
import landHoldingIcon from "../assets/img/farm.svg";
import croppingAreaIcon from "../assets/img/field.svg";
import ProductIcon from "../assets/img/product.png";
import Commodity from "../assets/img/commodity.png";
import OrderIcon from "../assets/img/orders.png";
import WarehouseIcon from "../assets/img/warehouse.png";
import AccountIcon from "../assets/img/accountant.png";
import Financial from "../assets/img/financial.png"
import ComingSoonFinance from "../assets/img/ComingSoonFinance.png";
import Marquee from "react-fast-marquee";
import MaterialTable from "material-table";
import tableIcons from "./icons";
import {TriggerAlert,} from './dryfunctions';
import tractor_moving from "../assets/img/tractor_moving.gif";


// import Marquee from "react-easy-marquee";

// import Marquee from "react-easy-marquee";

import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  ProgressBar,
  ProgressBarProps,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  Modal,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalProps,
  ModalTitle,
  ModalDialogProps,
  Button,
  ResponsiveEmbed,
  Table
} from "react-bootstrap";

import UserService from "../services/user.service";
function sortObjsInArray(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}
  var state_id;
  var district_id;
 

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.navigateToPage = this.navigateToPage.bind(this);
    

    this.fileUploadProcessMessage = {
      message: "",
      messageType: "",
    };

    this.state = {
      dashboardDetails: "",
      isDataAvaialble: false,
      loading: true,
      weatherForecastData: [],
      weatherAlertData: [],
      categorylist: [],
      subcategorylist: [],
      modalIsOpen: false,
      modalShow: false,
      cropname: "",
      // SelCatgry: 0,
      SelSubCtgr: 0,
      SubCtgrLoading: false,
      uploadedFileMessage: this.fileUploadProcessMessage,
      isCropCreating: false,
      selectedInputImg: null,
      isFileFormatValid: true,
      ImgUploadedStatus: false,
      SelUnit: "",
      company: "",
      size: "",
      actPrice: "",
      OffPrice: "",
      discount: "",
      availibility: "",
      // to_day: new Date()
      //   .toLocaleDateString("en-GB", {
      //     day: "2-digit",
      //     month: "short",
      //   })
      //   .replace(/ /g, "-"),
      to_day: "",
      spotPrices: "",
      futurePrices: "",
      ComingSoon: false,
      spotDataTableShow:"",
      allIndiaStatesList:[],
      allIndiaSelStatesID:"",
      allIndiaSelStateDistID: "",
      allIndiaSelStateDistList:[],
      // getmarket:"na",
      // getcategory:"na",
      SpotTableData:[],
      CategoryData:[],
      MarketData:[],
      categoryvalue:"na",
      marketvalue:"na",
      isAllIndiaDistListLoading: false,
      ismarketfilter:false,
      iscategoryfilter:false,
      stateName:"",
      distName:"",
      showloader:false,
      // noData:false,
      // imgarray:["https://img1.picmix.com/output/stamp/normal/4/0/9/3/1643904_6268b.gif","https://www.seasonharvestfoods.com/images/season_harvest_foods/broccoli.gif"]
      isLoadingCommodityTabData:false,
      Spotdateprocessed:"",
      spotDistrict:""


    };
  }
  navigateToPage = (pageName) => {
    localStorage.removeItem("activeCardId");

    this.props.history.push("/" + pageName + "");
  }

 
  // handleMarqueeSpeed=()=>{
   
   
  //   var len= this.state.spotPrices.length; 
  //   console.log("len",len)
  //   if(len<10)
  //   return "marq2"
  //   else if (len>=10 && len<=25)
  //   return "midmarq"
  //   else if (len>=26 && len<35)
  //   return "midmarq2"
  //   else if (len>=35 && len<=50)
  //   return "midmarq3"
  //   else if (len>50 && len<=85)
  //   return "midmarq4"
  //   else if (len>300 && len<=600)
  //   return "midmarq5"
  //   else
  //   return "marq"
  
  // }
  // getSpotPricesData=()=>{
  //   const{categoryvalue,marketvalue}=this.state;

  //   this.setState({
  //     spotDataTableShow:true,
  //     SpotTableData:[],
  //     showloader:true,
  //   })
   

  //  this.fetchSpotData();
  // }
   handlefiltersSpinners=()=>{
    this.setState({
      ismarketfilter:true,
      iscategoryfilter:true,

    })
    this.fetchSpotData();

   }

    fetchSpotData=()=>{
    // fetchSpotData(state,dis,mar,categry);
   const {allIndiaSelStatesID,allIndiaSelStateDistID,marketvalue,categoryvalue}=this.state;
    // console.log("state",this.state.allIndiaSelStatesID,"state name",this.state.stateName,"district ",this.state.allIndiaSelStateDistID,"district name ", this.state.distName,"market ",this.state.marketvalue,"category ",this.state.categoryvalue)
    this.setState({
      showloader:true,
      isLoadingCommodityTabData:true,
    })
    // UserService.getSpotPrice2(state,dis,mar,categry).then(

      UserService.getSpotPriceModalData(allIndiaSelStatesID,allIndiaSelStateDistID,marketvalue,categoryvalue).then(


      (response) => {

        // console.log("data for spot prices",response.data.data)
        if(response.data.data.length===0)
        {
         this.setState({
          SpotTableData:response.data.data,
          showloader:false,
          ismarketfilter:false,
          iscategoryfilter:false,
          isLoadingCommodityTabData:false,


         })
       
        }
       

      else{

      this.setState({
        // SpotTableData: spotListData,
        // CategoryData:categoryFil,
        // MarketData:mrktFil,
        SpotTableData: response.data.data,
        CategoryData:response.data.filters.category,
        MarketData:response.data.filters.market,
        ismarketfilter:false,
        iscategoryfilter:false,
        showloader:false,
        isLoadingCommodityTabData:false,

      })
    }
      // console.log("CategoryData",this.state.CategoryData,"MarketData",this.state.MarketData)
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
            showloader:false,
            ismarketfilter:false,
            iscategoryfilter:false,
            isLoadingCommodityTabData:false,

        });
        if (error.response) {
          TriggerAlert(
            "Error",
            "Something terrible went wrong at IndiaStatesList",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    )
  }
  createAllIndiaStateOptions = (allIndiaStatesList) =>
  allIndiaStatesList.length
    ? allIndiaStatesList.map((data) => (
        <option key={data.id} name={data.state_eng_name} value={data.id}>
          {data.state_eng_name}
        </option>
      ))
    : "";

    handleAllIndiaStateChange = (e) => {
            //  console.log("district check 1",this.state.allIndiaSelStateDistID)

      this.setState(
        {
          allIndiaSelStatesID: e.target.value,
          isAllIndiaDistListLoading: true,
          stateName:e.target.options[e.target.selectedIndex].text,
          // stateError: false,
          // showloader:true,
          // allIndiaSelStateDistID:-1,
          marketvalue:"na",
          categoryvalue:"na"
          
        },
       
        this.fetchAllIndiaDistList(e.target.value),
      
      );
      this.handleStateChangeData();
     
    };
    checkDistrictData=()=>{
         if(this.state.allIndiaSelStateDistID===-1)
         {
           this.setState({
             districterror:true,
           })
         }
         else{
           this.setState({
            districterror:false,
           })
         }
    }



    handleStateChangeData=()=>{
      this.setState({
        allIndiaSelStateDistID:-1,
        MarketData:[],
        CategoryData:[],
        SpotTableData:[]

      },()=>{
      // console.log("two",this.state.allIndiaSelStateDistID)
      // this.fetchSpotData();
      this.checkDistrictData();

      }

      )
    }
    fetchAllIndiaDistList = (e) => {
      var flag = false;
      this.setState(
        {
          isAllIndiaDistListLoading: true,
        });
       
      UserService.getSelStatesDistList(e).then(
        (response) => {
          flag = true;
          let sortedAllIndiaSelStatesDistList = response.data.data.sort(
            sortObjsInArray("distName")
          );
          this.setState({
            allIndiaSelStateDistList: sortedAllIndiaSelStatesDistList,
            // allIndiaSelStateDistList :response.data.data,
            isAllIndiaDistListLoading: false,
          });
          // console.log("allIndiaSelStateDistList",this.state.allIndiaSelStateDistList)
          // console.log("district check 2",this.state.allIndiaSelStateDistID)

        },
        (error) => {
          flag = true;
          this.setState({
            isAllIndiaDistListLoading: false,
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
    };
    createAllIndiaSelStateDistOptions = (allIndiaSelStatesDistList) =>
    allIndiaSelStatesDistList.length
      ? allIndiaSelStatesDistList.map((data) => (
          <option key={data.id} name={data.distName} value={data.agmarkDistId}>
            {data.distName}
          </option>
        ))
      : "";
      handleAllIndiaDistChange = (e) => {

        this.setState(
          {
            allIndiaSelStateDistID: e.target.value,
            distName:e.target.options[e.target.selectedIndex].text,
            // isAllIndiaBlockListLoading: true,
            // distError: false,
            ismarketfilter:true,
            iscategoryfilter:true,
            marketvalue:"na",
            categoryvalue:"na",
            districterror:false,
            
          },()=>{ 
            // console.log("allIndiaSelStateDistID gthj",this.state.allIndiaSelStateDistID)
          this.fetchSpotData();
        }
        );
      };
      handleSpotData=(spotdata)=>{
        return spotdata.map((data, index) => {
          return <tr className="tablecolorrows" key={index}>
               <td>{this.state.stateName}</td>
               <td>{this.state.distName}</td>
              <td>{data.market_name}</td>
              <td>{data.Group}</td>
              <td>{data.Commodity}</td> 
            <td>{data.modal_price_per_qtl}</td>
              <td>{data.dt_processed}</td>  
          </tr>
      })
      }
      handleCategory = (categoryData) =>
      categoryData.length
        ? categoryData.map((data,id) => (
            <option key={id} value={data}>
              {data}
            </option>
          ))
        : "";
  
        handleCategoryChange = (e) => {

        this.setState(
          {
          categoryvalue: e.target.value,
       },()=>{this.fetchSpotData();
       }
     );
    //  this.fetchSpotData();
   };
   handleMarket = (market) =>
   market.length
     ? market.map((data,id) => (
         <option key={id} value={data}>
           {data}
         </option>
       ))
     : "";

     handleMarketChange = (e) => {

     this.setState(
       {
       marketvalue: e.target.value,
    },()=>{ this.fetchSpotData();
    }
  );
  // this.fetchSpotData();

};
// handleLoaderGif=()=>{
//      this.state.imgarray.map((item)=>{
//            console.log("item",item)
//            return(<img src={item}/>)
//      })
 
// }
disableOnLoad = (data) => {
  let value = "";
  if (data === true) {
    value = "disableDataClass";
  } else {
    value = "farmersUploadWrap ";
  }
  return value;
};
  render() {
    const {
      dashboardDetails,
      weatherForecastData,
      weatherAlertData,
      modalIsOpen,
      SelCatgry,
      categorylist,
      SelSubCtgr,
      subcategorylist,
      SubCtgrLoading,
      uploadedFileMessage,
      isCropCreating,
      SelUnit,
      spotDataTableShow,
     ComingSoon,
     allIndiaSelStatesID,
     allIndiaStatesList,
     allIndiaSelStateDistID,
     allIndiaSelStateDistList,
     SpotTableData,
     CategoryData,
     MarketData,
     marketvalue,
     categoryvalue,
     isAllIndiaDistListLoading,
     ismarketfilter,
     iscategoryfilter,
     showloader
    } = this.state;
    const showModal = () => {
      // const user = AuthService.getCurrentUser();

      this.handlefiltersSpinners();
      // this.fetchSpotData();

      this.fetchAllIndiaDistList(this.state.allIndiaSelStatesID)

      this.setState({
        modalIsOpen: true,
        // distName:user.district,
        // stateName:user.state,
      });
    };

    const hideModal = () => {
      const user = AuthService.getCurrentUser();

      this.setState({
        modalIsOpen: false,
        spotDataTableShow:false,
        allIndiaSelStatesID: user.state_id,
        allIndiaSelStateDistID: user.district_code,
        distName:user.district,
        stateName:user.state,
        categoryvalue:"na",
        marketvalue:"na",
        ismarketfilter:false,
      iscategoryfilter:false,
      showloader:false,
      districterror:false,
      
      });
     
    };
     const showModal2 = () => {
       this.setState({
        ComingSoon: true,
       });
     };

     const hideModal2 = () => {
      
       this.setState({
         ComingSoon: false,

       });

     };
    var weatherMetricsCollection = [];
    if (weatherForecastData.length > 0) {
      let alert1 = "No warning"
      let alert2 = "No warning"
      let alert3 = "No warning"
      let alert4 = "No warning"
      let alert5 = "No warning"
      if(weatherAlertData.length > 0){
        
        alert1 = weatherAlertData[0].Alert1.value
        alert2 = weatherAlertData[0].Alert2.value
        alert3 = weatherAlertData[0].Alert3.value
        alert4 = weatherAlertData[0].Alert4.value
        alert5 = weatherAlertData[0].Alert5.value

      }
      
      weatherMetricsCollection = [
        {
          id: 1,
          date: weatherForecastData[0].Date,
          MaxTemp: Math.round(weatherForecastData[0]["Max. Temp. (℃)"]),
          MinTemp: Math.round(weatherForecastData[0]["Min. Temp. (℃)"]),
          alert: alert1,
        },
        {
          id: 2,
          date: weatherForecastData[1].Date,
          MaxTemp: Math.round(weatherForecastData[1]["Max. Temp. (℃)"]),
          MinTemp: Math.round(weatherForecastData[1]["Min. Temp. (℃)"]),
          alert: alert2,
        },
        {
          id: 3,
          date: weatherForecastData[2].Date,
          MaxTemp: Math.round(weatherForecastData[2]["Max. Temp. (℃)"]),
          MinTemp: Math.round(weatherForecastData[2]["Min. Temp. (℃)"]),
          alert: alert3,
        },
        {
          id: 4,
          date: weatherForecastData[3].Date,
          MaxTemp: Math.round(weatherForecastData[3]["Max. Temp. (℃)"]),
          MinTemp: Math.round(weatherForecastData[3]["Min. Temp. (℃)"]),
          alert:alert4,
        },
        {
          id: 5,
          date: weatherForecastData[4].Date,
          MaxTemp: Math.round(weatherForecastData[4]["Max. Temp. (℃)"]),
          MinTemp: Math.round(weatherForecastData[4]["Min. Temp. (℃)"]),
          alert: alert5,
        },
      ];
    }
  //   const columns = [
  //     {
  //         title: "State",
  //         filtering: false,
        
        
  //     },
  //     {
  //         title: "District",
  //         filtering: false,
        
  //     },
  //     {
  //         title: "Market",
  //         filtering: false,
  //     },
  //     {
  //         title: "Category",
  //         filtering: false,
        
  //     },
  //     {
  //         title: "Price",
  //         filtering: false,
        
  //     },
  //     {
  //         title: "Reported Date",
  //         filtering: false,
         
  //     },
     

  // ];
    return (
      <div className="wrap dashBoardWrap">
        {this.state.loading ? (
          <span className="spinner-border spinner-border-sm dashboardLoader"></span>
        ) : (
          <section className="mainWebContentSection">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-lg-12 padding15"></div>
              </div>
              <div className="width-90">
                <div className="row">
                  <div className="col-md-3">
                    <WeatherWidget
                      key={weatherMetricsCollection.id}
                      weatherDetails={weatherMetricsCollection}
                    />
                  </div>
                  <div className="col-md-9">
                    {/* <div className="width-80 margin-auto"> */}
                    <div className="margin-auto">
                      <div className="row">
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("farmerlist")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Farmers
                            </div>
                            <div className="card-body">
                              <img
                                src={farmerIcon}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {dashboardDetails.tf}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("landholding")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Landholding
                            </div>
                            <div className="card-body">
                              <img
                                src={landHoldingIcon}
                                className="card main-icon dashBoardIcons"
                                alt="landholding_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {this.state.isDataAvaialble
                                ? "" +
                                  Math.round(dashboardDetails.tlh) +
                                  " Acres"
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("crops")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Crops
                            </div>
                            <div className="card-body">
                              <img
                                src={croppingAreaIcon}
                                className="card main-icon dashBoardIcons"
                                alt="totalCroppingArea_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {this.state.isDataAvaialble
                                ? "" +
                                  Math.round(dashboardDetails.crop_area) +
                                  " Acres"
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("inputs")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Input
                            </div>
                            <div className="card-body">
                              <img
                                src={ProductIcon}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {dashboardDetails.total_input_sales}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("commodities")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Commodity
                            </div>
                            <div className="card-body">
                              <img
                                src={Commodity}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {dashboardDetails.total_commodities}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("wsp")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Warehouse
                            </div>
                            <div className="card-body">
                              <img
                                src={WarehouseIcon}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {dashboardDetails.total_wsps}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("organization")}
                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              Accounting
                            </div>
                            <div className="card-body">
                              <img
                                src={AccountIcon}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText"></div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div
                            className="card mb-4 dashboardCard"
                            onClick={() => this.navigateToPage("business-opportunity")}
                            // onClick={() => showModal2(true)}

                          >
                            <div className="card-header dashboardCardTitle text-center dvaraBrownText inbuilt-padding">
                              BO
                            </div>
                            <div className="card-body">
                              <img
                                src={Financial}
                                className="card main-icon dashBoardIcons"
                                alt="farmers_Icon"
                              />
                            </div>
                            <div className="card-footer dashboardCardVals text-center dvaraGreenText">
                              {/* {dashboardDetails.total_orders} */}
                            </div>
                          </div>
                        </div>
                        <Modal
                          show={ComingSoon}
                          onHide={hideModal2}
                          size="sm"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          className="modal-adjust"
                          style={{
                            height: "420px",
                          }}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title
                              style={{
                                padding: "20px",
                                border: "transparent",
                              }}
                            >
                              {/* Coming Soon !! */}
                              <img src={ComingSoonFinance} />
                            </Modal.Title>
                          </Modal.Header>
                        </Modal>

                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="row future-prices"> */}

              
                {/* <div className="col-md-1"></div>
                <div className="col-md-2 first-block">
                  Future Prices <b>({this.state.dateprocessed})</b>
                </div>
                <div className="col-md-4 second-block">
                  <p className="marquee">
                     <Marquee style={{color:"black"}} className="finalChange" pauseOnHover={true} direction="left" speed={70} loop={0}  gradient={false}>
                 {this.state.futurePrices}
                  </Marquee>
                  </p>
                </div>
                <div className="col-md-1 third-block " onClick={() =>showModal(true)}><a href="#">Spot Prices<b>({this.state.Spotdateprocessed})</b></a></div>
                <div className="col-md-4 fourth-block"> 
                   <span id="spot-prices"></span> 
                   <Marquee style={{color:"black"}} className="finalChange" pauseOnHover={true} direction="left" speed={70} loop={0} gradient={false}>
                 {this.state.spotPrices}
                  </Marquee>
                 
                </div>  */}
                
                     {/* <marquee direction="scroll" onMouseOver="this.stop();" onMouseOut="this.start();">{this.state.spotPrices}</marquee> */}
                   {/* <p className="marquee2"> 
                    <span>{this.state.spotPrices}</span>
                  
                   </p>  */}


              <div className="row future-prices width-90 pricesContainer">

               <div className="Pricefirst-block">
                Future Prices <b> ({this.state.dateprocessed})</b>
               </div>
                <div className="Pricesecond-block">
                <p className="marquee">
               <Marquee style={{color:"black"}} className="finalChange" pauseOnHover={true} direction="left" speed={70} loop={0}  gradient={false}>
               {this.state.futurePrices}
              </Marquee>
              </p>
                  </div>
                <div className=" Pricethird-block "   onClick={() =>showModal(true)}><a href="#">Spot Prices
                <b> ({this.state.Spotdateprocessed})</b></a>
                {/* <p style={{position: "relative", top: "-41%",
                top: "-46%", left: "10%", color: "red",letterSpacing:"1px",fontWeight:"600"}}>
                {this.state.spotDistrict}</p> */}
                </div>
                 <div className="Pricefourth-block"> 
                 <span id="spot-prices"></span> 
               <Marquee style={{color:"black"}} className="finalChange" pauseOnHover={true} direction="left" speed={70} loop={0} gradient={false}>
               {this.state.spotPrices}
               </Marquee>
                 </div> 

                      <Modal
                            show={modalIsOpen}
                            onHide={hideModal}
                            size="xl"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered 
                          >
                            <Modal.Header closeButton style={{marginTop:"20px"}}>
                              <Modal.Title>
                                
                                <span className="dvaraBrownText">
                                Spot Prices
                                </span>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              {/* <div className="farmersUploadWrap"> */}
                              <div  className={this.disableOnLoad(this.state.isLoadingCommodityTabData)}>
                       
                     
                                <Form>
                                <Row>
                                  <Col md="3">
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select State</b>*{" "}
                                    
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={allIndiaSelStatesID}
                                      custom
                                      size="sm"
                                      onChange={this.handleAllIndiaStateChange}
                                    >
                                      <option value="0">
                                        --SELECT STATE--
                                      </option>
                                      {this.createAllIndiaStateOptions(
                                        allIndiaStatesList
                                      )}
                                    </Form.Control>
                                  </Form.Group>
                                  </Col>
                                  <Col md="3">
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select District</b>*{" "}
                                    
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      size="sm"
                                      value={allIndiaSelStateDistID}
                                      custom
                                      onChange={this.handleAllIndiaDistChange}
                                    >
                                      <option value="0">
                                        --SELECT DISTRICT--
                                      </option>
                                      {this.createAllIndiaSelStateDistOptions(
                                        allIndiaSelStateDistList
                                      )}
                                    </Form.Control>
                                    {isAllIndiaDistListLoading ? (
                                      <div className="formDistLoadSpinnerWrap">
                                        <span className="spinner-border spinner-border-sm"></span>
                                      </div>
                                    ) : (
                                      <div className="formDistLoadSpinnerWrap"></div>
                                    )}
                                  </Form.Group>
                                  {this.state.districterror ? (
                                        <span style={{ color: "red",position: "relative",
                                        left: "5px",
                                        top: "-10px" }}>
                                          Please Select District
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                  </Col>
                                  <Col md="3">
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select Market</b>
                                     
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      size="sm"
                                      value={marketvalue}
                                      custom
                                      onChange={this.handleMarketChange}
                                    >
                                      <option value="0">
                                        --SELECT Market--
                                      </option>
                                      {this.handleMarket(
                                        MarketData
                                      )}
                                    </Form.Control>
                                    {ismarketfilter ? (
                                      <div className="formDistLoadSpinnerWrap">
                                        <span className="spinner-border spinner-border-sm"></span>
                                      </div>
                                    ) : (
                                      <div className="formDistLoadSpinnerWrap"></div>
                                    )}
                                  </Form.Group>
                                   </Col>                                
                                     <Col md="3">
                                  <Form.Group>
                                    <Form.Label className="dvaraBrownText">
                                      <b>Select Category</b>
                                     
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      size="sm"
                                     
                                      value={categoryvalue}
                                      custom
                                      onChange={this.handleCategoryChange}
                                    >
                                      <option value="0">
                                        --SELECT Category--
                                      </option>
                                      {this.handleCategory(
                                        CategoryData
                                      )}
                                    </Form.Control>
                                    {iscategoryfilter ? (
                                      <div className="formDistLoadSpinnerWrap">
                                        <span className="spinner-border spinner-border-sm"></span>
                                      </div>
                                    ) : (
                                      <div className="formDistLoadSpinnerWrap"></div>
                                    )}
                                  </Form.Group>
                                  </Col>
                                
                                  </Row> 
                                </Form>
                              </div>
                            
                               {/* <div style={{margin:"50px"}}>
                              <Button
                                onClick={this.getSpotPricesData}
                               
                              >
                                <div className="formUpLoadSpinnerWrap">
                                 
                                </div>
                                Save
                              </Button>
                              &nbsp;&nbsp;&nbsp;
                              <Button
                                onClick={hideModal}
                              >
                                Close
                              </Button>
                              <span className="clearfix"></span>
                              </div>
                                  */}

                             
                              {showloader ? (
                                     <div className="mainCropsFarmerLoaderWrap">
                                           {/* {this.handleLoaderGif()} */}
                                          {/* <img src="https://img1.picmix.com/output/stamp/normal/4/0/9/3/1643904_6268b.gif" height="100px"style={{position:"relative",top:"100px",left:"42%"}}/>
                                           <img src="https://www.seasonharvestfoods.com/images/season_harvest_foods/broccoli.gif"  height="100px"style={{position:"relative",top:"100px",left:"42%"}}/> */}
                                        {/* <span className="spinner-border spinner-border-lg mainCropsFarmerLoader"></span> */}
                                        <img src={tractor_moving} height="100px"width="150px" style={{position:"relative",top:"80px",left:"40%"}}/> 

                                    </div> )
                                    :      
                                    SpotTableData.length!=0?
                                    // this.state.noData===false?
                                    
                                 (
                                  <div className="farmersUploadWrap" style={{marginTop:"70px",marginBottom:"50px"}}>

                                  <Table striped bordered hover size="sm">
                                      <thead>
                                          <tr className="dvaraGreenBG" align="center">
                                              <th>State</th>
                                              <th>District</th>
                                              <th> Market</th>
                                              <th>Category</th>
                                              <th>Commodity</th>
                                              <th>Price</th>
                                              <th>Reported Date</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                    
                                         
                                          {this.handleSpotData(SpotTableData)}
                                   
                                          
                                    
                                      </tbody>
                                  </Table>
                              </div>): <p className="nocommodityData">

                                No Data To Display </p>}

{/* 
                                    // <MaterialTable
                                    //     icons={tableIcons}
                                    //     title=""
                                      
                                    //     columns={columns}

                                    //     options={{
                                    //         maxBodyHeight:600,
                                    //         actionsColumnIndex: -1,
                                    //         doubleHorizontalScroll: true,
                                    //         pageSize: 10,
                                    //         pageSizeOptions: [
                                    //             10,
                                    //             20,
                                    //             50,
                                    //             100,
                                    //         ],
                                    //         exportButton: true,

                                    //         headerStyle: {
                                    //             backgroundColor: "#A3C614",
                                    //             color: "#fff",
                                    //             fontSize: "1.2rem",
                                    //             fontFamily: "barlow_reg",
                                    //             fontWeight: "bold",
                                    //         },
                                    //         rowStyle: {
                                    //             backgroundColor: "#f1f1f1",
                                    //             borderBottom: "2px solid #e2e2e2",
                                    //             fontSize: "0.9rem",
                                    //         },
                                    //         filtering: true,
                                    //     }}
                                    // /> */}
                              

                           </Modal.Body>
                          </Modal> 






























                 {/* <div className="col-md-1 third-block">Spot Prices</div>
               <div class="marq-container col-md-4 fourth-block">
                     <p class={this.handleMarqueeSpeed()}>
                {console.log("spotprice",this.state.spotPrices)}
                  {this.state.spotPrices}
                    </p>
                 </div> */}

              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  componentDidMount() {
    
    if(!localStorage.getItem('user')){
      this.props.history.push('/')
      return
    }
    UserService.getDashboard().then(
      (response) => {
        if(response.data.success){
          this.setState({
            dashboardDetails: response.data.data,
            isDataAvaialble: true,
            loading: false,
          },          
          // localStorage.setItem('sites_wkt',  response.data.data.all_sites_wkt)
          );
        }
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

    const user = AuthService.getCurrentUser();
    this.setState({
      allIndiaSelStatesID:user.state_id,
      allIndiaSelStateDistID: user.district_code,
      distName:user.district,
      stateName:user.state,
      
    },()=>{
      console.log("abc")
      // console.log("allIndiaSelStatesIDj000",this.state.allIndiaSelStatesID,"allIndiaSelStateDistID9000",this.state.allIndiaSelStateDistID)
      // this.fetchSpotData();

    
    })
    // console.log("abc ",this.state.allIndiaSelStatesID,"bb ", this.state.allIndiaSelStateDistID)
    UserService.getWeatherForecast(user.state_id, user.district_code, user.blockId).then(
      (response) => {
        if (response.data.length !== 0) {
          this.setState({
            weatherForecastData: response.data,
          });
        } 
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
    // UserService.getWeatherWarning(user.state_id, user.district_code).then(
    //   (response) => {
    //     if (response.data.length !== 0) {
    //       this.setState({
    //         weatherAlertData: response.data,
    //       });
    //     } /* else {
    //       this.setState({
    //         weatherAlertData: weatherAlertsInfo,
    //       });
    //     } */
    //   },
    //   (error) => {
    //     this.setState({
    //       content:
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString(),
    //     });
    //   }
    // );

    UserService.getCategoryList().then(
      (response) => {
        this.setState({
          categorylist: response.data.data,
          // SelCatgry: response.data.data[0].id,
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
    UserService.getSpotPrice(user.state_id, user.district_code).then(
      // UserService.getSpotPrice(this.state.allIndiaSelStatesID,this.state.allIndiaSelStateDistID).then(

      (response) => {
              //  console.log("spotPrices response",response)
              //  console.log("spotPrices response222",response.data[0]["District Name"])


        if (response.request.readyState == 4 && response.status == "200") {
          if (response.data.length < 1) {
             var spotprice = "No data is available for this state for the last 5 days"
           
          
          }else{
            this.setState({
              Spotdateprocessed:(response.data[0].dt_processed),
              spotDistrict:response.data[0]["District Name"]
            })
            // console.log("SPOT ",response.data)
            var spotprice = response.data.map(elem => {
              return elem.Commodity + " - " + " Rs." + elem["Modal Price (Rs./Quintal)"] + " /Qtl " + "( " + elem.dt_processed + " ) " + " , ";
            });
        }
       

      } else if (response.status == "0"){
        var spotprice = "Error";
      }
      this.setState({
        spotPrices: spotprice
      })
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
    )

    UserService.getFuturePrice().then(
      (response) => {       
         
        if (response.request.readyState == 4 && response.status == "200") {
          if (response.data.length < 1 || typeof response.data === 'string' || response.data instanceof String) {
             var futureprices = "No data is available for this Block"           
          }else{
            // console.log("FUTURE",response.data)
            this.setState({
              to_day:  new Date(response.data[0].dt_processed)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: 'numeric'
              })
              .replace(/ /g, "-"),
              dateprocessed: new Date(response.data[0].dt_processed)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: 'numeric'
              })
              .replace(/ /g, "-"),
            })
            var futureprices = response.data.map(elem1 => {
              if (elem1["Price Unit"] === "Nan"){
                return elem1.Symbol + "("+ elem1["Exp"] +") - " + " Rs." + elem1["Closing Price"] + ", ";

              }else{
                return elem1.Symbol + "("+ elem1["Exp"] +") - " + " Rs." + elem1["Closing Price"] +  elem1["Price Unit"] + ", ";
              }
            });
        }
      
      } else if (response.status == "0"){
        var futureprices = "Error";
      }
      this.setState({
        futurePrices: futureprices
      })
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
    )
    UserService.getAllIndiaStatesList().then(
      (response) => {
        // console.log("third",response)
        let sortedAllIndiaStatesList = response.data.data.sort(
          sortObjsInArray("id")
        );
        this.setState({
          allIndiaStatesList: sortedAllIndiaStatesList,
        });
        // console.log("allIndiaStatesList",this.state.allIndiaStatesList)
            // this.fetchAllIndiaDistList(this.state.allIndiaSelStatesID)

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
        if (error.response) {
          TriggerAlert(
            "Error",
            "Something terrible went wrong at IndiaStatesList",
            "error"
          );
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
      }
    );
    // this.fetchSpotData();
    // this.fetchAllIndiaDistList(this.state.allIndiaSelStatesID)
    // this.fetchSpotData(user.state_id,user.district_code,this.state.marketvalue,this.state.categoryvalue);

   
  }


}
