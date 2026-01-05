/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAppMessage } from "@/providers/query-client-provider";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  DatePicker,
  Space,
  Popconfirm,
  Switch,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  TeacherResponse,
  useCreateDummyTeacher,
  useDeleteDummyTeacher,
} from "@/hooks/useTeacher";
import { Gender } from "@/lib/enum";
import { Modal } from "antd";

function TeacherPage() {
  const { data, isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateTeacher = useUpdateTeacher(updateId || "");
  const deleteTeacher = useDeleteTeacher();
  const createDummy = useCreateDummyTeacher();
  const deleteDummy = useDeleteDummyTeacher();
  const { messageApi } = useAppMessage();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherResponse | null>(
    null
  );
  console.log(data);

  const handleCreate = () => {
    setEditingTeacher(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: TeacherResponse) => {
    setEditingTeacher(record);
    setUpdateId(record.id);
    form.setFieldsValue({
      fullName: record.user.fullName,
      email: record.user.email,
      phone: record.phone,
      nik: record.nik,
      nip: record.nip,
      dob: dayjs(record.dob),
      hireDate: record.hireDate ? dayjs(record.hireDate) : undefined,
      isActive: record.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dob: values.dob.toISOString(),
        hireDate: values.hireDate?.toISOString(),
        password: "guru1234",
        schoolId: process.env.NEXT_PUBLIC_SCHOOL_ID,
      };

      if (editingTeacher) {
        await updateTeacher.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Teacher updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createTeacher.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Teacher created");
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
    await deleteTeacher.mutateAsync(id, {
      onSuccess: () => messageApi.success("Teacher deleted"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  const handleCreateDummy = () => {
    createDummy.mutate(undefined, {
      onSuccess: (res) => {
        messageApi.success("20 dummy teacher created");
      },
      onError: (err: any) => {
        messageApi.error(err?.message || "Gagal membuat dummy teacher");
      },
    });
  };

  // ===============================
  // 🗑️ DELETE DUMMY TEACHER (CONFIRM)
  // ===============================
 const handleDeleteDummy = () => {
   const ok = window.confirm(
     "Yakin mau hapus semua dummy teacher?\nData tidak bisa dikembalikan."
   );

   if (!ok) return;

   deleteDummy.mutate(undefined, {
     onSuccess: (res) => {
       messageApi.success(res.message);
     },
     onError: () => {
       messageApi.error("Gagal menghapus dummy teacher");
     },
   });
 };

  const columns = [
    { title: "Full Name", dataIndex: ["user", "fullName"], key: "fullName" },
    { title: "Email", dataIndex: ["user", "email"], key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "NIK", dataIndex: "nik", key: "nik" },
    { title: "NIP", dataIndex: "nip", key: "nip" },
    { title: "Gender", dataIndex: ["user", "gender"], key: "gender" },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Hire Date",
      dataIndex: "hireDate",
      key: "hireDate",
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TeacherResponse) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Teacher
        </Button>
        <Button
          style={{ backgroundColor: "#c47404ff", marginLeft: "20px" }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateDummy}
        >
          Generate Custom Teacher
        </Button>
        <Button
          style={{ backgroundColor: "#ff0808ff", marginLeft: "20px" }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleDeleteDummy}
        >
          Reset Teacher
        </Button>
      </Space>

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
        title={editingTeacher ? "Edit Teacher" : "Create Teacher"}
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={
                createTeacher.isPending ||
                (editingTeacher && updateTeacher.isPending)
              }
            >
              {editingTeacher ? "Update" : "Create"}
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
            <Input />
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
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nik"
            label="NIK"
            rules={[{ required: true, message: "Please input NIK" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="nip" label="NIP">
            <Input />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select DOB" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="hireDate" label="Hire Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {editingTeacher && (
            <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked" // supaya Switch mengikat boolean
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
}

export default TeacherPage;
