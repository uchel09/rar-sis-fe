
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
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  StudentResponse,
} from "@/hooks/useStudent";
import { Gender } from "@/lib/enum";

function StudentPage() {
  const { data, isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateStudent = useUpdateStudent(updateId || "");
  const deleteStudent = useDeleteStudent();
  const { messageApi } = useAppMessage();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(
    null
  );

  const handleCreate = () => {
    setEditingStudent(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: StudentResponse) => {
    setEditingStudent(record);
    setUpdateId(record.id);
    form.setFieldsValue({
      fullName: record.user.fullName,
      email: record.user.email,
      dob: dayjs(record.dob),
      address: record.address,
      gender: record.user.gender,
      enrollmentNumber: record.enrollmentNumber,
      classId: record.class?.id,
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
        schoolId: process.env.NEXT_PUBLIC_SCHOOL_ID,
      };

      if (editingStudent) {
        await updateStudent.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Student updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        payload.password = "student1234";
        payload.isActive = true;
        await createStudent.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Student created");
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
    await deleteStudent.mutateAsync(id, {
      onSuccess: () => messageApi.success("Student deleted"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  const columns = [
    { title: "Full Name", dataIndex: ["user", "fullName"], key: "fullName" },
    { title: "Email", dataIndex: ["user", "email"], key: "email" },
    { title: "Gender", dataIndex: ["user", "gender"], key: "gender" },
    {
      title: "Enrollment Number",
      dataIndex: "enrollmentNumber",
      key: "enrollmentNumber",
    },
    { title: "Class", dataIndex: ["class", "name"], key: "class" },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: StudentResponse) => (
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
          Add Student
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
        title={editingStudent ? "Edit Student" : "Create Student"}
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
                createStudent.isPending ||
                (editingStudent && updateStudent.isPending)
              }
            >
              {editingStudent ? "Update" : "Create"}
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
          <Form.Item name="enrollmentNumber" label="Enrollment Number">
            <Input />
          </Form.Item>
          <Form.Item name="classId" label="Class">
            <Input />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select DOB" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          {editingStudent && (
            <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
}

export default StudentPage;
