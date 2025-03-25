import { AppDataSource } from "../src/data-source"
import { User } from "../src/entity/User"
import { extraInfo } from "../src/entity/ExtraInfo"

const zodiacNames = ['♑️', '♒️', '♓️', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️']

async function msgUser(Context) {
    const ctx = Context
    const chatId = String(ctx.chat.id)

    const user = await AppDataSource.manager.findOneBy(User, { chatId });
    const extra = await AppDataSource.manager.findOneBy(extraInfo, { chatId });

    let messageText = `
        ${ctx.from.first_name}, Твой профиль сейчас выглядит так: 
        ${user.name}, ${user.age}`
    if(extra){
        if(extra.languages){
            messageText += ` Мои языки📖: ${extra.languages}`
        }
        if(extra.zodiacsign){
            messageText += `\n Твой ЗЗ: ${zodiacNames[extra.zodiacsign]}`
        }
        if(extra.height){
            messageText += `\n Твой Рост: ${extra.height} \n`
        }
    }




    

    return messageText
}
export {msgUser}