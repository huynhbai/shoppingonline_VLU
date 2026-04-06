import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);

    this.state = {
      txtUsername: "vietngu",
      txtPassword: "123",
    };
  }

  render() {
  return (
    <div className="auth-wrapper">
      <h2>CUSTOMER LOGIN</h2>
      <form>
        <table style={{ margin: '0 auto' }}> {/* Thêm margin auto cho table */}
          <tbody>
            <tr>
              <td>Username</td>
              <td><input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="LOGIN" className="btn-main" onClick={(e) => this.btnLoginClick(e)} />
      </form>
    </div>
  );
}

  btnLoginClick(e) {
    e.preventDefault();

    const username = this.state.txtUsername;
    const password = this.state.txtPassword;

    if (username && password) {
      const account = { username: username, password: password };

      this.apiLogin(account);
    } else {
      alert("Please input username and password");
    }
  }

  apiLogin(account) {
    axios.post("/api/customer/login", account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        this.props.navigate("/home");
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);
