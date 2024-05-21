import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import styles from './Register.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import images from '~/assets/images/images';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Register() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [checukUsername, setCheckUserName] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    const navigate = useNavigate();

    const checkRegex = () => {
        const regexEmail = /^[a-zA-Z0-9]+@gmail\.com$/;
        const regexUsername = /^[a-zA-Z0-9]{3,7}$/;
        const regexPassword = /^.{2,8}$/;

        if (!regexPassword.test(password) && !regexUsername.test(username) && !regexEmail.test(email)) {
            setCheckEmail(true);
            setCheckUserName(true);
            setCheckPassword(true);
        }
        if (!regexEmail.test(email) && !regexUsername.test(username)) {
            setCheckEmail(true);
            setCheckUserName(true);
        }
        if (!regexEmail.test(username) && !regexUsername.test(password)) {
            setCheckPassword(true);
            setCheckUserName(true);
        }
        if (!regexEmail.test(email) && !regexUsername.test(password)) {
            setCheckEmail(true);
            setCheckPassword(true);
        }

        if (!regexEmail.test(email)) {
            setCheckEmail(true);
            return;
        }
        if (!regexUsername.test(username)) {
            setCheckUserName(true);
            return;
        }

        if (!regexPassword.test(password)) {
            setCheckPassword(true);
            return;
        }

        handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            const res = await request.post(`/user/register`, {
                username,
                password,
                email,
                role: 'user'
            });
            if (res.message === 'Sign Up Success') navigate('/login', { state: { from: 'register' } });
        } catch (error) {
            console.log(error)
            const err = error.response.data.message;
            if (err === 'Account already exists') {
                toast.warn('Username hoặc Email đã có người đăng ký. Vui lòng kiểm tra lại !!!', {
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
            <div className={cx('modal', 'js-modal-register')}>
                <div className={cx('modal__overlay')}>
                    <img style={{ width: '100%', height: '100%' }} src={images.f8Login} alt="" />
                </div>
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form ')}>
                        <div className={cx('auth-form__container', 'js-modal-container')}>
                            <div className={cx('auth-form__header')}>
                                <h3 className={cx('auth-form__heading')}>Đăng ký</h3>
                                <span
                                    onClick={() => navigate('/login', { state: { from: 'register' } })}
                                    className={cx('auth-form__switch-btn', 'js-login ')}
                                >
                                    Đăng nhập
                                </span>
                            </div>

                            <div className={cx('auth-form__form')}>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Tên đăng nhập"
                                        className={cx('auth-form__input')}
                                        id="auth-form__username"
                                        value={username}
                                        onChange={(e) => {
                                            setUserName(e.target.value);
                                            setCheckUserName(false);
                                        }}
                                    />
                                    {checukUsername && (
                                        <div className={cx('error')}>
                                            Username chứa 3-7 kí tự và không chứa ký tự đặc biệt.
                                        </div>
                                    )}
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email của bạn"
                                        className={cx('auth-form__input')}
                                        id="auth-form__email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setCheckEmail(false);
                                        }}
                                    />
                                    {checkEmail && <div className={cx('error')}>Email chưa đúng định dạng.</div>}
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu của bạn"
                                        className={cx('auth-form__input')}
                                        id="auth-form__password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setCheckPassword(false);
                                        }}
                                    />
                                    {checkPassword && <div className={cx('error')}>Mật khẩu từ 2 - 8 kí tự.</div>}
                                </div>
                            </div>

                            <div className={cx('auth-form__aside')}>
                                <p className={cx('auth-form__policy-text')}>
                                    Bằng việc đăng ký, bạn đã đồng ý với Nest - Multipurpose eCommerce về
                                    <Link to={''} className={cx('auth-form__text-link')}>
                                        Điều khoản dịch vụ
                                    </Link>{' '}
                                    &
                                    <Link to={''} className={cx('auth-form__text-link')}>
                                        Chính sách bảo mật
                                    </Link>
                                </p>
                            </div>

                            <div className={cx('auth-form__control')}>
                                <Link
                                    to={'/'}
                                    className={cx('btn auth-form__control-back', 'btn--normal js-modal-close')}
                                >
                                    TRỞ LẠI
                                </Link>
                                <button
                                    disabled={!username || !password || !email}
                                    className={cx('btn', 'btn--primary', 'view-cart')}
                                    onClick={checkRegex}
                                >
                                    ĐĂNG KÝ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Register;
