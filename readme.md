![Saucecode](https://saucecode.tech/images/own/Logo.png =250x)

# Saucecode Developer Challenge

Welcome the the Saucecode developer challenge, 
prepared for the senior candidate with 
extensive exposure to the fast churn Node / npm eco-system.

This challenge is not only aimed at being an evaluation of the 
candidate, but also a small showcase of the type of platform we use
internally for candidates to evaluate and determine if it interests them.

## Challenge submission process

- Fork this repo.

- Complete the challenges below as best you can.

- Submit a pull request for your complete challenges with 
a brief summary of the changes and / or issues faced.

## Submission evaluation

As any seasoned developer knows, you spend more time reading code than writing it, so we have
structured this challenge to include both code comprehension as well as writing abilities.

Challenge submissions will be evaluating a candidates ability to:

- Investigate to grok and hack under-the-hood dependencies without necessarily 
needing to be an export on them

- Comprehend provided existing work enough to be able to complete challenges by
 replicate and extend using the libs provided

- Ability to solve problems with provided libs in a functional style

- Write working code promoting readability, composability and re-usablity

## Project induction

This section aims to introduce under-the-hood dependencies, 
the project's structure policy and conventions with supporting libs 
as well as demonstrate the implementation of these libs with 
the shipped core features.

### Project structure concepts

When one spends enough time developing and shipping products on the Node / npm ecosystem, it's
difficult not to notice the volumes of duplicate libs available solving elements of a solutions 
architecture in a generic way.

For example, when solving an applications presentation you are faced with an overwhelming number
of choices in view and state management libraries, essentially doing the same thing.
Whether you choose React, Vue, Angular or something esoteric, all these libs solve the same problem
in relatively similar ways.
The same can said for state management and Api libs.

Despite these libs being the modern marvels of technological progress, we've found that there is 
a gap in productivity and cohesion.
Wiring all your favorite libs, packages, lazers and light-sabres together introduces a lot of moving
parts, boiler-plating and inconsistency in developer implementation of said libs and light-sabres.

We've worked extensively on creating a standard, cross platform interface and supporting policies 
to the most common solution problems in a manner that makes solution features immediately re-usable with a 
reasonable amount of dynamism.
This interface also serves as a light abstraction on top of best-in-breed libs of various flavors, 
which allows libs to churn below without affecting implementation code while providing a level of 
cohesion.
This way, you may not always get to choose your favorite view lib, but the experience will be 
familiar regardless.

Arguably one of the most time consuming aspects of modern Node / JavaScript development is the
complexity of setting up a build tool-chain and core features.

We don't want candidates to waste time engineering webpack configs for colonizing Mars, and so 
project contains stripped-down and simplified versions of our internal implementation libs 
and core features with a simple build tool-chain.

Internally our libs are housed in a [Lerna](https://github.com/lerna/lerna) mono-repo and 
published as private packages on our internal [Verdaccio](https://github.com/verdaccio/verdaccio) server for easy consumption and maintenance.

### Dependencies

Auditioning packages from npm and github, where quality and churn are always are concerns, is such a time consuming and dedicated effort its practically
a life style. 

This project's libs implement the following battled tested dependencies:

#### Dev

- [Neutrinojs](https://neutrino.js.org/)
- [Node Preset](https://neutrinojs.org/packages/node/)
- [React Preset](https://neutrinojs.org/packages/react/)
    
#### Common Tools

- [Ramda](https://ramdajs.com/docs/)
- [Common Tags](https://github.com/declandewet/common-tags  )
- [Change Case](https://github.com/blakeembrey/change-case)
- [Globrex](https://github.com/terkelg/globrex)

#### Server

- [Feathersjs](https://docs.feathersjs.com/)
- [Sequelize](http://docs.sequelizejs.com/)

#### Web

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Redux-logic](https://github.com/jeffbski/redux-logic)
- [Redux-first-router](https://github.com/faceyspacey/redux-first-router)
- [Redux-toolbelt](https://github.com/welldone-software/redux-toolbelt)
- [Bootstrap 4](http://getbootstrap.com/docs/4.1/getting-started/introduction/)
- [Reactstrap](https://reactstrap.github.io/)
- [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form)
- [cxs](https://github.com/cxs-css/cxs)
- [Feathersjs Client](https://docs.feathersjs.com/api/client.html)
- [Localforage](https://github.com/localForage/localForage)
- [Line awesome icons with FA compat](https://icons8.com/line-awesome)

### Conventions

Applications are made up of features and features are made up of parts.

With this in mind, project structures can distilled down to the following:

 - app
   - features
        - parts
            - tasks
            - elements

Which translates into the following general platform folders:

 - server
     - features
        - api boxes
            - models
            - services
            - events
            - hooks
            
 - web / mobile / desktop
    - features
        - state
            - state boxes
                - mutations
                - routes
                - guards
                - effects
                - events
            - tasks
        - ui
            - components
            - tasks

The conventions above are implemented in the libs described below.
                
### Libs

#### task

Task is a collection of common tools provided as a higher order function.
Providing a single HOF allows flexibility in common tools without extra imports
and facilitates refactoring.

Signature:
```
function task (factory: (syncTools:object, asyncTools:object) => any) => any 
```
Example:
```javascript
import { task } from './libs'

const filterSomething = task(
  t => list => t.filter(item => t.eq(item.name, 'something'), list)
)

```

#### api-box

Light wrapper over Feathers js with Sequelize baked in.
For the purposes of this challenge, the server is already implemented,
so we'll just cover creating an api-box

Signature:
```
function createApiBox({
    models: (createModel) => [],
    services: (createService, models, hooks) => [],
    channels: (app) => void
    lifecycle: {
        beforeConfig(app) => void,
        authConfig(app) => void,
        afterConfig(app) => void,
        onSetup(app) => void,
        onStart(app) => void,
    
}) => ApiBox
```
Reviewing the included core server implementations and the lib code 
itself will reveal the inner workings of this top level signature

#### feature-box

Utility for declaring and composing features on both the web and server.

Signature:
```
function createFeature(factory: (nextProps) => FeatureDefinition, defaultProps?: object) => Feature
```

Reviewing the included core server and web implementations as well as the 
platform's lib code itself will reveal the inner workings of this top level signature

#### state-box

A declarative interface over redux, redux-toolbelt and redux logic to avoid unnecessary boilerplate
and enforce a consistent and predictable functional state management style of:
```
guard(s) - allow/reject-> mutation(s) -> side effect(s) -> mutation(s)
```

The fundamental building block for an application's state management.
State box takes the following props:
```
{
name: string,
initial: any,
mutations: mutation => [ mutation(...) ],
guards: (guard, { actions, mutations }) => [ guard(...) ]
effects: (fx, { actions, mutations }) => [ guard(...) ]
onInit: ({ dispatch, getState, actions, mutations, ...ctx }) => void
}
```

MUTATIONS:

Mutations of state are defined as the combination of action types and reducers,
invoked by the generated action creator
A mutation is created with the mutation function:
```
mutation(actionTypes: string | string[], reducer: (state, action)=> nextState) {}
```
which returns the following for composing into the consuming statebox:
```
{ mutations: [f()], actions:[''], reducer(){} }
```

EFFECTS / GUARDS:

A light weight wrapper over the most excellent [redux-logic](https://github.com/jeffbski/redux-logic)
implemented with simpler semantics and sensible defaults:
```
guard -> validate
effect -> process
```

STATE STORE:

A light weight wrapper over redux's createStore with the
ability to combine and extend further.
State Store takes the following props:
```
{
boxes: [ stateBox(...) ],
context: { ... },
reducers: { ... },
middleware: [ ... ],
enhance: (appliedMiddleware) => [ ... ]
initial: { ... }
}
```

ROUTING:

Routing is implemented with the most excellent [redux-first-router](https://github.com/faceyspacey/redux-first-router)
State Box and Store will be extended to implement routing.

Review the included core web implementations for usage examples.

#### schemas

Internally we use Mozilla's React Json schema form extensively and have
created libs to assist in declaring form, nav and view schemas.

Review the included core web implementations for usage examples.

## Getting Started

Prerequisites:

- [Node > 8.9.0](https://nodejs.org/en/download/)
- [Yarn > 1.5.0](https://yarnpkg.com/)
- Mysql or Postgres DB servers and GUIs
- (Optional) access to an SMTP server or Mailgun account

To setup, clone this repo and cd into both the server and web folders
and run:

```
yarn install
```

You will need to create an empty Mysql or Postgres DB and enter the 
connection string in either the ```mysql``` or ```postgres``` keys of 
the default server config file located at ```/server/config/default.json```

While entering DB connection details, you can optionally enter 
SMTP or Mailgun details too.

Once installed and configured, it is recommended to open 
2 terminal windows cd'd into the server and web folders respectively.
From there run:

```
yarn start

```
This starts the Neutrino builds and outputs the addresses of respective 
running servers.

## The Challenge

This project ships with the following core features:

#### Server

 - account
 - mail

#### Web

 - account
 - layout
 - landing
 
The challenge is to review and comprehend the supplied features and libraries.

Then using the provided libs and dependencies complete the server and web
chat features that have been minimally setup already.

The chat feature must be a simple lobby style chat where all registered users 
are able to chat in a single room with any other online registered members.

All registered users are visible as a panel of avatars either across the top of left.
These user avatars must display the users first name and their online / offline 
status.
Updating the online / offline user status has already been implemented.

The chat panel must display chat messages from the past day by default when the 
page loads and then continually update using the Feathers API socket events, hooked up 
in the chat's state-box 'onInit' method.

The chat panel must display logged in user messages aligned to the right
while all other user's messages are aligned left.
All messages must display a timestamp and the senders first name.

The message form must disable when submitting a message to the server 
and a sign of loading must be communicated to the user.

The chat feature Api box, all it's models, services and hooks are 
at your discretion however all end points must require authentication.

Following the chat app guide in the Feathers js docs will give you a good idea 
of how to tackle this features.

Bonus points are awarded for mobile responsive design efforts and adding a mobile
menu button to the layout feature that toggle the primary app navigation, however this 
is not a requirement.

Estimated completion time is from 4 - 8 hours depending on familiarity with under-the-hood libs.

All the best.

## Issues

Should you encounter any issues or have any questions regarding the challenge, please feel free
to open an issue.
