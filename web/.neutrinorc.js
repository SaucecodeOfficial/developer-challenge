module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    [
      '@neutrinojs/react',
      {
        publicPath: '/',
        html: {
          title: 'Saucecode',
          links: [
            {
              rel: 'stylesheet',
              href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            },
            {
              rel: 'stylesheet',
              href: 'https://s3-eu-west-1.amazonaws.com/elasticbeanstalk-eu-west-1-365205827451/line-awesome/index.min.css',
            },
            {
              rel: 'stylesheet',
              href:'https://fonts.googleapis.com/css?family=Roboto',
            }
          ],
        },
        targets: {
          browsers: [
            'safari >= 6',
          ],
        },
      },
    ],
  ],
}
