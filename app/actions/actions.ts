// app/actions.ts
'use server';

import { ActionState } from '@/components/mutable-dialog';
import { User, userSchema } from './schemas';
 
const users: User[] = [
  { id: '1', name: 'John Doe', phoneNumber: '0412345678', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', phoneNumber: '0423456789', email: 'jane@example.com' },
  { id: '3', name: 'Alice Johnson', phoneNumber: '0434567890', email: 'alice@example.com' },
  { id: '4', name: 'Bob Williams', phoneNumber: '0445678901', email: 'bob@example.com' },
  { id: '5', name: 'Charlie Brown', phoneNumber: '0456789012', email: 'charlie@example.com' },
];

export async function searchUsers(query: string): Promise<User[]> {
  //   const users = await getUsers()
    console.log('Searching users with query:', query)
    return users.filter(user => user.name.toLowerCase().startsWith(query.toLowerCase()))
  }

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  const newUser: User = {
    id: (users.length + 1).toString(),
    ...data,
  };

  const validatedUser = userSchema.parse(newUser);
  users.push(validatedUser);
  return validatedUser;
}

export async function editUser(id: string, data: Omit<User, 'id'>): Promise<User> {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = { ...users[userIndex], ...data };
  const validatedUser = userSchema.parse(updatedUser);

  users[userIndex] = validatedUser;
  return validatedUser;
}

export async function deleteUser(id: string): Promise<ActionState<null>> {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return {
      success: false,
      message: `User with ID ${id} not found.`,
    };
  }

  users.splice(userIndex, 1); // Remove user from the array

  return {
    success: true,
    message: `User with ID ${id} deleted successfully.`,
    data: null,
  };
}

