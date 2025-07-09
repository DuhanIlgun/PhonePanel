import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./pages/dashboard/dashboard.component')
    //       .then(m => m.DashboardComponent)} // ✅ Standalone component böyle yüklenir
    {path:'dashboard',
      loadComponent:()=>
        import('./layout/dashboard-layout/dashboard-layout.component')
       .then(m => m.DashboardLayoutComponent),
      children: [
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full'
        },
        {
          path: 'home',
          loadComponent: () =>
            import('./pages/home/home.component').then(m => m.HomeComponent)
        },
        {
          path:'sales',
          loadComponent:()=>
            import('./pages/sales/sales.component').then(m=>m.SalesComponent)
        },
         {
          path:'expenses',
          loadComponent:()=>
            import('./pages/expenses/expenses.component').then(m=> m.ExpensesComponent)
        },
        {
          path:'income',
          loadComponent:()=>
            import('./pages/income/income.component').then(m=> m.IncomeComponent)
        },
        {
          path:'accessories',
          loadComponent:()=>
            import('./pages/accessories/accessories.component').then(m=> m.AccessoriesComponent)
        },
        {
          path:'inventory',
          loadComponent:()=>
            import('./pages/inventory/inventory.component').then(m=> m.InventoryComponent)
        },
        {
          path:'notes',
          loadComponent:()=>
            import('./pages/notes/notes.component').then(m=> m.NotesComponent)
        },
        {
          path:'settings',
          loadComponent:()=>
            import('./pages/settings/settings.component').then(m=> m.SettingsComponent)
        },
        {
          path:'expenses-detail',
          loadComponent:()=>
            import('./pages/expenses/expenses-detail.component').then(m=> m.ExpensesDetailComponent)
        },
        {
          path:'sales-detail',
          loadComponent:()=>
            import('./pages/sales/sales-detail.component').then(m=> m.SalesDetailComponent)
        },
        {
          path:'inventory-detail',
          loadComponent:()=>
            import('./pages/inventory/inventory-detail.component').then(m=> m.InventoryDetailComponent)
        },
        {
          path:'income-detail',
          loadComponent:()=>
            import('./pages/income/income-detail.component').then(m=> m.IncomeDetailComponent)
        },
        {
          path:'accessories-detail',
          loadComponent:()=>
            import('./pages/accessories/accessories-detail.component').then(m=> m.AccessoriesDetailComponent)
        },
        {
          path:'notes-detail',
          loadComponent:()=>
            import('./pages/notes/notes-detail.component').then(m=> m.NotesDetailComponent)
        },
        {
          path:'settings-detail',
          loadComponent:()=>
            import('./pages/settings/settings-detail.component').then(m=> m.SettingsDetailComponent)
        }
      ]
    }
];
