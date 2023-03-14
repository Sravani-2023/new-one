import Swal from 'sweetalert2'
import axios from "axios";

export const TriggerAlert = (success,errormessage,icon) => {
  if (errormessage == 'User not Authorised.'){
    setTimeout(axios.post("/admin/logout/", {}),7000)
    // window.location.reload();
  }
  else{
   return  Swal.fire({
    // position: 'center',
    icon: 'error',
    title: 'Oops...',
    backdrop:false,
    html: '<i style="color:red" class="fa fa-close"></i> <small>'+errormessage+"</small>",
    showConfirmButton: false,
    timer: 5000,
    showCloseButton: true,
  })
}
};

export const AlertMessage= (message,icon) => {
  
   return  Swal.fire({
    // position: 'center',
    icon: `${icon}`,
    title: 'Oops...',
    backdrop:false,
    html:'<span style="color:red">'+message +'</span>',
    showConfirmButton: false,
    timer: 5000,
    showCloseButton: true,
  })

};
export const ComplianceAlertMessage= (message) => {
  
  return  Swal.fire({

     icon: "success",
   title: '',
   backdrop:false,
   html:'<span style="color:red">'+message +'</span>',
   showConfirmButton: false,
   timer: 5000,
   showCloseButton: true,
 })
 

};


