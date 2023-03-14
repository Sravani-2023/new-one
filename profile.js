import React, { Component } from "react";
import "../assets/css/profile.css";
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
} from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import UserService from "../services/user.service";
// import "../index.css";
import { TriggerAlert } from "./dryfunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import annual_meeting from "../assets/img/annual_meeting.jpg";
import board from "../assets/img/board.png";
import special_meeting from "../assets/img/special_meeting.png";


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  faMapMarkerAlt,
  faPencilAlt,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
    faEnvelope,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { data } from 'jquery';

function shareCapitalYears(year){
  const currentYear = new Date().getFullYear()
  return currentYear - parseInt(year)

}
//used class components .
export default class Profile extends Component {
  constructor() {
    super();

    const thisYear = new Date().getFullYear();   //this varibale is giving year , date, month and time.
    //binding of all the functions with this.
    this.handleCeoName = this.handleCeoName.bind(this);
    this.handleCeoPhone = this.handleCeoPhone.bind(this);
    this.handleCeoMonth = this.handleCeoMonth.bind(this);
    this.handleCeoYear = this.handleCeoYear.bind(this);
    this.handleDirecName = this.handleDirecName.bind(this);
    this.handledirecPhone = this.handledirecPhone.bind(this);
    this.handledirecGender = this.handledirecGender.bind(this);
    this.handledirecVillage = this.handledirecVillage.bind(this);
    this.handledirecPriority = this.handledirecPriority.bind(this);
    this.handleBankName = this.handleBankName.bind(this);

    this.handleHolderName = this.handleHolderName.bind(this);

    this.handleAccountNumber = this.handleAccountNumber.bind(this);

    this.handleBankIfsc = this.handleBankIfsc.bind(this);
    this.handleContactName = this.handleContactName.bind(this);
    this.handleBankBranch = this.handleBankBranch.bind(this);
    this.handleContactNumber = this.handleContactNumber.bind(this);
    this.handleContactDepartment = this.handleContactDepartment.bind(this);
    this.handleOtherCount = this.handleOtherCount.bind(this);
    this.handleStaffCount = this.handleStaffCount.bind(this);
    this.handleAccountantCount = this.handleAccountantCount.bind(this);
    this.handleFrCount = this.handleFrCount.bind(this);
    this.handleCeoCount = this.handleCeoCount.bind(this);
    this.handleAddDirecName = this.handleAddDirecName.bind(this);
    this.handleAdddirecPhone = this.handleAdddirecPhone.bind(this);
    this.handleAdddirecGender = this.handleAdddirecGender.bind(this);
    this.handleAdddirecVillage = this.handleAdddirecVillage.bind(this);
    this.handleAdddirecPriority = this.handleAdddirecPriority.bind(this);
    this.handleBusinessName = this.handleBusinessName.bind(this);
    this.handleBusinessDeal = this.handleBusinessDeal.bind(this);

    this.handleCreateBusinessName = this.handleCreateBusinessName.bind(this);
    this.handleCreateBusinessDeal = this.handleCreateBusinessDeal.bind(this);

    this.handleComplianceMeetingType =
      this.handleComplianceMeetingType.bind(this);
    this.handleComplianceType = this.handleComplianceType.bind(this);
     this.handleCompletionDate = this.handleCompletionDate.bind(this);
    this.handleComplianceMeetingStatus =
      this.handleComplianceMeetingStatus.bind(this);
    this.handleComplianceMeetingDate =
      this.handleComplianceMeetingDate.bind(this);

    this.createComplianceMeetingType =
      this.createComplianceMeetingType.bind(this);
    this.createComplianceType = this.createComplianceType.bind(this);
    this.createComplianceMeetingStatus =
      this.createComplianceMeetingStatus.bind(this);
    this.createComplianceMeetingDate =
      this.createComplianceMeetingDate.bind(this);
      this.handleAddFIGName = this.handleAddFIGName.bind(this);
      this.handleAddFIGVillage = this.handleAddFIGVillage.bind(this);
      this.handleAddFIGRemarks = this.handleAddFIGRemarks.bind(this);
      this.handleFIGName = this.handleFIGName.bind(this);
      this.handleFIGVillage = this.handleFIGVillage.bind(this);
      this.handleFIGRemarks = this.handleFIGRemarks.bind(this);

    this.handleCreateBankName = this.handleCreateBankName.bind(this);

    this.handleCreateHolderName = this.handleCreateHolderName.bind(this);

    this.handleCreateAccountNumber = this.handleCreateAccountNumber.bind(this);

    this.handleCreateBankIfsc = this.handleCreateBankIfsc.bind(this);
  //declared the state variables used in the components.
    this.state = {
      mandatoryList: [],

      EventList: [],
      FinanceList: [],
      miscellaneous: [],
      miscellaneousImg: [],
      modalIsOpen: false,
      CEOmodalIsOpen: false,
      DirectormodalIsOpen: false,
      CreateDirectormodalIsOpen: false,
      fpoDetails: [],
      fpobankdetails: [],
      fpobusiness: [],
      fpoampsmarket: [],
      fpocompilance: [],
      fpocontacts: [],
      fpodirectors: [],
      fpoturnover: [],
      fpoUsingAndroidApp:"",
      // loading: false,
      showloader: true,

      ceo_title: "",
      ceo_phone: "",
      ceo_month: "",
      ceo_year: "",
      direc_name: "",
      direc_phone: "",
      direc_gender: "",
      direc_village: "",
      direc_joining: "",
      priority: "",
      direc_id: "",
      direcnameclass: "",
      direcphoneclass: "",
      direcgenderclass: "",
      direcvillageclass: "",
      direcjoiningclass: "",
      bank: "",
      account_name: "",
      account_number: "",
      bank_branch: "",
      bank_ifsc: "",

      createbank: "",
      createaccount_name: "",
      createaccount_number: "",
      createbank_branch: "",
      createbank_ifsc: "",
      createbankPriority: "",
      bank_id: "",
      thisYear: thisYear,
      selectedYear: thisYear,
      loading: true,
      mean_khetscore: "",
      avg_landholding: "",
      avg_farmer_site: "",
      farmers_count: "",
      contact_name: "",
      contact_department: "",
      contact_number: "",
      ContactmodalIsOpen: false,
      contactclass: "",
      departmentclass: "",
      contactnumberclass: "",
      CreateContactmodalIsOpen: false,
      
      errormessage: "",
      errormessage2: "",
      errormessage3: "",
      errormessage4: "",
      contact_id: "",
      isdateerror: false,
      dateError: "",
      ceo_count: "",
      FR_count: "",
      accountant_count: "",
      staff_count: "",
      other_count: "",
      StaffmodalIsOpen: false,
      adddirec_name: "",
      adddirec_phone: "",
      adddirec_gender: "",
      adddirec_village: "",
      adddirec_joining: "",
      addpriority: "",
      adddirecnameclass: "",
      adddirecphoneclass: "",
      adddirecgenderclass: "",
      adddirecvillageclass: "",
      adddirecjoiningclass: "",
      adddirecpriorityclass: "",
      businessname: "",
      businessnameclass: "",
      businessdeal: "",
      businessdealclass: "",
      CompliancemodalIsOpen: false,
      compliance_meetingtype: "",
      compliance_date: "",
      compliance_status: "",
      compliance_type: "",
      compliance_purpose: "",
      compliance_id: "",
      CreateCompilancemodalIsOpen: false,
      createcompliance_meetingtype: "",
      createcompliance_date: "",
      createcompliance_status: "",
      createcompliance_type: "",
      createcompliance_purpose: "",
      phonefieldmessage: "",
      phonefielddirecaddmessage: "",
      phonefielddirecmessage: "",
      errorceomessage: "",
      ceocnameclass: "",
      ceophoneclass: "",
      contactnumbermessage: "",
      business_id: "",
      createcompliance_meetingtypeclass: "",
      createcompliance_dateclass: "",
      createcompliance_statusclass: "",
      createcompliance_typeclass: "",
      upcompmeetingtypeclass: "",
      upcompdateclass: "",
      upcompstatusclass: "",
      upcomptypeclass: "",
      compilanceupdatemessage: "",
      CreateBankmodalIsOpen: false,
      createbankPriorityclass: "",
      is_contact_edit: false,
      CreationBusinessmodalIsOpen: false,
      createbusinessname: "",
      createbusinessdeal: "",
      completion_date: "",
      upcompletionclass:"",
      isCeoUpdating:false,
      isBankUpdating:false,
      isBankCreating:false,
      isBusinessUpdating:false,
      isBusinessCreating:false,

      isContactCreating:false,
      isContactUpdating:false,
      isDirectorUpdating:false,
      isDirectorCreating:false,
    isCompCreating:false,
    isCompUpdating:false,
    currentYear : shareCapitalYears('0'),
    lastYear : shareCapitalYears('1'),
    lastSecondYear : shareCapitalYears('2'),
    lastThirdYear : shareCapitalYears('3'),
    compliance_min_date : new Date(),
    CreateFIGmodalIsOpen:false,
    FIGmodalIsOpen:false,
    fpofiglist:[],
    isFIGCreating:false,
    isFIGUpdating:false,
      addFIG_name: "",
      addFIG_remarks: "",
      addFIG_village: "",
      addFIGnameclass:"",
      addFIGremarksclass:"",
      addFIGvillageclass:"",
      FIG_name:"",
      FIG_remarks:"",
      FIG_village:"",
      FIGnameclass:"",
      FIGvillageclass:"",
      FIGremarksclass:"",
      FIG_id:"",
    };
  }
  //declared all the compliance functions used. Here we are simply assingning the values to the state variables and giving a class at the same time 
  // which will indicate the error.
  handleComplianceMeetingType = (e) => {
    this.setState({
      compliance_meetingtype: e.target.value,
      upcompmeetingtypeclass: "",
    });
  };
  // assingning the values to the state variables  compliance_date and giving a class at the same time which will indicate weather field is required or not.
  handleComplianceMeetingDate = (e) => {
    this.setState({ compliance_date: e.target.value, upcompdateclass: "" });
  };
  //assingning the values to the state variables compliance_status and giving a class at the same time which will indicate weather field is required or not.
 
  handleComplianceMeetingStatus = (e) => {
    this.setState({ compliance_status: e.target.value, upcompstatusclass: "" });
    
  };
  //assingning the values to the state variables compliance_type and giving a class at the same time which will indicate weather field is required or not.
  
  handleComplianceType = (e) => {
    this.setState({ compliance_type: e.target.value, upcomptypeclass: "" });
  };
  //assingning the values to the state variables completion_date and giving a class at the same time which will indicate weather field is required or not.
  
  handleCompletionDate= (e) => {
    this.setState({ completion_date: e.target.value, completiondataclass: "" });
  };
  //at the time of editing compliance we are disabling majority of fields if it is not miscellaneous type.
  ComplianceDisableEdit = (e) => {
    if (this.state.compliance_type != "Miscellaneous") {
      return true;
    }
    return false;
  };
  // disable Save button at the time of editing compliance.
  ComplianceCompletionDisableEdit = () => {
    if (this.state.compliance_status ==="Pending" & this.state.compliance_type != "Miscellaneous") {
      return true;
    }
    if(this.state.isCompUpdating===true)
    {
      return true;
    }
    return false;
  };
  // if dropdown selected value is not Completed then this will disable some fields according to the conditions.
  ComplianceCompletionDisableEdit2 = () => {
    
    const today = new Date()
    const comp_date = new Date(this.state.compliance_date)
    if (this.state.compliance_status ==="Pending") {
      return true;
    }
    if (this.state.compliance_status ==="Completed" ) {
      if(today >= comp_date)
        return false;
      else
        return true;
    }

   
    return false;
  };
  // functions for creating compliance meetings.
  createComplianceMeetingType = (e) => {
    this.setState({
      createcompliance_meetingtype: e.target.value,
      createcompliance_meetingtypeclass: "",
    });
  };
  //assingning d value to state variable createcompliance_date and giving class for indication field required or optional.
  createComplianceMeetingDate = (e) => {
    this.setState({
      createcompliance_date: e.target.value,
      createcompliance_dateclass: "",
    });
  };
    //assingning d value to state variable createcompliance_status and giving class for indication field required or optional.

  createComplianceMeetingStatus = (e) => {
    this.setState({
      createcompliance_status: e.target.value,
      createcompliance_statusclass: "",
    });
  };
    //assingning d value to state variable and giving class for indication field required or optional.

  createComplianceType = (e) => {
    this.setState({
      createcompliance_type: e.target.value,
      createcompliance_typeclass: "",
    });
  };
 // functions for updating CEO 
  handleCeoName = (e) => {
    this.setState({ ceo_title: e.target.value, ceocnameclass: "" });
  };
    // have given condition so that Contact Details will take dash and comma also with number.
    handleCeoPhone = (e) => {
     
        let validDateRegEx = /^[0-9,-]*$/;
      
  
        if (validDateRegEx.test( e.target.value)) {
          this.setState({
            ceo_phone: e.target.value,
            phonefieldmessage: "",
            ceophoneclass: "",
          });
        } else {
          this.setState({
                phonefieldmessage: "Contact Details must be a phone number",
              });
        }
      
    };

  
  // assingning value.
  handleCeoMonth = (e) => {
    this.setState({ ceo_month: e.target.value });
  };
  handleCeoYear = (e) => {
    this.setState({ selectedYear: e.target.value });
  };
  // Update Director Details.
  handleDirecName = (e) => {
    this.setState({ direc_name: e.target.value, direcnameclass: "" });
  };
    // assingning value & only integer value allowed.

  handledirecPhone = (e) => {
    if (isNaN(e.target.value) == false) {
      this.setState({
        direc_phone: e.target.value,
        phonefielddirecmessage: "",
        direcphoneclass: "",
      });
    } else {
      this.setState({
        phonefielddirecmessage: "Contact Details is a must be a phone number",
      });
    }

    // this.setState({ direc_phone: e.target.value, direcphoneclass: "" });
  };
    // assingning value.

  handledirecGender = (e) => {
    this.setState({ direc_gender: e.target.value, direcgenderclass: "" });
  };
    // assingning value.

  handledirecVillage = (e) => {
    this.setState({ direc_village: e.target.value, direcvillageclass: "" });
  };
  handledirecDate = (e) => {
    this.setState({ direc_joining: e.target.value, direcjoiningclass: "" });
  };
  // given a condition so that priority will not be negative.
  handledirecPriority = (e) => {
    const re = /^[0-9\b]+$/;
    var direcpri = 0;
    if (re.test(e.target.value)) {
      direcpri = e.target.value;
    } else {
      direcpri = "";
    }

    this.setState({
      priority: direcpri,
      direcpriorityclass: "",
    });

    // this.setState({ priority: e.target.value, direcpriorityclass: "" });
  };
  // Update Bank Functions.
  handleBankName = (e) => {
    this.setState({ bank: e.target.value, banknameclass: "" });
  };
  handleHolderName = (e) => {
    this.setState({ account_name: e.target.value, bankaccountclass: "" });
  };
    // assingning value and giving condition for only integer allowed.

  handleAccountNumber = (e) => {
    if (isNaN(e.target.value) == false) {
      this.setState({
        account_number: e.target.value,
        bankfieldmessage: "",
        banknoclass: "",
      });
    } else {
      this.setState({
        bankfieldmessage: "Account Number should be numeric",
      });
    }
    // this.setState({ account_number: e.target.value, banknoclass: "" });
  };
  handleBankBranch = (e) => {
    this.setState({ bank_branch: e.target.value, bankbranchclass: "" });
  };
  handleBankIfsc = (e) => {
    this.setState({ bank_ifsc: e.target.value, bankifscclass: "" });
  };
 // Create bank functions . Simply assingning values to state variable and giving class accordingly.
  handleCreateBankName = (e) => {
    this.setState({ createbank: e.target.value, createbanknameclass: "" });
  };
  handleCreateHolderName = (e) => {
    this.setState({
      createaccount_name: e.target.value,
      createbankaccountclass: "",
    });
  };
      // assingning value and giving condition for only integer allowed.

  handleCreateAccountNumber = (e) => {
    if (isNaN(e.target.value) == false) {
      this.setState({
        createaccount_number: e.target.value,
        createbankfieldmessage: "",
        createbanknoclass: "",
      });
    } else {
      this.setState({
        createbankfieldmessage: "Account Number should be numeric",
      });
    }
    // this.setState({ account_number: e.target.value, banknoclass: "" });
  };
  handleCreateBankBranch = (e) => {
    this.setState({
      createbank_branch: e.target.value,
      createbankbranchclass: "",
    });
  };
  handleCreateBankIfsc = (e) => {
    this.setState({ createbank_ifsc: e.target.value, createbankifscclass: "" });
  };
    // given a condition so that priority will not be negative.

  handleCreateBankPriority = (e) => {
    const re = /^[0-9\b]+$/;
    var bankpri = 0;
    if (re.test(e.target.value)) {
      bankpri = e.target.value;
    } else {
      bankpri = "";
    }

    this.setState({
      createbankPriority: bankpri,
      createbankPriorityclass: "",
    });
  };
  // Contact Add and Update functions.
  handleContactName = (e) => {
    this.setState({ contact_name: e.target.value, contactclass: "" });
  };
  handleContactDepartment = (e) => {
    this.setState({ contact_department: e.target.value, departmentclass: "" });
  };
      // assingning value and giving condition for only integer allowed.

  handleContactNumber = (e) => {
    if (isNaN(e.target.value) == false) {
      this.setState({
        contact_number: e.target.value,
        contactnumbermessage: "",
        contactnumberclass: "",
      });
    } else {
      this.setState({
        contactnumbermessage: "Contact Details is a must be a phone number",
      });
    }

    // this.setState({ contact_number: e.target.value, contactnumberclass: "" });
  };
  // Under Tab NO of Staff these function r triggered on click on edit in this section.
  // No of Staff Count functions . Negative value is not allowed condition is given.
  handleCeoCount = (e) => {
    const re = /^[0-9\b]+$/;
    let ceoCount = 0;
    if (re.test(e.target.value)) {
      ceoCount = e.target.value;
    } else {
      ceoCount = "";
    }
    // ceoCount = ceoCount ? ceoCount : 0;
    this.setState({
      ceo_count: ceoCount,
    });

    // this.setState({ ceo_count: e.target.value });
  };
    // No of FR Count functions . Negative value is not allowed condition is given.

  handleFrCount = (e) => {
    const re = /^[0-9\b]+$/;
    let FrCount = 0;
    if (re.test(e.target.value)) {
      FrCount = e.target.value;
    } else {
      FrCount = "";
    }

    this.setState({
      FR_count: FrCount,
    });
  };
    // No of Accountant Count functions . Negative value is not allowed condition is given.

  handleAccountantCount = (e) => {
    const re = /^[0-9\b]+$/;
    let accCount = 0;
    if (re.test(e.target.value)) {
      accCount = e.target.value;
    } else {
      accCount = "";
    }

    this.setState({
      accountant_count: accCount,
    });
    // this.setState({ accountant_count: e.target.value });
  };
  handleStaffCount = (e) => {
    const re = /^[0-9\b]+$/;
    let staffcount = 0;
    if (re.test(e.target.value)) {
      staffcount = e.target.value;
    } else {
      staffcount = "";
    }

    this.setState({
      staff_count: staffcount,
    });
    // this.setState({ staff_count: e.target.value });
  };
  handleOtherCount = (e) => {
    const re = /^[0-9\b]+$/;
    let otherCount = 0;
    if (re.test(e.target.value)) {
      otherCount = e.target.value;
    } else {
      otherCount = "";
    }

    this.setState({
      other_count: otherCount,
    });
    // this.setState({ other_count: e.target.value });
  };
  // Creating of Director Functions.
  handleAddDirecName = (e) => {
    this.setState({ adddirec_name: e.target.value, adddirecnameclass: "" });
  };
  handleFIGName = (e) => {
    this.setState({ FIG_name: e.target.value,FIGnameclass:""})
  }
  handleFIGVillage = (e) => {
    this.setState({ FIG_village: e.target.value,FIGvillageclass:""})
  }
  handleFIGRemarks = (e) => {
    this.setState({FIG_remarks: e.target.value,FIGremarksclass:""})
  }
  handleAddFIGName = (e) => {
    this.setState({ addFIG_name: e.target.value, addFIGnameclass: "" })
  }
  handleAddFIGVillage = (e) => {
    this.setState({
      addFIG_village: e.target.value,
      addFIGvillageclass: "",
    });
  };
  handleAddFIGRemarks = (e) => {
    this.setState({
      addFIG_remarks: e.target.value,
      addFIGremarksclass: "",
    });
  }
    //  Negative value is not allowed condition is given and only integer is allowed.

  handleAdddirecPhone = (e) => {
    if (isNaN(e.target.value) == false) {
      this.setState({
        adddirec_phone: e.target.value,
        phonefielddireaddcmessage: "",
        adddirecphoneclass: "",
      });
    } else {
      this.setState({
        phonefielddirecaddmessage:
          "Contact Details is a must be a phone number",
      });
    }

    // this.setState({ adddirec_phone: e.target.value, adddirecphoneclass: "" });
  };
  handleAdddirecGender = (e) => {
    this.setState({ adddirec_gender: e.target.value, adddirecgenderclass: "" });
  };
  handleAdddirecVillage = (e) => {
    this.setState({
      adddirec_village: e.target.value,
      adddirecvillageclass: "",
    });
  };
  handleAdddirecDate = (e) => {
    this.setState({
      adddirec_joining: e.target.value,
      adddirecjoiningclass: "",
    });
  };
    // given a condition so that priority will not be negative.

  handleAdddirecPriority = (e) => {
    const re = /^[0-9\b]+$/;
    var priority = 0;
    if (re.test(e.target.value)) {
      priority = e.target.value;
    } else {
      priority = "";
    }

    this.setState({
      addpriority: priority,
      adddirecpriorityclass: "",
    });
  };
  // Creating and Business Functions.
  handleBusinessName = (e) => {
    this.setState({ businessname: e.target.value, businessnameclass: "" });
  };
  handleBusinessDeal = (e) => {
    this.setState({ businessdeal: e.target.checked, businessdealclass: "" });
  };
  handleCreateBusinessName = (e) => {
    this.setState({
      createbusinessname: e.target.value,
      createbusinessnameclass: "",
    });
  };
  handleCreateBusinessDeal = (e) => {
    this.setState({
      createbusinessdeal: e.target.checked,
      createbusinessdealclass: "",
    });
  };
  // while adding a meeting in compliance in miscellaneous section checking all the validations before sending data to api.
  addcompilanceValidation = () => {
    let errors = false;
    if (this.state.createcompliance_meetingtype == "") {
      errors = true;
      this.setState({
        createcompliance_meetingtypeclass: "requiredinputfields",
      });
    }
    if (this.state.createcompliance_date == "") {
      errors = true;
      this.setState({ createcompliance_dateclass: "requiredinputfields" });
    }
    // if (this.state.createcompliance_status == "") {
    //   errors = true;
    //   this.setState({ createcompliance_statusclass: "requiredinputfields" });
    // }
    // if (this.state.createcompliance_type == "") {
    //   errors = true;
    //   this.setState({ createcompliance_typeclass: "requiredinputfields" });
    // }

    if (errors == false) {
      this.setState({ errorcompilancemessage: "" });
      return true;
    } else {
      this.setState({
        errorcompilancemessage: "Required fields must be filled",
      });
      return false;
    }
  };
  // calling an Api for adding meeting and checking validations.
  AddComplianceDetails = () => {
    var success = this.addcompilanceValidation();
    const data = new FormData();
    if (success == true) {
      this.setState({
        isCompCreating:true,
      })
      data.append("meeting_name", this.state.createcompliance_meetingtype);
      data.append("initial_due_date", this.state.createcompliance_date);
      // data.append("status", this.state.createcompliance_status);
      // data.append("compliance_type", this.state.createcompliance_type);
      // data.append("purpose", "");

      var flag = false;
      UserService.CreateComplainsDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isCompCreating:false,

              CreateCompilancemodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                isCompCreating:false,

                // fpocompilance: response.data.fpocompilance,
              });
              this.fetchCompilanceList(response.data.fpocompilance);
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            CreateCompilancemodalIsOpen: false,
            isCompCreating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in compilance adding");
    }
  };
  // calling an api after creating Director details and checking conditions and displaying error message if API returns any error.
  CreateDirectorSendDetails = () => {
    var success = this.handleAddDirectorValidation();
    if (success == true) {
      this.setState({
        isDirectorCreating:true
      })
      const data = new FormData();
      data.append("name", this.state.adddirec_name);
      data.append("phone_no", this.state.adddirec_phone);
      data.append("village", this.state.adddirec_village);
      data.append("gender", this.state.adddirec_gender);
      data.append("joining_date", this.state.adddirec_joining);
      data.append("priority", this.state.addpriority);

      var flag = false;
      UserService.AddDirectorDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isDirectorCreating:false,

              CreateDirectormodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                fpodirectors: response.data.fpodirectors,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            DirectormodalIsOpen: false,
            isDirectorCreating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in director ");
    }
  };  
  CreateFIGSendDetails = () => {
    var success = this.handleAddFIGValidation();
    if (success == true) {
      this.setState({
        isFIGCreating:true
      })
      const data = new FormData();
      data.append("name_of_fig", this.state.addFIG_name);
      data.append("village", this.state.addFIG_village);
      data.append("remarks", this.state.addFIG_remarks);
      var flag = false;
      UserService.AddFIGDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              loading: true,
              isFIGCreating:false,
              CreateFIGmodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                fpofiglist: response.data.fpofiglist,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            FIGmodalIsOpen: false,
            isFIGCreating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in FIG ");
    }
  };
  // validations for updating CEO.
  handleCeoValidation = () => {
    let errors = false;
    if (this.state.ceo_title == "") {
      errors = true;
      this.setState({ ceocnameclass: "requiredinputfields" });
    }
    if (this.state.ceo_phone == "") {
      errors = true;
      this.setState({ ceophoneclass: "requiredinputfields" });
    }
    if (this.state.ceo_month == "") {
      errors = true;
      this.setState({ ceomonthclass: "requiredinputfields" });
    }
    if (this.state.selectedYear == "") {
      errors = true;
      this.setState({ ceoyearclass: "requiredinputfields" });
    }
    if (errors == false) {
      this.setState({ errorceomessage: "" });
      return true;
    } else {
      this.setState({ errorceomessage: "Required fields must be filled" });
      return false;
    }
  };
    // calling an api after Updating CEO details and checking conditions and displaying error message if API returns any error.

  updateCeo = () => {
    var success = this.handleCeoValidation();
    if (success) {
      this.setState({
        isCeoUpdating:true
      })
      const data = new FormData();
      data.append("ceo_name", this.state.ceo_title);
      data.append("ceo_phone_no", this.state.ceo_phone);
      data.append("ceo_joining_month", this.state.ceo_month);
      data.append("ceo_joining_year", this.state.selectedYear);
      data.append("staff_count", this.state.staff_count);
      data.append("ceo_count", this.state.ceo_count);
      data.append("accountant_count", this.state.accountant_count);
      data.append("other_count", this.state.other_count);
      data.append("krishaksaathi_count", this.state.FR_count);
      var flag = false;
      UserService.UpdateCeoDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              CEOmodalIsOpen: false,
              // loading: true,
              isCeoUpdating: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                isCeoUpdating: false,

                loading: false,
                fpoDetails: response.data.fpodetails,
                fpodetailsdata: response.data.fpodetails,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            CEOmodalIsOpen: false,
            isCeoUpdating:false,
          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("erron in ceo");
    }
  };
  // here according to the compilanceData we are checking its type and then putting it in different array according to the type.
  fetchCompilanceList = (compilanceData) => {
    var mandData = [];
    var eventData = [];
    var FinanceData = [];
    var missData = [];

    compilanceData.map((data, index) => {
      if (data.compliance_type === "Mandatory") {
      

        mandData.push(data);
      
      } else if (data.compliance_type === "Event Based") {
        eventData.push(data);
      } else if (data.compliance_type === "Finance and Tax") {
        FinanceData.push(data);
      } else {
      
        missData.push(data);

      
      }
    });
    this.setState({
      mandatoryList: mandData,
      EventList: eventData,
      FinanceList: FinanceData,
      miscellaneous: missData,
    });
  };
  // Calling an API and if api returns success then storing the data in state variables so that it can be used in a component. If Api Returns error then
  // displaying a error on frontend using SweetAlert.
  componentDidMount() {
    var flag = false;
    UserService.getFPOProfileDetails().then((response) => {
      flag = true;
      // debugger
      // console.log("fpolists::  ", response);
      if (response.data.success) {

        this.setState({
          showloader: false,
          fpoDetails: response.data.fpodetails,
          fpobankdetails: response.data.fpobankdetails,
          fpoampsmarket: response.data.fpoapmcmarkets,
          fpobusiness: response.data.fpobusiness,
          fpoUsingAndroidApp:response.data.app_farmers_count,
          // fpocompilance: response.data.fpocompilance,
          fpodirectors: response.data.fpodirectors,
          fpocontacts: response.data.fpocontacts,
          fpoturnover: response.data.fpoturnover,
          loading: false,
          farmers_count: response.data.farmers_count,
          mean_khetscore: response.data.mean_khetscore,
          avg_landholding: response.data.avg_landholding,
          avg_farmer_site: response.data.avg_farmer_site,
          staff_count: response.data.fpodetails.staff_count,
          ceo_count: response.data.fpodetails.ceo_count,
          FR_count: response.data.fpodetails.krishaksaathi_count,
          accountant_count: response.data.fpodetails.accountant_count,
          other_count: response.data.fpodetails.other_count,
          ceo_title: response.data.fpodetails.ceo_title,
          ceo_phone: response.data.fpodetails.ceo_phone_no,
          ceo_month: response.data.fpodetails.ceo_joining_month,
          selectedYear: response.data.fpodetails.ceo_joining_year,
          fpodetailsdata: response.data.fpodetails,
          fpofiglist: response.data.fpofiglist,
        });
        // console.log("old data is old", this.state.fpocompilance);
        this.fetchCompilanceList(response.data.fpocompilance);

     
      } else {
        this.setState({ loading: false });
      }
    });
    UserService.getSpecialServices().then((response)=>{
     console.log("getSpecialServices::  ", response.data.services_list);
     this.setState({ 
      specialServices: response.data.services_list,
      })
    });
  }
  // checking required fields at the time of adding director.
  handleAddDirectorValidation = () => {
    let errors = false;
    if (this.state.adddirec_name == "") {
      errors = true;
      this.setState({ adddirecnameclass: "requiredinputfields" });
    }
    if (this.state.adddirec_phone == "") {
      errors = true;
      this.setState({ adddirecphoneclass: "requiredinputfields" });
    }
    if (this.state.adddirec_gender == "") {
      errors = true;
      this.setState({ adddirecgenderclass: "requiredinputfields" });
    }
    if (this.state.adddirec_village == "") {
      errors = true;
      this.setState({ adddirecvillageclass: "requiredinputfields" });
    }
    if (this.state.adddirec_joining == "") {
      errors = true;
      this.setState({ adddirecjoiningclass: "requiredinputfields" });
    }

    if (this.state.addpriority == "") {
      errors = true;
      this.setState({ adddirecpriorityclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ errormessage: "" });
      return true;
    } else {
      this.setState({ errormessage: "Required fields must be filled" });
      return false;
    }
  };
    // checking required fields at the time of updating director.

  handleDirectorValidation = () => {
    let errors = false;
    if (this.state.direc_name == "") {
      errors = true;
      this.setState({ direcnameclass: "requiredinputfields" });
    }
    if (this.state.direc_phone == "") {
      errors = true;
      this.setState({ direcphoneclass: "requiredinputfields" });
    }
    if (this.state.direc_gender == "") {
      errors = true;
      this.setState({ direcgenderclass: "requiredinputfields" });
    }
    if (this.state.direc_village == "") {
      errors = true;
      this.setState({ direcvillageclass: "requiredinputfields" });
    }
    if (this.state.direc_joining == "") {
      errors = true;
      this.setState({ direcjoiningclass: "requiredinputfields" });
    }

    if (this.state.priority == "") {
      errors = true;
      this.setState({ direcpriorityclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ errormessage2: "" });
      return true;
    } else {
      this.setState({ errormessage2: "Required fields must be filled" });
      return false;
    }
  };
       // calling an api after Updating Director details and checking conditions and displaying error message if API returns any error.

  DirectorSendDetails = () => {
    var success = this.handleDirectorValidation();
    if (success == true) {
      this.setState({
        isDirectorUpdating:true
      })
      const data = new FormData();
      data.append("name", this.state.direc_name);
      data.append("phone_no", this.state.direc_phone);
      data.append("village", this.state.direc_village);
      data.append("gender", this.state.direc_gender);
      data.append("joining_date", this.state.direc_joining);
      data.append("priority", this.state.priority);

      var flag = false;
      UserService.UpdateDirectorDetails(data, this.state.direc_id).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isDirectorUpdating:false,
              DirectormodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
               
                isDirectorUpdating:false,
                fpodirectors: response.data.fpodirectors,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            DirectormodalIsOpen: false,
            isDirectorUpdating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in director ");
    }
  };
  handleAddFIGValidation = () => {
    let errors = false;
    if (this.state.addFIG_name == "") {
      errors = true;
      this.setState({ addFIGnameclass: "requiredinputfields" });
    }
    if (this.state.addFIG_remarks == "") {
      errors = true;
      this.setState({ addFIGremarksclass: "requiredinputfields" });
    }
     if (this.state.addFIG_village == "") {
      errors = true;
      this.setState({ addFIGvillageclass: "requiredinputfields" });
    }
    if (errors == false) {
      this.setState({ errormessage: "" });
      return true;
    } else {
      this.setState({ errormessage: "Required fields must be filled" });
      return false;
    }
  };
  handleFIGValidation = () => {
    let errors = false;
    if (this.state.FIG_name == "") {
      errors = true;
      this.setState({ FIGnameclass: "requiredinputfields" });
    }
    if (this.state.FIG_remarks == "") {
      errors = true;
      this.setState({ FIGremarksclass: "requiredinputfields" });
    }
    if (this.state.FIG_village == "") {
      errors = true;
      this.setState({ FIGvillageclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ errormessage2: "" });
      return true;
    } else {
      this.setState({ errormessage2: "Required fields must be filled" });
      return false;
    }
  };
       // calling an api after Updating FIG details and checking conditions and displaying error message if API returns any error.

  FIGSendDetails = () => {
    var success = this.handleFIGValidation();
    if (success == true) {
      this.setState({
        isFIGUpdating:true
      })
      const data = new FormData();
      data.append("name_of_fig", this.state.FIG_name);
      data.append("village", this.state.FIG_village);
      data.append("remarks", this.state.FIG_remarks);

      var flag = false;
      UserService.UpdateFIGDetails(data, this.state.FIG_id).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isFIGUpdating:false,
              FIGmodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,               
                isFIGUpdating:false,
                fpofiglist: response.data.fpofiglist,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            FIGmodalIsOpen: false,
            isFIGUpdating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in FIG ");
    }
  };
   // required fields at the time of creating /Updating contacts.
  handleFormValidation = () => {
    let errors = false;
    if (this.state.contact_name == "") {
      errors = true;
      this.setState({ contactclass: "requiredinputfields" });
    }
    if (this.state.contact_department == "") {
      errors = true;
      this.setState({ departmentclass: "requiredinputfields" });
    }
    if (this.state.contact_number == "") {
      errors = true;
      this.setState({ contactnumberclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ errormessage3: "" });
      return true;
    } else {
      this.setState({ errormessage3: "Required fields must be filled" });
      return false;
    }
  };
       // calling an api after Updating /Creating  contacts and checking conditions and displaying error message if API returns any error.
       // according to the condition updating and create api is trigerred.
       

  updateContDetails = (contactId=null) => {
  
    var success = this.handleFormValidation();
   

    if (success == true) {
      this.setState({
        isContactUpdating: true,
      });
      const data = new FormData();

      data.append("name", this.state.contact_name);
      data.append("department", this.state.contact_department);
      data.append("number", this.state.contact_number);
      var contactId = this.state.contact_id;
   
      if(contactId>0 & this.state.is_contact_edit===true)
      {
     

        var flag = false;

      UserService.UpdateContactDetails(data, contactId).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              ContactmodalIsOpen: false,
              is_contact_edit: false,

              isContactUpdating: false,
            
           
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                is_contact_edit: false,

                isContactUpdating: false,
                fpocontacts: response.data.fpocontacts,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            ContactmodalIsOpen: false,
            isContactUpdating: false,
            is_contact_edit: false,


          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    }
    else {
      var flag = false;

      UserService.CreateContactDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              is_contact_edit: false,
              ContactmodalIsOpen: false,
              isContactUpdating: false,
              // fpocontacts: response.data.fpocontacts,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                is_contact_edit: false,
                ContactmodalIsOpen: false,
                isContactUpdating: false,
            
                fpocontacts: response.data.fpocontacts,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            ContactmodalIsOpen: false,
          
            isContactUpdating: false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    }
   } else {
      console.log("error");
    }
  };
   // required fileds checking while updating bank details.
  handleBankValidation = () => {
    let errors = false;
    if (this.state.bank == "") {
      errors = true;
      this.setState({ banknameclass: "requiredinputfields" });
    }
    if (this.state.account_name == "") {
      errors = true;
      this.setState({ bankaccountclass: "requiredinputfields" });
    }
    if (this.state.account_number == "") {
      errors = true;
      this.setState({ banknoclass: "requiredinputfields" });
    }
    if (this.state.bank_branch == "") {
      errors = true;
      this.setState({ bankbranchclass: "requiredinputfields" });
    }
    if (this.state.bank_ifsc == "") {
      errors = true;
      this.setState({ bankifscclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ errorbankmessage: "" });
      return true;
    } else {
      this.setState({ errorbankmessage: "Required fields must be filled" });
      return false;
    }
  };
  // required fields checking while adding bank details.
  handleBankSendValidation = () => {
    let errors = false;
    if (this.state.createbank == "") {
      errors = true;
      this.setState({ createbanknameclass: "requiredinputfields" });
    }
    if (this.state.createaccount_name == "") {
      errors = true;
      this.setState({ createbankaccountclass: "requiredinputfields" });
    }
    if (this.state.createaccount_number == "") {
      errors = true;
      this.setState({ createbanknoclass: "requiredinputfields" });
    }
    if (this.state.createbank_branch == "") {
      errors = true;
      this.setState({ createbankbranchclass: "requiredinputfields" });
    }
    if (this.state.createbank_ifsc == "") {
      errors = true;
      this.setState({ createbankifscclass: "requiredinputfields" });
    }
    if (this.state.createbankPriority == "") {
      errors = true;
      this.setState({ createbankPriorityclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ createerrorbankmessage: "" });
      return true;
    } else {
      this.setState({
        createerrorbankmessage: "Required fields must be filled",
      });
      return false;
    }
  };
      // calling an api after Updating bank details and checking conditions and displaying error message if API returns any error.

  BankDetails = () => {

    const data = new FormData();
    var success = this.handleBankValidation();
    if (success == true) {
      this.setState({
        isBankUpdating:true,
      })
      data.append("bank_name", this.state.bank);
      data.append("account_holder_name", this.state.account_name);
      data.append("acc_no", this.state.account_number);
      data.append("branch", this.state.bank_branch);
      data.append("ifsc_code", this.state.bank_ifsc);

      var flag = false;
      UserService.UpdateBankDetails(data, this.state.bank_id).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              modalIsOpen: false,
              isBankUpdating:false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                fpobankdetails: response.data.fpobankdetails,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            modalIsOpen: false,
            isBankUpdating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in bank details");
    }
  };
      // calling an api after creating bank details and checking conditions and displaying error message if API returns any error.

  CreateBankSendDetails = () => {
    const data = new FormData();
    var success = this.handleBankSendValidation();
    if (success == true) {
      this.setState({
        isBankCreating:true,
      })
      data.append("bank_name", this.state.createbank);
      data.append("account_holder_name", this.state.createaccount_name);
      data.append("acc_no", this.state.createaccount_number);
      data.append("branch", this.state.createbank_branch);
      data.append("ifsc_code", this.state.createbank_ifsc);
      data.append("priority", this.state.createbankPriority);

      var flag = false;
      UserService.CreateBankDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isBankCreating:false,

              CreateBankmodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                isBankCreating:false,

                fpobankdetails: response.data.fpobankdetails,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            CreateBankmodalIsOpen: false,
            isBankCreating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in bank details");
    }
  };
      // calling an api after Updating Staff details and checking conditions and displaying error message if API returns any error.
      handleStaffValidation = () => {
        let errors = false;
        if (this.state.ceo_count == "") { 
          errors = true; 
          this.setState({ ceo_count: 0},()=>{

          });
        }
        if (this.state.FR_count == "") {
          errors = true;
          this.setState({ FR_count: 0 });
        }
        if (this.state.accountant_count == "") {
          errors = true;
          this.setState({ accountant_count: 0 });
        }
        if (this.state.staff_count == "") {
          errors = true;
          this.setState({ staff_count: 0 });
        }
        if (this.state.other_count == "") {
          errors = true;
          this.setState({ other_count: 0 });
        }           
        if (errors == true) {
          // this.setState({ createerrorbankmessage: "" });
          return true;
        }   
      };
        
  StaffSendDetails = async () => {
    var success = await this.handleStaffValidation();
    if (success == true) {
      // console.log("ceo_count",this.state.ceo_count,"krishaksaathi_count",this.state.FR_count)
     
    const data = new FormData();
    
    data.append("ceo_count", this.state.ceo_count);
    data.append("krishaksaathi_count", this.state.FR_count);
    data.append("accountant_count", this.state.accountant_count);
    data.append("staff_count", this.state.staff_count);
    data.append("other_count", this.state.other_count);
    data.append("ceo_name", this.state.fpodetailsdata.ceo_name);
    data.append("ceo_phone_no", this.state.ceo_phone);
    data.append("ceo_joining_month", this.state.ceo_month);
    data.append("ceo_joining_year", this.state.selectedYear);
    var flag = false;
    UserService.UpdateCeoDetails(data).then(
      (response) => {
        flag = true;
        if (response.data.success || "id" in response.data.data) {
          this.setState({
            loading: true,
            StaffmodalIsOpen: false,
          });
          UserService.getFPOProfileDetails().then((response) => {
            this.setState({
              loading: false,
              fpoDetails: response.data.fpodetails,
              fpodetailsdata: response.data.fpodetails,
            });
          });
        }
      },
      (error) => {
        flag = true;
        if (error.response) {
          TriggerAlert("Error", error.response.data.error, "error");
        } else {
          TriggerAlert(
            "Error",
            "Server closed unexpectedly, Please try again",
            "error"
          );
        }
        this.setState({
          StaffmodalIsOpen: false,
        });
      },
      setTimeout(() => {
        if (flag == false) {
          this.setState({
            showloader: false,
          });
          TriggerAlert("Error", "Response Timed out, Please try again", "info");
          this.props.history.push("/dashboard");
        }
      }, 30000)
    );
    }
    else{
      console.log("error")
    }
  };
  // functions for checking Business Details.
  handleBusinessValidation = () => {
    let errors = false;
    if (this.state.businessname == "") {
      errors = true;
      this.setState({ businessnameclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ businessnameerrorclass: "" });
      return true;
    } else {
      this.setState({
        businessnameerrorclass: "Required fields must be filled",
      });
      return false;
    }
  };
      // calling an api after Updating Business details and checking conditions and displaying error message if API returns any error.

  SendDataBusinessModal = () => {
    var success = this.handleBusinessValidation();
    if (success == true) {
      this.setState({
        isBusinessUpdating:true,
      })
      const data = new FormData();

      data.append("business_type", this.state.businessname);
      if (this.state.businessdeal == true) {
        data.append("deal", "True");
      } else {
        data.append("deal", "False");
      }

      var flag = false;
      UserService.UpdateBusinessDetails(data, this.state.business_id).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isBusinessUpdating:false,

              BusinessmodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                isBusinessUpdating:false,

                fpobusiness: response.data.fpobusiness,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            BusinessmodalIsOpen: false,
            isBusinessUpdating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error in business");
    }
  };
    // checking business details required fields at the time of creating.

  handleBusinessValidationOnCreating = () => {
    let errors = false;
    if (this.state.createbusinessname == "") {
      errors = true;
      this.setState({ createbusinessnameclass: "requiredinputfields" });
    }

    if (errors == false) {
      this.setState({ createbusinessnameerrorclass: "" });
      return true;
    } else {
      this.setState({
        createbusinessnameerrorclass: "Required fields must be filled",
      });
      return false;
    }
  };
        // calling an api after Creating Business details and checking conditions and displaying error message if API returns any error.


  CreateSendDataBusinessModal = () => {
    var success = this.handleBusinessValidationOnCreating();
    if (success == true) {
      this.setState({
        isBusinessCreating:true,
      })
      const data = new FormData();
      data.append("business_type", this.state.createbusinessname);
      data.append("details", "text");
      if (this.state.createbusinessdeal == true) {
        data.append("deal", "True");
      } else {
        data.append("deal", "False");
      }

      var flag = false;
      UserService.CreateBusinessDetails(data).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isBusinessCreating:false,
              CreationBusinessmodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                isBusinessCreating:false,
                fpobusiness: response.data.fpobusiness,
              });
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            CreationBusinessmodalIsOpen: false,
            isBusinessCreating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error");
    }
  };
  // checking required conditions and according to the validations while editing compliance .
  handleComplianceSendDetails = () => {
    let errors = false;
    
    // if (this.state.compliance_meetingtype == "") {
    //   errors = true;
    //   this.setState({ upcompmeetingtypeclass: "requiredinputfields" });
    // }
    // if (this.state.compliance_date == "") {
    //   errors = true;
    //   this.setState({ upcompdateclass: "requiredinputfields" });
    // }
    if (this.state.compliance_type != "Miscellaneous") {
    if (this.state.completion_date == "") {
      errors = true;
      this.setState({ completiondataclass: "requiredinputfields" });
    }
    else{
      this.setState({ completiondataclass: "" });
    }
  }
    
    if (this.state.compliance_status == "") {
      errors = true;
      this.setState({ upcompstatusclass: "requiredinputfields" });
    }
   

    if (this.state.compliance_type === "Miscellaneous") {
       if (this.state.compliance_meetingtype == "") {
          errors = true;
          this.setState({ upcompmeetingtypeclass: "requiredinputfields" });
        }
        if (this.state.compliance_date == "") {
          errors = true;
          this.setState({ upcompdateclass: "requiredinputfields" });
        }
        if (this.state.compliance_status === "Completed") {
          
          if(this.state.completion_date=="")
          {
            errors = true;
            this.setState({ completiondataclass: "requiredinputfields" });
          }
          
        }

    }

    if (errors == false) {
      this.setState({ compilanceupdatemessage: "" });
      return true;
    } else {
      this.setState({
        compilanceupdatemessage: "Required fields must be filled",
      });
      return false;
    }
  };
        // calling an api after Updating Compliance details and checking conditions and displaying error message if API returns any error.

  sendComplianceUpdateDetails = () => {
    var success = this.handleComplianceSendDetails();
    const data = new FormData();
    if (success == true) {
      this.setState({
        isCompUpdating:true,
      })
      if (this.state.compliance_type === "Miscellaneous"){
        data.append("meeting_name", this.state.compliance_meetingtype);
        data.append("initial_due_date", this.state.compliance_date);
      }
      // data.append("meeting_type", this.state.compliance_meetingtype);
      data.append("completion_date", this.state.completion_date);
      data.append("status", this.state.compliance_status);
      // data.append("compliance_type", this.state.compliance_type);
      // data.append("purpose", this.state.compliance_purpose);

      var flag = false;
      UserService.UpdateComplianceDetails(data, this.state.compliance_id).then(
        (response) => {
          flag = true;
          if (response.data.success || "id" in response.data.data) {
            this.setState({
              // loading: true,
              isCompUpdating:false,

              CompliancemodalIsOpen: false,
            });
            UserService.getFPOProfileDetails().then((response) => {
              this.setState({
                loading: false,
                isCompUpdating:false,

                // fpocompilance: response.data.fpocompilance,
              });

              this.fetchCompilanceList(response.data.fpocompilance);
              // console.log("new idea", this.state.fpocompilance);
            });
          }
        },
        (error) => {
          flag = true;
          if (error.response) {
            TriggerAlert("Error", error.response.data.error, "error");
          } else {
            TriggerAlert(
              "Error",
              "Server closed unexpectedly, Please try again",
              "error"
            );
          }
          this.setState({
            CompliancemodalIsOpen: false,
            isCompUpdating:false,

          });
        },
        setTimeout(() => {
          if (flag == false) {
            this.setState({
              showloader: false,
            });
            TriggerAlert(
              "Error",
              "Response Timed out, Please try again",
              "info"
            );
            this.props.history.push("/dashboard");
          }
        }, 30000)
      );
    } else {
      console.log("error while updating compilance");
    }
  };
  // will show total no of Directors
  directorNo = () => {
    const { fpodirectors } = this.state;
    let total = 0;
    fpodirectors.forEach((item) => {
      total = total + 1;
    });
    return total;
  };
  navigateToPage=()=>{
    this.props.history.push("/compliancehistory");
  }
  FIGNo = () => {
    const { fpofiglist } = this.state;
    let total = 0;
    fpofiglist.forEach((item) => {
      total = total + 1;
    });
    return total;
  };
  
  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };
    // destructuring of State variables.
    const {
      modalIsOpen,
      CEOmodalIsOpen,
      DirectormodalIsOpen,
      CreateDirectormodalIsOpen,
      ContactmodalIsOpen,
      fpoDetails,
      fpodirectors,
      fpoturnover,
      fpobankdetails,
      thisYear,
      selectedYear,
      loading,
      fpocontacts,
      fpoampsmarket,
      fpobusiness,
      dateError,
      isdateerror,
      StaffmodalIsOpen,
      BusinessmodalIsOpen,
      CompliancemodalIsOpen,
      CreateCompilancemodalIsOpen,
      CreateBankmodalIsOpen,
      CreationBusinessmodalIsOpen,
     
      isCeoUpdating,
      isBankUpdating,
      isBankCreating,
      isContactUpdating,
      isBusinessUpdating,
      isBusinessCreating,
      isDirectorCreating,
      isDirectorUpdating,
      isCompCreating,
      isCompUpdating,
      CreateFIGmodalIsOpen,
      FIGmodalIsOpen,
      isFIGCreating,
      fpofiglist,
      isFIGUpdating,
    } = this.state;
    const allYears = [];
    var objDate = new Date(fpoDetails.establishment_date);
    // console.log(
    //   "valid date",
    //   objDate.toLocaleString("default", { month: "long" })
    // );

    for (let i = 0; i <= 21; i++) {
      allYears.push(thisYear - i);
    }
    const yearList = allYears.map((x) => {
      return <option value={x}>{x}</option>;
    });
    //Edit bank modal will pop up on click of edit icon inside Bank Details Tab.
    const showBankModal = (val, data) => {
      this.setState({
        modalIsOpen: true,
        bank: "",
        account_name: "",
        account_number: "",
        bank_branch: "",
        bank_ifsc: "",
        banknameclass: "",
        bankaccountclass: "",
        banknoclass: "",
        bankbranchclass: "",
        bankifscclass: "",
        bankfieldmessage: "",
      });
      if (data) {
        this.setState({
          modalIsOpen: true,
          bank: data.bank_name,
          account_name: data.account_holder_name,
          account_number: data.acc_no,
          bank_branch: data.branch,
          bank_ifsc: data.ifsc_code,
          bank_id: data.id,
        });
      }
    };
    const hideModal = () => {
      this.setState({
        modalIsOpen: false,
      });
    };

    //  bank create modal

    const CreateBankModal = () => {
      this.setState({
        CreateBankmodalIsOpen: true,
        createbank: "",
        createaccount_name: "",
        createaccount_number: "",
        createbank_branch: "",
        createbank_ifsc: "",
        createbanknameclass: "",
        createbankaccountclass: "",
        createbanknoclass: "",
        createbankbranchclass: "",
        createbankifscclass: "",
        createbankfieldmessage: "",
        createbankPriorityclass: "",
        createerrorbankmessage: "",
      });
    };
    const CreateBankhideModal = () => {
      this.setState({
        CreateBankmodalIsOpen: false,
      });
    };
      // CEO modal will pop up on click of edit icon in CEO Details.

    const CEOModal = (val, selecteddata) => {
      this.setState({
        CEOmodalIsOpen: true,
        ceo_title: "",
        ceo_phone: "",
        ceo_month: "",
        selectedYear: "",
        phonefieldmessage: "",
        errorceomessage: "",
        ceocnameclass: "",
        ceophoneclass: "",
        ceomonthclass: "",
      });
      if (selecteddata) {
        this.setState({
          CEOmodalIsOpen: true,
          ceo_title: selecteddata.ceo_name,
          ceo_phone: selecteddata.ceo_phone_no,
          ceo_month: selecteddata.ceo_joining_month,
          selectedYear: selecteddata.ceo_joining_year,
        });
      }
    };
    const CEOhideModal = () => {
      this.setState({
        CEOmodalIsOpen: false,
      });
    };
        // Director modal will pop up on click of edit icon inside director Details Tab.

    const DirectorModal = (val, data) => {
      this.setState({
        direc_name: "",
        direc_phone: "",
        direc_village: "",
        direc_gender: "",
        direc_joining: "",
        priority: "",
        direcnameclass: "",
        direcphoneclass: "",
        direcgenderclass: "",
        direcvillageclass: "",
        direcjoiningclass: "",
        errormessage2: "",
        // priority: "",
        direcpriorityclass: "",
        phonefielddirecmessage: "",
      });
      if (data) {
        this.setState({
          DirectormodalIsOpen: true,
          direc_name: data.name,
          direc_phone: data.phone_no,
          direc_village: data.village,
          direc_gender: data.gender,
          direc_joining: data.joining_date,
          priority: data.priority,
          direc_id: data.id,
        });
      }
    };
    const DirectorhideModal = () => {
      this.setState({
        DirectormodalIsOpen: false,
        isdateerror: false,
      });
    };
        // Director modal will pop up on click of plus icon inside Director Details Tab.

    const AddDirector = () => {
      this.setState({
        CreateDirectormodalIsOpen: true,
        adddirec_name: "",
        adddirecnameclass: "",
        adddirecphoneclass: "",
        adddirec_phone: "",
        adddirecgenderclass: "",
        adddirec_gender: "",
        adddirecvillageclass: "",
        adddirec_village: "",
        adddirecjoiningclass: "",
        adddirec_joining: "",
        adddirecpriorityclass: "",
        addpriority: "",
        errormessage: "",
      });
    };
    const AddDirectorhide = () => {
      this.setState({
        CreateDirectormodalIsOpen: false,
        phonefielddirecaddmessage: "",
        //  isdateerror: false,
      });
    };
        // ShowContact modal will pop up on click of plus/edit icon inside Contact Details Tab.

    const showContactModal = (val, selecteddata = null) => {
      this.setState({
        ContactmodalIsOpen: true,
        is_contact_edit: false,
        contact_name: "",
        contact_department: "",
        contact_number: "",
        errormessage3: "",
        contactclass: "",
        departmentclass: "",
        contactnumberclass: "",
      });
      if (selecteddata) {
        this.setState({
          ContactmodalIsOpen: true,
          is_contact_edit: true,
          contact_name: selecteddata.name,
          contact_department: selecteddata.department,
          contact_number: selecteddata.number,
          contact_id: selecteddata.id,
         
        });
      }
    };
    const ContacthideModal = () => {
      this.setState({
        ContactmodalIsOpen: false,
        contact_name: "",
        contact_department: "",
        contact_number: "",
        is_contact_edit: false,
      });
    };
    // 2 modal for staff
  
      // Staff modal will pop up on click of edit icon inside Staff Details Tab.

    const StaffModal = (val, selecteddata) => {
      this.setState({
        StaffmodalIsOpen: true,
        ceo_count: selecteddata.ceo_count,
        FR_count: selecteddata.krishaksaathi_count,
        accountant_count: selecteddata.accountant_count,
        staff_count: selecteddata.staff_count,
        other_count: selecteddata.other_count,
      });
    };
    const StaffhideModal = () => {
      this.setState({
        StaffmodalIsOpen: false,
      });
    };
        // Business modal will pop up on click of edit icon inside Business Details Tab.

    const BusinessModal = (val, data) => {
      this.setState({
        BusinessmodalIsOpen: true,
        businessname: "",
        businessdeal: "",
        businessnameclass: "",
        businessnameerrorclass: "",
      });
      if (data) {
        this.setState({
          BusinessmodalIsOpen: true,
          businessname: data.business_type,
          businessdeal: data.deal,
          business_id: data.id,
        });
      }
    };
    const BusinesshideModal = () => {
      this.setState({
        BusinessmodalIsOpen: false,
      });
    };
      // Business modal will pop up on click of plus icon inside Business Details Tab.

    const BusinessModalCreation = () => {
      this.setState({
        CreationBusinessmodalIsOpen: true,
        createbusinessname: "",
        createbusinessnameclass: "",
        createbusinessdeal: "",
        createbusinessnameerrorclass: "",
      });
    };
    const BusinesshideModalCreation = () => {
      this.setState({
        CreationBusinessmodalIsOpen: false,
      });
    };
      // Compliance modal will pop up on click of edit icon inside compliance Details .

    const ComplianceUpdateModal = (val, selecteddata) => {
      this.setState({
        CompliancemodalIsOpen: true,
        compliance_meetingtype: "",
        compliance_date: "",
        compliance_status: "",
        compliance_type: "",
        compliance_purpose: "",
        upcompmeetingtypeclass: "",
        upcompdateclass: "",
        upcompstatusclass: "",
        upcomptypeclass: "",
        compilanceupdatemessage: "",
        completiondataclass:"",
      });
      if (selecteddata) {
        const minDate = new Date(new Date(selecteddata.due_date).getTime() - 10*24*60*60*1000)
        this.setState({
          CompliancemodalIsOpen: true,
          compliance_meetingtype: selecteddata.meeting_name,
          compliance_date: selecteddata.due_date,
          compliance_status: selecteddata.status,
          compliance_type: selecteddata.compliance_type,
          completion_date:"",
          compliance_min_date : minDate,
          compliance_id: selecteddata.id,
        });
      }
    };
    const ComplianceUpdatehideModal = () => {
      this.setState({
        CompliancemodalIsOpen: false,
      });
    };
        // Compliance Add modal will pop up on click of add icon inside compliance Details .

    const AddComplianceModal = () => {
      this.setState({
        CreateCompilancemodalIsOpen: true,
        createcompliance_meetingtype: "",
        createcompliance_date: "",
        createcompliance_status: "",
        createcompliance_type: "",
        createcompliance_typeclass: "",
        createcompliance_statusclass: "",
        createcompliance_dateclass: "",
        createcompliance_meetingtypeclass: "",
        errorcompilancemessage: "",
      });
    };
    const AddCompilancehide = () => {
      this.setState({
        CreateCompilancemodalIsOpen: false,
        //  isdateerror: false,
      });
    };
    const AddFIG = () => {
      this.setState({
        CreateFIGmodalIsOpen: true,
        addFIG_name: "",
        addFIGnameclass: "",
        addFIGremarksclass:"",
        addFIGvillageclass:"",
        addFIG_remarks: "",    
        addFIG_village: "",
        errormessage: "",
      });
    };
    const AddFIGhide = () => {
      this.setState({
        CreateFIGmodalIsOpen: false,
        //  isdateerror: false,
      });
    };

    const FIGModal = (val, data) => {
      this.setState({
        FIG_name:"",
        FIG_remarks:"",
        FIG_village:"",
        FIGnameclass: "",
        FIGremarksclass: "",
        FIGvillageclass: "",
        errormessage2: "",
      });
      if (data) {
        this.setState({
          FIGmodalIsOpen: true,
          FIG_name:data.name_of_fig,
          FIG_remarks:data.remarks,
          FIG_village:data.village,
          FIG_id: data.id,
        });
      }
    };
    const FIGhideModal = () => {
      this.setState({
        FIGmodalIsOpen: false,
      });
    }
    return (
      <div className="">
        {this.state.loading ? (
          <span className="spinner-border spinner-border-sm dashboardLoader" style={{position:"relative",top:"240px"}}></span>
        ) : (
          <div className="whole-WrapData width-90 mt-5">
            <Row>
              <Col md="8">
                <h4 className="all-headings" style={{padding:"8px"}}>Organization Details</h4>
                <div className="organization-box">
                  <div className="organization-box-details">
                    <h4 className="heading-color">
                      CEO DETAILS
                      <span>
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          className="dvaraBrownText shift-right-icon"
                          style={{ width: "1.2 rem" }}
                          onClick={() => CEOModal(true, fpoDetails)}
                        ></FontAwesomeIcon>
                      </span>
                    </h4>
                    <p>
                      Name : <span>{fpoDetails.ceo_name} </span>
                    </p>
                    <p>
                      Phone No : <span>{fpoDetails.ceo_phone_no} </span>
                    </p>

                    <p>
                      Joining Month and Year :
                      <span>
                        {fpoDetails.ceo_joining_month} &nbsp;
                        {fpoDetails.ceo_joining_year}
                      </span>
                    </p>
                    <Modal
                      show={CEOmodalIsOpen}
                      onHide={CEOhideModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header>
                        <Modal.Title>
                          &nbsp;&nbsp;
                          <span className="dvaraBrownText">
                            Edit CEO Details
                          </span>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="farmersUploadWrap">
                          <Form
                            encType="multipart/form-data"
                            method="post"
                            name="fileinfo"
                            autocomplete="off"

                          >
                            <br></br>
                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalInputType"
                            >
                              <Form.Label
                                column="sm"
                                lg={2}
                                className="dvaraBrownText formWeight"
                              >
                                Name
                              </Form.Label>
                              <Col sm={10}>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  className={this.state.ceocnameclass}
                                  value={this.state.ceo_title}
                                  onChange={this.handleCeoName}
                                ></Form.Control>
                              </Col>
                            </Form.Group>

                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalCrop"
                            >
                              <Form.Label
                                className="dvaraBrownText formWeight"
                                column="sm"
                                lg={2}
                              >
                                Phone No
                              </Form.Label>
                              <Col sm={10}>
                                <Form.Control
                                  size="sm"
                                  type="text"
                                  name="crop"
                                  className={this.state.ceophoneclass}
                                  value={this.state.ceo_phone}
                                  onChange={this.handleCeoPhone}
                                />
                                <p className="requiredfields">
                                  {this.state.phonefieldmessage}
                                </p>
                              </Col>
                            </Form.Group>

                            <Form.Group
                              as={Row}
                              className="mb-3"
                              controlId="formHorizontalBrand"
                            >
                              <Form.Label
                                column="sm"
                                lg={2}
                                className="dvaraBrownText formWeight"
                              >
                                Joining Month and Year
                              </Form.Label>
                              <Col sm={5}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  className={this.state.ceomonthclass}
                                  value={this.state.ceo_month}
                                  onChange={this.handleCeoMonth}
                                >
                                  <option value=""> Select Month</option>
                                  <option value="January">January</option>
                                  <option value="February">February</option>
                                  <option value="March">March</option>
                                  <option value="April">April</option>
                                  <option value="May">May</option>
                                  <option value="June">June</option>
                                  <option value="July">July</option>
                                  <option value="August">August</option>
                                  <option value="September">September</option>
                                  <option value="October">October</option>
                                  <option value="November">November</option>
                                  <option value="December">December</option>
                                </Form.Control>
                              </Col>
                              <Col sm={5}>
                                <Form.Control
                                  size="sm"
                                  as="select"
                                  value={this.state.selectedYear}
                                  onChange={this.handleCeoYear}
                                >
                                  {yearList}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Form>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <p className="requiredfields">
                          {this.state.errorceomessage}
                        </p>
                        <Button variant="secondary" onClick={CEOhideModal}>
                          Close
                        </Button>
                        <Button variant="primary" 
                          disabled={isCeoUpdating}
                        onClick={this.updateCeo}
                        size="md"
                      
                        >
                       
                       
                  Save Changes
                  {isCeoUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                        
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <div className="organization-box-details">
                    <h4 className="heading-color">BOARD OF DIRECTOR DETAILS</h4>
                    <p style={{marginBottom:"10px"}}>
                      No. of Directors : {this.directorNo()}
                      <span>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="dvaraBrownText shift-right-icon"
                          onClick={() => AddDirector(true)}
                        ></FontAwesomeIcon>
                      </span>
                    </p>

                    <Accordion defaultActiveKey="primaryApplnPersonalInfo">
                      <Card className="card-outer">
                        <Accordion.Toggle
                          as={Card.Header}
                          eventKey="primaryBankInfo"
                          className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                        >
                          <h5>Directors Details </h5>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="primaryBankInfo">
                          <Card.Body className="card-Background Scroll-Card-Data">
                           {fpodirectors.length>0?
                           
                            <Table
                              striped
                              bordered
                              hover
                              className="turnOver-table"
                            >
                              <thead>
                                <tr className="top-table-heading">
                                  <th>Name</th>
                                  <th>Phone No</th>
                                  <th>Gender</th>
                                  <th>Village</th>
                                  <th>Joining Date</th>
                                  <th> </th>
                                </tr>
                              </thead>
                              <tbody className="remove-backgroundTable">
                                {fpodirectors.map((details) => (
                                  <tr>
                                    <td> {details.name}</td>
                                    <td>{details.phone_no} </td>
                                    <td>
                                      {!["Male", "Female", "Others"].includes(
                                        details.gender
                                      )
                                        ? details.gender === "1"
                                          ? "Male"
                                          : details.gender === "2"
                                          ? "Female"
                                          : "Others"
                                        : details.gender}
                                    </td>
                                    <td>{details.village} </td>
                                    <td>{details.joining_date} </td>
                                    <td>
                                      <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        className="dvaraBrownText"
                                        style={{cursor:"pointer"}}
                                        onClick={() =>
                                          DirectorModal(true, details)
                                        }
                                      ></FontAwesomeIcon>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            :<p className="no-dataClass2">No Data to Display</p>}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                  <Modal
                    show={DirectormodalIsOpen}
                    onHide={DirectorhideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Edit Director Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo2"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.direcnameclass}
                                value={this.state.direc_name}
                                onChange={this.handleDirecName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText formWeight"
                              column="sm"
                              lg={2}
                            >
                              Phone No
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                name="crop"
                                maxlength={10}
                                className={this.state.direcphoneclass}
                                value={this.state.direc_phone}
                                onChange={this.handledirecPhone}
                              />
                              <p className="requiredfields">
                                {this.state.phonefielddirecmessage}
                              </p>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Gender
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                // size="sm"
                                as="select"
                                type="text"
                                className={this.state.direcgenderclass}
                                value={this.state.direc_gender}
                                onChange={this.handledirecGender}
                              >
                                <option value="">Select Gender </option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3"> Others</option>
                              </Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Village
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.direcvillageclass}
                                value={this.state.direc_village}
                                onChange={this.handledirecVillage}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Joining Date
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="date"
                                className={this.state.direcjoiningclass}
                                value={this.state.direc_joining}
                                onChange={this.handledirecDate}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Priority
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                className={this.state.direcpriorityclass}
                                value={this.state.priority}
                                onChange={this.handledirecPriority}
                              />
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage2}
                      </p>
                      <Button variant="secondary" onClick={DirectorhideModal}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.DirectorSendDetails}
                        disabled={isDirectorUpdating}
                      >
                        Save Changes
                        {isDirectorUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Modal
                    show={CreateDirectormodalIsOpen}
                    onHide={AddDirectorhide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Add Director Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo6"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.adddirecnameclass}
                                value={this.state.adddirec_name}
                                onChange={this.handleAddDirecName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText formWeight"
                              column="sm"
                              lg={2}
                            >
                              Phone No
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                name="crop"
                                maxLength={10}
                                className={this.state.adddirecphoneclass}
                                value={this.state.adddirec_phone}
                                onChange={this.handleAdddirecPhone}
                              />
                              <p className="requiredfields">
                                {this.state.phonefielddirecaddmessage}
                              </p>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Gender
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                // size="sm"
                                as="select"
                                type="text"
                                className={this.state.adddirecgenderclass}
                                value={this.state.adddirec_gender}
                                onChange={this.handleAdddirecGender}
                              >
                                <option>Select Gender </option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3">Others</option>
                              </Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Village
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.adddirecvillageclass}
                                value={this.state.adddirec_village}
                                onChange={this.handleAdddirecVillage}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Joining Date
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="date"
                                className={this.state.adddirecjoiningclass}
                                value={this.state.adddirec_joining}
                                onChange={this.handleAdddirecDate}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Priority
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                className={this.state.adddirecpriorityclass}
                                value={this.state.addpriority}
                                onChange={this.handleAdddirecPriority}
                              />
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage}
                      </p>
                      <Button variant="secondary" onClick={AddDirectorhide}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.CreateDirectorSendDetails}
                        disabled={isDirectorCreating}
                      >
                        Save Changes
                        {isDirectorCreating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <div className="organization-box-details">
                    <h4 className="heading-color">Farmer Interest Group</h4>
                    <p style={{marginBottom:"10px"}}>
                      No. of FIGs : {this.FIGNo()}
                      <span>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="dvaraBrownText shift-right-icon"
                          onClick={() => AddFIG(true)}
                        ></FontAwesomeIcon>
                      </span>
                    </p>

                    <Accordion defaultActiveKey="primaryApplnPersonalInfo">
                      <Card className="card-outer">
                        <Accordion.Toggle
                          as={Card.Header}
                          eventKey="primaryBankInfo"
                          className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                        >
                          <h5>FIG Details </h5>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="primaryBankInfo">
                          <Card.Body className="card-Background Scroll-Card-Data">
                           {fpofiglist.length>0?
                           
                            <Table
                              striped
                              bordered
                              hover
                              className="turnOver-table"
                            >
                              <thead>
                                <tr className="top-table-heading">
                                  {/* <th>Sl No.</th> */}
                                  <th>Name of FIG</th>
                                  <th>Village Name</th>
                                  <th>Remarks</th>
                                  <th> </th>
                                </tr>
                              </thead>
                              <tbody className="remove-backgroundTable">
                                {fpofiglist.map((details) => (
                                  <tr>
                                    {/* <td> {details.Slno}</td> */}
                                    <td>{details.name_of_fig} </td>
                                    <td>{details.village} </td>
                                    <td>{details.remarks} </td>
                                    <td>
                                      <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        className="dvaraBrownText"
                                        style={{cursor:"pointer"}}
                                        onClick={() =>
                                          FIGModal(true, details)
                                        }
                                      ></FontAwesomeIcon>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            :<p className="no-dataClass2">No Data to Display</p>}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                  <Modal
                    show={FIGmodalIsOpen}
                    onHide={FIGhideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Edit FIG Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo2"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Name of FIG
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.FIGnameclass}
                                value={this.state.FIG_name}
                                onChange={this.handleFIGName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Village Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.FIGvillageclass}
                                value={this.state.FIG_village}
                                onChange={this.handleFIGVillage}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Remarks
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                placeholder="Remarks"
                                className={this.state.FIGremarksclass}
                                value={this.state.FIG_remarks}
                                onChange={this.handleFIGRemarks}
                                >
          
                                </Form.Control>
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage2}
                      </p>
                      <Button variant="secondary" onClick={FIGhideModal}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.FIGSendDetails}
                        disabled={isFIGUpdating}
                      >
                        Save Changes
                        {isFIGUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  
                  <Modal
                    show={CreateFIGmodalIsOpen}
                    onHide={AddFIGhide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Add FIG Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo6"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Name of FIGs
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.addFIGnameclass}
                                value={this.state.addFIG_name}
                                onChange={this.handleAddFIGName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText formWeight"
                              column="sm"
                              lg={2}
                            >
                              Village
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                name="crop"
                                className={this.state.addFIGvillageclass}
                                value={this.state.addFIG_village}
                                onChange={this.handleAddFIGVillage}
                              />
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Remarks
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                placeholder="Remarks"
                                className={this.state.addFIGremarksclass}
                                value={this.state.addFIG_remarks}
                                onChange={this.handleAddFIGRemarks}
                                >          
                                </Form.Control>
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage}
                      </p>
                      <Button variant="secondary" onClick={AddFIGhide}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.CreateFIGSendDetails}
                        disabled={isFIGCreating}
                      >
                        Save Changes
                        {isFIGCreating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <div className="organization-box-details">
                    <h4 className="heading-color">LICENSE STATUS</h4>

                    <table className="lisence-table-alingment">
                      <tr>
                        <td className="Lisense-Name">Seed License :</td>
                        <td>
                          {fpoDetails.seed_license === true ? "Yes" : "No"}
                        </td>
                        <td>
                          {fpoDetails.seed_license === true
                            ? fpoDetails.seed_license_no
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="Lisense-Name">Agrochemical License:</td>
                        <td>
                          {fpoDetails.agrochem_license === true ? "Yes" : "No"}
                        </td>
                        <td>
                          {fpoDetails.agrochem_license === true
                            ? fpoDetails.agrochem_license_no
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="Lisense-Name">Fertilizer License:</td>
                        <td>
                          {fpoDetails.fert_license === true ? "Yes" : "No"}
                        </td>
                        <td>
                          {fpoDetails.fert_license === true
                            ? fpoDetails.fert_license_no
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="Lisense-Name"> APMC License:</td>
                        <td>
                          {fpoDetails.apmc_license === true ? "Yes" : "No"}
                        </td>
                        <td>
                          {fpoDetails.apmc_license === true
                            ? fpoDetails.apmc_license_no
                            : "-"}
                        </td>
                      </tr>
                      {/* <tr>
                        <td className="Lisense-Name"> PAN No:</td>
                        <td>Yes</td>
                        <td>{fpoDetails.pan_no}</td>
                      </tr> */}
                    </table>
                  </div>
                </div>
              </Col>

              <Col md="4">
                <Accordion defaultActiveKey="primaryApplnPersonalInfo">
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryStaffInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> No. Of Staffs</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryStaffInfo">
                      <Card.Body className="card-Background required-fontRight">
                        <p>
                          <span
                            className="pencil-edi"
                            onClick={() =>
                              StaffModal(true, this.state.fpoDetails)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="dvaraBrownText"
                            ></FontAwesomeIcon>
                          </span>
                        </p>

                        {/* <p>
                          CEO :<span>{fpoDetails.ceo_count}</span>
                        </p>
                        <p>
                          FR :<span>{fpoDetails.krishaksaathi_count}</span>
                        </p>
                        <p>
                          Accountant Count :
                          <span>{fpoDetails.accountant_count}</span>
                        </p>
                        <p>
                          Staff Count :<span>{fpoDetails.staff_count}</span>
                        </p>
                        <p>
                          Other :<span>{fpoDetails.other_count}</span>
                        </p> */}
                         <Row>
                          <Col md="6" className="required-fontRight">CEO :</Col><Col md="6">{fpoDetails.ceo_count}</Col>
                        
                       
                         <Col md="6" className="required-fontRight"> FR :</Col><Col md="6">{fpoDetails.krishaksaathi_count}</Col>
                        
                       
                         <Col md="6" className="required-fontRight"> Accountant Count :</Col><Col md="6">
                          {fpoDetails.accountant_count}</Col>
                        
                       
                         <Col md="6" className="required-fontRight"> Staff Count : </Col><Col md="6">{fpoDetails.staff_count}</Col>
                        
                       
                         <Col md="6" className="required-fontRight"> Other : </Col><Col md="6">{fpoDetails.other_count}</Col>
                        </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryFPOInceptionInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> FPO Inception</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryFPOInceptionInfo">
                      <Card.Body className="card-Background">
                        <Row className="required-lineHeight">
                          <Col className="required-fontRight">FPO Month :</Col>
                          <Col>
                            {objDate.toLocaleString("default", {
                              month: "long",
                            })}
                          </Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col className="required-fontRight">
                            Year Of Establishment :{" "}
                          </Col>
                          <Col>{objDate.getFullYear()} </Col>
                        </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryBankInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> Bank Details </h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryBankInfo">
                      <Card.Body className="card-Background">
                       {fpobankdetails.length>0?
                        <Carousel>
                          
                          {fpobankdetails.map((data) => (
                            <Carousel.Item>
                              <p>
                                <span
                                  // style={{ position: "relative", left: "70%" }}
                                  className="Update-contactEdit"
                                  onClick={() => CreateBankModal(true)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="dvaraBrownText"
                                  ></FontAwesomeIcon>
                                </span>
                                <span
                                  className="pencil-edi"
                                  onClick={() => showBankModal(true, data)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="dvaraBrownText"
                                  ></FontAwesomeIcon>
                                </span>
                              </p>
                          
                               <Row style={{fontSize:"14px",marginTop:"15px"}}>
                                <Col md="6" className="required-fontRight">
                                  Name Of Bank: </Col><Col md="6">{data.bank_name} </Col>
                                
                               <Col md="6" className="required-fontRight">
                                  Account In the Name Of:</Col>
                                  <Col md="6">{data.account_holder_name}</Col>
                                
                               <Col md="6" className="required-fontRight">
                                  Account No: </Col><Col md="6"> {data.acc_no}</Col>
                                
                               <Col md="6" className="required-fontRight">
                                  Name Of Branch : </Col><Col md="6">{data.branch}</Col>
                                
                                <Col md="6" className=" required-fontRight requiredMargin-Carousel">
                                  IFSC Code : </Col><Col md="6">{data.ifsc_code} </Col>
                                
                              </Row>
                            </Carousel.Item>
                          ))}
                        </Carousel>
                        : <div> 
                             <p>
                                <span
                                  // style={{ position: "relative", left: "70%" }}
                                  className="Update-contactEdit2"
                                  onClick={() => CreateBankModal(true)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="dvaraBrownText"
                                  ></FontAwesomeIcon>
                                </span>
                               
                              </p>
                          
                          
                         <p style={{textAlign:"center"}}> No Data to Display</p></div>}
                      </Card.Body>
                    </Accordion.Collapse>
                    <Modal
                      show={modalIsOpen}
                      onHide={hideModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Bank Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo3"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Bank Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.banknameclass}
                                value={this.state.bank}
                                onChange={this.handleBankName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Account Holder Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.bankaccountclass}
                                value={this.state.account_name}
                                onChange={this.handleHolderName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Account Number
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.banknoclass}
                                value={this.state.account_number}
                                onChange={this.handleAccountNumber}
                              />
                              <p className="requiredfields">
                                {this.state.bankfieldmessage}
                              </p>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Branch
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.bankbranchclass}
                                value={this.state.bank_branch}
                                onChange={this.handleBankBranch}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              IFSC Number
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                maxlength="11"
                                className={this.state.bankifscclass}
                                value={this.state.bank_ifsc}
                                onChange={this.handleBankIfsc}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <p className="requiredfields">
                          {this.state.errorbankmessage}
                        </p>
                        <Button variant="secondary" onClick={hideModal}
                        disabled={isBankUpdating}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={this.BankDetails}>
                          Save Changes
                          {isBankUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* modal bank creation */}

                    <Modal
                      show={CreateBankmodalIsOpen}
                      onHide={CreateBankhideModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title> Add Bank Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfocreatebank"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Bank Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.createbanknameclass}
                                value={this.state.createbank}
                                onChange={this.handleCreateBankName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Account Holder Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.createbankaccountclass}
                                value={this.state.createaccount_name}
                                onChange={this.handleCreateHolderName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Account Number
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.createbanknoclass}
                                value={this.state.createaccount_number}
                                onChange={this.handleCreateAccountNumber}
                              />
                              <p className="requiredfields">
                                {this.state.createbankfieldmessage}
                              </p>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Branch
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.createbankbranchclass}
                                value={this.state.createbank_branch}
                                onChange={this.handleCreateBankBranch}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              IFSC Number
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                maxlength="11"

                                className={this.state.createbankifscclass}
                                value={this.state.createbank_ifsc}
                                onChange={this.handleCreateBankIfsc}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Bank Priority
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="number"
                                size="sm"
                                className={this.state.createbankPriorityclass}
                                value={this.state.createbankPriority}
                                onChange={this.handleCreateBankPriority}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <p className="requiredfields">
                          {this.state.createerrorbankmessage}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={CreateBankhideModal}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={this.CreateBankSendDetails}
                          disabled={isBankCreating}
                        >
                          Save Changes
                          {isBankCreating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <span></span>
                          )}
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryFarmersInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> No. Of Farmers Associated</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryFarmersInfo">
                      <Card.Body className="card-Background required-fontRight">
                        {/* <p>
                          Data: <span>{this.state.farmers_count}</span>
                        </p>
                        <p>
                          Farmers using Android app: <span>{this.state.farmers_count}</span>
                        </p> */}
                        <Row>
                          <Col md="8" className="required-fontRight">Total Farmers :</Col><Col md="4">{this.state.farmers_count}</Col>
                        
                       
                         <Col md="8" className="required-fontRight"> No. of Farmers installed Farmers App:</Col><Col md="4">{this.state.fpoUsingAndroidApp}</Col>
                         </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryVillagesInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> No. Of Villages Serving In</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryVillagesInfo">
                      <Card.Body className="card-Background">
                       {fpoampsmarket.length>0?
                        <Table
                          striped
                          bordered
                          hover
                          className="turnOver-table"
                        >
                          <thead>
                            <tr className="top-table-heading">
                              <th>Name</th>
                              <th>Distance</th>
                            </tr>
                          </thead>
                          <tbody className="remove-backgroundTable">
                            {fpoampsmarket.map((details) => (
                              <tr>
                                <td> {details.name}</td>
                                <td>{details.distance} </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
 :<p className="no-dataClass">No Data to Display</p>}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryAnalyticInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> Analytic Update </h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryAnalyticInfo">
                      <Card.Body className="card-Background required-fontRight">
                        {/* <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Mean KhetScore :
                          </Col>
                          <Col md="4">
                            {" "}
                            {parseFloat(this.state.mean_khetscore).toFixed(2)}
                          </Col>
                        </Row> */}
                        <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Average Landholding :{" "}
                          </Col>
                          <Col md="4">
                            {" "}
                            {parseFloat(this.state.avg_landholding).toFixed(2)}
                          </Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            {" "}
                            Average Number Of Farmer Site :{" "}
                          </Col>
                          <Col md="4">
                            {" "}
                            {parseFloat(this.state.avg_farmer_site).toFixed(
                              2
                            )}{" "}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>

                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryBusinessInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5>Business Activity</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryBusinessInfo">
                      <Card.Body className="card-Background">
                        <p>
                          <span className="pencil-edit">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="dvaraBrownText"
                              onClick={() => BusinessModalCreation(true)}
                            ></FontAwesomeIcon>
                          </span>
                        </p>
                        {fpobusiness.length>0?
                        <table
                          className="businessTable"
                          style={{ marginTop: "30px" }}
                        >
                          {fpobusiness.map((data) => (
                            <tr>
                              <td className="Lisense-Name">
                                {data.business_type} :
                              </td>
                              <td>{data.deal === true ? "Yes" : "No"}</td>
                              <td>
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
                                  className="dvaraBrownText"
                                  onClick={() => BusinessModal(true, data)}
                                ></FontAwesomeIcon>
                              </td>
                            </tr>
                          ))}
                        </table>
  :<p className="no-dataClass">No Data to Display</p>}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Modal
                    show={StaffmodalIsOpen}
                    onHide={StaffhideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Edit Staff Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo5"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              CEO
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="number"
                                size="sm"
                                value={this.state.ceo_count}
                                required
                                onChange={this.handleCeoCount}
                              ></Form.Control>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText formWeight"
                              column="sm"
                              lg={2}
                            >
                              FR
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                name="crop"
                                value={this.state.FR_count}
                                onChange={this.handleFrCount}
                              />
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Accountant Count
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                value={this.state.accountant_count}
                                onChange={this.handleAccountantCount}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Staff Count
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                value={this.state.staff_count}
                                onChange={this.handleStaffCount}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Other
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="number"
                                value={this.state.other_count}
                                onChange={this.handleOtherCount}
                              />
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={StaffhideModal}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={this.StaffSendDetails}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryCapitalInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5>Share Capital</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryCapitalInfo">
                      <Card.Body className="card-Background">
                      <Table
                              striped
                              bordered
                              hover
                              className="turnOver-table"
                            >
                              <thead>
                                <tr className="top-table-heading">
                                  <th>Share Capital</th>
                                  <th>Year</th>
                                  <th>Value</th>
                                  
                                </tr>
                              </thead>
                              <tbody className="remove-backgroundTable">
                                <tr>
                                  <td>Current Year</td>
                                  <td>{this.state.currentYear}</td>
                                  <td>{fpoDetails.curent_year_share_cap ? fpoDetails.curent_year_share_cap: "NA"}</td>
                                </tr>
                                <tr>
                                  <td>Last Year</td>
                                  <td>{this.state.lastYear}</td>
                                  <td>{fpoDetails.last_year_share_cap ? fpoDetails.last_year_share_cap: "NA"}</td>
                                </tr>
                                <tr>
                                  <td>Second Last Year</td>
                                  <td>{this.state.lastSecondYear}</td>
                                  <td>{fpoDetails.second_last_year_share_cap ? fpoDetails.second_last_year_share_cap: "NA"}</td>
                                </tr>
                                <tr>
                                  <td>Third Last Year</td>
                                  <td>{this.state.lastThirdYear}</td>
                                  <td>{fpoDetails.third_last_year_share_cap ? fpoDetails.third_last_year_share_cap: "NA"}</td>
                                </tr>
                              </tbody>
                        </Table>
                        {/* <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Current Year Share Capital:{" "}
                          </Col>
                          <Col md="4">{fpoDetails.curent_year_share_cap}</Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Last Year Share Capital:
                          </Col>
                          <Col md="4"> {fpoDetails.last_year_share_cap}</Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Second Last Year Share Capital:
                          </Col>
                          <Col md="4">
                            {" "}
                            {fpoDetails.second_last_year_share_cap}
                          </Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col md="8" className="required-fontRight">
                            Third Last Year Share Capital:
                          </Col>
                          <Col md="4">
                            {" "}
                            {fpoDetails.third_last_year_share_cap}
                          </Col>
                        </Row> */}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryTurnOverInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5>TurnOver and Profits</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryTurnOverInfo">
                      <Card.Body className="card-Background">
                       {fpoturnover.length>0?
                        <Table
                          striped
                          bordered
                          hover
                          className="turnOver-table"
                        >
                          <thead>
                            <tr  className="top-table-heading">
                              <th>Year</th>
                              <th>Value</th>
                              <th>Profits</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fpoturnover.map((data) => (
                              <tr>
                                <td>{data.year_span}</td>
                                <td>{data.turn_over}</td>
                                <td>{data.profits}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
  :<p className="no-dataClass">No Data to Display</p>}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryPersonalDetailsInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5>FPO Details</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryPersonalDetailsInfo">
                      <Card.Body className="card-Background">
                        <Row className="required-lineHeight">
                          <Col className="required-fontRight">
                            Registration No :
                          </Col>{" "}
                          <Col>{fpoDetails.registration_no}</Col>
                        </Row>
                        <Row className="required-lineHeight">
                          <Col className="required-fontRight">GST No : </Col>
                          <Col> {fpoDetails.gst_no}</Col>
                        </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="primaryContactDetailsInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                      style={{height:"45px"}}
                    >
                      <h5> Important Contact Details</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="primaryContactDetailsInfo">
                      <Card.Body className="card-Background required-fontRight">
                       {fpocontacts.length>0?
                        <Carousel>
                          {fpocontacts.map((data) => (
                            <Carousel.Item>
                              <p>
                               
                                <span
                                 
                                  className="create-contactPlus"
                                  onClick={() => showContactModal(true)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="dvaraBrownText"
                                  ></FontAwesomeIcon>
                                </span>
                                <span
                                  // className="pencil-edi"
                                   className="Update-contactEdit"
                                 
                                  onClick={() => showContactModal(true, data)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="dvaraBrownText"
                                  ></FontAwesomeIcon>
                                </span>
                              </p>
                              {/* <p>
                               
                                Name: <span>{data.name}</span>
                              </p>
                              <p>
                                Department:
                                <span> {data.department}</span>
                              </p>
                              <p style={{marginBottom:"28px"}}>
                               
                                Number: <span> {data.number}</span>
                              </p> */}
                               <Row style={{marginTop:"15px"}}>
                               <Col md="4" className="required-fontRight">
                                Name: </Col> <Col md="8">{data.name}</Col>
                              
                               <Col md="4" className="required-fontRight"> Department:</Col><Col md="8">
                                 {data.department}</Col>
                             
                              <Col md="4" className="required-fontRight requiredMargin-Carousel">
                               
                                Number:</Col> <Col md="8"> {data.number}</Col>
                              </Row>
                            </Carousel.Item>
                          ))}
                        </Carousel>
  :
  <div> 
  <p>
                               
                               <span
                                
                                 className="create-contactPlus2"
                                 onClick={() =>showContactModal(true)}
                               >
                                 <FontAwesomeIcon
                                   icon={faPlus}
                                   className="dvaraBrownText"
                                 ></FontAwesomeIcon>
                               </span>
                             
                             </p>

                             <p style={{textAlign:"center"}}> No Data to Display</p>
</div>}
  
  
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Card className="card-outer">
                    <Accordion.Toggle
                      as={Card.Header}
                      eventKey="specialServiceDetailsInfo"
                      className="dvaraBrownText accordIcon accordionTitle personalInfo collapsed adding-Icon"
                    >
                      <h5>Special Services</h5>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="specialServiceDetailsInfo">
                      <Card.Body className="card-Background">
                      <Table
                              striped
                              bordered
                              hover
                              className="turnOver-table"
                            >
                              <thead>
                                <tr className="top-table-heading">
                                  <th>Category</th> 
                                  <th>Services</th>                                                 
                                </tr>
                              </thead>
                              {console.log(this.state.specialServices)}                            
                             {this.state.specialServices?.map((e,ind) =>(                           
                             <tbody className="remove-backgroundTable">                                
                                <tr key={ind}>
                                  <td><li>{e.services__service_category__category_name}</li></td>
                                  <td><li>{e.services__service_name}</li></td>                                
                                </tr>                                
                              </tbody> 
                              ))}
                        </Table>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <Modal
                    show={ContactmodalIsOpen}
                    onHide={ContacthideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                         {this.state.is_contact_edit===true?"Edit": "Add"} Contact Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="farmersUploadWrap">
                        <Form
                          encType="multipart/form-data"
                          method="post"
                          name="fileinfo4"
                          autocomplete="off"

                        >
                          <br></br>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Name
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className={this.state.contactclass}
                                value={this.state.contact_name}
                                onChange={this.handleContactName}
                              ></Form.Control>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalCrop"
                          >
                            <Form.Label
                              className="dvaraBrownText formWeight"
                              column="sm"
                              lg={2}
                            >
                              Department
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                name="crop"
                                className={this.state.departmentclass}
                                value={this.state.contact_department}
                                onChange={this.handleContactDepartment}
                              />
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalBrand"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Number
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                size="sm"
                                type="text"
                                className={this.state.contactnumberclass}
                                value={this.state.contact_number}
                                onChange={this.handleContactNumber}
                              ></Form.Control>
                              <p className="requiredfields">
                                {this.state.contactnumbermessage}
                              </p>
                            </Col>
                          </Form.Group>
                        </Form>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.errormessage3}
                      </p>
                      <Button variant="secondary" onClick={ContacthideModal}>
                        Close
                      </Button>
                   
                      <Button variant="primary" 
                      disabled={isContactUpdating}
                      onClick={this.updateContDetails}>
                        Save Changes
                        {isContactUpdating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <span></span>
                          )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  {/* contactModal2 for contact */}
              

                  <Modal
                    show={BusinessmodalIsOpen}
                    onHide={BusinesshideModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Edit Business Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form
                        encType="multipart/form-data"
                        method="post"
                        name="fileinfo9"
                        autocomplete="off"

                      >
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formHorizontalInputType"
                        >
                           <Form.Label
                            column="sm"
                            lg={2}
                            className="dvaraBrownText formWeight"
                          >
                            Business Type
                          </Form.Label>
                          <Col sm={6}>
                            <Form.Control
                              type="text"
                              size="sm"
                              className={this.state.businessnameclass}
                              value={this.state.businessname}
                              onChange={this.handleBusinessName}
                            ></Form.Control>
                          </Col>
                          </Form.Group>
                          {/* <Form.Group>
                          <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Deal
                            </Form.Label>
                          <Col sm={6}>
                          
                            
                           
                            <Form.Check
                              value={this.state.businessdeal}
                              className={this.state.businessdealclass}
                              onChange={this.handleBusinessDeal}
                              checked={this.state.businessdeal}
                            />
                          </Col>
                        </Form.Group> */}
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formHorizontalInputType"
                          >
                            <Form.Label
                              column="sm"
                              lg={2}
                              className="dvaraBrownText formWeight"
                            >
                              Deal
                            </Form.Label>
                            <Col sm={6}>
                            <Form.Check
                              value={this.state.businessdeal}
                              className={this.state.businessdealclass}
                              onChange={this.handleBusinessDeal}
                              checked={this.state.businessdeal}
                            />
                            </Col>
                          </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.businessnameerrorclass}
                      </p>
                      <Button variant="secondary" onClick={BusinesshideModal}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.SendDataBusinessModal}
                        disabled={isBusinessUpdating}
                      >
                        Save Changes
                        {isBusinessUpdating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <span></span>
                          )}
                      </Button>
                      
                    </Modal.Footer>
                  </Modal>
                  <Modal
                    show={CreationBusinessmodalIsOpen}
                    onHide={BusinesshideModalCreation}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Modal.Title>
                        &nbsp;&nbsp;
                        <span className="dvaraBrownText">
                          Create Business Details
                        </span>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form
                        encType="multipart/form-data"
                        method="post"
                        name="fileinfo9 business creation"
                        autocomplete="off"

                      >
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formHorizontalInputType"
                        >
                          <Form.Label
                            column="sm"
                            lg={2}
                            className="dvaraBrownText formWeight"
                          >
                            Business Type
                          </Form.Label>
                          <Col sm={6}>
                            <Form.Control
                              type="text"
                              size="sm"
                              className={this.state.createbusinessnameclass}
                              value={this.state.createbusinessname}
                              onChange={this.handleCreateBusinessName}
                            ></Form.Control>
                          </Col>
                        </Form.Group>
                        <Form.Group
                         as={Row}
                         className="mb-3"
                         controlId="formHorizontalInputType">
                          <Form.Label
                            column="sm"
                            lg={2}
                            className="dvaraBrownText formWeight"
                          >
                            Deal
                          </Form.Label>
                          <Col sm={6}>
                          
                            <Form.Check
                              value={this.state.createbusinessdeal}
                              className={this.state.createbusinessdealclass}
                              onChange={this.handleCreateBusinessDeal}
                              checked={this.state.createbusinessdeal}
                            />
                          </Col>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <p className="requiredfields">
                        {this.state.createbusinessnameerrorclass}
                      </p>
                      <Button
                        variant="secondary"
                        onClick={BusinesshideModalCreation}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={this.CreateSendDataBusinessModal}
                        disabled={isBusinessCreating}
                      >
                        Save Changes
                        {isBusinessCreating ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <span></span>
                          )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Accordion>
              </Col>
            </Row>
            <h4 className="mt-3 all-headings" style={{padding:"10px"}}>Compliance <span className="viewhistory"><a href="#"   onClick={() => this.navigateToPage()}>View History</a></span></h4>

            <div className="business-activity">
             
              <Tabs
                defaultActiveKey="Mandatory"
                transition={false}
                id="noanim-tab-example"
                className="mb-3 compliance-tab"
              >
                <Tab eventKey="Mandatory" title="Mandatory Compliance">
                {this.state.mandatoryList.length>0?
                  <Slider {...settings}>
                    {this.state.mandatoryList.map((data) => (
                      <div>
                      
                        <div className="compliance-box">
                          <Row>
                            <Col md="4" className="compliance-images">
                              <img src={board} />
                            </Col>
                            <Col md="6">
                              <h6>{data.meeting_name}</h6>
                            </Col>
                          </Row>
                          <p>
                            <span className="required-fontRight2">
                              Tentitative Date:
                            </span>
                            {data.due_date}
                            <span>
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="dvaraBrownText shift-right-icon"
                                onClick={() =>
                                  ComplianceUpdateModal(true, data)
                                }
                              ></FontAwesomeIcon>
                            </span>
                          </p>
                          <p>
                            {" "}
                            <span className="required-fontRight2">
                              Status :{" "}
                            </span>{" "}
                            {data.status}
                          </p>
                        </div>
                       
                      </div>
                    ))}
                  </Slider>
                  :   <div> <p className="nomeeting"> No Data to Display</p> </div>}
                </Tab>
                <Tab eventKey="Finance" title="Finance and Tax Compliance">
                {this.state.FinanceList.length>0?

                  <Slider {...settings}>
                    {this.state.FinanceList.map((data) => (
                      <div>
                      
                        <div className="compliance-box">
                          <Row>
                            <Col md="4" className="compliance-images">
                              <img src={board} />
                            </Col>
                            <Col md="6">
                              <h6>{data.meeting_name}</h6>
                            </Col>
                          </Row>
                          <p>
                            <span className="required-fontRight2">
                              Tentitative Date:
                            </span>
                            {data.due_date}
                            <span>
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="dvaraBrownText shift-right-icon"
                                onClick={() =>
                                  ComplianceUpdateModal(true, data)
                                }
                              ></FontAwesomeIcon>
                            </span>
                          </p>
                          <p>
                            <span className="required-fontRight2">
                              Status :
                            </span>{" "}
                            {data.status}
                          </p>
                        </div>
                      
                      </div>
                    ))}
                  </Slider>
                  :   <div> <p className="nomeeting"> No Data to Display</p> </div>}
                </Tab>
                <Tab eventKey="Event" title="Event Based">
                {this.state.EventList.length>0?

                  <Slider {...settings}>
                    {this.state.EventList.map((data) => (
                      <div>
                      
                        <div className="compliance-box">
                          <Row>
                            <Col md="4" className="compliance-images ">
                              <img src={board} />
                            </Col>
                            <Col md="6">
                              <h6>{data.meeting_name}</h6>
                            </Col>
                          </Row>
                          <p>
                            <span className="required-fontRight2">
                              Tentitative Date:
                            </span>
                            {data.due_date}
                            <span>
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="dvaraBrownText shift-right-icon"
                                onClick={() =>
                                  ComplianceUpdateModal(true, data)
                                }
                              ></FontAwesomeIcon>
                            </span>
                          </p>
                          <p>
                           
                            <span className="required-fontRight2">
                              Status :
                            </span>
                            {data.status}
                          </p>
                        </div>
                      
                      </div>
                    ))}
                  </Slider>
                  :   <div> <p className="nomeeting"> No Data to Display</p> </div>}
                </Tab>
                <Tab eventKey="miscellaneous" title="Miscellaneous">
                   <FontAwesomeIcon
                    icon={faPlus}
                    className=" dvaraBrownText "
                    style={{
                      position: "relative",
                      left: "96%",
                      cursor: "pointer",
                    }}
                    onClick={() => AddComplianceModal(true)}
                  ></FontAwesomeIcon>
                   {this.state.miscellaneous.length>0?
                  <Slider {...settings}>
                 

                    {this.state.miscellaneous.map((data) => (
                      <div>
                      
                        <div className="compliance-box">
                          <Row>
                            <Col md="4" className="compliance-images">
                              <img src={board} />
                            </Col>
                            <Col md="6">
                              <h6>{data.meeting_name}</h6>
                            </Col>
                          </Row>
                          <p>
                            <span className="required-fontRight2">
                              Tentitative Date:
                            </span>
                            {data.due_date}
                            <span>
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="dvaraBrownText shift-right-icon"
                                onClick={() =>
                                  ComplianceUpdateModal(true, data)
                                }
                              ></FontAwesomeIcon>
                            </span>
                          </p>
                          <p>
                            <span className="required-fontRight2">
                              Status :
                            </span>
                            {data.status}
                          </p>
                        </div>
                       
                      </div>
                    ))}
                  
                  </Slider>
                  :   <div> <p className="nomeeting"> No Data to Display</p> </div>}
                </Tab>
              </Tabs>
            </div>
            <Modal
              show={CompliancemodalIsOpen}
              onHide={ComplianceUpdatehideModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title>
                  &nbsp;&nbsp;
                  <span className="dvaraBrownText">
                    Edit Compliance Details
                  </span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="farmersUploadWrap">
                  <Form
                    encType="multipart/form-data"
                    method="post"
                    name="fileinfo"
                    autocomplete="off"

                  >
                    <br></br>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Meeting Name
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          size="sm"
                          disabled={this.ComplianceDisableEdit()}
                          className={this.state.upcompmeetingtypeclass}
                          value={this.state.compliance_meetingtype}
                          onChange={this.handleComplianceMeetingType}
                        ></Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Meeting Due Date
                      </Form.Label>
                      <Col sm={8}>
                     
                        <Form.Control
                          disabled={this.ComplianceDisableEdit()}
                          type="date"
                          size="sm"
                          className={this.state.upcompdateclass}
                          value={this.state.compliance_date}
                          onChange={this.handleComplianceMeetingDate}
                        ></Form.Control>
                      
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Meeting Status
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          as="select"
                          size="sm"
                          className={this.state.upcompstatustypeclass}
                          value={this.state.compliance_status}
                          onChange={this.handleComplianceMeetingStatus}
                        >
                        
                            <option>Completed</option>

                          <option>Pending</option>
                        
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Completion Date
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="date"
                          size="sm"
                          min={this.state.compliance_min_date.toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          className={this.state.completiondataclass}
                          disabled={this.ComplianceCompletionDisableEdit2()}
                          onChange={this.handleCompletionDate}
                         
                        ></Form.Control>
                      </Col>
                    </Form.Group>

                 
                  </Form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <p className="requiredfields">
                  {this.state.compilanceupdatemessage}
                </p>
                <Button variant="secondary" onClick={ComplianceUpdatehideModal}>
                  Close
                </Button>
                <Button disabled={this.ComplianceCompletionDisableEdit()}
                  variant="primary"
                  onClick={this.sendComplianceUpdateDetails}
                >
                  Save Changes
                  {isCompUpdating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </Button>
              </Modal.Footer>
            </Modal>
            {/* 2 modal for creation */}
            <Modal
              show={CreateCompilancemodalIsOpen}
              onHide={AddCompilancehide}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title>
                  &nbsp;&nbsp;
                  <span className="dvaraBrownText">Add Compliance</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="farmersUploadWrap">
                  <Form
                    encType="multipart/form-data"
                    method="post"
                    name="fileinfo"
                    autocomplete="off"

                  >
                    <br></br>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Meeting Name
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="text"
                          size="sm"
                          className={
                            this.state.createcompliance_meetingtypeclass
                          }
                          value={this.state.createcompliance_meetingtype}
                          onChange={this.createComplianceMeetingType}
                        ></Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formHorizontalInputType"
                    >
                      <Form.Label
                        column="sm"
                        lg={4}
                        className="dvaraBrownText formWeight"
                      >
                        Meeting Due Date
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="date"
                          size="sm"
                          className={this.state.createcompliance_dateclass}
                          value={this.state.createcompliance_date}
                          onChange={this.createComplianceMeetingDate}
                        ></Form.Control>
                      </Col>
                    </Form.Group>
                 
                  </Form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <p className="requiredfields">
                  {this.state.errorcompilancemessage}
                </p>
                <Button variant="secondary" onClick={AddCompilancehide}>
                  Close
                </Button>
                <Button  disabled={isCompCreating} variant="primary" onClick={this.AddComplianceDetails}>
                  Save Changes
                  {isCompCreating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span></span>
                  )}
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="footer2 mt-3">
              <Row>
                <Col>
                  <div className="Dvara-Contact-details">
                    {/* <p>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="dvaraGreenText "
                        style={{
                          fontSize: "0.9rem",
                          marginLeft: "5px",
                          marginRight: "10px",
                        }}
                      />
                      Contact Details : dvara@dvara.com
                    </p>

                    <p>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="dvaraGreenText "
                        style={{
                          fontSize: "0.9rem",
                          marginLeft: "5px",
                          marginRight: "10px",
                        }}
                      />
                      Contact No: 99999999999
                    </p> */}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    );
  }
}