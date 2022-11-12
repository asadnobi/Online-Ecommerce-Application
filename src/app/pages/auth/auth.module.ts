import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
    {path: 'sign-in', loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInPageModule)},
    {path: 'login-pin', loadChildren: () => import('./login-pin/login-pin.module').then( m => m.LoginPinPageModule)},
    {path: 'forget-pass', loadChildren: () => import('./forget-pass/forget-pass.module').then( m => m.ForgetPassPageModule)},
    {path: 'recovery-pass', loadChildren: () => import('./recovery-pass/recovery-pass.module').then( m => m.RecoveryPassPageModule)}
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthPageModule {}
