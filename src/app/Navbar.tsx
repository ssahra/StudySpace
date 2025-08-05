'use client';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
// const DynamicLoginNavLink = dynamic(
//   () => import('./LoginNavLink').then((module) => module.LoginNavLink),
//   {
//     ssr: false,
//   }
// );

// export function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     function onScroll() {
//       setIsScrolled(window.scrollY > 0);
//     }
//     onScroll();
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => {
//       window.removeEventListener('scroll', onScroll);
//     };
//   }, []);

//   return (
//     <header
//       className={cn(
//         'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
//         isScrolled
//           ? 'dark:bg-slate-900/95 dark:backdrop-blur-sm dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
//           : 'dark:bg-transparent'
//       )}
//     >
//       <div className="mr-6 flex lg:hidden space-x-2">
//         <MobileNavigation />
//         <div className={cn('block lg:hidden', 'relative ')}>
//           <Link href="/" className="block" aria-label="Home page">
//             <img
//               src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
//               className="h-9 block sm:h-9"
//               alt="Nextbase Logo"
//             />
//           </Link>
//         </div>
//       </div>

//       <div className={cn(' mx-auto w-full max-w-8xl flex justify-center ')}>
//         <div
//           className={cn(
//             'hidden lg:flex items-center gap-8 mx-auto ',
//             'relative '
//           )}
//         >
//           <Link href="/" aria-label="Home page">
//             <img
//               src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
//               className="h-9 block sm:h-9"
//               alt="Nextbase Logo"
//             />
//           </Link>
//           <NavLink href="/" aria-label="Items">
//             Items
//           </NavLink>
//           <Suspense fallback={<div> Loading ... </div>}>
//             <DynamicLoginNavLink />
//           </Suspense>
//         </div>
//         <div className="-my-5 mr-6 sm:mr-8 md:mr-0"></div>
//         <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:grow"></div>
//       </div>
//     </header>
//   );
// }

// import { ThemeToggle } from '@/components/tailwind/ThemeToggle';

export const ExternalNavigation = () => {
  return (
    <header className="container mx-auto px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-bold text-gray-900 dark:text-gray-100">
            StudySpace
          </span>
          <span className="block lg:hidden text-xl font-bold text-gray-900 dark:text-gray-100">
            StudySpace
          </span>
        </div>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="/book-room"
        >
          Book Room
        </Link>
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="/db-testing"
        >
          DB Testing
        </Link>
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="/room-schedules"
        >
          Room Schedules
        </Link>
      </nav>
    </header>
  );
};
function StudySpaceLogo(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      {/* Dark blue rounded square background */}
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#1e40af" />

      {/* Open book - left side */}
      <path
        d="M8 12 L8 20 L14 20 L14 12 L8 12 Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />

      {/* Book pages */}
      <path
        d="M8 12 L14 12 L14 20 L8 20 Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />

      {/* Book spine */}
      <rect x="8" y="12" width="1" height="8" fill="white" />

      {/* Location pin - overlapping the book */}
      <path
        d="M16 8 L20 16 L18 16 L18 22 L14 22 L14 16 L16 8 Z"
        fill="white"
      />

      {/* Pin circle */}
      <circle cx="16" cy="10" r="1" fill="white" />
    </svg>
  );
}
