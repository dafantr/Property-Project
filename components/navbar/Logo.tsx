import Link from 'next/link';
import { Button } from '../ui/button';

function Logo() {
  return (
    <Link href="/">
      <img
        src="/icons/logo1.png"
        alt="Million Dollar View Villas Logo"
        className="object-contain"
        style={{ height: '100x', width: '100px' }}
      />
    </Link>
  );
}

export default Logo;
