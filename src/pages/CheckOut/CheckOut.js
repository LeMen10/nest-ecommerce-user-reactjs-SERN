import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './CheckOut.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images/images';
import { AddIcon } from '~/components/Icons';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function CheckOut() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data;
    console.log(data)
    const [payment, setPayment] = useState('Thanh toán khi nhận hàng');
    const [products, setProducts] = useState([]);
    const [fullName, setFullName] = useState();
    const [phone, setPhone] = useState();
    const [city, setCity] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [specificAddress, setSpecificAddress] = useState();

    const [recipientDetails, setRecipientDetails] = useState();
    const [priceTotal, setPriceTotal] = useState();
    const [stateAddress, setStateAddress] = useState(true);
    const [checkPushAddress, setCheckPushAddress] = useState(false);
    const [changeAddress, setchangeAddress] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressActive, setAddressActive] = useState();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.post(`/checkout`, { data });
                console.log(res)
                setProducts(res.data);
                setPriceTotal(res.price_total);
            } catch (error) {
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [data, navigate]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/get-address`);
                if (res.data.length > 0) {
                    setRecipientDetails(res.data);
                    setAddressActive(res.address_active);
                    setSelectedAddressId(res.address_active[0].AddressID);
                    setStateAddress(true);
                } else {
                    setStateAddress(false);
                }
            } catch (error) {
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [stateAddress, checkPushAddress, navigate]);

    const handlePaypal = async (OrderID) => {
        try {
            const res = await request.post(`/payment`, { priceTotal, OrderID, products });
            console.log(res)
            window.location.href = res;
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    const handleBuyLaterMoney = async () => {
        const new_oders = products.map((item) => {
            var { CartID, Image, Title, ...rest } = item;
            rest.Status = 'Đang xử lý';
            rest.PaymentStatus = 'Chưa thanh toán';
            return rest;
        });
        try {
            const res = await request.post(`/save-order`, {
                order_details: new_oders,
                addressID: selectedAddressId,
                payment,
            });
            if (payment === 'Thanh toán bằng Paypal') {
                console.log(res)
                handlePaypal(res.OrderID);
            } else navigate('/user/purchase?type=noted');
        } catch (error) {
            console.log(error);
            // const err = error.response.data.message;
            // if (err === 'Invalid access token') navigate('/login');
        }
    };

    const handleRadio = (event) => {
        setPayment(event.target.value);
    };

    const updateAddress = async () => {
        try {
            await request.post(`/update-address`, {
                full_name: fullName,
                phone,
                specific_address: specificAddress,
                ward,
                district,
                city,
            });

            if (!stateAddress) setStateAddress(true);
            if (checkPushAddress) {
                setCheckPushAddress(false);
                setchangeAddress(true);
            }
        } catch (error) {
            console.log(error);
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    const handlePushAddress = () => {
        setchangeAddress(false);
        setCheckPushAddress(true);
        setFullName('');
        setPhone('');
        setCity('');
        setDistrict('');
        setWard('');
        setSpecificAddress('');
    };

    const handleBtnGoBack = () => {
        if (stateAddress === false) navigate('/cart');
        else setCheckPushAddress(false);
    };

    const handleCheckboxChange = (addressID) => {
        setSelectedAddressId(addressID);
    };

    const handleActiveAddress = async () => {
        try {
            const res = await request.put(`/update-active-address`, {
                data_id: selectedAddressId,
            });

            setchangeAddress(false);
            setSelectedAddressId(res.address_active[0].AddressID);
            setAddressActive(res.address_active);
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Thanh toán</h3>
                </div>

                <div className={cx('shipping-address-wrap')}>
                    <h4 className={cx('shipping-address-title')}>
                        <img alt="" style={{ marginRight: '10px', width: '20px' }} src={images.iconLocation} /> Địa chỉ
                        nhận hàng
                    </h4>
                    <div className={cx('shipping-address')}>
                        {addressActive && (
                            <div style={{ display: 'flex' }}>
                                <div style={{ fontWeight: '600' }}>
                                    {addressActive[0].FullName} {addressActive[0].Phone}
                                </div>
                                <p className={cx('address')}>
                                    {addressActive[0].SpecificAddress}, Phường/Xã {addressActive[0].Ward}, Quận/Huyện{' '}
                                    {addressActive[0].District}, Tỉnh/TP {addressActive[0].City}
                                </p>
                            </div>
                        )}
                        <button
                            style={{ paddingLeft: '40px', backgroundColor: 'transparent' }}
                            onClick={() => setchangeAddress(true)}
                        >
                            Thay đổi
                        </button>
                    </div>
                </div>

                <table className={cx('table', 'mt-4')}>
                    <thead>
                        <tr>
                            <th scope="col">Sản phẩm</th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Đơn giá
                            </th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Số lượng
                            </th>
                            <th scope="col" style={{ textAlign: 'center' }}>
                                Thành tiền
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((result) => (
                                <tr key={result.CartID}>
                                    <td style={{ display: 'flex', alignItems: 'center', height: '131.5px' }}>
                                        <Image style={{ width: '120px' }} src={result.Image} alt="" />
                                        <p style={{ paddingLeft: '10px' }}>{result.Title}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        data-price={result.CartID}
                                        className={cx('unit-price')}
                                    >
                                        {result.Price}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <p className={cx('quantity-product-checkout')}>{result.Quantity}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={cx('product-total')}
                                        data-total={result.CartID}
                                    >
                                        {Number(result.Price) * Number(result.Quantity)}$
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={cx('text-center')}>
                                    Không có sản phẩm nào trong giỏ hàng của bạn.
                                    <Link to={'/shop'}> Mua hàng</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className={cx('payment-area')}>
                    <div className={cx('payment-method')}>
                        <p className={cx('payment-method-title')}>Phương thức thanh toán</p>
                        <div value={payment}>
                            <div className={cx('later_money')}>
                                <input
                                    type="radio"
                                    id="later_money"
                                    name="radio"
                                    value="Thanh toán khi nhận hàng"
                                    onChange={handleRadio}
                                    checked={payment === 'Thanh toán khi nhận hàng'}
                                />
                                <label htmlFor="later_money">Thanh toán tiền khi nhận hàng</label>
                            </div>
                            <div className={cx('paypal')}>
                                <input
                                    type="radio"
                                    id="paypal"
                                    name="radio"
                                    value="Thanh toán bằng Paypal"
                                    onChange={handleRadio}
                                />
                                <label htmlFor="paypal">Thanh toán tiền bằng Paypal</label>
                            </div>
                        </div>
                    </div>
                    <div className={cx('bill-product')}>
                        <div className={cx('total-payment')}>
                            Tổng thanh toán: <span className={cx('price-total-order')}>{priceTotal}$</span>
                        </div>
                        <div className={cx('buy-button')}>
                            {payment === 'Thanh toán khi nhận hàng' ? (
                                <button
                                    className={cx('btn', 'btn--primary', 'btn-sm')}
                                    onClick={handleBuyLaterMoney}
                                    style={{ marginRight: '12px' }}
                                >
                                    Đặt hàng
                                </button>
                            ) : (
                                <button
                                    className={cx('btn', 'btn--primary', 'btn-sm')}
                                    onClick={handleBuyLaterMoney}
                                    style={{ marginRight: '12px' }}
                                >
                                    Đặt hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(stateAddress === false || checkPushAddress === true) && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container')}>
                                <div className={cx('auth-form__header')}>
                                    <h3 className={cx('auth-form__heading')}>Địa chỉ mới</h3>
                                    <p className={cx('auth-form__switch-btn')}>
                                        Để đặt hàng, vui lòng thêm địa chỉ nhận hàng.
                                    </p>
                                </div>
                                <div className={cx('auth-form__form')}>
                                    <div className={cx('auth-form__group')}>
                                        <input
                                            type="text"
                                            placeholder="Họ và tên"
                                            name="fullname"
                                            className={cx('auth-form__input')}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className={cx('auth-form__group')}>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            name="phone_number"
                                            className={cx('auth-form__input')}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Tỉnh/Thành phố"
                                        name="city"
                                        className={cx('auth-form__input')}
                                        id="auth-form__user-login"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Quận/Huyện"
                                        name="district"
                                        className={cx('auth-form__input')}
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Phường/Xã"
                                        name="ward"
                                        className={cx('auth-form__input')}
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        placeholder="Địa chỉ cụ thể"
                                        name="specific_address"
                                        className={cx('auth-form__input')}
                                        value={specificAddress}
                                        onChange={(e) => setSpecificAddress(e.target.value)}
                                    />
                                </div>
                                <div className={cx('auth-form__control')}>
                                    <button
                                        onClick={handleBtnGoBack}
                                        className={cx('btn', 'auth-form__control-back', 'btn--normal')}
                                    >
                                        Trở lại
                                    </button>
                                    <button className={cx('btn', 'btn--primary', 'view-cart')} onClick={updateAddress}>
                                        Hoàn thành
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {changeAddress && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container')}>
                                <div className={cx('auth-form__header')}>
                                    <h3 className={cx('auth-form__heading')}>Địa chỉ của tôi.</h3>
                                </div>

                                <div className={cx('address-list-wrap')}>
                                    {recipientDetails &&
                                        recipientDetails.map((item) => (
                                            <div key={item.AddressID} className={cx('address-item-wrap')}>
                                                <div className={cx('input-check-address')}>
                                                    <input
                                                        type="checkbox"
                                                        name="address-checkbox"
                                                        value={item.AddressID}
                                                        onChange={() => handleCheckboxChange(item.AddressID)}
                                                        checked={selectedAddressId === item.AddressID}
                                                    />
                                                </div>
                                                <div className={cx('address-item')}>
                                                    <div style={{ fontWeight: '600' }}>
                                                        {item.FullName} {item.Phone}
                                                    </div>
                                                    <div style={{ width: '80%' }}>
                                                        <p>
                                                            {item.SpecificAddress}, {item.Ward},
                                                        </p>
                                                        <p>
                                                            {item.District}, {item.City}
                                                        </p>
                                                    </div>

                                                    <p style={{ paddingLeft: '10px', width: '24%' }}>Cập nhật</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button className={cx('btn-add-address')} onClick={handlePushAddress}>
                                    <AddIcon className={cx('icon-add-address')} />
                                    Thêm địa chỉ mới
                                </button>
                                <div className={cx('auth-form__control')}>
                                    <button
                                        onClick={() => setchangeAddress(false)}
                                        className={cx('btn', 'auth-form__control-back', 'btn--normal')}
                                    >
                                        Trở lại
                                    </button>
                                    <button
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                        onClick={handleActiveAddress}
                                    >
                                        Hoàn thành
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckOut;
