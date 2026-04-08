import React, { Component } from "react";
import MyContext from "./MyContext";
import { setAuthToken } from "../utils/AxiosUtil";

class MyProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // variables
      token: "",
      customer: null,
      mycart: [],

      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
    // Update axios instance with new token
    setAuthToken(value);
  };

  setCustomer = (value) => {
    this.setState({ customer: value });
  };

  setMycart = (value) => {
    this.setState({ mycart: value });
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