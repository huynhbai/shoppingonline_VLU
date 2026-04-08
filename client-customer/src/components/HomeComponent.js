import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      isLoading: true,
      banners: [
        "https://paradox.vn/wp-content/uploads/2025/12/web-1536x908.jpg",
        "https://city89.com/wp-content/uploads/2023/03/20-local-brand-sai-gon-1.png",
        "https://bizweb.dktcdn.net/100/467/832/themes/880849/assets/slide-img2.jpg?1685205373539"
      ]
    };
  }

  componentDidMount() {
    this.apiGetRandomProducts();
  }

  // Thuật toán xáo trộn sản phẩm cho mới mẻ
  shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  async apiGetRandomProducts() {
    try {
      // Dùng đường dẫn tương đối để Render tự hiểu URL
      const res = await axios.get('/api/customer/products'); 
      if (res.data && Array.isArray(res.data)) {
        const finalResult = this.shuffleArray([...res.data]);
        this.setState({ allProducts: finalResult, isLoading: false });
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      this.setState({ isLoading: false });
    }
  }

  renderImage(image) {
    if (!image) return "https://via.placeholder.com/300x400?text=No+Image";
    if (image.startsWith('http')) return image; 
    return "data:image/jpg;base64," + image; 
  }

  renderProductItem(item) {
    return (
      <div key={item._id} className="product-item">
        <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
          <img
            src={this.renderImage(item.image)}
            className="product-image"
            alt={item.name}
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Image+Error" }}
          />
          <div className="product-name">{item.name || "Unnamed Product"}</div>
          <div className="product-price">${item.price}</div>
          <button className="btn-main" style={{ width: '100%' }}>XEM CHI TIẾT</button>
        </Link>
      </div>
    );
  }

  render() {
    return (
      <div className="body-customer">
        <div className="home-banner" style={{ width: '100%', marginBottom: '30px' }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
          >
            {this.state.banners.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt="Banner" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="container-products">
          <h2 style={{ textAlign: 'center', marginBottom: '35px' }}>ALL PRODUCT</h2>
          <div className="product-grid">
            {this.state.allProducts.length > 0 
              ? this.state.allProducts.map(item => this.renderProductItem(item)) 
              : <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                  {this.state.isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy sản phẩm nào."}
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Home;