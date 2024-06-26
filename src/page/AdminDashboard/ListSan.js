import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Spin,
  message,
  Upload,
  Popconfirm,
} from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../firebase-app/firebase-auth";
import slugify from "slugify";
const { TextArea } = Input;

const ListSan = () => {
  // const [file, setFile] = useState(null);
  const [url, setURL] = useState("");
  const [localStorageData, setLocalStorageData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [editData, setEditData] = useState();
  const [form] = Form.useForm();

  function handleChange(e) {
    // if (e.target.files[0]) setFile(e.target.files[0]);
    if (e.target.files[0]) {
      handleUploadImage(e.target.files[0]);
    }
  }

  useEffect(() => {
    if (localStorageData) {
      async function fetchSans() {
        // const colRef = collection(db, "listsan");
        const newRef = query(
          collection(db, "listsan"),
          where("userId", "==", String(localStorageData.id))
        );
        onSnapshot(newRef, (snapshot) => {
          const result = [];
          snapshot.forEach((san) => {
            result.push({
              id: san.id,
              ...san.data(),
            });
          });
          setDataSource(result);
        });
      }
      fetchSans();
    }
  }, [localStorageData]);

  const handleUploadImage = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progressPercent + "% done");
        setProgressPercent(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Not file");
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setURL(downloadURL);
          message.success("Tải ảnh thành công");
        });
      }
    );
  };

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    setLocalStorageData(localStorageData);
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "createdId",
      key: "createdId",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name ",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address ",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price ",
    },
    {
      title: "Diện tích",
      dataIndex: "acr",
      key: "acr ",
      render: (text) => <span>{text} m2</span>,
    },
    {
      title: "Thời gian mở cửa",
      dataIndex: "time",
      key: "time ",
      render: (text) => (
        <span>{text?.length > 0 && text?.map((item) => <p>{item}</p>)}</span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              form.setFieldsValue({
                name: record.name,
                address: record.address,
                acr: record.acr,
                time: record.time?.map((time) => dayjs(time, "HH:mm A")),
                price: record.price,
                description: record.description,
              });
              setURL(record.image);
              setEditData(record?.id);
              setIsModalOpen(true);
            }}
          >
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>
          <Popconfirm
            title="Xóa sân"
            description="Bạn có chắc chắn muốn xóa sân?"
            onConfirm={async () => {
              const singleDoc = doc(db, "listsan", record.id);
              await deleteDoc(singleDoc);
              message.success("Xóa sân thành công");
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="text-red-500 text-2xl" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditData("");
  };

  const onFinish = async (values) => {
    if (progressPercent !== 100 && progressPercent !== 0) {
      return message.error("Vui lòng chờ ảnh tải lên hoàn tất");
    }
    if (!url) return message.error("Vui lòng chọn ảnh");
    if (values?.time[0] >= values?.time[1])
      return message.error("Thời gian mở cửa không hợp lệ");
    if (values.price < 0) return message.error("Giá không hợp lệ");
    if (values.acr < 0) return message.error("Diện tích không hợp lệ");
    if (!values.name || !values.address)
      return message.error("Vui lòng nhập đầy đủ thông tin");
    try {
      if (editData) {
        const colRef = doc(db, "listsan", editData);
        await updateDoc(colRef, {
          ...values,
          time: values?.time?.map((time) => dayjs(time).format("HH:mm A")),
          image: url,
          slug: slugify(values.name, {
            lower: true,
          }),
        });
        message.success("Cập nhật sân thành công");
      } else {
        const colRef = collection(db, "listsan");
        await addDoc(colRef, {
          ...values,
          time: values?.time?.map((time) => dayjs(time).format("HH:mm A")),
          userId: localStorageData?.id,
          image: url,
          phone: localStorageData?.phone,
          email: localStorageData?.email,
          slug: slugify(values.name, {
            lower: true,
          }),
        });
        message.success("Tạo mới sân thành công");
      }
      form.resetFields();
      setIsModalOpen(false);
      setURL("");
    } catch (e) {
      console.log(e);
      message.error("Tạo mới sân thất bại");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col bg-gray-100 h-[calc(100vh-60px)] w-full p-5">
        <div className="bg-white rounded-lg flex flex-col gap-5 p-5">
          <div className=" w-full h-[50px] items-center flex justify-between">
            <span className="text-2xl">Danh sách sân</span>
            <div className="flex gap-x-3">
              {/* <input
                className="outline-none px-2 py-1 border rounded-lg border-green-300"
                type="text"
                placeholder="Tìm kiếm"
              /> */}
              <button
                onClick={showModal}
                className="bg-green-600 text-white p-2 font-medium rounded-md hover:bg-green-300"
              >
                Tạo mới sân
              </button>
            </div>
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

      <div className="modal">
        <Modal
          className="headerModal"
          title="Tạo mới sân"
          open={isModalOpen}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>
              ĐÓNG
            </Button>,
            <Button htmlType="submit" type="primary" form="form" name="form">
              {editData ? "Cập nhật" : "Tạo mới"}
            </Button>,
          ]}
        >
          <div className="ant_body">
            <Form layout="vertical" form={form} name="form" onFinish={onFinish}>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Tên sân"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên sân" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                  <Input />
                </Form.Item>
                <Form.Item label="Diện tích" name="acr">
                  <Input />
                </Form.Item>
                <Form.Item label="Giờ mở cửa" name="time">
                  <TimePicker.RangePicker format={"HH:mm"} className="w-full" />
                </Form.Item>
                <Form.Item label="Giá thuê/h" name="price">
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                  <TextArea />
                </Form.Item>
              </div>
              <input type="file" onChange={handleChange} />

              {/* {url && (progressPercent === 0 || progressPercent === 100) && (
                <img src={url} alt="" className="w-14 h-14 object-contain" />
              )}
              <Spin
                spinning={
                  progressPercent === 100 || progressPercent === 0
                    ? false
                    : true
                }
              ></Spin> */}
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ListSan;
