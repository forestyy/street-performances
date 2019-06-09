import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "../css/app.css";
import NewEvent from './NewEvent.js';
import DateFilter from './DateFilter.js';
// import Route from "react-router-dom/es/Route";
// import Switch from "react-router-dom/es/Switch";
import { Form, Card, Button, Icon } from 'semantic-ui-react';
import io from 'socket.io-client';
import DatePicker from 'react-datepicker';
import mapboxgl from 'mapbox-gl'
import fountains from '../water_fountains.json';
 
mapboxgl.accessToken = 'pk.eyJ1IjoiZm9yZXN0eSIsImEiOiJjanNzMGxlZzQwYnJhNDNtdDV2YzNjcTlwIn0.B0QmflYC1gXGu_jZKlhzAg'


class Streets extends Component {
  constructor(props) {
    super(props)

    this.socket = io();

    this.state = {
      events: [],
      before: null,
      after: null,
    };

    this.markers = [];
  }

  componentDidMount() {
    this.socket.on('connect', function () {
      console.log('connected!');
    })


    this.socket.on('event', (eventObj) => {
      eventObj.date = new Date(eventObj.date);
      this.setState({ events: this.state.events.concat([eventObj]) });
    });

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [-71.0942, 42.3601],
      zoom: 13
    })

    this.map.on('load', () => {

      this.map.addLayer({
        "id": "hello",
        "source": {
          'type': 'vector',
          'url': 'mapbox://mapbox.mapbox-streets-v8'
        },
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
        "type": "symbol",
        "layout": {
          "icon-image": 'drinking-water-11'
        }
      });

      console.log(this.map.getStyle())

      this.map.on('click', (e) => {
        console.log(this.map.queryRenderedFeatures(e.point));

        if (e.originalEvent.target.parentNode.parentNode.parentNode.parentNode.classList.contains('mapboxgl-marker')) {
          this.map.flyTo({center: e.lngLat})
        }
      });
    });

    this.map.on('move', () => {
      if (this.newMarker) {
        const center = this.map.getCenter();
        this.props.setNewEventLocation(center, () => { this.newMarker.setLngLat(this.map.getCenter()); });
      }
    });

    this.getEvents();
  }

  componentDidUpdate() {
    const { events, before, after } = this.state;

    if (this.props.selecting && !this.newMarker) {
      const center = this.map.getCenter();
      this.newMarker = new mapboxgl.Marker({color: '#000'})
        .setLngLat(center)
        .addTo(this.map);
      this.props.setNewEventLocation(center);
    }

    if (!this.props.selecting && this.newMarker) {
      this.newMarker.remove();
      this.newMarker = null;
    }


    this.markers.forEach((marker) => { marker.remove(); });

    this.markers = events
      .filter((eventObj) => (after == null || eventObj.date >= after) && (before == null || eventObj.date <= before))
      .map((eventObj) => {
          let popup = new mapboxgl.Popup({anchor: 'bottom'});
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
      // console.log(this.parent)
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div')
        this._container.id = 'filter';
        this._container.className = 'mapboxgl-ctrl';
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

export default Streets;