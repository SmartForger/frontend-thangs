import axios from 'axios'
import {getRestApiUrl} from '../../authentication.service'

export function getTeams() {
  return axios.get(getRestApiUrl('teams'), { 'headers': { 'Authorization': `Bearer ${localStorage.getItem('restAccessToken')}` } }).then((res) => {
    return res.data
  })
}

export default function postTeams(data) {
  const response = axios
    .post(getRestApiUrl('teams'), {
      name: data.team,
      members: data.members
    }, {'headers': {'Authorization': `Bearer ${localStorage.getItem('restAccessToken')}`}})
  return response
}

