import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { bioKeyboard1, mainInfoKeyboard, sexKeyboard } from "../util/keyboards";
import { sexTypes } from "../util/types";
import { imgUser, msgUser } from "./userProfile";

export async function userRegistration(ctx) {
    const chatId = String(ctx.chat.id);
    const text = ctx.message.text;
    let user = await AppDataSource.manager.findOneBy(User, { chatId });
    const userRepo = AppDataSource.getRepository(User);
    if (!user) {
        user = new User();
        user.chatId = chatId;
    }

    switch (ctx.session.step) {
            case "askConsent":
              if (text.toLowerCase() === "да") {
                ctx.session.editing = false
                ctx.react('❤‍🔥')
                ctx.session.step = "askName";
                await ctx.reply("Отлично! Напиши своё имя:");
              } else {
                ctx.react('💔')
                await ctx.reply("Хорошо, если передумаешь — напиши /start.");
                ctx.session.step = null;
              }
              break;
            case "askName":
              if (text.length >= 25){
                await ctx.reply('Имя слишком длинное')
              }
              ctx.session.name = text
              ctx.session.step = "askAge"
              await ctx.reply("Теперь напиши возраст:")
              break;
            case "askAge":
              const age = Number(text)
              if (isNaN(age)) {
                await ctx.reply("Напиши цифру.")
                break
              }
              if(age>150 || age<18){
                await ctx.reply('Тебе должно быть больше 18.')
                break
              }
              ctx.session.age = age
              ctx.session.step = "askSex"
              await ctx.reply("Выбери Пол", {reply_markup: sexKeyboard})
              break;
            case "askSex":
              if(text != '👚' && text != '👕'){
                ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
                return
              } else {
                ctx.session.sex = sexTypes[text]
                ctx.session.step = 'askSexSearch'
                ctx.reply('Кто Тебе интересен?',{reply_markup: sexKeyboard})
              }
              break;
            case 'askSexSearch':
              if(text != '👚' && text != '👕'){
                ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
                return
              } else {
                ctx.session.sex = sexTypes[text]
                ctx.session.step = 'askPhotos'
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                user.sex = ctx.session.sex;
                user.sexSearch = ctx.session.sexSearch;
                await AppDataSource.manager.save(user)

                ctx.reply('Отправь фотографии')
              }
              break;
            case "extraInfo":
                if (text.toLowerCase() === "да") {
                    ctx.react('🔥')
                    ctx.session.step = "extraInfo";
                    await ctx.reply("Отлично! Давай продолжим!");
                    await userRepo.update({ chatId }, { inSearch: false })
                    ctx.session.step = null
                    await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
                    ctx.session.editing = true
                  } else {
                    await userRepo.update({ chatId }, { inSearch: true })
                    ctx.session.step = null
                    ctx.reply("Анкета успешно создана!\nДля поиска отправь /search")
                    //Тут будет начинаться поиск
                  }
                break;
    
            default:
              await ctx.reply("Я не понял. Напиши /help");
          }
          return ctx

    
}