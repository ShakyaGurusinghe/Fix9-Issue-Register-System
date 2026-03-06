import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Signin } from './components/signin/signin';
import { Signup } from './components/signup/signup';
import { Profile } from './components/profile/profile';
import { Projects } from './components/projects/projects';
import { ProjectForm } from './components/project-form/project-form';
import { ProjectDetail } from './project-detail/project-detail';
import { Issues } from './components/issues/issues';
import { IssueForm } from './components/issue-form/issue-form';
import { IssueDetail } from './components/issue-detail/issue-detail';

export const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },
    {
        path: '',
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'profile', component: Profile },
            { path: 'projects', component: Projects },
            { path: 'projects/new', component: ProjectForm },
            { path: 'projects/edit/:id', component: ProjectForm },
            { path: 'projects/:id', component: ProjectDetail },
            { path: 'issues', component: Issues },
            { path: 'issues/new', component: IssueForm },
            { path: 'issues/edit/:id', component: IssueForm },
            { path: 'issues/:id', component: IssueDetail },
        ],
    },
];
