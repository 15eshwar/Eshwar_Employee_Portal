import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeavedataComponent } from './components/leavedata/leavedata.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { leadingComment } from '@angular/compiler';

export const routes: Routes = [
 //Default Routing
{
path:'',
redirectTo: 'welcome',
pathMatch:'full'
},
{
    path:'welcome',
    component:WelcomeComponent
},
{
    path:'login',
    component:LoginComponent
},
{
    path:'dashBoard',
    component:DashboardComponent
},
{
    path:'profile',
    component:ProfileComponent
},
{
    path:'leave-data',
    component:LeavedataComponent
},
{
    path:'pay-slip',
    component:PayslipComponent
}
];
