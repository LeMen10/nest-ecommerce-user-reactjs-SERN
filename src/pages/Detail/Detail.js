import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Detail.module.scss';
import Image from '~/components/Image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import * as request from '~/utils/request';

const cx = className.bind(styles);

function Detail({ setHeaderVariable }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [quantityProduct, setQuantityProduct] = useState(1);
    const [product, setProduct] = useState([]);
    const increaseProduct = () => {
        setQuantityProduct(quantityProduct + 1);
    };
    const decreaseProduct = () => {
        setQuantityProduct(quantityProduct - 1);
        if (quantityProduct <= 1) setQuantityProduct(1);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/product/${slug}`);
                setProduct(res.product);
            } catch (error) {
                const err = error.response.data.message;
                if (err === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate, slug]);

    const handleSubmit = async () => {
        try {
            const res = await request.post(`/cart/add-to-cart/${slug}`, { quantity: quantityProduct });
            if (setHeaderVariable) setHeaderVariable(res.count);

            toast.success('Đã thêm sản phẩm vào Giỏ hàng', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuyNow = async () => {
        try {
            const data = [Number(slug)];
            const res = await request.post(`/cart/add-to-cart/${slug}`, { quantity: quantityProduct });
            if (setHeaderVariable) setHeaderVariable(res.count);
            navigate('/checkout', { state: { data } });
        } catch (error) {
            console.log(error);
        }
    }
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
            <div className={cx('product-description-wrap')}>
                <div className={cx('container_m')}>
                    <div className={cx('row')}>
                        <div className={cx('product-description', 'm-auto')}>
                            <div className={cx('product-description-img')}>
                                <Image className={cx('img-product-cart')} src={product.Image} alt={''} />
                            </div>
                            <div className={cx('detailed-info')}>
                                <span className={cx('stock-status', 'btn-sale-off')}>Sale Off</span>
                                <h2 className={cx('title-detail')}>{product.Title}</h2>

                                <div className={cx('product-price')}>
                                    <div className={cx('current-price')}>
                                        <span>${product.Price}</span>
                                    </div>
                                </div>
                                <div className={cx('short-desc')}>
                                    <p className={cx('')}>{product.Detail}</p>
                                </div>
                                <div className={cx('quantity-product-wrap')}>
                                    <span className={cx('quantity-product-title')}>Number</span>
                                    <div>
                                        <span onClick={decreaseProduct} className={cx('change-quantity-product')}>
                                            -
                                        </span>
                                        <input
                                            type="tel"
                                            value={quantityProduct}
                                            onChange={(e) => setQuantityProduct(e.target.value)}
                                            className={cx('product-quantity-show')}
                                            name="quantity"
                                        />
                                        <span onClick={increaseProduct} className={cx('change-quantity-product')}>
                                            +
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('btn-wrap')}>
                                    <div className={cx('btn-add-cart')}>
                                        <button onClick={handleSubmit} className={cx('btn')}>
                                            Add to cart
                                        </button>
                                    </div>
                                    <div className={cx('btn-buy-now')}>
                                        <button onClick={handleBuyNow} className={cx('btn')}>
                                            Buy now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('description-long-wrap', 'm-auto')}>
                            <div className={cx('description-long')}>
                                <Link to={''} className={cx('description-categori')}>
                                    Description
                                </Link>
                                <div className={cx('description-text')}>
                                    <p>
                                        Uninhibited carnally hired played in whimpered dear gorilla koala depending and
                                        much yikes off far quetzal goodness and from for grimaced goodness unaccountably
                                        and meadowlark near unblushingly crucial scallop tightly neurotic hungrily some
                                        and dear furiously this apart.
                                    </p>

                                    <p>
                                        Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello
                                        on spoon-fed that alas rethought much decently richly and wow against the
                                        frequent fluidly at formidable acceptably flapped besides and much circa far
                                        over the bucolically hey precarious goldfinch mastodon goodness gnashed a
                                        jellyfish and one however because.
                                    </p>
                                </div>

                                <ul className={cx('product-more-infor')}>
                                    <li>
                                        <span>Type Of Packing</span>
                                        Bottle
                                    </li>
                                    <li>
                                        <span>Color</span>
                                        Green, Pink, Powder Blue, Purple
                                    </li>
                                    <li>
                                        <span>Quantity Per Case</span>
                                        100ml
                                    </li>
                                    <li>
                                        <span>Ethyl Alcohol</span>
                                        70%
                                    </li>
                                    <li>
                                        <span>Piece In One</span>
                                        Carton
                                    </li>
                                </ul>
                                <p className={cx('description-text')}>
                                    Laconic overheard dear woodchuck wow this outrageously taut beaver hey hello far
                                    meadowlark imitatively egregiously hugged that yikes minimally unanimous pouted
                                    flirtatiously as beaver beheld above forward energetic across this jeepers
                                    beneficently cockily less a the raucously that magic upheld far so the this where
                                    crud then below after jeez enchanting drunkenly more much wow callously irrespective
                                    limpet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

Detail.propTypes = {
    setHeaderVariable: PropTypes.func,
};

export default Detail;
