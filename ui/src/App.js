import { gql, useQuery } from "@apollo/client";
import {Link} from 'react-router-dom'

const GET_GATHERING_LIST = gql`
  query {
    allOrganization {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_GATHERING_LIST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Organization List</h1>
      {data.allOrganization.map(({ _id, slug, title, name }) => (
        <div key={_id}>
          <Link to={`/${slug.current}/gatherings`}>{title}</Link>
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
