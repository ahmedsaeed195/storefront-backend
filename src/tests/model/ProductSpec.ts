import { Product, ProductStore } from "../../model/Product";

const store = new ProductStore()

describe("Product Model", () => {
    it("all method should have an empty list of products", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
    it("all method should have an empty list of products that matches given query", async () => {
        const query: Partial<Product> = {
            id: 1,
            name: "test",
            price: 5
        }
        const result = await store.all(query)
        expect(result).toEqual([])
    })
    it("findById method should return undefined", async () => {
        const result = await store.findById(1)
        expect(result).toBeUndefined()
    })
    it("create method should return a new created record with the given data", async () => {
        const data: Omit<Product, 'id'> = {
            name: 'test',
            price: 5,
            category: 'testing'
        }
        const result = await store.create(data)
        expect(result).toEqual(jasmine.objectContaining({
            name: 'test',
            price: 5,
            category: 'testing'
        }))
    })
    it("all method should have a list of products", async () => {
        const result = await store.all()
        expect(result.length).toBeGreaterThan(0)
    })
    it("findById method should return a record", async () => {
        const result = await store.findById(1)
        expect(result).toEqual({
            id: 1,
            name: 'test',
            price: 5,
            category: 'testing'
        })
    })
    it("update method should update a record and return the modified record", async () => {
        const data: Omit<Product, 'id'> = {
            name: 'test1',
            price: 3,
            category: 'tests'
        }
        const result = await store.update(1, data)
        expect(result).toEqual({
            id: 1,
            name: 'test1',
            price: 3,
            category: 'tests'
        })
    })
    it("delete method should delete a record by given id", async () => {
        const result = await store.delete(1)
        expect(result).toBeUndefined()
    })
    it("all method should have an empty list of products", async () => {
        const result = await store.all()
        expect(result).toEqual([])
    })
})