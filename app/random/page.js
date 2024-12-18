'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [meal, setMeal] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail && storedPassword) {
      handleLogin(storedEmail, storedPassword);
    } else {
      router.push('/signup');
    }

    const fetchMealData = async () => {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        const fetchedMeal = response.data.meals[0];
        setMeal(fetchedMeal);

        if (fetchedMeal) {
          const token = localStorage.getItem('token');
          const checkFavoriteResponse = await axios.get('/api/recipe/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const isFavorite = checkFavoriteResponse.data.favorites.some(
            (favorite) => favorite.idMeal === fetchedMeal.idMeal
          );
          setFavorite(isFavorite);
        }
      } catch (error) {
        console.error('Error fetching meal data:', error);
      }
    };

    fetchMealData();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleFavoriteChange = async (e) => {
    const isChecked = e.target.checked;
    setFavorite(isChecked);
    const token = localStorage.getItem('token');

    try {
      if (isChecked) {
        await axios.post(
          '/api/recipe',
          {
            idMeal: meal.idMeal,
            strCategory: meal.strCategory,
            strArea: meal.strArea,
            strMealThumb: meal.strMealThumb,
            strMeal: meal.strMeal,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          '/api/recipe/',
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { idMeal: meal.idMeal },
          }
        );
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  if (!meal) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-purple-500">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-500 py-12 px-6">
      <div className="flex justify-center items-center w-full">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-5xl w-full gap-8">
          <div className="flex justify-end">
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text p-2">Favorite</span>
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={handleFavoriteChange}
                  className="checkbox checkbox-warning"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl font-bold text-center text-primary text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {meal.strMeal}
            </h1>
            <div className="flex justify-center items-center">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-full border-4 max-w-[350px] rounded-lg shadow-xl object-cover"
              />
            </div>
            <hr className="m-5" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <p className="text-lg text-gray-700 text-justify">{meal.strInstructions}</p>
            <div className="flex gap-4 justify-center mt-6">
              <span className="badge badge-primary">{meal.strCategory}</span>
              <span className="badge badge-secondary">{meal.strArea}</span>
            </div>

            <hr className="m-5" />

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
              <table className="table table-zebra w-full table-bordered table-striped">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-black">Ingredient</th>
                    <th className="text-black">Measurement</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 20 }, (_, index) => {
                    const ingredientKey = `strIngredient${index + 1}`;
                    const measureKey = `strMeasure${index + 1}`;

                    const ingredient = meal[ingredientKey];
                    const measure = meal[measureKey];

                    if (ingredient && ingredient.trim() !== "" && measure && measure.trim() !== "") {
                      return (
                        <tr key={index} className="hover:bg-gray-100">
                          <td>{ingredient}</td>
                          <td>{measure}</td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>

            {meal.strYoutube && (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Watch Recipe Video</h2>
                <iframe
                  width="100%"
                  height="auto"
                  src={`https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}`}
                  title="Recipe Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="mx-auto max-w-full aspect-video"
                ></iframe>
              </div>
            )}

            {meal.strSource && (
              <div className="mt-8 text-center">
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:text-blue-800"
                >
                  <button className="btn btn-link">External Source</button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
