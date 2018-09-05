export const VIEW_CONTENT = {
  BRAND_NAME: 'App',
  SIGN_IN: {
    TITLE: 'Login to App',
    TEXT: 'Enter your account credentials below.',
    ACTION: 'Login',
    LINKS: [
      {
        text: `Don't have an account? Register one now.`,
        to: '/account/register',
      },
      {
        text: `Forgot your password?`,
        to: '/account/reset-password',
      },
    ],
  },
  SIGN_IN_FAIL: {
    MESSAGES: [
      'Login failed.',
      'Please confirm the credentials entered are valid.',
    ],
  },
  SIGN_UP: {
    TITLE: 'Register an App account',
    TEXT: 'Enter your new account details below.',
    ACTION: 'Register',
    LINKS: [
      {
        text: `Already have an account? Login now.`,
        to: '/account/login',
      },
    ],
  },
  SIGN_UP_CHECK_FAIL: {
    MESSAGES: [
      'Invalid credentials supplied.',
      'Please confirm the credentials entered are valid',
    ],
  },
  SIGN_UP_FAIL: {
    MESSAGES: [
      'Failed to processing your registration details.',
      'Please try again.',
    ],
  },
  SIGN_UP_SUCCESS: {
    TITLE: 'Thank you for registering a BIS Cloud account',
    TEXT: 'Your account verification link has been sent to the entered email.',
    ACTIONS: [
      {
        text: 'Continue to Login',
        to: '/account/login',
      },
    ],
  },
  RESET_PASSWORD: {
    TITLE: 'Reset your App password',
    TEXT: 'Enter the email address you registered with.',
    ACTION: 'Reset',
    LINKS: [
      {
        text: `Remembered your password? Login now.`,
        to: '/account/login',
      },
      {
        text: `Don't have an account? Register one now.`,
        to: '/account/register',
      },
    ],
  },
  RESET_PASSWORD_SUCCESS: {
    TITLE: 'Your password reset confirmation has been sent',
    TEXT: 'Please check your email for a confirmation link.',
  },
  RESET_PASSWORD_FAIL: {
    MESSAGES: [
      'Failed to send your password reset.',
      'Please confirm the email address entered is valid.',
    ],
  },
  VERIFY: {
    TITLE: 'Verifying your account...',
    TEXT: 'This will only take a moment.',
  },
  VERIFY_SUCCESS: {
    TITLE: 'Your account has been verified',
    TEXT: 'You are now able to reset your password and update your identity',
    ACTIONS: [
      {
        text: 'Continue to Login',
        to: '/account/login',
      },
    ],
  },
  VERIFY_FAIL: {
    TITLE: 'Unable to verify your account.',
    MESSAGES: [
      'The account to be verified cannot be found or is already verified.',
    ],
  },
  RESET: {
    TITLE: 'Confirm your new password',
    TEXT: 'Enter your new password below.',
    ACTION: 'Confirm',
  },
  RESET_SUCCESS: {
    TITLE: 'Your password has been reset',
    TEXT: 'Please continue to Login.',
    ACTIONS: [
      {
        text: 'Continue to Login',
        to: '/account/login',
      },
    ],
  },
  RESET_FAIL: {
    MESSAGES: [
      'Your password could not be updated.',
      'Please contact your administrator.',
    ],
  },
  NOT_AUTHORIZED: {
    TITLE: 'Your account is not authorized for this area',
    TEXT: 'Please contact your administrator to request access.',
  },
}
