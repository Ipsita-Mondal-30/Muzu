"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
    const session=useSession();
    return <div>
    <div className='flex justify-betwen'  >
        Muzi
    </div>
    <div>
        {session.data?.user?.name && <button className="m-2 p-2 bg-blue-400" onClick={()=> signOut()}>Logout</button>}
        {!session.data?.user?.name && <button className="m-2 p-2 bg-blue-400" onClick={()=> signIn()}>Signin</button>}
    </div>
    </div>
}