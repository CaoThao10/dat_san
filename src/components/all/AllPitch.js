import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-app/firebase-auth";
import { NavLink } from "react-router-dom";

const AllPitch = ({ data }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    async function fetchSans() {
      // const colRef = collection(db, "listsan");
      const newRef = query(collection(db, "listsan"));
      onSnapshot(newRef, (snapshot) => {
        const result = [];
        snapshot.forEach((san) => {
          result.push({
            id: san.id,
            ...san.data(),
          });
        });
        setDataSource(result);
        console.log(result);
      });
    }
    fetchSans();
  }, []);
  return (
    <div className="m-10 mt-[50px] ">
      <a href="/all" className="text-lg flex items-center">
        Tất cả sân
        <svg
          width="10"
          height="10"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.0001 1L5.6001 2.5L13.0001 10L5.6001 17.5L7.0001 19L16.0001 10L7.0001 1Z"
            fill="black"
          />
        </svg>
        <svg
          width="10"
          height="10"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.0001 1L5.6001 2.5L13.0001 10L5.6001 17.5L7.0001 19L16.0001 10L7.0001 1Z"
            fill="black"
          />
        </svg>
      </a>
      <div className="grid grid-cols-4 gap-3 w-[100%] mt-10 ">
        {dataSource?.map((item, index) => (
          <ItemAll
            key={index}
            slug={item?.slug}
            img={item?.image}
            // title={item?.title}
            name={item?.name}
            price={item?.price}
            location={item?.address}
            // link={item?.link}
          ></ItemAll>
        ))}
      </div>
      <div className="flex w-full items-center justify-center mt-10">
        <button className="border border-green-300 bg-green-400 hover:bg-green-300 px-2 py-1 rounded-lg text-white">
          Xem thêm
        </button>
      </div>
    </div>
  );
};

function ItemAll({ img, name, price, slug }) {
  return (
    <div className="flex flex-col border-gray-300 border p-1 w-[100%] h-[330px] rounded-lg shadow-lg">
      <div className="object-cover h-full ">
        <img
          src={img}
          alt=""
          className="w-[100%] h-[220px] boder rounded-md opacity-90 "
        />
      </div>
      <div className="  flex flex-col items-start justify-center w-full h-full">
        <h3 className="flex  items-start justify-start text-start  text-green-500 text-lg">
          {name}
        </h3>
        <h4 className="flex  items-start justify-start text-start  text-green-500 text-md">
          Giá: {price} VNĐ
        </h4>
        <NavLink to={`/chi-tiet/${slug}`}>
          <button className="border bg-green-400 rounded-xl px-2 py-1 text-white hover:bg-yellow-400 hover:border-transparent">
            Chi tiết
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default AllPitch;
