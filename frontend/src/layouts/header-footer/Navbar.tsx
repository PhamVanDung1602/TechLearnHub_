/* eslint-disable jsx-a11y/anchor-is-valid */

import { useContext, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";
import FooterForm from "../user/components/FooterForm";
import { LoginState } from "../../context/LoginState";
import { PageState } from "../../context/PageState";
import { Link } from "react-router-dom";


function Navbar() {
    const loginState = useContext(LoginState);
    const pageState = useContext(PageState);
    const { setCurrentPage } = pageState;
    const { isLoggedIn, updateLoginStatus } = loginState;
    const [modalOpened, setModalOpened] = useState(false);

    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    const closeModal = () => {
        setModalOpened(false);
        setShowLogin(false);
    }

    const openModal = (modalType: string) => {
        if (modalType === "login") {
            setShowLogin(true);
        }
        setModalOpened(true);
    }

    const handleState = () => {
        updateLoginStatus(isLoggedIn);
    }
    
    //const fullName = useSelector((state: RootState) => state.user.fullName);
    //const email = useSelector((state: RootState) => state.user.email);
    const handlePageChange = (page: string) => {
        setCurrentPage(page);
      };
    
    const handleLogout = async () => {
        var token = localStorage.getItem('token');

        try {
            await fetch(`http://localhost:8080/account/logout?token=${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                }
            );
            localStorage.removeItem('token');
            // localStorage.removeItem('email');

            updateLoginStatus(false);
            window.location.reload();
            handlePageChange("/");
            
        } catch (error) {
            console.error("Xảy ra lỗi:", error);
        }
    }

    //-------------------
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand col-3" to="/" onClick={() => handlePageChange("/")}>
                    <img src={process.env.PUBLIC_URL + "/images/DP.png"} alt="Logo" width="178" height="50" className="d-inline-block align-top" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#">KHÓA HỌC</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">CỘNG ĐỒNG</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">QUY ĐỊNH</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">LIÊN HỆ</a>
                        </li>
                        <li className="nav-item dropdown">
                            <>
                                {isLoggedIn ?
                                    (<div className="nav-link" onChange={handleState}>
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <ul className="dropdown-menu dropdown-menu-dark">
                                            <li><Link className="dropdown-item" to="/account/info" onClick={() => handlePageChange(`/account/info`)}>Thông tin người dùng</Link></li>
                                            <li><Link className="dropdown-item" to="/account/enrolled-course" onClick={() => handlePageChange(`/account/enrolled-course`)}>Khóa học tham gia</Link></li>
                                            <li><Link className="dropdown-item" to="#">Khóa học tự tạo</Link></li>
                                            <li><Link className="dropdown-item" to="#">Danh sách yêu thích</Link></li>
                                            <li><Link className="dropdown-item" to="#">Lịch sử tìm kiếm</Link></li>
                                            <li><Link className="dropdown-item" to="#">Đánh giá và phản hồi</Link></li>
                                            <hr />
                                            <li>
                                                <Link className="dropdown-item" to="/" onClick={handleLogout}>Đăng xuất</Link>
                                            </li>
                                        </ul>
                                    </div>
                                    ) : (
                                        <><Link to="/" className="nav-link" onClick={() => openModal("login")}>
                                            <i className="fas fa-user"></i> LOGIN/SIGN UP
                                        </Link>
                                            <Modal show={modalOpened} onHide={closeModal}>
                                                <ModalHeader closeButton>
                                                    <ModalTitle>
                                                        <h5 className="h1 fw-bold mx-md-4 mt-4">
                                                            {showLogin ? "Đăng nhập" : "Đăng ký"}
                                                        </h5>
                                                    </ModalTitle>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div className="text-center">
                                                        {showLogin ? <LoginForm /> : <RegisterForm />}
                                                        <p>
                                                            {showLogin ? "Not a member? " : "Had an account? "}
                                                            <Link
                                                                to=""
                                                                style={{ textDecoration: "none" }}
                                                                onClick={toggleForm}
                                                            >
                                                                {showLogin ? "Register" : "Login"}
                                                            </Link>
                                                        </p>
                                                        <FooterForm />
                                                    </div>
                                                </ModalBody>
                                            </Modal>
                                        </>
                                    )}
                            </>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar