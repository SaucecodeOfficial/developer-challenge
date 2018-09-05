import React from 'react'
import SchemaForm from 'react-jsonschema-form'
import cxs from 'cxs'
import { task, VIEW_STATUS, Link } from '../../../libs'

// tasks
const onError = (errors) => console.log('I have',
  errors.length, 'errors to fix',
)

// ui
import {
  Button,
  Row,
  Col,
} from 'reactstrap'

const formCss = cxs({
  minWidth: '100%',
})

// exports
export const AccountForm = task(
  t => ({
    title,
    text,
    view: {
      key,
      status,
      message,
    },
    form: {
      ui: {
        schema,
        uiSchema,
      },
      data,
    },
    onSubmit,
    buttonText,
    className,
    style,
    links,
  }) => {
    const containerProps = {
      className: t.tags.oneLine`
        position-relative
        d-flex
        flex-row
        justify-content-center
        ${formCss}
        ${className || ''}
      `,
      style,
    }
    const formProps = {
      key,
      schema,
      uiSchema,
      formData: data,
      onSubmit: ({ formData }) => onSubmit
        && onSubmit({ data: formData }),
      onError,
      className: t.tags.oneLine`
        position-relative
        d-block
        text-left
      `,
    }
    return (
      <Row {...containerProps}>
        <Col xs={12}
             md={6}
             lg={5}
             xl={4}>
          {t.not(title)
            ? null
            : (
              <h4 className='text-primary'>
                {title}
              </h4>
            )
          }
          {t.not(text)
            ? null
            : <p className='mb-3'>{text}</p>
          }
          <SchemaForm {...formProps}>
            {!message
              ? null
              : t.eq('Array', t.type(message))
                ? t.map(
                  msg => (
                    <p key={`${t.caseTo.constantCase(msg)}`}
                       className={'text-danger'}>
                      {msg}
                    </p>
                  ),
                  message,
                )
                : (
                  <p className={'text-danger'}>
                    {message}
                  </p>
                )
            }
            <Button type='submit'
                    color="primary"
                    size="md"
                    className="w-100 mb-2"
                    style={{ paddingBottom: '0.5rem' }}
                    disabled={t.or(
                      t.eq(VIEW_STATUS.LOADING, status),
                      t.eq(VIEW_STATUS.WAITING, status),
                    )}>
              {t.or(
                t.eq(VIEW_STATUS.LOADING, status),
                t.eq(VIEW_STATUS.WAITING, status),
              )
                ? <div>Loading</div>
                : (
                  <div>
                    {t.not(buttonText)
                      ? 'Submit'
                      : buttonText
                    }
                  </div>
                )
              }
            </Button>
            {t.notType(links, 'Array')
              ? null
              : t.mapIndexed((link, index) => {
                return (
                  <Link key={`link_${index}`}
                        to={link.to}
                        className='link d-block my-2 text-center'>
                    {link.text}
                  </Link>
                )
              }, links)

            }
          </SchemaForm>
        </Col>
      </Row>
    )
  },
)
