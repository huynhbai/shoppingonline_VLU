import axios from '../utils/AxiosUtil';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  // Hàm xử lý hiển thị ảnh sản phẩm
  renderImage(image) {
    if (!image) return "https://via.placeholder.com/70";
    if (image.startsWith('http')) return image;
    return "data:image/jpg;base64," + image;
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    // Render danh sách các đơn hàng
    const orders = this.state.orders.map((item) => {
      return (
        <tr
          key={item._id}
          onClick={() => this.trItemClick(item)}
          style={{ 
            cursor: 'pointer', 
            borderBottom: '1px solid #eee',
            backgroundColor: this.state.order?._id === item._id ? '#fff5f0' : 'transparent' 
          }}
        >
          <td style={{ padding: '15px' }}>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td style={{ fontWeight: 'bold' }}>${item.total}</td>
          <td style={{ 
            color: item.status === 'APPROVED' ? '#2e7d32' : '#d32f2f', 
            fontWeight: 'bold' 
          }}>
            {item.status}
          </td>
        </tr>
      );
    });

    // Render chi tiết của 1 đơn hàng khi được Click
    let orderDetails = null;
    if (this.state.order) {
      const items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id + (item.size || index)} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '15px' }}>{index + 1}</td>
            <td style={{ textAlign: 'left' }}>{item.product.name}</td>
            
            {/* FIX LỖI SIZE: Lấy size từ item hoặc từ thông tin product kèm theo */}
            <td style={{ fontWeight: 'bold', color: '#c45a11' }}>
              {item.size || item.product.size || 'N/A'}
            </td>

            <td>
              <img
                src={this.renderImage(item.product.image)}
                width="70px"
                height="70px"
                alt={item.product.name}
                style={{ objectFit: 'contain', borderRadius: '8px', border: '1px solid #f0f0f0' }}
              />
            </td>
            <td>${item.product.price}</td>
            <td>{item.quantity}</td>
            <td style={{ fontWeight: 'bold' }}>${item.product.price * item.quantity}</td>
          </tr>
        );
      });

      orderDetails = (
        <div style={{ 
          marginTop: '50px', 
          padding: '30px', 
          backgroundColor: '#fff', 
          borderRadius: '15px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>ORDER DETAIL</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', color: '#666', textTransform: 'uppercase', fontSize: '13px' }}>
                <th style={{ padding: '15px' }}>No.</th>
                <th>Prod. Name</th>
                <th>Size</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ 
          padding: '30px', 
          backgroundColor: '#fff', 
          borderRadius: '15px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>MY ORDERS</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', color: '#666', textTransform: 'uppercase', fontSize: '13px' }}>
                <th style={{ padding: '15px' }}>Order ID</th>
                <th>Date</th>
                <th>Cust. Name</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders : <tr><td colSpan="6" style={{ padding: '40px', color: '#999' }}>No orders found.</td></tr>}
            </tbody>
          </table>
        </div>

        {orderDetails}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  trItemClick(item) {
    // Log để ông kiểm tra dữ liệu size có thực sự tồn tại trong mảng items không
    console.log("Selected Order Data:", item);
    this.setState({ order: item });
  }

  apiGetOrdersByCustID(cid) {
    axios.get('/api/customer/orders/customer/' + cid).then((res) => {
      this.setState({ orders: res.data });
    }).catch(err => console.error("API Error:", err));
  }
}

export default Myorders;