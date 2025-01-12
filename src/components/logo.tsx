import Image from 'next/image';
import logo from '@/app/images/IMG_2019.jpeg';

export const Logo = ()=>{
    return (
        <div className="flex flex-1 rounded-md">
        <a href="#">
          <Image
          className='rounded-sm'
            alt="Your Company Logo"
            src={logo}
            width={48}
            height={48}
            priority
          />
        </a>
      </div>
    )
}