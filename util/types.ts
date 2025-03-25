const zodiacTypes = ['♑️', '♒️', '♓️', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️']
const persTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ]
const searchTypes = ['Просто повеселиться 🎉', 'Найти друзей 👋','Все еще разбираюсь 🤔','Долгосрочный партнер 💘',
                        'Долго- или краткосрочно 😍', 'Долго- или краткосрочно 🥂']

const educationTypes = ['Бакалавр', 'Колледж', 'Средняя школа', 'Доктор Наук', 'Аспирантура', 'Магистратура']

const familyPlansTypes = ['Я хочу детей', 'Я не хочу детей', 'У меня есть дети и хочу еще', 
    'У меня есть дети, но не хочу больше', 'Пока не знаю']

const loveLangTypes = ["Жесты внимания", "Подарки", "Прикосновения", 'Комплименты',"Время вместе"]

const alcoTypes = ['Это не для меня' , 'Я не пью', 'Я за тревость', 'По особым случаям' ,
    'В компании по выходным', 'Почти каждый вечер']

const smokeTypes = ['Не курю', 'Курю', 'Курю за компанию', 'Курю, когды выпиваю', 'Бросаю']

const gymTypes = ['Каждый день','Часто','Иногда','Никогда']

const foodTypes = ['Веганство','Вегатарианство','Пескетарианство','Кошерная еда','Халяль','Люблю мясо','Ем всё']

const socMediaTypes = ['Инфлюенсер','Активный пользователь','Меня там нет','Просто смотрю']

const commTypes = ['Много переписываюсь',"Общаюсь по телефону", 'Люблю видеочаты','Не люблю чатиться','Лучше встречусь лично']

const nightLiveTypes = ['Жаворонок','Сова','Что-то среднее']

const sexTypes: Record<string, string> = {true: '👕',false: '👚'}

export {zodiacTypes,searchTypes,educationTypes,familyPlansTypes,loveLangTypes,persTypes, 
    alcoTypes, smokeTypes, gymTypes,foodTypes,socMediaTypes,commTypes,nightLiveTypes, sexTypes}