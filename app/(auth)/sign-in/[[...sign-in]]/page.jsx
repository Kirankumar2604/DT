import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex justify-center h-screen">
      <div
        className="hidden bg-cover lg:block lg:w-2/3"
        style={{
          backgroundImage:
            // "url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
            //"url(https://img.freepik.com/free-vector/collection-people-with-technology-devices_23-2148487572.jpg?t=st=1744403306~exp=1744406906~hmac=6e022f69704250e726b2e7c667cd4cababd693cb5e8d7f28436b69998cce0fc8&w=1380)"
           // "url(https://img.freepik.com/free-vector/school-college-students-people-study-together_107791-12721.jpg?t=st=1744443413~exp=1744447013~hmac=895ca5359f5504d59c9d62ac767abe9600dc68fd787d494f3e8de492606b798c&w=2000)"
           "url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
        }}
      >
        <div className="flex items-center h-full px-20 bg-gradient-to-r from-gray-900/80 to-gray-900/40">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              NOTEZY
            </h2>
            <p className="max-w-xl mt-3 text-gray-300">
            Welcome to the next evolution of note-taking.
            Sign in to seamlessly capture and organize your thoughts.
            Our AI works behind the scenes to provide intelligent assistance and insights.
            Discover a more powerful and intuitive way to manage your knowledge.
            </p>
            <p className="max-w-xl mt-3 text-gray-300">      
            Experience the difference. Feel free to sign in.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <div className="flex justify-center mx-auto">
              {/* <img
                className="w-auto h-7 sm:h-8"
                src=""//imag logo src
                alt=""
              /> */}
            </div>
          </div>
          <div className="mt-8">
            <form>
              <SignIn/>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}