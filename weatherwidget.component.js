import React, { Component } from 'react';
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/weatherWidget.css';

class WeatherWidgetValueRender extends Component{

    render(){        
        var weatherForecastBg = "forecastField";
        var weatherIcon = "";
        if(this.props.alert !== "No warning"){
            if (this.props.alert === "Thunderstorm & Lightning") {
                weatherForecastBg =
                    weatherForecastBg + " forecastThunderStormContainer";
                weatherIcon = "stormy";
            } else if (this.props.alert === "Sunny") {
                weatherForecastBg = weatherForecastBg + " forecastSunnyContainer";
                weatherIcon = "sunny";
            } else if (this.props.alert === "Heavy Rain") {
                weatherForecastBg =
                    weatherForecastBg + " forecastRainyContainer ";
                weatherIcon = "rainy";
            } else if (this.props.alert === "Cloudy") {
                weatherForecastBg =
                    weatherForecastBg + " forecastCloudyContainer";
                weatherIcon = "cloudy";
            } else if (this.props.alert === "Clear") {
                weatherForecastBg =
                    weatherForecastBg + " forecastStarryContainer";
                weatherIcon = "starry";
            } else if (
                this.props.alert === "Heavy Rain|Thunderstorm & Lightning"
            ) {
                weatherForecastBg =
                    weatherForecastBg + " forecastThunderStormContainer";
                weatherIcon = "stormy";
            }
            else if (
                this.props.alert ===
                "Heavy Rain|Thunderstorm & Lightning|Strong Surface Winds"
            ) {
                weatherForecastBg =
                    weatherForecastBg + " forecastThunderStormContainer";
                weatherIcon = "stormy";
            }
           
            else {
                  weatherForecastBg =
                    weatherForecastBg + " forecastThunderStormContainer";
                  weatherIcon = "stormy";
            }
        }
        else{
            weatherForecastBg = weatherForecastBg+" forecastSunnyContainer";
            weatherIcon = "sunny"
        }
            
        return (
          <div className="weatherWidgetContainer">
            <div className={weatherForecastBg}>
              <div className={weatherIcon}></div>
              <div className="weatherValHolder">
                <h5>
                  &nbsp;{this.props.MaxTemp}&deg; C
                </h5>
                <p>{this.props.MinTemp}&deg; C</p>
                        <span className="weatherAlert" style={{fontSize:"15px"}}>{this.props.alert}</span>
                <span className="weatherDate">{this.props.date}</span>
                
                <span className="clearFixing"></span>
              </div>
            </div>
          </div>
        );
    }

}

class MainWeatherWidgetRendering extends Component{
    render(){
        // console.log('this.props', this.props);
        return (
            <div className="mainWeatherWidgetContainer">
                <FontAwesomeIcon icon={faArrowCircleLeft} className="slideWeatherWidget"/>
                    {
                        this.props.weatherDetails.map(WEATHER_ALERT => {
                            let weatherAlertAfterCheck = "";
                            if(WEATHER_ALERT.alert !== "No warning")
                                weatherAlertAfterCheck = WEATHER_ALERT.alert;
                            else
                            weatherAlertAfterCheck = "Sunny";
                            return (
                                

                                <WeatherWidgetValueRender key={WEATHER_ALERT.id} 
                                date={WEATHER_ALERT.date} MaxTemp={WEATHER_ALERT.MaxTemp}
                                MinTemp={WEATHER_ALERT.MinTemp}
                                alert = {weatherAlertAfterCheck}
                                  />
                            );
                        })
                    }
                <FontAwesomeIcon icon={faArrowCircleRight} className="slideWeatherWidget"/>
            </div>
        );
    }
}

/*function weatherWidgetMethod() {
    return (
        <div className="container">
            <div className="weatherWidgetContainer testBord">
                <div className="forecastSunnyContainer forecastPresentDayIcon">
                    <div className="cloudy inline-block">

                    </div>
                </div>
            </div>
        </div>
    )
}*/

export default MainWeatherWidgetRendering;