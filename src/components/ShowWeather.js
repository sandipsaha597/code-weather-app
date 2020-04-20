import React, {Component} from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import RaisedButton from 'material-ui/RaisedButton'
import Button from '@material-ui/core/Button'

class ShowWeather extends Component {
  state = {
    current_city: 'Loading...',
    // current_region: '',
    current_country: '',
    location: 'Loading...',
    temp_c: 'Loading...',
    options: {
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },

      title: {
        text: 'Weather forecast',
        align: 'left',
        style: {
          fontSize: '20px'
        }
      },
      xaxis: {
        type: 'datetime',

        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 4,
        floating: false,

        labels: {
          style: {
            color: '#8e8da4',
          },
          offsetY: -7,
          offsetX: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        opacity: 0.5,
      },
      tooltip: {
        x: {
          format: "dd MMM",
        },
        fixed: {
          enabled: false,
          position: 'topRight'
        }
      },
      grid: {
        yaxis: {
          lines: {
            offsetX: -30
          }
        },
        padding: {
          left: 20
        }
      }
    },
    series: [{
      name: 'Temp(C)',
      data: [{
          x: "sat Apr 18 2020",
          y: 0
        },
        {
          x: "sat Apr 19 2020",
          y: 0
        },
        {
          x: "sat Apr 20 2020",
          y: 0
        },
        {
          x: "sat Apr 21 2020",
          y: 0
        },
        {
          x: "sat Apr 22 2020",
          y: 0
        },
        {
          x: "sat Apr 23 2020",
          y: 0
        },
        {
          x: "sat Apr 24 2020",
          y: 0
        },
      ]
    }],
    errors: {
      location: '',
      forecast: '',
    }
  }


  componentWillMount() {
    this.location()
    if(window.innerWidth > 580) {
      this.setState({
        options: {
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },

          title: {
            text: 'Weather forecast',
            align: 'center',
            style: {
              fontSize: '20px'
            }
          },
          xaxis: {
            type: 'datetime',

            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            tickAmount: 4,
            floating: false,

            labels: {
              style: {
                color: '#8e8da4',
              },
              offsetY: -7,
              offsetX: 0,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false
            }
          },
          fill: {
            opacity: 0.5,
          },
          tooltip: {
            x: {
              format: "dd MMM",
            },
            fixed: {
              enabled: false,
              position: 'topRight'
            }
          },
          grid: {
            yaxis: {
              lines: {
                offsetX: -30
              }
            },
            padding: {
              left: 20
            }
          }
        },
      })
    }
  }

  location() {
    axios.get(`https://geoip-db.com/json/`)
      .then(res => {
        
        this.setState({location: res.data.city}, e => this.getTemp() )
        console.log(this.state.location);
        
      })
      .catch((err) => console.log('Location error'))

  }

  temp() {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=f31f28d7204a6328e3058775f2d14fc2`)
        .then(res => {
            console.log(res)
            console.log(res.data.main.temp)
        })
        .catch((err) => {
            console.log(err)
        })

  }
  
  kelvinToCelcius(k) {
    let c = k - 273.15 
  }

  getTemp = () => {
    // e.preventDefault()
    this.setState({
      current_city: 'Loading...',
      temp_c: 'Loading...'
    })
    console.log(this.state.location);
    
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.location}&appid=f31f28d7204a6328e3058775f2d14fc2`)
      .then(res => {
        let c = res.data.main.temp - 273.15
        
        this.setState({
          current_city: res.data.name,
          // current_region: res.data.location.region,
          current_country: res.data.sys.country,
          temp_c: Math.round(c * 10) / 10,
          errors: {
            location: '',
          },
        }, e => this.whetherForecast() )
      })
      .catch((err) => {
        this.setState({
          errors: {
            location: `'${this.state.location}' NOT FOUND.`,
          }
        })
      })

  }

  handleChange = e => {
    // this.setState({[input]: e.target.value})
    this.setState({location: e.target.value}, e => console.log(this.state.location))
    
    
  }

  whetherForecast() {
    axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.state.location}&key=2db49834c46c4179b8fa3bf2797312f8`)
    .then( res => {

      console.log(res.data.results[0].geometry);
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.results[0].geometry.lat}&lon=${res.data.results[0].geometry.lng}&appid=e2762729c5e0341d4e2164e61e00fd04`)
      .then(res => {
        let temp = []
        var date = new Date()
        
        res.data.daily.map((value, index) => {
          if (index !== 0) {
            date.setDate(date.getDate() + 1 )
            
            let o = (value.temp.day + value.temp.min + value.temp.max + value.temp.night + value.temp.eve + value.temp.morn) / 6
            temp.push({x: date.toDateString(), y: Math.round(o - 273.15)})
          }
        })
        
        this.setState({
          series: [{
            data: temp
          }]
        })
      })      
        .catch((err) => console.log('weather forecast err', err))
      }
    )
  }

  render() {
    let {temp_c, current_city, current_region, current_country, errors, location} = this.state
    return (  
      <div className="ShowWhether container">
          <div className="form">
            {/* <TextField hintText="Enter Your City"  floatingLabelText="Enter Your City" /> */}
            <TextField id="standard-basic" label="Enter Your City" onChange={this.handleChange} value={location} />
            {/* <RaisedButton
              label="See Temp"
              primary={true}
              style={styles.button}
              onClick={this.seeTemp}
            /> */}
            <Button variant="contained"
             color="primary"
             style={styles.button}
             onClick={this.getTemp}
             >See Temp</Button>
          </div>

        <p>{errors.location}</p>
        <div className="Output">
          <p>Location: {current_city}, {current_country}</p>
          <p>Temp C: {temp_c}</p>
        </div>
        <Chart 
          options={this.state.options}
          series={this.state.series}
          type="area"
          height="450"
          width="100%"
        />
      </div>

    );
  }
}
const styles = {
  button: {
    marginLeft: '15px'
  }
}

export default ShowWeather;
