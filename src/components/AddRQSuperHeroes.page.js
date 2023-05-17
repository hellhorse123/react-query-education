import { Link } from "react-router-dom";
import {
  useAddSuperHeroData,
  useSuperHeroesData,
} from "../hooks/useSuperHeroesData";
import { useState } from "react";

const onSuccess = (data) => {
  console.log("Perform side effect after data fetching", data);
};

const onError = (err) => {
  console.log("Perform side effect after encountering error", err);
};

export const AddRQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHeroesData(onSuccess, onError);

  const { mutate: addHero } = useAddSuperHeroData(); // mutate - функция с помощью которой мы можем сделать post

  const handleAddHero = () => {
    console.log({ name, alterEgo });
    const hero = { name, alterEgo };
    addHero(hero);
  };

  if (isLoading || isFetching) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>RQ SuperHeroesPage</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleAddHero}>Add hero</button>
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => {
        return (
          <div key={hero.id}>
            <Link to={`/rq-super-heroes/${hero.id}`}>{hero.name}</Link>
          </div>
        );
      })}
    </>
  );
};
