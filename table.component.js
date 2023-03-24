import React, { Component, useEffect, useState } from "react";
import EventBus from "../services/eventbus.service";
import MaterialTable from "material-table";
import { ReactTabulator, reactFormatter } from "react-tabulator"; // for React 15.x, use import { React15Tabulator }
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
import "../assets/css/farmerlist.css";
import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter";
import tableIcons from "./icons";
import { ProgressBar, Row, Col, Tooltip, OverlayTrigger, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPencilAlt, faEye, faMobile, faMobileAlt ,faTimesCircle,faSave, faWindowClose, faComment, faLaptopHouse, faInfo} from "@fortawesome/free-solid-svg-icons";
import UserService from "../services/user.service";
import {AlertMessage,TriggerAlert,ComplianceAlertMessage} from './dryfunctions'
import moment from "moment";
import noImageFpo from "../assets/img/noImageFpo.jpg";
import farmerfemale from "../assets/img/farmer_female.png";
import farmerIcon from "../assets/img/farmer.svg";


const Table = (props) => {
  // const rx_live = /^[+-]?\d*(?:[.]\d*)?$/;
  const rx_live = /^\d*(?:[.]\d*)?$/;
  // const rx_live = /^\d*(?:\d*)?$/;

  const  findArrayElementById = (array, id, _type) => {  
    return array.find((element) => {
        if (_type === 'activity')
            return parseInt(element.id) === id;
        else if (_type === 'service') 
            return parseInt(element.services_id) === id;
      })
   
  }

  
  const farmerEditoptions = {
      "first_name": "",
      "last_name": "",
      "gender": "",
      "dob": "",
      "age": "",
      "phone": "",
      "alternate_contact_number":"",
      "father_name": "",
      "changed_number": "",
      "is_member": "",
      "total_number_of_sites": "",
      "education": "",
      "agriculture_experince": "",
      "residential_stability": "",
      "residential_status": "",
      "interested_for_financial": "",
      "farmer_nonaccessibility": "",
      "agri_activities": [],
      "financial_services": [],
      "caste_id":"",
      "farmer_fig_id":"",
      "shared_alloted":"",
      "total_share_value":"",
    }
  
 
  const initfarmerActivities = (activityMaster, response) => {
    // console.log("activityMaster", activityMaster, response)
    let activityObj = []
    activityMaster.map(act =>{
      let item = { "id": String(act.id), "name": act.name, "seleted": false, 
        "count_value": act.count_value, "count_units": act.count_units}
      let responseItem = {}
      if (response && response !== '[]'){
        responseItem = findArrayElementById(eval(response), act.id, 'activity')
        if (responseItem){
          item = responseItem
        }
      }
    
      activityObj.push(item)
    })
    return activityObj
  }
  
  const initfarmerServices = (sevicesList, response) => {
    let serviceObj = []
    // console.log("ServiceMaster", sevicesList, response)
    sevicesList.map(service =>{
      
      let item = { "services_id": service.services_id, "services__service_name": service.services__service_name, "selected": false, 
        "services__service_category__category_name": service.services__service_category__category_name}
      let responseItem = {}
      if (response && response !== '[]'){
        responseItem = findArrayElementById(response, service.services_id, 'service')
        if (responseItem){
          item = responseItem
        }
      }
    
      serviceObj.push(item)
    })
    return serviceObj
  }
  const [modalShow, setShow] = useState(false)
  const [OtpmodalShow, setOtpShow] = useState(false)

  const [rowDetail, setCurrentData] = useState("")
  const [farmerActivityData, setActivity] = useState([])
  const [disabled, setDisable] = useState(false)
  const [isFarmerUpdating, setisFarmerUpdating] = useState(false)
  const [isFormDisabled, setisFormDisabled] = useState(true)
  const [farmerEditObject, setEditObject] = useState(farmerEditoptions)
  const [isEdit, setisEdit] = useState(false)
  const [selectedfarmerId, setFarmerId] = useState(-1)
  const [changedNumber, setNumber] = useState("")
  const [wrongPhone, setwrongPhone] = useState(false)
  const [wrongChanged, setwrongChanged] = useState(false)
  const [sitesGreater, setsitesGreater] = useState(false)
  const [ageGreater, setageGreater] = useState(false)
  const [setage, setageValue] = useState()
  const [aggriculturegreater, setaggriculturegreater] = useState(false)
  const [notmoreninetynine, setnotmoreninetynine] = useState(false)
  const [verifyphonenumber, setPhoneNumber] = useState("")
  const [verifyphonemessage, setPhoneMessage] = useState("")
  const [showCurrentNumber, setshowCurrentNumber] = useState("")

  const [verifyOtpnum, setOtpNum] = useState("")
  const [verifyOtpMessage, setOtpMessage] = useState("")
  const [showMobileloader, setshowMobileloader] = useState(false)
  const [showOtploader, setshowOtploader] = useState(false)
  const [UuiId, setUuiId] = useState("")
  const [AlternatePhoneMessage, setAlternatePhoneMessage] = useState("")


  

  



  
  const [showMember, setIsMemberModal] = useState(false)
  const [memberEditDisable, setEditDisable] = useState(false)
  // const [chooseMember, setSelectMember] = useState("")
  // const [chooseMemberStatus, setSelectMemberStatus] = useState("")
  const [chooseMemberRemarks, setSelectMemberRemarks] = useState("")
  const [InterestedFarmerMandatory, setInterestedFarmerMandatory] = useState(false)
  const [InterestedMessage, setInterestedFarmerStatusMessage] = useState(false)
  const [showMemberAccepted, setMemberAccepted] = useState(false)

  const [checkboxStatus, setCheckboxStatus] = useState(false)
  const [radiobuttonstatus, setradiobuttonstatus] = useState("")
  
  const [MemberInterestStatus, setMemberInterestStatus] = useState("")
  const [servicesData, setservicesData] = useState([])  
  const [servicedisabled, setservicedisabled] = useState(false)
  const [enlarged, setEnlarged] = useState(false);
  const [category,setCategory] = useState(null);
  const [figList,setFigList] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [changed,setChanged] = useState('');
  const [figchanged,setFigChanged] = useState('');
  const [showModal, setShowModal] = useState(false);

  function handleImageClick() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }
  function MyModal({ showModal, setShowModal }) {
    const handleCloseModal = () => setShowModal(false);

    return (
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ marginTop: "30px" }}></Modal.Header>
        <Modal.Body>
          <div style={{ height: "560px"}}>
          {rowDetail.presigned_url!=null?
              (<img
                src={rowDetail.presigned_url} alt="photo"
                height="100%"
                width="100%"
              />)
                :                 
              ( rowDetail.gender===2? <img src={farmerfemale} height="100%"
              width="100%" alt="photo"/>
              : <img src={farmerIcon} height="100%"
              width="100%" alt="photo" />)
              }
            
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  const handleSureCheckbox = (e) => {
    setCheckboxStatus(e.target.checked);
  };

  // const SelectMember=(e)=>{
  //   setSelectMember(e.target.value)
  // }
  // const SelectMemberStatus=(e)=>{
  //   setSelectMemberStatus(e.target.value)
  //   setInterestedFarmerStatusMessage(false)

  // }
  const SelectMemberRemarks=(e)=>{
    setSelectMemberRemarks(e.target.value)
    setInterestedFarmerMandatory(false)

  }
  const SelectNoOfShares=(e)=>{

    if (e.target.value == ''){
      setChanged(0)
    }
    else {
    setChanged(e.target.value)
    }

  }

  const SelectNoOfValue=(e)=>{
    if (e.target.value == ''){
      setFigChanged(0)
    }
    else {
      setFigChanged(e.target.value)

    }

  }
  
  const modalOpen = (currentRow,EditDisable) => {
    
    setShow(true)
    //  console.log("currentRow",currentRow)
    //  console.log("EditDisable",EditDisable)

    // let activityResponse = JSON.parse(currentRow.allied_activities)
    setEditDisable(EditDisable)
    setFarmerId(currentRow.user_ptr_id)
    var flag = false;
    UserService.getFarmerDetail(currentRow.user_ptr_id).then(
      (response) => { 
        flag = true;
        
        if(response.data.success){
          // console.log("farmerdetail------",response)
            
            let activityResponse = JSON.parse(response.data.farmer.agri_activities)
            setCurrentData(response.data.farmer)
            setNumber(response.data.farmer.changed_number)
            setEditObject({ ...farmerEditObject, changed_number : response.data.farmer.changed_number ? response.data.farmer.changed_number : "" })
            setActivity(initfarmerActivities(props.activityMaster, activityResponse))
            setservicesData(initfarmerServices(props.serviceList, response.data.farmer.financial_services))
        }
          
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
      }
      );
      UserService.getCategory()
      .then(response => {
        {console.log("getCategory",response.data.caste_list)}
        setCategory(response.data.caste_list)
        setFigList(response.data.fig_list)
      })
      .catch(error => {
        console.log(error);
      });
    // debugger
    // setCurrentData(currentRow)
    // setNumber(currentRow.changed_number)
    // setEditObject({ ...farmerEditObject, changed_number : currentRow.changed_number ? currentRow.changed_number : "" })
    // setActivity(initfarmerActivities(props.activityMaster, activityResponse))

  }
  const OtpmodalOpen = (currentRow) => {
    setOtpShow(true)
    // console.log("otp row",currentRow)
    setFarmerId(currentRow.user_ptr_id)
    setCurrentData(currentRow)
    setshowCurrentNumber(currentRow.phone)
    setOtpNum("")
    setPhoneNumber("")

   

  }
  const OtpmodalClose = () => {
    setOtpShow(false)
    setPhoneMessage("")
    setOtpNum("")
    setOtpMessage("")
    setUuiId("")
    setPhoneNumber("")
    setUuiId("")



  }

  //calculate age
const calculateAge = (birthday) => {
  //milliseconds in a year 1000*24*60*60*365.24 = 31556736000; 
  let today = new Date(),
  //birthay has 'Dec 25 1998'
  dob = new Date(birthday),
  //difference in milliseconds
  // diff = today.getTime() - dob.getTime(),
  // //convert milliseconds into years
  // years = Math.floor(diff / 31556736000),
  // //1 day has 86400000 milliseconds
  // days_diff= Math.floor((diff % 31556736000) / 86400000),
  // //1 month has 30.4167 days
  // months = Math.floor(days_diff / 30.4167),
  // days = Math.floor(days_diff % 30.4167);
  month_diff = Date.now() - dob.getTime(),
  
  //convert the calculated difference in date format
  age_dt = new Date(month_diff),
  
  //extract year from date    
  year = age_dt.getUTCFullYear(),
  
  //now calculate the age of the user
  age = Math.abs(year - 1970);
  
  // console.log(`${years} years ${months} months ${days} days`);
  return age ;
}
const onChangeData = (e, key) => {
    // console.log("rower",rowDetail)
    const _live = /^[+]?\d*(?:[]\d*)?$/;
    var regix_text = /^[a-zA-Z]*$/;
    // const regix_num =  /^[0-9,-]*$/;

    

    if(key === 'dob'){
      let age = calculateAge(e.target.value)
      setCurrentData({ ...rowDetail, age : age, [key]: e.target.value })
      setEditObject({ ...farmerEditObject, [key]: e.target.value, age : age, })     

      
    }
    else if(key === 'age'){
      // console.log("age",e.target.value)
      let ageval=parseInt(e.target.value)
      if(ageval>100 || ageval<=0 )
      {

        setageGreater(true)
      }
      else{
      let today = new Date()
      let currentYear = today.getFullYear()
      let dobYear = currentYear - parseInt(e.target.value)
      let validAge=parseInt(e.target.value)
        setageGreater(false)
         setageValue(validAge)
      setCurrentData({ ...rowDetail, dob : `${dobYear}-01-01`,  [key]: e.target.value  })
      setEditObject({ ...farmerEditObject, [key]: e.target.value, dob : `${dobYear}-01-01` })    
      } 
    }
    else if(key==="total_number_of_sites")
    {
      if (e.target.value >25 || e.target.value<0) 
        setsitesGreater(true)
        else
        {
          setsitesGreater(false)
          setCurrentData({ ...rowDetail, [key]: e.target.value })
          setEditObject({ ...farmerEditObject, [key]: e.target.value })
        }
      
    }
    else if(key === "changed_number" || key === "phone"){    
      if(_live.test(e.target.value)){
        if (e.target.value.length <= 10) {
          setCurrentData({ ...rowDetail, [key]: e.target.value })
          setEditObject({ ...farmerEditObject, [key]: e.target.value })
          setwrongChanged(false)
          setwrongPhone(false)
        }
      }
    }
    else if(key === "agriculture_experince"){
      if(_live.test(e.target.value)){
      setCurrentData({ ...rowDetail, [key]: e.target.value })
       setEditObject({ ...farmerEditObject, [key]: e.target.value })
      }
      // if(_live.test(e.target.value)){
      //   console.log("greater then",setage)

      //   if (e.target.value >setage || e.target.value>rowDetail.age) 
      //   {
      //     setaggriculturegreater(true)
      //     console.log("enter1",setage)
      //   }
      //   else{
      //   setaggriculturegreater(false)
      //       console.log("enter2")
      //   setCurrentData({ ...rowDetail, [key]: e.target.value })
      //   setEditObject({ ...farmerEditObject, [key]: e.target.value })
      //   }
      // }      
    }
    else if (key === 'father_name'){
      if(regix_text.test(e.target.value)){
            setCurrentData({ ...rowDetail, [key]: e.target.value })
            setEditObject({ ...farmerEditObject, [key]: e.target.value })   
      }
    }
    else if (key === 'first_name'){
      if(regix_text.test(e.target.value)){
            setCurrentData({ ...rowDetail, [key]: e.target.value })
            setEditObject({ ...farmerEditObject, [key]: e.target.value })   
      }
    }
    else if (key === 'last_name'){
      if(regix_text.test(e.target.value)){
            setCurrentData({ ...rowDetail, [key]: e.target.value })
            setEditObject({ ...farmerEditObject, [key]: e.target.value })   
      }
    }
     else if(key === 'alternate_contact_number'){
      if(e.target.value[0]==6||e.target.value[0]==7|| e.target.value[0]==8 || e.target.value[0]==9)
     {
      if(_live.test(e.target.value)){
      setCurrentData({ ...rowDetail, [key]: e.target.value })
       setEditObject({ ...farmerEditObject, [key]: e.target.value })
       setAlternatePhoneMessage("")
      }}
      else{
        setAlternatePhoneMessage("Mobile Number should start with 6,7,8,9")
        setCurrentData({ ...rowDetail, [key]: "" })
        setEditObject({ ...farmerEditObject, [key]: ""})     
      }
    }
    
   
    else{
      setCurrentData({ ...rowDetail, [key]: e.target.value })
      setEditObject({ ...farmerEditObject, [key]: e.target.value })     
    }
    // console.log("farmerEditObject",farmerEditObject)
  }

  useEffect(() => {
    // Update the document title using the browser API
    // console.log("rowDetail", rowDetail)
    
    // console.log("serviceList", servicesData)
    // console.log("serviceMaster", servicesData)

    // console.log("");
  });

  const modalClose = () => {
    // console.log("close the modal")
    setShow(false)
    setDisable(false)
    setisFarmerUpdating(false)
    setisFormDisabled(true)
    setisEdit(false)
    setsitesGreater(false)
    setageGreater(false)
    setageValue()
    setaggriculturegreater(false)
    setnotmoreninetynine(false)
    setAlternatePhoneMessage("")



  }
  const enableEdit = (value) => {
    setisEdit(!value)
    setisFormDisabled(value)
    let conditionObj = farmerActivityData.find((element) => {
      return element.name.includes("No Agricultural")
    })
    let conditionserviceObj = servicesData.find((element) => {
      return element.services__service_name.includes("Not Interested")
    })
    if(conditionObj.seleted){
      setDisable(true)
    }else{
      setDisable(false)
    }
    if(conditionserviceObj.selected){
      setservicedisabled(true)
    }else{
      setservicedisabled(false)   
    }


}
  const retrunFIValue = (value) => {
      if(String(value) === "true"){
        return "  YES"
      }
      else{
        return "  NO"
      }
  }
  const DisableHandle = () => {
  let logged_supervisor= props.logged_supervisor;
  let accessed_supervisor=props.accessed_supervisor;
  if(parseInt(accessed_supervisor) !== parseInt(logged_supervisor))
  {
    return true;
  }
return false;


}
  const rowClassname = (changedNumber, nacf) => {
    let value = "farmersCard"
    if(changedNumber){
      value = "farmersCard changeNumber"
    }
    if(nacf !== null){
        if(String(nacf) === "true"){
          value = "farmersCard nacf-Yes"
        }
    }
    return value
  }
  const activityChange = (e, activity, i, countvalue) => {
    // console.log("activityChange--------------", e, activity,i,countvalue)
    // console.log("farmerActivityData",farmerActivityData)
    if(countvalue === "checkbox"){
      let selection = e.target.checked
      activity.seleted = selection
      let farmeractiveData = [...farmerActivityData]
      let length = 0
      if(activity.name.includes("No Agricultural") && selection){
        // console.log("selection 11")

        length = farmeractiveData.filter(data => data.seleted).length
        if (length > 1){
          activity.seleted = false
         
          AlertMessage("Other Activities Applied, Please un check the others","warning");

          // alert("Other Activities Applied, Please un check the others")
          return null
        }
        else{
          setDisable(true)
        }
      }else if(!selection){
        // console.log("selection 2")
        activity.count_value = null
        if(activity.name.includes("No Agricultural")){
          setDisable(false)
        }
      }
    }
    else{

      //  let newregix=/^\d+([.]?\d{0,2})?$/g;

         let newregixacres=/^(\d+)?([.]?\d{0,1})?$/
         let newregixnumber =  /^[\d]*$/
         if(e.target.value[0]!=0){
     if(activity.count_units==="number")
     {
      if (newregixnumber.test(e.target.value)) 
         activity.count_value = e.target.value

     }
     if(activity.count_units==="acres")
        {

      if (newregixacres.test(e.target.value))    
      {
      if(e.target.value>99)  
      {
        // console.log("greater then 99")
        setnotmoreninetynine(true)
      }  
      else{
        setnotmoreninetynine(false)

        activity.count_value = e.target.value

      }
    }
    }
  } 
  else{
     alert("Value cannot be 0 , Enter a Valid Number")
      return
     
  }
    }
    // if(activity.id === 21 && selection ){
    //   setDisable(true)
    //   setActivity(farmerActivities(props, null, "empty"))
    //   return null
    // }else{
    //   setDisable(false)
    // }
    
    let selectedStateEntityObjs = [...farmerActivityData];     // create the copy of state array
    selectedStateEntityObjs[i] = activity               //new value
    setActivity(selectedStateEntityObjs)

  }
  const serviceChange = (e, service, i) => {
    // console.log("Service Change--------------", e, service,i)
    // console.log("servicesData",servicesData)
      
      let selection = e.target.checked
      service.selected = selection
      let farmerserviceData = [...servicesData]
      let length = 0
      if(service.services__service_name.includes("Not Interested") && selection){
        // console.log("selection 11")

        length = farmerserviceData.filter(data => data.selected).length
        if (length > 1){
          service.selected = false
         
          AlertMessage("Other Services Applied, Please un check the others","warning");

          // alert("Other Activities Applied, Please un check the others")
          return null
        }
        else{
          setservicedisabled(true)
        }
      }else if(!selection){
        // console.log("selection 2")
        service.count_value = null
        if(service.services__service_name.includes("Not Interested")){
          setservicedisabled(false)
        }
      }
    
    let selectedStateEntityObjs = [...servicesData];     // create the copy of state array
    selectedStateEntityObjs[i] = service               //new value
    setservicesData(selectedStateEntityObjs)

  }
  const showButtonHiddenClass=()=>{
    if (memberEditDisable)
    return "fa-pull-left defaultButtonElem hideEditClass"
    else 
    return "fa-pull-left defaultButtonElem"
  }
  const MemberClassname = (village_id,onboardingStatus) => {
    let rowclass = "farmersCard"
    if(onboardingStatus==="Rejected")
    {
      rowclass="farmersCard blackShadow"
      return rowclass

    }
    if(village_id==null)
    {
      rowclass="farmersCard changeNumber"
    }
    // if(changedNumber){
    //   value = "farmersCard changeNumber"
    // }
    // if(nacf !== null){
    //     if(String(nacf) === "true"){
    //       value = "farmersCard nacf-Yes"
    //     }
    // }
    return rowclass
  }
  const showMembershipModal=(currentRow)=>{
    // console.log("i am ready to show data",currentRow)
   
    setIsMemberModal(true)
    setFarmerId(currentRow.user_ptr_id)
    // console.log("selectedfarmerId",selectedfarmerId)

  }
  const showMembershipAcceptModal=(currentRow)=>{
    setMemberAccepted(true)
    setFarmerId(currentRow.user_ptr_id)
    setMemberInterestStatus(currentRow.is_interested_as_member)
    setChanged("0")
    setFigChanged("0")

  }
  const hideMemberModal=()=>{
    setIsMemberModal(false)
    setInterestedFarmerMandatory(false)
    setInterestedFarmerStatusMessage(false)
    setCheckboxStatus(false)
    // setSelectMember("")
    // setSelectMemberStatus("")
    setSelectMemberRemarks("")
   

  }
  const hideMemberAcceptModal=()=>{
    setMemberAccepted(false)
    setInterestedFarmerMandatory(false)

  }
  const handleMemberChange=(e)=>{
    // console.log("member",e.target.value)
    setradiobuttonstatus(e.target.value)
    setInterestedFarmerMandatory(false)

  }
 
  const handleAcceptedSave=()=>{
       console.log("accepted save",radiobuttonstatus)
       if(radiobuttonstatus==="")
       {
        setInterestedFarmerMandatory(true)
       }
       else{
        const data = new FormData();
        var flag=false;
        data.append("action", "Accept");
        if(radiobuttonstatus==="Member")
        {
          data.append("is_member","1")
          data.append("shared_alloted",changed)
          data.append("total_share_value",figchanged)

        }
        else if(radiobuttonstatus==="Non Member")
        {
          data.append("is_member","0")

        }
        var flag=false;
        UserService.UpdatedInterestedFarmers(data,selectedfarmerId).then(
          (response) => {
            console.log(response,"responsee---")
            flag = true;
            if (response.data.success) {
             
              ComplianceAlertMessage(response.data.message,"success");
              hideMemberAcceptModal(true)
               props.updateMembershipData()
              //  props.sendFilters()

              
            }
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
          // setTimeout(() => {
          //   if (flag == false) {
          //     this.setState({
          //       showloader: false,
          //     });
          //     TriggerAlert("Error", "Response Timed out, Please try again", "info");
          //     this.navigateMainBoard()
          //   }
          // }, 30000)
        );
       }

  }
  






  
  const updateInterestedFarmerStatus=()=>{
    let error=false
    if(chooseMemberRemarks=="")
    {  
       setInterestedFarmerMandatory(true)
       return
    }
    if(error==false)
    { 
      // setInterestedFarmerStatusMessage(false)
      setInterestedFarmerMandatory(false)

      const data = new FormData();
      var flag=false;
      data.append("action", "reject");
      data.append("onboarding_remarks", chooseMemberRemarks);
      UserService.UpdatedInterestedFarmers(data,selectedfarmerId).then(
        (response) => {
          flag = true;
          if (response.data.success) {
             
            ComplianceAlertMessage(response.data.message,"success");
             hideMemberModal(true)
             props.updateMembershipData()
            //  props.sendFilters()





























             
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

  }
  const MakeMembershipCard = (props) => {
    // console.log("member",props)
    const EditDisable=props.EditDisable;
    const rowData = props.cell._cell.row.data;
  // console.log("all the data",rowData)
    return (
      <Row id={rowData.id} key={rowData.id} className={MemberClassname(rowData.village_master_id,rowData.onboarded_status)}>
        <Col lg="2" md="2" sm="2" className="">
          <Row>
            <Col lg="2" md="2" sm="2" className="">
              {rowData.gender===2? <i className="farmerIconFemale"></i>: <i className="farmerIcon"></i>}
             
            </Col>
            {/* {console.log("rowData",rowData)} */}

            <Col lg="10" md="10" sm="10" className="farmerCardNameDets" style={{height:"75px"}}>
              <h4 className="farmerListCardHeading dvaraBrownText" style={{marginLeft:"8px"}}>
           
                {rowData.first_name}
              </h4>
              <br />
              <h6 className="farmerListCardHeading dvaraBrownText" style={{marginLeft:"8px",marginTop:"-10px"}}>
                {rowData.last_name} -- <small style={{color:"black"}}>{rowData.phone}</small>
              </h6><br />
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="dvaraGreenText"
                style={{marginLeft:"8px",marginTop:"5px"}}
              ></FontAwesomeIcon>
              <span className="farmersVillageName">&nbsp;
              {rowData.village_master__village_name!=null ?rowData.village_master__village_name
              :rowData.village}
              </span>
            </Col>
          </Row>
        </Col>
        <Col lg="2">
        {/* <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="dvaraGreenText"
                style={{marginTop:"7px"}}
              ></FontAwesomeIcon> */}
              <span className="farmersVillageName dvaraBrownText" style={{fontWeight:"600",fontSize:"15px",marginLeft:"2px",marginTop:"7px"}}>&nbsp;
                Village Status:  <span style={{color:"black"}}>{rowData.village_master__village_name===null ?"New" 
                  :"Existing"}</span>


              </span>
              <br/>
              {rowData.village_master__village_name===null? <div className="farmersVillageName dvaraBrownText" style={{marginLeft:"10px",fontWeight:"600"}}>
                Lat Long : <span style={{color:"black",fontWeight:"500"}}>{parseFloat(rowData.lattitude).toFixed(4)}&nbsp;{parseFloat(rowData.longitude).toFixed(4)}</span></div>:""}
        </Col>
        <Col lg="3" md="3" sm="3" className="noPadding">
          <Row className="noPadding">
            <Col lg="2" md="2" className="noPadding">
              <i className="frIcon" title="Field Representative"></i>
            </Col>
            <Col lg="10" md="10" sm="10" className="noPadding">
              <h4 className="farmerListSubHeading dvaraBrownText">
                &nbsp;
                {rowData.fr_name}
              </h4>
              <br />
              {/* <h6 className="farmerListCardHeading dvaraBrownText">Financial product Interest : </h6>
            
                <span>{rowData.interested_for_financial ? retrunFIValue(rowData.interested_for_financial) : "  NA"}</span>
              
                 <br /> */}
            
              
          {/* <OverlayTrigger key="left" placement="left"
          
          overlay={<Tooltip id="farmer_edit" >
          
          <div
            {...props}
            style={{
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
           Farmer App Downloaded
          </div>
          
          
          </Tooltip>}>
     
         
          <FontAwesomeIcon
         
            icon={faMobileAlt}
            className="dvaraBrownText"
         
          ></FontAwesomeIcon>
       
        </OverlayTrigger>
        <span className="farmersVillageName" style={{marginTop:"-10px"}}>
     

            &nbsp;&nbsp;{rowData.app_downloaded }
             </span> */}
            </Col>
          </Row>
        </Col>
        <Col lg="2" md="2" sm="2" className="noPadding">
          <div className="farmersVillageName dvaraBrownText"style={{fontWeight:"600"}}>Date Submitted by FR: <span style={{color:"black",fontWeight:"500"}}>{moment(rowData.created_at).format("DD/MM/YYYY")}</span></div>
           <div className="farmersVillageName dvaraBrownText" style={{fontWeight:"600"}}>Is Interested to be a member ? <span style={{color:"black",fontWeight:"500"}}>{rowData.is_interested_as_member?"Yes":"No"}</span></div>
           </Col>
    
        
        <Col lg="1" md="1" sm="1" className="noPadding">
          <br />
         {DisableHandle()===true?
            <OverlayTrigger key="top" placement="top"
          
            overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
       
           
            <FontAwesomeIcon
              style={{opacity:"0.4",position:"relative",left:"30px"}}
              icon={faEye}
              className="dvaraBrownText"
            ></FontAwesomeIcon>
           
          </OverlayTrigger>
         
         
         
           :
           <OverlayTrigger key="top" placement="top"
          
           overlay={<Tooltip id="farmer_edit">View</Tooltip>}>
      
          
           <FontAwesomeIcon
              style={{position:"relative",left:"50px",fontSize:"1.2rem"}}
             icon={faEye}
             className="dvaraBrownText"
             onClick={() => modalOpen(rowData,EditDisable)}

           ></FontAwesomeIcon>
          
         </OverlayTrigger>
           }
        </Col>
        <Col lg="2"> 
      
         { rowData.onboarded_status==="Rejected"?    
           <div>
         <Button  disabled style={{marginLeft:"15px",marginTop:"15px"}} variant="danger">Rejected</Button> 
           {/* <OverlayTrigger key="top" placement="top"
          
              overlay={<Tooltip id="farmer_edit2">{rowData.onboarding_remarks}</Tooltip>}>
       
            */}
           
           
            
         {/* <FontAwesomeIcon
              style={{position:"relative",left:"20px",top:"10px",fontSize:"1.2rem"}}
             icon={faInfo}
             className="dvaraBrownText"
           

           ></FontAwesomeIcon> */}
           {/* </OverlayTrigger>  */}
           <OverlayTrigger key="top" placement="top"
          
          overlay={<Tooltip id="farmer_edit2">{rowData.onboarding_remarks}</Tooltip>}>
     
         
         <FontAwesomeIcon
              style={{position:"relative",left:"35px",top:"10px",fontSize:"1.2rem"}}
             icon={faInfo}
             className="dvaraBrownText"
           

           ></FontAwesomeIcon> 
         
        </OverlayTrigger>
         </div>
    
        :
         rowData.village_master_id?
         <div style={{marginTop:"15px"}}>
        <Button style={{marginLeft:"10px"}} variant="success"  onClick={()=>showMembershipAcceptModal(rowData)}>Accept</Button>

         <Button  onClick={()=>showMembershipModal(rowData)} style={{marginLeft:"15px"}} >Reject</Button></div>
        :rowData.village_master_id==null?
        <Button  onClick={()=>showMembershipModal(rowData)} style={{marginLeft:"15px",marginTop:"15px"}} >Reject</Button>:"" 
        
      }
             {/* <FontAwesomeIcon
              icon={faSave}
              style={{position:"relative",top:"20px", fontSize: "1.2rem",left:"-26px"}}
              onClick={()=>showMembershipModal(rowData)}
              className="dvaraBrownText"

            ></FontAwesomeIcon> */}
         
     
  
           
        </Col>
                
      </Row>
                   
    );
    }
  const MakeFarmerCard = (props) => {
    // console.log("old card",props)
  const rowData = props.cell._cell.row.data;
  // console.log("all the data",rowData)
    return (
      <Row id={rowData.id} key={rowData.id} className={rowClassname(rowData.changed_number, rowData.farmer_nonaccessibility)}>
        <Col lg="2" md="2" sm="2" className="">
          <Row>
            <Col lg="2" md="2" sm="2" className="">
              {rowData.gender===2? <i className="farmerIconFemale"></i>: <i className="farmerIcon"></i>}
             
            </Col>
            {/* {console.log("rowData",rowData)} */}
            <Col lg="10" md="10" sm="10" className="farmerCardNameDets" style={{height:"80px"}}>
              { rowData.tooltip_text ? 
              
              (<OverlayTrigger key="top" placement="right"
                overlay={<Tooltip id="tooltip_text">{rowData.tooltip_text}</Tooltip>}>

              <h4 className="farmerListCardHeading dvaraBrownText">
                {rowData.first_name} <small className="dvaraBrownText" style={{fontWeight:"bold"}}>({rowData.is_member ? "Member" : "Non-member"})</small>
              </h4>

              </OverlayTrigger>) : <h4 className="farmerListCardHeading dvaraBrownText">
                {rowData.first_name} <small className="dvaraBrownText" style={{fontWeight:"bold"}}>({rowData.is_member ? "Member" : "Non-member"})</small>
              </h4>}
             <br />
              <h6 className="farmerListCardHeading dvaraBrownText" style={{marginTop:"-10px"}}> 
                {rowData.last_name} -- <small style={{color:"black"}}>{rowData.phone}</small>
              </h6><br />
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="dvaraGreenText"
                style={{marginTop:"1px"}}
              ></FontAwesomeIcon>
              <span className="farmersVillageName">&nbsp;

                {rowData.village} {rowData.village.length > 0 && rowData.district_name && ','} {rowData.district_name}
              </span>
            </Col>
          </Row>
        </Col>&nbsp;&nbsp;
        <Col lg="3" md="3" sm="3" className="noPadding">
          <Row className="noPadding">
            <Col lg="1" md="1" className="noPadding">
              <i className="frIcon" title="Field Representative"></i>
            </Col>&nbsp; &nbsp;
            <Col lg="9" md="9" sm="9" className="noPadding">
              <h4 className="farmerListSubHeading dvaraBrownText">
                &nbsp; &nbsp;
                {rowData.fr_name}
              </h4>
              <br />
             <h6 className="farmerListCardHeading dvaraBrownText" style={{marginBottom:"10px"}}>Caste : </h6>
             <span> {rowData.Caste ? rowData.Caste : "Not updated"}</span>
             &nbsp;&nbsp;&nbsp;
             
              {/* <br />
              <h6 className="farmerListCardHeading dvaraBrownText">Financial product Interest : </h6>
            
                <span>{rowData.interested_for_financial ? retrunFIValue(rowData.interested_for_financial) : "  NA"}</span> */}
              
                 <br />
                 <h6 className="farmerListCardHeading dvaraBrownText">FIGs : </h6>
                 <span> {rowData.FIG ? rowData.FIG : "Not updated"}</span>
                
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

              
              
            </Col>
          </Row>
        </Col>&nbsp;&nbsp;
        <Col lg="2" md="1" sm="1">
        <h6 className="farmerListCardHeading dvaraBrownText" >Special Services : </h6>
                 <span> {rowData.special_services_interested}</span>
                 <br />
                 <OverlayTrigger key="left" placement="left"
          
          overlay={<Tooltip id="farmer_edit" >
          
          <div
            {...props}
            style={{
              // backgroundColor: "#a3c614",
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
           Farmer App Downloaded
          </div>
          
          
          {/* Farmer App Downloaded Status */}
          </Tooltip>}>
     
         
          <FontAwesomeIcon
         
            icon={faMobileAlt}
            className="dvaraBrownText"
            // className="dvaraGreenText"
          ></FontAwesomeIcon> 
          {/* <h6>
          <FontAwesomeIcon
            style={{marginBottom:"10px"}}
            icon={faMobileAlt}
            className="dvaraBrownText"
            className="dvaraGreenText"
          ></FontAwesomeIcon>
           &nbsp;<span>Yess/No</span>
          </h6> */}
        </OverlayTrigger>
        <span className="farmersVillageName" style={{marginTop:"-10px"}}>
     
            {/* &nbsp; Yes/No */}

            &nbsp;&nbsp;{rowData.app_downloaded }
             </span>
        </Col>
        <Col lg="2" md="3" sm="3" className="noPadding">
          <Row className="noPadding">
            <Col lg="2" md="2" className="noPadding dvaraBrownText" >
              <b>Crops : </b>
              {/* <Col style={{color:"black"}} className="noPadding crops-join">
                {rowData.crops ? rowData.crops.join(", ") : "NA"}</Col> */}
            </Col>
            <Col lg="10" md="10" sm="10" className="noPadding crops-join">
            &nbsp;&nbsp;&nbsp;{rowData.crops ? rowData.crops.join(", ") : "NA"}
            </Col>
          </Row>
        </Col>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Col lg="2" md="1" sm="1" className="noPadding farmerCardSiteDetails">
          <br />
          <span className="dvaraBrownText"><b>Total Registered Area:</b></span>&nbsp;{rowData.total_area ? rowData.total_area: 0 } Acres
          <ProgressBar className="farmersRegSiteBar" animated>
            <ProgressBar
              className="farmerRegSiteBarStatus"
              max={rowData.total_number_of_sites}
              now={rowData.registered_sites}
              key={rowData.id}
            />
          </ProgressBar>
          Registered Sites:&nbsp;
          <span className="darkGreenText">
            <b>{rowData.registered_sites}</b>
          </span>
          &nbsp;/&nbsp;
          <span className="dvaraBrownText">{rowData.total_number_of_sites ? rowData.total_number_of_sites : 0}</span>
        </Col>

        {DisableHandle()===true?
            <OverlayTrigger key="top" placement="top"
          
            overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
       
           
            <FontAwesomeIcon
              style={{opacity:"0.4",position:"relative",left:"10px",top:"20px"}}
              icon={faPencilAlt}
              className="dvaraBrownText"
            ></FontAwesomeIcon>
           
          </OverlayTrigger>
         
         
         :<OverlayTrigger key="top" placement="top"
          
            overlay={<Tooltip id="farmer_edit">View / Edit</Tooltip>}>
       
           
            <FontAwesomeIcon
               style={{position:"relative",left:"10px",top:"20px"}}
              icon={faPencilAlt}
              className="dvaraBrownText"
              onClick={() => modalOpen(rowData)}
            ></FontAwesomeIcon>
           
          </OverlayTrigger>
           }
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{DisableHandle()===true?
            <OverlayTrigger key="top2" placement="top"
          
            overlay={<Tooltip id="farmer_edit">Dont't have access</Tooltip>}>
       
           
            <FontAwesomeIcon
              style={{opacity:"0.4",position:"relative",left:"15px",top:"20px"}}
              icon={faMobile}
              className="dvaraBrownText"
            ></FontAwesomeIcon>
           
          </OverlayTrigger>
         
         
         :<OverlayTrigger key="top2" placement="top"
          
            overlay={<Tooltip id="farmer_edit">Change Mobile Number</Tooltip>}>
       
           
            <FontAwesomeIcon
               style={{position:"relative",left:"15px",top:"20px"}}
              icon={faMobile}
              className="dvaraBrownText"
              onClick={() => OtpmodalOpen(rowData)}
            ></FontAwesomeIcon>
           
          </OverlayTrigger>
           }

      </Row>
    );
  }

  let activityMasterList = props.activityMaster
  //  let accessed=props.logged_supervisor
  //  console.log("props.accessed",accessed);
  let farmersData = [];
  let farmerTabCols = [];
  // console.log("props.membership",props.membership)
  // console.log("props",props)
  if (props.farmers === undefined) {
    farmerTabCols = [{ title: "Farmers", field: "first_name" }];
    farmersData = [{ first_name: "No Data Available" }];
  } 
  else if (props.membership===true)
  {
    // console.log("update api",props)
    farmerTabCols = [
      {
        title: "Farmers",
        field: "search_name",
        // formatter: reactFormatter(<MakeMembershipCard/>),

        formatter: reactFormatter(<MakeMembershipCard  EditDisable={props.membership}/>),
        headerFilter: "input",
        headerFilterPlaceholder:'Search',
      },
    ]
    farmersData = props.farmers;

    // return (
    //   <div><MakeMembershipCard props={props} /></div>
    // )
  }
  else {
    farmerTabCols = [
      {
        title: "Farmers",
        field: "search_name",
        // field:  "last_name",
        formatter: reactFormatter(<MakeFarmerCard />),
        headerFilter: "input",
        headerFilterPlaceholder:'Search',
        headerStyle: {
          height: '100px',
        }
      },
    ];
    farmersData = props.farmers;
  //  console.log("checking farmer data",farmersData)
  }
  const headerStyleVals = {
    backgroundColor: "rgba(124, 154, 71, 1)",
    color: "rgba(255, 255, 255, 1)",
  };
  let options = {
    pagination: "local",
    paginationSize: 10,
    paginationButtonCount: 10,
    paginationSizeSelector: [10, 20, 50, 100, 200, 500, true],
    
    };
   
const MaxLengthAgriculture=(act)=>{
  if(act.name==="Buffalo" || act.name==="Cow" || act.name==="Piggery" || act.name==="Goat Rearing")
  return 2
  if(act.name==="Poultry"|| act.name==="Sheep Rearing")
  return 4
  else return
}
const handlePhoneNo=(e)=>{
  // console.log("phone no")
  const re = /^[0-9\b]+$/;
  var phoneno = 0;
  if(e.target.value[0]==6||e.target.value[0]==7|| e.target.value[0]==8 || e.target.value[0]==9)
  {
  if (re.test(e.target.value)) {
    phoneno = e.target.value;
  } else {
      phoneno = "";
  }
  setPhoneNumber(phoneno)
  setPhoneMessage("")
}
else{
  // console.log("check regix",e.target.value[0])
  phoneno = "";
  setPhoneMessage("Mobile Number should start with 6,7,8,9")
    setPhoneNumber("")

}
  //  setPhoneNumber(phoneno)
  //  setPhoneMessage("")
  //  console.log("new regix",e.target.value[0])
 
}
const handleMobileNo=()=>{
  if(verifyphonenumber.length!=10)
  {
   
    setPhoneMessage("Mobile No. should be of 10 digit")
  }
  else{
    setPhoneMessage("")
    setshowMobileloader(true)
    var flag=false;
    // console.log("first verify")
    const data = new FormData();
    data.append("phone", verifyphonenumber);

  //   let data={
  //     "phone":verifyphonenumber,
  //     "template_name":"SENDOTP",
  //     "requested_by":"VC"
  
  // }
   
    UserService.VerifyMobileNumber(data).then(
      (response) => {
          flag = true;
          // console.log("verifymobilenumber", response);
          if(response.data.success)
          {
             
             setUuiId(response.data.uuid)
             setshowMobileloader(false)

                
             
          }
          else{
           
            // console.log("error role exist")
            TriggerAlert(
              "Error",
             response.data.message,
              "error"
          );
          setshowMobileloader(false)

          }
      },
      (error) => {
        // console.log("mobile error")
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
      },
      setTimeout(() => {
          if (flag == false) {
             
              TriggerAlert("Error", "Response Timed out, Please try again", "info");
              this.navigateMainBoard()
          }
      }, 30000)
  );
  }
  

}
const handleverifyOtp=()=>{
  if(verifyOtpnum==="" || verifyOtpnum===null)
  {
 
    setOtpMessage("Enter the valid OTP")
  }
  else{
    setshowOtploader(true)
    setOtpMessage("")
    var flag=false;
    // console.log("UuiId",UuiId)
    let data={

      "uuid":UuiId,
  
      "otp":verifyOtpnum
  
  }
  
 

 UserService.VerifyOtpNumber(data).then(
      (response) => {
          flag = true;
          // console.log("verifyotp", response);
          if(response.data.success)
          {  
            if(response.data.data.verified)
            {
              // console.log("yes i am verified")
              setshowOtploader(false)
              ComplianceAlertMessage(
              
                "OTP Verification Successfull",
              
            );
              setOtpShow(false)
              let data={
                "phone":verifyphonenumber,

              }
              UserService.farmerUpdate(selectedfarmerId, data).then(
                (response) => {
                  // console.log("new response",response)
                  if(response.data.success){
                    //  console.log("updated response with new number",response)
                     var resFarmers = props.farmers.filter(item => item.user_ptr_id !== selectedfarmerId);
                     resFarmers.unshift(response.data.data);
                     props.updatefarmers(resFarmers)
                    
                    }
                })

            }
          
              
              
            
            else{
             setOtpMessage("Invalid OTP/ OTP Expired")
             setshowOtploader(false)

           

            }
          }
       
         
        
      },
      (error) => {
        // console.log("mobile error")
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
      },
      setTimeout(() => {
          if (flag == false) {
            
              TriggerAlert("Error", "Response Timed out, Please try again", "info");
              this.navigateMainBoard()
          }
      }, 30000)
  );
  }
}
const handleOtpClass=()=>{
  // console.log("check UuiId",UuiId)
  if(UuiId==="")
  return "disableOtpClass"
  else 
  return ""
}
const handleMobileClass=()=>{
  if(UuiId==="")
  return ""
  else 
  return "disableOtpClass"
}

const handleOtpCode=(e)=>{
const re = /^[0-9\b]+$/;
   let otp = 0;
   if (re.test(e.target.value)) {
      otp = e.target.value;
   } else {
      otp = "";
   }

   setOtpNum(otp)
   setOtpMessage("")

}
  const updateFarmer = () => {
    setisFarmerUpdating(true)
    setsitesGreater(false)
    
    const serviceObj = [ ...servicesData]
    const activityObj =  [...farmerActivityData]
    const editFarmerObj = {...farmerEditObject}
    const farmerEditOptions =  {...farmerEditObject}
    let validNumber = true
  
    if(editFarmerObj.changed_number.length > 0 && editFarmerObj.changed_number.length < 10){    
      setwrongChanged(true)
      validNumber = false
    }
    if(editFarmerObj.phone.length > 0 && editFarmerObj.phone.length < 10){
      setwrongPhone(true)
      validNumber = false
      
    }
    
    if(!validNumber){
      setisFarmerUpdating(false)
      // alert("Enter a Valid Number")
      // return null
     
      AlertMessage("Enter a Valid Mobile Number","warning");

      return null

    }
    // if(editFarmerObj.total_number_of_sites>=25 || editFarmerObj.total_number_of_sites==="")
    // { 
    //   let sitemessage=" Total Sites should be less then 25 & mandatory to fill"
    //   AlertMessage(sitemessage,"warning");
    //   setsitesGreater(true);
    //   setisFarmerUpdating(false) 
    //   return null   
    // }
    // console.log("edit",rowDetail,"editFarmerObj",editFarmerObj)
    if(parseInt(editFarmerObj.age)<15)
    {
      let sitemessage="Age should be greater then 15"
      AlertMessage(sitemessage,"warning");
     
      setisFarmerUpdating(false) 
      return null   
    }
     if(editFarmerObj.agriculture_experince>parseInt(setage) || editFarmerObj.agriculture_experince>parseInt(rowDetail.age)||parseInt(editFarmerObj.age)<parseInt(rowDetail.agriculture_experince))
    { 
      // console.log("first",editFarmerObj.age<rowDetail.agriculture_experince)
      // console.log("editFarmerObj",editFarmerObj,"hasg",editFarmerObj.agriculture_experince,"ageGreater",setage ,"next",editFarmerObj.agriculture_experince,"default",rowDetail.age,"editFarmerObj.age",editFarmerObj.age)
      let sitemessage="Experience cannot be greater then age"
      AlertMessage(sitemessage,"warning");
     
      setisFarmerUpdating(false) 
      return null   
    }
    // console.log("editFarmerObj",editFarmerObj,"rowDetail.registered_sites",rowDetail.registered_sites)
    if(editFarmerObj.total_number_of_sites && rowDetail.registered_sites > editFarmerObj.total_number_of_sites){
      var errorText = "Make sure Total no.of sites ( " + editFarmerObj.total_number_of_sites + 
        " ) should be greater then Registered Site( "+ rowDetail.registered_sites +" ) count"

        AlertMessage(errorText,"warning");
        
      
      setisFarmerUpdating(false)      
      return null
    }
    const trimdactivityObjs = activityObj.filter(function(othobj) { return othobj.seleted})
    const checktrimdactivityObjs =  trimdactivityObjs.filter(function(othobj) { 
        return (othobj.count_units == 'number' || othobj.count_units == 'acres') && !othobj.count_value})
    if (checktrimdactivityObjs.length > 0){
      var result = checktrimdactivityObjs.map(({ name }) => name).join(', ')
      AlertMessage("Please Enter the value/s for "+ result,"warning");
      setisFarmerUpdating(false)  
      return null
    }
    
    const trimserviceObjs = serviceObj.filter(function(othobj) { return othobj.selected})
    const serviceOriginal = eval(rowDetail.financial_services)
    const original = eval(rowDetail.agri_activities)
    if(trimdactivityObjs.length > 0){
      trimdactivityObjs.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)
      if (original){
        original.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1)
      }
      if (JSON.stringify(trimdactivityObjs) !== JSON.stringify(original)){
          editFarmerObj.agri_activities = JSON.stringify(trimdactivityObjs)
      }else{
          delete editFarmerObj.agri_activities
      }
    }
    else if (original){
      editFarmerObj.agri_activities = "[]"
    }
    else
      delete editFarmerObj.agri_activities
    
    if(trimserviceObjs.length > 0){
      trimserviceObjs.sort((a, b) => (parseInt(a.services_id) > parseInt(b.services_id)) ? 1 : -1)
      if (serviceOriginal){
        serviceOriginal.sort((a, b) => (parseInt(a.services_id) > parseInt(b.services_id)) ? 1 : -1)
      }
      if (JSON.stringify(trimserviceObjs) !== JSON.stringify(serviceOriginal)){
          editFarmerObj.financial_services = JSON.stringify(trimserviceObjs)
      }
      // else{
      //     delete editFarmerObj.financial_services
      // }
    }
    // else if (serviceOriginal){
    //   editFarmerObj.financial_services = []
    // }
    else
      editFarmerObj.financial_services = []

    
    setEditObject(editFarmerObj)
    Object.keys(editFarmerObj).forEach(k => (k !== "changed_number" && !editFarmerObj[k] && editFarmerObj[k] !== undefined) && delete editFarmerObj[k]);
    if(Object.keys(editFarmerObj).length > 1 || 
        changedNumber !== editFarmerObj.changed_number){
        // console.log("editFarmerObj response",editFarmerObj)
      UserService.farmerUpdate(selectedfarmerId, editFarmerObj).then(
        (response) => {
          // console.log(response)
          if(response.data.success){
            var resFarmers = props.farmers.filter(item => item.user_ptr_id !== selectedfarmerId);
           
            resFarmers.unshift(response.data.data);
            props.updatefarmers(resFarmers)
           
            setEditObject(farmerEditoptions)
            setDisable(false)
            setisFormDisabled(true)
            setisEdit(false)
            setShow(false)
            setisFarmerUpdating(false)
          }
          else{

            // alert("Mobile Number Already Exists")
           
            AlertMessage("Mobile Number Already Exists","warning");

            setEditObject(farmerEditOptions)
            setisFarmerUpdating(false)
          }
        },
        (error) => {
          // console.log(error)
          // alert("Please Try Again")
          
          AlertMessage("Please Try Again","error");

          setisFarmerUpdating(false)
          setEditObject(farmerEditOptions)
        }
      )
      
    }
    else{
      // alert("Nothing can be updated")
     
      AlertMessage("Nothing can be updated ","warning");
      setEditObject(farmerEditObject)

      setisFarmerUpdating(false)
    }
    // let editFarmerData = 
  }
  return (
    <div className="wrap pad5">
    
      <Modal show={modalShow}
        onHide={modalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered /* onEntered={modalLoaded} */
        className="modal-adjust"
      >
        <Modal.Header>
          <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText"><b>Farmer Details</b></span></Modal.Title>
        </Modal.Header>        
        <Modal.Body >
          <div className="farmersUploadWrap">

            <Form encType="multipart/form-data"
              method="post"
              name="fileinfo"
              disabled="disabled">
               <fieldset disabled={isFormDisabled ? "disabled" : ""}>
                 
                  
              <Row className="mb-3">
                
              <div style={{height:"100px",width:"130px",border:"1px solid black",borderRadius:"50%"}}>
              {rowDetail.presigned_url!=null?
              (<img src={rowDetail.presigned_url} className="farmer-photo" alt="photo" onClick={handleImageClick}/>)
                :                 
              ( rowDetail.gender===2? <img src={farmerfemale} style={{height:"80px",width:"110px",marginLeft:"8px",marginTop:"6px"}} alt="photo" onClick={handleImageClick}/>
              : <img src={farmerIcon} style={{height:"70px",width:"120px",marginTop:"10px",marginLeft:"5px"}} alt="photo" onClick={handleImageClick} />)
              }
              <MyModal
               showModal={showModal}
               setShowModal={setShowModal}/>
                </div>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>First Name</b></Form.Label>
                  <Form.Control type="text" placeholder="First Name"
                  maxLength={30}
                    value={rowDetail.first_name}
                    onChange={(e) => onChangeData(e, "first_name")}
                  />
                </Form.Group>

                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Last Name</b></Form.Label>
                  <Form.Control type="text" placeholder="Last Name" value={rowDetail.last_name}
                    maxLength={30}

                    onChange={(e) => onChangeData(e, "last_name")} />
                </Form.Group>
               
              </Row>
              <Row className="mb-3">
              <Form.Group as={Col} >

                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Gender</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={rowDetail.gender}
                    custom
                    onChange={(e) => onChangeData(e, "gender")}
                  >
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Others</option>

                  </Form.Control>
                  </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Mobile Number</b></Form.Label>
                  <Form.Control type="text" placeholder="Mobile" 
                  value={rowDetail.phone}
                  maxLength={10}

                  onChange={(e) => onChangeData(e, "phone")} disabled/>
                  {wrongPhone ? 
                  <span style={{color: "red"}}>Not a valid number</span> : ""}
                  
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Alternate Mobile Number</b></Form.Label>
                  <Form.Control type="text" maxLength={10} placeholder="Number"
                  value={rowDetail.alternate_contact_number}

                  onChange={(e) => onChangeData(e, "alternate_contact_number")}

                  
                  />
                   <p className="requiredfields">{AlternatePhoneMessage}</p>
                </Form.Group>
                
              </Row>
              <Row className="mb-3">
                 <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>Caste</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={rowDetail.caste_id}
                    custom
                    onChange={(e) => onChangeData(e, "caste_id")}
                  >
                    <option value=''>Choose</option>
                     {category?.map(category => (
                        <option value={category.id}>{category.caste_name}</option>
                      ))}

                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>Farmer Interest Group</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={rowDetail.farmer_fig_id}
                    custom
                    onChange={(e) => onChangeData(e, "farmer_fig_id")}
                  >
                    <option value=''>Choose</option>
                     {figList?.map(figList => (
                        <option value={figList.id}>{figList.name_of_fig}</option>
                      ))}

                  </Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-3">
              <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>No. of Shares Alloted</b></Form.Label>
                  <Form.Control type="text" placeholder="No. of Shares Alloted" 
                  value={parseInt(rowDetail.shared_alloted) == 0 ? (''):(rowDetail.shared_alloted)}
                  maxLength={3}

                  onChange={(e) => {
                    if(parseInt(e.target.value) >= 0 && parseInt(e.target.value) < 1000){
                      onChangeData(e, "shared_alloted")
                    }
                    else {
                      e.target.value = 0
                      onChangeData(e, "shared_alloted")
                    }
                    }} />
                                    
                </Form.Group>                
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>Total Share Value(Paid) Rs.</b></Form.Label>                  
                  <Form.Control type="text" placeholder="Rs .Total Share Value(Paid)" 
                  // value={rowDetail.total_share_value}
                  value={parseInt(rowDetail.total_share_value) == 0 ? (''):(rowDetail.total_share_value)}
                  maxLength={5}  
                  onChange={(e) => {
                    if(parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 99999){
                      onChangeData(e, "total_share_value")

                    }
                    else {
                      e.target.value = 0
                      onChangeData(e, "total_share_value")
                    }
                    
                    }}
                  />
                </Form.Group>

              </Row>
              <Row className="mb-3">
              <Form.Group as={Col} >

                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Is Member</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={ String(rowDetail.is_member) == String(true) ? "true": String(rowDetail.is_member) == String(false) ? "false": ""}
                    
                    custom
                    onChange={(e) => onChangeData(e, "is_member")}
                  >
                    {/* <option value="">Unknown</option> */}
                    <option value="true">Yes</option>
                    <option value="false">No</option>

                  </Form.Control>
                  </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>DOB</b></Form.Label>
                  <Form.Control type="date" placeholder="DOB"
                  value={rowDetail.dob}
                  onChange={(e) => onChangeData(e, "dob")} />
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Age(Years)</b></Form.Label>
                  <Form.Control type="number"
                    value={rowDetail.age}
                    maxLength={2}

                    onChange={(e) => onChangeData(e, "age")}
                    placeholder="Age" />
                       {ageGreater===true?
                  <p className="requiredfields" >Age cannot be greater then 100 and should be a valid number</p>
                  :""}
                </Form.Group>
                
                
              </Row>
          
              <Row className="mb-3">
                 <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Father Name</b></Form.Label>
                  <Form.Control type="text" placeholder="Father Name"
                  value={rowDetail.father_name}
                  maxLength={30}

                  onChange={(e) => onChangeData(e, "father_name")} />
                </Form.Group>
                {/* <Form.Group as={Col} >
                  <Form.Label>Suggested Number</Form.Label>
                  <Form.Control type="text" placeholder="Suggested Number"
                    value={rowDetail.changed_number ? rowDetail.changed_number : ""}
                    onChange={(e) => onChangeData(e, "changed_number")}
                  />
                  {wrongChanged ? 
                  <span style={{color: "red"}}>Not a valid number</span> : ""}
                </Form.Group> */}

                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Total Sites</b></Form.Label>
                  <Form.Control type="number" placeholder="Total Sites"
                    value={rowDetail.total_number_of_sites}
                    onChange={(e) => onChangeData(e, "total_number_of_sites")}
                  />
                  {sitesGreater===true?
                  <p className="requiredfields" >Sites should be less then 25 and cannot be negative</p>
                  :""}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>State</b></Form.Label>
                  <Form.Control type="text" placeholder="State"
                    value={rowDetail.state_eng_name}
                    disabled/>
                </Form.Group>

                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>District</b></Form.Label>
                  <Form.Control type="text" placeholder="District"
                    value={rowDetail.distName}
                    disabled
                    />
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Village</b></Form.Label>
                  <Form.Control type="text" placeholder="Village"
                    value={rowDetail.village}
                    disabled
                    />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Block</b></Form.Label>
                  <Form.Control type="text" placeholder="Block"
                    value={rowDetail.block_name ? rowDetail.block_name : ""}
                    disabled
                    />
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>PIN Code</b></Form.Label>
                  <Form.Control type="number" placeholder="PIN Code"
                  value={rowDetail.pincode ? rowDetail.pincode : ""}
                    // onChange={(e) => onChangeData(e, "village")}
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Language</b></Form.Label>
                  <Form.Control type="text" placeholder="preferred_language"
                  value={rowDetail.preferred_language}
                  disabled
                  />
                </Form.Group>


              </Row>
              <Row className="mb-3">
              <Form.Group as={Col} >

                <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Education</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={rowDetail.education ? rowDetail.education : "" }
                    custom
                    onChange={(e) => onChangeData(e, "education")}
                  >
                    <option value="">Unknown</option>
                    <option value="No Formal Education">No Formal Education</option>
                    <option value="Below 5th">Below 5th</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Above Graduation">Above Graduation</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Agricultural Experience(Yrs)</b></Form.Label>
                  <Form.Control type="text" maxLength={2} placeholder="Agricultural Experience"
                  value={rowDetail.agriculture_experince ? rowDetail.agriculture_experince : ""}

                  onChange={(e) => onChangeData(e, "agriculture_experince")}

                  
                  />
                    {aggriculturegreater===true?
                  <p className="requiredfields" >Experience cannot be greater then age</p>
                  :""}
                </Form.Group>

                <Form.Group as={Col} >

                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Stay at Village</b></Form.Label>
                  <Form.Control
                    as="select"
                    // size="sm"
                    value={rowDetail.residential_stability ? rowDetail.residential_stability : ""}
                    custom
                    onChange={(e) => onChangeData(e, "residential_stability")}
                  >
                    <option value="">Unknown</option>                    
                    <option value="1">Less Than 5 years</option>
                    <option value="2">Above 5 years</option>

                  </Form.Control>
                  </Form.Group>
                  

              </Row>
              <Row>
              <Form.Group as={Col} >

                <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Ownership of House</b></Form.Label>
                <Form.Control
                  as="select"
                  // size="sm"
                  value={rowDetail.residential_status ? rowDetail.residential_status : ""}
                  custom
                  onChange={(e) => onChangeData(e, "residential_status")}
                  >                
                  <option value="">Unknown</option>
                  <option value="1">Owned</option>
                  <option value="2">Rented</option>

                </Form.Control>
                </Form.Group>
                {/* <Form.Group as={Col} >

                <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>Financial product interest</b></Form.Label>
                <Form.Control
                  as="select"
                  // size="sm"
                  value={ String(rowDetail.interested_for_financial) == String(true) ? "true": String(rowDetail.interested_for_financial) == String(false) ? "false": ""}
                  
                  custom
                  onChange={(e) => onChangeData(e, "interested_for_financial")}
                >
                  <option value="">Unknown</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>

                </Form.Control>
                </Form.Group> */}
                 <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"97%"}}><b>Not able to connect Farmer:</b></Form.Label>
                  <Form.Control
                        as="select"
                        // size="sm"
                        value={ String(rowDetail.farmer_nonaccessibility) == String(true) ? "true": String(rowDetail.farmer_nonaccessibility) == String(false) ? "false": ""}
                        custom
                        onChange={(e) => onChangeData(e, "farmer_nonaccessibility")}

                      >
                        <option value="">Unknown</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                       
                      </Form.Control>
                </Form.Group>
              </Row>

              <h5 className="dvaraBrownText">Agri Allied Activities</h5>
            
{/* 
               <Row>
                 <Form> */}
                  {
                    farmerActivityData.map((act, index) => {
                      return (
                        <Row className="align-items-center" key={index}>
                          <Col sm={1}></Col>

                          <Col sm={5} className="my-1">
                            <Form.Check type="checkbox" id="autoSizingCheck2" style={{fontSize:"97%"}}
                            disabled={disabled && !act.name.includes("No Agricultural") ? "disabled": ""} 
                            label={act.name} 
                            onChange={(e)=> activityChange(e, act, index, "checkbox")} checked={act.seleted}/>
                          </Col>
                          {(act.count_value || act.seleted) && act.count_units ? (
                          <Col sm={3} className="my-1">   
                          {/* {console.log("hii",act,act.seleted,act.count_units)  }                          */}
                            <Form.Control id="inlineFormInputName" style={{height:"27px"}} placeholder="Enter Value*" 
                              value={act.count_value && act.count_value !== "undefined" ? act.count_value : ""}
                              maxLength={MaxLengthAgriculture(act)}
                              onChange={(e)=> activityChange(e, act, index, "countvalue")}/>                           
                          </Col>) : <Col sm={3} className="my-1"><Form.Control id="inlineFormInputName" style={{display: "none"}}/> </Col>  }
                          {(act.count_value || act.seleted) && act.count_units ? (
                          <Col sm={2} className="my-1">                              
                            {act.count_units}
                          </Col>): <Col sm={3} className="my-1"><Form.Control id="inlineFormInputName" style={{display: "none"}}/> </Col>}
                        
                        </Row>

                      )
                    })
                  }  
                  {/* </Form>
                </Row> */}
                  
                  <h5 className="dvaraBrownText">Special Services</h5>
                  <h6 style={{marginLeft:"60px"}} className="dvaraBrownText">Services</h6>
                  <h6 style={{marginLeft:"300px",marginTop:"-22px"}} className="dvaraBrownText">Category</h6>
                  {
                    servicesData.map((service, index) => {
                      
                      return (
                       
                        <Row className="align-items-center" key={index}>
                          <Col sm={1}></Col>
                          <Col sm={4} className="my-1">
                            <Form.Check type="checkbox" id="autoSizingCheck2" checked={service.selected}
                            onChange={(e)=> serviceChange(e, service, index)} style={{fontSize:"91%"}}
                            disabled={servicedisabled && !service.services__service_name.includes("Not Interested") ? "disabled": ""} 
                            label={service.services__service_name} 
                           />
                          </Col>  
                          <Col sm={5} className="my-1">  
                            
                            {service.services__service_category__category_name.includes("Not Interested") ? "": service.services__service_category__category_name}
                          </Col>
                        </Row>
                      )

                    })
                  }

        </fieldset>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={() => enableEdit(isEdit)}  align="left"
              // className="fa-pull-left defaultButtonElem" 
              className={showButtonHiddenClass()} 

              // disabled={memberEditDisable}
               >{isEdit ? "View": "Edit"}
              
              </Button>
        &nbsp;&nbsp;&nbsp;
        { isEdit ? 
        (
        <Button
                onClick={updateFarmer}
                disabled={isFarmerUpdating}
                className="fa-pull-right defaultButtonElem"
              >
                <div className="formUpLoadSpinnerWrap">
                  {isFarmerUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </div>
                Save
              </Button>
        ) : ""}
              &nbsp;&nbsp;&nbsp;
          <Button onClick={modalClose} className="fa-pull-right defaultButtonElem">Close</Button>
          <span className="clearfix"></span>

        </Modal.Footer>
      </Modal>
      <Modal show={OtpmodalShow}
        onHide={OtpmodalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered /* onEntered={modalLoaded} */
        className="modal-adjust"
      >
        <Modal.Header closeButton>
          <Modal.Title>&nbsp;&nbsp;<span className="dvaraBrownText"> Change Mobile Number</span></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding:"20px"}}>
          <h6 style={{marginLeft:"25px"}} className="dvaraBrownText">Current Mobile Number : &nbsp;&nbsp;{showCurrentNumber}</h6>
          <Row style={{marginLeft:"10px",marginTop:"20px"}}
           className={handleMobileClass()}
          >
          <Col  md="5">
         <input type="text" maxlength="10"  className="inputFieldOtp" style={{height:"35px"}}
           onChange={handlePhoneNo}  
        value={verifyphonenumber} 
         />
         <p className="requiredfields">
                    {verifyphonemessage}
                      </p>
         </Col>

         <Col  md="4"> 
       
         <button className="slide_from_left" 
         onClick={handleMobileNo}
         style={{width:"72%"}}
         >
          Verify Mobile
         <span></span><span></span><span></span><span></span>

         </button>
         {showMobileloader?
     
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>

          :""
          
         }
 </Col>
          </Row>

           
        <Row  style={{marginLeft:"10px",marginTop:"14px"}} 
          className={handleOtpClass()}
        >
     
         <Col  md="5">
         <input 
         style={{height:"35px"}}
         className="inputFieldOtp"
         value={verifyOtpnum}
          onChange={handleOtpCode}
             ></input>
              <p className="requiredfields">
                        {verifyOtpMessage}
                      </p>
         </Col>
         <Col md="4">
         <button className="slide_from_left" style={{width:"74%"}} 
         onClick={handleverifyOtp}
         >Verify OTP
         <span></span><span></span><span></span><span></span>

         </button>
         {showOtploader?
     
     <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>

     :""}
     </Col>
     </Row>
























          </Modal.Body>
          <Modal.Footer>
          <Button onClick={OtpmodalClose} className="fa-pull-right defaultButtonElem">Close</Button>
            </Modal.Footer>
          </Modal>
      <Modal
                      show={showMember}
                      onHide={hideMemberModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header style={{backgroundColor:"rgba(163, 198, 20, 0.7)"}}>
                        <Modal.Title id="contained-modal-title-vcenter"> 
                         <span className="dvaraBrownText">Rejected </span>
                        </Modal.Title>
                      </Modal.Header>
                    <Modal.Body style={{backgroundColor:"aliceblue",border:"1px solid rgba(163, 198, 20, 1)",borderRadius:"20px",width:"91%",margin:"auto",marginTop:"20px"}}>
                      <Row style={{padding:"10px"}}>
                    <Col md={12} className="" >
                                            <Form>    
                                              {/* <Row>                                              
                                                    <Form.Group as={Col} 
                                                     style={{position:"relative",left:"2%"}}
                                                     controlId="formHorizontalUnits" >
                                                        <Form.Label column="sm" lg={5} className="dvaraBrownText"><strong>Are you sure ? </strong></Form.Label>
                                                        <Col sm={5}>
                                                        <Form.Check
                                                        
                              value={this.state.businessdeal}
                              className={this.state.businessdealclass}
                              onChange={this.handleBusinessDeal}
                              checked={this.state.businessdeal}
                            />
                                                           <Form.Control
                                                                as="select"
                                                                size="sm"
                                                                custom
                                                                onChange={SelectMember}
                                                                className={InterestedFarmerMandatory?"mandatoryfields":""}
                                                               style={{ border:"1px solid ridge"}}
                                                            >
                                                                <option value="">--Select--</option>
                                                                <option value="1" >Yes</option>
                                                                <option value="2">No</option>
                                                            </Form.Control> 
                                                        </Col> 
                                                    </Form.Group>
                                                     <Form.Group as={Col} 
                                                     style={{position:"relative",left:"2%"}}
                                                     controlId="formHorizontalUnits" >
                                                        <Form.Label column="sm" lg={5} className="dvaraBrownText"><strong>Status: </strong></Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control
                                                                as="select"
                                                                size="sm"
                                                                custom
                                                                onChange={SelectMemberStatus}
                                                                className={InterestedFarmerMandatory?"mandatoryfields":""}

                                                                style={{ border:"1px solid ridge"}}>
                                                                <option  disabled selected>Pending</option>
                                                                <option value="Accepted" >Accepted</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </Form.Control>
                                                        </Col>
                                                        {InterestedMessage?<div className="requiredfields">Select Status</div>:""}
                                                    </Form.Group> 
                                                    </Row> */}
                                                       <Form.Group
                            as={Row}
                            style={{position:"relative",left:"25px"}}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Are you sure ?
                            </Form.Label>
                            <Col sm={6}>
                            <Form.Check
                              onChange={handleSureCheckbox}
                              checked={checkboxStatus}
                              // className={this.state.businessdealclass}
                            />
                            </Col>
                          </Form.Group>
                                                </Form>
                                            </Col>
                                            </Row>
                                            <Row>
                                            <Col md="10">
                                            <Form.Group controlId="formGridAddress1 " style={{position:"relative",left:"5%"}}>
                    <Form.Label>
                      <strong className="update-TextColor remarksposition">Remarks</strong>
                    </Form.Label>
                    <Form.Control
                    style={{position:"relative",border:"1px solid ridge",padding:"10px",marginLeft:"10px"}}
                      as="textarea"
                      onChange={SelectMemberRemarks}
                      className={InterestedFarmerMandatory?"mandatoryfields":""}

                      placeholder="Remarks"
                      >
                      </Form.Control>
                  </Form.Group>
                  {InterestedFarmerMandatory?<div className="requiredfields" style={{float:"right"}}>Please fill the Required Details</div>:""}
                  </Col>
                  </Row>
                    </Modal.Body>
                      <Modal.Footer style={{marginTop:"20px"}}>
                     {checkboxStatus?
                      <Button
                          variant="success"
                          onClick={updateInterestedFarmerStatus}
                        > 
                          <FontAwesomeIcon
                              icon={faSave}
                              className="dvaraBrownText"
                              title="Save Edits"
                              style={{color:"white"}}
                            />&nbsp;
                         Save
                        </Button>
                        :""}

                      
                        <Button variant="danger" onClick={hideMemberModal}>
                        <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="dvaraBrownText"
                              title="Save Edits"
                              style={{color:"white"}}

                            />&nbsp;
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Modal
                      show={showMemberAccepted}
                      onHide={hideMemberAcceptModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header style={{backgroundColor:"rgba(163, 198, 20, 0.7)"}}>
                        <Modal.Title id="contained-modal-title-vcenter"> 
                         <span className="dvaraBrownText">Accepted </span>
                        </Modal.Title>
                      </Modal.Header>
                    <Modal.Body style={{backgroundColor:"aliceblue",border:"1px solid rgba(163, 198, 20, 1)",borderRadius:"20px",width:"91%",margin:"auto",marginTop:"20px"}}>
                      <Row > <h6 style={{marginLeft:"35px",marginBottom:"20px"}}>Farmer Interested to be a member : <span className="dvaraBrownText">{MemberInterestStatus?"Yes" :"No"}</span></h6> </Row>
                                            <Row>
                                            <Col md="10">
                                            <Form.Group controlId="formGridAddress1 " style={{position:"relative",left:"5%"}}>
          <div onChange={handleMemberChange}>         
          <input type="radio" id="Member" name="fav_language" value="Member" onChange={() => setIsChecked(true)}/>
          <label for="Member"style={{marginLeft:"10px"}}>Member</label>
          <input type="radio" id="Non Member" name="fav_language" value="Non Member" style={{marginLeft:"20px"}} onChange={() => setIsChecked(false)}/>
          <label for="Non Member" style={{marginLeft:"10px"}} >Non Member</label>  
          </div>               
          { isChecked  ?                
          <>
          <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>No. of Shares Alloted</b></Form.Label>
                  <Form.Control type="text" placeholder="No. of Shares Alloted" 
                  value={parseInt(rowDetail.shared_alloted) == 0 ? (''):(rowDetail.shared_alloted)}
                  maxLength={3}

                  onChange={(e) => {
                    if(parseInt(e.target.value) > 0 && parseInt(e.target.value) < 1000){
                      setChanged(e.target.value)
                    }
                    else {
                      e.target.value = ''
                      setChanged(e.target.value)
                    }
                    }} />
                                    
                </Form.Group>  

                <Form.Group as={Col} >
                  <Form.Label className="dvaraBrownText" style={{fontSize:"95%"}}><b>Total Share Value(Paid) Rs.</b></Form.Label>                  
                  <Form.Control type="text" placeholder="Rs .Total Share Value(Paid)" 
                  // value={rowDetail.total_share_value}
                  value={parseInt(rowDetail.total_share_value) == 0 ? (''):(rowDetail.total_share_value)}
                  maxLength={5}  
                  onChange={(e) => {
                    if(parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 99999){
                      // onChangeData(e, "total_share_value")
                      setFigChanged(e.target.value)
                    }
                    else {
                      e.target.value = ''
                      setFigChanged(e.target.value)
                    }
                    
                    }}
                  />
                </Form.Group>


          {/* <div style={{display:"flex"}}>
          <h6 style={{marginBottom:"20px",marginTop:"10px",marginLeft:"-10px"}}>No. of Shares Allotted : </h6>
          <input type="text" 
                        style={{width:"20%",padding:"5px",border: "1px solid #ced4da",height:"30px",borderRadius:"5px",marginLeft:"45px",marginTop:"10px"}}                       
                          maxLength={3}
                        onChange={SelectNoOfShares} />     
          </div>           */}

          {/* <div style={{display:"flex"}}>
          <h6 style={{marginBottom:"20px",marginLeft:"-10px"}}>Total Shares Value : </h6>
          <input type="text" onChange={SelectNoOfValue}
           style={{width:"20%",padding:"5px",border: "1px solid #ced4da",height:"30px",marginLeft:"70px",borderRadius:"5px"}}
           maxLength={5}  />         
          </div> */}
          </>
           : ''}
           
                  </Form.Group>
                  </Col>
                  </Row>
                    </Modal.Body>

                      <Modal.Footer style={{marginTop:"20px"}}>
                      {InterestedFarmerMandatory?<div className="requiredfields">Please select the Status</div>:""}

                      <Button
                          variant="success"
                          onClick={handleAcceptedSave}
                        > 
                          <FontAwesomeIcon
                              icon={faSave}
                              className="dvaraBrownText"
                              title="Save Edits"
                              style={{color:"white"}}
                            />&nbsp;
                         Save
                        </Button>
                      
                        <Button variant="danger" onClick={hideMemberAcceptModal}>
                        <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="dvaraBrownText"
                              title="Save Edits"
                              style={{color:"white"}}

                            />&nbsp;
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

      <ReactTabulator
        columns={farmerTabCols}
        height="auto"
        // rowClick={rowClick}
        data={farmersData}
        // data={initFarmersData}        
        options={options}
        // tooltips={true}
        placeholder="No Data Available"
        ajaxLoader={true}
        ajaxLoaderLoading="updating data"
      />
    </div>
  );
};
                  
export default Table;
