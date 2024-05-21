import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';

import * as request from '~/utils/request';
import styles from './Home.module.scss';
import ProductItem from '~/layouts/components/ProductItem/ProductItem';
import images from '~/assets/images/images';
// import TypicalComponent from '~/layouts/components/TypicalComponent/TypicalComponent';

const cx = className.bind(styles);

function Home() {
    const [products, setProducts] = useState([]);
    const postsPerPage = 10;

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/product/get-products?_page=1&_limit=${postsPerPage}`);
                setProducts(res.data);
            } catch (error) {
                console.log(error)
            }
        };

        fetchApi();
    }, []);

    // const topSelling = [
    //     { img: images.thumbnail1, title: 'Nestle Original Coffee-Mate Coffee Creamer', price: 32 },
    //     { img: images.thumbnail2, title: 'Organic Cage-Free Grade A Large Brown Eggs', price: 42 },
    //     { img: images.thumbnail3, title: 'Seeds of Change Organic Quinoa, Brown, & Red Rice', price: 23 },
    // ];

    // const trendingProducts = [
    //     { img: images.thumbnail4, title: 'Organic Cage-Free Grade A Large Brown Eggs', price: 22 },
    //     { img: images.thumbnail5, title: 'Nestle Original Coffee-Mate Coffee Creamer', price: 24 },
    //     { img: images.thumbnail6, title: 'Naturally Flavored Cinnamon Vanilla Light', price: 31 },
    // ];

    // const recentlyAdded = [
    //     { img: images.thumbnail7, title: 'Pepperidge Farm Farmhouse Hearty White', price: 51 },
    //     { img: images.thumbnail8, title: 'Organic Frozen Triple Berry Blend', price: 42 },
    //     { img: images.thumbnail9, title: 'Oroweat Country Buttermilk Bread', price: 35 },
    // ];

    // const topRated = [
    //     { img: images.thumbnail10, title: 'Foster Farms Takeout Crispy Classic Buffalo', price: 32 },
    //     { img: images.thumbnail11, title: 'Angie Boomchickapop Sweet & Salty Kettle Corn', price: 22 },
    //     { img: images.thumbnail12, title: 'All Natural Italian-Style Chicken Meatballs', price: 43 },
    // ];

    return (
        <Fragment>
            <div className={cx('home-slide')}>
                <div className={cx('container_m')}>
                    <div className={cx('home-slide-cover')}>
                        <input type="radio" name="radio-btn" id="radio1" />
                        <input type="radio" name="radio-btn" id="radio2" />
                        <div className={cx('slide', 'slide-first')}>
                            <img src={images.sliderLast} alt="" />
                        </div>
                        <div className={cx('slide', 'slide-last')}>
                            <img src={images.sliderFirst} alt="" />
                        </div>

                        <div className={cx('navigation-auto')}></div>

                        <div className={cx('navigaiton-manual')}>
                            <label htmlFor="radio1" className={cx('manual-btn')}></label>
                            <label htmlFor="radio2" className={cx('manual-btn')}></label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('popular-products')}>
                <div className={cx('container_m')}>
                    <div className={cx('section-title')}>
                        <h3 className={cx('title')}>Popular Products</h3>
                    </div>
                    <div className={cx('tab-content')}>
                        <div className={cx('row')}>
                            {products.map((item) => (
                                <ProductItem key={item.ProductID} productItem={item} flexCol={'col-2-4'} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className={cx('typical-products-wrap', 'mt-30')}>
                <div className={cx('container_m')}>
                    <div className={cx('row')}>
                        <div className={cx('col', 'col-3', 'col-4', 'col-6', 'col-12')}>
                            <h4 className={cx('typical-products-title', 'mb-30')}>Top Selling</h4>
                            <TypicalComponent data={topSelling} />
                        </div>
                        <div className={cx('col', 'col-3', 'col-4', 'col-6', 'col-12')}>
                            <h4 className={cx('typical-products-title', 'mb-30')}>Trending Products</h4>
                            <TypicalComponent data={trendingProducts} />
                        </div>
                        <div className={cx('col', 'col-3', 'col-4', 'col-6', 'col-12')}>
                            <h4 className={cx('typical-products-title', 'mb-30')}>Recently Added</h4>
                            <TypicalComponent data={recentlyAdded} />
                        </div>
                        <div className={cx('col', 'col-3', 'col-4', 'col-6', 'col-12')}>
                            <h4 className={cx('typical-products-title', 'mb-30')}>Top Rated</h4>
                            <TypicalComponent data={topRated} />
                        </div>
                    </div>
                </div>
            </div> */}
        </Fragment>
    );
}

export default Home;
