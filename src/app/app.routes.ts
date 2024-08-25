import { Routes } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { EditVmComponent } from './edit-vm/edit-vm.component';
import { LoginComponent } from './login/login.component';
import { ListvmComponent } from './listvm/listvm.component';

export const routes: Routes = [
    {path:"",redirectTo:"listvm",pathMatch:'full'},
    {path:'login',  component: LoginComponent, title:'Login'     },
    {path:'machines',  component:MachinesComponent, title:'liste des Vms'},
    {path:'edit',  component: EditVmComponent, title:'Edition'     },
   
    {path:'listvm',  component: ListvmComponent }


   
    ];
