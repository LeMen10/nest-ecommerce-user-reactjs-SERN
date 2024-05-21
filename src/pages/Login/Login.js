import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import * as request from '~/utils/request';
import styles from './Login.module.scss';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import images from '~/assets/images/images';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = className.bind(styles);

function Login() {
    const location = useLocation();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const previousPage = location.state?.from;
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await request.post(`/user/login`, { username, password });
            console.log(res)
            Cookies.set('token', res.accessToken, { expires });
            if (previousPage === 'register') navigate(-3);
            else navigate(-1);
            console.log(previousPage);

        } catch (error) {
            console.log(error)
            const err = error.response.data.message;
            if (err === 'Not Found') {
                toast.warn('Không tìm thấy tài khoản của bạn.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });
            }
        }
    };

    const handleCancel = () => {
        if (previousPage === 'register') navigate(-3);
        else navigate(-1);
    };
    return (
        <Fragment>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={cx('modal', 'js-modal-login')}>
                <div className={cx('modal__overlay')}>
                    <img style={{ width: '100%', height: '100%' }} src={images.f8Login} alt="" />
                </div>
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form')}>
                        <div className={cx('auth-form__container', 'js-modal-container-login')}>
                            <div className={cx('auth-form__header')}>
                                <h3 className={cx('auth-form__heading')}>Đăng nhập</h3>
                                <Link to={'/register'} className={cx('auth-form__switch-btn', 'js-register')}>
                                    Đăng ký
                                </Link>
                            </div>

                            <div className={cx('auth-form__form')}>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Username của bạn"
                                        name="username"
                                        className={cx('auth-form__input')}
                                        id="auth-form__user-login"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu của bạn"
                                        name="password"
                                        className={cx('auth-form__input')}
                                        id="auth-form__password-login"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={cx('auth-form__aside')}>
                                <p className={cx('auth-form__help')}>
                                    <Link
                                        to={'/forgot_password'}
                                        className={cx('auth-form__help-link', 'auth-form__help-forgot')}
                                    >
                                        Quên mật khẩu
                                    </Link>
                                    <span className={cx('auth-form__help-separate')}></span>
                                    <Link to={''} href="" className={cx('auth-form__help-link')}>
                                        Cần trợ giúp?
                                    </Link>
                                </p>
                            </div>

                            <div className={cx('auth-form__control')}>
                                <Link
                                    to={'/'}
                                    onClick={handleCancel}
                                    className={cx('btn auth-form__control-back', 'btn--normal js-modal-close')}
                                >
                                    TRỞ LẠI
                                </Link>
                                <button
                                    disabled={!username || !password}
                                    value="login"
                                    className={cx('btn', 'btn--primary', 'view-cart')}
                                    onClick={handleSubmit}
                                >
                                    ĐĂNG NHẬP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Login;
