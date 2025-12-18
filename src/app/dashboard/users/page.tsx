import { AddUserForm } from "@/components/add-user-form"

export default function UsersPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Add and manage team members.</p>
        </div>
      </div>
      
      {/* We can add a list of users here later, for now, just the add form */}
      <AddUserForm />
    </div>
  )
}