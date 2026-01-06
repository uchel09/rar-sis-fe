"use client";

import React, { useState, useMemo } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Select,
  Button,
  Drawer,
  Grid,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Popover } from "antd";
import { useLogout } from "@/hooks/useAuth";
import { useAppMessage } from "@/providers/query-client-provider";

const { Header, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

// Tema warna terstruktur
const themes = {
  putih: {
    header: "#ffffff",
    sidebar: "#ffffff",
    sidebarCard: "#90caf9",
    content: "#f5f5f5",
    text: "#212121",
    hover: "#e3f2fd",
    selected: "#64b5f6",
  },
  hijau: {
    header: "#11d868ff",
    sidebar: "#ffffffff",
    sidebarCard: "#66bb6a",
    content: "#ffffff",
    text: "#2e7d32",
    hover: "#c8e6c9",
    selected: "#388e3c",
  },
  pink: {
    header: "#f97fceff",
    sidebar: "#fff",
    sidebarCard: "#f06292",
    content: "#ffffff",
    text: "#ad1457",
    hover: "#f8bbd0",
    selected: "#d81b60",
  },
  biru: {
    header: "#90caf9",
    sidebar: "#FFF",
    sidebarCard: "#64b5f6",
    content: "#ffffff",
    text: "#1565c0",
    hover: "#bbdefb",
    selected: "#1976d2",
  },
};

function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [themeColor, setThemeColor] = useState<keyof typeof themes>("putih");
  const [openDrawer, setOpenDrawer] = useState(false);
  const logout = useLogout();
  const currentTheme = themes[themeColor];
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const pathname = usePathname(); // ✅ ambil path aktif
   const { messageApi } = useAppMessage();

   const handleLogout = async () => {
     try {
       // pake mutateAsync biar bisa await dan ambil response
       const response = await logout.mutateAsync();
       messageApi.success("Anda telah Logout")
       window.location.replace("/login");
     } catch (err) {
       console.error("Logout error:", err);
     }
   };
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {[
        {
          key: "profile",
          label: "Profil",
          icon: <UserOutlined />,
          onClick: () => console.log("Buka Profil"),
        },
        {
          key: "settings",
          label: "Pengaturan",
          icon: <SettingOutlined />,
          onClick: () => console.log("Buka Pengaturan"),
        },
        {
          key: "logout",
          label: "Keluar",
          icon: <LogoutOutlined />,
          onClick:handleLogout,
        },
      ].map((item) => (
        <div
          key={item.key}
          style={{
            padding: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onClick={item.onClick}
        >
          {item.icon} {item.label}
        </div>
      ))}
    </div>
  );

  const selectedKeys = useMemo(() => {
    if (!pathname) return ["1"];

    if (pathname.includes("/dashboard/teacher")) {
      if (pathname.includes("/schedule")) return ["2-1"];
      if (pathname.includes("/subject-teacher-attendance")) return ["2-3"];
      if (pathname.includes("/subject-teacher")) return ["2-2"];

      // dst mapping sesuai kebutuhan
      return ["1"];
    }
    return ["1"];
  }, [pathname]);

  // Sidebar items langsung pakai `label` berupa Link
  const sidebarItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard/teacher">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <BookOutlined />,
      label: "Akademik",
      children: [
        {
          key: "2-1",
          icon: <TeamOutlined />,
          label: <Link href={`/dashboard/teacher/schedule`}>Jadwal Mapel</Link>,
        },
        {
          key: "2-2",
          icon: <UserOutlined />,
          label: (
            <Link href="/dashboard/teacher/subject-teacher">Guru Mapel</Link>
          ),
        },
        {
          key: "2-3",
          icon: <BookOutlined />,
          label: (
            <Link href="/dashboard/teacher/subject-teacher-attendance">
              Kehadiran Siswa
            </Link>
          ),
        },
      ],
    },
  ];

  const sidebarMenu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={sidebarItems}
      inlineIndent={16}
      rootClassName="custom-menu"
      selectedKeys={selectedKeys} // ✅ ini yang bikin aktif
    />
  );

   

  return (
    <Layout style={{ minHeight: "100vh", background: currentTheme.content }}>
      {/* Sidebar desktop */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            background: currentTheme.sidebar,
            overflowY: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
          }}
        >
          <div
            style={{
              height: 64,
              margin: 16,
              background: currentTheme.sidebarCard,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {collapsed ? "S" : "Sekolah"}
          </div>
          {sidebarMenu}
        </Sider>
      )}

      {/* Sidebar mobile */}
      {isMobile && (
        <Drawer
          title="Sekolah"
          placement="left"
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          styles={{
            header: { background: currentTheme.sidebarCard, color: "#fff" },
            body: {
              padding: 0,
              background: currentTheme.sidebar,
              height: "100%",
            },
          }}
        >
          {sidebarMenu}
        </Drawer>
      )}

      {/* Main layout */}
      <Layout style={{ background: currentTheme.content }}>
        <Header
          style={{
            padding: "0 16px",
            background: currentTheme.header,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                type="text"
                icon={
                  <MenuOutlined
                    style={{
                      color:
                        themeColor === "putih" ? currentTheme.text : "#fff",
                      fontSize: 20,
                    }}
                  />
                }
                onClick={() => setOpenDrawer(true)}
              />
            )}
            <Title
              level={4}
              style={{
                margin: 0,
                color: themeColor === "putih" ? currentTheme.text : "#fff",
              }}
            >
              Dashboard Teacher
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Select
              value={themeColor}
              onChange={setThemeColor}
              style={{ width: 120 }}
            >
              <Option value="hijau">Hijau</Option>
              <Option value="pink">Pink</Option>
              <Option value="putih">Putih</Option>
              <Option value="biru">Biru</Option>
            </Select>

            <BellOutlined
              style={{
                fontSize: 18,
                color: themeColor === "putih" ? currentTheme.text : "#fff",
              }}
            />
            <Popover content={content} trigger="click" placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
            </Popover>
          </div>
        </Header>

        <div style={{ padding: 16 }}>{children}</div>

        {/* Global CSS untuk Menu */}
        <style jsx global>{`
          .custom-menu,
          .custom-menu .ant-menu-item,
          .custom-menu .ant-menu-submenu-title {
            background: transparent !important;
            color: ${currentTheme.text} !important;
          }

          .custom-menu .ant-menu-item-selected,
          .custom-menu .ant-menu-submenu-title.ant-menu-submenu-active {
            background-color: ${currentTheme.selected} !important;
            color: #fff !important;
          }

          .custom-menu .ant-menu-item:hover,
          .custom-menu .ant-menu-submenu-title:hover {
            background-color: ${currentTheme.hover} !important;
            color: ${currentTheme.text} !important;
          }

          .ant-menu-submenu-popup {
            background: ${currentTheme.sidebar} !important;
          }

          .ant-menu-submenu-popup .ant-menu-item {
            color: ${currentTheme.text} !important;
          }

          .ant-menu-submenu-popup .ant-menu-item-selected {
            background-color: ${currentTheme.selected} !important;
            color: #fff !important;
          }

          .ant-menu-submenu-popup .ant-menu-item:hover {
            background-color: ${currentTheme.hover} !important;
            color: ${currentTheme.text} !important;
          }

          .ant-layout-sider-trigger {
            background: ${currentTheme.sidebarCard} !important;
            color: ${themeColor === "putih"
              ? currentTheme.text
              : "#fff"} !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }
          .ant-layout-sider-trigger:hover {
            background: ${currentTheme.hover} !important;
            color: ${currentTheme.text} !important;
          }
        `}</style>
      </Layout>
    </Layout>
  );
}

export default DashboardAdminLayout;
