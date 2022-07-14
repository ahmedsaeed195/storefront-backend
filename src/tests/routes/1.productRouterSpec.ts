import supertest from 'supertest';
import { Product } from '../../model/Product';
import server from "../../server";

const request = supertest(server)

describe('/api/product endpoints', () => {
    let productId: number
    afterAll(() => {
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
            const res = await request.post(`/api/product`).send(data)
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
        request.put(`/api/product/${productId}`).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /product/:id', (done) => {
        request.delete(`/api/product/${productId}`).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})