import { Connection } from 'rabbitmq-client'
import * as models from "#src/db/models";
import log from "#src/utils/logger";
import { writeAllOrdersToStreams, updateOrderStatus } from '#src/services/order.service';

let rabbitmq: Connection;
let publisher;

export interface OrderStatusMessage {
    id: number,
    status: string
}

export const initializeMessaging = () => {
    rabbitmq = new Connection(`amqp://${process.env.rabbitmq_user}:${process.env.rabbitmq_password}@${process.env.rabbitmq_host}:${process.env.rabbitmq_port}`);

    rabbitmq.on('connection', () => {
        log.info('RabbitMQ connection online successfully established');
    })

    rabbitmq.on('error', err => {
        log.error('RabbitMQ connection error: ' + err);
    })

    const orderStatusConsumer = rabbitmq.createConsumer({
        queue: 'order_status',
        queueOptions: { durable: true },
        qos: { prefetchCount: 1 }
        //exchanges: [{ exchange: 'order_status', type: 'topic' }],
        //queueBindings: [{ exchange: 'my-events', routingKey: 'users.*' }],
    }, async (msg) => {
        log.info('received status update: ' + msg.body);
        let message = JSON.parse(msg.body) as OrderStatusMessage;
        updateOrderStatus(message.id, message.status);
    });

    publisher = rabbitmq.createPublisher({
        confirm: true,
        maxAttempts: 2
        //exchanges: [{ exchange: 'placed_orders', type: 'topic' }]
    });
}

export const writeOrderToMessaging = async (order: models.Order) => {
    await publisher.send('placed_products', order);
    await publisher.send('order_status', order);
}

