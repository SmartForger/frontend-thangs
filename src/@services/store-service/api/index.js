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
  return axios
    .post(
      getRestApiUrl('teams'),
      {
        name: data.teamName,
        members: data.teamMembers,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('restAccessToken')}` } }
    )
    .catch(e => Promise.reject({ data: {}, error: e }))
}
