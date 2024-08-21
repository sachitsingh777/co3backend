import { createSchema, createYoga } from 'graphql-yoga';
import { updateCoins, getUserCoins } from './supabase';

const typeDefs = `
  type Query {
    coins(userId: Int!): Int
  }

  type Mutation {
    incrementCoins(userId: Int!, amount: Int!): Int
  }
`;

const resolvers = {
  Query: {
    coins: async (_: any, { userId }: { userId: number }) => {
      try {
        return await getUserCoins(userId);
      } catch (error) {
        console.error('Error fetching coins:', error);
        throw new Error('Failed to fetch coins');
      }
    },
  },
  Mutation: {
    incrementCoins: async (_: any, { userId, amount }: { userId: number, amount: number }) => {
      try {
        const currentCoins = await getUserCoins(userId);
        const newCoins = (currentCoins || 0) + amount;
        await updateCoins(userId, newCoins);
        return newCoins;
      } catch (error) {
        console.error('Error incrementing coins:', error);
        throw new Error('Failed to increment coins');
      }
    },
  },
};

const schema = createSchema({ typeDefs, resolvers });
export const yoga = createYoga({ schema });
