import React from 'react'
import cxs from 'cxs'
import { task, Link } from '../../../libs'

// state
import { statusIsBusy } from '../state/tasks'

// ui
import { Button } from 'reactstrap'

const viewCss = cxs({
  minHeight: '60vh',
  '.busy': {
    minHeight: '80vh',
  },
})

// exports
export const AccountView = task(
  t => ({
    title,
    text,
    buttonText,
    buttonPath,
    buttonAction,
    followOnActions,
    status,
    message,
    children,

  }) => {
    const busy = statusIsBusy(status)
    const viewProps = {
      className: t.tags.oneLine`
        position-relative
        d-flex
        flex-column
        align-items-center
        justify-content-center
        ${viewCss}
        ${t.not(busy) ? '' : 'busy'}
      `,
    }
    return (
      <div {...viewProps}>
        {t.not(title)
          ? null
          : (
            <h4 className={t.tags.oneLine`
            d-flex
            flex-row
            text-center
            justify-content-center
            text-primary
          `}>
              {title}
            </h4>
          )}
        {t.not(title)
          ? null
          : (
            <p className={t.tags.oneLine`
                d-flex
                flex-row
                text-center
                justify-content-center
              `}>
              {text}
            </p>
          )}
        {t.not(message)
          ? null
          : t.eq('Array', t.type(message))
            ? t.map(
              text => (
                <h6 key={`${t.caseTo.constantCase(text)}`}
                    className={t.tags.oneLine`
                      d-flex
                      flex-row
                      text-center
                      justify-content-center
                      text-danger
                    `}>
                  {text}
                </h6>
              ),
              message,
            )
            : (
              <h6 className={t.tags.oneLine`
                    d-flex
                    flex-row
                    text-center
                    justify-content-center
                    text-danger
                  `}>
                {message}
              </h6>
            )
        }
        {t.not(busy)
          ? null
          : (
            <h1 className={t.tags.oneLine`
            d-flex
            flex-row
            text-center
            justify-content-center
            text-secondary
          `}>
              Loading
            </h1>
          )
        }
        {!buttonText
          ? null
          : !buttonPath
            ? (
              <Button color='primary'
                      size='lg'
                      className='w-100 mt-3'
                      style={{ paddingBottom: '0.5rem' }}
                      onClick={() => buttonAction
                        && buttonAction()}>
                {buttonText}
              </Button>
            )
            : (
              <Button color='primary'
                      size='lg'
                      className='w-100 mt-3'
                      style={{ paddingBottom: '0.5rem' }}
                      tag={Link}
                      to={buttonPath}>
                {buttonText}
              </Button>
            )

        }
        {t.isZeroLen(followOnActions)
          ? null
          : t.mapIndexed(
            (action, index) => {
              return (
                <div key={`follow-on-action-${index}`}>
                  <Button outline
                          color='secondary'
                          size='lg'
                          className='w-100'
                          style={{ paddingBottom: '0.5rem' }}
                          tag={Link}
                          to={action.to}>
                    {action.text}
                  </Button>
                </div>
              )
            },
            followOnActions || [],
          )

        }
        {children && children}
      </div>
    )
  },
)