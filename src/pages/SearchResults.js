import React, { Component } from "react";
import axios from 'axios';
import "../map.css";
import MapContainer from "../components/MapContainer";
import { AuthContext } from '../context/AuthContext';


class SearchResults extends Component {
  static contextType = AuthContext;

  state = { coordinates: [], contractors: [], fetched: false };

  componentDidMount() {
    this.context.token && this.fetchAddress();
  }

  componentDidUpdate() {
    const { fetched } = this.state;
    !fetched && this.context.token && this.fetchAddress()
  }

  fetchAddress = async () => {
    const { data: { contractors } } = await axios.get('http://localhost:3000/contractors', { headers: { Authorization: this.context.token } });
    const requests = []
    for (let contractorIndex in contractors) {
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${contractors[contractorIndex].address},FL&key=AIzaSyB1EAffcBClxJgB7TqI_FM7cuFLcvYk7-M`
      requests.push(axios.get(url))
    }
    const responses = await Promise.all(requests)
    const coordsArray = responses.map(({ data }) => data.results[0].geometry.location);
    for (let coordsIndex in coordsArray) {
      contractors[coordsIndex] = { ...contractors[coordsIndex], ...coordsArray[coordsIndex] }
    }
    this.setState({ contractors: contractors, fetched: true })
  }

  render() {
    return (
      <div>
        <div style={{ position: 'relative', minHeight: '500px', marginTop: '50px', marginLeft: '150px', marginRight: '150px' }}>
          <MapContainer coordinates={this.state.contractors} />
        </div>
      </div>
    )
  }
}

export default SearchResults;
