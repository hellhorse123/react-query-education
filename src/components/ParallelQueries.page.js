import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get(`http://localhost:4000/superheroes`);
};

const fetchFriends = () => {
  return axios.get(`http://localhost:4000/friends`);
};

export const ParallelQueriesPage = () => {
  const {data: superHeroes} = useQuery("super-heroes", fetchSuperHeroes); // использование псевдонимов при деструктуризации данных при параллельных запросах
  const {data: friends} = useQuery("friends", fetchFriends);
  return <div>Parallel</div>;
};
