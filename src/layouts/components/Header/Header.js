import React from 'react';
import images from '~/assets/images/images';
import Search from '~/layouts/components/Search/Search';
import className from 'classnames/bind';
import styles from './Header.module.scss';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CartIcon, HeartIcon, UserIcon } from '~/components/Icons';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const cx = className.bind(styles);

function Header({ variable }) {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [boxShadowHeader, setBoxShadowHeader] = useState('');
    const [username, setUsername] = useState();
    const [countItemsCart, setCountItemsCart] = useState();

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 31) setBoxShadowHeader('header-top-z-index');
            else setBoxShadowHeader('');
        });
    }, []);

    useEffect(() => {
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.get(`${process.env.REACT_APP_BASE_URL}/user/get-username`)
            .then((res) => {
                setUsername(res.data.username);
            })
            .catch((error) => {});
    }, [navigate, token]);

    useEffect(() => {
        if (token) {
            const api = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            api.get(`${process.env.REACT_APP_BASE_URL}/cart/number-items-cart`)
                .then((res) => {
                    setCountItemsCart(res.data.count);
                })
                .catch((error) => {});
        }
    }, [variable, token]);

    const handleLogout = () => {
        Cookies.remove('token');
        setUsername(undefined);
    };
    return (
        <div className={cx('header', `${boxShadowHeader}`)}>
            <div className={cx('container_m')}>
                <div className={cx('header-wrap')}>
                    <Link to={'/'} className={cx('logo-primary')}>
                        <img className={cx('icon-logo')} src={images.logo} alt="nest-ecommerce" />
                    </Link>
                    <div className={cx('header-mid')}>
                        <Search />
                        <div className={cx('header-nav', 'mt-20')}>
                            <ul className={cx('nav-list')}>
                                <li className={cx('nav-item')}>
                                    <Link className={cx('nav-link', 'nav-link-pc')} to={'/'}>
                                        Home
                                    </Link>
                                </li>
                                <li className={cx('nav-item')}>
                                    <Link className={cx('nav-link', 'nav-link-pc')} to={'/shop'}>
                                        Shop
                                    </Link>
                                </li>
                                <li className={cx('nav-item')}>
                                    <Link className={cx('nav-link', 'nav-link-pc')} to={'/about'}>
                                        About
                                    </Link>
                                </li>

                                <li className={cx('nav-item')}>
                                    <Link className={cx('nav-link', 'nav-link-pc')} to={'/contact'}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={cx('header-action')}>
                        <Link to={''}>
                            <HeartIcon className={cx('icon-heart')} />
                        </Link>
                        <Link to={'/cart'} className={cx('icon-cart')}>
                            <CartIcon />
                            <span className={cx('count-product-cart')}>{countItemsCart || 0}</span>
                        </Link>
                        {username ? (
                            <div className={cx('header-action-logged')}>
                                {/* <div id="js-accout-user"></div> */}
                                <p>{username}</p>
                                <div className={cx('logged-dropdown-wrap', 'modal-dropdow-hover')}>
                                    <ul className={cx('logged-dropdown-list')}>
                                        <li className={cx('logged-dropdown-item', 'js-order-history')}>
                                            <Link
                                                to={'/user/purchase?type=noted'}
                                                className={cx('logged-dropdown-item-content')}
                                            >
                                                <i className={cx('fa-solid', 'fa-cart-shopping')}></i>
                                                <p>Purchase</p>
                                            </Link>
                                        </li>
                                        <li className={cx('logged-dropdown-item')}>
                                            <div onClick={handleLogout} className={cx('logged-dropdown-item-content')}>
                                                <i
                                                    className={cx('fa-solid', 'fa-right-from-bracket', 'icon-logout')}
                                                ></i>
                                                <p className={cx('js-log-out')}>Log Out</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <Link to={'/login'}>{<UserIcon className={cx('icon-user')} />}</Link>
                        )}

                        {/* <FontAwesomeIcon className={cx('icon-cart')} icon={faCartShopping} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
