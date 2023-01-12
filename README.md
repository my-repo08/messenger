# Messenger - приложение для обмена мгновенными сообщениями

## 📓 Описание проекта:

Приложение сконфигурировано при помощи шаблона `npx create-react-app --template typescript`

Адаптировано под mobile, tablet, desktop

## Cтэк:

- `TypeScript`
- `React`
- `React Router`
- `Firebase`
- `Styled Components`

## ⚙️ Описание функциональности

### Авторизация

При запуске приложения будет доступна страница авторизации. На ней можно авторизоваться через Google или через ранее созданный аккаунт. Если аккаунта еще нет, можно зарегистрироваться используя любой валидный e-mail. Если забыли пароль от ранее созданного аккаунта, его можно с легкостью восстановить, получив ссылку на почту. Пройдя успешную авторизации через почту, если пользователь создал новый аккаунт, то необходимо будет указать имя пользователя по которому его смогут найти другие пользователи и которое будет отображено везде где будет появляться пользователь, также опционально можно установить аватар.

![1](https://user-images.githubusercontent.com/122017847/212078766-1edf95e4-130f-4518-9f1d-fa3cd3cc6a5b.gif)
#

![2](https://user-images.githubusercontent.com/122017847/212078803-31d4a6fa-1529-4f6c-a40c-ce3eab55f990.gif)
#

### Главная страница

На основной странице доступен непосредственно сам чат. Через поле поиска можно найти определенного пользователя и создать с ним беседу. Список текущих бесед сортируется по времени получения последнего сообщения. Если в беседе есть непрочитанное сообщение, будет отображен синий индикатор.

![3](https://user-images.githubusercontent.com/122017847/212078862-f6027b0e-c877-42ea-a7b1-03263ab809dc.gif)
#

При клике на определённую беседу будет открыто окно диалога, где можно отправлять сообщения. Сообщения отправленные текущем пользователем будут отображены  в правой части диалогового окна, а сообщения отправленные собеседником в левой части.

![4](https://user-images.githubusercontent.com/122017847/212079035-aea639c1-9d0d-48b5-afda-152eaf8e6527.gif)
#

В приложении доступные две темы: светлая (по умолчанию) и темная.

![5](https://user-images.githubusercontent.com/122017847/212079109-60543a28-9b8b-4424-8f20-d3ede3a18657.gif)
#

При клике на кнопку в верхнем правом углу беседы будет открыто дополнительное меню с возможностью удалить текущую беседу и все связанные с ней сообщения.

![6](https://user-images.githubusercontent.com/122017847/212079150-0740105e-cca5-438d-a2b4-4e377ce3e512.gif)
#

### Мобильная версия

Приложение адаптировано под комфортное использование на мобильном телефоне с функционалом десктопной версии:

![7](https://user-images.githubusercontent.com/122017847/212080574-eda093e8-f41e-44c6-a705-b31a103b274b.gif)

![8](https://user-images.githubusercontent.com/122017847/212080593-46980564-de0e-46c8-a824-bb2547ccf3e0.gif)
