import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import withRouter from '../utils/withRouter';

class Inform extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { txtKeyword: '' };
  }

  render() {
    return (
      <div className="header-container">
        <div className="header-content">
          
          {/* 1. Thanh Search */}
          <div className="search-box">
            <form className="search-form-new" onSubmit={(e) => this.btnSearchClick(e)}>
              <input
                type="search"
                placeholder="Search..."
                className="keyword-large"
                value={this.state.txtKeyword}
                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
              />
              <button type="submit" className="btn-search-icon">SEARCH</button>
            </form>
          </div>

          {/* 2. Cụm Icon & Giỏ hàng */}
          <div className="header-right-group">
            <div className="user-dropdown">
              {/* Thêm wrapper để giữ vùng hover ổn định */}
              <div className="user-icon-wrapper">
                <span className="user-static-icon">👤</span>
              </div>
              
              <div className="dropdown-content">
                <div className="menu-group">
                  {this.context.token === "" ? (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/signup">Sign-up</Link>
                      <Link to="/active">Active</Link> {/* Đã thêm lại chức năng Active */}
                    </>
                  ) : (
                    <>
                      <span className="hello-text">Hi, {this.context.customer.name}</span>
                      <Link to="/myprofile">Profile</Link>
                      <Link to="/myorders">Orders</Link>
                      <Link to="/home" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="cart-wrapper">
              <Link to="/mycart" className="cart-link">
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{this.context.mycart.length}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }

  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default withRouter(Inform);