import axios from '../utils/AxiosUtil';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
          <td>
            {item.status === 'PENDING' ? (
              <div>
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkApproveClick(item._id);
                  }}
                >
                  APPROVE
                </span>
                {' || '}
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkCancelClick(item._id);
                  }}
                >
                  CANCEL
                </span>
              </div>
            ) : (
              <div />
            )}
          </td>
        </tr>
      );
    });

    let items = [];
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={"data:image/jpg;base64," + item.product.image}
                width="70"
                height="70"
                alt=""
              />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        {/* ORDER LIST */}
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust. name</th>
                <th>Cust. phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>

        {/* ORDER DETAIL */}
        {this.state.order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod. ID</th>
                  <th>Prod. name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  // click row
  trItemClick(item) {
    this.setState({ order: item });
  }

  // ===== BUTTON HANDLERS =====
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // ===== API =====
  apiGetOrders() {
    axios.get('/api/admin/orders').then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };

    axios.put('/api/admin/orders/status/' + id, body).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders(); // reload list
      } else {
        alert('SORRY BABY!');
      }
    });
  }
}

export default Order;