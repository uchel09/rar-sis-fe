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
  Select,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  ClassResponse,
  CreateClassRequest,
} from "@/hooks/useClass";
import { useAcademicYears } from "@/hooks/useAcademicYear"; // misal kamu punya hook untuk tahun ajaran
import { useTeachers } from "@/hooks/useTeacher"; // untuk homeroom teacher
import { Grade } from "@/lib/enum";

function ClassPage() {
  const { data, isLoading } = useClasses();
  const createClass = useCreateClass();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateClass = useUpdateClass(updateId || "");
  const deleteClass = useDeleteClass();
  const { messageApi } = useAppMessage();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassResponse | null>(null);

  const { data: academicYears } = useAcademicYears();
  const { data: teachers } = useTeachers();

  // === CRUD HANDLERS ===

  const handleCreate = () => {
    setEditingClass(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: ClassResponse) => {
    setEditingClass(record);
    setUpdateId(record.id);
    form.setFieldsValue({
      name: record.name,
      grade: record.grade,
      academicYearId: record.academicYear.id,
      homeroomTeacherId: record.homeroomTeacher?.id,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateClassRequest = {
        schoolId: process.env.NEXT_PUBLIC_SCHOOL_ID as string,
        ...values,
      };

      if (editingClass) {
        await updateClass.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Class updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createClass.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Class created");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteClass.mutateAsync(id, {
      onSuccess: () => messageApi.success("Class deleted"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  // === TABLE COLUMNS ===

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (grade: Grade) => grade.replace("_", " "),
    },
    {
      title: "Academic Year",
      dataIndex: ["academicYear", "name"],
      key: "academicYear",
    },
    {
      title: "Homeroom Teacher",
      dataIndex: ["homeroomTeacher", "fullname"],
      key: "homeroomTeacher",
      render: (val: string) => val || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ClassResponse) => (
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
          Add Class
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
      />

      <Drawer
        title={editingClass ? "Edit Class" : "Create Class"}
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
                createClass.isPending || (editingClass && updateClass.isPending)
              }
            >
              {editingClass ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Class Name"
            rules={[{ required: true, message: "Please input class name" }]}
          >
            <Input placeholder="e.g. 7A, 8B" />
          </Form.Item>

          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: "Please select grade" }]}
          >
            <Select placeholder="Select grade">
              {Object.values(Grade).map((grade) => (
                <Select.Option key={grade} value={grade}>
                  {grade.replace("_", " ")}
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
              {academicYears?.data?.map((ay) => (
                <Select.Option key={ay.id} value={ay.id}>
                  {ay.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="homeroomTeacherId" label="Homeroom Teacher">
            <Select placeholder="Select homeroom teacher (optional)">
              {teachers?.data?.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.user.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default ClassPage;
