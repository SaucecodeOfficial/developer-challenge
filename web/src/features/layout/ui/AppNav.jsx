import React from 'react'
import cxs from 'cxs'
import {
  task,
  NavLink,
} from '../../../libs'

// ctx
import {
  GRID_SIZES,
  NAV_MODE,
  NAV_SIZES,
} from '../ctx'

// ui
import Fa from 'react-fontawesome'
import { Logo } from './Logo'

const navCss = cxs({
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 1000,
  '.primary': {
    width: `${NAV_SIZES.PRIMARY}px`,
  },
  '.secondary': {
    width: `${NAV_SIZES.PRIMARY + NAV_SIZES.SECONDARY}px`,
  },
  ' .nav-box': {
    minHeight: '100vh',
  },
  ' .nav-item': {
    padding: '0.65rem 0 0.85rem',
    minHeight: `${NAV_SIZES.HEADER}px`,
    textDecoration: 'none',
    ' .item-icon': {
      fontSize: '2rem',
    },
    ' .item-body': {
      fontSize: '0.7rem',
    },
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    '.active': {
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  },
  ' .nav-box.primary': {
    top: 0,
    left: 0,
    bottom: 0,
    width: `${NAV_SIZES.PRIMARY}px`,
    backgroundColor: '#48484a',
    color: '#fff',
  },
  ' .nav-box.secondary': {
    top: 0,
    left: `${NAV_SIZES.PRIMARY}px`,
    bottom: 0,
    width: `${NAV_SIZES.SECONDARY}px`,
    backgroundColor: '#d1d1d3',
    color: '#48484a',
  },
  ' .nav-box .nav-header': {
    top: 0,
    left: 0,
    right: 0,
    height: `${NAV_SIZES.HEADER}px`,
  },
  ' .nav-box .nav-body': {
    top: `${NAV_SIZES.HEADER}px`,
    left: 0,
    right: 0,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
})

// exports
export const NavItemContent = task(
  t => ({ icon, text, children }) => {
    return <React.Fragment>
      {t.not(icon)
        ? null
        : (
          <div className={t.tags.oneLine`
            item-icon
            position-relative
            d-flex
            flex-row
            justify-content-center
            `}>
            <Fa name={icon}/>
          </div>
        )
      }
      {t.not(text)
        ? null
        : (
          <div className={t.tags.oneLine`
            item-body
            position-relative
            d-flex
            flex-row
            justify-content-center
            `}>
            {text}
          </div>
        )}
      {children}
    </React.Fragment>
  },
)

export const NavItem = task(
  t => ({
    to,
    action,
    icon,
    text,
    className,
    style,
    children,
    onAction,
  }) => {
    const itemProps = {
      className: t.tags.oneLine`
        nav-item
        position-relative
        d-flex
        flex-column
        text-white
        ${className}
      `,
      style,
      onClick: t.not(action)
        ? undefined
        : () => onAction(action),
    }
    const contentProps = {
      icon,
      text,
      children,
    }
    return (
      t.or(t.not(to), t.eq(to, ''))
    )
      ? (
        <div {...itemProps}>
          <NavItemContent {...contentProps}/>
        </div>
      )
      : (
        <NavLink to={to}
                 activeClassName='active'
                 {...itemProps}>
          <NavItemContent {...contentProps}/>
        </NavLink>
      )
  },
)

export const NavHeader = task(
  t => ({ children }) => {
    return (
      <div className={t.tags.oneLine`
        nav-header
        position-absolute
      `}>
        {children}
      </div>
    )
  },
)

export const NavBody = task(
  t => ({ children }) => {
    return (
      <div className={t.tags.oneLine`
        nav-body
        position-absolute
        py-3
      `}>
        {children}
      </div>
    )
  },
)

export const NavBox = task(
  t => ({ mode, children }) => {
    return (
      <div className={t.tags.oneLine`
          nav-box
          position-absolute
          d-block
          ${mode}
        `}>
        {children}
      </div>
    )
  },
)

export const AppNav = task(
  t => ({
    nav: {
      status,
      mode,
      schema,
    },
    dispatch,
  }) => {
    const navProps = {
      className: t.tags.oneLine`
        position-fixed
        ${navCss}
        ${status}
        ${mode}
      `,
    }
    return (
      <div {...navProps}>
        <NavBox mode={NAV_MODE.PRIMARY}>
          <NavHeader>
            <div className='d-flex flex-row justify-content-center pt-1'>
              <Logo size={50} width={50} height={50}/>
            </div>
          </NavHeader>
          <NavBody>
            {t.mapIndexed(item => {
              return (
                <NavItem key={item.path}
                         to={item.path}
                         text={item.text}
                         icon={item.icon}
                         action={item.action}
                         onAction={dispatch}/>
              )
            }, schema || [])}
          </NavBody>
        </NavBox>
      </div>
    )
  },
)