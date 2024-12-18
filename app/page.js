"use client"
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
 
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
    setPassword(localStorage.getItem('password'));
    mealApiCall();
    console.log(localStorage.getItem('token'))
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');

    router.push('/login');
  };

  const mealApiCall = () => {
    axios
      .get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + search)
      .then((response) => {
        setMeals(response.data.meals);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the data: ', error);
        setLoading(false);
      });
  }

  return (
    <div>
      <div className="navbar bg-black">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">TheMealDB</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <button className="btn mr-4" onClick={mealApiCall}>🔍</button>
        </div>
        <div className="flex-none">
          <Link href={'/favorite'}>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    height="30"
                    width="30"
                    viewBox="0 0 501.28 501.28"
                    xmlSpace="preserve"
                  >
                    <g>
                      <polygon
                        style={{ fill: "#FFCD00" }}
                        points="501.28,194.37 335.26,159.33 250.64,12.27 250.64,419.77 405.54,489.01 387.56,320.29"
                      />
                      <polygon
                        style={{ fill: "#FFDA44" }}
                        points="166.02,159.33 0,194.37 113.72,320.29 95.74,489.01 250.64,419.77 250.64,12.27"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href={'/random'}>
            <div className="flex items-center justify-center mx-4 group relative hover:cursor-pointer">
              <svg
                fill="#ffffff"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                height="30"
                width="30"
                className="transition-all duration-300 ease-in-out group-hover:ring-4 group-hover:ring-white group-hover:ring-opacity-20 rounded-full"
              >
                <g id="SVGRepo_iconCarrier">
                  <g fillRule="evenodd">
                    <path d="M47.895 88.097c.001-4.416 3.064-9.837 6.854-12.117l66.257-39.858c3.785-2.277 9.915-2.277 13.707.008l66.28 39.934c3.786 2.28 6.853 7.703 6.852 12.138l-.028 79.603c-.001 4.423-3.069 9.865-6.848 12.154l-66.4 40.205c-3.781 2.29-9.903 2.289-13.69-.01l-66.167-40.185c-3.78-2.295-6.842-7.733-6.84-12.151l.023-79.72zm13.936-6.474l65.834 36.759 62.766-36.278-62.872-36.918L61.83 81.623zM57.585 93.52c0 1.628-1.065 71.86-1.065 71.86-.034 2.206 1.467 4.917 3.367 6.064l61.612 37.182.567-77.413s-64.48-39.322-64.48-37.693zm76.107 114.938l60.912-38.66c2.332-1.48 4.223-4.915 4.223-7.679V93.125l-65.135 37.513v77.82z"></path>
                    <path d="M77.76 132.287c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm-32 16c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm78.238-78.052c-4.783-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.623 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-16.238 29c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-17 28c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zM128.5 69c-6.351 0-11.5 4.925-11.5 11s5.149 11 11.5 11S140 86.075 140 80s-5.149-11-11.5-11z"></path>
                  </g>
                </g>
              </svg>
              <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
            </div>
          </Link>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://www.svgrepo.com/show/157823/user.svg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href={'/login'} className="justify-between">
                  Login
                  <span className="badge">New</span>
                </Link>
              </li>
              <li > <a onClick={()=>{handleLogout()}}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="text-center">
          {loading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {meals &&
                meals.map((meal) => (
                  <Link href={`/recipe/${meal.idMeal}`} key={meal.idMeal}>
                    <div
                      className="card w-80 bg-black border border-black shadow-md hover:shadow-xl hover:cursor-pointer transition-transform duration-300 transform hover:scale-105"
                    >
                      <figure>
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="w-full h-48 object-cover"
                        />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{meal.strMeal}</h2>
                        <div className="flex gap-4 justify-start mt-6">
              <span className="badge badge-primary">{meal.strCategory}</span>
              <span className="badge badge-secondary">{meal.strArea}</span>
                      </div>
                    </div>
            </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      </div>
  );
}
