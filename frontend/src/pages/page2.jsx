import { useNavigate } from 'react-router'

export function AdminPage2() {
  const navigate = useNavigate()

  return (
    <div>
      Page2 <button onClick={() => navigate('/')}>Page2</button>
    </div>
  )
}
