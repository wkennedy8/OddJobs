import React, { Component } from 'react'
import axios from 'axios'
import {Link, withRouter} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import './profile.css'


class ContractorProfile extends Component {
  static contextType = AuthContext;

  state = { contractorInfo: [], fetched: false }

  componentDidMount() {
    this.context.token && this.fetchProfile();
  }

  componentDidUpdate() {
    const { fetched } = this.state;
    !fetched && this.context.token && this.fetchProfile()
  }

  fetchProfile = async () => {
    const { match } = this.props;
    const { data } = await axios.get(`http://localhost:3000/contractors/${match.params.id}`, { headers: { Authorization: this.context.token } })
    this.setState({ contractorInfo: data.contractor, fetched: true })
  }
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }

  render() {
    const { contractorInfo } = this.state
    
    return (
      <>
      <div>
        <button onClick={this.goBack} className="back-map">Back</button>
      </div>
      <div>
        <h2 className="specProfileHeader">Contractor Profile</h2>
      </div>
        <div className='profile-main'>
        <img className ="profile-pic" src={contractorInfo.contractor_image} alt="profilepic" />
        {contractorInfo.ratings && contractorInfo.ratings.map(i => (
          <div className="ratingDisplay" key={contractorInfo.id}>{[...Array(Math.floor(i.value || 0)).keys()].map(i => <img src={"https://yakimaymca.org/wp-content/uploads/2018/11/Star.png"} key={`rating${i}`} className="badge" alt="starz" />)} </div>))}
        
        <div className="misc-info">
          <h4>English & Spanish</h4>
          <p>$22/hr</p>
        </div>
        <div className="hire-btn-now">
          <Link to="/calendar"><button className="hire-btn-prof">Hire Now!</button></Link>
          <Link to="/rating"><button className="review-btn-prof">Leave a Review</button></Link>
        </div>
        <div className="name-div">
        <p>{contractorInfo.first_name} {contractorInfo.last_name} {contractorInfo.background_check ? <img src="https://nexusipe-resource-exchange.s3.amazonaws.com/pictures/ambassador_large.png" className="badge" alt="bgcheck"></img> : ""}</p>
        </div>
        <div className="misc-info-desc">
        <p>6 years work experience</p>
        <p>Project Completions (22) </p>
        </div>
        </div>
        <div className="profile-security">
          <p className="sec-text">Always have peace of mind! We ensure to always verify: </p>
          <li className="list-items-profile">Background Checks</li>
          <li className="list-items-profile">ID Checks</li>
          <li className="list-items-profile">Secure Payments</li>
        </div>
      </>
    )
  }
}

export default withRouter(ContractorProfile)