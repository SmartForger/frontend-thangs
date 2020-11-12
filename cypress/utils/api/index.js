const api = ({ method = 'GET', endpoint, body, params }) => {
  const token = localStorage.getItem('accessToken')
  return cy.request({
    url: `${Cypress.env('REACT_APP_API_KEY')}${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(params && { params }),
  })
}

export const apiLogin = ({ userName, password }) => {
  return api({
    endpoint: 'auth',
    method: 'POST',
    body: { userName, password },
  }).then(response => {
    const { TOKEN: accessToken, expires: tokenExpiration, user } = response.body.token
    localStorage.setItem('accessToken', accessToken)

    const currentUserStr = JSON.stringify({
      ...user,
      accessToken: accessToken,
      accessTokenExpiration: tokenExpiration,
    })

    localStorage.setItem('currentUser', currentUserStr)

    return Promise.resolve('ok')
  })
}

export default api
