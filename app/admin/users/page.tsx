"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"

// Sample users data
const sampleUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: new Date(2023, 11, 31).toISOString(),
    active: true,
  },
  {
    id: "2",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    lastLogin: new Date(2023, 11, 30).toISOString(),
    active: true,
  },
]

// Generate more sample users
for (let i = 3; i <= 15; i++) {
  sampleUsers.push({
    id: i.toString(),
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: i % 3 === 0 ? "admin" : "editor",
    lastLogin: new Date(2023, 11, 31 - i).toISOString(),
    active: i % 5 !== 0,
  })
}

export default function UsersPage() {
  const [users, setUsers] = useState(sampleUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const usersPerPage = 10

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleEdit = (user: any) => {
    setEditingUser({ ...user })
  }

  const handleAddNew = () => {
    const newId = (Math.max(...users.map((user) => Number.parseInt(user.id))) + 1).toString()
    setEditingUser({
      id: newId,
      name: "",
      email: "",
      role: "editor",
      lastLogin: null,
      active: true,
    })
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleSave = () => {
    if (!editingUser) return

    const isNew = !users.some((user) => user.id === editingUser.id)

    if (isNew) {
      setUsers([...users, editingUser])
    } else {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
    }

    setEditingUser(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-yellow-600">Administrateur</Badge>
      case "editor":
        return <Badge className="bg-blue-600">Éditeur</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        {user.active ? (
                          <Badge className="bg-green-500">Actif</Badge>
                        ) : (
                          <Badge className="bg-gray-500">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === "1"} // Prevent deleting the main admin
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur{" "}
                {filteredUsers.length} utilisateurs
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Edit/Add User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {users.some((user) => user.id === editingUser.id)
                      ? "Modifier l'utilisateur"
                      : "Ajouter un nouvel utilisateur"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="editor">Éditeur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!users.some((user) => user.id === editingUser.id) && (
                    <div>
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input id="password" type="password" placeholder="Nouveau mot de passe" className="mt-1" />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editingUser.active}
                      onChange={(e) => setEditingUser({ ...editingUser, active: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="active">Actif</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>Enregistrer</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
