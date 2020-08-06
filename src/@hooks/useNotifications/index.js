import useNotificationsByUserId from './useNotificationsByUserId'
import useUnreadNotificationCount from './useUnreadNotificationCount'
import useUpdateLastCheckedNotifications from './useUpdateLastCheckedNotifications'

const useNotifications = () => {
  return {
    useNotificationsByUserId,
    useUnreadNotificationCount,
    useUpdateLastCheckedNotifications,
  }
}

export default useNotifications
