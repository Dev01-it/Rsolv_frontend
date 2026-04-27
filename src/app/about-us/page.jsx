import Link from "next/link"
import Banner from "../components/banners";
/* -------------------------------------------- meta data for this page ---------------------------------------- */

export const metadata = {
    title: "HPLC Columns by RSolv Life Sciences | High-Performance Chromatography Solutions",
    description: "RSolv is a trusted partner for innovation and quality. Our State-Of-The-Art HPLC Columns are designed with precision and built to meet highest industry standards.",
    keywords: ["HPLC column supplier", "HPLC columns", "HPLC","HPLC Columns in Hyderabad"],
    alternates: {
        canonical: "https://www.rsolv-lifesciences.com/about-us",
    },
};


/* -------------------------------------------- main page   ---------------------------------------- */

export default function About_us(){
    return(
        <>
            <Banner
             img={'/media/banners/about_us_banner.webp'}
             text_align="right"
            >
                <h1 className="fade_in">Why Choose RSolv</h1>
                <p className="banner_para fade_in">
                    RSolv is a trusted partner for innovation and quality.
                    Our State-Of-The-Art HPLC Columns are designed with precision and built to meet highest industry standards. Each RSolv HPLC Column undergoes stringent quality control checks to
                    guarantee reproducibility over the column’s lifetime.
                </p>
                <p className="banner_para fade_in">
                    We don’t just offer products, we provide solutions. With method development support and access to our expert technical team, you can choose RSolv HPLC Columns for
                    unparalleled quality and reliability
                </p>
            </Banner>
            <h2 className="text_c title_text">RSolv : Excellence,Precision & Reliability</h2>
            <p className="text_c w_80 line_height margin_bottom_20">RSolv HPLC & GC Columns are designed to ensure accurate and reproducible results in every application. Our columns cater to diverse analytical needs, providing exceptional separation and resolution capabilities to enhance the efficiency and effectiveness of the research and development process</p>
            <div className="sky_blue_bg flex_card pd_all_20">
                {
                    motive_card_data.map((item,index)=>(
                        <MotiveCard
                        key={index}
                        {...item}
                        />
                    ))
                }
            </div>
            <div className="mv_bg">
                <div className="mv_card">
                    <h2 >Mission</h2>
                    <p className="line_height">
                        Our mission is to deliver high-quality products and exceptional support, driving innovation in research and development. We empower partners with reliable solutions, setting new standards in quality and fostering scientific advancement.
                    </p>
                </div>
                <div className="mv_card">
                    <h2 >Vision</h2>
                    <p className="line_height">
                        Our vision is to set new standards in quality, customer service, and operational excellence, empowering our clients to achieve transformative breakthroughs. We aspire to be the trusted partner driving innovation and success, shaping a future where scientific progress and excellence redefine possibilities.
                    </p>
                </div>
            </div>
        </>
    )
}





const motive_card_data=[
    {
        "img":"/media/icons/consistency.webp",
        "title":"Consistency",
        "desc":"RSolv HPLC & GC Columns deliver consistent performance across batches, ensuring reliable and reproducible data every time"
    },
    {
        "img":"/media/icons/longevity.webp",
        "title":"Longevity",
        "desc":"RSolv HPLC & GC Columns are engineered for durability, ensuring exceptional performance even under rigorous usage"
    },
    {
        "img":"/media/icons/shield.webp",
        "title":"Reliability",
        "desc":"RSolv HPLC & GC Columns are crafted in a state-of-the-art facility, ensuring exceptional performance and reliability for every application"
    },
    {
        "img":"/media/icons/support.webp",
        "title":"Accountability",
        "desc":"We ensure top-quality materials and provide complete onboarding, troubleshooting, and ongoing support for optimal performance and customer satisfaction"
    },
]


export function MotiveCard({img,title,desc}){
  return(
    <>
      <div className="mot_crd">
        <div className="">
          <img src={img} alt={title} className="mot_crd_img"/>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </>
  )
}