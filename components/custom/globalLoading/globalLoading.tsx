import { Spin } from 'antd';
import React from 'react'

const GlobalLoading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Spin tip="Loading..." fullscreen size="large" />
    </div>
  );
}

export default GlobalLoading