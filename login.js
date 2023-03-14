import React from 'react';

import '../assets/css/login.css';
import mainLogo from '../assets/img/doordrishti.png';



function login() {
    return (
        <div className="wrap loginBG">
            <div className="container main-block">
                <div className="card card-container card-basic">                    
                    <img id="profile-img" className="profile-img-card" alt="Dvara_Logo" src={mainLogo} />
                    <p id="profile-name" className="profile-name-card"></p>
                    
                        <span id="reauth-email" className="reauth-email"></span>
                        <input type="email" id="inputEmail" className="form-control form-blk" placeholder="Email address" required autofocus />
                        <input type="password" id="inputPassword" className="form-control form-blk" placeholder="Password" required />
                        
                        <button className="btn btn-lg btn-primary btn-basic" type="submit"><b>Login</b></button>
                </div>
            </div>
        </div>
    );
}

export default login;
