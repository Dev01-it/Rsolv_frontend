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
