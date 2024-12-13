'use client'

import { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { deleteUser, searchUsers } from '@/app/actions/actions'
import { UserCard } from './user-card'
import { User } from '@/app/actions/schemas'
import { toast } from 'sonner'

// Option type remains the same
interface Option {
  value: string
  label: string
  user: User
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue)
    return users.map(user => ({ value: user.id, label: user.name, user }))
  }

  const handleChange = (option: Option | null) => {
    setSelectedUser(option ? option.user : null)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteUser(id)
    if (result.success) {
      setSelectedUser(null) // Clear selected user after deletion
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        className="w-full max-w-md mx-auto"
      />
      {selectedUser && <UserCard user={selectedUser} onDelete={handleDelete} />}
    </div>
  )
}
