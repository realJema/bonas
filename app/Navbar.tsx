import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { EnvelopeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthButtons from "./components/auth/AuthButtons";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { PostDropdownMenu } from "./components/PostDropdownMenu";
import SearchInput from "./components/SearchInput";
import Sidebar from "./components/Sidebar";
import { UserProfile } from "./components/UserProfile";
import { getCategories } from "@/utils/getCategories";

const Navbar = async () => {
  const session = await auth();

  // Fetch categories for each main category
  const vehiclesCategories = await getCategories("Vehicles");
  const realEstateCategories = await getCategories("Real Estate");
  const jobsCategories = await getCategories("Jobs");
  const electronicsCategories = await getCategories("Electronics");
  const fashionCategories = await getCategories("Fashion");
  const homeAndGardenCategories = await getCategories("Home & Garden");
  const servicesCategories = await getCategories("Services");
  const petsCategories = await getCategories("Pets");
  const hobbiesAndLeisureCategories = await getCategories("Hobbies & Leisure");
  const businessAndIndustrialCategories = await getCategories(
    "Business & Industrial"
  );
  const jobSeekerCategories = await getCategories("Job Seeker");

  const allCategories = {
    Vehicles: vehiclesCategories,
    "Real Estate": realEstateCategories,
    Jobs: jobsCategories,
    Electronics: electronicsCategories,
    Fashion: fashionCategories,
    "Home & Garden": homeAndGardenCategories,
    Services: servicesCategories,
    Pets: petsCategories,
    "Hobbies & Leisure": hobbiesAndLeisureCategories,
    "Business & Industrial": businessAndIndustrialCategories,
    "Job Seeker": jobSeekerCategories,
  };

  return (
    <header className="border-b h-16 bg-white w-full">
      <nav className="flex justify-around sm:justify-between items-center sticky z-40 top-0 border-b h-16 bg-white gap-5 sm:gap-3 container mx-auto px-10 md:px-4 md:max-w-7xl">
        <div className="flex items-center gap-4 md:gap-7 w-full">
          <div className="flex items-center gap-3">
            <div className="xl:hidden">
              <Sidebar />
            </div>
            <Link className="hidden sm:block" href="/">
              <Logo />
            </Link>
          </div>
          <div className="hidden sm:block w-full md:max-w-lg lg:max-w-full">
            <SearchInput />
          </div>
        </div>

        <Link className="sm:hidden" href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <PostDropdownMenu />

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Messages"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Lists"
          >
            <HeartIcon className="h-5 w-5" />
          </Button>

          <Link
            href="#"
            className="text-gray-600 hover:text-green-600 hidden lg:inline-flex font-semibold whitespace-nowrap"
          >
            Orders
          </Link>

          {session ? (
            <UserProfile session={session} />
          ) : (
            <AuthButtons isAuthenticated={!!session} />
          )}
        </div>
      </nav>

      <Header categories={allCategories} />
    </header>
  );
};

export default Navbar;
