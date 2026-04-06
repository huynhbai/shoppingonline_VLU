import axios from "axios";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
  }

  render() {
    // Style khi mục Menu được chọn
    const activeClassCustom = {
      color: "#ff6600",
      fontWeight: "bold",
      borderBottom: "3px solid #ff6600",
      paddingBottom: "5px",
      textDecoration: "none"
    };

    // Style mặc định
    const normalStyle = {
      textDecoration: "none",
      color: "#a0522d",
      fontWeight: "600",
      margin: "0 15px",
      display: "inline-block",
      transition: "0.3s"
    };

    const cates = this.state.categories.map((item) => (
      <li key={item._id} style={{ display: "inline-block" }}>
        <NavLink 
          to={"/product/category/" + item._id} 
          style={({ isActive }) => (isActive ? activeClassCustom : normalStyle)}
          activeStyle={activeClassCustom}
        >
          {item.name.toUpperCase()}
        </NavLink>
      </li>
    ));

    return (
      <nav className="category-menu" style={{ 
        textAlign: "center", 
        padding: "15px 0",
        backgroundColor: "#fff", // Phải có nền trắng để không bị đè lên sản phẩm
        borderBottom: "1px solid #eee",
        // --- ĐOẠN CODE GIÚP MENU CỐ ĐỊNH ---
        position: "sticky", 
        top: 0, 
        zIndex: 1000, 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)" // Thêm đổ bóng nhẹ khi lướt cho đẹp
      }}>
        <ul className="menu-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ display: "inline-block" }}>
            <NavLink 
              exact to="/" 
              style={({ isActive }) => (isActive ? activeClassCustom : normalStyle)}
              activeStyle={activeClassCustom}
            >
              HOME
            </NavLink>
          </li>
          {cates}
        </ul>
      </nav>
    );
  }

  componentDidMount() {
    axios.get("/api/customer/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  }
}

export default Menu;