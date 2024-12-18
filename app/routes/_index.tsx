import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Carousel } from "../components/Carousel";
import { prisma } from "../utils/db.server";

type Product = {
  type: string;
  item: {
    id: string;
    name: string;
    price: number;
    img: string;
  }[];
};

export const loader: LoaderFunction = async () => {
  const types = ["REM_VAI", "REM_CAU_VONG", "REM_GO", "REM_CUON", "REM_LA_LAT"];

  const products = await Promise.all(
    types.map(async (type) => {
      const items = await prisma.product.findMany({
        where: { type },
        take: 20,
      });

      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      return { type, item: items };
    })
  );

  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default function Index() {
  const data: Product[] = useLoaderData();
  const [pdType, setPdType] = useState("REM_VAI");

  const img = [
    "/app/IMG/RTK_00.png",
    "/app/IMG/RTK_00.png",
    "/app/IMG/RTK_00.png",
    "/app/IMG/RTK_00.png",
    "/app/IMG/RTK_00.png",
  ];

  const MenuSP = [
    { sp: "Rèm Vải", type: "REM_VAI" },
    { sp: "Rèm Cầu Vồng", type: "REM_CAU_VONG" },
    { sp: "Rèm Gỗ", type: "REM_GO" },
    { sp: "Rèm Cuốn", type: "REM_CUON" },
    { sp: "Rèm Lá Lật", type: "REM_LA_LAT" },
  ];

  const ct = [
    {
      icon: "fa-light fa-phone",
      link: "tel:+86822594131",
      text: "0822594131",
    },
    {
      icon: "fa-light fa-envelope",
      link: "mailto:ht26091979@gmail.com",
      text: "ht26091979@gmail.com",
    },
    {
      icon: "fa-light fa-location-dot",
      link: "https://maps.app.goo.gl/A7TdvgX8upqxfVJt8",
      text: "66E Ngõ 180 Nam Dư, Lĩnh Nam, Hoàng Mai, Hà Nội",
    },
    {
      icon: "fa-brands fa-square-facebook",
      link: "https://www.facebook.com",
      text: "Rèm Tuấn Kiệt",
    },
    {
      icon: "fa-solid fa-square-z",
      link: "https://chat.zalo.me/",
      text: "Trần Hưởng",
    },
  ];

  const subMenuSP = data.find((pd) => pd.type === pdType)?.item || [];

  return (
    <main className="min-h-screen">
      <Carousel img={img} />
      <div className="w-4/5 border-b-2 border-teal-500 py-10 m-auto">
        <div className="text-4xl before:content-[''] before:grow before:border-b-2 before:border-teal-500 after:content-[''] after:grow after:border-b-2 after:border-teal-500 flex justify-center items-center">
          MENU
        </div>
        <div className="text-white bg-[rgba(0,0,0,0.8)] border-t-2 border-teal-500 flex">
          {MenuSP.map((sp) => (
            <button
              key={sp.type}
              className={`w-1/5 flex justify-center items-center p-4 ${sp.type === pdType
                ? "text-teal-300 border-b-2 border-teal-500"
                : "anmt hover:text-teal-300"
                }`}
              onClick={() => setPdType(sp.type)}
            >
              {sp.sp}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4 pt-4 overflow-auto">
          {subMenuSP.map((pd) => (
            <Link
              to={`/sp/${pd.id}`}
              key={pd.id}
              className="h-[20vw] border-2 border-teal-500 rounded"
            >
              <div className="w-full h-2/3 border-b-2 border-teal-500">
                <img
                  src={pd.img}
                  alt={pd.id}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="h-1/3 text-white bg-[rgba(0,0,0,0.8)] p-2">
                <div className="h-1/4 text-pink-200">Mã: {pd.id}</div>
                <div className="h-1/2 text-xl truncate">{pd.name}</div>
                <div className="h-1/4 text-green-200 text-lg float-right">
                  {Intl.NumberFormat("vi-VN").format(pd.price)} VND
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <img src="/app/IMG/RTK.png" alt="RTK" className="w-1/12 py-10 m-auto" />
      <div className="w-4/5 border-t-2 border-teal-500 py-10 m-auto flex">
        <p className="w-1/2 border-r border-teal-500 text-lg px-4">
          Rèm Tuấn Kiệt là cửa hàng chuyên cung cấp và thi công rèm cửa chuyên
          nghiệp. Chúng tôi mang đến nhiều mẫu mã và kiểu dáng đa dạng giúp
          khách hàng dễ dàng lựa chọn sản phẩm phù hợp với không gian của mình.
          Đội ngũ nhân viên tận tình và chu đáo luôn sẵn sàng tư vấn và hỗ trợ
          bạn trong quá trình chọn rèm. Rèm Tuấn Kiệt cam kết cung cấp sản phẩm
          chất lượng và dịch vụ tốt nhất.
        </p>
        <div className="w-1/2 border-l border-teal-500 px-4">
          {ct.map((ct, index) => (
            <div key={index} className="flex items-center py-1">
              <i className={`${ct.icon} mx-2 text-xl`}></i>
              <Link to={ct.link} className="text-xl">
                {ct.text}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}