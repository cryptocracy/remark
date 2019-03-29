// // https://eslint.org/docs/user-guide/configuring

// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint',
//   },
//   env: {
//     browser: true,
//   },
//   extends: [
//     // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//     // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//     'plugin:vue/essential', 
//     // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//     'standard'  
//   ],
//   // required to lint *.vue files
//   plugins: [
//     'vue'
//   ],
//   // check if imports actually resolve
//   settings: {
//     'import/resolver': {
//       webpack: {
//         config: 'build/webpack.base.conf.js'
//       }
//     }
//   },
//   // add your custom rules here
//   rules: {
//     // don't require .vue extension when importing
//     'import/extensions': ['error', 'always', {
//       js: 'never',
//       vue: 'never'
//     }],
//     // allow optionalDependencies
//     'import/no-extraneous-dependencies': ['error', {
//       optionalDependencies: ['test/unit/index.js']
//     }],
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-param-reassign': ["error", { "props": false }],
//     'linebreak-style': 0
//   }
// }
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'vue/html-indent': [
      'error',
      2
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
