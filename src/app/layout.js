import '../app/css/main.css'
import '../app/css/animations.css'
import '../app/css/responcive.css'
import Header from "./components/header";
import Footer from './components/footer';

export const metadata = {
  title: "HPLC Columns - RSolv Life Sciences",
  description: "Discover high-performance HPLC columns by RSolv Life Sciences. Engineered for precision and reliability, our columns support advanced chromatography across industries.",
  keywords:["HPLC column supplier", "HPLC columns", "HPLC", "HPLC Columns in Hyderabad"],
  alternates: {
        canonical: "https://www.rsolv-lifesciences.com",
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/media/icons/Fav Icon.png"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      </head>
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
