import { faRoad } from "@fortawesome/free-solid-svg-icons";
import React, { Component, useEffect } from "react";

import UserService from "../services/user.service";

var landHoldingMainCardValObj = {};

function RenderLandHoldingMainCards(getLandHoldingCardCategory){
    useEffect(() => {
        UserService.getLandholding(getLandHoldingCardCategory).then(
            response => {
            //  console.log(response.data.data);    
             landHoldingMainCardValObj = response.data.data;          
            },
            error => {
                console.log("error");
               
                // console.log( (error.response &&
                //     error.response.data &&
                //     error.response.data.message) ||
                //   error.message ||
                //   error.toString());
              
            }
          ); 
      }, []);

    
    return(landHoldingMainCardValObj);
}

export default RenderLandHoldingMainCards;