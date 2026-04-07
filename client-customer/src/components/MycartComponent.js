import React, { Component } from 'react';
import axios from '../utils/AxiosUtil';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const mycart = this.context.mycart;
    const items = mycart.map((item, index) => {
      const imageSource = (item.product.image && item.product.image.startsWith('http'))
        ? item.product.image
        : "data:image/jpg;base64," + item.product.image;

      return (
        // Key nên kết hợp ID và Size để đảm bảo tính duy nhất
        <tr key={item.product._id + item.size}>
          <td>{index + 1}</td>
          <td>{item.product.name}</td>
          <td>{item.product.category.name}</td>
          {/* THÊM CỘT HIỂN THỊ SIZE */}
          <td style={{ fontWeight: 'bold', color: '#c05a16' }}>{item.size}</td>
          <td>
            <img 
              src={imageSource} 
              width="70px" 
              height="70px" 
              alt={item.product.name} 
              style={{ objectFit: 'cover', borderRadius: '4px' }} 
            />
          </td>
          <td>{item.product.price}</td>
          <td>{item.quantity}</td>
          <td>{item.product.price * item.quantity}</td>
          <td>
            {/* TRUYỀN CẢ ID VÀ SIZE VÀO HÀM XÓA */}
            <span className="link-remove" onClick={() => this.lnkRemoveClick(item.product._id, item.size)}>REMOVE</span>
          </td>
        </tr>
      );
    });

    return (
      <div className="cart-container">
        <h2 className="auth-title">MY SHOPPING CART</h2>
        <table className="cart-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Category</th>
              <th>Size</th> {/* Thêm header Size */}
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items : <tr><td colSpan="9">Your cart is empty</td></tr>}
            <tr className="cart-total-row">
              <td colSpan="6"></td>
              <td style={{ fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ fontWeight: 'bold', color: '#c05a16' }}>{CartUtil.getTotal(mycart)}</td>
              <td>
                <span className="link-checkout" onClick={() => this.lnkCheckoutClick()}>CHECKOUT</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // CẬP NHẬT LOGIC XÓA: Phải khớp cả ID và Size
  lnkRemoveClick(id, size) {
    const mycart = [...this.context.mycart]; // Tạo bản sao mảng

    const index = mycart.findIndex(
      x => x.product._id === id && x.size === size
    );

    if (index !== -1) {
      if (window.confirm('Remove this item?')) {
        mycart.splice(index, 1);
        this.context.setMycart(mycart);
      }
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart.length > 0) {
      if (window.confirm('ARE YOU SURE TO CHECKOUT?')) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;

        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          alert('Please login to checkout');
          this.props.navigate('/login');
        }
      }
    } else {
      alert('Your cart is empty');
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    axios.post('/api/customer/checkout', body).then((res) => {
      const result = res.data;
      if (result) {
        alert('CHECKOUT SUCCESSFUL!');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('CHECKOUT FAILED!');
      }
    });
  }
}

export default withRouter(Mycart);