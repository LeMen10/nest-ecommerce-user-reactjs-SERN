import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Purchase.module.scss';
import Image from '~/components/Image';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Purchase() {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState([]);
    const [checkCancelled, setCheckCancelled] = useState(false);
    const [orderDetailId, setOrderDetailId] = useState();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type');

    const [activeLink, setActiveLink] = useState('noted');

    const handleLinkClick = (type) => {
        setActiveLink(type);
    };

    useEffect(() => {
        setActiveLink(type);
    }, [type]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.post(`/user/purchase?type=${type}`);
                console.log(res.data)
                setOrderDetails(res.data);
            } catch (error) {
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate, type]);

    const renderPage = (id) => {
        switch (type) {
            case 'complete':
                return (
                    <button className={cx('btn')} style={{ border: '1px solid #e8e8e8' }}>
                        Mua lại
                    </button>
                );
            case 'noted':
                return (
                    <button
                        className={cx('btn')}
                        style={{ border: '1px solid #e8e8e8' }}
                        onClick={() => {
                            setCheckCancelled(true);
                            setOrderDetailId(id);
                        }}
                        data-target={id}
                    >
                        Hủy đơn hàng
                    </button>
                );
            case 'delivering':
                return (
                    <button className={cx('btn')} style={{ border: '1px solid #e8e8e8' }}>
                        Hủy đơn hàng
                    </button>
                );
            default:
                return;
        }
    };

    const handleCancelledOrder = async () => {
        try {
            await request.put(`/user/order-cancel/${orderDetailId}`);
            setCheckCancelled(false);
            navigate('/user/purchase?type=cancelled');
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Đơn mua</h3>
                </div>

                <div className={cx('cate-purchase')}>
                    <Link
                        to={'?type=noted'}
                        className={cx('item-link', { active: activeLink === 'noted' })}
                        onClick={() => handleLinkClick('noted')}
                    >
                        <span>Đã ghi nhận</span>
                    </Link>
                    <Link
                        to={'?type=delivering'}
                        className={cx('item-link', { active: activeLink === 'delivering' })}
                        onClick={() => handleLinkClick('delivering')}
                    >
                        <span>Đang giao hàng</span>
                    </Link>
                    <Link
                        to={'?type=cancelled'}
                        className={cx('item-link', { active: activeLink === 'cancelled' })}
                        onClick={() => handleLinkClick('cancelled')}
                    >
                        <span>Đã hủy</span>
                    </Link>
                    <Link
                        to={'?type=complete'}
                        className={cx('item-link', { active: activeLink === 'complete' })}
                        onClick={() => handleLinkClick('complete')}
                    >
                        <span>Hoàn thành</span>
                    </Link>
                </div>

                {orderDetails.length > 0 ? (
                    orderDetails.map((item) => (
                        <div key={item.OrderDetailID} className={cx('order-detail-wrap')}>
                            <div>
                                <div className={cx('order-detail')}>
                                    <div className={cx('order-state')}>
                                        <span>{item.Status}</span>
                                    </div>
                                    <div>
                                        <div>
                                            <span className={cx('product-detail')}>
                                                <div className={cx('product-detail-left')}>
                                                    <div className={cx('img-product')}>
                                                        <Image style={{ width: '100px' }} src={item.Image} alt="" />
                                                    </div>
                                                    <div className={cx('title-product-wrap')}>
                                                        <span className={cx('title-product')}>{item.Title}</span>
                                                        <span className={cx('quantity-product')}>
                                                            x{item.Quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={cx('price-total-wrap')}>
                                                    <span className={cx('price-product')}>
                                                        {Number(item.Price) * Number(item.Quantity)}$
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('order-line')}></div>
                            <div className={cx('order-total')}>
                                <span>Thành tiền: </span>
                                <p> {Number(item.Price) * Number(item.Quantity)}$</p>
                            </div>
                            <div style={{ padding: '12px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                                {renderPage(item.OrderDetailID)}
                            </div>
                        </div>
                    ))
                ) : (
                    <></>
                )}

                {checkCancelled && (
                    <div className={cx('modal')}>
                        <div className={cx('modal__overlay')}></div>
                        <div className={cx('modal__body')}>
                            <div className={cx('auth-form')}>
                                <div className={cx('auth-form__container')}>
                                    <div className={cx('auth-form__header')}>
                                        <h3 className={cx('auth-form__heading')}>Hủy đơn hàng</h3>
                                    </div>

                                    <div className={cx('auth-form__form')}>
                                        Bạn có chắc chắn muốn hủy đơn hàng này không ?
                                    </div>
                                    <div className={cx('auth-form__control')}>
                                        <button
                                            onClick={() => setCheckCancelled(false)}
                                            className={cx('btn auth-form__control-back', 'btn--normal')}
                                        >
                                            Trở lại
                                        </button>
                                        <button
                                            className={cx('btn', 'btn--primary', 'view-cart')}
                                            onClick={handleCancelledOrder}
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Purchase;
