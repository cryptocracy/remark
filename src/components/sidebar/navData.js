
/**
* Navigation menu data
*
* @type {Array of Objects}
* @param {string} color Left icon color for different menu
* @param {string} action Left icon of the list
* @param {string} title Title of the list
* @param {string} linkTo Router path
* @param {array} items.items Child list items
*
*/

const items = [
  {
    color: 'red',
    action: 'whatshot',
    title: 'Popular',
    linkTo: '/popular',
    class: 'step9'
  },
  {
    color: 'green lighten-2',
    action: 'subscriptions',
    title: 'Latest',
    linkTo: '/'
  },
  {
    color: 'teal lighten-1',
    action: 'fa-rss',
    title: 'Channels',
    linkTo: '/subscribed-channels'
  },
  {
    color: 'red lighten-1',
    action: 'favorite',
    title: 'My Likes',
    linkTo: '/sounds/favorites'
  },
  {
    color: 'blue lighten-1',
    action: 'fa-list-alt',
    title: 'My Library',
    linkTo: '/sounds/owned'
  },
  {
    color: 'brown lighten-2',
    action: 'account_balance_wallet',
    title: 'Wallet',
    items: [
      { title: 'Summary', linkTo: '/wallet/summary' },
      { title: 'Send', linkTo: '/wallet/send' },
      { title: 'Receive', linkTo: '/wallet/receive' },
      { title: 'History', linkTo: '/wallet/history' }
    ]
  }
]

export default items
