export default function Banner({ img, children, text_align }) {
  return (
    <div
      className={`banner ${text_align}`} 
      style={{ backgroundImage: `url(${img})` }}
    >
      {children}
    </div>
  );
}

export function Product_banner({img,children}){
  return(
    <div
      className={'banner'}
      style={{backgroundImage:`url(${img})`,height:'40vh'}}
    >
      {children}
    </div>
  )
}