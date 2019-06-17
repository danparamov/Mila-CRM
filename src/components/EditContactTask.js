import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
  isSignInPending,
  putFile,
  getFile,
  loadUserData,
  Person,
} from 'blockstack';
import { Redirect } from 'react-router';
import 'react-toastify/dist/ReactToastify.min.css';
import findObjectBy from './util/findObjectBy';
import avatarFallbackImage from '../assets/avatar-placeholder.png';
import Nav from './Nav';
import Form from './styles/Form';
import Error from './ErrorMessage';

class EditContactTaskPage extends Component {
  state = {
    id: '',
    contactname: '',
    subject: '',
    duedate: '',
    rank: '',
    status: '',
    description: '',
    contacttasks: [],
    contactDate: '',
    created_at: '',
    contacts: [],
    contactsnames: [],
    person: {
      name() {
        return 'Anonymous';
      },
      avatarUrl() {
        return avatarFallbackImage;
      },
    },
    username: '',
    saved: false,
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
    getFile('contacttasks.json', options).then(file => {
      const contacttasks = JSON.parse(file || '[]');
      const contacttask = findObjectBy(contacttasks, {
        id: this.props.location.search.substring(4),
      });
      if (!contacttask) {
        this.props.history.push('/contacttasks');
      }
      this.setState({
        contacttasks,
        id: contacttask[0].id,
        contactname: contacttask[0].contactname,
        subject: contacttask[0].subject,
        duedate: contacttask[0].duedate,
        rank: contacttask[0].rank,
        status: contacttask[0].status,
        description: contacttask[0].description,
        contactDate: contacttask[0].contactDate,
        created_at: contacttask[0].created_at,
        priority: contacttask[0].priority,
      });
    });
    getFile('contacts.json', options).then(file => {
      const contacts = JSON.parse(file || '[]');
      const contactsnames = contacts.map((contact) => contact.name);
      this.setState({
        contacts,
        contactsnames,
      });
    });
  }

  deleteContactTask() {
    const toDelete = this.state.id;
    const newContactsList = this.state.contacttasks.filter(
      contacttask => contacttask.id !== toDelete
    );
    const options = { encrypt: true };
    putFile('contacttasks.json', JSON.stringify(newContactsList), options).then(
      () => {
        this.props.history.push('/contacttasks');
      }
    );
  }

  handleEditContactTaskSubmit(event) {
    event.preventDefault();
    this.saveEditedContactTask();
  }

  saveEditedContactTask() {
    let { contacttasks } = this.state;
    const newContactTask = {
      id: this.state.id,
      contactname: this.state.contactname,
      subject: this.state.subject,
      duedate: this.state.duedate,
      rank: this.state.rank,
      status: this.state.status,
      description: this.state.description,
      priority: this.state.priority,
      contactDate: this.state.contactDate,
      created_at: this.state.created_at,
    };
    
    contacttasks = contacttasks.filter(contacttask => contacttask.id !== newContactTask.id);
    contacttasks.unshift(newContactTask);
    const options = { encrypt: true };
    putFile('contacttasks.json', JSON.stringify(contacttasks), options).then(() => {});
    this.setState({
      saved: true,
    });
  }

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const {contactsnames} = this.state;
    const error = false;

    if (this.state.saved) {
      //return <Redirect to={`/contact?id=${this.state.id}`} />;
      return <Redirect to={`/contacttasks`} />;
    }
    return !isSignInPending() ? (
      <div>
        <Nav
          profileImage={
            person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
          }
          logout={handleSignOut.bind(this)}
        />
        <div className="mw9 center ph3 cf">
          <h1>Edit Contact Task</h1>
          <div className="w-70-l fl">
            <Form
              onSubmit={async e => {
                e.preventDefault();
                this.handleEditContactTaskSubmit(e);
              }}
            >
              <Error error={error} />
              <fieldset>
                <label htmlFor="contactname">
                  Contact Name
                  <select onChange={this.handleChange} id="contactname" name="contactname">
                  <option value="">
                    {this.state.contactname}
                  </option>
                   {
                    contactsnames.map(function(X) {
                    return <option>{X}</option>;
                    })
                   }  
                 </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="subject">
                  Subject
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Subject.."
                    value={this.state.subject}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="duedate">
                  Due Date
                  <input
                    type="date"
                    id="duedate"
                    name="duedate"
                    placeholder="Click to select Due Date.."
                    value={this.state.duedate}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="rank">
                  Priority
                  <select
                    type="text"
                    id="rank"
                    name="rank"
                    value={this.state.rank}
                    onChange={this.handleChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="status">
                  Status
                  <select
                    type="text"
                    id="status"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <option value="Deferred">Deferred</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Completed">Completed</option>
                    <option value="Waiting">Waiting</option>
                  </select>
                </label>
              </fieldset>
              <fieldset>
                <label htmlFor="description">
                  Description
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description.."
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <a
                className="pointer link dim ba bw1 ph2 pv2 mb2 dib no-underline ba b--white white mr2 bg-green"
                onClick={() => {
                  this.deleteContactTask();
                }}
              >
                Delete
              </a>
              <button type="submit" className="bg-black">
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const EditContactTask = withRouter(EditContactTaskPage);

export default EditContactTask;
