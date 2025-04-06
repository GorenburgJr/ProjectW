import { Like } from "typeorm"
import { sendLetterIfMatch, sendMatch } from "../app"
import { choosingProfPhoto, choosingProfText } from "../common/choosingProfile"
import { AppDataSource } from "../src/data-source"
import { Letter } from "../src/entity/Letters"
import { ProfileStack } from "../src/entity/ProfileStack"
import { Reactions } from "../src/entity/Reactions"
import { User } from "../src/entity/User"
import { msgSearch } from "../common/userSearchProfile"
import { chooseUserKeyboard, settingsBioKeyboard1 } from "./keyboards"

export async function sendLetter(ctx) {
    const chatId = String(ctx.chat.id)
    let user = await AppDataSource.manager.findOneBy(User, { chatId })
    if(ctx.message.text.length > 100){
        ctx.reply('Напиши короче')
        return
}
      const toUser = await AppDataSource.manager.findOneBy(ProfileStack, {chatId: chatId})
      const checkLetter = await AppDataSource.manager.findOneBy(Letter, {fromUser: chatId, toUser:String(toUser.stack[toUser.index].chatId)})
      if(checkLetter){
        await AppDataSource.manager.update(Letter, {fromUser: chatId, toUser:String(toUser.stack[toUser.index].chatId)}, {text: ctx.message.text})
      }
      else {
        const letter = new Letter()
        letter.fromUser = chatId
        letter.toUser = toUser.stack[toUser.index].chatId
        letter.text = ctx.message.text
        letter.distance = toUser.stack[toUser.index].distance
        await AppDataSource.manager.save(letter)
      }

      //добавляем лайк
      const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
      const like = new Reactions
            like.fromUser = chatId
            like.toUser =  profileStack.stack[profileStack.index].chatId
            like.reactionType = true
            like.date = new Date()
            let checkReaction = await AppDataSource.manager.findOneBy(Reactions,{ fromUser:profileStack.stack[profileStack.index].chatId, toUser:chatId})
            if(checkReaction){ //есть ли реакция на этого пользователя уже
              switch(checkReaction.reactionType){
                case true://взаимная симпатия
                  let choosedUser = await AppDataSource.manager.findOneBy(User, {chatId: profileStack.stack[profileStack.index].chatId})
                  ctx.reply(`У вас взаимная симпатия с [${choosedUser.name}](t.me/${choosedUser.userName})`, {
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: true
                  })
                  await sendMatch(profileStack.stack[profileStack.index].chatId, chatId)
                  await sendLetterIfMatch(profileStack.stack[profileStack.index].chatId, ctx.message.text)
                  break;
                case false:
                  break;
              }
            }        
      await AppDataSource.manager.save(Reactions, like)//сохраняем лайк
      profileStack.index += 1
      if(profileStack.stack.length-1 < profileStack.index){
      ctx.reply(`Анкеты по твоему запросу кончились\nПопробуй изменить настройки для поиска\n\n${await msgSearch(ctx)}`,{reply_markup: settingsBioKeyboard1})
      }
      await choosingProfPhoto(ctx, profileStack.stack[profileStack.index].chatId, user.chatId)
      ctx.reply(await choosingProfText(profileStack.stack[profileStack.index].chatId, profileStack.stack[profileStack.index].distance), {reply_markup: chooseUserKeyboard})
      await AppDataSource.manager.update(ProfileStack, { chatId },{index: profileStack.index})
      ctx.session.letter = undefined
      return ctx    
}
