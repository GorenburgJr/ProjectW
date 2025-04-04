import { AppDataSource } from "../src/data-source"
import { BanList } from "../src/entity/BanList"
import { Report } from "../src/entity/Report"
import { User } from "../src/entity/User"
import { checkReport } from "./checkReports"

export async function banReport(user, ctx) {
    const reportsRepo = await AppDataSource.getRepository(Report)
    const report = await reportsRepo.findOneBy({checked: false})
    const ban = new BanList
    ban.adminId = user.chatId
    ban.date = new Date
    ban.bannedId = report.reportedUserId
    ban.reason = ctx.message.text
    await AppDataSource.manager.save(ban)
    await AppDataSource.manager.delete(User, {chatId: report.reportedUserId})
    await reportsRepo.update(report, {checked: true })
    // await AppDataSource.manager.delete(User, {chatId: report.reportedUserId})
    await checkReport(ctx)
}