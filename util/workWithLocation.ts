import { AppDataSource } from "../src/data-source";
import { Location } from "../src/entity/Location";
import { User } from "../src/entity/User";
import { UserImages } from "../src/entity/UserImages";
import { bioKeyboard1, mainInfoKeyboard, yesNoKeyboard } from "./keyboards";
import { imgUser, msgUser } from "../common/userProfile";


export async function downloadingUserLocations(ctx) {
    const chatId = String(ctx.chat.id)
    const { latitude, longitude } = ctx.message.location
    const locationRepo = AppDataSource.getRepository(Location);
    let location = await locationRepo.findOneBy({ chatId });

    if(ctx.session.editingComponent === 'location'){
        await locationRepo.update({ chatId }, { location : {
          type: "Point",
          coordinates: [longitude, latitude]}})
          await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
          ctx.session.editingComponent = 'mainInfo'
          return
    } else if(ctx.session.activeStepName == 'askLocation'){
        const user = await AppDataSource.getRepository(User).findOneBy({ chatId });
        const userRepo = AppDataSource.getRepository(User)
        let photo = await (AppDataSource.getRepository(UserImages)).findOneBy({ chatId })

        location = new Location();
        location.chatId = chatId;
        location.user = user;

        location.location = {
            type: "Point",
            coordinates: [longitude, latitude],
          }

        await locationRepo.save(location);
        await ctx.reply("Локация сохранена! 📍");

        if(location && photo){
            await userRepo.update({ chatId }, { regPassed: true})
          }
        ctx.session.activeStepName = 'ExtraInfo'
        await ctx.reply('Хочешь еще что то о себе написать?',{reply_markup: yesNoKeyboard})
        return
    } else {
        ctx.reply('Зачем мне метка')
        return
    }
}