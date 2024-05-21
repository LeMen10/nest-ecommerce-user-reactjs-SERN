import PropTypes from 'prop-types';
import React from 'react';
import className from 'classnames/bind';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './DefaultLayout.module.scss';
import { useState, useEffect } from 'react';
import { OnTopIcon } from '~/components/Icons';

const cx = className.bind(styles);

function DefaultLayout({ children }) {
    const [headerVariable, setHeaderVariable] = useState('');
    const [checkButtonOnTop, setCheckButtonOnTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 40) setCheckButtonOnTop(true);
            else setCheckButtonOnTop(false);
        });
    }, []);

    const onTop = () => {
        window.scrollTo(0, 0);
    };

    const handleSetHeaderVariable = (newValue) => {
        setHeaderVariable(newValue);
    };

    return (
        <div className={cx('wrapper')}>
            <Header variable={headerVariable}/>
            <div className={cx('content')}>
                {React.cloneElement(children, { setHeaderVariable: handleSetHeaderVariable })}
            </div>
            {checkButtonOnTop && (
                    <div className={cx('on-top-icon-wrap')} onClick={onTop}>
                        <OnTopIcon className={'on-top-icon'} />
                    </div>
                )}
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
