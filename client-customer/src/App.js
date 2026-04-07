import "./App.css";
import React, { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import MyProvider from "./contexts/MyProvider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false
    };
  }

  componentDidMount() {
    // Lắng nghe sự kiện cuộn chuột khi component vừa xuất hiện
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // Hủy lắng nghe khi component bị xóa để tránh tốn tài nguyên
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    // Tính toán vị trí cuộn
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    // Nếu cuộn quá 40% trang thì hiện nút (isVisible = true)
    if (scrolled > scrollHeight * 0.4) {
      this.setState({ showButton: true });
    } else {
      this.setState({ showButton: false });
    }
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Cuộn mượt mà lên đầu trang
    });
  };

  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <div className="App">
            <Main />

            {/* Hiển thị nút mũi tên khi showButton là true */}
            {this.state.showButton && (
              <button className="back-to-top-btn" onClick={this.scrollToTop}>
                <i className="fa fa-chevron-up"></i> {/* Bạn có thể thay bằng ký tự ▲ nếu không dùng font-awesome */}
                ▲
              </button>
            )}
          </div>
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;