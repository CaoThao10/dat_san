import React, { useEffect, useRef, useState } from "react";
import { Space, Table } from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const RevenueManagement = () => {
  const columns = [
    {
      title: "Mã sân",
      dataIndex: "createdId",
      key: "createdId",
      render: (createdId) => <span className="font-semibold">{createdId}</span>,
    },
    {
      title: "Tên sân",
      dataIndex: "code",
      key: "code ",
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Thời gian thuê",
      dataIndex: "timer",
      key: "timer ",
      render: (timer) => <span className="font-semibold">{timer}</span>,
    },
    {
      title: "Ngày thuê",
      dataIndex: "date",
      key: "date ",
      render: (date) => <span className="font-semibold">{date}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total ",
      render: (total) => <span className="font-semibold">{total}</span>,
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <button>
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>
          <button>
            {" "}
            <DeleteOutlined className="text-red-500 text-2xl" />
          </button>
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: 1,
      createdId: "1",
      code: "Sân Hà Nội",
      timer: "2h",
      date: "15/02/2222",
      total: "500.000 vnđ",
    },
    {
      key: 2,
      createdId: "2",
      code: "Sân Sài Gòn",
      timer: "4h",
      date: "15/02/2222",
      total: "1.000.000 vnđ",
    },
  ];

  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-col bg-gray-100 h-[calc(100vh-60px)] w-full p-5 ">
        <div className=" bg-white w-full h-[50px] p-10 items-center rounded-lg flex justify-between">
          <span className="text-xl font-medium text-green-600">
            Quản lý doanh thu
          </span>
        </div>
        <div className=" w-full">
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;
