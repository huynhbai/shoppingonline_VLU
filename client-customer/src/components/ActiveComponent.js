import axios from "axios";
import React, { Component } from "react";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtToken: "",
    };
  }

  render() {
  return (
    <div className="auth-container">
      <h2 className="auth-title">ACTIVATE ACCOUNT</h2>
      <form>
        <table className="auth-table">
          <tbody>
            <tr>
              <td>ID</td>
              <td><input type="text" value={this.state.txtID} onChange={(e) => this.setState({ txtID: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Token</td>
              <td><input type="text" value={this.state.txtToken} onChange={(e) => this.setState({ txtToken: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="ACTIVATE" className="btn-submit-center" onClick={(e) => this.btnActiveClick(e)} />
      </form>
    </div>
  );
}

  btnActiveClick(e) {
    e.preventDefault();

    const id = this.state.txtID;
    const token = this.state.txtToken;

    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert("Please input id and token");
    }
  }

  apiActive(id, token) {
    const body = { id: id, token: token };

    axios.post("/api/customer/active", body).then((res) => {
      const result = res.data;

      if (result) {
        alert("OK BABY!");
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}

export default Active;
