import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import CSS của Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      isLoading: true,
      // Đã cập nhật link ảnh banner chất lượng cao
      banners: [
       "https://paradox.vn/wp-content/uploads/2025/12/web-1536x908.jpg",
       "https://city89.com/wp-content/uploads/2023/03/20-local-brand-sai-gon-1.png",
       "https://bizweb.dktcdn.net/100/467/832/themes/880849/assets/slide-img2.jpg?1685205373539"
      ]
    };
  }

  // Thuật toán trộn bài Fisher-Yates
  shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  renderImage(image) {
    if (!image) return "https://via.placeholder.com/300x400?text=No+Image";
    if (image.startsWith('http')) return image; 
    return "data:image/jpg;base64," + image; 
  }

  renderProductItem(item) {
    if (!item || !item._id) return null;
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
        {/* --- PHẦN SLIDESHOW TỰ ĐỘNG --- */}
        <div className="home-banner" style={{ width: '100%', marginBottom: '30px', backgroundColor: '#f0f0f0' }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            loop={true} // Lặp lại vô tận
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            style={{ width: '100%', height: 'auto' }}
          >
            {this.state.banners.map((img, index) => (
              <SwiperSlide key={index}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={img} 
                    alt={`Banner ${index}`} 
                    style={{ 
                      width: '100%', 
                      maxHeight: '600px', // Giới hạn chiều cao để không chiếm hết màn hình
                      objectFit: 'cover', 
                      display: 'block' 
                    }} 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="container-products">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '35px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
            <h2 className="title-product-main" style={{ margin: '0 20px' }}>ALL PRODUCT</h2>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
          </div>

          <div className="product-grid">
            {this.state.allProducts.length > 0 
              ? this.state.allProducts.map(item => this.renderProductItem(item)) 
              : <div style={{ textAlign: 'center', width: '100%', color: '#999', padding: '50px' }}>
                  {this.state.isLoading ? "Đang tải và xáo trộn sản phẩm..." : "Không tìm thấy sản phẩm nào."}
                </div>
            }
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetRandomProducts();
  }

  async apiGetRandomProducts() {
    const categoryIds = [
      '6288b164708fabf8ab29ca0a',
      '6288b174708fabf8ab29ca0d',
      '6288b180708fabf8ab29ca10',
      '6977144c28159daa56666e7a'
    ];

    try {
      const requests = categoryIds.map(id => axios.get(`/api/customer/products/category/${id}`));
      const responses = await Promise.all(requests);
      let combined = [];
      responses.forEach(res => {
        if (res.data && Array.isArray(res.data)) {
          combined = [...combined, ...res.data];
        }
      });
      const finalResult = this.shuffleArray([...combined]);
      this.setState({ allProducts: finalResult, isLoading: false });
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      this.setState({ isLoading: false });
    }
  }
}

export default Home;