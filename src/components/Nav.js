import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/funnelicon.jpg';
import LogoMobile from '../assets/funnelicon.jpg';
import ProfileDesktop from './ProfileDesktop';
import Menu from './Menu';

export default class Nav extends Component {
  state = {
    showMenu: false,
  };

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  };

  render() {
    return (
      <div>
        <nav className="w-10-ns">
          <Link to="/profile" title="MILA CRM">
          </Link>
          <div className="">
          <ProfileDesktop />
            <div className="fl-ns">
              <Link to="/profile" title="MILA CRM">
                <img
                  src={LogoMobile}
                  className="dn-ns h3 center pl3 align-middle"
                  alt="MILA CRM"
                />
              </Link>
            </div>
            <div className="dib left-0 fl-ns" onClick={this.toggleMenu}>
              <img
                src={this.props.profileImage}
                className="dn-ns h2 br-100 align-middle pa3"
                alt=""
              />
            </div>
          </div>
        </nav>
        {this.state.showMenu ? <Menu logout={this.props.logout} /> : null}
      </div>
    );
  }
}
