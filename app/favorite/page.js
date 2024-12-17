"use client"
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from 'next/link';

export default function Page() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    mealApiCall();
  }, []);

  const mealApiCall = () => {
    axios
      .get('/api/recipe')
      .then((response) => {
        setMeals(response.data.favorites);
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
      {/* TheMealDB Title - Aligned to the Left */}
      <Link href={'/'}>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">TheMealDB</a>
        </div>
      </Link>
  
      {/* Other elements (e.g., dropdown) - Aligned to the Right */}
      <div className="flex-none ml-auto">
        {/* Cart Icon (e.g., Notification Indicator) */}
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
  
        {/* Avatar and Dropdown Menu */}
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow "
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Logout</a></li>
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
                        <div className="flex gap-2 mt-2">
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