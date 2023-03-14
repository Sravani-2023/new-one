import React from 'react';

import '../assets/css/dashboard.css';
import farmerIcon from '../assets/img/sickle.svg';
import landHoldingIcon from '../assets/img/farm.svg';
import croppingAreaIcon from '../assets/img/field.svg';

function daashboard() {
    return (
        <div className="wrap">
            <section className="mainWebContentSection">
                <div className="container">
                    <div className="row">
						<div className="col-md-12 col-lg-12 padding15">
						</div>
					</div>                  
                    
                        <div className="width-80 margin-auto">
                        <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-3 dashboardCard">
                                <div className="card-header dashboardCardTitle text-center dvaraBrownText">                                        
                                    Total farmers
                                </div>
                                <div className="card-body">
									<img src={farmerIcon} className="card main-icon dashBoardIcons" alt="farmers_Icon" />
								</div>
								<div className="card-footer dashboardCardVals text-center dvaraGreenText">                                        
                                    18
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card mb-3 dashboardCard">
                                <div className="card-header dashboardCardTitle text-center dvaraBrownText">                                        
                                    Total landholding
                                </div>
                                <div className="card-body">
									<img src={landHoldingIcon} className="card main-icon dashBoardIcons" alt="landholding_Icon"/> 
								</div>
								<div className="card-footer dashboardCardVals text-center dvaraGreenText">                                        
                                    237 Acres
                                </div>
							</div>
						</div>                        
						<div className="col-lg-4">
                            <div className="card mb-3 dashboardCard">
                                <div className="card-header dashboardCardTitle text-center dvaraBrownText">                                        
                                    Total Cropping Area
                                </div>
                                <div className="card-body">
									<img src={croppingAreaIcon} className="card main-icon dashBoardIcons" alt="totalCroppingArea_Icon" />
								</div>
								<div className="card-footer dashboardCardVals text-center dvaraGreenText">                                        
                                    200 Acres
                                </div>
							</div>
						</div>
                        </div>
                        </div>
					
			    </div>
            </section>
        </div>
    );
}

export default daashboard;