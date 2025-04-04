import { AppDataSource } from "../src/data-source"
import { Letter } from "../src/entity/Letters"
import { ProfileStack } from "../src/entity/ProfileStack"

export async function sendLetter(ctx) {
    const chatId = String(ctx.chat.id)
    if(ctx.message.text.length > 100){
        ctx.reply('Напиши короче')
        return
}
      const toUser = await AppDataSource.manager.findOneBy(ProfileStack, {chatId: chatId})
      const checkLetter = await AppDataSource.manager.findOneBy(Letter, {fromUser: chatId, toUser:toUser.stack[ctx.session.stackIndex].chatId})
      if(checkLetter){
        await AppDataSource.manager.update(Letter, {fromUser: chatId, toUser:toUser[ctx.session.stackIndex].chatId}, {text: ctx.message.text})
      }
      else {
        const letter = new Letter()
        letter.fromUser = chatId
        letter.toUser = toUser.stack[ctx.session.stackIndex].chatId
        letter.text = ctx.message.text
        letter.distance = toUser.stack[ctx.session.stackIndex].distance
        await AppDataSource.manager.save(letter)
      }
      ctx.session.letter = undefined
      return ctx    
}
