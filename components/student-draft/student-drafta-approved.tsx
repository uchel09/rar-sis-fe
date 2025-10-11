/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  DatePicker,
  Space,
  Select,
  Popconfirm,
  message,
} from "antd";
import {

  EditOutlined,
  DeleteOutlined,
  EyeFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAppMessage } from "@/providers/query-client-provider";
import {
  useStudentDraftsApproved,
  useUpdateStudentDraft,
  useDeleteStudentDraft,
  StudentDraftResponse,
} from "@/hooks/useStudentDraft";
import { DraftStatus, DraftType, Gender, Grade } from "@/lib/enum";
import { useAcademicYearActive } from "@/hooks/useAcademicYear";
import { Divider } from "antd";
import { Modal } from "antd";

const { Option } = Select;

function StudentDraftApprovedTabs() {
  const { messageApi } = useAppMessage();
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<StudentDraftResponse | null>(
    null
  );

  // React Query hooks
  const { data, isLoading } = useStudentDraftsApproved();
  const updateDraft = useUpdateStudentDraft(updateId || "");
  const deleteDraft = useDeleteStudentDraft();

  // For academic year dropdown
  const { data: activeAcademicYear } = useAcademicYearActive();

  const [openModalParents, setOpenModalParents] = useState(false);
  const [selectedParents, setSelectedParents] = useState<any[]>([]);

  const [form] = Form.useForm();

  console.log(data)


  const handleEdit = (record: StudentDraftResponse) => {
    setEditingDraft(record);
    setUpdateId(record.id);

    form.setFieldsValue({
      email: record.email,
      fullName: record.fullName,
      academicYearId: record.academicYear.id,
      dob: dayjs(record.dob),
      address: record.address,
      grade: record.grade,
      gender: record.gender,
      draftType: record.draftType,
      status: record.status,
      parents:
        record.parents?.map((p) => ({
          fullName: p.fullName || "",
          gender: p.gender || "",
          nik: p.nik || "",
          phone: p.phone || "",
          email: p.email || "",
          address: p.address || "",
        })) || [],
    });
    setOpen(true);
  };
  const handleApprove = async (record: StudentDraftResponse) => {
    if (record.status !== DraftStatus.PENDING) return;
    setUpdateId(record.id);
    try {
      await updateDraft.mutateAsync(
        {
          ...record,
          status: DraftStatus.APPROVED_PENDING, // ubah status
        },
        {
          onSuccess: () => {
            messageApi.success("Student Draft approved");
          },
          onError: (err: any) => {
            messageApi.error(err.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dob: values.dob.toISOString(),
        schoolId: process.env.NEXT_PUBLIC_SCHOOL_ID,
        parents: values.parents?.filter((p: any) =>
          Object.values(p).some((v) => v !== undefined && v !== "")
        ),
      };

      if (editingDraft) {
        await updateDraft.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Student Draft updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDraft.mutateAsync(id, {
      onSuccess: () => messageApi.success("Student Draft deleted"),
      onError: (err: any) => message.error(err.message),
    });
  };

  const handleShowParents = (record: StudentDraftResponse) => {
    setSelectedParents(record.parents || []);
    setOpenModalParents(true);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Academic Year",
      dataIndex: ["academicYear", "name"],
      key: "academicYear",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Draft Type",
      dataIndex: "draftType",
      key: "draftType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Parents",
      key: "parents",
      render: (_: any, record: StudentDraftResponse) => (
        <div>
          {record.parents?.length ? (
            <>
              <div>
                {record.parents
                  .filter((p) => p.fullName)
                  .map((p) => p.fullName)
                  .join(", ")}
              </div>
              <Button
                type="link"
                size="small"
                onClick={() => handleShowParents(record)}
              >
                <EyeFilled />
              </Button>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: StudentDraftResponse) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Are you sure to delete this draft?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
          <Popconfirm
            title="Are you sure to approve this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleApprove(record)}
          >
            <Button>Approve</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Modal
        open={openModalParents}
        onCancel={() => setOpenModalParents(false)}
        title="Parent Details"
        footer={null}
      >
        {selectedParents.length === 0 ? (
          <p>No parent data available.</p>
        ) : (
          selectedParents.map((p, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                padding: 12,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
              }}
            >
              <p>
                <strong>Full Name:</strong> {p.fullName || "-"}
              </p>
              <p>
                <strong>Gender:</strong> {p.gender || "-"}
              </p>
              <p>
                <strong>NIK:</strong> {p.nik || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {p.phone || "-"}
              </p>
              <p>
                <strong>Email:</strong> {p.email || "-"}
              </p>
              <p>
                <strong>Address:</strong> {p.address || "-"}
              </p>
            </div>
          ))
        )}
      </Modal>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1000 }}
      />

      <Drawer
        title={editingDraft ? "Edit Student Draft" : "Create Student Draft"}
        open={open}
        onClose={() => setOpen(false)}
        width={480}
        styles={{ header: { fontWeight: "bold" } }}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Update
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input full name" }]}
          >
            <Input placeholder="e.g. John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email" }]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select gender">
              {Object.values(Gender).map((gender) => (
                <Select.Option key={gender} value={gender}>
                  {gender.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="academicYearId"
            label="Academic Year"
            rules={[{ required: true, message: "Please select academic year" }]}
          >
            <Select placeholder="Select academic year">
              {activeAcademicYear && (
                <Option value={activeAcademicYear.id}>
                  {activeAcademicYear.name}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select DOB" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Optional address" rows={2} />
          </Form.Item>

          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: "Please select grade" }]}
          >
            <Select placeholder="Select grade">
              {Object.values(Grade).map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="draftType"
            label="Draft Type"
            rules={[{ required: true, message: "Please select draft type" }]}
          >
            <Select placeholder="Select draft type">
              {Object.values(DraftType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              {Object.values(DraftStatus).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Form Orang tua ============================================================ */}

          <h3 style={{ marginTop: 24, fontWeight: "bold" }}>
            Orang Tua / Wali #1
          </h3>
          <h3 style={{ marginTop: 24, fontWeight: "bold" }}></h3>
          <Form.Item
            name={["parents", 0, "fullName"]}
            label="Parent 1 Full Name"
            rules={[
              {
                required: true,
                message: "Please input parent's full name",
              },
            ]}
          >
            <Input placeholder="e.g. Sarina Wijaya" />
          </Form.Item>
          <Form.Item
            name={["parents", 0, "gender"]}
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select gender">
              {Object.values(Gender).map((gender) => (
                <Select.Option key={gender} value={gender}>
                  {gender.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={["parents", 0, "nik"]}
            label="Parent 1 NIK"
            rules={[{ required: true, message: "Please input NIK" }]}
          >
            <Input placeholder="16-digit NIK" />
          </Form.Item>

          <Form.Item
            name={["parents", 0, "phone"]}
            label="Parent 1 Phone Number"
            rules={[{ required: true, message: "Please input phone number" }]}
          >
            <Input placeholder="e.g. 081234567890" />
          </Form.Item>

          <Form.Item
            name={["parents", 0, "email"]}
            label="Parent 1 Email"
            extra="Kosongkan jika orang tua tidak punya email (sistem akan membuatkan otomatis)."
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item name={["parents", 0, "address"]} label="Parent 1 Address">
            <Input.TextArea placeholder="Optional address" rows={2} />
          </Form.Item>

          <Divider />

          {/* Form Orang tua =================================================================================*/}
          <h3 style={{ marginTop: 24, fontWeight: "bold" }}>
            Orang Tua / Wali #2
          </h3>
          <Form.Item
            name={["parents", 1, "fullName"]}
            label="Parent 2 Full Name"
          >
            <Input placeholder="e.g. Ahmad Wijaya" />
          </Form.Item>
          <Form.Item name={["parents", 1, "gender"]} label="Gender">
            <Select placeholder="Select gender">
              {Object.values(Gender).map((gender) => (
                <Select.Option key={gender} value={gender}>
                  {gender.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name={["parents", 1, "nik"]} label="Parent 2 NIK">
            <Input placeholder="16-digit NIK" />
          </Form.Item>

          <Form.Item
            name={["parents", 1, "phone"]}
            label="Parent 2 Phone Number"
          >
            <Input placeholder="e.g. 081234567891" />
          </Form.Item>

          <Form.Item
            name={["parents", 1, "email"]}
            label="Parent 2 Email"
            extra="Kosongkan jika tidak ada"
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item name={["parents", 1, "address"]} label="Parent 2 Address">
            <Input.TextArea placeholder="Optional address" rows={2} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default StudentDraftApprovedTabs;
