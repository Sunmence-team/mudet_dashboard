import Navbar from '../components/Navbar'

const MainLayout = ({ child }) => {
  return (
    <div className='relative bg-tetiary min-h-screen w-screen overflow-x-hidden'>
        <Navbar />
        <div className="lg:px-8 px-4 py-6">
            {child}
        </div>
    </div>
  )
}

export default MainLayout