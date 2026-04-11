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
      itemsPerPage: 8,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { cid, keyword } = this.props.params;
    if (cid !== prevProps.params.cid || keyword !== prevProps.params.keyword) {
      // Reset về trang 1 khi danh mục hoặc từ khóa thay đổi
      this.setState({ currentPage: 1 }, () => this.loadData());
    }
  }

  loadData() {
    const { cid, keyword } = this.props.params;
    if (cid) {
      this.apiGetProductsByCatID(cid);
    } else if (keyword) {
      this.apiGetProductsByKeyword(keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get(`/api/customer/products/category/${cid}`).then((res) => {
      this.setState({ products: res.data });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get(`/api/customer/products/search/${keyword}`).then((res) => {
      this.setState({ products: res.data });
    });
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  renderImage(image) {
    if (!image) return "https://via.placeholder.com/300";
    return image.startsWith('http') ? image : `data:image/jpg;base64,${image}`;
  }

  render() {
    const { products, currentPage, itemsPerPage } = this.state;

    // Logic xử lý phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
      <div className="container-products">
        <h2 className="title-product-main">LIST PRODUCTS</h2>

        <div className="product-grid">
          {currentProducts.map((item) => (
            <div key={item._id} className="product-item">
              <Link to={`/product/${item._id}`}>
                <div className="product-image-wrapper">
                  <img
                    src={this.renderImage(item.image)}
                    className="product-image"
                    alt={item.name}
                  />
                </div>
              </Link>
              <div className="product-info">
                <p className="product-name"><strong>{item.name}</strong></p>
                <p className="product-price">${item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Thanh phân trang */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => this.handlePageChange(num)}
                className={`page-btn ${currentPage === num ? "active" : ""}`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Product);