import React, { Component } from "react";
import "../css/app.css";
import NewEvent from './NewEvent.js';
import DateFilter from './DateFilter.js'; // to be added to sidebar
import { Ref, Sidebar, Segment, Container, Header, Image, Grid, Input, Menu, Button, Icon } from 'semantic-ui-react';
import Streets from './Streets.js'
 

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userInfo: null,
      sidebarVisible: false,
      mode: 'idle',
      newEventLocation: null
    };

  }

  componentDidMount() {
    this.getUser();

    // let topMenu = document.getElementById('topMenu');
    // topMenu.classList.add('top-menu');
  }

  render() {
    const { userInfo, sidebarVisible, mode, newEventLocation } = this.state;
    const action = mode == 'idle' ?
      this.handleShowClick
      : () => { this.switchIdleLocationSelect('idle'); }
    const icon = mode != 'idle' ? 'arrow left' : 'bars';

    return (
      <div>
        <Sidebar.Pushable>
          <Sidebar
            animation='overlay'
            icon='labeled'
            onHide={this.handleHideClick}
            visible={sidebarVisible}
            target={this.mapRef}
          >
            {/*<Menu secondary>
              <Menu.Item
                name='events'
                active={true}
              />
              <Menu.Item
                name='settings'
                active={false}
              />
            </Menu>*/}
            
          </Sidebar>
          <Ref innerRef={this.mapRef}>
            <Sidebar.Pusher dimmed={sidebarVisible}>
              <Streets selecting={mode == 'selecting-location'} setNewEventLocation={this.setNewEventLocation}/>
              <div className='bars-container'>
                <Button onClick={action} className='bars-button' icon={icon}/>
              </div>
              {mode=='idle' ?
                (<div>
                  <div className='post-button-container'>
                  {userInfo ?
                    (<Button className='post-button' onClick={() => { this.switchIdleLocationSelect('selecting-location'); }} fluid size='big'>
                        Post an event
                      </Button>)
                    :
                    (<Button className='post-button' as='a' href='/auth/google' fluid size='big'>
                        <Icon name='google'/>Login to post an event
                      </Button>)
                  }
                  </div>
                </div>)
                : (<div/>)
              }
              <Segment id='bottom-segment' className='bottom'>
                {mode == 'entering-details' ?
                  (<NewEvent addEvent={this.addEvent} switchVisibleFull={this.switchVisibleFull} toIdle={this.toIdle} location={newEventLocation} user={this.state.userInfo}/>)
                  :
                  (
                  <div>
                    <h1>Set location</h1>
                    <p>Move the center of the map over the location of your event.</p>
                    <Button className='bottom' size='huge' onClick={() => { this.switchVisibleFull('entering-details'); }} primary fluid>Set location</Button>
                  </div>
                  )
                }
              </Segment>
            </Sidebar.Pusher>
          </Ref>
        </Sidebar.Pushable>
      </div>
    );
  }

  switchVisibleFull = (newMode) => {
    this.setState({ mode: newMode}, () => {
      document.getElementById('bottom-segment').classList.toggle('full');
    });
  }

  switchIdleLocationSelect = (newMode) => {
    document.getElementById('bottom-segment').classList.toggle('visible');
    this.setState({ mode: newMode});
  }

  toIdle = () => {
    document.getElementById('bottom-segment').classList.toggle('full');
    document.getElementById('bottom-segment').classList.toggle('visible');
    this.setState({ mode: 'idle'}, () => { console.log(this.state.mode); });
  }

  handleHideClick = () => this.setState({ sidebarVisible: false }, () => { console.log('handleHideClick') })
  handleShowClick = () => this.setState({ sidebarVisible: true }, () => { console.log('handleShowClick') })

  getUser = () => {    
    fetch('/api/whoami')
    .then(res => res.json())
    .then(
        userObj => {
            // console.log(userObj);
            // console.log('fetched user');
            if (userObj._id !== undefined) {
                this.setState({ 
                    userInfo: userObj
                }, () => { console.log(this.state.userInfo)});
            } else {
                this.setState({ 
                    userInfo: null
                }, () => { console.log(this.state.userInfo)});
            }
        }
    );
  }

  setNewEventLocation = (location, callback) => {
    this.setState({newEventLocation: location}, () => {
      typeof callback === 'function' && callback();
      console.log(this.state.newEventLocation);
    });
  }

  addEvent(artist, date, description, location, callback) {
    const body = {
      'artist': artist,
      'date': date,
      'description': description, 
      'location': [location.lng, location.lat]
    };
    // console.log(body)
    fetch('/api/new_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => { callback(); });
  }
}

export default App;