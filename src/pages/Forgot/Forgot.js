import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import styles from './Forgot.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import { LockIcon } from '~/components/Icons/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);

    const handleSubmit = async () => {
        try {
            await request.post(`/forgot_password`, { email });
            setForgotSuccess(true);
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
            if (err === 'User not found') {
                toast.warn('Email này của bạn chưa được đăng ký ! Hãy thử lại hoặc tạo tài khoản mới.', {
                    position: 'top-right',
                    autoClose: 2000,
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
                autoClose={5000}
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
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form')}>
                        <div className={cx('auth-form__container')}>
                            <div className={cx('auth-form__header')}>
                                <h3 className={cx('auth-form__heading')}>Đặt lại mật khẩu</h3>
                            </div>

                            {forgotSuccess ? (
                                <Fragment>
                                    <div className={cx('auth-form__form')}>
                                        <div
                                            className={cx('auth-form__form')}
                                            style={{ width: '100%', textAlign: 'center' }}
                                        >
                                            <LockIcon />
                                        </div>

                                        <div className={cx('auth-form__form')}>
                                            <p style={{ textAlign: 'center' }}>
                                                Mã xác minh đã được gửi đến địa chỉ email
                                            </p>
                                            <p
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'rgba(0, 186, 131, 1)',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                {email}.
                                            </p>
                                            <p style={{ textAlign: 'center' }}>Vui lòng xác minh.</p>
                                        </div>
                                    </div>

                                    <div className={cx('auth-form__control')}>
                                        <Link
                                            to={'/login'}
                                            className={cx('btn', 'auth-form__control-back', 'btn--primary')}
                                            style={{ fontWeight: '700' }}
                                        >
                                            OK
                                        </Link>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <div className={cx('auth-form__form')}>
                                        <div className={cx('auth-form__group')}>
                                            <input
                                                type="text"
                                                // placeholder="Có cái mật khẩu cũng không nhớ 😒, nhập Email đi tao reset cho 😏"
                                                placeholder="Nhập Email để reset mật khẩu."
                                                name="email"
                                                className={cx('auth-form__input')}
                                                id="auth-form__user-login"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('auth-form__control')}>
                                        <Link
                                            to={'/login'}
                                            className={cx('btn auth-form__control-back', 'btn--normal js-modal-close')}
                                        >
                                            Trở lại
                                        </Link>
                                        <button
                                            value="login"
                                            className={cx('btn', 'btn--primary', 'view-cart')}
                                            onClick={handleSubmit}
                                            disabled={!email}
                                        >
                                            Tiếp tục
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Forgot;
