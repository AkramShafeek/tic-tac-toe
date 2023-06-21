import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex f-col gap-2">
      <NavLink to="/onlineroom">
        <button onClick={() => { }} className="primary">Online</button>
      </NavLink>
      <NavLink to="/local">
        <button onClick={() => { }} className="primary">Local</button>
      </NavLink>
    </div>
  );
}

export default Home;
