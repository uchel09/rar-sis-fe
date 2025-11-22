/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAppMessage } from "@/providers/query-client-provider";
import { Table, Button, Drawer, Form, Select, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useSubjectTeachers,
  useCreateSubjectTeacher,
  useUpdateSubjectTeacher,
  useDeleteSubjectTeacher,
  SubjectTeacherResponse,
} from "@/hooks/useSubjectTeacher";
import { useSubjects } from "@/hooks/useSubject";
import { useTeachers } from "@/hooks/useTeacher"; // asumsi kamu punya hook ambil daftar guru

const { Option } = Select;

function SubjectTeacherDashboard() {
  const { data, isLoading } = useSubjectTeachers();
  const { data: subjects } = useSubjects();
  const { data: teachers } = useTeachers();

  const createSubjectTeacher = useCreateSubjectTeacher();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const updateSubjectTeacher = useUpdateSubjectTeacher(updateId || "");
  const deleteSubjectTeacher = useDeleteSubjectTeacher();

  const { messageApi } = useAppMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubjectTeacherResponse | null>(
    null
  );

  // ✅ Buka drawer untuk tambah data baru
  const handleCreate = () => {
    setEditingItem(null);
    setUpdateId(null);
    form.resetFields();
    setOpen(true);
  };

  // ✅ Buka drawer untuk edit data
  const handleEdit = (record: SubjectTeacherResponse) => {
    setEditingItem(record);
    setUpdateId(record.id);
    console.log(record)
    form.setFieldsValue({
      subjectId: record.subject?.id,
      teacherId: record.teacher?.id,
    });
    setOpen(true);
  };

  // ✅ Submit create/update
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await updateSubjectTeacher.mutateAsync(values, {
          onSuccess: () => {
            messageApi.success("Guru Mapel berhasil diperbarui");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      } else {
        await createSubjectTeacher.mutateAsync(values, {
          onSuccess: () => {
            messageApi.success("Guru Mapel berhasil dibuat");
            setOpen(false);
          },
          onError: (err: any) => messageApi.error(err.message),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Delete relasi
  const handleDelete = async (id: string) => {
    await deleteSubjectTeacher.mutateAsync(id, {
      onSuccess: () => messageApi.success(" Subject Teacher sukses dihapus"),
      onError: (err: any) => messageApi.error(err.message),
    });
  };

  // ✅ Kolom tabel
  const columns = [
    {
      title: "Mata Pelajaran",
      dataIndex: ["subject", "name"],
      key: "subjectName",
    },
    {
      title: "Guru",
      dataIndex: ["teacher", "user", "fullname"],
      key: "teacherFullName",
    },
    {
      title: "Aksi",
      key: "actions",
      render: (_: any, record: SubjectTeacherResponse) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Yakin ingin menghapus relasi ini?"
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
          Tambah Relasi Subject-Teacher
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
        title={
          editingItem
            ? "Edit Relasi Subject-Teacher"
            : "Tambah Relasi Subject-Teacher"
        }
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
                createSubjectTeacher.isPending ||
                (editingItem && updateSubjectTeacher.isPending)
              }
            >
              {editingItem ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="subjectId"
            label="Mata Pelajaran"
            rules={[{ required: true, message: "Pilih mata pelajaran" }]}
          >
            <Select placeholder="Pilih mata pelajaran">
              {subjects?.data?.map((subj) => (
                <Option key={subj.id} value={subj.id}>
                  {subj.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teacherId"
            label="Guru"
            rules={[{ required: true, message: "Pilih guru" }]}
          >
            <Select placeholder="Pilih guru">
              {teachers?.data?.map((teacher: any) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.user?.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default SubjectTeacherDashboard;
