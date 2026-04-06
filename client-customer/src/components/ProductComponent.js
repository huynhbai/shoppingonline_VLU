import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      // Logic kiểm tra nguồn ảnh: Nếu là link (http) thì dùng luôn, nếu không thì dùng base64
      const imageSource = (item.image && item.image.startsWith('http')) 
        ? item.image 
        : "data:image/jpg;base64," + item.image;

      return (
        <div key={item._id} className="product-item">
          <Link to={'/product/' + item._id}>
            <img
              src={imageSource}
              className="product-image"
              alt={item.name}
              // Thêm style này để đảm bảo ảnh không bị méo khi dùng link ngoài
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Link>
          <div className="product-info">
            <p className="product-name"><b>{item.name}</b></p>
            <p className="product-price">Price: {item.price}</p>
          </div>
        </div>
      );
    });

    return (
      <div className="container-products">
        <h2 className="title-product-main">LIST PRODUCTS</h2>
        <div className="product-grid">
          {prods}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}

export default withRouter(Product);