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
    // Style cho các mục Menu khi được chọn
    const activeClassCustom = {
      color: "#ff6600",
      fontWeight: "bold",
      borderBottom: "3px solid #ff6600",
      paddingBottom: "5px",
      textDecoration: "none"
    };

    // Style cho các mục Menu bình thường
    const normalStyle = {
      textDecoration: "none",
      color: "#c05a16",
      fontWeight: "bold",
      margin: "0 15px",
      display: "inline-block",
      transition: "0.3s",
      textTransform: "uppercase",
      fontSize: "16px"
    };

    const cates = this.state.categories.map((item) => (
      <li key={item._id} style={{ display: "inline-block" }}>
        <NavLink 
          to={"/product/category/" + item._id} 
          style={({ isActive }) => (isActive ? activeClassCustom : normalStyle)}
        >
          {item.name.toUpperCase()}
        </NavLink>
      </li>
    ));

    return (
      <nav className="category-menu">
        <ul className="menu-list">
          
          {/* --- PHẦN LOGO MỚI (TO & KHÔNG NỀN) --- */}
          <li className="logo-item">
            <Link to="/">
              <img 
                src="https://i.postimg.cc/6QXzbmrS/whose-removebg-preview-1.png" 
                alt="Logo" 
                className="main-logo"
                referrerPolicy="no-referrer" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=LOGO"; }}
              />
            </Link>
          </li>

          {/* --- CÁC MỤC MENU --- */}
          <li style={{ display: "inline-block" }}>
            <NavLink 
              to="/home" 
              style={({ isActive }) => (isActive ? activeClassCustom : normalStyle)}
            >
              HOME
            </NavLink>
          </li>
          {cates}
        </ul>
      </nav>
    );
  }
}

export default Menu;