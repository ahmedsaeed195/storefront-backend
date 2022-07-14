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
    let token: string
    beforeAll((done) => {
        (async () => {
            const data: Partial<User> & { password: string } = {
                username: 'orderTester',
                password: 'testingpassword'
            }
            const res = await request.post(`/api/user`).send(data)
            userId = res.body.user.id
            token = res.body.token
        })().then(done).catch(done.fail)
    })
    beforeAll((done) => {
        (async () => {
            const data: Omit<Product, 'id'> = {
                name: 'test',
                price: 5,
                category: 'testing'
            }
            const res = await request.post(`/api/product`).set('x-auth-token', token).send(data)
            productId = res.body.product.id
        })().then(done).catch(done.fail);
    })
    afterAll((done) => {
        request.delete(`/api/product/${productId}`).set('x-auth-token', token)
        request.delete(`/api/user/${userId}`).set('x-auth-token', token)
        server.close()
        done()
    });
    it('GET /order', (done) => {
        request.get('/api/order').set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /order/:id', (done) => {
        request.get('/api/order/1').set('x-auth-token', token).expect(404).end((error: Error) => (error ? done.fail(error) : done()))
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
            const res = await request.post(`/api/order`).set('x-auth-token', token).send(data)
            expect(res.status).toBe(201)
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
        request.put(`/api/order/${orderId}`).set('x-auth-token', token).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /order/:id', (done) => {
        request.delete(`/api/order/${orderId}`).set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})