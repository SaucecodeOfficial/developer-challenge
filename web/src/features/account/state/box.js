import {
  task,
  createStateBox,
} from '../../../libs'

// ctx
import {
  VIEW_STATUS,
  ACCOUNT_STATUS,
  VIEWS,
  PATHS,
} from '../ctx'

// state
import {
  makeReduceFormRoute,
  reduceForm,
  reduceFormSuccess,
  reduceFormFail,
  statusIsBusy,
} from './tasks'
import {
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  confirmResetPasswordSchema,
} from './schemas'

// exports
export const accountState = ({
  homeRouteAction,
  content: { VIEW_CONTENT },
}) => createStateBox({
  name: 'account',
  initial: {
    status: ACCOUNT_STATUS.INIT,
    user: null,
    error: null,
    redirectBackTo: null,
    hash: null,
    view: {
      key: null,
      status: VIEW_STATUS.INIT,
    },
    form: {
      ui: {
        schema: null,
        uiSchema: null,
      },
      data: null,
    },
  },
  mutations(m) {
    return [
      // authentication and authorization
      m([ 'ROUTE_NOT_AUTHORIZED' ], task(
        t => (state, action) => {
          const redirectBackTo = t.path(
            PATHS.ACTION_REDIRECT,
            action,
          )
          return t.merge(state, {
            view: {
              key: VIEWS.NOT_AUTHORIZED,
              status: VIEW_STATUS.READY,
              error: null,
            },
            form: null,
            redirectBackTo: t.not(redirectBackTo)
              ? null
              : redirectBackTo,
          })
        },
      )),
      m([ 'AUTHENTICATE' ], task(
        t => (state) => {
          return t.merge(state, {
            status: ACCOUNT_STATUS.AUTH_LOADING,
            error: null,
            view: t.not(state.view)
              ? state.view
              : t.merge(state.view, {
                status: VIEW_STATUS.WAITING,
              }),
          })
        },
      )),
      m([ 'AUTHENTICATE_SUCCESS' ], task(
        t => (state, action) => {
          return t.merge(state, {
            error: null,
            status: ACCOUNT_STATUS.AUTH_SUCCESS,
            user: t.path(PATHS.ACTION_USER, action),
            view: t.not(state.view)
              ? state.view
              : t.eq(VIEW_STATUS.WAITING, state.view.status)
                ? t.merge(state.view, {
                  status: VIEW_STATUS.READY,
                })
                : state.view,
          })
        },
      )),
      m([ 'AUTHENTICATE_FAIL' ], task(
        t => (state, action) => {
          return t.merge(state, {
            error: t.path(PATHS.ACTION_ERROR, action),
            status: ACCOUNT_STATUS.AUTH_FAIL,
            user: null,
            view: t.not(state.view)
              ? state.view
              : t.eq(VIEW_STATUS.WAITING, state.view.status)
                ? t.merge(state.view, {
                  status: VIEW_STATUS.READY,
                })
                : state.view,
          })
        },
      )),
      m([ 'SIGN_OUT' ], task(
        t => (state) => {
          return t.merge(state, {
            status: ACCOUNT_STATUS.AUTH_FAIL,
            error: null,
            redirectBackTo: null,
            hash: null,
            view: null,
            form: null,
          })
        },
      )),
      m([ 'SIGN_OUT_COMPLETE' ], task(
        t => (state) => {
          return t.merge(state, {
            user: null,
          })
        },
      )),
      // sign in
      m([ 'ROUTE_SIGN_IN' ], task(
        t => (state, action) => {
          const busy = statusIsBusy({
            status: state.status,
          })
          return makeReduceFormRoute({
            view: VIEWS.SIGN_IN,
            ui: signInSchema({
              disabled: false,
            }),
            status: busy
              ? VIEW_STATUS.WAITING
              : VIEW_STATUS.READY,
          })(state, action)
        },
      )),
      m([ 'SIGN_IN' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          const redirectBackTo = t.path(PATHS.ACTION_REDIRECT, action)
          return t.merge(nextState, {
            status: ACCOUNT_STATUS.AUTH_LOADING,
            error: null,
            redirectBackTo: !redirectBackTo
              ? null
              : redirectBackTo,
            form: t.merge(nextState.form, {
              ui: signInSchema({
                disabled: true,
              }),
            }),
          })
        },
      )),
      m([ 'SIGN_IN_SUCCESS' ], task(
        t => (state, action) => {
          const nextState = reduceFormSuccess(state, action)
          return t.merge(nextState, {
            status: ACCOUNT_STATUS.AUTH_SUCCESS,
            user: t.path(PATHS.ACTION_USER, action),
            error: null,
            form: t.merge(nextState.form, {
              ui: signInSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      m([ 'SIGN_IN_FAIL' ], task(
        t => (state, action) => {
          const nextState = reduceFormFail(state, action)
          return t.merge(nextState, {
            status: ACCOUNT_STATUS.AUTH_FAIL,
            error: t.path(PATHS.ACTION_ERROR, action),
            form: t.merge(nextState.form, {
              ui: signInSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      // sign up
      m([ 'ROUTE_SIGN_UP' ], task(
        t => (state, action) => {
          const busy = statusIsBusy({
            status: state.status,
          })
          return makeReduceFormRoute({
            view: VIEWS.SIGN_UP,
            ui: signUpSchema({
              disabled: false,
            }),
            status: busy
              ? VIEW_STATUS.WAITING
              : VIEW_STATUS.READY,
          })(state, action)
        },
      )),
      m([ 'SIGN_UP' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: signUpSchema({
                disabled: true,
              }),
            }),
          })
        },
      )),
      m([ 'SIGN_UP_SUCCESS' ], task(
        t => (state, action) => {
          const nextState = reduceFormSuccess(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: signUpSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      m([ 'SIGN_UP_FAIL' ], task(
        t => (state, action) => {
          const nextState = reduceFormFail(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: signUpSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      // reset password
      m([ 'ROUTE_RESET_PASSWORD' ], task(
        t => (state, action) => makeReduceFormRoute({
          view: VIEWS.RESET_PASSWORD,
          ui: resetPasswordSchema({
            disabled: t.eq(
              ACCOUNT_STATUS.AUTH_LOADING,
              state.status,
            ),
          }),
        })(state, action),
      )),
      m([ 'RESET_PASSWORD' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: resetPasswordSchema({
                disabled: true,
              }),
            }),
          })
        },
      )),
      m([ 'RESET_PASSWORD_SUCCESS' ], task(
        t => (state, action) => {
          const nextState = reduceFormSuccess(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: resetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      m([ 'RESET_PASSWORD_FAIL' ], task(
        t => (state, action) => {
          const nextState = reduceFormFail(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: resetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        },
      )),
      // account management
      m([ 'ROUTE_ACCOUNT_MANAGEMENT' ], task(
        t => (state, action) => {
          const accountAction = t.path([
            'payload',
            'action',
          ], action) || 'verify'
          return t.merge(state, {
            form: !t.eq(VIEWS.VERIFY, accountAction)
              ? null
              : {
                ui: confirmResetPasswordSchema({ disabled: false }),
                data: {},
              },
            view: {
              key: accountAction,
              status: t.eq(
                VIEWS.RESET_PASSWORD_CONFIRM,
                accountAction,
              )
                ? VIEW_STATUS.READY
                : VIEW_STATUS.LOADING,
              error: null,
              message: null,
            },
            hash: t.path([
              'payload',
              'hash',
            ], action) || null,
          })
        },
      )),
      m([ 'VERIFY_SUCCESS' ], task(
        t => (state, action) => {
          return t.merge(state, {
            view: t.merge(state.view, {
              status: VIEW_STATUS.SUCCESS,
              error: null,
              message: null,
            }),
          })
        },
      )),
      m([ 'VERIFY_FAIL' ], task(
        t => (state, action) => {
          return t.merge(state, {
            view: t.merge(state.view, {
              status: VIEW_STATUS.FAIL,
              error: t.path(PATHS.ACTION_ERROR, action),
              message: t.path(PATHS.ACTION_MESSAGE, action),
            }),
          })
        },
      )),
      m([ 'RESET_PASSWORD_CONFIRM' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: true,
              }),
            }),
          })
        }),
      ),
      m([ 'RESET_PASSWORD_CONFIRM_SUCCESS' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        }),
      ),
      m([ 'RESET_PASSWORD_CONFIRM_FAIL' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        }),
      ),
      m([ 'CHANGE_IDENTITY' ], task(
        t => (state, action) => {
          const nextState = reduceForm(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: true,
              }),
            }),
          })
        }),
      ),
      m([ 'CHANGE_IDENTITY_SUCCESS' ], task(
        t => (state, action) => {
          const nextState = reduceFormSuccess(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        }),
      ),
      m([ 'CHANGE_IDENTITY_FAIL' ], task(
        t => (state, action) => {
          const nextState = reduceFormFail(state, action)
          return t.merge(nextState, {
            form: t.merge(nextState.form, {
              ui: confirmResetPasswordSchema({
                disabled: false,
              }),
            }),
          })
        }),
      ),
    ]
  },
  routes(r, actions) {
    return [
      r(actions.routeNotAuthorized, '/401'),
      r(actions.routeResetPassword, '/account/reset-password'),
      r(actions.routeSignIn, '/account/login'),
      r(actions.routeSignUp, '/account/register'),
      r(actions.routeAccountManagement, '/account/manage/:action/:hash'),
    ]
  },
  guards(g, box) {
    return [
      task(
        t => g(
          [ t.globrex('*ROUTE_*').regex ],
          async ({
            getState,
            action,
            redirect,
          }, allow, reject) => {
            // location:
            const state = getState()
            const routesMap = t.path(PATHS.LOCATION_ROUTE_MAP, state)
            const routeMeta = t.path(PATHS.ACTION_LOCATION, action)
            // skip if location invalid
            if (t.or(
                t.not(routesMap),
                t.not(routeMeta),
              )) {
              allow(action)
            }
            else {
              // route:
              const route = t.path([ action.type ], routesMap)
              // skip if route invalid
              if (t.not(route)) {
                allow(action)
              }
              else if (t.and(
                  t.not(route.authenticate),
                  t.not(route.restrictToRoles),
                )) {
                // skip if route is public
                allow(action)
              }
              else {
                // account:
                const accountStatus = t.path(PATHS.ACCOUNT_STATUS, state)
                const user = t.path(PATHS.ACCOUNT_USER, state)
                // authenticated
                const authenticated = t.and(
                  user,
                  t.eq(
                    ACCOUNT_STATUS.AUTH_SUCCESS,
                    accountStatus,
                  ),
                )
                // skip if route only requires authentication
                // + account is valid
                if (t.and(
                    t.not(route.restrictToRoles),
                    authenticated,
                  )) {
                  allow(action)
                }
                else if (t.not(authenticated)) {
                  // reject invalid account -> redirect to login
                  reject(
                    redirect(
                      box
                        .mutations
                        .routeSignIn({
                          redirectBackTo: t.omit([ 'meta' ], action),
                        }),
                    ),
                  )
                }
                else {
                  // roles:
                  const restrictToRoles = t.eq(
                    'Array',
                    t.type(route.restrictToRoles),
                  )
                    ? route.restrictToRoles
                    : [ route.restrictToRoles ]
                  const hasRole = t.gt(
                    t.findIndex(
                      role => t.eq(role, user.role),
                      restrictToRoles,
                    ),
                    -1,
                  )
                  // skip if user in routes declared roles
                  if (hasRole) {
                    allow(action)
                  }
                  else {
                    // reject invalid role -> redirect 401
                    reject(
                      redirect(
                        box
                          .mutations
                          .routeNotAuthorized({
                            redirectBackTo: t.omit([ 'meta' ], action),
                          }),
                      ),
                    )
                  }
                }
              }
            }
          },
        ),
      ),
      g([
        box.actions.routeSignIn,
        box.actions.routeSignUp,
        box.actions.routeResetPassword,
      ], task(
        t => async ({ getState, action, redirect }, allow, reject) => {
          const state = getState()
          const status = t.path(PATHS.ACCOUNT_STATUS, state)
          const user = t.path(PATHS.ACCOUNT_USER, state)
          if (user
            && t.eq(ACCOUNT_STATUS.AUTH_SUCCESS, status)) {
            reject(
              redirect({
                type: homeRouteAction,
                payload: {},
              }),
            )
          }
          else {
            allow(action)
          }
        },
      )),
    ]
  },
  effects(fx, box) {
    return [
      // authentication
      fx([ box.actions.authenticate ], task(
        (t, a) => async ({ api, getState, redirect }, dispatch, done) => {
          // check stored sign-in
          const [ error, result ] = await a.of(api.authenticate())
          // auth failed
          if (error) {
            dispatch(
              box
                .mutations
                .authenticateFail({ error }),
            )
            // dispatch(registerAccountNav('public', VIEW_CONTENT))
            done()
          }
          else {
            // auth succeeded -> verify token
            const token = t.path(PATHS.ACCESS_TOKEN, result)
            // token failed
            if (t.not(token)) {
              dispatch(
                box
                  .mutations
                  .authenticateFail({
                    error: new Error('Access Token not found'),
                  }),
              )
              // dispatch(registerAccountNav('public', VIEW_CONTENT))
              done()
            }
            else {
              // verify user by token
              const [ verifyError, verifyResult ] = await a.of(
                api
                  .passport
                  .verifyJWT(token),
              )
              // verify failed
              if (verifyError) {
                dispatch(
                  box
                    .mutations
                    .authenticateFail({
                      error: verifyError,
                    }),
                )
                // dispatch(registerAccountNav('public', VIEW_CONTENT))
                done()
              }
              else {
                // verify succeeded -> get user
                const [ userError, user ] = await a.of(
                  api
                    .service('users')
                    .get(verifyResult.userId),
                )
                // get user failed
                if (userError) {
                  dispatch(
                    box
                      .mutations
                      .authenticateFail({
                        error: userError,
                      }),
                  )
                  // dispatch(registerAccountNav('public', VIEW_CONTENT))
                  done()
                }
                else {
                  // get user success
                  dispatch(
                    box
                      .mutations
                      .authenticateSuccess({ user }),
                  )
                  // dispatch(registerAccountNav('private', VIEW_CONTENT))
                  const state = getState()
                  if (state.account.redirectBackTo) {
                    dispatch(
                      redirect(state.account.redirectBackTo),
                    )
                    done()
                  }
                  else {
                    dispatch(
                      redirect({
                        type: homeRouteAction,
                        payload: {},
                      }),
                    )
                    done()
                  }
                }
              }
            }
          }
        },
      )),
      fx([ box.actions.signOut ], task(
        (t, a) => async ({ api, getState, redirect }, dispatch, done) => {
          const state = getState()
          if (state.account.user) {
            const [ error ] = await a.of(
              api
                .service('users')
                .patch(state.account.user.id, { status: 'offline' }),
            )
            if (error) {
              console.log('ERROR PATCHING USER STATUS', error)
            }
            api.logout()
            dispatch(box.mutations.signOutComplete({}))
            dispatch(
              redirect(
                box
                  .mutations
                  .routeSignIn({}),
              ),
            )
            done()
          }
          else {
            api.logout()
            dispatch(
              redirect(
                box
                  .mutations
                  .routeSignIn({}),
              ),
            )
            done()
          }
        },
      )),
      // sign in
      fx([ box.actions.signIn ], task(
        (t, a) => async ({ getState, api, redirect }, dispatch, done) => {
          // form:
          const state = getState()
          const signInData = t.path(PATHS.ACCOUNT_FORM_DATA, state)
          // authenticate
          const [ error, result ] = await a.of(
            api
              .authenticate(
                t.mergeAll([
                  { strategy: 'local' },
                  signInData,
                ]),
              ),
          )
          // auth failed
          if (error) {
            dispatch(
              box
                .mutations
                .signInFail({
                  error,
                  message: VIEW_CONTENT.SIGN_IN_FAIL.MESSAGES,
                }),
            )
            done()
          }
          else {
            // auth succeeded -> verify token
            const token = t.path(PATHS.ACCESS_TOKEN, result)
            // token failed
            if (!token) {
              dispatch(
                box
                  .mutations
                  .signInFail({
                    error: new Error('Access Token not found'),
                    message: VIEW_CONTENT.SIGN_IN_FAIL.MESSAGES,
                  }),
              )
              done()
            }
            else {
              // verify user by token
              const [ verifyError, verifyResult ] = await a.of(
                api
                  .passport
                  .verifyJWT(token),
              )
              // verify failed
              if (verifyError) {
                dispatch(
                  box
                    .mutations
                    .signInFail({
                      error: verifyError,
                      message: VIEW_CONTENT.SIGN_IN_FAIL.MESSAGES,
                    }),
                )
                done()
              }
              else {
                // verify succeeded -> get user
                const [ userError, user ] = await a.of(
                  api
                    .service('users')
                    .get(verifyResult.userId),
                )
                // get user failed
                if (userError) {
                  dispatch(
                    box
                      .mutations
                      .signInFail({
                        error: userError,
                        message: VIEW_CONTENT.SIGN_IN_FAIL.MESSAGES,
                      }),
                  )
                  done()
                }
                else {
                  // get user success
                  dispatch(
                    box
                      .mutations
                      .signInSuccess({ user }),
                  )
                  // dispatch(updateAccountNav('private', VIEW_CONTENT))
                  // NOTE: redirect back or to home
                  if (state.account.redirectBackTo) {
                    dispatch(
                      redirect(state.account.redirectBackTo),
                    )
                    done()
                  }
                  else {
                    dispatch(
                      redirect({
                        type: homeRouteAction,
                        payload: {},
                      }),
                    )
                    done()
                  }
                }
              }
            }
          }
        },
      )),
      // sign up
      fx([ box.actions.signUp ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          const signUpData = t.path(PATHS.ACCOUNT_FORM_DATA, state)

          const [ checkError ] = await a.of(
            api
              .service('auth-management')
              .create({
                action: 'checkUnique',
                value: {
                  email: signUpData.email,
                },
              }),
          )
          if (checkError) {
            dispatch(
              box
                .mutations
                .signUpFail({
                  error: checkError,
                  message: VIEW_CONTENT.SIGN_UP_CHECK_FAIL.MESSAGES,
                }),
            )
            done()
          }
          else {
            const [ userError, userResult ] = await a.of(
              api
                .service('users')
                .create(
                  t.mergeAll([
                    signUpData,
                    {
                      role: 'user',
                      status: 'offline',
                    },
                  ]),
                ),
            )
            if (userError) {
              dispatch(
                box
                  .mutations
                  .signUpFail({
                    error: userError,
                    message: VIEW_CONTENT.SIGN_UP_FAIL.MESSAGES,
                  }),
              )
              done()
            }
            else {
              dispatch(
                box
                  .mutations
                  .signUpSuccess({
                    result: userResult,
                  }),
              )
              done()
            }
          }
        },
      )),
      // reset password
      fx([ box.actions.resetPassword ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          const resetData = t.path(PATHS.ACCOUNT_FORM_DATA, state)
          const [ error, result ] = await a.of(
            api
              .service('auth-management')
              .create({
                action: 'sendResetPwd',
                value: { email: resetData.email },
              }),
          )
          if (error) {
            dispatch(
              box
                .mutations
                .resetPasswordFail({
                  error,
                  message: VIEW_CONTENT.RESET_PASSWORD_FAIL.MESSAGES,
                }),
            )
            done()
          }
          else {
            dispatch(
              box
                .mutations
                .resetPasswordSuccess({
                  result: result,
                }),
            )
            done()
          }
        },
      )),
      // account management
      fx([ box.actions.routeAccountManagement ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          const view = t.path(PATHS.ACCOUNT_VIEW, state)
          const hash = t.path(PATHS.ACCOUNT_HASH, state)
          if (!hash) {
            done()
          }
          else if (!t.eq(VIEWS.VERIFY, view.key)) {
            done()
          }
          else {
            // TODO: logout current user?
            const [ verifyError, verifiedUser ] = await a.of(
              api
                .service('auth-management')
                .create({
                  action: 'verifySignupLong',
                  value: hash,
                }),
            )
            if (verifyError) {
              dispatch(
                box
                  .mutations
                  .verifyFail({
                    error: verifyError,
                    message: VIEW_CONTENT.VERIFY_FAIL.MESSAGES,
                  }),
              )
              done()
            }
            else {
              dispatch(
                box
                  .mutations
                  .verifySuccess({
                    result: verifiedUser,
                  }),
              )
              done()
            }
          }
        },
      )),
      fx([ box.actions.resetPasswordConfirm ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          const hash = t.path(PATHS.ACCOUNT_HASH, state)
          if (!hash) {
            done()
          }
          const resetData = t.path(PATHS.ACCOUNT_FORM_DATA, state)
          const [ resetError, resetResult ] = await a.of(
            api
              .service('auth-management')
              .create({
                action: 'resetPwdLong',
                value: {
                  token: hash,
                  password: resetData.password,
                },
              }),
          )
          if (resetError) {
            dispatch(
              box
                .mutations
                .resetPasswordConfirmFail({
                  error: resetError,
                  message: VIEW_CONTENT.RESET_FAIL.MESSAGES,
                }),
            )
            done()
          }
          else {
            dispatch(
              box
                .mutations
                .resetPasswordConfirmSuccess({
                  result: resetResult,
                }),
            )
            done()
          }
        },
      )),
      fx([ box.actions.changeIdentity ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          const hash = t.path(PATHS.ACCOUNT_HASH, state)
          if (!hash) {
            done()
          }
          const formData = t.path(PATHS.ACCOUNT_FORM_DATA, state)
          const [ changeError, changeResult ] = await a.of(
            api
              .service('auth-management')
              .create({
                action: 'identityChange',
                value: {
                  token: hash,
                  password: formData.password,
                  changes: {
                    email: formData.email,
                  },
                },
              }),
          )
          if (changeError) {
            dispatch(
              box
                .mutations
                .changeIdentityFail({
                  error: changeError,
                  message: VIEW_CONTENT.RESET_FAIL.MESSAGES,
                }),
            )
            done()
          }
          else {
            dispatch(
              box
                .mutations
                .changeIdentitySuccess({
                  result: changeResult,
                }),
            )
            done()
          }
        },
      )),
      fx([ box.actions.authenticateSuccess, box.actions.signInSuccess ], task(
        (t, a) => async ({ getState, api }, dispatch, done) => {
          const state = getState()
          if (t.not(state.account.user)) {
            done()
          }
          else {
            const [ error ] = await a.of(
              api
                .service('users')
                .patch(state.account.user.id, { status: 'online' }),
            )
            if (error) {
              console.log('ERROR PATCHING USER STATUS', error)
            }
            done()
          }
        },
      )),
    ]
  },
  onInit({
    dispatch,
    mutations,
  }) {
    // NOTE: if verifying account - wait to authenticate
    // since method should logout current user
    dispatch(mutations.authenticate())
  },
})