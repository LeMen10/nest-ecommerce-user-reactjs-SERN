import React from 'react';
import className from 'classnames/bind';
import styles from './Shop.module.scss';
import { useState, useEffect } from 'react';
import ProductItem from '~/layouts/components/ProductItem/ProductItem';
import Image from '~/components/Image';
import ReactPaginate from 'react-paginate';
import * as request from '~/utils/request';
import { Link, useLocation } from 'react-router-dom';
import images from '~/assets/images/images';

const cx = className.bind(styles);

function Shop() {
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState();
    const [categories, setCategories] = useState([]);
    const postsPerPage = 8;

    console.log(products);
    const location = useLocation();
    const [urlParams, setUrlParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
        setUrlParams(new URLSearchParams(location.search));
    }, [location]);

    const query_String = window.location.search;
    const urlParam = new URLSearchParams(query_String);
    const category = urlParam.get('_cate');

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/shop?_page=1&_limit=${postsPerPage}&_cate=${category}`);
                setProducts(res.data);
                setPageCount(res.count);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, [urlParams, category]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/category`);
                setCategories(res.data);
            } catch (error) {}
        };

        fetchApi();
    }, []);

    const getProducts = async (currenPage) => {
        try {
            const res = await request.get(`/shop?_page=${currenPage}&_limit=${postsPerPage}&_cate=${category}`);
            setProducts(res.data);
            setPageCount(res.count);
        } catch (error) {}
    };

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getProducts(currenPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('row')}>
                <div className={cx('page-shop')}>
                    <div className={cx('sidebar', 'container_m')}>
                        <div className={cx('categories-shop')}>
                            <h5 className={cx('title-category')}>Category</h5>
                            <ul className={cx('title-product-list')}>
                                {categories.map((result) => (
                                    <li key={result.CategoryID} className={cx('title-product-item')}>
                                        <div className={cx('product-item')}>
                                            <Image className={cx('')} src={result.Image} alt={''} />
                                            <Link
                                                className={cx('render-by-category')}
                                                to={`/shop?_cate=${result.Cate}`}
                                            >
                                                {result.Title}
                                            </Link>
                                        </div>
                                        <div className={cx('count-product')}>{result.Count}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={cx('banner-img-sidebar')}>
                            <img src={images.banner11} alt="" />
                            <div className={cx('title-banner-sidebar')}>
                                <p>Oganic</p>
                                <h4>
                                    Sale 17% on <span>Organic</span> Juice
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className={cx('content-page', 'container_m')}>
                        <div className={cx('row')}>
                            {products.length > 0 ? (
                                products.map((result) => (
                                    <ProductItem key={result.ProductID} productItem={result} flexCol={'col-3'} />
                                ))
                            ) : (
                                <div className={cx('notify-no-product')}>Không có sản phẩm.</div>
                            )}
                        </div>
                        {products.length > 0 && (
                            <div className={styles['pagination-container']}>
                                <ReactPaginate
                                    onPageChange={() => handlePageClick()}
                                    previousLabel={'<'}
                                    breakLabel={'...'}
                                    nextLabel={'>'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={3}
                                    containerClassName={'paginationn'}
                                    pageClassName={'page-itemm'}
                                    pageLinkClassName={'page-linkk'}
                                    previousClassName={'page-itemm'}
                                    previousLinkClassName={'page-linkk'}
                                    nextClassName={'page-itemm'}
                                    nextLinkClassName={'page-linkk'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
