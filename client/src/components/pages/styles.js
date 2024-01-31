import grid from "../../components/img/grid.svg";

const bgStyle = {
  backgroundImage: `url(${grid})`,
  height: "100vh",
  width: "100vw",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const buttonClass =
  "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 border-2 border-emerald-900 border-opacity-50";

export { bgStyle, buttonClass };
