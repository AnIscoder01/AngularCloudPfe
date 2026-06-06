import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MachinesComponent } from './machines/machines.component';
import { NoclonedlistComponent } from './noclonedlist/noclonedlist.component';
import { ListvmComponent } from './listvm/listvm.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditVmComponent } from './edit-vm/edit-vm.component';
import { UsageComponent } from './usage/usage.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // public routes — no guard
  { path: 'home',     component: HomeComponent },
  { path: 'login',    component: LoginComponent,    title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },

  // protected routes — auth required
  { path: 'machines',     component: MachinesComponent,     title: 'My VMs',    canActivate: [authGuard] },
  { path: 'noclonedlist', component: NoclonedlistComponent, title: 'Find VM',   canActivate: [authGuard] },
  { path: 'edit',         component: EditVmComponent,       title: 'Edit VM',   canActivate: [authGuard] },
  { path: 'usage',        component: UsageComponent,        title: 'My Usage',  canActivate: [authGuard] },
  { path: 'profile',      component: ProfileComponent,      title: 'Profile',   canActivate: [authGuard] },

  // admin only routes
  { path: 'listvm',       component: ListvmComponent,       title: 'All VMs',   canActivate: [adminGuard] },
  { path: 'dashboard',    component: DashboardComponent,    title: 'Dashboard', canActivate: [adminGuard] },
  { path: 'admin/users',  component: AdminUsersComponent,   title: 'Users',     canActivate: [adminGuard] },
  { path: 'payment-success', component: PaymentSuccessComponent },
];