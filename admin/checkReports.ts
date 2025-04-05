import { choosingProfExtraInfo, choosingProfPhoto, choosingProfText } from "../common/choosingProfile";
import { AppDataSource } from "../src/data-source";
import { Report } from "../src/entity/Report";
import { User } from "../src/entity/User";
import { reportCheckKeyboard } from "../util/keyboards";
import { reportTypes } from "../util/types";

export async function checkReport(ctx) {
    const reportsRepo = await AppDataSource.getRepository(Report)
    const userRepo = await AppDataSource.getRepository(User)
    const report = await reportsRepo.findOneBy({checked: false})
    if(!report){
        ctx.reply("Репорты кончились")
        return
    }
    ctx.reply(`Репорт номер ${report.report_id}, 
        отправил(t.me/${(await userRepo.findOneBy({chatId: report.sendedUserId})).userName})
        на (t.me/${(await userRepo.findOneBy({chatId: report.reportedUserId})).userName})
        причина: ${reportTypes[report.reasonId]}`, {
            disable_web_page_preview: true,
            reply_markup:reportCheckKeyboard})
    const reportedId = report.reportedUserId
    await choosingProfPhoto(ctx, reportedId, String(ctx.chat.id) )
    ctx.reply(await choosingProfText(reportedId, 0))
    ctx.reply(await choosingProfExtraInfo(reportedId))
}