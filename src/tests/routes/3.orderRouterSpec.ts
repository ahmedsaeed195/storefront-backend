import supertest from 'supertest';
import { Order } from '../../model/Order';
import { Product } from '../../model/Product';
import { User } from '../../model/User';
import server from "../../server";

const request = supertest(server)

describe('/api/order endpoints', () => {
    let orderId: number
    let productId: number
    let userId: number
    beforeAll((done) => {
        (async () => {
            const data: Omit<Product, 'id'> = {
                name: 'test',
                price: 5,
                category: 'testing'
            }
            const res = await request.post(`/api/product`).send(data)
            productId = res.body.product.id
        })().then(done).catch(done.fail);
    })
    beforeAll((done) => {
        (async () => {
            const data: Partial<User> & { password: string } = {
                username: 'tester',
                password: 'testingpassword'
            }
            const res = await request.post(`/api/user`).send(data)
            userId = res.body.user.id
        })().then(done).catch(done.fail)
    })
    afterAll(() => {
        server.close()
    });
    it('GET /order', (done) => {
        request.get('/api/order').expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /order/:id', (done) => {
        request.get('/api/order/1').expect(404).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('POST /order', (done) => {
        (async () => {
            const data: Omit<Order, 'id'> = {
                user_id: userId,
                status: false,
                products: [
                    {
                        id: productId,
                        quantity: 20
                    }
                ]
            }
            const res = await request.post(`/api/order`).send(data)
            expect(res.status).toBe(201)
            console.log(res.body.order)
            orderId = res.body.order.id
        })().then(done).catch(done.fail)
    })
    it('PUT /order:id', (done) => {
        const data: Omit<Order, 'id'> = {
            user_id: userId,
            status: false,
            products: [
                {
                    id: productId,
                    quantity: 50
                }
            ]
        }
        request.put(`/api/order/${orderId}`).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /order/:id', (done) => {
        request.delete(`/api/order/${orderId}`).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})