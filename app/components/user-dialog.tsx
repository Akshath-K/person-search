// app/components/user-dialog.tsx
'use client';

import { addUser, editUser } from '@/app/actions/actions';
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';
import MutableDialog, { ActionState } from '@/components/mutable-dialog';

interface UserDialogProps {
  user?: User; // Optional: Passed for editing
}

export function UserDialog({ user }: UserDialogProps) {
  const handleAddOrEditUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      if (user) {
        // Call the `editUser` function for updates
        const updatedUser = await editUser(user.id, data);
        return {
          success: true,
          message: `User ${updatedUser.name} updated successfully.`,
          data: updatedUser,
        };
      } else {
        // Call `addUser` for new entries
        const newUser = await addUser(data);
        return {
          success: true,
          message: `User ${newUser.name} added successfully.`,
          data: newUser,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: user ? 'Failed to update user' : 'Failed to add user',
      };
    }
  };

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleAddOrEditUser}
      triggerButtonLabel={user ? 'Edit User' : 'Add User'}
      addDialogTitle="Add New User"
      editDialogTitle={`Edit ${user?.name}`}
      dialogDescription={user ? 'Update user information below.' : 'Fill out the form below to add a new user.'}
      submitButtonLabel={user ? 'Save Changes' : 'Add User'}
      defaultValues={user ? { name: user.name, email: user.email, phoneNumber: user.phoneNumber } : undefined}
    />
  );
}
