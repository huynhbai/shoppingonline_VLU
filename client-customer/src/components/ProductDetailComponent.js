import axios from 'axios';
import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import MyContext from '../contexts/MyContext';

// Wrapper hỗ trợ Class Component dùng được hook của Router v6
function withRouter(Component) {
  return function (props) {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  }
}

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      txtSize: 'M' // Mặc định chọn size M khi vừa vào trang
    };
  }

  // Xử lý nguồn ảnh (Base64 hoặc URL trực tiếp)
  renderImage(image) {
    if (!image) return "https://via.placeholder.com/400";
    if (image.startsWith('http')) return image; 
    return 'data:image/jpg;base64,' + image; 
  }

  render() {
    const prod = this.state.product;
    const sizes = ['S', 'M', 'L', 'XL']; // Danh sách các size để hiển thị nút bấm

    if (prod != null) {
      return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
            
            {/* CỘT TRÁI: HÌNH ẢNH */}
            <div style={{ flex: '1' }}>
              <img
                src={this.renderImage(prod.image)}
                style={{ width: '100%', borderRadius: '4px', border: '1px solid #f0f0f0' }}
                alt={prod.name}
              />
            </div>

            {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
            <div style={{ flex: '1.2', textAlign: 'left' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '10px', textTransform: 'uppercase' }}>{prod.name}</h1>
              <h2 style={{ color: '#b22222', fontSize: '26px', marginBottom: '20px' }}>Price: ${prod.price}</h2>
              
              <p style={{ marginBottom: '25px', fontSize: '16px', color: '#666' }}>
                Category: <strong style={{ color: '#333' }}>{prod.category?.name || "Áo thun"}</strong>
              </p>

              <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '25px' }} />

              {/* PHẦN CHỌN SIZE (MỚI THÊM) */}
              <div style={{ marginBottom: '30px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>CHỌN SIZE:</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => this.setState({ txtSize: size })}
                      style={{
                        padding: '10px 25px',
                        border: '1px solid #333',
                        backgroundColor: this.state.txtSize === size ? '#333' : '#fff',
                        color: this.state.txtSize === size ? '#fff' : '#333',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHI TIẾT SẢN PHẨM (Mô tả từ MongoDB) */}
              <div style={{ marginBottom: '35px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px', textDecoration: 'underline' }}>Chi tiết sản phẩm:</h4>
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
                  {prod.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </div>
              </div>

              {/* CHỌN SỐ LƯỢNG & NÚT MUA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc' }}>
                  <span style={{ padding: '0 10px', color: '#888' }}>Qty:</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={this.state.txtQuantity}
                    style={{ width: '50px', padding: '10px', border: 'none', textAlign: 'center', outline: 'none' }}
                    onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                  />
                </div>

                <button 
                  onClick={(e) => this.btnAdd2CartClick(e)}
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    color: '#fff', 
                    padding: '15px 50px', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    letterSpacing: '1px'
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Đang tải dữ liệu sản phẩm...</div>;
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.apiGetProduct(id);
  }

  // Hàm gọi API lấy chi tiết sản phẩm
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    }).catch(err => console.error("Lỗi tải sản phẩm:", err));
  }

  // Xử lý thêm vào giỏ hàng (Lưu cả ID, số lượng và Size)
  btnAdd2CartClick(e) {
    e.preventDefault();
    const { product, txtQuantity, txtSize } = this.state;
    const quantity = parseInt(txtQuantity);

    if (quantity > 0 && product) {
      const mycart = this.context.mycart;
      // Tìm xem trong giỏ đã có sản phẩm này cùng SIZE này chưa
      const index = mycart.findIndex(x => x.product._id === product._id && x.size === txtSize);

      if (index === -1) {
        // Nếu chưa có, thêm mới item kèm thuộc tính size
        mycart.push({ product: product, quantity: quantity, size: txtSize });
      } else {
        // Nếu có rồi, chỉ tăng số lượng của đúng item size đó
        mycart[index].quantity += quantity;
      }

      this.context.setMycart(mycart);
      alert(`Đã thêm ${quantity} sản phẩm (Size ${txtSize}) vào giỏ hàng thành công!`);
    } else {
      alert('Số lượng không hợp lệ!');
    }
  }
}

export default withRouter(ProductDetail);