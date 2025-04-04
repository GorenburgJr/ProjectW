import { InlineKeyboard } from "grammy";
import { smartRound } from "../common/choosingProfile";
import { AppDataSource } from "../src/data-source";
import { Letter } from "../src/entity/Letters";
import { User } from "../src/entity/User";
import { escapeMarkdownV2 } from "./escapeMarkdownV2";



export async function showLetters(ctx) {
    const chatId = String(ctx.chat.id)
    const letters = await AppDataSource.manager.findBy(Letter, {toUser: chatId})//письма
    if(letters.length>= 1){
                    letters.forEach(async element => {
                    const fromUser = await AppDataSource.manager.findOneBy(User, {chatId: element.fromUser})
                    const distance = smartRound(element.distance)
                    const name = escapeMarkdownV2(fromUser.name)
                    const userName = escapeMarkdownV2(fromUser.userName)
                    const age = escapeMarkdownV2(fromUser.age.toString())
                    const dist = escapeMarkdownV2(distance.toString())
                    const message = escapeMarkdownV2(element.text)
                    ctx.reply(`Сообщение от [${name}](t.me/${userName}), ${age}, ${dist}км\\.\\: ${message}`, {
                        parse_mode: 'MarkdownV2',
                        disable_web_page_preview: true,
                        reply_markup: new InlineKeyboard().text('Прододжить', 'startSearch')
                    });

                    });
                    await AppDataSource.manager.delete(Letter, {toUser: chatId})
                }
}   
              