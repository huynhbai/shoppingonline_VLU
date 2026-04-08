import axios from "axios";
import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
  }

  componentDidMount() {
    axios.get("/api/customer/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id}>
        <NavLink 
          to={"/product/category/" + item._id} 
          className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
        >
          {item.name.toUpperCase()}
        </NavLink>
      </li>
    ));

    return (
      <nav className="category-menu">
        <ul className="menu-list">
          {/* LOGO NẰM ĐẦU TIÊN (BÊN TRÁI HOME) */}
          <li className="logo-item">
            <Link to="/">
              <img 
                src="https://cdn.phototourl.com/free/2026-04-07-5c3f92a4-316e-4629-b5e8-0cf7a51d5f42.png" 
                alt="Logo" 
                className="main-logo"
                referrerPolicy="no-referrer" /* Thêm dòng này để tránh bị chặn ảnh */
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=LOGO"; }} /* Ảnh dự phòng nếu link chết */
              />
            </Link>
          </li>

          {/* NÚT HOME */}
          <li>
            <NavLink 
              to="/home" 
              className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
            >
              HOME
            </NavLink>
          </li>

          {/* CÁC DANH MỤC KHÁC */}
          {cates}
        </ul>
      </nav>
    );
  }
}

export default Menu;
