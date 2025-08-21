export async function getStaticPaths() {
  return {
    paths: [
      { params: { role: 'detective' } },
      { params: { role: 'killer' } },
    ],
    fallback: false, // 🚨 must be false for static export
  }
}

export async function getStaticProps({ params }) {
  return { props: { role: params.role } }
}

export default function Role({ role }) {
  return <div>Role: {role}</div>
}
