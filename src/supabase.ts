import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const addUserToDatabase = async (userId: number) => {
  try {
    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore the error if the user doesn't exist
      throw fetchError;
    }

    if (existingUser) {
      console.log('User already exists in the database.');
      return existingUser; // User already exists, return the existing record
    }

    // Insert the new user if they don't exist
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: userId, coins: 0 }]);

    if (error) {
      console.error('Error adding user:', error.message);
      return null;
    }

    console.log('User added to database:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

export const updateCoins = async (userId: number, coins: number) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ coins })
      .eq('id', userId);

    if (error) {
      console.error('Error updating coins:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

export const getUserCoins = async (userId: number) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('coins')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting coins:', error);
      return null;
    }
    return data?.coins || 0;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};
