import React, {Component} from 'react';
import AuthService from "../services/auth.service";

import '../assets/css/sidebar.css';
import { Link } from "react-router-dom";
import Dashboard from '../components/dashboard.component';
import FarmerList from '../components/farmerlist.component';
import CropsList from '../components/crops.component';
import Landholding from '../components/landholding.component';


class Sidebar extends Component {
	constructor(props) {
	  super(props);
	//   this.gotoPages = this.gotoPages.bind(this);	
	  this.state = {
		showDashBoard: false,
		showFarmerList: false,
		currentUser: undefined,
		checkis_parent:false,
	  };
	}
	// gotoPages = (getPage) => {
	// 	//this.props.history.push("/"+getPage+"");
	// }
	componentDidMount() {
	  const user = AuthService.getCurrentUser();
  
	  if (user) {
		this.setState({
		  currentUser: user,
		  showDashBoard: true,
		  showFarmerList: true,
		  checkis_parent:user.is_parent,
		});
	  }
	}
  handleRemove=()=>{
	localStorage.removeItem("activeCardId");

  }
  handleRemoveParentBo=()=>{
	localStorage.removeItem("BoParentfilterItem");
    localStorage.removeItem("BoParentProductAccordion");
  }
  
  
	render() {
	  const { currentUser, showDashBoard, showFarmerList,checkis_parent } = this.state;
	//   console.log("checkis_parent",checkis_parent)
    return (
        <aside id="leftBar" className="dvaraBrownBG leftMenuBarSection">
			<nav id="leftBarMenuHolder" className="sideBarNav">
				{checkis_parent===true?
				
				<ul>	
									
				<Link to="/fpofarmers">	<li className="FarmersMenu buttonMenu">
						<Link to={"/fpofarmers"} className="menuExtension farmerMenuLabel dvaraGreenBG dvaraBrownText">Farmers</Link>
					</li></Link>
				
						<Link to ="/fpolandholdings">
					<li className="LandholdingMenu buttonMenu">
						<Link to={"/fpolandholdings"} className="menuExtension landHoldingMenuLabel dvaraGreenBG dvaraBrownText">
						Landholding
						</Link>
					</li></Link>
					<Link to="/fpocrops">
					<li className="CropsMenu buttonMenu">
						<Link to={"/fpocrops"} className="menuExtension cropMenuLabel dvaraGreenBG dvaraBrownText">Crops</Link>
					</li></Link>
					<Link to ="/fpoinputs">
					<li className="InputProductMenu buttonMenu">
						<Link to={"/fpoinputs"} className="menuExtension InputMenuLabel dvaraGreenBG dvaraBrownText">
						Inputs
						</Link>
					</li></Link>
                        	 
                         	  <Link to="/fpoorders">
					<li className="FarmerMenu buttonMenu">
						<Link to={"/fpoorders"} className="menuExtension CommodityMenuLabel dvaraGreenBG dvaraBrownText">
						Farmer Orders
						</Link>
					</li>	</Link>			 
                           
					 <Link to="/fpoprocurements">
					 <li className="CommodityMenu buttonMenu">
					 	<Link to={"/fpoprocurements"} className="menuExtension WspMenuLabel dvaraGreenBG dvaraBrownText">
					 	Procurements
					 	</Link>
					 </li></Link>
					
					 <Link to="/fpowsps">
					 <li className="WspMenu buttonMenu">
					 	<Link to={"/fpowsps"} className="menuExtension ActMenuLabel dvaraGreenBG dvaraBrownText">
					 	Warehouse
					 	</Link>
					 </li></Link> 
					 <Link to="/fpoBo"  onClick={this.handleRemoveParentBo} >
					<li className="BoMenu buttonMenu">
						<Link to={"/fpoBo"} onClick={this.handleRemoveParentBo} className="menuExtension BoMenuLabel dvaraGreenBG dvaraBrownText">
						BO
						</Link>
					</li>	</Link>	
				</ul>
				
				:
				<ul>					
				<Link to="/farmerlist">	<li className="FarmersMenu buttonMenu">
						<Link to={"/farmerlist"} className="menuExtension farmerMenuLabel dvaraGreenBG dvaraBrownText">Farmers</Link>
					</li></Link>
				
						<Link to ="/landholding">
					<li className="LandholdingMenu buttonMenu">
						<Link to={"/landholding"} className="menuExtension landHoldingMenuLabel dvaraGreenBG dvaraBrownText">
							Landholding
						</Link>
					</li></Link>
					<Link to="/crops">
					<li className="CropsMenu buttonMenu">
						<Link to={"/crops"} className="menuExtension cropMenuLabel dvaraGreenBG dvaraBrownText">Crops</Link>
					</li></Link>
					<Link to ="/inputs">
					<li className="InputProductMenu buttonMenu">
						<Link to={"/inputs"} className="menuExtension InputMenuLabel dvaraGreenBG dvaraBrownText">
							Inputs
						</Link>
					</li></Link>
					<Link to="/commodities">
					<li className="CommodityMenu buttonMenu">
						<Link to={"/commodities"} className="menuExtension CommodityMenuLabel dvaraGreenBG dvaraBrownText">
							Commodity
						</Link>
					</li></Link>
					<Link to="/wsp">
					<li className="WspMenu buttonMenu">
						<Link to={"/wsp"} className="menuExtension WspMenuLabel dvaraGreenBG dvaraBrownText">
						Warehouse
						</Link>
					</li></Link>
					<Link to="/organization">
					<li className="ActMenu buttonMenu">
						<Link to={"/organization"} className="menuExtension ActMenuLabel dvaraGreenBG dvaraBrownText">
						Accounting
						</Link>
					</li>	</Link>	
					<Link to="/business-opportunity" onClick={this.handleRemove}>
					<li className="BoMenu buttonMenu">
						<Link to={"/business-opportunity"} onClick={this.handleRemove} className="menuExtension BoMenuLabel dvaraGreenBG dvaraBrownText">
						BO
						</Link>
					</li>	</Link>			
				</ul>
	}
			</nav>
		</aside>
    );
}
}

export default Sidebar;