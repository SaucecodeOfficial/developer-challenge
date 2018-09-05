import { createApiBox, task } from '../../libs'
import FeathersMailer from 'feathers-mailer'
import MG from 'nodemailer-mailgun-transport'

export const mailApi = createApiBox({
  models(m, T) {
    return [
      m('delivery_report', {
          transport: {
            type: T.STRING,
            allowNull: true,
          },
          from: {
            type: T.STRING,
            allowNull: true,
          },
          to: {
            type: T.STRING,
            allowNull: true,
          },
          subject: {
            type: T.STRING,
            allowNull: true,
          },
          html: {
            type: T.TEXT,
            allowNull: true,
          },
          text: {
            type: T.TEXT,
            allowNull: true,
          },
          metaId: {
            type: T.STRING,
            allowNull: true,
          },
          metaKey: {
            type: T.STRING,
            allowNull: true,
          },
          envelope: {
            type: T.TEXT,
            set(val) {
              this.setDataValue('envelope', JSON.stringify(val))
            },
          },
          envelopeTime: {
            type: T.INTEGER,
            allowNull: true,
          },
          messageTime: {
            type: T.INTEGER,
            allowNull: true,
          },
          messageSize: {
            type: T.INTEGER,
            allowNull: true,
          },
          messageId: {
            type: T.STRING,
            allowNull: true,
          },
          message: {
            type: T.TEXT,
            allowNull: true,
          },
          response: {
            type: T.TEXT,
            allowNull: true,
          },
          accepted: {
            type: T.TEXT,
            set(val) {
              this.setDataValue('accepted', JSON.stringify(val))
            },
          },
          rejected: {
            type: T.TEXT,
            set(val) {
              this.setDataValue('rejected', JSON.stringify(val))
            },
          },
          pending: {
            type: T.TEXT,
            set(val) {
              this.setDataValue('pending', JSON.stringify(val))
            },
          },
          error: {
            type: T.TEXT,
          },
        },
        {
          hooks: {
            beforeCount(options) {
              options.raw = true
            },
          },
        },
      ),
    ]
  },
  services(s, models, { auth, common }) {
    return [
      s('mail-delivery-reports', {
          Model: models.delivery_report,
        },
        {
          hooks: {
            before: {
              all: [
                auth.authenticate('jwt'),
              ],
            },
          },
        },
      ),
      s('mail', task(
        t => app => {
          const mail = app.get('mail')
          if (t.not(mail)) {
            app.set('communication', 'inactive')
          }
          else {
            const endPoint = '/mail'
            const transport = t.prop('transport', mail)
            if (t.eq(transport, 'mg')) {
              const mgAuth = app.get('mg')
              if (mgAuth) {
                app.use(endPoint, FeathersMailer(
                  MG({
                    auth: mgAuth,
                  }),
                  ),
                )
                app.set('communication', 'active')
              }
            }
            else if (t.eq(transport, 'smtp')) {
              const smtpAuth = app.get('smtp')
              if (smtpAuth) {
                app.use(endPoint, FeathersMailer(smtpAuth))
                app.set('communication', 'active')
              }
            }
            else {
              app.set('communication', 'inactive')
            }
          }
        }),
        {
          hooks: {
            before: {
              all: [
                common
                  .disallow('external'),
              ],
            },
            after: {
              create: [
                task(
                  (t, a) => async hook => {
                    const transport = t.path([ 'transport' ], hook.app.get('mail'))
                    const metaId = t.path([ 'meta', 'id' ], hook.data) || null
                    const metaKey = t.path([ 'meta', 'key' ], hook.data) || null
                    const deliveryPayload = t.mergeAll([
                      { metaId, metaKey, transport },
                      t.omit([ 'meta' ], hook.data),
                      { error: hook.error },
                      t.omit([ 'id' ], hook.result),
                    ])
                    const [ reportError ] = await a.of(
                      hook
                        .app
                        .service('mail-delivery-reports')
                        .create(deliveryPayload),
                    )
                    if (reportError) {
                      hook.app.error('MAIL DELIVERY ERROR', reportError)
                    }
                    return hook
                  },
                ),
              ],
            },
          },
        },
      ),
    ]
  },
})