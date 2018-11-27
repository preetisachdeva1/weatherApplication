/*global google*/
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import axios  from "axios";
import WeatherDetails from './WeatherDetails';

class App extends Component {
  constructor() {
    super()
    this.appId ='54c2091c2796561ea02bd72237ae807b'
    this.apiURL = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&'
    this.state = {
      data: null
    }
    this.getLatLongitude = this.getLatLongitude.bind(this)
  }
  componentDidMount() {
      this.cities = new google.maps.places.Autocomplete(this.cityName);
      google.maps.event.addListener(this.cities, 'place_changed', this.getLatLongitude);
  }

  getLatLongitude() {
        let city = this.cities.getPlace();
        this.getWeatherDetail(city.geometry.location.lat(), city.geometry.location.lng())

  }
  getWeatherDetail(latitude, longitude) {
    if(latitude === null || longitude === null)
      return
    let url = `${this.apiURL}lat=${latitude}&lon=${longitude}&mode=json&appid=${this.appId}`
    let self = this;
    let weatherList = null
    axios.get(url)
      .then(function (response) {
        self.getDataAsPerTime(response.data.list)                    
        })
        .catch(function (error) {
          console.log(error)
      })
  }
  getDataAsPerTime(response) {
    let date = new Date();
    let hours = date.getHours();
    let currentTime = '';
    if(hours>= 0 && hours<3) {
      currentTime = '00:00:00'
    } 
    else if(hours>= 3 && hours<6) {
      currentTime = '03:00:00'
    }
    else if(hours>= 6 && hours<9) {
      currentTime = '06:00:00'
    }
    else if(hours>= 9 && hours<12) {
      currentTime = '09:00:00'
    }
    else if(hours>= 12 && hours<15) {
      currentTime = '12:00:00'
    }
    else if(hours>= 15 && hours<18) {
      currentTime = '15:00:00'
    }
    else if(hours>= 18 && hours<21) {
      currentTime = '18:00:00'
    }
    else if(hours>= 21) {
      currentTime = '21:00:00'
    }

    let filteredData = response.filter( data => {
      let time = data.dt_txt.split(' ')[1]
      if(time === currentTime)
        return data;
    });
    
    this.setState( { data: filteredData })
  }
  formatDate(dateTxt) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", 
              "August", "September", "October", "November", "December" ];
    let date = dateTxt.split(' ')[0].split('-')
    return `${date[2]} ${monthNames[date[1] - 1]}`
  }

  formatTimeHour(dateTxt) {
    return parseInt(dateTxt.split(' ')[1].split(':')[0])
  }

  render() {
    let weatherList = '';
    if(this.state.data) {
      weatherList = this.state.data.map((c, index) => { 
        return <WeatherDetails key={index} timeHour={this.formatTimeHour(c.dt_txt)} date={this.formatDate(c.dt_txt)} maxTemp={c.main.temp_max} minTemp={c.main.temp_min} humidity={c.main.humidity} description={c.weather[0].description} />
      })
    }
    return (
      <Container>
        <Row className="weather-container">
           <Col lg={12}>
            <h6 className="bold">Weather forecast App</h6>
          </Col>
        </Row>
        <Row>
           <Col lg={12}>
            <input className="city-input" type="text" ref={(input) => { this.cityName = input; }} placeholder="Enter a location to get weather forecast at current local time" />         
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Row className="weather-list">
              {weatherList}
          </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
