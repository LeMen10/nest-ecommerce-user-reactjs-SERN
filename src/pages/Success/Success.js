import { useNavigate } from 'react-router-dom';
import * as request from '~/utils/request';

function Success() {
    const navigate = useNavigate();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const PayerID = urlParams.get('PayerID');
    const paymentId = urlParams.get('paymentId');
    const totalOrder = urlParams.get('total');
    const order_id = urlParams.get('order_id');

    const updateStatusOrder = async () => {
        try {
            await request.post(`/update-status-order`, { order_id });
            navigate('/user/purchase?type=noted');
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    const handleSuccess = async () => {
        try {
            await request.post(`/success`, { PayerID, paymentId, totalOrder });
            updateStatusOrder();
        } catch (error) {
            const err = error.response.data.message;
            if (err === 'Invalid access token') navigate('/login');
        }
    };

    if (PayerID != null && paymentId != null && totalOrder != null) handleSuccess();
}

export default Success;
