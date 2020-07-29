import axios from 'axios'
import { getRestApiUrl } from '../../authentication.service'

export function getTeams() {
  return axios
    .get(getRestApiUrl('teams'), {
      headers: { Authorization: `Bearer ${localStorage.getItem('restAccessToken')}` },
    })
    .then(res => {
      return res.data
    })
}

export function getTeam(id) {
  return axios
    .get(getRestApiUrl(`teams/${id}`), {
      headers: { Authorization: `Bearer ${localStorage.getItem('restAccessToken')}` },
    })
    .then(res => {
      return res.data
    })
}

export default function postTeams(data) {
  console.log('PostData for Teams', data)
  const response = axios.post(
    getRestApiUrl('teams'),
    {
      name: data.team,
      members: data.members,
    },
    { headers: { Authorization: `Bearer ${localStorage.getItem('restAccessToken')}` } }
  )
  return response
}
