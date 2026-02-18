import { useNavigate } from 'react-router'

export function AdminPage() {
  const navigate = useNavigate()

  return (
    <div>
      Page1 <button onClick={() => navigate('login')}>Page1</button>
    </div>
  )
}
