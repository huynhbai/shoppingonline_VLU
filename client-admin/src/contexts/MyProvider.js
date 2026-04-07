import React, { Component } from 'react';
import MyContext from './MyContext';
import { setAuthToken } from '../utils/AxiosUtil';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('token') || '';
    // Initialize axios with the stored token
    if (token) {
      setAuthToken(token);
    }

    this.state = {
      token: token,
      username: localStorage.getItem('username') || '',

      // functions
      setToken: this.setToken,
      setUsername: this.setUsername,
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
    localStorage.setItem('token', value);
    // Update axios instance with new token
    setAuthToken(value);
  };

  setUsername = (value) => {
    this.setState({ username: value });
    localStorage.setItem('username', value);
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
