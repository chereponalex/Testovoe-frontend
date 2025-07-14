import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MainPage = () => {
  return (
    <div>
      <div className="flex justify-center p-4">
        <Card className="w-[750px] text-left">
          <CardHeader>
            <CardTitle>Обо мне</CardTitle>
            <CardDescription>
              Разработчик, создавший это приложение.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Я fullstack-разработчик. Опыт работы более 4-х лет. Интересны
              сложные проекты, с дальнейшим профессиональным ростом. Регулярно
              учусь и улучшаю свои знания на практике. Разработка для меня - это
              развитие. Есть опыт создания проектов с нуля. Верстка по макету,
              создание UI-компонентов, фронтальной логики, архитектуры, есть
              опыт работы с кастомным SSR(на базе Express.js). Свободно пишу на
              NodeJS+typescript, работаю с PostgreSQL(есть опыт проектирования
              БД с нуля) и MongoDB, S3-AWS, создаю архитектуру, роутинг. Также
              интересен DevOps. Есть опыт написания телеграм-ботов. Ищу
              прогрессивную команду, где могу быть полезным, применяя свои
              навыки и самое главное, получая новые.
              <hr className="p-5" />
              Мой стек: Frontend: React, Next.js, Redux, RTK Query, HTML5, CSS3,
              Sass, Styled-Components, WebSockets, TypeScript, D3.js, Recharts.
              Backend: Node.js, Express.js, Nest.js , Typescript, WebSockets,
              WebRTC, S3-AWS, Redis. DB: PostgreSQL, MongoDB, TypeORM, Sequelize
              Nginx, GIT, Eslint, CI/CD, Docker, GraphQL, WebPack, Vite, Figma
              Планирую освоить: GoLang, Vue. Мой телеграм: @CherepanovAlexey Мой
              номер: 79260973212
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <a
                href="https://github.com/chereponalex?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                Мой GitHub
              </a>
            </Button>
            <Button asChild>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Черепанов_Алексей.pdf"
              >
                Скачать Резюме
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MainPage;
