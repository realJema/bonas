import React from "react";
import { auth } from "@/auth";
import ProfileCard from "./UserProfileCard";
import LearnmoreCard from "./LearnMoreCard";
import DescriptionCard from "./DescriptionCard";
import Header from "@/app/components/Header";


interface Props {
  params: { username: string };
}

const UserProfilePage = async ({ params: { username } }: Props) => {
  const session = await auth();

  return (
    <>
    <Header />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto px-0 pt-6 md:px-0 md:max-w-7xl">
      <div className="lg:col-span-1 space-y-6">
        <ProfileCard
          name={session?.user?.name || ""}
          username={username}
          location="Cameroon"
          memberSince="Sep 2021"
          isNew={true}
          isOnline={true}
          imageUrl={session?.user?.image}
        />
        <LearnmoreCard
          title="Earn badges and stand out"
          description="Boost your sales by boosting your expertise."
          buttonText="Enroll Now"
        />
        <div className="">
          <DescriptionCard
            description="A frontend developer crafts user-friendly interfaces with code magic. He does amazing things to ensure great UI design and goes through lengths to link the front end and the back end"
            languages={[{ language: "English", level: "Basic" }]}
            skills={["Google Voice"]}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfilePage;