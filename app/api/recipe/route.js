import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

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

const getUserFromToken = (authHeader) => {
  if (!authHeader) throw new Error('Authorization header is missing');

  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Token is missing');

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is missing in environment variables');

  try {
    const decoded = jwt.verify(token, jwtSecret, { ignoreExpiration: true });
    return decoded.email;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export async function POST(req) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('Authorization');
    const email = getUserFromToken(authHeader);

    const { idMeal, strCategory, strArea, strMealThumb, strMeal } = await req.json();

    if (!idMeal || !strCategory || !strArea || !strMealThumb || !strMeal) {
      return new Response(
        JSON.stringify({ error: 'All favorite meal details are required' }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    user.favorites.push({ idMeal, strCategory, strArea, strMealThumb, strMeal });
    await user.save();

    return new Response(JSON.stringify({ message: 'Favorite added successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

// GET - Fetch user's favorites
export async function GET(req) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('Authorization');
    const email = getUserFromToken(authHeader);

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    return new Response(
      JSON.stringify({ message: 'Favorites fetched successfully!', favorites: user.favorites }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}

// DELETE - Remove a favorite meal
export async function DELETE(req) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('Authorization');
    const email = getUserFromToken(authHeader);

    const { idMeal } = await req.json();
    if (!idMeal) return new Response(JSON.stringify({ error: 'idMeal is required' }), { status: 400 });

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { favorites: { idMeal } } },
      { new: true }
    );
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    return new Response(
      JSON.stringify({ message: 'Favorite removed successfully!', favorites: user.favorites }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
}
