import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {
   
        // console.log("Сейчас внесем данные")
        const user = new User()
        user.chatId = '3'
        user.name = 'antn'
        user.age = 19
        user.regPassed = false
        await AppDataSource.manager.save(user)
        const users = await AppDataSource.manager.find(User)
        console.log("Loaded users: ", users)
    
    const user1 = await AppDataSource.manager.delete(User, {id: 2})
    await AppDataSource.manager.update(User,{id: 1},{regPassed: true} )
    // console.log(await AppDataSource.manager.findOneBy(User,{chatID : 392290571}))
}).catch(error => console.log(error))
