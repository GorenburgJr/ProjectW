import { imgUser, msgUser } from "../common/userProfile";
import { AppDataSource } from "../src/data-source";
import { ExtraInfo } from "../src/entity/ExtraInfo";
import { User } from "../src/entity/User";
import { bioKeyboard1, bioKeyboard2, mainInfoKeyboard } from "./keyboards";

export async function editComponent(ctx) {
    const chatId = String(ctx.chat.id)
    const userRepo = AppDataSource.getRepository(User)
    const ExtraInfoRepo = AppDataSource.getRepository(ExtraInfo)
    const maxLengths = {
        language: 35,
        pets: 35,
        work: 35,
        bio: 500,
        name: 15
    };

    switch (ctx.session.editingComponent) {
            case 'language':
            case 'pets':
            case 'work':
            case 'bio':
              if (ctx.message.text.length > maxLengths[ctx.session.editingComponent]) {
                await ctx.reply('Напиши короче');
                return;
              }
              await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: ctx.message.text });
              await imgUser(ctx,await msgUser(ctx), ctx.session.editingComponent === 'language' ||  ctx.session.editingComponent === 'bio' ? bioKeyboard1 : bioKeyboard2);
              ctx.session.editingComponent = undefined
              break;
    
            case 'height':
              const height = Number(ctx.message.text);
              if (isNaN(height)) {
                await ctx.reply('Напиши цифру');
                return;
              }
              await ExtraInfoRepo.update({ chatId }, { height });
              await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
              ctx.session.editingComponent = undefined
              break;
              case 'name':
                if (ctx.message.text.length > maxLengths[ctx.session.editingComponent]) {
                  await ctx.reply('Напиши короче');
                  return;
                }
                await userRepo.update({ chatId }, { name: ctx.message.text })
                await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
                ctx.session.editingComponent = 'mainInfo'
                return
              case 'age':
                const age = Number(ctx.message.text);
                if (isNaN(age)) {
                  await ctx.reply('Напиши цифру');
                  return;
                }
                await userRepo.update({ chatId }, { age: Number(ctx.message.text) });
                await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
                ctx.session.editingComponent = 'mainInfo'
                return
              default:
                break;
            }

            return ctx
    
}