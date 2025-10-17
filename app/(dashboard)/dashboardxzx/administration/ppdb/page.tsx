import PpdbApprovePendingTabs from "@/components/ppdb/ppdb-approve-pending";
import PpdbPendingTabs from "@/components/ppdb/ppdb-pending";
import PpdbApprovedTabs from "@/components/ppdb/ppdb-approved";
import { Tabs } from "antd";

const DraftTabs = () => {
    const items = [
      {
        key: "PENDING",
        label: "Pending",
        children: <PpdbPendingTabs />,
      },
      {
        key: "APPROVED_PENDING",
        label: "Approved Pending",
        children: <PpdbApprovePendingTabs />,
      },
      {
        key: "APPROVED",
        label: "Approved",
        children: <PpdbApprovedTabs />,
      },
      {
        key: "REJECTED",
        label: "Rejected",
        children: <PpdbPendingTabs />,
      },
    ];

  return <Tabs defaultActiveKey="PENDING" items={items} />;
};

export default DraftTabs;
