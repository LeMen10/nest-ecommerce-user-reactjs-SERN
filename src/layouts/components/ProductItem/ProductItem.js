import React from 'react';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './ProductItem.module.scss';

const cx = className.bind(styles);

function ProductItem({ productItem, flexCol }) {
    return (
        <div key={productItem.ProductID} className={cx('col', `${flexCol}`, 'col-4', 'col-6', 'col-12', 'mb-24')}>
            <div className={cx('popular-product-cart-wrap')}>
                <div className={cx('product-card-header')}>
                    <Image className={cx('img-product-box')} src={productItem.Image} alt={''} />
                </div>

                <div className={cx('product-cart-content')}>
                    <Link
                        to={`/product/${productItem.ProductID}`}
                        className={cx('product-cart-title')}
                    >
                        {productItem.Title}
                    </Link>
                    <p className={cx('product-cart-description')}></p>
                    <div className={cx('product-card-bottom')}>
                        <span className={cx('current-price')}>${productItem.Price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;
