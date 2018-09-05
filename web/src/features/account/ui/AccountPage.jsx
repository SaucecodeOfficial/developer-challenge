import React from 'react'
import {
  task,
  connectState,
} from '../../../libs'

// ctx
import { VIEW_STATUS, VIEWS } from '../ctx'

// ui
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

import { AccountForm } from './AccountForm'
import { AccountView } from './AccountView'


// tasks
const renderFormOrView = task(
  t => ({
    view,
    form,
    mutations,
    VIEW_CONTENT,
  }) => {
    if (t.eq(VIEW_STATUS.WAITING, view.status)) {
      return (
        <AccountView key={`waiting_${view.key}`}
                     lock
                     title={'Loading'}
                     text={'This will only take a moment'}
                     status={view.status}/>
      )
    }
    const CONTENT_KEY = t.and(
      t.eq(VIEW_STATUS.FAIL, view.status),
      t.eq(VIEWS.VERIFY, view.key),
    )
      ? t.caseTo.constantCase(`${VIEWS.VERIFY}_${VIEW_STATUS.FAIL}`)
      : (
        t.eq(VIEW_STATUS.LOADING, view.status)
        || t.eq(VIEW_STATUS.READY, view.status)
        || t.eq(VIEW_STATUS.FAIL, view.status)
      )
        ? t.caseTo.constantCase(view.key)
        : t.caseTo.constantCase(`${view.key}_${view.status}`)
    const CONTENT = VIEW_CONTENT[ CONTENT_KEY ]
    if (!CONTENT) {
      return (
        <AccountView key={'no_content'}
                     title={'NO CONTENT FOUND'}
                     text={'Oops this page is missing content.'}
                     status={view.status}/>
      )
    }
    if (t.or(
        t.eq(VIEWS.NOT_AUTHORIZED, view.key),
        t.or(
          t.eq(VIEWS.VERIFY, view.key),
          t.eq(VIEW_STATUS.SUCCESS, view.status),
        ),
      )) {
      const buttonProps = t.not(CONTENT.ACTION)
        ? {}
        : {
          buttonText: CONTENT.ACTION.TEXT,
          buttonPath: CONTENT.ACTION.PATH,
        }
      return (
        <AccountView key={`view_${view.key}`}
                     title={CONTENT.TITLE}
                     text={CONTENT.TEXT}
                     message={view.message}
                     status={view.status}
                     followOnActions={CONTENT.ACTIONS || []}
                     {...buttonProps}/>
      )
    }
    return (
      <AccountForm key={`form_${view.key}`}
                   view={view}
                   form={form}
                   title={CONTENT.TITLE}
                   text={CONTENT.TEXT}
                   buttonText={CONTENT.ACTION}
                   onSubmit={mutations[ view.key ]}
                   links={CONTENT.LINKS || []}/>
    )
  },
)

const stateQuery = ({
  account,
  location,
}) => (
  {
    account,
    location,
  }
)

// exports
export const AccountPage = task(
  t => ({
    ui: {
      Page,
      Logo,
    },
    content: {
      VIEW_CONTENT,
    },
    accountState,
  }) => connectState(
    stateQuery,
    accountState.mutations,
  )(
    ({
      account: {
        form,
        view,
      },
      mutations,
    }) => {
      return (
        <Page>
          <Container className='text-center d-flex flex-column py-3'>
            {t.not(Logo)
              ? null
              : (
                <div className='d-flex flex-row justify-content-center w-100 pb-3'>
                  <Logo size={110} width={110} height={110}/>
                </div>
              )
            }
            {
              renderFormOrView({
                form,
                view,
                mutations,
                VIEW_CONTENT,
              })
            }
          </Container>
        </Page>
      )
    },
  ),
)