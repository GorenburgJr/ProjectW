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
        user = new User(chatId)
    }

    switch (ctx.session.activeStepName) {
            case "askConsent":
              if (text.toLowerCase() === "да") {
                ctx.session.editing = false
                ctx.react('❤‍🔥')
                ctx.session.activeStepName = "askName";
                await ctx.reply("Отлично! Напиши своё имя:");
              } else {
                ctx.react('💔')
                await ctx.reply("Хорошо, если передумаешь — напиши /start.");
                ctx.session.activeStepName = null;
              }
              break;
            case "askName":
              if (text.length >= 25){
                await ctx.reply('Имя слишком длинное')
              }
              ctx.session.name = text
              ctx.session.activeStepName = "askAge"
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
              ctx.session.activeStepName = "askSex"
              await ctx.reply("Выбери Пол", {reply_markup: sexKeyboard})
              break;
            case "askSex":
              if(text != '👚' && text != '👕'){
                ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
                return
              } else {
                ctx.session.sex = sexTypes.indexOf(text)
                ctx.session.activeStepName = 'askSexSearch'
                ctx.reply('Кто Тебе интересен?',{reply_markup: sexKeyboard})
              }
              break;
            case 'askSexSearch':
              if(text != '👚' && text != '👕'){
                ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
                return
              } else {
                ctx.session.sexSearch = sexTypes.indexOf(text)
                ctx.session.activeStepName = 'askPhotos'
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                user.sex = ctx.session.sex;
                user.sexSearch = ctx.session.sexSearch;
                user.userName = ctx.message.from.username
                await AppDataSource.manager.save(user)

                ctx.reply('Отправь фотографии')
              }
              break;
            case "ExtraInfo":
                if (text.toLowerCase() === "да") {
                    ctx.react('🔥')
                    ctx.session.activeStepName = "ExtraInfo";
                    await ctx.reply("Отлично! Давай продолжим!");
                    await userRepo.update({ chatId }, { inSearch: false })
                    ctx.session.activeStepName = null
                    await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
                    ctx.session.editing = true
                  } else {
                    await userRepo.update({ chatId }, { inSearch: true })
                    ctx.session.activeStepName = null
                    ctx.reply("Анкета успешно создана!\nДля поиска отправь /search")
                    //Тут будет начинаться поиск
                  }
                break;
    
            default:
              await ctx.reply("Я не понял. Напиши /help");
          }
          return ctx

    
}