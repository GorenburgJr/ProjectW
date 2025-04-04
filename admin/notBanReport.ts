import { AppDataSource } from "../src/data-source"
import { BanList } from "../src/entity/BanList"
import { Report } from "../src/entity/Report"
import { User } from "../src/entity/User"
import { checkReport } from "./checkReports"

export async function notBanReport(user, ctx) {
    const reportsRepo = await AppDataSource.getRepository(Report)
    const report = await reportsRepo.findOneBy({checked: false})
    await reportsRepo.update(report, {checked: true })
    await checkReport(ctx)
}