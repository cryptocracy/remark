import Home from '@/components/home/HomeIndex'

import Profile from '@/components/Profile'
import favChannels from '@/components/channels/FavouriteChannels'

// import TagForm from '@/components/tags/TagForm'
// import MyTagList from '@/components/tags/MyTagList'
// import FavoriteTagList from '@/components/tags/FavoriteTagList'
// import TagInfo from '@/components/tags/TagInfo'

import ImageForm from '@/components/images/ImageForm'
import MyImageList from '@/components/images/MyImageList'
import FavoriteImageList from '@/components/images/FavoriteImageList'
import ImageInfo from '@/components/images/ImageInfo'

import EventForm from '@/components/events/EventForm'
import MyEventList from '@/components/events/MyEventList'
import FavoriteEventList from '@/components/events/FavoriteEventList'
import EventInfo from '@/components/events/EventInfo'

import MarkerForm from '@/components/markers/MarkerForm'
import MyMarkerList from '@/components/markers/MyMarkerList'
import FavoriteMarkerList from '@/components/markers/FavoriteMarkerList'
import MarkerInfo from '@/components/markers/MarkerInfo'

import TaskForm from '@/components/tasks/TaskForm'
import MyTaskList from '@/components/tasks/MyTaskList'
import FavoriteTaskList from '@/components/tasks/FavoriteTaskList'
import TaskInfo from '@/components/tasks/TaskInfo'

import WalletSummary from '@/components/wallet/Summary'
import WalletReceive from '@/components/wallet/Receive'
import WalletHistory from '@/components/wallet/History'
import WalletSend from '@/components/wallet/Send'
import Settings from '@/components/settings/Settings'
import Quorum from '@/components/quorum/Quorum'

/**
* Routes Data
*
* @type {Array of Objects}
* @param {string} path Routes path
* @param {string} name Router name to use redirect or push routes
* @param {function} component Router component for path
*
*/

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/channel/:id', name: 'Profile', component: Profile },
  { path: '/subscribed-channels', name: 'subscribed-channels', component: favChannels },
  { path: '/settings', name: 'Settings', component: Settings },

  // { path: '/tags/add-tag', name: 'AddTag', props: true, component: TagForm },
  // { path: '/tags/edit-tag', name: 'EditTag', props: true, component: TagForm },
  // { path: '/tags/owned', name: 'Owned', component: MyTagList },
  // { path: '/tags/favorites', name: 'Favorites', component: FavoriteTagList },
  // { path: '/tags/:tagName', name: 'TagInfo', props: true, component: TagInfo },

  { path: '/images/add-image', name: 'AddImage', props: true, component: ImageForm },
  { path: '/images/edit-image', name: 'EditImage', props: true, component: ImageForm },
  { path: '/images/owned', name: 'OwnedImages', component: MyImageList },
  { path: '/images/favorites', name: 'FavoritesImages', component: FavoriteImageList },
  { path: '/images/:imageName', name: 'ImageInfo', props: true, component: ImageInfo },

  { path: '/events/add-event', name: 'AddEvent', props: true, component: EventForm },
  { path: '/events/edit-event', name: 'EditEvent', props: true, component: EventForm },
  { path: '/events/owned', name: 'OwnedEvents', component: MyEventList },
  { path: '/events/favorites', name: 'FavoritesEvents', component: FavoriteEventList },
  { path: '/events/:eventName', name: 'EventInfo', props: true, component: EventInfo },

  { path: '/markers/add-marker', name: 'AddMarker', props: true, component: MarkerForm },
  { path: '/markers/edit-marker', name: 'EditMarker', props: true, component: MarkerForm },
  { path: '/markers/owned', name: 'OwnedMarkers', component: MyMarkerList },
  { path: '/markers/favorites', name: 'FavoritesMarkers', component: FavoriteMarkerList },
  { path: '/markers/:markerName', name: 'MarkerInfo', props: true, component: MarkerInfo },

  { path: '/tasks/add-task', name: 'AddTask', props: true, component: TaskForm },
  { path: '/tasks/edit-task', name: 'EditTask', props: true, component: TaskForm },
  { path: '/tasks/owned', name: 'OwnedTasks', component: MyTaskList },
  { path: '/tasks/favorites', name: 'FavoritesTasks', component: FavoriteTaskList },
  { path: '/tasks/:taskName', name: 'TaskInfo', props: true, component: TaskInfo },

  { path: '/wallet/summary', name: 'Summary', component: WalletSummary },
  { path: '/wallet/receive', name: 'Receive', component: WalletReceive },
  { path: '/wallet/history', name: 'History', component: WalletHistory },
  { path: '/wallet/send', name: 'Send', component: WalletSend },

  { path: '/popular', name: 'Quorum', component: Quorum }
]

export default routes
