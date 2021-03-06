import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {useRouter} from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {

  const router = useRouter();

  const [timeLeft, setTimeLeft] = React.useState(0);
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order?.id,
    },
    onSuccess: () => router.push('/orders')
  })

  React.useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = +new Date(order?.expiresAt) - +new Date();
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000)

    return (() => {
      clearInterval(timerId);
    })

  }, [order])


  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
      <h1>{order?.product?.title}</h1>
      <div>
        Time left to pay: {timeLeft} seconds.
      </div>
      {errors}
      <StripeCheckout
        token={({id}) => doRequest({token: id})}
        stripeKey={process.env.STRIPE_KEY as string}
        amount={order?.product?.price * 100}
        email={currentUser?.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data }
}

export default OrderShow;