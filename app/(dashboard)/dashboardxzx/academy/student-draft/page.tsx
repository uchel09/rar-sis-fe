import StudentDraftApprovePendingTabs from "@/components/student-draft/student-draft-approve-pending";
import StudentDraftPendingTabs from "@/components/student-draft/student-draft-pending";
import StudentDraftApprovedTabs from "@/components/student-draft/student-drafta-approved";
import { Tabs } from "antd";

const DraftTabs = () => {
    const items = [
      {
        key: "PENDING",
        label: "Pending",
        children: <StudentDraftPendingTabs />,
      },
      {
        key: "APPROVED_PENDING",
        label: "Approved Pending",
        children: <StudentDraftApprovePendingTabs />,
      },
      {
        key: "APPROVED",
        label: "Approved",
        children: <StudentDraftApprovedTabs />,
      },
      {
        key: "REJECTED",
        label: "Rejected",
        children: <StudentDraftPendingTabs />,
      },
    ];

  return <Tabs defaultActiveKey="PENDING" items={items} />;
};

export default DraftTabs;
