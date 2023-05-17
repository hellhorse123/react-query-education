import axios from "axios";
import { useQueries } from "react-query";

const fetchSuperHero = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const DynamicParallelQueriesPage = ({ heroIds }) => {
  console.log(heroIds);
  const queryResults = useQueries(
    heroIds.map((id) => {
      return {
        queryKey: ["super-hero", id], // ключ запроса
        queryFn: () => fetchSuperHero(id), // для использования запроса
      };
    })
  );
  console.log({ queryResults });
  return <div>Parallel</div>;
};
