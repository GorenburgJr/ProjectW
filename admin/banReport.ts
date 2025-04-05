import path = require("path")
import { AppDataSource } from "../src/data-source"
import { BanList } from "../src/entity/BanList"
import { Report } from "../src/entity/Report"
import { User } from "../src/entity/User"
import { checkReport } from "./checkReports"
import * as fs from "fs"
import { UserImages } from "../src/entity/UserImages"
import { bot } from "../app"

export async function banReport(user, ctx) {
    const reportsRepo = await AppDataSource.getRepository(Report)
    const report = await reportsRepo.findOneBy({checked: false})
    const ban = new BanList
    ban.adminId = user.chatId
    ban.date = new Date
    ban.bannedId = report.reportedUserId
    ban.reason = ctx.message.text
    await AppDataSource.manager.save(ban)
    await reportsRepo.update(report, {checked: true })
    await checkReport(ctx)
    bot.api.sendMessage(ban.bannedId, `Вы были забанены по причине:${ban.reason}. Для обжалования пишите сюда`)
    //удаление фото
    const userImagesRepo = AppDataSource.getRepository(UserImages);
    const images = await userImagesRepo.findOneBy({ chatId:String(report.reportedUserId) });
    console.log(images)
    images.photoFileNames.forEach(async element => {
        const photoName = element
        const photoPath = path.join(__dirname, '..', 'photos', photoName); // путь к папке с фото

        try {
            // Удаление файла
            await fs.unlink(photoPath, (err) => {
            if (err) throw err;
            });
        } catch (err) {
            console.error('Ошибка при удалении файла:', err);
            await ctx.reply('Не удалось удалить фото с хранилища');
            return;
        }
        finally{
            AppDataSource.manager.delete(User, {chatId: report.reportedUserId})
        }
    });
    

}