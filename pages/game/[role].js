import { useRouter } from 'next/router'

const Role = () => {
    const router = useRouter()
    const { role } = router.query

    return {role}
}

export default Role
