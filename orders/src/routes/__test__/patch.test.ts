import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Product } from '../../models/product';

import { natsWrapper } from '../../nats-wrapper';

it.todo('returns an error when the order does not exist');
it.todo('should only accept a correct order id');
it.todo('can only be cancelled by the owner');

it('marks an order as cancelled', async () => {
  // Create a product

  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Product',
    price: 10,
  });

  await product.save();

  const user = global.signin();
  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  // Assert the order is cancelled and saved to the database
  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual('cancelled');
});

it('emits an order cancelled event', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Product',
    price: 10,
  });

  await product.save();

  const user = global.signin();
  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
    'order:cancelled',
    expect.stringContaining(order.id),
    expect.any(Function),
  );
});
