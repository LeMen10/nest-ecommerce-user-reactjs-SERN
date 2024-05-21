import { useNavigate } from 'react-router-dom';
import * as request from '~/utils/request';

function Cancel() {
    const navigate = useNavigate();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const order_id = urlParams.get('order_id');

    const updateStatusOrder = async () => {
        try {
            await request.post(`/delete-canceled-order`, { order_id });
            navigate(-2);
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    if (order_id != null) updateStatusOrder();
}

export default Cancel;
