import { Database } from "./database"

describe('database', () => {
    let database: Database;


    it('can be connected to', async () => {
        database = new Database()
        expect(await database.connect()).toBeTruthy()
        expect(await database.testConnection()).toBeTruthy()
    })



})