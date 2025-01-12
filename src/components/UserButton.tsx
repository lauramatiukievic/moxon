import { auth, signOut } from "@/auth"
import UserIcon from "@heroicons/react/24/outline/UserIcon"
import Link from "next/link"

async function UserButton() {
    const session = await auth()
    console.log('rendered UserButton', session)
  return     session?.accessToken ?
    (<>
      <button onClick={() => signOut({redirectTo: '/products'})} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Account</span>
        <span>Sign out</span>
        <UserIcon aria-hidden="true" className="size-6" />
      </button></>)
    : (<>
      <Link href={'/signIn'} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Account</span>
        <UserIcon aria-hidden="true" className="size-6" />
        <span>Sign in</span>
      </Link>
    </>)
  
}
export default UserButton