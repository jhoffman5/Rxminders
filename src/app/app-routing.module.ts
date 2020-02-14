import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  { path: 'camera', loadChildren: './camera/camera.module#CameraPageModule' },
  { 
    path: 'manual',
    loadChildren: './manual-input/manual-input.module#ManualInputPageModule'
  },
  { 
    path: 'choose-input', 
    loadChildren: './choose-input/choose-input.module#ChooseInputPageModule' 
  },
  { path: 'info-page', loadChildren: './info-page/info-page.module#InfoPagePageModule' },
  { path: 'info-page/:preName', loadChildren: './info-page/info-page.module#InfoPagePageModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
