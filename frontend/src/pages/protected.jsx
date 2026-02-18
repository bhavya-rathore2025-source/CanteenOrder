import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to='/login' replace />
  }

  return children
}
