import Information from "@/components/dashboard/Information";
import WeeklyTasks from "@/components/dashboard/WeeklyTasks";
import { getUser } from "@/lib/api/user";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const user = await getUser({
    accessToken: session.user.accessToken,
    userId: session.user.id,
  });

  if (user.userDetails.Status === "S1" || user.userDetails.Status === "S3") {
    redirect("/question/1");
  } else if (user.userDetails.Status.includes("PT")) {
    redirect(`/test/${user.userDetails.PerformanceTaskStep}`);
  } else if (
    user.userDetails.Status === "S2" ||
    user.userDetails.Status === "S4"
  ) {
    redirect("/question/2");
  }

  return (
    <div className="flex flex-col px-3 sm:px-16 lg:px-32 py-3 sm:py-10 gap-4">
      <Information />

      <WeeklyTasks />
    </div>
  );
};

export default DashboardPage;
