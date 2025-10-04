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
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
  AcademicYearResponse,
} from "@/hooks/useAcademicYear";
import { Switch } from "antd";

function AcademicYearPage() {
  const { data, isLoading } = useAcademicYears();
  const createAcademicYear = useCreateAcademicYear();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateAcademicYear = useUpdateAcademicYear(updateId || "");
  const deleteAcademicYear = useDeleteAcademicYear();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYearResponse | null>(
    null
  );
  const { messageApi } = useAppMessage();

  const handleCreate = () => {
    setEditingYear(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: AcademicYearResponse) => {
    setEditingYear(record);
    setUpdateId(record.id);
    console.log(record.id);
    form.setFieldsValue({
      name: record.name,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
      isActive: record.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      if (editingYear) {
        await updateAcademicYear.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Academic Year updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createAcademicYear.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Academic Year created");
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
    await deleteAcademicYear.mutateAsync(id, {
      onSuccess: () => messageApi.success("Academic Year deleted"),
      onError: (err: any) => message.error(err.message),
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AcademicYearResponse) => (
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
          Add Academic Year
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
        scroll={{ x: 800 }}
      />

      <Drawer
        title={editingYear ? "Edit Academic Year" : "Create Academic Year"}
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        styles={{ header: { fontWeight: "bold" } }} // ✅ ga ada warning lagi
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={
                createAcademicYear.isPending ||
                (editingYear && updateAcademicYear.isPending)
              }
            >
              {editingYear ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Academic Year Name"
            rules={[{ required: true, message: "Please input name" }]}
          >
            <Input placeholder="e.g. 2025/2026" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Is Active"
            valuePropName="checked" // supaya Switch mengikat boolean
          >
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default AcademicYearPage;
