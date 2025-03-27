import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";

async function checkUserExist(ctx) {
      const chatId = String(ctx.chat.id);
      const existingUser = await AppDataSource.manager.findOneBy(User, { chatId });
      if (!existingUser) {
            return false
      } else {
            return true
      }
}

export { checkUserExist }