import { Order, OrderStore } from "../../model/Order";
import { User, UserStore } from "../../model/User";

const store = new OrderStore()
const userStore = new UserStore()

describe("Order Model", () => {
    let userId: number
    beforeAll(async () => {
        const data: Omit<User, 'id'> = {
            username: 'orderTest',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        }
        const result = await userStore.create(data)
        userId = result.id
    })
    afterAll(async () => {
        await store.delete(userId)
    })
    it("all method should have an empty list of orders", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
    it("all method should have an empty list of orders that matches given query", async () => {
        const query: Partial<Order> = {
            user_id: userId,
            status: false
        }
        const result = await store.all(query)
        expect(result).toEqual([])
    })
    it("findById method should return undefined", async () => {
        const result = await store.findById(1)
        expect(result).toBeUndefined()
    })
    it("create method should return a newly created order with the given data", async () => {
        const data: Omit<Order, 'id'> = {
            user_id: userId,
            status: false,
        }
        const result = await store.create(data)
        expect(result).toEqual(jasmine.objectContaining({
            user_id: userId,
            status: false,
        }))
    })
    it("all method should have a list of orders", async () => {
        const result = await store.all()
        expect(result.length).toBeGreaterThan(0)
    })
    it("findById method should return a order", async () => {
        const result = await store.findById(1)
        expect(result).toEqual(jasmine.objectContaining({
            user_id: userId,
            status: false,
        }))
    })
    it("update method should update a order and return the modified record", async () => {
        const data: Omit<Order, 'id'> = {
            user_id: userId,
            status: true,
        }
        const result = await store.update(1, data)
        expect(result).toEqual(jasmine.objectContaining({
            user_id: userId,
            status: true,
        }))
    })
    it("delete method should delete a order by given id", async () => {
        const result = await store.delete(1)
        expect(result).toBeUndefined()
    })
    it("all method should have an empty list of orders", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
})