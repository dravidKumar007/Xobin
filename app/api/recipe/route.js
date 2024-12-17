import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  favorites: [
    {
      idMeal: { type: String },
      strCategory: { type: String },
      strArea: { type: String },
      strMealThumb: { type: String },
      strMeal: { type: String },
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'User');

export async function POST(req) {
    try {
      // Ensure the database connection
      await connectToDatabase();
  
      // Extract favorite meal data from the request body
      const { idMeal, strCategory, strArea, strMealThumb, strMeal } = await req.json();
  
      if (!idMeal || !strCategory || !strArea || !strMealThumb || !strMeal) {
        return new Response(
          JSON.stringify({ error: 'All favorite meal details are required' }),
          { status: 400 }
        );
      }
  
      // Find the user with the email 'johndoe@example.com'
      const user = await User.findOne({ email: 'johndoe@example.com' });
  
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404 }
        );
      }
  
      // Add the new favorite meal to the user's favorites array
      user.favorites.push({
        idMeal,
        strCategory,
        strArea,
        strMealThumb,
        strMeal,
      });
  
      // Save the updated user document
      await user.save();
  
      // Respond with a success message
      return new Response(
        JSON.stringify({ message: 'Favorite added successfully!' }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error adding favorite:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
    }
  }

export async function GET(req) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: 'johndoe@example.com' });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Favorites fetched successfully!',
        favorites: user.favorites,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();

    const { idMeal } = await req.json();

    if (!idMeal) {
      return new Response(
        JSON.stringify({ error: 'idMeal is required' }),
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: 'johndoe@example.com' },
      { $pull: { favorites: { idMeal } } },
      { new: true }
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Favorite removed successfully!',
        favorites: user.favorites,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}