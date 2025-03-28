import { Bot as GrammyBot , InlineKeyboard, Keyboard } from 'grammy'
import * as dotenv from "dotenv";
dotenv.config()

export const cancelBackKeyboard = new InlineKeyboard()
        .text('Назад', 'back')
        .text('Удалить ❌', 'delete');

export const bioKeyboard1 = new InlineKeyboard()
        .text('Основная информацияℹ️', 'mainInfo').row()
        .text('Языки 📖', 'languge')
        .text('Знак Зодиака 🧚‍♀️', 'zodiac').row()
        .text('Рост 📏', 'height')
        .text('Тип Личности🪪', 'persType').row()
        .text('Я ищу👀', 'mySearch')
        .text('Образование 👨🏻‍🎓', 'education').row()
        .text('Дети 👼', "familyPlans")
        .text('Описание💭', 'bio').row()
        .text('Вперед➡️', 'forward')
        .text('Сохранить и выйти✅', 'quitEditing')

export const bioKeyboard2 = new InlineKeyboard()
        .text('Язык Любви ❤️', 'loveLang')
        .text('Работа🏭', 'work').row()
        .text('🐕Питомцы🐈', 'pets')
        .text('🥃Алкоголь🍷', 'alcohol').row()
        .text("Курение🚬", "smoke")
        .text('Спортзал💪🏻', "gym").row()
        .text('🥬Предпочтение к еде🍔', "food")
        .text('СоцСети🤳', 'socMedia').row()
        .text('Тип общения 💬', 'commType')
        .text('Предпочтения ко сну😴', 'nightLive').row()
        .text('Назад⬅️', 'backward')
        .text('Сохранить и выйти✅', 'quitEditing');

export const settingsBioKeyboard1 = new InlineKeyboard()
    .text("Радиус поиска", 'radius')
    .text('Возраст поиска', 'age').row()
    .text('Языки 📖', 'languge')
    .text('Знак Зодиака 🧚‍♀️', 'zodiac').row()
    .text('Рост 📏', 'height')
    .text('Тип Личности🪪', 'persType').row()
    .text('Ищет👀', 'mySearch')
    .text('Образование 👨🏻‍🎓', 'education').row()
    .text('Дети 👼', "familyPlans")
    .text('Описание💭', 'bio').row()
    .text('Вперед➡️', 'forward')
    .text('Начать поиск🕵️', 'startSearch')

export const settingsBioKeyboard2 = new InlineKeyboard()
    .text('Язык Любви ❤️', 'loveLang')
    .text('Работа🏭', 'work').row()
    .text('🐕Питомцы🐈', 'pets')
    .text('🥃Алкоголь🍷', 'alcohol').row()
    .text("Курение🚬", "smoke")
    .text('Спортзал💪🏻', "gym").row()
    .text('🥬Предпочтение к еде🍔', "food")
    .text('СоцСети🤳', 'socMedia').row()
    .text('Тип общения 💬', 'commType')
    .text('Предпочтения ко сну😴', 'nightLive').row()
    .text('Назад⬅️', 'backward')
    .text('Начать поиск🕵️', 'startSearch')

export const mainInfoKeyboard = new InlineKeyboard()
    .text('Имя', 'name')
    .text('Возраст', 'age').row()
    .text('Мой пол', 'sex')
    .text("Кого я ищу", 'sexSearch').row()
    .text('Фотографии', 'photo')
    .text('Локация', 'location').row()
    .text('Назад⏪', 'back').row()
    .text('Остановить поиск❌', 'stopSearching').row()
    .text('Продолжить поиск🕵️', 'continueSearching');

export const zodiacKeyboard = new InlineKeyboard()
        .text('Козерог♑️', '0')
        .text('Водолей♒️', '1').row()
        .text('Рыбы♓️', '2')
        .text('Овен♈️', '3').row()
        .text('Телец♉️', '4')
        .text('Близнецы♊️', '5').row()
        .text('Рак♋️', '6')
        .text('Лев♌️', '7').row()
        .text('Дева♍️', '8')
        .text('Весы♎️', '9').row()
        .text('Скорпион♏️', '10')
        .text('Стрелец♐️', '11').row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');


export const typePersKeyboard = new InlineKeyboard()
        .text('INTJ', '0')
        .text('INTP', '1')
        .text('ENTJ', '2')
        .text('ENTP', '3').row()
        .text('INFJ', '4')
        .text('INFP', '5')
        .text('ENFJ', '6')
        .text('ENFP', '7').row() 
        .text('ISTJ', '8')
        .text('ISFJ', '9')
        .text('ESTJ', '10')
        .text('ESFJ', '11').row()
        .text('ISTP', '12')
        .text('ISFP', '13')
        .text('ESTP', '14')
        .text('ESFP', '15').row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');

export const mySearchKeyboard = new InlineKeyboard()
        .text('Просто повеселиться 🎉', '0').row()
        .text('Найти друзей 👋', '1').row()
        .text('Все еще разбираюсь 🤔', '2').row()
        .text('Долгосрочный партнер 💘', '3').row()
        .text('Долго- или краткосрочно 😍', '4').row()
        .text('Долго- или краткосрочно 🥂', '5').row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');

export const educationKeyboard = new InlineKeyboard()
        .text('Бакалавр🎓', '0')
        .text('Колледж🏫', '1')
        .text('Средняя школашкола🧑‍🏫', '2').row()
        .text('Доктор Наук🧑‍🔬', '3')
        .text("Аспирантура", '4')
        .text('Магистратура', '5').row()
        .text('Назад', 'back')
        .text('Удалить ❌', 'delete');


export const familyPlansKeyboard = new InlineKeyboard()
        .text('Я хочу детей👶', '0')
        .text('Я не хочу детей👶❌', '1').row()
        .text('У меня есть дети и хочу еще🧑‍🍼', '2')
        .text('У меня есть дети, но не хочу больше🧑‍🍼❌', '3').row()
        .text('Пока не знаю🤷', "4").row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');


export const commTypeKeyboard = new InlineKeyboard()
        .text('Много переписываюсь💬', "0").row()
        .text("Общаюсь по телефону📱", '1').row()
        .text('Люблю видеочаты🤳', '2').row()
        .text('Не люблю чатиться📱❌', '3').row()
        .text('Лучше встречусь лично🚶', "4").row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');

export const loveLangKeyboard = new InlineKeyboard()
        .text("Жесты внимания🚨", '0')
        .text("Подарки🎁", '1').row()
        .text("Прикосновения🤭", '2')
        .text('Комплименты😙', '3' ).row()
        .text("Время вместе⏳", '4').row()
        .text('Назад⏪', 'back')
        .text('Удалить ❌', 'delete');

export const yesNoKeyboard = new Keyboard()
    .text('Да').resized()
    .text('Нет').oneTime(true);

export const yesNoInKeyboard = new InlineKeyboard()
    .text('Да', '1')
    .text("Нет", '0').row()
    .text('Назад⏪', 'back')
    .text('Удалить ❌', 'delete');

export const sexKeyboard = new Keyboard()
    .text('👕').resized()
    .text('👚').oneTime(true);

export const sexInKeyboard = new InlineKeyboard()
    .text('👕', '1')
    .text('👚', '0')
    .text('Назад', "back");

export const alcoKeyboard = new InlineKeyboard()
    .text('Это не для меня', '0')
    .text('Я не пью', '1').row()
    .text('Я за тревость', '2')
    .text('По особым случаям', '3').row()
    .text('В компании по выходным', '4')
    .text('Почти каждый вечер', '5').row()
    .text('Назад⏪', 'back')
    .text('Удалить ❌', 'delete');

export const smokeKeyboard = new InlineKeyboard()
    .text('Не курю', '0')
    .text('Курю', '1').row()
    .text('Курю за компанию', '2')
    .text('Курю, когды выпиваю', '3').row()
    .text('Бросаю', '4').row()
    .text('Назад', 'back')
    .text('Удалить ❌', 'delete');

export const gymKeyboard = new InlineKeyboard()
    .text('Каждый день', '0')
    .text('Часто', '1').row()
    .text('Иногда', '2')
    .text('Никогда', '3').row()
    .text('Назад', 'back')
    .text('Удалить ❌', 'delete');

export const foodKeyboard = new InlineKeyboard()
    .text('Веганство', '0').row()
    .text('Вегатарианство', '1').row()
    .text('Пескетарианство', '2').row()
    .text('Кошерная еда', '3').row()
    .text('Халяль', '4').row()
    .text('Люблю мясо', '5').row()
    .text('Ем всё', '6').row()
    .text('Назад', 'back')
    .text('Удалить ❌', 'delete');

export const socMediaKeyboard = new InlineKeyboard()
    .text('Инфлюенсер', '0')
    .text('Активный пользователь', '1').row()
    .text('Меня там нет', '2')
    .text('Просто смотрю', '3').row()
    .text('Назад', 'back')
    .text('Удалить ❌', 'delete');

export const nightLiveKeyboard = new InlineKeyboard()
    .text('Жаворонок', '0')
    .text('Сова', '1').row()
    .text('Что-то среднее', '2').row()
    .text('Назад', 'back')
    .text('Удалить ❌', 'delete');

export const photoKeyboard = new InlineKeyboard()
    .text('Закончить загрузку фотографий', 'stopPhotos');

export const onePhotoKeyboard = new InlineKeyboard()
    .text('Добавить', 'addPhoto')
    .text('Назад⏪', 'back');

export const twoPhotoKeyboard = new InlineKeyboard()
    .text('1️⃣', '0')
    .text('2️⃣', '1').row()
    .text('Добавить', 'addPhoto')
    .text('Назад⏪', 'back');

export const threePhotoKeyboard = new InlineKeyboard()
    .text('1️⃣', '0')
    .text('2️⃣', '1').row()
    .text('3️⃣', '2').row()
    .text('Добавить', 'addPhoto')
    .text('Назад⏪', 'back');

export const fourPhotoKeyboard = new InlineKeyboard()
    .text('1️⃣', '0')
    .text('2️⃣', '1').row()
    .text('3️⃣', '2')
    .text('4️⃣', '3').row()
    .text('Добавить', 'addPhoto')
    .text('Назад⏪', 'back');

export const fivePhotoKeyboard = new InlineKeyboard()
    .text('1️⃣', '0')
    .text('2️⃣', '1').row()
    .text('3️⃣', '2')
    .text('4️⃣', '3').row()
    .text('5️⃣', '4').row()
    .text('Назад⏪', 'back');

export const shareLocation = new Keyboard().requestLocation('📍').oneTime(true).resized()
