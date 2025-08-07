/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uVG77qDcbLd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ArrowRight, Calendar, CheckCircle, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-800">
                <span className="text-blue-600 dark:text-blue-400">
                  StudySpace
                </span>
                <span className="mx-1 text-gray-400 dark:text-gray-600">•</span>
                <span>Real-time Classroom Availability</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Find empty classrooms <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}
                  in real-time
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl lg:text-xl dark:text-gray-400">
                Discover available study spaces across campus instantly. Book rooms, check schedules,
                and optimize your study time with our university-focused platform.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book-room"
                className="inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Find Available Rooms <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/room-schedules"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                View Schedules
              </Link>
            </div>
          </div>

          <div className="mt-16 grid place-items-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <div ></div>
              <img
                src="/images/dashboard-img2.png"
                alt="StudySpace room booking interface with available rooms and booking details"
                className="w-full h-auto object-cover aspect-video"
                width="1600"
                height="900"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[850px]">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need for productive studying
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                From real-time availability to instant booking, StudySpace provides
                the tools to make your study time more effective and organized.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-800">
                <Star className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                <span className="text-gray-900 dark:text-gray-50">
                  Why students choose StudySpace
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Designed for university life
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                StudySpace solves the real problem of overcrowded libraries and unused classrooms.
                Our platform connects students with available study spaces in real-time, making
                campus resources more accessible and efficient for everyone.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/book-room"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                >
                  Book a Room
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 bg-gradient-to-b from-gray-100 to-white opacity-50 blur-2xl dark:from-gray-900/70 dark:to-black/70"></div>
              <img
                src="/images/dashboard-img3.png"
                alt="StudySpace admin dashboard for room management and scheduling"
                className="w-full rounded-xl border border-gray-200 shadow-lg dark:border-gray-800"
                width="550"
                height="400"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    title: 'Real-time Availability',
    description:
      'See which classrooms are currently empty and available for study sessions instantly.',
    icon: <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
  },
  {
    title: 'Instant Booking',
    description:
      'Book study rooms with just a few clicks. Real-time availability and instant confirmations.',
    icon: <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
  },
  {
    title: 'Room Schedules',
    description:
      'View detailed schedules for any room to plan your study sessions in advance.',
    icon: <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
  },
];
