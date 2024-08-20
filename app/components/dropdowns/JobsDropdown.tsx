import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Job Types",
    items: [
      { name: "Full-Time", href: "/categories/jobs/full-time" },
      { name: "Part-Time", href: "/categories/jobs/part-time" },
      { name: "Freelance", href: "/categories/jobs/freelance" },
      { name: "Internships", href: "/categories/jobs/internships" },
      { name: "Volunteer", href: "/categories/jobs/volunteer" },
      { name: "Remote", href: "/categories/jobs/remote" },
      {
        name: "Temporary Positions",
        href: "/categories/jobs/temporary-positions",
      },
    ],
  },
  {
    title: "Job Support",
    items: [
      { name: "Job Seekers", href: "/categories/jobs/job-seekers" },
      {
        name: "Recruitment Agencies",
        href: "/categories/jobs/recruitment-agencies",
      },
      { name: "Career Counseling", href: "/categories/jobs/career-counseling" },
      {
        name: "Interview Preparation",
        href: "/categories/jobs/interview-preparation",
      },
      { name: "Skill Development", href: "/categories/jobs/skill-development" },
      { name: "Networking Events", href: "/categories/jobs/networking-events" },
      { name: "Job Fairs", href: "/categories/jobs/job-fairs" },
    ],
  },
  {
    title: "Special Categories",
    items: [
      { name: "Government Jobs", href: "/categories/jobs/government-jobs" },
      {
        name: "Educational Institutions",
        href: "/categories/jobs/educational-institutions",
      },
      {
        name: "Professional Certifications",
        href: "/categories/jobs/professional-certifications",
      },
      {
        name: "Freelance Opportunities",
        href: "/categories/jobs/freelance-opportunities",
      },
    ],
  },
];

const JobsDropdown = () => {
  return (
    <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden z-30">
      <div className="p-6">
        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {menuItems.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-bold text-gray-900 mb-1">{category.title}</h3>
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className="block text-gray-700 text-opacity-90 hover:text-gray-900 mb-2.5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default JobsDropdown;
