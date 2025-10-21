# HelloDoggo
**WORK IN PROGRESS**

**FRENCH**
Développement d'une plateforme d'adoption de chiens à destination de refuges. 

- Affichage des chiens disponibles à l'adoption sous forme de cartes avec photo, nom, race, sexe et description. 

- Création de compte et système d'authentification avec token encrypté envoyé par le backend. 

- Role-based permissions : admin, editor, user : 

-- Les profils editor et admin peuvent créer, modifier et supprimer des chiens. 
-- Le profil admin peut avoir accès aux informations des autres utilisateurs et modifier leur rôle pour leur accorder plus de permissions. 
-- Tous les profils peuvent consulter et modifier leurs propres informations. Ils peuvent également supprimer leur propre compte.

-- Pour naviguer dans l'application avec les divers profils: 
--- s'authentifier avec admin@hellodoggo.com pour avoir le role admin 
--- s'authentifier avec volunteer@doggorescue.com pour avoir le role editor 
--- s'authentifier avec user@email.com ou créer un nouveau compte pour avoir le role user 
---- Le mot de passe pour les trois comptes est Passw0rd!

Pour le backend, développé en NestJS, voir `https://github.com/Calliophis/HelloDoggo-backend`

**ENGLISH**
Development of a dog adoption platform for animal shelters.

- Display of adoptable dogs as cards showing a photo, name, breed, sex, and description.

- Account creation and authentication system with an encrypted token sent by the backend.

- Role-based permissions: admin, editor, user:

-- Editor and Admin profiles can create, edit, and delete dogs.
-- The Admin profile can access other users’ information and modify their roles to grant additional permissions.
-- All profiles can view and update their own information, and also delete their own account.

-- To navigate the app with different profiles:
--- log in with admin@hellodoggo.com to access the Admin role
--- log in with volunteer@doggorescue.com to access the Editor role
--- log in with user@email.com or create a new account to access the User role
---- The password for all accounts is Passw0rd!

For the backend, developed in NestJS, see `https://github.com/Calliophis/HelloDoggo-backend`

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
