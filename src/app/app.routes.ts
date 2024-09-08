import { Routes } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { EditVmComponent } from './edit-vm/edit-vm.component';
import { LoginComponent } from './login/login.component';
import { ListvmComponent } from './listvm/listvm.component';
import { HomeComponent } from './home/home.component';
import { NoclonedlistComponent } from './noclonedlist/noclonedlist.component';

export const routes: Routes = [
    {path:"",redirectTo:"home",pathMatch:'full'},
    {path:'login',  component: LoginComponent, title:'Login'     },
    {path:'machines',  component:MachinesComponent, title:'liste des Vms'},
    {path:'edit',  component: EditVmComponent, title:'Edition'     },
    {path:'home',  component: HomeComponent },
    {path:'noclonedlist',  component: NoclonedlistComponent,title:'non cloné' },
    {path:'listvm',  component: ListvmComponent }
    ];
