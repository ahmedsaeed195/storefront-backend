import supertest from 'supertest';
import { User } from '../../model/User';
import server from "../../server";

const request = supertest(server)

describe('/api/user endpoints', () => {
    let userId: number
    afterAll(() => {
        server.close()
    });
    it('GET /user', (done) => {
        request.get('/api/user').expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('GET /user/:id', (done) => {
        request.get('/api/user/1').expect(404).end((error: Error) => (error ? done.fail(error) : done()))
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
        })().then(done).catch(done.fail)
    })
    it('POST /user/login', (done) => {
        const data: Partial<User> & { password: string } = {
            username: 'tester',
            password: 'testingpassword'
        }
        request.post('/api/user/login').send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))

    })
    it('PUT /user:id', (done) => {
        const data: Partial<User> & { password: string } = {
            username: 'tester',
            password: 'newtestingpassword'
        }
        request.put(`/api/user/${userId}`).send(data).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
    it('DELETE /user/:id', (done) => {
        request.delete(`/api/user/${userId}`).expect(200).end((error: Error) => (error ? done.fail(error) : done()))
    })
})