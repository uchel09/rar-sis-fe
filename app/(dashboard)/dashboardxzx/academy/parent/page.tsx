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
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useParents,
  useCreateParent,
  useUpdateParent,
  useDeleteParent,
  ParentResponse,
} from "@/hooks/useParent";
import { Gender } from "@/lib/enum";

function ParentPage() {
  const { data, isLoading } = useParents();
  const createParent = useCreateParent();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateParent = useUpdateParent(updateId || "");
  const deleteParent = useDeleteParent();
  const { messageApi } = useAppMessage();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentResponse | null>(
    null
  );

  const handleCreate = () => {
    setEditingParent(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: ParentResponse) => {
    setEditingParent(record);
    setUpdateId(record.id);
    form.setFieldsValue({
      fullName: record.user.fullName,
      email: record.user.email,
      phone: record.phone,
      nik: record.nik,
      address: record.address,
      dob: dayjs(record.dob),
      gender: record.user.gender,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dob: values.dob.toISOString(),
        password: "parent1234",
      };

      if (editingParent) {
        await updateParent.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Parent updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createParent.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Parent created");
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
    await deleteParent.mutateAsync(id, {
      onSuccess: () => messageApi.success("Parent deleted"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  const columns = [
    { title: "Full Name", dataIndex: ["user", "fullName"], key: "fullName" },
    { title: "Email", dataIndex: ["user", "email"], key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "NIK", dataIndex: "nik", key: "nik" },
    { title: "Gender", dataIndex: ["user", "gender"], key: "gender" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Students",
      key: "students",
      render: (_: any, record: ParentResponse) =>
        record.students?.length
          ? record.students.map((s) => s.fullName).join(", ")
          : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ParentResponse) => (
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
          Add Parent
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
        title={editingParent ? "Edit Parent" : "Create Parent"}
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
                createParent.isPending ||
                (editingParent && updateParent.isPending)
              }
            >
              {editingParent ? "Update" : "Create"}
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

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select DOB" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ParentPage;
