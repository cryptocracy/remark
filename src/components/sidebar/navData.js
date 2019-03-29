
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
    linkTo: '/quorum',
    class: 'step9'
  },
  {
    color: 'green lighten-2',
    action: 'subscriptions',
    title: 'Latest',
    linkTo: '/'
  },
  {
    color: 'purple lighten-2',
    action: 'ondemand_video',
    title: 'Channels',
    linkTo: '/subscribed-channels'
  },
  {
    color: 'teal lighten-1',
    action: 'video_library',
    title: 'My Library',
    items: [
      { title: 'My Uploads', linkTo: '/images/owned' },
      { title: 'My Playlists', linkTo: '/images/favorites' }
    ]
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
