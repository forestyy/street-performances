import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "../css/app.css";
import NewEvent from './NewEvent.js';
import DateFilter from './DateFilter.js';
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch";
import { Form, Card } from 'semantic-ui-react';
import io from 'socket.io-client';
import DatePicker from 'react-datepicker';
import mapboxgl from 'mapbox-gl'
import fountains from '../water_fountains.json';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiZm9yZXN0eSIsImEiOiJjanNzMGxlZzQwYnJhNDNtdDV2YzNjcTlwIn0.B0QmflYC1gXGu_jZKlhzAg'


class App extends Component {
  constructor(props) {
    super(props)

    this.socket = io();

    this.state = {
      events: [],
      before: null,
      after: null,
      fountains: this.getFountains()
    };

    this.markers = [];
  }

  componentDidMount() {
    this.socket.on('event', (eventObj) => {
      eventObj.date = new Date(eventObj.date);
      this.setState({ events: this.state.events.concat([eventObj]) });
    });

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-71.0942, 42.3601],
      zoom: 13
    })

    this.map.addControl(new FilterControl(this), 'top-left');

    this.map.on('load', () => {
      console.log(this.map.getStyle());
      // this.map.setPaintProperty('road-path', 'line-color', '#faafee');

      this.map.addLayer({
        "id": "hello",
        "source": {
          'type': 'vector',
          'url': 'mapbox://mapbox.mapbox-streets-v8'
        },
        // 'filter': ['any', ['==', 'type', 'cycleway'], ['==', 'type', 'path']],
        // 'filter': ['any', ['==', 'class', 'street'], ['==', 'type', 'cycleway'], ['==', 'class', 'street_limited'], ['==', 'class', 'trunk']],
        'filter': ['==', 'type', 'cycleway'],
        "source-layer": "road",
        "type": "line",
        "paint": {
          "line-color": 'black'
        }
      });

      this.map.addLayer({
        "id": "fountains",
        "source": {
          'type': 'geojson',
          'data': this.getFountains()
        },
        // 'filter': ['any', ['==', 'type', 'cycleway'], ['==', 'type', 'path']],
        // 'filter': ['any', ['==', 'class', 'street'], ['==', 'type', 'cycleway'], ['==', 'class', 'street_limited'], ['==', 'class', 'trunk']],
        "type": "symbol",
        "layout": {
          "icon-image": 'drinking-water-15'
        }
      });

      this.map.on('click', (e) => {
        // console.log('hello');
        if (this.newPopup != null) {
          this.newPopup.remove();
          this.newPopup = null;
        }

        if (!e.originalEvent.target.parentNode.parentNode.parentNode.parentNode.classList.contains('mapboxgl-marker')) {


          let popup = new mapboxgl.Popup();

          let holder = document.createElement('div');
          ReactDOM.render(<NewEvent addEvent={this.addEvent} closePopup={popup.remove} location={e.lngLat}></NewEvent>, holder);
          // ReactDOM.render(<p>Hi</p>, holder);

          popup.setDOMContent(holder)
            .setLngLat(e.lngLat)
            .addTo(this.map);
        } 
      });
    });

    this.getEvents();
  }

  // componentWillUnmount() {
  //   this.socket.disconnect();
  // }
  componentDidUpdate() {
    const { events, before, after } = this.state;
    // console.log(events, before, after);

    this.markers.forEach((marker) => { marker.remove(); });

    this.markers = events
      .filter((eventObj) => (after == null || eventObj.date >= after) && (before == null || eventObj.date <= before))
      .map((eventObj) => {
          let popup = new mapboxgl.Popup();
            // .setHTML('<h3>' + eventObj.artist + '</h3><p>' + eventObj.date.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + '</p>');
          let holder = document.createElement('div');
          ReactDOM.render(
            <Card>
              <Card.Content>
                <Card.Header>{eventObj.artist}</Card.Header>
                <Card.Meta>{eventObj.date.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</Card.Meta>
                <Card.Description>{eventObj.description}</Card.Description>
              </Card.Content>
            </Card>,
            holder
          );

          popup.setDOMContent(holder);
          // create the marker
          let marker = new mapboxgl.Marker()
            .setLngLat(eventObj.location.coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(this.map);

          return marker;
          // console.log(this.markers)
        }
    );
  }

  render() { 
    return (
      <div ref={el => this.mapContainer = el} className="map-container" />
    );
  }

  getFountains = () => {
    let res = {
      'type': 'FeatureCollection',
      'features': []
    }
    for (let name in fountains) {
      res.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            fountains[name].longitude,
            fountains[name].latitude
          ]
        },
        "properties": {
          "name": name,
        }
      });
    }
    return res
  }

  setBefore = (date) => {
    this.setState({ before: date }, () => {console.log(this.state.before)});
  }

  setAfter = (date) => {
    this.setState({ after: date }, () => {console.log(this.state.after)});
  }

  addEvent(artist, date, description, location, callback) {
    const body = {
      'artist': artist,
      'date': date,
      'description': description, 
      'location': [location.lng, location.lat]
    };
    console.log(body)
    fetch('/api/new_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => { callback(); });
  }

  // addPost = (content, callback) => {
  //       const body = { 
  //           'content': content,
  //           'class': this.props.activeClass,
  //           'upvote': 0
  //       };
  //       fetch('/api/post', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify(body)
  //       })
  //       .then((res) => { callback(); });
  //   };

  getEvents() {
    fetch('/api/events')
    .then(res => res.json())
    .then(eventObjs =>
      this.setState({ events: eventObjs.map(eventObj => { eventObj.date = new Date(eventObj.date); return eventObj; }) })
    );
  }
}

class FilterControl {
    constructor(parent) {
      this.parent = parent;
      console.log(this.parent)
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div')
        this._container.id = 'filter';
        this._container.className = 'mapboxgl-ctrl';
        // this._container.textContent = 'Hello, world';
        ReactDOM.render(
          <DateFilter setBefore={this.parent.setBefore} setAfter={this.parent.setAfter}/>, this._container
        );
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

export default App;