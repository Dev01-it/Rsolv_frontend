import Link from "next/link";
import Banner from "./components/banner";
import './css/animations.css'

export default function Home() {
  return (
    <>
      <Banner
      img={'/media/banners/home_banner.webp'}
      >
        <h1 className="fade_in">High-Quality Chromatography Products</h1>
        <p className="banner_para fade_in">
          RSolv offers a comprehensive range of chromatography consumables built for precision, performance, and reliability. Our HPLC and GC columns are engineered to deliver accurate, consistent, and reproducible results across a wide variety of analytical applications, making them the trusted choice for laboratories that demand quality and efficiency.
        </p>
      </Banner>
      <h1 className="sub_title">What we offer</h1>
      <div className="sky_blue_bg pd_tb_50">
        <div className="flex_card we_offer_main_card ">
          {
            What_we_offer_data.map((item,index)=>(
              <What_we_offer
                key={index}
                {...item}
              />
            ))
          }
          <button className="btn_1">EXPLORE PRODUCTS</button>
        </div>
      </div>
      <div className="q_i_bg">
          <div className="q_i_card">
            <h2>Quality & Innovation</h2>
            <h2>Unmatched Precision with RSolv Chromatography Products</h2>
            <p style={{textAlign:"justify"}}>RSolv columns are designed for excellence in chromatographic performance, and manufactured with state-of-the-art technology. These columns offer unparalleled separation efficiency and resolution, ensuring consistent, reproducible results</p>
          </div>
      </div>
    </>
  );
}

const What_we_offer_data=[
  {
    "img":"/media/icons/offer_icon_1.png",
    "title":"Chromatography Columns",
    "desc":"Complete range of HPLC, GC, Biomolecular & Chiral Columns for diverse analytical separations"
  },
  {
    "img":"/media/icons/offer_icon_2.png",
    "title":"Lab Consumables",
    "desc":"Wide range of Lab Consumables including Vials, Syringe Filters, Safety Caps, Glassware & more"
  },
  {
    "img":"/media/icons/offer_icon_3.png",
    "title":"Lab Instruments",
    "desc":"Advanced Lab Instruments — HPLC Washing Pump, Solvent Waste System, Lab Water System & Column Storage System"
  },
  
]



export function What_we_offer({img,title,desc}){
  return(
    <>
      <div className="what_we_offer_card">
        <div className="img_bg">
          <img src={img} alt={title}/>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </>
  )
}