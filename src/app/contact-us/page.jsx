import Title_bar from "../components/title_bar"
import ContactForm from "../components/contact_us_form"

export const metadata = {
    title: "HPLC Columns - RSolv Life Sciences",
    description: "Explore RSolv Life Sciences' high-performance HPLC columns, designed for precision and reliability to enhance advanced chromatography across various industries.",
    keywords: ["HPLC column supplier", "HPLC columns", "HPLC","HPLC Columns in Hyderabad"],
    alternates: {
        canonical: "https://www.rsolv-lifesciences.com/contact-us"
    },
};


export default function ContactUs(){
    return(
        <>
            <Title_bar
                title={'Contact Us'}
            />
            {/* --------------------------------- form screen --------------------------------- */}
            <div className="screen">
                <div style={{display:'flex',flexDirection:"column",justifyContent:"space-evenly",height:400}}>
                    <span>
                        <h2 className="blue_txt">
                            <span><i className="bi bi-geo-alt-fill"></i></span>
                            Address
                        </h2>
                        <p>North Carolina, USA</p>
                    </span>
                    <span>
                        <h2 className="blue_txt">
                            <i className="bi bi-envelope-fill"></i>
                            Email
                        </h2>
                        <p>info@rsolv-lifesciences.com</p>
                    </span>
                    <span>
                        <h2 className="blue_txt">
                            <span><i className="bi bi-clock-fill"></i></span>
                            Working Hours
                        </h2>
                        <p>Mon - Fri 9:30 AM - 6:30 PM</p>
                    </span>

                </div>
                {/* --------------- contact form ---------------*/}
                <ContactForm />
            </div>
        </>
    )
}