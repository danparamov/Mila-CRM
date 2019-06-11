import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
} from 'blockstack';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Nav from './Nav';
import avatarFallbackImage from '../assets/avatar-placeholder.png';
import SingleContact from './SingleContact';
import ContactBubble from './ContactBubble';
import NoOneLeft from '../assets/no-one-left.png';
import ifAttribute from './util/ifAttribute';
import TableContacts from './TableContacts';
import ProfileDesktop from './ProfileDesktop';
import csvToJSON from './util/csvToJSON';
import'./Styles/Table.css';

export default class Profile extends Component {
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
    contacts: [],
    tasks: [],
    today: [{ contactsLeft: 0, date: '' }],
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
      this.setState({
        contacts,
      });
    });
    getFile('today.json', options).then(file => {
      let today = JSON.parse(file || '[]');
      if (today.length === 0) {
        today = [{ date: moment().format('L'), contactsLeft: 3 }];
        const otherOption = { encrypt: true };
        putFile('today.json', JSON.stringify(today), otherOption).then();
      }
      if (today[0].date !== moment().format('L')) {
        const otherOption = { encrypt: true };
        today = [{ date: moment().format('L'), contactsLeft: 3 }];
        putFile('today.json', JSON.stringify(today), otherOption).then();
      }
      this.setState({
        today,
      });
    });
  }

  async exportContacts() {
    const columns = Object.keys(this.state.contacts[0]).join(',');
    const rows = this.state.contacts
      .map(c => Object.values(c).join(','))
      .join('\n');
    const csv = `${columns}\n${rows}`;
    const url = await putFile('contacts.csv', csv, { encrypt: false });
    console.log(url);
    window.open(url);
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;
    const { contacts } = this.state;
    const { today } = this.state;
    let AddMoreContactsBlock = null;
    let ContactBlock = null;
    const ContactToday = [];
    let NoContactTodayBlock = null;
    /*if (today[0].contactsLeft !== 0) {
      AddMoreContactsBlock = (
        <div className="w-100 w-75-ns fl tc bg-lightest-blue pa3 br1">
          Add <span className="b">{this.state.today[0].contactsLeft}</span> more
          people today to your contacts
        </div>
      );
    }*/
    if (ifAttribute(contacts[0])) {
      ContactBlock = (
        <div className="w-100 w-200-ns fl ph4 tl">
          {contacts.map(contact => (
            <SingleContact contact={contact} key={contact.id} />
          ))}
        </div>
      );
      /*contacts.map(contact => {
        if (
          contact.contactDate === moment().format('l') ||
          moment().isAfter(moment(contact.contactDate, 'MM/DD/YYYY'))
        ) {
          ContactToday.push(contact);
        }
      });*/
    } else {
      ContactBlock = null;
    }
    /*if (ContactToday.length == 0 || ContactToday == null) {
      NoContactTodayBlock = (
        <div className="w-100">
          <img src={NoOneLeft} className="center h4 db" alt="" />
          <p className="center center tc b f4">No pending</p>
        </div>
      );
    }*/
    return !isSignInPending() ? (
      <div>
        <Nav
          profileImage={
            person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
          }
          logout={handleSignOut.bind(this)}
        />
        <div className="mw9 center ph3 cf">
          <div className="w-100 w-200-ns fl ph4 tl">
            <h1> Contacts
            <Link
              to="/add-contact"
              className="f2 link dim ph3 pv2 mb2 dib white bg-green b--black"
            >
            +
            </Link> </h1>
            <div
              className="f6 link dim ph2 pv1 mb2 dib white bg-green b--black pointer"
              onClick={async () => await this.exportContacts()}
            >
              Export as CSV
            </div>
          </div>
          {ContactBlock}
        </div>
      </div>
    ) : null;
  }
}
