
"use client";

import { useState, useTransition, useEffect } from "react";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Grade } from "@/lib/enum";
import GlobalLoading from "@/components/custom/globalLoading/globalLoading";
import { useClassesByGrade } from "@/hooks/useClass";
import TimetablePage from "@/components/timetable/time-table";

const gradeLabels: Record<Grade, string> = {
  [Grade.GRADE_1]: "Kelas I",
  [Grade.GRADE_2]: "Kelas II",
  [Grade.GRADE_3]: "Kelas III",
  [Grade.GRADE_4]: "Kelas IV",
  [Grade.GRADE_5]: "Kelas V",
  [Grade.GRADE_6]: "Kelas VI",
  [Grade.GRADE_7]: "Kelas VII",
  [Grade.GRADE_8]: "Kelas VIII",
  [Grade.GRADE_9]: "Kelas IX",
  [Grade.GRADE_10]: "Kelas X",
  [Grade.GRADE_11]: "Kelas XI",
  [Grade.GRADE_12]: "Kelas XII",
};

const StudentAdminDashboardTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [, , , , gradeParam] = pathname.split("/");
  const grade = (gradeParam as Grade) || Grade.GRADE_1;

  const [activeGrade, setActiveGrade] = useState(grade);
  const [isPending, startTransition] = useTransition();

  const { data: classData, isLoading: isLoadingClasses } =
    useClassesByGrade(grade);

  useEffect(() => {
    setActiveGrade(grade);
  }, [grade]);

  const handleChange = (key: string) => {
    startTransition(() => {
      setActiveGrade(key as Grade);
      router.push(`/dashboardxzx/academy/time-table/${key}`);
    });
  };



  // === 🧩 Tab untuk tiap grade ===
  const items = Object.values(Grade).map((g) => ({
    key: g,
    label: gradeLabels[g],
    children: (
      <>
        {isLoadingClasses ? (
          <GlobalLoading />
        ) : (
          <Tabs
            type="card"
            items={
              classData?.data?.length
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  classData.data.map((cls: any) => ({
                    key: cls.id,
                    label: cls.name,
                    children: (
                      <div>
                        <h3>{cls.name}</h3>
                        <TimetablePage id={cls.id} />
                      </div>
                    ),
                  }))
                : [
                    {
                      key: "empty",
                      label: "Tidak ada kelas",
                      children: <p>Belum ada data kelas untuk grade ini.</p>,
                    },
                  ]
            }
          />
        )}
      </>
    ),
  }));

  return (
    <>
      {(isPending || isLoadingClasses) && <GlobalLoading />}
      
      <Tabs
        activeKey={activeGrade}
        onChange={handleChange}
        type="card"
        items={items}
      />
    </>
  );
};

export default StudentAdminDashboardTabs;
