import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/funnelicon.jpg';

export default class NavLoggedOut extends Component {
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
        <nav className="dt w-100 border-box pa3-ns ph5-ns">
          <Link to="/" title="MILA CRM">
            <img src={Logo} className="dib h5" alt="MILA CRM" />
          </Link>
        </nav>
      </div>
    );
  }
}
