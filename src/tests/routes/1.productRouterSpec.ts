import supertest from 'supertest';
import { Product } from '../../model/Product';
import { User } from '../../model/User';
import server from "../../server";

const request = supertest(server)

describe('/api/product endpoints', () => {
    let productId: number
    let token: string
    beforeAll((done) => {
        (async () => {
            const data: Partial<User> & { password: string } = {
                username: 'productTester',
                password: 'testingpassword'
            }
            const res = await request.post(`/api/user`).send(data)
            token = res.body.token
        })().then(done).catch(done.fail)
    })
    afterAll(() => {
        request.delete(`/api/user/me`).set('x-auth-token', token)
        server.close()
    });
    it('GET /product', (done) => {
        request.get('/api/product').expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /product/:id', (done) => {
        request.get('/api/product/1').expect(404).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('POST /product', (done) => {
        (async () => {
            const data: Omit<Product, 'id'> = {
                name: 'test',
                price: 5,
                category: 'testing'
            }
            const res = await request.post(`/api/product`).set('x-auth-token', token).send(data)
            expect(res.status).toBe(201)
            productId = res.body.product.id
        })().then(done).catch(done.fail)
    })
    it('PUT /product:id', (done) => {
        const data: Omit<Product, 'id'> = {
            name: 'test',
            price: 20,
            category: 'testing'
        }
        request.put(`/api/product/${productId}`).set('x-auth-token', token).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /product/:id', (done) => {
        request.delete(`/api/product/${productId}`).set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})