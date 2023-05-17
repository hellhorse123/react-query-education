import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
import { request } from "../utils/axios-utils";

const fetchSuperHeroes = () => {
  // return axios.get("http://localhost:4000/superheroes");
  return request({ url: "/superheroes" });
};

const addSuperHero = (hero) => {
  // return axios.post("http://localhost:4000/superheroes", hero);
  return request({ url: "/superheroes", method: "post", data: hero });
};

export const useSuperHeroesData = (onSuccess, onError) => {
  return useQuery(
    "super-heroes", //1 параметр - уникальный ключ, который используется в том числе и в RQdevtools для отслеживания
    fetchSuperHeroes, //2 параметр - функция извлечения
    {
      // 3 параметр - объект, где указываются спец опции для различного поведения
      // cacheTime: 5000, // время кеширования запроса при переходе на другую страницу
      // staleTime: 30000, // время жизни запроса до повторного обращения (через 30 сек если перейти на др страницу и обратно - вызовется запрос)
      // refetchOnMount: true, // если false - запрос не будет отправляться при повторном заходе на страницу. 'always' - всегда обновляет запрос при монтировании
      // refetchOnWindowFocus: true, //def true - данные с серва обновляются при фокусировке на этой странице (false и 'always' примерно также как выше)
      // refetchInterval: 2000, //def false. если установлены милисекунды - он обновляет запрос с этим интервалом
      // refetchIntervalInBackground: true - доп опция, позволяет рефетчить данные, даже если окно браузера не в фокусе
      // enabled: false, //отключает монтирование запроса при попадании на эту страницу
      onSuccess, //позволяет выполнять сайд эффекты при успешном выполнении запроса
      onError, //позволяет выполнять сайд эффекты при ошибки во время выполнения запроса
      //   select: (data) => {
      //     const superHeroNames = data.data.map((hero) => hero.name);
      //     return superHeroNames;
      //   }, // позволяет преолбразовать данные с сервера в читаемый формат на фронте
    }
  );
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    onMutate: async (newHero) => {
      // вызывается перед запуском функции мутации и ему передаются те же функции, которые получит мутация
      await queryClient.cancelQueries("super-heroes");
      const previousHeroData = queryClient.setQueryData(
        "super-heroes",
        (oldQueryData) => {
          return {
            ...oldQueryData,
            data: [
              ...oldQueryData.data,
              { id: oldQueryData?.data?.length + 1, ...newHero },
            ],
          };
        }
      );
      return {
        previousHeroData, //для отката данных, если мутация выполнится с ошибкой
      };
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData("super-heroes", context.previousHeroData);
    },
    onSettled: () => {
      queryClient.invalidateQueries("super-heroes");
    },
    // onSuccess: (data) => {
    //   queryClient.setQueryData("super-heroes", (oldQueryData) => {
    //     // второй аргумент (функция) автоматически получает старые данные (экономит дополнительный запрос на получение данных после обновления)
    //     return {
    //       ...oldQueryData,
    //       data: [...oldQueryData.data, data.data],
    //     };
    //   });
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries("super-heroes"); // hgи вызове этой функции, rq аннулирует запрос и пошлет еще один
    // },
  }); // в мутации ключ необязателен. 1 аргумент - функция, котороя отправит данные на серв
};
