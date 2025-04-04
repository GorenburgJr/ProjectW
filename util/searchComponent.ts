import { msgSearch } from "../common/userSearchProfile";
import { AppDataSource } from "../src/data-source";
import { SearchSettings } from "../src/entity/SearchSetting";
import { settingsBioKeyboard1 } from "./keyboards";

export async function searchComponent(ctx) {
    const chatId = String(ctx.chat.id)
    const settings = await AppDataSource.manager.findOneBy(SearchSettings, { chatId })
    const searchSettingsRepo = AppDataSource.getRepository(SearchSettings)
    switch(ctx.session.searchSettingComponent){
            case 'height':
              const height = Number(ctx.message.text)
              if (isNaN(height)) {
                await ctx.reply('Напиши цифру');
                return;
              }
              if(height>210 || height< 100){
                await ctx.reply('Напиши в диапазоне от 100 до 210')
                return
              }
              if(ctx.session.binary == 0){
                if(!Array.isArray(settings.height)){
                  settings.height = []
                }
                settings.height[ctx.session.binary] = Number(ctx.message.text)
                ctx.session.binary += 1
                ctx.reply('Напиши до какого значения')
                await searchSettingsRepo.update({ chatId }, settings)
                return ctx.session.binary
              }
              if(ctx.session.binary == 1 ){
                if(Number(ctx.message.text) < settings.age[0]){
                  ctx.reply('Второе число не может быть меньше первого значения')
                  return
                }
                settings.height[ctx.session.binary] = Number(ctx.message.text)
                await AppDataSource.manager.save(settings)
                ctx.session.binary = 0
                ctx.reply(await msgSearch(ctx), {reply_markup: settingsBioKeyboard1})
                ctx.session.searchSettingComponent = null
                return ctx.session
              }
            case 'age':
              const age = Number(ctx.message.text)
              if (isNaN(age)) {
                await ctx.reply('Напиши цифру');
                return;
              }
              if(age<18 || age>100){
                await ctx.reply('Напиши в диапазоне от 18 до 100')
                return
              }
              if(ctx.session.binary == 0){
                settings.age[ctx.session.binary] = Number(ctx.message.text)
                ctx.session.binary += 1
                ctx.reply('Напиши до какого значения')
                await AppDataSource.manager.save(settings)
                return ctx.session.binary
              }
              if(ctx.session.binary == 1 ){
                if(Number(ctx.message.text) < settings.age[0]){
                  ctx.reply('Второе число не может быть меньше первого значения')
                  return
                }
                settings.age[ctx.session.binary] = Number(ctx.message.text)
                await AppDataSource.manager.save(settings)
                ctx.session.binary = 0
                ctx.session.searchSettingComponent = null
                ctx.reply(await msgSearch(ctx), {reply_markup: settingsBioKeyboard1})
                return ctx
    
              }
              await searchSettingsRepo.update({ chatId }, {height: [height]})
              await AppDataSource.manager.save(settings)
              return
            case 'radius':
              let radius = Number(ctx.message.text)
              if (isNaN(radius)) {
                await ctx.reply('Напиши цифру');
                return;
              }
              if(radius <2){
                ctx.reply('Минимальный радиус 2 КМ')
                return
              }
              if(radius >150){
                ctx.reply('Ограничение на 150 КМ')
                return
              }
              radius *= 1000
              await searchSettingsRepo.update({ chatId }, {radius: radius})
              await ctx.reply(await msgSearch(ctx), {reply_markup:settingsBioKeyboard1})
              ctx.session.searchSettingComponent = null
              return ctx
          }
          return ctx
    
}