import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_GATHERING_LIST = gql`
  query {
    allGathering {
      _id
      slug {
          current
      }
      title
      name
    }
  }
`;

export const Gatherings = () => {
  const { loading, error, data } = useQuery(GET_GATHERING_LIST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Gathering List</h1>
      {data.allGathering.map(({ _id, title, name, slug }) => (
        <div key={_id}>
          <h2>
            <Link to={slug.current}>{title}</Link>
          </h2>
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
};
