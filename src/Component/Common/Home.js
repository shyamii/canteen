import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section class="home" id="home">
      <div class="home-title">
        <h1>Enjoy the taste</h1>
        <h2>What do you want to eat today ?.</h2>
        {/* <<a ]class="btn">
          Explore the menu
        </a>> */}
        <Link to={"/menu"}>Explore the menu</Link>
      </div>
    </section>
  );
};

export default Home;