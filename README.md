# lunch & learn

Live demo: [https://lunchandlearn.app](https://lunchandlearn.app)

This repository contains a sample VueJS app written entirely in TypeScript. It uses [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) and [vuex-class](https://github.com/ktsn/vuex-class) decorators along w/ ES 2016 style class syntax for easier digestion by Angular developers.

## Technologies

### Backend

It uses [Cloud Firestore](https://firebase.google.com/docs/firestore/) for serverless backend providing a flexible, scablable NoSQL cloud database to store and sync data for mobile, web and server development through the Google Cloud Platform.

It also uses Firebase for user authentication, hosting and [Cloud Functions](https://firebase.google.com/docs/functions/) to secure sensitive code and provide immediate scalability.

### Frontend

This project uses [Vuetify](https://vuetifyjs.com/en/) and Stylus for CSS. Vuetify is a set of components based on CSS Flexbox and offers a world class set of reusable components.

## TODO

- [x] feat: calendar view
- [x] feat: timeline view
- [x] feat: filter by tag
- [ ] feat: export to external calendar
- [ ] feat: ability to comment on a topic
- [ ] tech: move "like" to Firebase cloud function
- [ ] tech: get automatic deploy working
- [ ] tech: add unit tests w/ Jest
- [ ] tech: add integration tests w/ Cypress

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

=======
