import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      idMeal: { type: String, default: '' },
      strCategory: { type: String, default: '' },
      strArea: { type: String, default: '' },
      strMealThumb: { type: String, default: '' },
      strMeal: { type: String, default: '' },
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'User');


export const POST = async (req) => {
    const { email, password, username } = await req.json();
  
    try {
      await connectToDatabase();
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return new Response(
          JSON.stringify({ message: 'User already exists' }),
          { status: 400 }
        );
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        favorites: [],
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return new Response(
        JSON.stringify({
          message: 'User created successfully',
          token,
          expiresIn: '1h',
        }),
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  };
  
  

export const GET = async (req) => {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const password = url.searchParams.get('password');

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required' }),
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        expiresIn: '1h',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
