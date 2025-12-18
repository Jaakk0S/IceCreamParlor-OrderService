import { AsyncMessage, Channel, Connection } from 'rabbitmq-client'
import * as models from "#src/db/models";
import log from "#src/utils/logger";
import { updateOrderStatus } from '#src/services/order.service';

export let rabbitmq: Connection;
export let publisher;

export interface OrderStatusMessage {
    id: number,
    status: string
}

export const initializeMessaging = () => {

    if (process.env.NODE_ENV == "prod") {

        rabbitmq = new Connection(`amqp://${process.env.rabbitmq_user}:${process.env.rabbitmq_password}@${process.env.rabbitmq_host}:${process.env.rabbitmq_port}`);

        rabbitmq.on('connection', () => {
            log.info('RabbitMQ connection online successfully established');
        })

        rabbitmq.on('error', err => {
            log.error('RabbitMQ connection error: ' + err);
        })

        if (process.env.NODE_ENV == "prod") {
            rabbitmq.acquire().then(channel => {
                channel.basicConsume({ queue: 'order_status', exclusive: true }, (msg: AsyncMessage) => {
                    log.info('received status update: ' + JSON.stringify(msg.body));
                    let message = JSON.parse(msg.body) as OrderStatusMessage;
                    updateOrderStatus(message.id, message.status);
                    channel.basicAck({ deliveryTag: msg.deliveryTag, multiple: false });
                });
            })
            /*const orderStatusConsumer = rabbitmq.createConsumer({
                queue: 'order_status',
                queueOptions: { durable: true, passive: true },
                qos: { prefetchCount: 1 }
                //exchanges: [{ exchange: 'order_status', type: 'topic' }],
                //queueBindings: [{ exchange: 'my-events', routingKey: 'users.*' }],
            }, async (msg) => {
                log.info('received status update: ' + msg.body);
                let message = JSON.parse(msg.body) as OrderStatusMessage;
                updateOrderStatus(message.id, message.status);
            });*/

            publisher = rabbitmq.createPublisher({
                confirm: true,
                maxAttempts: 2
                //exchanges: [{ exchange: 'placed_orders', type: 'topic' }]
            });
        }
    }
}

export const writePlacedOrderToMessaging = async (order: models.Order) => {
    if (publisher) {
        await publisher.send('placed_orders', order);
    }
}

