

import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
      this.setState({ loading: true });
      this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();
        
        const usersList = Object.keys(usersObject).map(key => ({
            ...usersObject[key],
            uid: key,
        }));
        
        this.setState({
              users: usersList,
              loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <table class="tg">
    <thead><th class="tg-0lax"><strong>ID</strong></th><th class="tg-0lax"><strong>Email</strong></th><th class="tg-0lax"><strong>Username</strong></th></thead>
    <tbody>
    {users.map(user => (
      <tr key={user.uid}>
          <td>
           {user.uid}
          </td>
          <td>
            {user.email}
          </td>
          <td>
            {user.username}
          </td> 
      </tr>
    ))}
    </tbody>
  </table>
);

const condition = authUser => !!authUser;


export default withAuthorization(condition)(withFirebase(AdminPage));

