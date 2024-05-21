import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Payment() {
    const location = useLocation();
    const data = location.state?.data;

    useEffect(() => {
        const token = Cookies.get('token');
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.post(`${process.env.REACT_APP_BASE_URL}/pay`)
            .then((res) => {
                console.log(res.data)
                window.location.href = res.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }, [data]);
}

export default Payment;
