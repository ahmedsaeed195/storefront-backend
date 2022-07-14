import { Order, OrderStore } from "../../model/Order";
import { User, UserStore } from "../../model/User";
import { Product, ProductStore } from "../../model/Product";

const store = new OrderStore()
const userStore = new UserStore()
const productStore = new ProductStore()

describe("Order Model", () => {
    let userId: number
    let productId: number
    beforeAll(async () => {
        const userData: Omit<User, 'id'> = {
            username: 'orderTest',
            first_name: 'ahmed',
            last_name: 'saeed',
            password_digest: ''
        }
        const userResult = await userStore.create(userData)
        userId = userResult.id
        const productData: Omit<Product, 'id'> = {
            name: "test",
            price: 5,
            category: "tests"
        }
        const productResult = await productStore.create(productData)
        productId = productResult.id

    })
    afterAll(async () => {
        await userStore.delete(userId)
        await productStore.delete(productId)
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
        const result = await store.findById(userId, 1)
        expect(result).toBeUndefined()
    })
    it("create method should return a newly created order with the given data", async () => {
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
        const result = await store.create(data)
        expect(result).toEqual(jasmine.objectContaining({
            user_id: userId,
            status: false,
            products: [
                {
                    id: productId,
                    quantity: 20
                }
            ]
        }))
    })
    it("all method should have a list of orders", async () => {
        const result = await store.all()
        expect(result.length).toBeGreaterThan(0)
    })
    it("findById method should return a order", async () => {
        const result = await store.findById(userId, 1)
        expect(result).toEqual(jasmine.objectContaining({
            user_id: userId,
            status: false,
            products: [
                {
                    id: productId,
                    quantity: 20
                }
            ]
        }))
    })
    it("update method should update a order and return the modified record", async () => {
        const data: Partial<Order> = {
            status: true
        }
        const result = await store.update(1, data)
        expect(result).toEqual(jasmine.objectContaining({
            status: true
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