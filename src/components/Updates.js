import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
} from 'blockstack';
import { Link } from 'react-router-dom';
import NavLoggedOut from './NavLoggedOut';
import Nav from './Nav';
import ProfileDesktop from './ProfileDesktop';
import avatarFallbackImage from '../assets/avatar-placeholder.png';
import ifAttribute from './util/ifAttribute';

export default class Updates extends Component {
  state = {
    person: {
      name() {
        return 'Anonymous';
      },
      avatarUrl() {
        return avatarFallbackImage;
      },
    },
    username: '',
  };

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username,
    });
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    return !isSignInPending() ?(
      <div>
        <Nav
          profileImage={
            person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
          }
          logout={handleSignOut.bind(this)}
        />
        <div className="tl ph3 ph5-ns ph7-l">
          <h1>Updates</h1>
          <p>
            Mila CRM is part of a set of sales tools that are being built by Mila Labs which is a product of two 🇪🇨 Ecuadorian brothers,{' '}
            <a href="https://twitter.com/mila_labs" className="black">
              Mila Labs
            </a>
          </p>
          <p>
            Here is our{' '}
            <a
              href="https://www.notion.so/milacrm/8498353e92374913a0431647f519607f?v=d5f3659989474fd8893c3f4819c2ca16"
              className="black"
            >
              Roadmap
            </a>
            , you can add feature requests if you want!
          </p>
        </div>
      </div>
    ) : null;
  }
}
