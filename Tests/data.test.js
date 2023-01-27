const fs = require('fs')


test("Data Directory Present and Complete", () =>{
    expect(fs.existsSync(`./Data/`)).toBe(true)
   
   
})

test("Inventory File Present", () =>{
    expect(fs.existsSync(`./Data/Inputs/Inventory.txt`)).toBe(true)
})
