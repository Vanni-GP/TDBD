import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class UserComponent {
  newUser: User = { name: '', email: '' };
  editingUser: User | null = null;

  constructor(public userService: UserService) {
    this.userService.loadUsers();
  }

  addUser() {
    this.userService.createUser(this.newUser);
    this.newUser = { name: '', email: '' };
  }

  startEdit(user: User) {
    this.editingUser = { ...user };
  }

  cancelEdit() {
    this.editingUser = null;
  }

  updateUser() {
    if (!this.editingUser?.id) return;
    this.userService.updateUser(this.editingUser.id, this.editingUser);
    this.editingUser = null;
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
  }
}
