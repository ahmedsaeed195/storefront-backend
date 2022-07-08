import { User, UserStore } from "../../model/User";

const store = new UserStore()

describe("User Model", () => {
    it("all method should have an empty list of users", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
    it("all method should have an empty list of users that matches given query", async () => {
        const query: Partial<User> = {
            id: 1,
            username: "test",
            first_name: 'ahmed'
        }
        const result = await store.all(query)
        expect(result).toEqual([])
    })
    it("findById method should return undefined", async () => {
        const result = await store.findById(1)
        expect(result).toBeUndefined()
    })
    it("create method should return a newly created user with the given data", async () => {
        const data: Omit<User, 'id'> = {
            username: 'test',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        }
        const result = await store.create(data)
        expect(result).toEqual(jasmine.objectContaining({
            username: 'test',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        }))
    })
    it("all method should have a list of users", async () => {
        const result = await store.all()
        expect(result.length).toBeGreaterThan(0)
    })
    it("findById method should return a user", async () => {
        const result = await store.findById(1)
        expect(result).toEqual({
            id: 1,
            username: 'test',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        })
    })
    it("update method should update a user and return the modified record", async () => {
        const data: Omit<User, 'id'> = {
            username: 'test1',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        }
        const result = await store.update(1, data)
        expect(result).toEqual({
            id: 1,
            username: 'test1',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        })
    })
    it("delete method should delete a user by given id", async () => {
        const result = await store.delete(1)
        expect(result).toBeUndefined()
    })
    it("all method should have an empty list of users", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
})