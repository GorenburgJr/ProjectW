import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { UserImages } from "../src/entity/UserImages";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import { photoKeyboard } from "./keyboards";

dotenv.config()
export async function downloadingUserPhoto (ctx) {
    if(ctx.session.editingComponent == 'photo' || ctx.session.step == 'askPhotos'){
        try {
            const photos = ctx.message.photo;
            const biggestPhoto = photos[photos.length - 1];
            const fileId = biggestPhoto.file_id;
        
            // Получаем информацию о файле
            const fileInfo = await ctx.api.getFile(fileId);
            const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${fileInfo.file_path}`;
        
            // Путь, куда сохраняем

            const fileExt = path.extname(fileInfo.file_path || "") || ".jpg";
            const fileName = `photo_${uuidv4()}${fileExt}`
            const filePath = path.join("./photos", fileName);
        
            // Скачиваем и сохраняем файл через axios
            const response = await axios.get(fileUrl, { responseType: "stream" });
        
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
        
            writer.on("finish", async () => {

                const chatId = String(ctx.chat.id);
                const user = await AppDataSource.getRepository(User).findOneBy({ chatId });
                const userPhotoRepo = AppDataSource.getRepository(UserImages);

                let images = await userPhotoRepo.findOneBy({ chatId });

                if (!images) {
                images = new UserImages();
                images.chatId = chatId;
                images.user = user;
                images.photoFileNames = [];
                }

                if (images.photoFileNames.length < 4) {// Добавляем фото(проверяем на лимит 5)
                images.photoFileNames.push(fileName);
                await userPhotoRepo.save(images);
                } else {
                ctx.reply("Максимум 5 фото", {reply_markup: photoKeyboard});
                return
                }

                ctx.reply("Фото успешно сохранено!", {reply_markup: photoKeyboard});
                return
                
                
            });
            writer.on("error", (err) => {
            console.error("Ошибка при сохранении:", err);
            ctx.reply("Произошла ошибка при сохранении фото.");
            });
        } catch (err) {
            console.error("Ошибка:", err);
            ctx.reply("Не удалось сохранить фото.");
        }
    }else {
        ctx.reply('Зачем ты отправляешь фотографии')
    }
}

export async function deletingUserPhoto(ctx, photoIndex) {
    const chatId = ctx.chat.id;
    const userImagesRepo = AppDataSource.getRepository(UserImages);
    const images = await userImagesRepo.findOneBy({ chatId });
    if (images.photoFileNames.length === 1) {
        await ctx.reply('Нужно как минимум 1 фотография');
        ctx.session.editingComponent = 'mainInfo';
        return
      }

    const user = await userImagesRepo.findOneBy({ chatId });

    if (!user || !user.photoFileNames || user.photoFileNames.length <= photoIndex) {
        await ctx.reply('Фотография не найдена');
        return;
    }

    const photoName = user.photoFileNames[photoIndex];
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

  // Удаление имени из массива и обновление в БД
    user.photoFileNames.splice(photoIndex, 1);
    await userImagesRepo.update({ chatId }, { photoFileNames: user.photoFileNames });
    
    return
}