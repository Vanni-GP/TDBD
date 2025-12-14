import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Observable } from 'rxjs';

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

  deleteUser(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.users.update(users => users.filter(u => u.id !== id));
    });
  }
}
