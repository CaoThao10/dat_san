import React, { useEffect, useState } from "react";
import HeadingUser from "../../components/layout/HeadingUser";
import Footer1 from "../../components/layout/Footer1";
import { TimePicker } from "antd";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-auth";
import { useParams } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";

const DetailPage = () => {
  const [value, setValue] = useState(null);
  const [localStorageData, setLocalStorageData] = useState(null);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const onChangeTime = (time) => {
    console.log(time);
    setValue(time);
  };

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    setLocalStorageData(localStorageData);
  }, []);
  useEffect(() => {
    async function fetchSans() {
      if (!id) return;
      const colRef = query(
        collection(db, "listsan"),
        where("slug", "==", id),
        limit(1)
      );
      onSnapshot(colRef, (snapshot) => {
        snapshot.forEach((doc) => {
          setData({
            id: doc?.id,
            ...doc?.data(),
          });
        });
      });
    }
    fetchSans();
  }, []);
  const handleBook = async () => {
    try {
      const colRef = collection(db, "san_booking");
      await addDoc(colRef, {
        id_san: data?.id,
        time: value?.map((time) => dayjs(time).format("HH:mm A")),
        date: dayjs().format("DD/MM/YYYY"),
        name: data?.name,
        price: data?.price,
        emailOwner: data?.email || "",
        userIdOwner: data?.userId || "",
        code: Math.floor(Math.random() * 1000000),
        userId: localStorageData?.id || "",
        phone: localStorageData?.phone || "",
        email: localStorageData?.email || "",
        status: "pending",
      });
      message.success("Đặt sân thành công");
    } catch (e) {
      console.log(e);
      message.error("Đặt sân thất bại");
    }
  };

  return (
    <div>
      <HeadingUser></HeadingUser>
      <div className="my-10 w-full items-center justify-center h-full flex flex-col">
        <div className="flex gap-5 w-[50%]">
          {/* <Carousel autoplay> */}
          <div className="w-[60%] aspect-video">
            <img
              className="object-cover rounded-lg h-full w-full"
              src={data?.image}
              alt=""
            />
          </div>
          {/* </Carousel> */}
          <div className="flex flex-col gap-y-3 ">
            <div>
              <span className="mt-2 text-xl text-green-500 font-semibold">
                {data?.name}
              </span>
            </div>
            <p>
              <strong>Giá:</strong> {data?.price ? data?.price : "0"}/h VNĐ
            </p>
            <div>
              <span className="font-semibold">
                Thời gian mở cửa:{" "}
                {data?.time?.length > 0 &&
                  data?.time?.map((item, index) => {
                    return (
                      <span>
                        {item} {index === 0 ? " - " : ""}
                      </span>
                    );
                  })}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Chọn giờ: </span>
              <TimePicker.RangePicker
                format={"HH:mm"}
                className="w-full"
                onChange={onChangeTime}
              />
            </div>
            <button
              className="bg-green-500 max-w-[100px] py-1 px-2 rounded-lg text-white font-sans text-lg hover:bg-green-400"
              onClick={handleBook}
            >
              Đặt ngay
            </button>
          </div>
        </div>
        <div className="flex w-[50%]">
          <div className="flex flex-col my-5 gap-y-3 ">
            <span>
              <strong>Địa chỉ:</strong> {data?.address}
            </span>
            <span>
              <strong>Diện tích:</strong> {data?.acr ? data?.acr : "0"} m2
            </span>
            <span>
              <strong>SĐT chủ sân:</strong>{" "}
              {data?.phone ? data?.phone : "Không có"}
            </span>

            <span>
              <strong>Giờ mở cửa:</strong>{" "}
              {data?.time?.length > 0 &&
                data?.time?.map((item, index) => {
                  return (
                    <span>
                      {item} {index === 0 ? " - " : ""}
                    </span>
                  );
                })}
            </span>
            <span>
              <strong>Giá:</strong> {data?.price ? data?.price : "0"}/h VNĐ
            </span>
            <span>
              <strong>Mô tả:</strong> {data?.description}
            </span>
          </div>
        </div>
      </div>
      <Footer1></Footer1>
    </div>
  );
};

export default DetailPage;
