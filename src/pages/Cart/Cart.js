import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Cart.module.scss';
import Image from '~/components/Image';
import PropTypes from 'prop-types';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Cart({ setHeaderVariable }) {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [priceTotal, setPriceTotal] = useState();

    const increaseProduct = (event) => {
        const targetId = event.target.dataset.target;
        // Lấy thẻ input gần thẻ vừa ấn
        const targetElement = document.querySelector(`[data-id="${targetId}"]`);
        // Lấy value của thẻ chứa value là giá sản phẩm unit
        var priceUnit = document.querySelector(`[data-price="${targetId}"]`).innerText;
        // Thẻ chứa value là giá sản phẩm total
        var priceTotal = document.querySelector(`[data-total="${targetId}"]`);
        // Quantity + 1
        targetElement.value = Number(targetElement.value) + 1;
        // Giá total tăng lên
        var priceUnitValue = Number(priceUnit.substring(0, priceUnit.length - 1));
        var quantityValue = Number(targetElement.value);
        var priceTotalValue = priceUnitValue * quantityValue;
        priceTotal.innerText = priceTotalValue + '$';
        handleChangeQuantity(quantityValue, targetId);
    };

    const decreaseProduct = (event) => {
        const targetId = event.target.dataset.target;
        const targetElement = document.querySelector(`[data-id="${targetId}"]`);
        var priceUnit = document.querySelector(`[data-price="${targetId}"]`).innerText;
        var priceTotal = document.querySelector(`[data-total="${targetId}"]`);

        targetElement.value = Number(targetElement.value) - 1;
        var priceUnitValue = Number(priceUnit.substring(0, priceUnit.length - 1));
        var quantityValue = Number(targetElement.value);
        var priceTotalValue = priceUnitValue * quantityValue;
        priceTotal.innerText = priceTotalValue + '$';

        if (targetElement.value < 1) {
            targetElement.value = 1;
            quantityValue = 1;
            priceTotal.innerText = priceUnitValue + '$';
        } else {
            handleChangeQuantity(quantityValue, targetId);
        }
    };

    const handleChangeQuantity = async (quantityValue, targetId) => {
        try {
            await request.put(`/cart/update-quantity`, { quantity: quantityValue, cartID: targetId });
            getCarts();
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    const getCarts = async () => {
        try {
            const res = await request.get(`/cart`);
            console.log(res)
            setCarts(res.data);
            setPriceTotal(res.price_total);
        } catch (error) {
            console.log(error);
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/cart`);
                setCarts(res.data);
                setPriceTotal(res.price_total);
            } catch (error) {
                console.log(error);
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate]);

    const deleteProductItem = async (cartID) => {
        try {
            const res = await request.delete_method(`/cart/delete-item-cart/${cartID}`);
            const count = res.count;
            if (setHeaderVariable) setHeaderVariable(count);
            getCarts();
        } catch (error) {
            console.log(error);
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    const handleChange = (event) => {
        const item = Number(event.target.value);
        const isChecked = event.target.checked;
        isChecked ? setCheckedItems([...checkedItems, item]) : setCheckedItems(checkedItems.filter((i) => i !== item));
    };

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkProductItem"]`);
        if (event.target.checked) {
            const new_carts = [];
            carts.forEach((item) => {
                new_carts.push(item.ProductID);
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(new_carts);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const handleBuy = () => {
        const data = checkedItems;
        navigate('/checkout', { state: { data } });
    };

    return (
        <div className={cx('container')}>
            <div className={cx('mt-4', 'mb-4')}>
                <div className={cx('title-page')}>
                    <h3>Giỏ hàng</h3>
                </div>

                <table className={cx('table', 'mt-4')}>
                    <thead>
                        <tr>
                            <td>
                                <div className={cx('form-check')}>
                                    <input
                                        style={{ marginBottom: '4px' }}
                                        type="checkbox"
                                        onChange={handleCheckAll}
                                        className={cx('form-check-input')}
                                        id="checkbox-all"
                                        checked={carts && carts.length > 0 && checkedItems.length === carts.length}
                                    />
                                </div>
                            </td>
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
                            <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                Chỉnh sửa
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.length > 0 ? (
                            carts.map((result) => (
                                <tr key={result.CartID}>
                                    <td>
                                        <div className={cx('form-check')}>
                                            <input
                                                type="checkbox"
                                                className={cx('form-check-input', 'check-input-product')}
                                                value={result.ProductID}
                                                name="checkProductItem"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Image style={{ width: '120px' }} src={result.Image} alt="" />
                                        <p>{result.Title}</p>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        data-price={result.CartID}
                                        className={cx('unit-price')}
                                    >
                                        {result.Price}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span
                                            className={cx('change-quantity-product')}
                                            data-target={result._id}
                                            onClick={decreaseProduct}
                                        >
                                            -
                                        </span>
                                        <input
                                            type="tel"
                                            className={cx('quantity-product')}
                                            onChange={() => {}}
                                            value={result.Quantity}
                                            name="quantity"
                                            data-id={result.CartID}
                                            data-product_id={result.ProductID}
                                        />
                                        <span
                                            className={cx('change-quantity-product')}
                                            data-target={result.CartID}
                                            onClick={increaseProduct}
                                        >
                                            +
                                        </span>
                                    </td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={cx('product-total')}
                                        data-total={result.CartID}
                                    >
                                        {Number(result.Price) * Number(result.Quantity)}$
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div
                                            onClick={() => deleteProductItem(result.CartID)}
                                            className={cx('btn', 'btn-link', 'text-dark')}
                                        >
                                            Xóa
                                        </div>
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
                {carts.length > 0 ? (
                    <div className={cx('bill-product')}>
                        <div className={cx('total-payment')}>
                            Tổng thanh toán: <span className={cx('price-total-order')}>{priceTotal}$</span>
                        </div>
                        <div className={cx('buy-button')}>
                            <button
                                className={cx('btn', 'btn--primary', 'btn-sm')}
                                onClick={handleBuy}
                                style={{ marginRight: '12px' }}
                                disabled={checkedItems.length === 0}
                            >
                                Mua hàng
                            </button>
                        </div>
                    </div>
                ) : (
                    <> </>
                )}
            </div>
        </div>
    );
}
Cart.propTypes = {
    setHeaderVariable: PropTypes.func,
};
export default Cart;
