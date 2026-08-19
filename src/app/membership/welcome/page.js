"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MembershipWelcomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/membership/enroll");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#080c09", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      Entering Membership Journey...
    </div>
  );
}
