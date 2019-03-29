import moment from 'moment'
import img1 from '../../assets/img/user1.jpg'
import img2 from '../../assets/img/user2.jpg'

/**
* Notification Data
*
* @type {Array of Objects}
* @param {number} id of each object
* @param {string} name name of the user
* @param {string} Avatar User profile image
* @param {string} details of the notification type
* @param {string} time of the notification stored
* @param {boolean} read if user reads it or not
* @param {string} icon Based on notification type ( success/warning/danger)
*
*/

export default {
  data: [
    {
      id: 1,
      name: 'Bruce Mann',
      avatar: null,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: false
    },
    {
      id: 2,
      name: 'Henry J',
      avatar: img1,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true
    },
    {
      id: 3,
      icon: 'fa fa-star',
      detail: 'Our average rating goes up!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      success: true
    },
    {
      id: 4,
      icon: 'fa fa-exclamation-triangle',
      detail: 'Server load is 95%, trying to reduce it!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      warning: true
    },
    {
      id: 5,
      name: 'Henry J',
      avatar: img2,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true
    },
    {
      id: 6,
      icon: 'fa fa-user-times',
      detail: '7 Subscrption plan not renewed!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      danger: true
    },
    {
      id: 7,
      name: 'Bruce Mann',
      avatar: null,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: false
    },
    {
      id: 8,
      name: 'Henry J',
      avatar: img1,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true
    },
    {
      id: 9,
      icon: 'fa fa-star',
      detail: 'Our average rating goes up!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      success: true
    },
    {
      id: 10,
      icon: 'fa fa-exclamation-triangle',
      detail: 'Server load is 95%, trying to reduce it!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      warning: true
    },
    {
      id: 11,
      name: 'Henry J',
      avatar: img2,
      detail: 'Sent a review request to Amanda Nunes',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true
    },
    {
      id: 12,
      icon: 'fa fa-user-times',
      detail: '7 Subscrption plan not renewed!',
      time: moment().startOf('day').fromNow().toLocaleString(),
      read: true,
      danger: true
    }
  ]
}
