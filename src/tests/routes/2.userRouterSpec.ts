import supertest from 'supertest';
import { User } from '../../model/User';
import server from "../../server";

const request = supertest(server)

describe('/api/user endpoints', () => {
    let userId: number = 0
    let token: string
    afterAll(() => {
        server.close()
    })
    it('GET /user returns unauthorized', (done) => {
        request.get('/api/user').expect(401).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /user/:id returns unauthorized', (done) => {
        request.get(`/api/user/${userId}`).expect(401).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('POST /user', (done) => {
        (async () => {
            const data: Partial<User> & { password: string } = {
                username: 'tester',
                password: 'testingpassword'
            }
            const res = await request.post(`/api/user`).send(data)
            expect(res.status).toBe(201)
            userId = res.body.user.id
            token = res.body.token
        })().then(done).catch(done.fail)
    })
    it('POST /user/login', (done) => {
        const data: Partial<User> & { password: string } = {
            username: 'tester',
            password: 'testingpassword'
        }
        request.post('/api/user/login').send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))

    })
    it('GET /user after login', (done) => {
        request.get('/api/user').set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /user/:id after login', (done) => {
        request.get(`/api/user/${userId}`).set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('PUT /user/me', (done) => {
        const data: Partial<User> & { password: string } = {
            username: 'tester',
            password: 'newtestingpassword'
        }
        request.put(`/api/user/me`).set('x-auth-token', token).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /user/me', (done) => {
        request.delete(`/api/user/me`).set('x-auth-token', token).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})