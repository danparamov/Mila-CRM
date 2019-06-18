import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
} from 'blockstack';
import BlockstackLogo from '../assets/blockstack-icon.svg';
import avatarFallbackImage from '../assets/avatar-placeholder.png';
import findObjectBy from './util/findObjectBy';
import ifAttribute from './util/ifAttribute';
import Nav from './Nav';
import SingleContactTask from './SingleContactTask';

class mySingleContactPage extends Component {
  state = {
    contact: [],
    contacts: [],
    contacttask: [],
    contacttasks: [],
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
    this.fetchData();
  }

  fetchData() {
    const options = { decrypt: true };
    getFile('contacts.json', options).then(file => {
      const contacts = JSON.parse(file || '[]');
      const contact = findObjectBy(contacts, {
        id: this.props.location.search.substring(4),
      });
      this.setState({
        contact,
        contacts,
      });
    });
    getFile('contacttasks.json', options).then(file => {
      const name = this.state.contact[0].name
      const contact_name = name
      const contacttasks = JSON.parse(file || '[]');
      const contacttask = findObjectBy(contacttasks, {
        contactname: contact_name,
      })

      this.setState({
        contacttask,
        contacttasks,
      });
    });
  }

  deleteContact() {
    const toDelete = this.state.contact[0].id;
    const newContactsList = this.state.contacts.filter(
      contact => contact.id !== toDelete
    );

    const options = { encrypt: true };
    putFile('contacts.json', JSON.stringify(newContactsList), options).then(
      () => {
        this.props.history.push('/contacts');
      }
    );
  }

  render() {
    const { contact } = this.state;
    const { contacttask } = this.state;
    const { handleSignOut } = this.props;
    const { person } = this.state;
    let UserCountryBlock;
    let SocialBlock = null;
    let EmailBlock;
    let BirthDateBlock;
    let PhoneNumberBlock;
    let BlockstackBlock;
    let TwitterBlock;
    let ContactDateBlock;
    let TaskBlock = null;
    let ContactTaskBlock;
    
    if (contact[0]) {
      if (ifAttribute(contact[0].country)) {
        UserCountryBlock = (
          <div className="mt2">
            <span className="b">Country:</span> {contact[0].country},{' '}
            {contact[0].region}
          </div>
        );
      } else
        UserCountryBlock = (
          <div className="mt2">
            <span className="b">Country:</span>
            🌎
          </div>
        );
      if (ifAttribute(contact[0].email)) {
        EmailBlock = (
          <div className="mt2">
            <span className="b">Email:</span> {contact[0].email}
          </div>
        );
      } else EmailBlock = null;
      if (ifAttribute(contact[0].birthDate)) {
        BirthDateBlock = (
          <div className="mt2">
            <span className="b">Birthday:</span> {contact[0].birthDate}
          </div>
        );
      } else BirthDateBlock = null;
      if (ifAttribute(contact[0].phoneNumber)) {
        PhoneNumberBlock = (
          <div className="mt2">
            <span className="b">Phone Number:</span> {contact[0].phoneNumber}
          </div>
        );
      } else PhoneNumberBlock = null;
      if (
        ifAttribute(contact[0].twitterHandle) ||
        ifAttribute(contact[0].blockstackId)
      ) {
        SocialBlock = <h2>Social</h2>;
        if (ifAttribute(contact[0].twitterHandle)) {
          TwitterBlock = (
            <a
              href={`https://twitter.com/${contact[0].twitterHandle}`}
              className="no-underline black"
            >
              <div className="inline-flex justify-center items-center">
                <i className="fa fa-twitter" />
                <span className="ml2">{contact[0].twitterHandle}</span>
              </div>
            </a>
          );
        } else TwitterBlock = null;
        if (ifAttribute(contact[0].blockstackId)) {
          BlockstackBlock = (
            <div className="mt2 inline-flex justify-center items-center">
              <img src={BlockstackLogo} alt="blockstack" className="w1" />
              <span className="ml2">{contact[0].blockstackId}</span>
            </div>
          );
        } else BlockstackBlock = null;
      }
    }
    if (contacttask[0]) {
      TaskBlock = <h2>Tasks -- click on each task to edit it</h2>;
      if (ifAttribute(contacttask[0].contactname)) {
        ContactTaskBlock = (
          <div className="mt2">
            {contacttask.map(contacttask => (
            <SingleContactTask contacttask={contacttask} key={contacttask.id} />
            ))}
          </div>
        );
      } else ContactTaskBlock = null;
    }

    return !isSignInPending() ? (
      <div>
        <Nav
          profileImage={
            person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
          }
          logout={handleSignOut.bind(this)}
        />
        {contact.map(contact => (
          <div>
            <div class="section_container_dash">
              <div className="">
                <div className="">
                  <img
                    src={`https://avatars.io/twitter/${contact.twitterHandle}`}
                    className="center fl-ns br-100 h4 ml3-ns mt0-l mt3"
                    alt=""
                  />
                </div>
                <div className="w-100 w-80-ns center fl-ns">
                  <h1 className="f3 f1-ns">
                    {contact.name}{' '}
                  </h1>
                </div>
                <div className="center w-80 w-40-ns pt6-ns">
                  <div className="tl">
                    {ContactDateBlock}
                    {PhoneNumberBlock}
                    {EmailBlock}
                    {BirthDateBlock}
                    {UserCountryBlock}
                  </div>
                  <div className="tl">
                    {SocialBlock}
                    {TwitterBlock}
                    <br />
                    {BlockstackBlock}
                    <br />
                    {TaskBlock}
                    {ContactTaskBlock}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt3 right-ns tr pr4">
              <a
                className="pointer link dim ba bw1 ph2 pv2 mb2 dib no-underline ba b--black black mr2 "
                onClick={() => {
                  this.deleteContact();
                }}
              >
                Delete Contact
              </a>
              <Link
                to={{
                  pathname: '/edit-contact',
                  search: `?id=${contact.id}`,
                }}
                className="link dim ba bw1 ph2 pv2 mb2 dib no-underline black mr2"
              >
                ✏️️️ Edit Contact
              </Link>
              <Link
                to={{
                  pathname: '/add-contacttask',
                }}
                className="link dim ba bw1 ph2 pv2 mb2 dib no-underline black mr2"
              >
                ✏️️️ Add Contact Task
              </Link>
            </div>
          </div>
        ))}
      </div>
    ) : null;
  }
}

const SingleContactPage = withRouter(mySingleContactPage);

export default SingleContactPage;
