/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAppMessage } from "@/providers/query-client-provider";
import { Table, Button, Drawer, Form, Input, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
  SubjectResponse,
} from "@/hooks/useSubject";
import { Option } from "antd/es/mentions";
import { Grade } from "@/lib/enum";
import { Select } from "antd";

function SubjectPage() {
  const { data, isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateSubject = useUpdateSubject(updateId || "");
  const deleteSubject = useDeleteSubject();
  const { messageApi } = useAppMessage();
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectResponse | null>(
    null
  );

  const handleCreate = () => {
    setEditingSubject(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: SubjectResponse) => {
    setEditingSubject(record);
    setUpdateId(record.id);
    form.setFieldsValue({
      name: record.name,
      grade: record.grade
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        schoolId: process.env.NEXT_PUBLIC_SCHOOL_ID,
      };
      console.log(payload)

      if (editingSubject) {
        await updateSubject.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Subject updated");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createSubject.mutateAsync(payload, {
          onSuccess: () => {
            messageApi.success("Subject created");
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
    await deleteSubject.mutateAsync(id, {
      onSuccess: () => messageApi.success("Subject deleted"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  const columns = [
    { title: "Nama Mata Pelajaran", dataIndex: "name", key: "name" },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },

 
    {
      title: "Aksi",
      key: "actions",
      render: (_: any, record: SubjectResponse) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Yakin ingin menghapus?"
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
          Tambah Mata Pelajaran
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
        title={editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={
                createSubject.isPending ||
                (editingSubject && updateSubject.isPending)
              }
            >
              {editingSubject ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
       
          <Form.Item
            name="name"
            label="Nama Mata Pelajaran"
            rules={[{ required: true, message: "Masukkan nama mapel" }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: "Please select grade" }]}
          >
            <Select
              placeholder="Select grade"
              onChange={(value: Grade) => setSelectedGrade(value)}
            >
              {Object.values(Grade).map((g) => {
                const gradeLabelMap: Record<Grade, string> = {
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

                return (
                  <Option key={g} value={g}>
                    {gradeLabelMap[g] ?? g}{" "}
                    {/* fallback kalau belum didefinisikan */}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default SubjectPage;
