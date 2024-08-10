import { Routes } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { EditVmComponent } from './edit-vm/edit-vm.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path:'machines',  component:MachinesComponent, title:'liste des Vms'     },
    {path:'edit',  component: EditVmComponent, title:'Edition'     },
    {path:'login',  component: LoginComponent, title:'Login'     }
    ];
