import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  users = signal<User[]>([]);

  constructor(private http: HttpClient) {}

  loadUsers() {
    this.http.get<User[]>(this.apiUrl).subscribe(data => this.users.set(data));
  }

  createUser(user: User) {
    this.http.post<User>(this.apiUrl, user).subscribe(newUser => {
      this.users.update(users => [...users, newUser]);
    });
  }

  updateUser(id: number, user: Partial<User>) {
    this.http.put<User>(`${this.apiUrl}/${id}`, user).subscribe(updated => {
      this.users.update(users => users.map(u => u.id === id ? updated : u));
    });
  }

  deleteUser(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.users.update(users => users.filter(u => u.id !== id));
    });
  }
}
