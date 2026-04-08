import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentPage: 1, 
      itemsPerPage: 8 // Đã đổi từ 4 thành 8 ở đây
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    // Cuộn lên đầu vùng danh sách sản phẩm để người dùng dễ quan sát
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    const { products, currentPage, itemsPerPage } = this.state;

    // Logic phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const prods = currentProducts.map((item) => {
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

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="container-products">
        <h2 className="title-product-main">LIST PRODUCTS</h2>
        
        <div className="product-grid">
          {prods}
        </div>

        {/* Thanh phân trang chỉ hiện khi có từ 9 sản phẩm trở lên */}
        {pageNumbers.length > 1 && (
          <div className="pagination">
            {pageNumbers.map(number => (
              <button 
                key={number} 
                onClick={() => this.handlePageChange(number)}
                className={currentPage === number ? "page-btn active" : "page-btn"}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid !== prevProps.params.cid || params.keyword !== prevProps.params.keyword) {
      // Reset về trang 1 khi đổi danh mục hoặc tìm kiếm mới
      this.setState({ currentPage: 1 }, () => {
        this.loadData();
      });
    }
  }

  loadData() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      this.setState({ products: res.data });
    });
  }
  
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      this.setState({ products: res.data });
    });
  }
}

export default withRouter(Product);
